import { TextComponent } from './TextComponent.js';
import { Component } from '../Core/Component.js';

export class Button extends TextComponent {
  /**
   * Creates a button component with hover/press visuals and click behavior
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
   * @param {p5.Color} options.hoverBackgroundColor - Background on hover
   * @param {p5.Color} options.hoverTextColor - Text color on hover
   * @param {p5.Color} options.pressedBackgroundColor - Background on press
   * @param {p5.Color} options.pressedTextColor - Text color on press
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
   * @param {number} options.margin - General margin for all sides
   * @param {number} options.marginx - Horizontal margin (left and right)
   * @param {number} options.marginy - Vertical margin (top and bottom)
   * @param {number} options.marginl - Left margin
   * @param {number} options.marginr - Right margin
   * @param {number} options.margint - Top margin
   * @param {number} options.marginb - Bottom margin
   * @param {boolean} options.enabled - Whether the button is enabled
   */
  constructor(x, y, width, height, label,
    {
      id = null,
      parent = null,
      backgroundColor = color('#2a2a3d'),
      textColor = color('#e0e0e0'),
      hoverBackgroundColor = color('#3a3a5a'),
      hoverTextColor = color('#ffffff'),
      pressedBackgroundColor = color('#4a4a6a'),
      pressedTextColor = color('#ffffff'),
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
      wrap = true,
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
      enabled = true,
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
      margin,
      marginx,
      marginy,
      marginl,
      marginr,
      margint,
      marginb,
      showDebugOverlay,
    });

    this.hoverBackgroundColor = hoverBackgroundColor;
    this.hoverTextColor = hoverTextColor;
    this.pressedBackgroundColor = pressedBackgroundColor;
    this.pressedTextColor = pressedTextColor;

    this.enabled = enabled;
    this.isHovered = false;
    this.isPressed = false;

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
      this.isPressed = false;
      cursor('');
    });

    this.addEventListener('press', () => {
      if (!this.enabled) return;
      this.isPressed = true;
    });

    this.addEventListener('release', () => {
      this.isPressed = false;
    });
  }

  /**
   * Renders the button with hover/press visuals
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
    fill(this.getBackgroundColor());
    rect(0, 0, this.width, this.height, this.cornerRadius);

    // Text
    fill(this.getTextColor());
    this.renderText();

    // Border
    if (this.borderFlag) {
      noFill();
      stroke(this.getBorderColor());
      strokeWeight(this.borderWidth);
      rect(0, 0, this.width, this.height, this.cornerRadius);
    }

    pop();
  }

  /**
   * Enables or disables the button
   * @param {boolean} enabled - True to enable, false to disable
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) {
      this.isHovered = false;
      this.isPressed = false;
    }
  }

  getBackgroundColor() {
    if (!this.enabled) {
      return this.backgroundColor;
    }

    if (this.isPressed && this.pressedBackgroundColor !== null) {
      return this.pressedBackgroundColor;
    }

    if (this.isHovered && this.hoverBackgroundColor !== null) {
      return this.hoverBackgroundColor;
    }

    return this.backgroundColor;
  }

  getTextColor() {
    if (!this.enabled) {
      return this.textColor;
    }

    if (this.isPressed && this.pressedTextColor !== null) {
      return this.pressedTextColor;
    }

    if (this.isHovered && this.hoverTextColor !== null) {
      return this.hoverTextColor;
    }

    return this.textColor;
  }

  getBorderColor() {
    if (!this.enabled) {
      return this.borderColor;
    }

    if (this.isPressed) {
      return color('#6a6a9a');
    }

    if (this.isHovered) {
      return color('#5a5a7a');
    }

    return this.borderColor;
  }
}
