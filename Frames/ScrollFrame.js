import {Frame} from './Frame.js';

export class ScrollFrame extends Frame{
    constructor(x, y, width, height, {
      backgroundColor = color(255),
      borderColor = color(0),
      borderWidth = 1,
      cornerRadius = 0,
      padx=0,
      pady=0,
      yScroll=false,
      xScroll=false,
      scrollSensitivity=20,
      bannerHeight=0.07,// 7% of total height
      alignment="v", //v for vertical, h for horizontal
      nearestBorderThreshold=5,
      parent=null,
      enableReposition=false,
      enableResizing=false,
    } = {}) {
      super(x, y, width, height, backgroundColor, borderColor, borderWidth,
        cornerRadius, padx, pady, bannerHeight, nearestBorderThreshold, parent, "Frame",
        enableReposition, enableResizing);
      
      this.elements = [];
      //used for calculating weighted dimensions of child elements
      this.totalWeight = 0;
      //flags for scroll on/off
      this.yScroll=yScroll;
      this.xScroll=xScroll;
      //for internal alignment of elements
      this.alignment = alignment;
  
      if(this.alignment=="vertical"){
        this.alignment="v";
      }
  
      if(this.alignment=="horizontal"){
        this.alignment="h";
      }
  
      if(this.alignment!="v" && this.alignment!="h"){
        this.alignment="v";
      }
  
      //sets the amount in % to scroll in any direction
      if(this.xScroll || this.yScroll){
        this.scrollSensitivity=scrollSensitivity;
      }
  
      if(this.yScroll){
        this.topper=-1;
        this.deepest=-1;
      }
  
      if(this.xScroll){
        this.leftist=-1;
        this.rightist=-1;
      }
    }
  
    show() {
      //coloring the background
      if(this.backgroundColor!=null){
        push();
        noStroke();
        fill(this.backgroundColor);
        rect(this.x, this.y, this.width, this.height, this.cornerRadius);
        pop();
      }
      
      //applying clipping mask
      push();
      beginClip();
      rect(this.x, this.y, this.width, this.height, this.cornerRadius);
      endClip();
  
      //displaying child elements
      for (let elem of this.elements) {
        elem[0].show();
      }
      
      //show the top banner
      if(this.enableReposition && this.bannerFlag){
        noStroke();
        fill(0);
        rect(this.x, this.y, this.width, this.bannerHeight*this.height);
  
        fill(255);        
        ellipse(this.x+this.width/2, this.y+(this.bannerHeight*this.height)/2, (this.bannerHeight*this.height)/4, (this.bannerHeight*this.height)/4);
        ellipse(this.x+this.width/2 - (this.bannerHeight*this.height)/2, this.y+(this.bannerHeight*this.height)/2, (this.bannerHeight*this.height)/4, (this.bannerHeight*this.height)/4);
        ellipse(this.x+this.width/2 + (this.bannerHeight*this.height)/2, this.y+(this.bannerHeight*this.height)/2, (this.bannerHeight*this.height)/4, (this.bannerHeight*this.height)/4);
      }
  
      //highlight the relevant border if cursor is sufficiently near to it
      if(this.enableResizing && this.nearestBorder!=null){
        this.showHighlightedBorder();
      }
      
      pop();
      
      //displaying the outline/border
      if(this.borderColor!=null){
        push();
        stroke(this.borderColor);
        strokeWeight(this.borderWidth);
        noFill();
        rect(this.x, this.y, this.width, this.height, this.cornerRadius);
        pop();
      }
    }
  
    add(element,
      {
        weight=1,
        padL=0,
        padR=0,
        padT=0,
        padB=0
      }={})
    {
      if(element==null){
        console.log("element to add can't be null");
        return;
      }
      
  
      if(weight<=0){
        console.log("weight can't be non-positive");
        return;
      }
      
      element.parent=this;
      this.elements.push([element, weight, padL, padR, padT, padB]);
      this.totalWeight+=weight;
      this.correctPosAndDim();
  
      if(this.xScroll==true){
        this.findLeftist();
        this.findRightist();
      }
  
      if(this.yScroll==true){
        this.findTopper();
        this.findDeepest();
      }
    }
  
    //corrects position and dimensions of all the child elements so that
    //they fit right in the parent frame
    correctPosAndDim(){
      this.adjustHeight(this.y+this.pady, this.height-2*this.pady);
      this.adjustWidth(this.x+this.padx, this.width-2*this.padx);
    }
    
