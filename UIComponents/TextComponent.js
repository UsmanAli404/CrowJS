import { UIComponent } from './UIComponent.js';
import { Component } from '../Core/Component.js';

export class TextComponent extends UIComponent {
  /**
   * Creates a UI component with shared text behavior
   * @param {number} x - The x-coordinate
   * @param {number} y - The y-coordinate
   * @param {number} width - The width
   * @param {number} height - The height
   * @param {string} label - The text to display
   * @param {Object} options - Configuration options
   * @param {string|null} options.id - Component ID
   * @param {Component|null} options.parent - Parent component
   * @param {p5.Color} options.backgroundColor - Background color
   * @param {p5.Color} options.textColor - Text color
   * @param {boolean} options.borderFlag - Whether to show border
   * @param {p5.Color} options.borderColor - Border color
   * @param {number} options.borderWidth - Border width
   * @param {number} options.cornerRadius - Corner radius
   * @param {boolean} options.enableShadow - Enable shadow rendering
   * @param {string} options.shadowColor - Shadow color (CSS color string)
   * @param {number} options.shadowBlur - Shadow blur radius
   * @param {number} options.shadowOffsetX - Shadow offset on X axis
   * @param {number} options.shadowOffsetY - Shadow offset on Y axis
   * @param {string} options.HTextAlign - Horizontal text alignment
   * @param {string} options.VTextAlign - Vertical text alignment
   * @param {number} options.pad - General padding
   * @param {number} options.padx - Horizontal padding
   * @param {number} options.pady - Vertical padding
   * @param {number} options.padl - Left padding
   * @param {number} options.padr - Right padding
   * @param {number} options.padt - Top padding
   * @param {number} options.padb - Bottom padding
    * @param {boolean} options.wrap - Whether to wrap text
    * @param {string} options.wrapMode - Wrap mode: "word" or "char"
    * @param {string} options.noWrapMode - No-wrap mode: "ellipsis" or "font-size"
    * @param {string} options.ellipsisMode - Ellipsis mode: "leading", "center", or "trailing"
   * @param {p5.Image|null} options.icon - Icon image to display alongside text (null = no icon)
   * @param {number} options.iconSize - Icon display size in pixels (default 20)
   * @param {string} options.iconPosition - Icon placement: "left", "right", "top", or "bottom"
   * @param {number} options.iconGap - Gap in pixels between icon and text (default 6)
   * @param {p5.Color|null} options.iconTintColor - Optional tint color for the icon
   * @param {number} options.iconOpacity - Icon opacity 0-255 (default 255)
   * @param {number} options.margin - General margin for all sides
   * @param {number} options.marginx - Horizontal margin (left and right)
   * @param {number} options.marginy - Vertical margin (top and bottom)
   * @param {number} options.marginl - Left margin
   * @param {number} options.marginr - Right margin
   * @param {number} options.margint - Top margin
   * @param {number} options.marginb - Bottom margin
   * @param {string} options.type - Component type
   */
  constructor(x, y, width, height, label, {
    id = null,
    parent = null,
    backgroundColor = color('#1e1e2e'),
    textColor = color('#e0e0e0'),
    borderFlag = true,
    borderColor = color('#3a3a4d'),
    borderWidth = 1,
    cornerRadius = 8,
    enableShadow = false,
    shadowColor = 'rgba(0,0,0,0.5)',
    shadowBlur = 12,
    shadowOffsetX = 0,
    shadowOffsetY = 4,
    HTextAlign = 'center',
    VTextAlign = 'center',
    pad = 5,
    padx = null,
    pady = null,
    padl = null,
    padr = null,
    padt = null,
    padb = null,
    wrap = false,
    wrapMode = 'word',
    noWrapMode = 'font-size',
    ellipsisMode = 'trailing',
    icon = null,
    iconSize = 20,
    iconPosition = 'left',
    iconGap = 8,
    iconTintColor = null,
    iconOpacity = 255,
    margin = 0,
    marginx = null,
    marginy = null,
    marginl = null,
    marginr = null,
    margint = null,
    marginb = null,
    type = 'UIComponent',
    minWidth = 0,
    minHeight = 0,
    showDebugOverlay = false,
  } = {}) {
    super(x, y, width, height, backgroundColor, borderFlag, borderColor,
      borderWidth, cornerRadius, enableShadow, shadowColor, shadowBlur,
      shadowOffsetX, shadowOffsetY, { parent: parent, type: type, id: id, margin: margin, marginx: marginx, marginy: marginy, marginl: marginl, marginr: marginr, margint: margint, marginb: marginb, minWidth: minWidth, minHeight: minHeight, showDebugOverlay: showDebugOverlay });

    this.text = label;
    this.labelSize = 20;
    this.textColor = textColor;

    this.HTextAlign = HTextAlign;
    this.VTextAlign = VTextAlign;

    const resolvedPadx = (padx ?? pad ?? 0);
    const resolvedPady = (pady ?? pad ?? 0);
    this.pad = pad;
    this.padx = resolvedPadx;
    this.pady = resolvedPady;
    this.padl = padl ?? resolvedPadx;
    this.padr = padr ?? resolvedPadx;
    this.padt = padt ?? resolvedPady;
    this.padb = padb ?? resolvedPady;

    this.wrap = wrap;
    this.wrapMode = wrapMode;
    this.noWrapMode = noWrapMode;
    this.ellipsisMode = ellipsisMode;

    this.icon = icon;
    this.iconSize = iconSize;
    this.iconPosition = iconPosition;
    this.iconGap = iconGap;
    this.iconTintColor = iconTintColor;
    this.iconOpacity = iconOpacity;

    if (!this.wrap && this.noWrapMode === 'font-size') {
      this.updateLabelSize();
    }
  }

