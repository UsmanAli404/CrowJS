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
  