    //needs cleanup
    drawEventListener(){
      let cursorOverFrame = this.isCursorHoveringOver();
  
      if(cursorOverFrame){
        if(!(mouseIsPressed && this.nearestBorder!=null) && mouseX>this.x && mouseX<this.x+this.width && mouseY>this.y && mouseY<this.y+(this.bannerHeight*this.height)){
          if(this.enableReposition && this.bannerFlag==false){
            this.showBanner();
          }
  
          if(this.enableReposition && mouseIsPressed && this.xDist==null && this.yDist==null){
            this.xDist = mouseX-this.x;
            this.yDist = mouseY-this.y;
          }
  
        } else {
          if(this.enableReposition && this.bannerFlag==true && this.xDist==null && this.yDist==null){
            this.hideBanner();
          }
        }
  
        if(keyIsDown(LEFT_ARROW)){
           this.scrollLeft();
        } else if(keyIsDown(RIGHT_ARROW)){
           this.scrollRight();
        } else if(keyIsDown(UP_ARROW)){
          this.scrollUp();
        } else if(keyIsDown(DOWN_ARROW)){
          this.scrollDown();
        }
  
      } else {
        if(this.enableReposition && this.bannerFlag==true && mouseIsPressed==false && this.xDist==null && this.yDist==null){
          this.hideBanner();
        }
      }
  
      if(this.enableResizing && mouseIsPressed==false && this.xDist==null && this.yDist==null){
        this.checkNearestBorder();
        if(this.nearestBorder!=null){
          cursorOverFrame=true;
        }
      }
  
      if(this.enableResizing && this.nearestBorder!=null && this.xDist==null && this.yDist==null){
        //this.showHighlightedBorder();
        this.updateDimensions();
      }
  
      if(this.enableReposition && mouseIsPressed && this.xDist!=null && this.yDist!=null){
        this.updatePosition();
      }
  
      return cursorOverFrame;
    }
  
    //finds the element nearest to the top
    findTopper(){
      if(this.topper==-1){
        this.topper=0;
        return;
      }
  
      let i = this.elements.length-1;
      if(this.elements[i][0].y +
        this.elements[i][4] <
        this.elements[this.topper][0].y +
        this.elements[this.topper][4]){
        this.topper = i;
      }
    }
  
    //finds the element that is farther down than any other element
    findDeepest(){
      if(this.deepest==-1){
        this.deepest=0;
        return;
      }
  
      let i = this.elements.length-1;
      if(this.elements[i][0].y +
        this.elements[i][0].height -
        this.elements[i][5] >
        this.elements[this.deepest][0].y +
        this.elements[this.deepest][0].height -
        this.elements[this.deepest][5]){
        this.deepest = i;
      }
    }
  
    //finds the element nearest to the left boundary
    findLeftist(){
      if(this.leftist==-1){
        this.leftist=0;
        return;
      }
  
      let i = this.elements.length-1;
      if(this.elements[i][0].x +
        this.elements[i][2] <
        this.elements[this.leftist][0].x +
        this.elements[this.leftist][2]){
        this.leftist = i;
      }
    }
  
    //finds the element farthest to the right
    findRightist(){
      if(this.rightist==-1){
        this.rightist=0;
        return;
      }
  
      let i = this.elements.length-1;
      if(this.elements[i][0].x +
        this.elements[i][0].width -
        this.elements[i][3] >
        this.elements[this.rightist][0].x +
        this.elements[this.rightist][0].width -
        this.elements[this.rightist][3]){
        this.rightist = i;
      }
    }
    
    scrollDown(){
      if(!this.yScroll || this.elements.length==0){
        return;
      }
      
      if(this.alignment=="v"){
        let last_elem = this.elements[this.elements.length-1][0];
        if(last_elem.y + last_elem.height > this.y + this.height - this.pady - this.elements[this.elements.length-1][5]){
          this.vScrollUtil(-1);
        }
      } else {
        //need to find the one that extends the longest
        if(this.elements[this.deepest][0].y + this.elements[this.deepest][0].height > this.y + this.height - this.pady- this.elements[this.deepest][5]){
          this.vScrollUtil(-1);
        }
      }
    }
    
    scrollUp(){
      if(!this.yScroll || this.elements.length==0){
        return;
      }
      
      if(this.alignment=="v"){
        let first_elem = this.elements[0];
        if(first_elem[0].y + first_elem[4] <this.y + this.pady){
          this.vScrollUtil(1);
        }
      } else {
        //need to find the element that is nearest to the top
        if(this.elements[this.topper][0].y + this.elements[this.topper][4] <this.y + this.pady){
          this.vScrollUtil(1);
        }
      }
    }
    
    vScrollUtil(multiple){
      for(let i=0; i<this.elements.length; i++){
        let elem = this.elements[i][0];
        
        if(elem.constructor.name=="ScrollFrame"){
          elem.vScrollUtil(multiple);
        }
        
        elem.y+=multiple*this.scrollSensitivity;
      }
    }
    