  /**
   * Converts horizontal alignment string to P5 constant
   * @returns {number} P5 alignment constant
   */
  getHTextAlign() {
    switch (this.HTextAlign) {
      case 'left':
        return LEFT;
      case 'right':
        return RIGHT;
      default:
        return CENTER;
    }
  }

  /**
   * Converts vertical alignment string to P5 constant
   * @returns {number} P5 alignment constant
   */
  getVTextAlign() {
    switch (this.VTextAlign) {
      case 'top':
        return TOP;
      case 'bottom':
        return BOTTOM;
      default:
        return CENTER;
    }
  }

  /**
   * Updates the text and recalculates size
   * @param {string} text - The new text to display
   */
  setText(text) {
    this.text = text;
    if (!this.wrap && this.noWrapMode === 'font-size') {
      this.updateLabelSize();
    }
  }

  /**
   * Dynamically calculates the optimal text size to fit the container.
   * Strictly fits text within the padded content area.
   * Supports multi-line text (newline characters are respected).
   */
  updateLabelSize() {
    const saved = this._applyIconPadding();
    const maxLabelWidth = this.getContentWidth();
    const maxLabelHeight = this.getContentHeight();

    if (maxLabelWidth <= 0 || maxLabelHeight <= 0) {
      this.labelSize = 1;
      return;
    }

    const lines = (this.text ?? '').split('\n');
    const lineCount = Math.max(1, lines.length);

    let low = 1;
    let high = Math.floor(maxLabelHeight);
    let bestSize = 1;

    while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      textSize(mid);
      let lineHeight = textAscent() + textDescent();
      let totalHeight = lineHeight * lineCount;

      let maxLineWidth = 0;
      for (let i = 0; i < lines.length; i++) {
        let w = textWidth(lines[i]);
        if (w > maxLineWidth) maxLineWidth = w;
      }

      if (maxLineWidth <= maxLabelWidth && totalHeight <= maxLabelHeight) {
        bestSize = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    // Final verification: ensure the chosen size truly fits
    textSize(bestSize);
    let lineHeight = textAscent() + textDescent();
    let maxLineWidth = 0;
    for (let i = 0; i < lines.length; i++) {
      let w = textWidth(lines[i]);
      if (w > maxLineWidth) maxLineWidth = w;
    }
    if (maxLineWidth > maxLabelWidth || lineHeight * lineCount > maxLabelHeight) {
      bestSize = max(1, bestSize - 1);
    }

    this.labelSize = bestSize;
    this._restorePadding(saved);
  }

  /**
   * Handles width changes and updates text size accordingly
   */
  updateWidth() {
    if (!this.wrap && this.noWrapMode === 'font-size') {
      this.updateLabelSize();
    }
  }

  /**
   * Handles height changes and updates text size accordingly
   */
  updateHeight() {
    if (!this.wrap && this.noWrapMode === 'font-size') {
      this.updateLabelSize();
    }
  }

  /**
   * Updates whether text wraps
   * @param {boolean} wrap - True to enable wrapping
   */
  setWrap(wrap) {
    this.wrap = wrap;
    if (!this.wrap && this.noWrapMode === 'font-size') {
      this.updateLabelSize();
    }
  }

  /**
   * Updates wrap mode
   * @param {string} wrapMode - "word" or "char"
   */
  setWrapMode(wrapMode) {
    this.wrapMode = wrapMode;
  }

  /**
   * Updates no-wrap mode
   * @param {string} noWrapMode - "ellipsis" or "font-size"
   */
  setNoWrapMode(noWrapMode) {
    this.noWrapMode = noWrapMode;
    if (!this.wrap && this.noWrapMode === 'font-size') {
      this.updateLabelSize();
    }
  }

  /**
   * Updates ellipsis mode
   * @param {string} ellipsisMode - "leading", "center", or "trailing"
   */
  setEllipsisMode(ellipsisMode) {
    this.ellipsisMode = ellipsisMode;
  }

  // ---------------------------------------------------------------------------
  // Icon methods
  // ---------------------------------------------------------------------------

  /**
   * Sets the icon image
   * @param {p5.Image|null} img - Icon image (null to remove)
   */
  setIcon(img) {
    this.icon = img;
    if (!this.wrap && this.noWrapMode === 'font-size') {
      this.updateLabelSize();
    }
  }

  /**
   * Sets the icon display size
   * @param {number} size - Size in pixels
   */
  setIconSize(size) {
    this.iconSize = size;
    if (!this.wrap && this.noWrapMode === 'font-size') {
      this.updateLabelSize();
    }
  }

  /**
   * Sets the icon position relative to text
   * @param {"left"|"right"|"top"|"bottom"} position
   */
  setIconPosition(position) {
    this.iconPosition = position;
    if (!this.wrap && this.noWrapMode === 'font-size') {
      this.updateLabelSize();
    }
  }

  /**
   * Sets the gap between icon and text
   * @param {number} gap - Gap in pixels
   */
  setIconGap(gap) {
    this.iconGap = gap;
    if (!this.wrap && this.noWrapMode === 'font-size') {
      this.updateLabelSize();
    }
  }

  /**
   * Sets the icon tint color
   * @param {p5.Color|null} c
   */
  setIconTintColor(c) {
    this.iconTintColor = c;
  }

  /**
   * Sets the icon opacity
   * @param {number} o - Opacity 0-255
   */
  setIconOpacity(o) {
    this.iconOpacity = o;
  }

  /**
   * Computes the effective icon size, growing to fill cross-axis space when
   * the component is larger than the configured iconSize.
   * @private
   * @returns {number} The size (in pixels) to draw the icon at
   */
  _getEffectiveIconSize() {
    if (!this.icon) return this.iconSize;

    const gap = this.iconGap;

    if (this.iconPosition === 'left' || this.iconPosition === 'right') {
      // Cross-axis is height; main-axis is width
      const crossSize = Math.max(0, this.height - this.padt - this.padb);
      const mainAxisBudget = Math.max(0, this.width - this.padl - this.padr - gap);
      return Math.max(this.iconSize, Math.min(crossSize, mainAxisBudget));
    } else {
      // Cross-axis is width; main-axis is height
      const crossSize = Math.max(0, this.width - this.padl - this.padr);
      const mainAxisBudget = Math.max(0, this.height - this.padt - this.padb - gap);
      return Math.max(this.iconSize, Math.min(crossSize, mainAxisBudget));
    }
  }

  /**
   * Temporarily adjusts padding to reserve space for the icon.
   * @private
   * @returns {{padl:number, padr:number, padt:number, padb:number}} saved values
   */
  _applyIconPadding() {
    const saved = { padl: this.padl, padr: this.padr, padt: this.padt, padb: this.padb };
    if (!this.icon) return saved;

    const hasText = this.text != null && this.text !== '';
    const gap = hasText ? this.iconGap : 0;
    const effectiveSize = this._getEffectiveIconSize();

    switch (this.iconPosition) {
      case 'right':  this.padr += effectiveSize + gap; break;
      case 'top':    this.padt += effectiveSize + gap; break;
      case 'bottom': this.padb += effectiveSize + gap; break;
      case 'left':
      default:       this.padl += effectiveSize + gap; break;
    }

    return saved;
  }

  /**
   * Restores padding values saved by _applyIconPadding
   * @private
   * @param {{padl:number, padr:number, padt:number, padb:number}} saved
   */
  _restorePadding(saved) {
    this.padl = saved.padl;
    this.padr = saved.padr;
    this.padt = saved.padt;
    this.padb = saved.padb;
  }

  /**
   * Draws the icon centered in the full content area (icon-only mode)
   * @private
   */
  _drawIconCentered() {
    const cw = this.getContentWidth();
    const ch = this.getContentHeight();
    const s = Math.min(cw, ch);
    const ix = this.padl + (cw - s) / 2;
    const iy = this.padt + (ch - s) / 2;
    this._drawIconAt(ix, iy, s, s);
  }

  /**
   * Draws the icon at its designated position beside the text
   * @private
   */
  _drawIconPositioned() {
    const contentW = this.getContentWidth();
    const contentH = this.getContentHeight();
    const s = this._getEffectiveIconSize();
    let ix, iy;

    switch (this.iconPosition) {
      case 'right':
        ix = this.width - this.padr - s;
        iy = this.padt + (contentH - s) / 2;
        break;
      case 'top':
        ix = this.padl + (contentW - s) / 2;
        iy = this.padt;
        break;
      case 'bottom':
        ix = this.padl + (contentW - s) / 2;
        iy = this.height - this.padb - s;
        break;
      case 'left':
      default:
        ix = this.padl;
        iy = this.padt + (contentH - s) / 2;
        break;
    }

    this._drawIconAt(ix, iy, s, s);
  }

  /**
   * Renders the icon image at the specified local coordinates
   * @private
   * @param {number} x - Local x position
   * @param {number} y - Local y position
   * @param {number} w - Draw width
   * @param {number} h - Draw height
   */
  _drawIconAt(x, y, w, h) {
    push();
    if (this.iconTintColor) {
      tint(this.iconTintColor, this.iconOpacity);
    } else if (this.iconOpacity < 255) {
      tint(255, this.iconOpacity);
    }
    imageMode(CORNER);
    image(this.icon, x, y, w, h);
    noTint();
    pop();
  }

  /**
   * Applies text alignment and returns the final position
   * @returns {{x: number, y: number}}
   */
  getTextPosition() {
    textSize(this.labelSize);
    const actualHeight = textAscent() + textDescent();

    let x;
    if (this.HTextAlign === 'left') {
      textAlign(LEFT, CENTER);
      x = this.padl;
    } else if (this.HTextAlign === 'right') {
      textAlign(RIGHT, CENTER);
      x = this.width - this.padr;
    } else {
      textAlign(CENTER, CENTER);
      x = this.padl + this.getContentWidth() / 2;
    }

    let y;
    if (this.VTextAlign === 'top') {
      textAlign(this.getHTextAlign(), TOP);
      y = this.padt;
    } else if (this.VTextAlign === 'bottom') {
      textAlign(this.getHTextAlign(), BOTTOM);
      y = this.height - this.padb;
    } else {
      textAlign(this.getHTextAlign(), CENTER);
      y = this.padt + this.getContentHeight() / 2;
    }

    return { x, y };
  }

  /**
   * Draws text based on wrapping and overflow settings
   */
  renderText() {
    const hasIcon = this.icon != null;
    const hasText = this.text != null && this.text !== '';

    // Icon-only mode: center the icon in the content area
    if (hasIcon && !hasText) {
      this._drawIconCentered();
      return;
    }

    // Apply icon padding adjustment for text rendering
    const saved = hasIcon ? this._applyIconPadding() : null;

    textSize(this.labelSize);

    if (this.wrap) {
      const lines = this.getWrappedLines();
      this.renderWrappedLines(lines);
    } else if (this.noWrapMode === 'font-size') {
      const lines = (this.text ?? '').split('\n');
      if (lines.length > 1) {
        this.renderNoWrapFontSizeLines(lines);
      } else {
        const line = this.getNoWrapLine();
        const { x, y } = this.getTextPosition();
        text(line, x, y);
      }
    } else {
      const line = this.getNoWrapLine();
      const { x, y } = this.getTextPosition();
      text(line, x, y);
    }

    // Restore padding and render icon
    if (saved) {
      this._restorePadding(saved);
      this._drawIconPositioned();
    }
  }

  /**
   * Renders multiple lines for no-wrap font-size mode
   * @param {string[]} lines - The lines to render
   */
  renderNoWrapFontSizeLines(lines) {
    const lineHeight = textAscent() + textDescent();
    const contentHeight = this.getContentHeight();
    const baseX = this.getAlignedTextX();

    let startY;
    if (this.VTextAlign === 'top') {
      startY = this.padt + textAscent();
    } else if (this.VTextAlign === 'bottom') {
      const renderedHeight = lineHeight * lines.length;
      startY = this.height - this.padb - renderedHeight + textAscent();
    } else {
      const renderedHeight = lineHeight * lines.length;
      startY = this.padt + (contentHeight - renderedHeight) / 2 + textAscent();
    }

    for (let i = 0; i < lines.length; i++) {
      const y = startY + i * lineHeight;
      text(lines[i], baseX, y);
    }
  }

  getContentWidth() {
    return max(0, this.width - this.padl - this.padr);
  }

  getContentHeight() {
    return max(0, this.height - this.padt - this.padb);
  }

  getNoWrapLine() {
    const flatText = (this.text ?? '').replace(/\s*\n\s*/g, ' ');
    if (this.noWrapMode !== 'ellipsis') {
      return flatText;
    }

    const maxWidth = this.getContentWidth();
    if (textWidth(flatText) <= maxWidth) {
      return flatText;
    }

    const ellipsis = '...';
    if (textWidth(ellipsis) >= maxWidth) {
      return ellipsis;
    }

    if (this.ellipsisMode === 'leading') {
      return this.getLeadingEllipsis(flatText, maxWidth, ellipsis);
    }

    if (this.ellipsisMode === 'center') {
      return this.getCenterEllipsis(flatText, maxWidth, ellipsis);
    }

    return this.getTrailingEllipsis(flatText, maxWidth, ellipsis);
  }

  getTrailingEllipsis(flatText, maxWidth, ellipsis) {
    let low = 0;
    let high = flatText.length;
    let best = '';

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const candidate = flatText.slice(0, mid) + ellipsis;
      if (textWidth(candidate) <= maxWidth) {
        best = candidate;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return best;
  }

  getLeadingEllipsis(flatText, maxWidth, ellipsis) {
    let low = 0;
    let high = flatText.length;
    let best = '';

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const candidate = ellipsis + flatText.slice(flatText.length - mid);
      if (textWidth(candidate) <= maxWidth) {
        best = candidate;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return best;
  }

  getCenterEllipsis(flatText, maxWidth, ellipsis) {
    let low = 0;
    let high = flatText.length;
    let best = '';

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const headCount = Math.ceil(mid / 2);
      const tailCount = Math.floor(mid / 2);
      const candidate =
        flatText.slice(0, headCount) + ellipsis + flatText.slice(flatText.length - tailCount);

      if (textWidth(candidate) <= maxWidth) {
        best = candidate;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return best;
  }

  getWrappedLines() {
    const maxWidth = this.getContentWidth();
    const textValue = this.text ?? '';
    const paragraphs = textValue.split('\n');
    const lines = [];

    for (let i = 0; i < paragraphs.length; i += 1) {
      const paragraph = paragraphs[i];
      if (paragraph.length === 0) {
        lines.push('');
        continue;
      }

      if (this.wrapMode === 'char') {
        lines.push(...this.wrapByChar(paragraph, maxWidth));
      } else {
        lines.push(...this.wrapByWord(paragraph, maxWidth));
      }
    }

    return lines;
  }

  wrapByWord(textValue, maxWidth) {
    const words = textValue.trim().length ? textValue.split(/\s+/) : [''];
    const lines = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i += 1) {
      const word = words[i];
      if (!currentLine) {
        if (textWidth(word) <= maxWidth) {
          currentLine = word;
        } else {
          lines.push(...this.wrapByChar(word, maxWidth));
          currentLine = '';
        }
        continue;
      }

      const testLine = currentLine + ' ' + word;
      if (textWidth(testLine) <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        if (textWidth(word) <= maxWidth) {
          currentLine = word;
        } else {
          lines.push(...this.wrapByChar(word, maxWidth));
          currentLine = '';
        }
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  wrapByChar(textValue, maxWidth) {
    const lines = [];
    let currentLine = '';

    for (let i = 0; i < textValue.length; i += 1) {
      const nextLine = currentLine + textValue[i];
      if (textWidth(nextLine) <= maxWidth || currentLine.length === 0) {
        currentLine = nextLine;
      } else {
        lines.push(currentLine);
        currentLine = textValue[i];
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  renderWrappedLines(lines) {
    const lineHeight = textAscent() + textDescent();
    const totalHeight = lineHeight * lines.length;
    const contentHeight = this.getContentHeight();
    const baseX = this.getAlignedTextX();
    const maxLines = Math.max(1, Math.floor(contentHeight / Math.max(1, lineHeight)));
    let visibleLines = lines;

    if (lines.length > maxLines) {
      visibleLines = lines.slice(0, maxLines);
      const lastIndex = visibleLines.length - 1;
      visibleLines[lastIndex] = this.fitLineWithEllipsis(visibleLines[lastIndex], true);
    }

    let startY;
    if (this.VTextAlign === 'top') {
      startY = this.padt + textAscent();
    } else if (this.VTextAlign === 'bottom') {
      const renderedHeight = lineHeight * visibleLines.length;
      startY = this.height - this.padb - renderedHeight + textAscent();
    } else {
      const renderedHeight = lineHeight * visibleLines.length;
      startY = this.padt + (contentHeight - renderedHeight) / 2 + textAscent();
    }

    for (let i = 0; i < visibleLines.length; i += 1) {
      const y = startY + i * lineHeight;
      text(visibleLines[i], baseX, y);
    }
  }

  fitLineWithEllipsis(lineText, forceEllipsis = false) {
    const maxWidth = this.getContentWidth();
    const ellipsis = '...';
    if (!forceEllipsis && textWidth(lineText) <= maxWidth) {
      return lineText;
    }

    if (textWidth(ellipsis) >= maxWidth) {
      return ellipsis;
    }

    let low = 0;
    let high = lineText.length;
    let best = ellipsis;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const candidate = lineText.slice(0, mid) + ellipsis;
      if (textWidth(candidate) <= maxWidth) {
        best = candidate;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return best;
  }

  getAlignedTextX() {
    if (this.HTextAlign === 'left') {
      textAlign(LEFT, BASELINE);
      return this.padl;
    }
    if (this.HTextAlign === 'right') {
      textAlign(RIGHT, BASELINE);
      return this.width - this.padr;
    }

    textAlign(CENTER, BASELINE);
    return this.padl + this.getContentWidth() / 2;
  }
}
