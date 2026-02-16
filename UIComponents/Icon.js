import { UIComponent } from './UIComponent.js';

export class Icon extends UIComponent {
  /**
   * Creates an image/icon component with efficient cached rendering.
   *
   * The image is drawn to an off-screen p5.Graphics buffer and only
   * re-rendered when the source, size, tint, or fit mode changes.
   * On every `show()` call, only the cached buffer is blitted to
   * the canvas – making repeated frames essentially free.
   *
   * @param {number} x - The x-coordinate
   * @param {number} y - The y-coordinate
   * @param {number} width - The width
   * @param {number} height - The height
   * @param {p5.Image|p5.Graphics} img - The image to display (loaded via loadImage or createGraphics)
   * @param {Object} options - Configuration options
   * @param {string|null} options.id - Component ID
   * @param {Component|null} options.parent - Parent component
   * @param {p5.Color} options.backgroundColor - Background color (null = transparent)
   * @param {boolean} options.borderFlag - Whether to show border
   * @param {p5.Color} options.borderColor - Border color
   * @param {number} options.borderWidth - Border width
   * @param {number} options.cornerRadius - Corner radius for rounded corners
   * @param {boolean} options.enableShadow - Enable shadow rendering
   * @param {string} options.shadowColor - Shadow color (CSS color string)
   * @param {number} options.shadowBlur - Shadow blur radius
   * @param {number} options.shadowOffsetX - Shadow offset on X axis
   * @param {number} options.shadowOffsetY - Shadow offset on Y axis
   * @param {string} options.fitMode - How the image fits inside the component:
   *   "contain" – scale to fit entirely, preserving aspect ratio (default)
   *   "cover"   – scale to cover the area, cropping overflow
   *   "fill"    – stretch to fill (ignores aspect ratio)
   *   "none"    – render at original size, centered
   * @param {p5.Color|null} options.tintColor - Optional tint applied to the image
   * @param {number} options.opacity - Image opacity 0-255 (default 255)
   * @param {number} options.margin - General margin for all sides
   * @param {number} options.marginx - Horizontal margin
   * @param {number} options.marginy - Vertical margin
   * @param {number} options.marginl - Left margin
   * @param {number} options.marginr - Right margin
   * @param {number} options.margint - Top margin
   * @param {number} options.marginb - Bottom margin
   */
  constructor(x, y, width, height, img, {
    id = null,
    parent = null,
    backgroundColor = null,
    borderFlag = false,
    borderColor = null,
    borderWidth = 1,
    cornerRadius = 0,
    enableShadow = false,
    shadowColor = 'rgba(0,0,0,0.5)',
    shadowBlur = 12,
    shadowOffsetX = 0,
    shadowOffsetY = 4,
    fitMode = 'contain',
    tintColor = null,
    opacity = 255,
    margin = 0,
    marginx = null,
    marginy = null,
    marginl = null,
    marginr = null,
    margint = null,
    marginb = null,
    minWidth = 0,
    minHeight = 0,
    showDebugOverlay = false,
  } = {}) {
    super(
      x, y, width, height,
      backgroundColor ?? color(0, 0, 0, 0),
      borderFlag,
      borderColor ?? color('#3a3a4d'),
      borderWidth,
      cornerRadius,
      enableShadow,
      shadowColor,
      shadowBlur,
      shadowOffsetX,
      shadowOffsetY,
      {
        parent,
        type: 'Icon',
        id,
        margin,
        marginx,
        marginy,
        marginl,
        marginr,
        margint,
        marginb,
        minWidth,
        minHeight,
        showDebugOverlay,
      }
    );

    /** @type {p5.Image|p5.Graphics} The source image */
    this.img = img;

    /** @type {string} Fit mode: "contain" | "cover" | "fill" | "none" */
    this.fitMode = fitMode;

    /** @type {p5.Color|null} Optional tint color */
    this.tintColor = tintColor;

    /** @type {number} Opacity 0-255 */
    this.opacity = opacity;

    // ---- Cached off-screen buffer ----
    /** @private */
    this._cache = null;
    /** @private – tracks parameters that were used to build the cache */
    this._cacheKey = null;
  }

  // ---------------------------------------------------------------------------
  // Public setters – each one invalidates the cache so the next show()
  // re-renders automatically.
  // ---------------------------------------------------------------------------

  /**
   * Replace the displayed image
   * @param {p5.Image|p5.Graphics} img
   */
  setImage(img) {
    this.img = img;
    this._invalidateCache();
  }

  /**
   * Change the fit mode
   * @param {"contain"|"cover"|"fill"|"none"} mode
   */
  setFitMode(mode) {
    this.fitMode = mode;
    this._invalidateCache();
  }

  /**
   * Change the tint color
   * @param {p5.Color|null} c
   */
  setTintColor(c) {
    this.tintColor = c;
    this._invalidateCache();
  }

  /**
   * Change opacity (0-255)
   * @param {number} o
   */
  setOpacity(o) {
    this.opacity = o;
    this._invalidateCache();
  }

  // ---------------------------------------------------------------------------
  // Inherited stubs
  // ---------------------------------------------------------------------------
  updateWidth() {}
  updateHeight() {}

  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------

