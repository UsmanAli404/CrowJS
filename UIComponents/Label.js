import { TextComponent } from './TextComponent.js';
import { Component } from '../Core/Component.js';

export class Label extends TextComponent{
  /**
   * Creates a text label component
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
   * @param {p5.Image|null} options.icon - Icon image (null = text only)
   * @param {number} options.iconSize - Icon display size in pixels
   * @param {string} options.iconPosition - "left", "right", "top", or "bottom"
   * @param {number} options.iconGap - Gap between icon and text
   * @param {p5.Color|null} options.iconTintColor - Optional icon tint
   * @param {number} options.iconOpacity - Icon opacity 0-255
   * @param {number} options.margin - General margin for all sides
   * @param {number} options.marginx - Horizontal margin (left and right)
   * @param {number} options.marginy - Vertical margin (top and bottom)
   * @param {number} options.marginl - Left margin
   * @param {number} options.marginr - Right margin
   * @param {number} options.margint - Top margin
   * @param {number} options.marginb - Bottom margin
   */
    constructor(x, y, width, height, label,
       {id=null,
        parent = null,
        backgroundColor = color('#1e1e2e'),
        textColor = color('#e0e0e0'),
        borderFlag = true,
        borderColor = color('#3a3a4d'),
        borderWidth = 1, 
        cornerRadius = 8,
        enableShadow=false,
        shadowColor= 'rgba(0,0,0,0.5)',
        shadowBlur= 12,
        shadowOffsetX= 0,
        shadowOffsetY= 4,
        HTextAlign="center",
        VTextAlign="center",
        pad = 5,
        padx = null,
        pady = null,
        padl = null,
        padr = null,
        padt = null,
        padb = null,
        wrap = false,
        wrapMode = "word",
        noWrapMode = "font-size",
        ellipsisMode = "trailing",
        icon = null,
        iconSize = 20,
        iconPosition = 'left',
        iconGap = 6,
        iconTintColor = null,
        iconOpacity = 255,
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
        icon,
        iconSize,
        iconPosition,
        iconGap,
        iconTintColor,
        iconOpacity,
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
    }

    /**
     * Renders the label with text, background, and border
     */
    show() {
      if(this.enableShadow){
        this.drawShadow();
      }

      push();
      beginClip();
      rect(this.x, this.y, this.width, this.height, this.cornerRadius);
      endClip();
      translate(this.x, this.y);
      fill(this.backgroundColor);
      
      // Background rectangle
      rect(0, 0, this.width, this.height, this.cornerRadius);
      
      // Text
      fill(this.textColor);
      this.renderText();
      // rect(x, y, this.labelSize, this.labelSize);
      
      // Border
      if (this.borderFlag) {
        noFill();  // Only for the border
        stroke(this.borderColor);
        strokeWeight(this.borderWidth);
        rect(0, 0, this.width, this.height, this.cornerRadius);  // Fix here
      }
      
      pop();
    }

  }
  