import {UIComponent} from './UIComponent.js';

export class Label extends UIComponent{
    constructor(x, y, width, height, label, {parent = null, borderFlag = false, borderColor = color(0), borderWidth = 1, cornerRadius = 0} = {}) {
      super(x, y, width, height, {parent: parent, parentType: "UIComponent"});

      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.label = label;
      this.labelSize = 20;
      this.borderFlag = borderFlag;
      this.borderColor = borderColor;
      this.borderWidth = borderWidth;
      this.cornerRadius = cornerRadius;
    }
  
    show() {
      push();
      translate(this.x, this.y);
      fill(200);
      //bg
      rect(0, 0, this.width, this.height, this.cornerRadius);
      //text
      fill(0);
      textAlign(CENTER, CENTER);
      textSize(this.labelSize);
      text(this.label, this.width / 2, this.height / 2);
      if(this.borderFlag){
        noFill();
        stroke(this.borderColor);
        strokeWeight(this.borderWidth);
        rect(this.x, this.y, this.width, this.height, this.cornerRadius);
      }
      pop();
    }
  
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
         let labelWidth = textWidth(this.label);
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
  