    scrollLeft(){
      if(!this.xScroll || this.elements.length==0){
        return;
      }
  
      if(this.alignment=="v"){
        //do something about the loop
        if(this.elements[this.leftist][0].x-this.elements[this.leftist][2]<this.x+this.padx){
          this.hScrollUtil(1);
        }
        
      } else {
        //first element
        if(this.elements[0][0].x-this.elements[0][2]<this.x+this.padx){
          this.hScrollUtil(1);
        }
      }
    }
    
    scrollRight(){
      if(!this.xScroll || this.elements.length==0){
        return;
      }
  
      if(this.alignment=="v"){
        if(this.elements[this.rightist][0].x+this.elements[this.rightist][0].width+this.elements[this.rightist][3]>this.x+this.width-this.padx){
          this.hScrollUtil(-1);
        }
  
      } else {
        let last_elem = this.elements[this.elements.length-1];
        if(last_elem[0].x+last_elem[0].width+last_elem[3]>this.x+this.width-this.padx){
          this.hScrollUtil(-1);
        }
      }
    }
    
    hScrollUtil(multiple){
      for(let i=0; i<this.elements.length; i++){
        let elem = this.elements[i][0];
        
        if(elem.constructor.name=="ScrollFrame"){
          elem.hScrollUtil(multiple);
        }
        
        elem.x+=multiple*this.scrollSensitivity;
      }
    }
    
    showBanner(){
      if(this.yScroll==true){
        this.BannerUtil(1, this.bannerHeight*this.height);
      } else {
        this.adjustHeight(this.y + (this.bannerHeight*this.height) + this.pady, this.height - (this.bannerHeight*this.height) - 2*(this.pady));
      }
      this.bannerFlag=true;
    }
    
    hideBanner(){
      if(this.yScroll==true){
        this.BannerUtil(-1, this.bannerHeight*this.height);
      } else {
        this.adjustHeight(this.y + this.pady, this.height-2*(this.pady));
      }
      this.bannerFlag=false;
    }
  
    BannerUtil(dir, heightAdjustment){
      for(let i=0; i<this.elements.length; i++){
        let curr = this.elements[i];
        curr[0].y += dir*heightAdjustment;
  
        if(curr[0].constructor.name=="ScrollFrame"){
           curr[0].BannerUtil(dir, heightAdjustment);
        }
      }
    }
    
    adjustHeight(y, h){
      //[element, weight, padL, padR, padT, padB]
      for(let i=0; i<this.elements.length; i++){
  
        let curr = this.elements[i];
  
        if(i-1>=0){
          let prev = this.elements[i-1];
          if(this.alignment=="v"){
            curr[0].y = prev[0].y + prev[0].height + prev[5] + curr[4];
          } else {
            curr[0].y = y + curr[4];
          }
        } else {
          curr[0].y = y + curr[4];
        }
        
        if(this.yScroll==false){
          if(this.alignment=="v"){
            curr[0].height = (curr[1]/(this.totalWeight))*(h) - curr[4] - curr[5];
          } else {
            curr[0].height = h - curr[4] - curr[5];
          }
        }
  
        if(curr[0].parentType=="Frame"){
         curr[0].adjustHeight(curr[0].y + curr[0].pady, curr[0].height - 2*(curr[0].pady));
        } else {
          if(this.yScroll==false){
            curr[0].updateHeight();
          }
        }
  
      }
    }
  
    adjustWidth(x, w){
      //[element, weight, padL, padR, padT, padB]
      for(let i=0; i<this.elements.length; i++){
        let curr = this.elements[i];
        if(i-1>=0){
          let prev = this.elements[i-1];
          if(this.alignment!="v"){
            curr[0].x = prev[0].x + prev[0].width + prev[3] + curr[2];
          } else {
            curr[0].x = x + curr[2];
          }
        } else {
          curr[0].x = x + curr[2];
        }
  
        if(this.xScroll==false){
          if(this.alignment=="v"){
            curr[0].width = w - curr[2] - curr[3];
          } else {
            curr[0].width = (curr[1]/(this.totalWeight))*(w) - curr[2] - curr[3];
          }
        }
  
        if(curr[0].parentType=="Frame"){
          curr[0].adjustWidth(curr[0].x + curr[0].padx, curr[0].width - 2*(curr[0].padx));
        } else {
          if(this.xScroll==false){
            curr[0].updateWidth();
          }
        }
  
      }
    }
  
    updatePosUtil(xDiff, yDiff){
      for(let i=0; i<this.elements.length; i++){
        this.elements[i][0].x -= xDiff;
        this.elements[i][0].y -= yDiff;
        if(this.elements[i][0].parentType=="Frame"){
          this.elements[i][0].updatePosUtil(xDiff, yDiff);
        }
      }
    }
  }