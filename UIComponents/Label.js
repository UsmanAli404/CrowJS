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
   */
    constructor(x, y, width, height, label,
       {id=null,
        parent = null,
        backgroundColor = color(200),
        textColor = color(0),
        borderFlag = true,
        borderColor = color(0),
        borderWidth = 1, 
        cornerRadius = 0,
        enableShadow=false,
        shadowColor= 'rgba(0,0,0,0.35)',
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
  