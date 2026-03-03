import { TextComponent } from './TextComponent.js';
import { Component } from '../Core/Component.js';

export class Checkbox extends TextComponent {
  /**
   * Creates a checkbox component with a toggleable checked state and label text.
   * @param {number} x - The x-coordinate
   * @param {number} y - The y-coordinate
   * @param {number} width - The width
   * @param {number} height - The height
   * @param {string} label - The text to display next to the checkbox
   * @param {Object} options - Configuration options
   * @param {string|null} options.id - Component ID
   * @param {Component|null} options.parent - Parent component
   * @param {boolean} options.checked - Initial checked state
   * @param {p5.Color} options.backgroundColor - Background color
   * @param {p5.Color} options.textColor - Text color
   * @param {p5.Color} options.boxColor - Checkbox box background color (unchecked)
   * @param {p5.Color} options.boxBorderColor - Checkbox box border color
   * @param {number} options.boxBorderWidth - Checkbox box border width
   * @param {p5.Color} options.checkedColor - Background color of the box when checked
   * @param {p5.Color} options.checkmarkColor - Checkmark color
   * @param {number} options.boxSize - Size of the checkbox box in pixels
   * @param {number} options.boxGap - Gap between checkbox box and label text
   * @param {number} options.boxCornerRadius - Corner radius of the checkbox box
   * @param {p5.Color} options.hoverBoxBorderColor - Box border color on hover
   * @param {boolean} options.enabled - Whether the checkbox is interactive
   * @param {boolean} options.borderFlag - Whether to show component border
   * @param {p5.Color} options.borderColor - Component border color
   * @param {number} options.borderWidth - Component border width
   * @param {number} options.cornerRadius - Component corner radius
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
   * @param {number} options.margin - General margin for all sides
   * @param {number} options.marginx - Horizontal margin (left and right)
   * @param {number} options.marginy - Vertical margin (top and bottom)
   * @param {number} options.marginl - Left margin
   * @param {number} options.marginr - Right margin
   * @param {number} options.margint - Top margin
   * @param {number} options.marginb - Bottom margin
   */
  constructor(x, y, width, height, label, {
    id = null,
    parent = null,
    checked = false,
    backgroundColor = color('#1e1e2e'),
    textColor = color('#e0e0e0'),
    boxColor = color('#2a2a3d'),
    boxBorderColor = color('#3a3a4d'),
    boxBorderWidth = 2,
    checkedColor = color('#4a9eff'),
    checkmarkColor = color('#ffffff'),
    boxSize = 18,
    boxGap = 8,
    boxCornerRadius = 4,
    hoverBoxBorderColor = color('#5a5a7a'),
    enabled = true,
    borderFlag = false,
    borderColor = color('#3a3a4d'),
    borderWidth = 1,
    cornerRadius = 8,
    enableShadow = false,
    shadowColor = 'rgba(0,0,0,0.5)',
    shadowBlur = 12,
    shadowOffsetX = 0,
    shadowOffsetY = 4,
    HTextAlign = 'left',
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
    super(x, y, width, height, label, {
      id,
      parent,
      backgroundColor,
      textColor,
      borderFlag,
      borderColor,
      borderWidth,
      cornerRadius,
      enableShadow,
      shadowColor,
      shadowBlur,
      shadowOffsetX,
      shadowOffsetY,
      HTextAlign,
      VTextAlign,
      pad,
      padx,
      pady,
      padl,
      padr,
      padt,
      padb,
      wrap,
      wrapMode,
      noWrapMode,
      ellipsisMode,
      icon: null,
      iconSize: 20,
      iconPosition: 'left',
      iconGap: 6,
      iconTintColor: null,
      iconOpacity: 255,
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
    });

    this.checked = checked;
    this.boxColor = boxColor;
    this.boxBorderColor = boxBorderColor;
    this.boxBorderWidth = boxBorderWidth;
    this.checkedColor = checkedColor;
    this.checkmarkColor = checkmarkColor;
    this.boxSize = boxSize;
    this.boxGap = boxGap;
    this.boxCornerRadius = boxCornerRadius;
    this.hoverBoxBorderColor = hoverBoxBorderColor;
    this.enabled = enabled;
    this.isHovered = false;

    // Absorb box space into left padding so that all TextComponent layout
    // machinery (renderText, updateLabelSize, getContentWidth, debug overlay)
    // works correctly without any overrides.
    this.padl += this.boxSize + this.boxGap;

    // Recalculate label size with the updated padl
    if (!this.wrap && this.noWrapMode === 'font-size') {
      this.updateLabelSize();
    }

    this.addEventListener('mouseEnter', () => {
      if (!this.enabled) return;
      this.isHovered = true;
    });

    this.addEventListener('hover', (event) => {
      if (!this.enabled) return;
      cursor('pointer');
      event.stopPropagation();
    });

    this.addEventListener('mouseLeave', () => {
      this.isHovered = false;
    });

    this.addEventListener('click', () => {
      if (!this.enabled) return;
      this.checked = !this.checked;
    });
  }

  /**
   * Returns whether the checkbox is currently checked
   * @returns {boolean}
   */
  isChecked() {
    return this.checked;
  }

  /**
   * Sets the checked state of the checkbox
   * @param {boolean} checked - Checked state
   */
  setChecked(checked) {
    this.checked = checked;
  }

  /**
   * Toggles the checked state
   */
  toggle() {
    this.checked = !this.checked;
  }

  /**
   * Enables or disables the checkbox
   * @param {boolean} enabled - True to enable, false to disable
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) {
      this.isHovered = false;
    }
  }

  /**
   * Renders the checkbox with label
   */
  show() {
    if (this.enableShadow) {
      this.drawShadow();
    }

    push();
    beginClip();
    rect(this.x, this.y, this.width, this.height, this.cornerRadius);
    endClip();
    translate(this.x, this.y);

    // Background
    fill(this.backgroundColor);
    rect(0, 0, this.width, this.height, this.cornerRadius);

    // Checkbox box position: sits in the gap between original padl and expanded padl
    const originalPadl = this.padl - this.boxSize - this.boxGap;
    const boxX = originalPadl;
    const boxY = (this.height - this.boxSize) / 2;

    // Draw checkbox box
    if (this.checked) {
      fill(this.checkedColor);
    } else {
      fill(this.boxColor);
    }

    if (this.isHovered && this.enabled) {
      stroke(this.hoverBoxBorderColor);
    } else {
      stroke(this.boxBorderColor);
    }
    strokeWeight(this.boxBorderWidth);
    rect(boxX, boxY, this.boxSize, this.boxSize, this.boxCornerRadius);

    // Draw checkmark when checked
    if (this.checked) {
      stroke(this.checkmarkColor);
      strokeWeight(2.5);
      noFill();
      const cx = boxX + this.boxSize * 0.5;
      const cy = boxY + this.boxSize * 0.5;
      const s = this.boxSize * 0.3;
      // Checkmark path: two connected lines
      line(cx - s * 0.6, cy, cx - s * 0.1, cy + s * 0.5);
      line(cx - s * 0.1, cy + s * 0.5, cx + s * 0.7, cy - s * 0.5);
    }

    // Draw label text — renderText uses this.padl which already includes box space
    noStroke();
    fill(this.enabled ? this.textColor : color(120, 120, 140));
    this.renderText();

    // Border
    if (this.borderFlag) {
      noFill();
      stroke(this.borderColor);
      strokeWeight(this.borderWidth);
      rect(0, 0, this.width, this.height, this.cornerRadius);
    }

    pop();
  }
}