  /**
   * Renders the icon/image component.
   *
   * On each call only the pre-rendered buffer is drawn to the main canvas.
   * The buffer is rebuilt only when the image, size, tint, fit mode, or
   * opacity changes.
   */
  show() {
    if (!this.img) return;

    // Shadow (drawn directly – it's cheap)
    if (this.enableShadow) {
      this.drawShadow();
    }

    // Rebuild cache when stale
    const key = this._buildCacheKey();
    if (this._cacheKey !== key) {
      this._rebuildCache();
      this._cacheKey = key;
    }

    // Blit cached buffer
    push();
    imageMode(CORNER);
    image(this._cache, this.x, this.y);
    pop();
  }

  // ---------------------------------------------------------------------------
  // Cache helpers (private)
  // ---------------------------------------------------------------------------

  /**
   * Computes a lightweight string key that captures every parameter
   * influencing the cached render.  Comparing this string tells us
   * whether the cache is still valid.
   * @private
   * @returns {string}
   */
  _buildCacheKey() {
    // For image identity we use a combination of dimensions + a frame-stable id.
    // p5.Image objects don't carry a unique id, but we can use width×height
    // plus the object reference (via a WeakRef-free approach: just store the
    // reference and compare in _invalidateCache).
    const imgId = this.img ? `${this.img.width}x${this.img.height}` : 'null';
    return [
      imgId,
      this.width,
      this.height,
      this.fitMode,
      this.tintColor ? this.tintColor.toString() : 'none',
      this.opacity,
      this.cornerRadius,
      this.backgroundColor ? this.backgroundColor.toString() : 'none',
      this.borderFlag,
      this.borderColor ? this.borderColor.toString() : 'none',
      this.borderWidth,
    ].join('|');
  }

  /**
   * Forces the cache to be rebuilt on the next show().
   * @private
   */
  _invalidateCache() {
    this._cacheKey = null;
  }

  /**
   * Builds (or rebuilds) the off-screen p5.Graphics buffer.
   * @private
   */
  _rebuildCache() {
    const w = Math.ceil(this.width);
    const h = Math.ceil(this.height);
    if (w <= 0 || h <= 0) return;

    // Reuse or create buffer
    if (!this._cache || this._cache.width !== w || this._cache.height !== h) {
      if (this._cache) this._cache.remove(); // free previous buffer
      this._cache = createGraphics(w, h);
    } else {
      this._cache.clear();
    }

    const pg = this._cache;

    // Background
    if (this.backgroundColor) {
      pg.noStroke();
      pg.fill(this.backgroundColor);
      pg.rect(0, 0, w, h, this.cornerRadius);
    }

    // Clip to rounded rect (if cornerRadius > 0)
    if (this.cornerRadius > 0) {
      pg.drawingContext.save();
      this._clipRoundedRect(pg.drawingContext, 0, 0, w, h, this.cornerRadius);
      pg.drawingContext.clip();
    }

    // Compute destination rect based on fitMode
    const { dx, dy, dw, dh, sx, sy, sw, sh } = this._computeFit(w, h);

    // Tint + opacity
    if (this.tintColor) {
      pg.tint(this.tintColor, this.opacity);
    } else if (this.opacity < 255) {
      pg.tint(255, this.opacity);
    }

    pg.imageMode(CORNER);
    // Use the 9-argument form to support cover-mode cropping
    pg.image(this.img, dx, dy, dw, dh, sx, sy, sw, sh);

    // Remove tint
    pg.noTint();

    // Restore clip
    if (this.cornerRadius > 0) {
      pg.drawingContext.restore();
    }

    // Border
    if (this.borderFlag) {
      pg.noFill();
      pg.stroke(this.borderColor);
      pg.strokeWeight(this.borderWidth);
      pg.rect(0, 0, w, h, this.cornerRadius);
    }
  }

  /**
   * Traces a rounded-rectangle path on a Canvas2D context.
   * @private
   */
  _clipRoundedRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  /**
   * Computes source and destination rects based on the current fitMode.
   * @private
   * @param {number} cw - Container width
   * @param {number} ch - Container height
   * @returns {{dx:number, dy:number, dw:number, dh:number, sx:number, sy:number, sw:number, sh:number}}
   */
  _computeFit(cw, ch) {
    const iw = this.img.width;
    const ih = this.img.height;

    switch (this.fitMode) {
      case 'fill':
        return { dx: 0, dy: 0, dw: cw, dh: ch, sx: 0, sy: 0, sw: iw, sh: ih };

      case 'contain': {
        const scale = Math.min(cw / iw, ch / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        return {
          dx: (cw - dw) / 2,
          dy: (ch - dh) / 2,
          dw, dh,
          sx: 0, sy: 0, sw: iw, sh: ih,
        };
      }

      case 'cover': {
        const scale = Math.max(cw / iw, ch / ih);
        const sw = cw / scale;
        const sh = ch / scale;
        return {
          dx: 0, dy: 0, dw: cw, dh: ch,
          sx: (iw - sw) / 2,
          sy: (ih - sh) / 2,
          sw, sh,
        };
      }

      case 'none':
      default: {
        // Centered at original size
        return {
          dx: (cw - iw) / 2,
          dy: (ch - ih) / 2,
          dw: iw, dh: ih,
          sx: 0, sy: 0, sw: iw, sh: ih,
        };
      }
    }
  }
}
