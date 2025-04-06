import {UIComponent} from './UIComponent.js';

export class Label extends UIComponent{
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
      } = {}) {
      super(x, y, width, height, backgroundColor, borderFlag, borderColor,
        borderWidth, cornerRadius, enableShadow, shadowColor, shadowIntensity,
        shadowSpread, shadowDetail, {parent: parent, type: "UIComponent", id: id});

      this.text = label;
      this.labelSize = 20;
      this.textColor = textColor;
    }

    // if(this.enableShadow){
    //   this.shadowColor = shadowColor;//rgb value
    //   this.shadowIntensity = shadowIntensity;//opacity value between 0 and 1
    //   this.shadowSpread = shadowSpread;//stroke width of each of those rectangles
    //   this.shadowDetail = shadowDetail;//number of rectangles that will be drawn around the component
    // }
  
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
      textAlign(CENTER, CENTER);
      textSize(this.labelSize);
      text(this.text, this.width / 2, this.height / 2);
      
      // Border
      if (this.borderFlag) {
        noFill();  // Only for the border
        stroke(this.borderColor);
        strokeWeight(this.borderWidth);
        rect(0, 0, this.width, this.height, this.cornerRadius);  // Fix here
      }
      
      pop();
    }

    setText(text){
      this.text = text;
      this.updateLabelSize();
    }
    
    //needs heavy optimizations
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

    updateWidth(){
      this.updateLabelSize();
    }

    updateHeight(){
      this.updateLabelSize();
    }
  }
  