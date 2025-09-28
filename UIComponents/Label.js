import {UIComponent} from './UIComponent.js';
import { Component } from '../Core/Component.js';

export class Label extends UIComponent{
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
   * @param {string} options.shadowColor - Shadow color
   * @param {number} options.shadowIntensity - Shadow opacity
   * @param {number} options.shadowSpread - Shadow spread
   * @param {number} options.shadowDetail - Shadow layers
   * @param {string} options.HTextAlign - Horizontal text alignment
   * @param {string} options.VTextAlign - Vertical text alignment
   * @param {number} options.pad - General padding
   * @param {number} options.padx - Horizontal padding
   * @param {number} options.pady - Vertical padding
   * @param {number} options.padl - Left padding
   * @param {number} options.padr - Right padding
   * @param {number} options.padt - Top padding
   * @param {number} options.padb - Bottom padding
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
        shadowColor= 'rgb(0,0,0)',
        shadowIntensity= 0.4,
        shadowSpread= 3,
        shadowDetail=5,
        HTextAlign="center",
        VTextAlign="center",
        pad = 5,
        padx = 0,
        pady = 0,
        padl = 0,
        padr = 0,
        padt = 0,
        padb = 0,
      } = {}) {
      super(x, y, width, height, backgroundColor, borderFlag, borderColor,
        borderWidth, cornerRadius, enableShadow, shadowColor, shadowIntensity,
        shadowSpread, shadowDetail, {parent: parent, type: "UIComponent", id: id});

      this.text = label;
      this.labelSize = 20;
      this.textColor = textColor;

      this.HTextAlign = HTextAlign;
      this.VTextAlign = VTextAlign;

      this.pad = pad;
      this.padx = padx;
      this.pady = pady;
      this.padl = padl;
      this.padr = padr;
      this.padt = padt;
      this.padb = padb;
    }

    // if(this.enableShadow){
    //   this.shadowColor = shadowColor;//rgb value
    //   this.shadowIntensity = shadowIntensity;//opacity value between 0 and 1
    //   this.shadowSpread = shadowSpread;//stroke width of each of those rectangles
    //   this.shadowDetail = shadowDetail;//number of rectangles that will be drawn around the component
    // }
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
      // textAlign(CENTER, CENTER);
      textSize(this.labelSize);

      let x;
      if(this.HTextAlign === "left"){
        textAlign(LEFT, CENTER);
        x = this.pad;
      } else if(this.HTextAlign === "right"){
        textAlign(RIGHT, CENTER);
        x = this.width - this.pad;
      } else{
        //center
        textAlign(CENTER, CENTER);
        x = this.width / 2;
      } 

      let y;
      if(this.VTextAlign === "top"){
        textAlign(this.getHTextAlign(), BOTTOM);
        y = this.labelSize + this.pad;
      } else if(this.VTextAlign === "bottom"){
        textAlign(this.getHTextAlign(), TOP);
        y = this.height - this.labelSize - this.pad;
      } else {
        //center
        textAlign(this.getHTextAlign(), CENTER);
        y = this.height / 2;
      }

      text(this.text, x, y);
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

    /**
   * Converts horizontal alignment string to P5 constant
   * @returns {number} P5 alignment constant
   */
    getHTextAlign(){
      switch(this.HTextAlign){
        case "left":
          return LEFT;
        case "right":
          return RIGHT;
        default:
          return CENTER;
      }
    }

    /**
   * Converts vertical alignment string to P5 constant
   * @returns {number} P5 alignment constant
   */
    getVTextAlign(){
      switch(this.VTextAlign){
        case "top":
          return TOP;
        case "bottom":
          return BOTTOM;
        default:
          return CENTER;
      }
    }
    
    /**
   * Updates the label text and recalculates text size
   * @param {string} text - The new text to display
   */
    setText(text){
      this.text = text;
      this.updateLabelSize();
    }
    
    //needs heavy optimizations
    /**
   * Dynamically calculates the optimal text size to fit the container
   * Uses binary search for efficient size calculation
   */
    updateLabelSize() {
      let maxSize = min(this.width * 0.9, this.height * 0.8);
      let minSize = 1;
      let low = minSize;
      let high = maxSize;
      let bestSize = minSize;
   
      const maxLabelWidth = this.width * 0.9;
      const maxLabelHeight = this.height * 0.8;
   
      while (low <= high) {
         let mid = Math.floor((low + high) / 2);
         textSize(mid);
         let labelWidth = textWidth(this.text);
         let labelHeight = textAscent() + textDescent();
   
         if (labelWidth <= maxLabelWidth && labelHeight <= maxLabelHeight) {
            bestSize = mid;
            low = mid + 1;
         } else {
            high = mid - 1;
         }
      }
   
      this.labelSize = bestSize;
    }

    /**
   * Handles width changes and updates text size accordingly
   */
    updateWidth(){
      this.updateLabelSize();
    }

    /**
   * Handles height changes and updates text size accordingly
   */
    updateHeight(){
      this.updateLabelSize();
    }
  }
  