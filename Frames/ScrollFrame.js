import {Frame} from './Frame.js';

export class ScrollFrame extends Frame{
    constructor(x, y, width, height, {
      id=null,
      backgroundColor = color(255),
      borderColor = color(0),
      highlightedBorderColor = color(0),
      borderWidth = 1,
      cornerRadius = 0,
      padx=0,
      pady=0,
      alwaysShowBanner = false,
      enableVScroll=false,
      enableHScroll=false,
      scrollSensitivity=20,
      bannerHeight=35,
      alignment="v", //v for vertical, h for horizontal
      nearestBorderThreshold=8,
      parent=null,
      enableReposition=false,
      enableOptimisedReposition=false,
      enableResizing=false,
      enableOptimisedResizing=false,
      enableShadow=false,
      shadowColor= 'rgb(0,0,0)',
      shadowIntensity= 0.3,
      shadowSpread= 1,
      shadowDetail=10,
    } = {}) {
      bannerHeight = bannerHeight%height;
      super(x, y, width, height, id, backgroundColor, borderColor, highlightedBorderColor, borderWidth,
        cornerRadius, padx, pady, alwaysShowBanner, bannerHeight, nearestBorderThreshold, parent, "Frame",
        enableReposition, enableOptimisedReposition, enableResizing, enableOptimisedResizing, enableShadow, shadowColor, shadowIntensity, shadowSpread, shadowDetail);
      
      this.preferences = [];
      //used for calculating weighted dimensions of child elements
      this.totalWeight = 0;
      //flags for scroll on/off
      this.enableVScroll=enableVScroll;
      this.enableHScroll=enableHScroll;
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
      if(this.enableHScroll || this.enableVScroll){
        this.scrollSensitivity=scrollSensitivity;
      }
  
      if(this.enableVScroll){
        this.topper=-1;
        this.deepest=-1;
      }
  
      if(this.enableHScroll){
        this.leftist=-1;
        this.rightist=-1;
      }

      //default event listeners
      this.addEventListener("keyDown", (event) => this.onKeyDown(event));
    }

    onKeyDown(event) {
      // console.log("key is pressed...");
      if(keyIsDown(LEFT_ARROW)){
        this.scrollLeft();
      } else if(keyIsDown(RIGHT_ARROW)){
          this.scrollRight();
      } else if(keyIsDown(UP_ARROW)){
        this.scrollUp();
      } else if(keyIsDown(DOWN_ARROW)){
        this.scrollDown();
      }
    }
  
    show() {
      //shadow
      if(this.enableShadow){
        this.drawShadow();
      }

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
      for (let child of this.children) {
        child.show();
      }
      
      //show the top banner
      if(this.alwaysShowBanner || (this.enableReposition && this.isBannerShown)){
        noStroke();
        fill(0);
        rect(this.x, this.y, this.width, this.bannerHeight);
  
        fill(255);        
        ellipse(this.x+this.width/2, this.y+(this.bannerHeight)/2, (this.bannerHeight)/4, (this.bannerHeight)/4);
        ellipse(this.x+this.width/2 - (this.bannerHeight)/2, this.y+(this.bannerHeight)/2, (this.bannerHeight)/4, (this.bannerHeight)/4);
        ellipse(this.x+this.width/2 + (this.bannerHeight)/2, this.y+(this.bannerHeight)/2, (this.bannerHeight)/4, (this.bannerHeight)/4);
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

      //highlight the relevant border if cursor is sufficiently near to it
      // if(this.enableResizing && this.nearestBorder!=null){
      //   this.showHighlightedBorder();
      // }
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

      if(this.findElement(element)){
        console.log(`the component (id: ${element.id}) is already added to the scrollframe (${this.id})`);
        console.log("component: ", element, "\nScrollFrame: ", this);
        return;
      }
  
      if(weight<=0){
        console.log("weight can't be non-positive");
        return;
      }

      if(this.getElementById(element.id)){
        console.log(`component with duplicate id (${element.id}) found in ${this.constructor.name}; component (${element.constructor.name}) can't be added!`);
        console.log(this);
        console.log("");
        return;
      }

      element.turnResizingAndRepositionOff();
      element.parent=this;
      this.children.push(element);
      //     0      , 1     , 2   , 3   , 4   , 5
      //old: element, weight, padL, padR, padT, padB
      //     0      , 1     , 2   , 3   , 4
      //new: weight, padL, padR, padT, padB
      this.preferences.push([weight, padL, padR, padT, padB]);
      this.totalWeight+=weight;
      this.redraw();
  
      if(this.enableHScroll==true){
        this.findLeftist();
        this.findRightist();
      }
  
      if(this.enableVScroll==true){
        this.findTopper();
        this.findDeepest();
      }
    }

    remove(element){
      let index = this.findIndexOfElement(element);
      if(index==-1){
        console.log(`element (id: ${element.id}) can't be removed from ScrollFrame (id: ${this.id})
           because it was not found in immediate children!`);
        return;
      }

      this.children[index].parent = null;
      this.totalWeight -= this.preferences[index][0];
      this.preferences = this.preferences.filter((_, i) => i!==index);
      this.removeChild(element);
      this.redraw();

      console.log(`element (id: ${element.id}) successfully removed from ${this.constructor.name} (id: ${this.id})!`);
    }

    setWeight(index, weight){
      if(index<0 || index>this.children.length-1){
        console.log("index out of range! can't set new weight");
        return;
      }

      if(weight<1){
        console.log("weight to set must be >= 1");
        return;
      }

      this.totalWeight -= this.preferences[index][0];
      this.totalWeight += weight;
      this.preferences[index][0] = weight;
    }

    getWeight(index){
      if(index<0 || index>this.children.length-1){
        console.log("index out of range! can't set new weight");
        return;
      }

      return this.preferences[index][0];
    }

    setPadL(index, padL){
      if(index<0 || index>this.children.length-1){
        console.log("index out of range! can't set new padL");
        return;
      }

      if(padL<0){
        console.log("padL to set must be >= 0");
        return;
      }

      this.preferences[index][1] = padL;
    }

    getPadL(index){
      if(index<0 || index>this.children.length-1){
        console.log("index out of range! can't set new padL");
        return;
      }

      return this.preferences[index][1];
    }

    setPadR(index, padR){
      if(index<0 || index>this.children.length-1){
        console.log("index out of range! can't set new padR");
        return;
      }

      if(padR<0){
        console.log("padR to set must be >= 0");
        return;
      }

      this.preferences[index][2] = padR;
    }

    getPadR(index){
      if(index<0 || index>this.children.length-1){
        console.log("index out of range! can't set new padR");
        return;
      }

      return this.preferences[index][2];
    }

    setPadT(index, padT){
      if(index<0 || index>this.children.length-1){
        console.log("index out of range! can't set new padT");
        return;
      }

      if(padT<0){
        console.log("padT to set must be >= 0");
        return;
      }

      this.preferences[index][3] = padT;
    }

    getPadT(index){
      if(index<0 || index>this.children.length-1){
        console.log("index out of range! can't set new padT");
        return;
      }

      return this.preferences[index][3];
    }

    setPadB(index, padB){
      if(index<0 || index>this.children.length-1){
        console.log("index out of range! can't set new padB");
        return;
      }

      if(padB<0){
        console.log("padB to set must be >= 0");
        return;
      }

      this.preferences[index][4] = padB;
    }

    getPadB(index){
      if(index<0 || index>this.children.length-1){
        console.log("index out of range! can't set new padB");
        return;
      }

      return this.preferences[index][4];
    }
    
    //the following find methods find the relevant subjects by maintaing a
    //reference variable. This variable is conditionally updated by comparing
    //it to the most recently added element in the list. Therefore, there is
    //no need to loop over all the elements every single time any element is added.
  
    //finds the element nearest to the top
    findTopper(){
      if(this.topper==-1){
        this.topper=0;
        return;
      }
  
      let i = this.preferences.length-1;
      if(this.children[i].y +
        this.preferences[i][3] <
        this.children[this.topper].y +
        this.preferences[this.topper][3]){
        this.topper = i;
      }
    }
  
    //finds the element that is farther down than any other element
    findDeepest(){
      if(this.deepest==-1){
        this.deepest=0;
        return;
      }
  
      let i = this.preferences.length-1;
      if(this.children[i].y +
        this.children[i].height -
        this.preferences[i][4] >
        this.children[this.deepest].y +
        this.children[this.deepest].height -
        this.preferences[this.deepest][4]){
        this.deepest = i;
      }
    }
  
    //finds the element nearest to the left boundary
    findLeftist(){
      if(this.leftist==-1){
        this.leftist=0;
        return;
      }
  
      let i = this.preferences.length-1;
      if(this.children[i].x +
        this.preferences[i][1] <
        this.children[this.leftist].x +
        this.preferences[this.leftist][1]){
        this.leftist = i
      }
    }
  
    //finds the element farthest to the right
    findRightist(){
      if(this.rightist==-1){
        this.rightist=0;
        return;
      }
  
      let i = this.preferences.length-1;
      if(this.children[i].x +
        this.children[i].width -
        this.preferences[i][2] >
        this.children[this.rightist].x +
        this.children[this.rightist].width -
        this.preferences[this.rightist][2]){
        this.rightist = i;
      }
    }
    
    scrollDown(){
      if(!this.enableVScroll || this.children.length==0){
        return;
      }
      
      if(this.alignment=="v"){
        let last_elem = this.children[this.children.length-1];
        if(last_elem.y + last_elem.height > this.y + this.height - this.pady - this.preferences[this.preferences.length-1][4]){
          this.vScrollUtil(-1);
        }
      } else {
        //need to find the one that extends the longest
        if(this.children[this.deepest].y + this.children[this.deepest].height > this.y + this.height - this.pady- this.preferences[this.deepest][4]){
          this.vScrollUtil(-1);
        }
      }
    }
    
    scrollUp(){
      if(!this.enableVScroll || this.children.length==0){
        return;
      }
      
      if(this.alignment=="v"){
        let first_elem = this.children[0];
        if(first_elem.y + this.preferences[0][3] <this.y + this.pady){
          this.vScrollUtil(1);
        }
      } else {
        //need to find the element that is nearest to the top
        if(this.children[this.topper].y + this.preferences[this.topper][3] <this.y + this.pady){
          this.vScrollUtil(1);
        }
      }
    }
    
    vScrollUtil(multiple){
      for(let i=0; i<this.children.length; i++){
        let elem = this.children[i];
        
        if(elem.constructor.name=="ScrollFrame"){
          elem.vScrollUtil(multiple);
        }
        
        elem.y+=multiple*this.scrollSensitivity;
      }
    }
    
    scrollLeft(){
      if(!this.enableHScroll || this.children.length==0){
        return;
      }
  
      if(this.alignment=="v"){
        //do something about the loop
        if(this.children[this.leftist].x-this.preferences[this.leftist][1]<this.x+this.padx){
          this.hScrollUtil(1);
        }
        
      } else {
        //first element
        if(this.children[0].x-this.preferences[0][1]<this.x+this.padx){
          this.hScrollUtil(1);
        }
      }
    }
    
    scrollRight(){
      if(!this.enableHScroll || this.children.length==0){
        return;
      }
  
      if(this.alignment=="v"){
        if(this.children[this.rightist].x+this.children[this.rightist].width+this.preferences[this.rightist][2]>this.x+this.width-this.padx){
          this.hScrollUtil(-1);
        }
  
      } else {
        let last_elem = this.children[this.children.length-1];
        if(last_elem.x+last_elem.width+this.preferences[this.preferences.length-1][2]>this.x+this.width-this.padx){
          this.hScrollUtil(-1);
        }
      }
    }
    
    hScrollUtil(multiple){
      for(let i=0; i<this.children.length; i++){
        let elem = this.children[i];
        
        if(elem.constructor.name=="ScrollFrame"){
          elem.hScrollUtil(multiple);
        }
        
        elem.x+=multiple*this.scrollSensitivity;
      }
    }
    
    showBanner(){
      if(this.enableVScroll==true){
        this.BannerUtil(1, this.bannerHeight);
      } else {
        this.adjustHeight(this.y + (this.bannerHeight) + this.pady, this.height - (this.bannerHeight) - 2*(this.pady));
      }
      this.isBannerShown=true;
    }
    
    hideBanner(){
      if(this.enableReposition && this.isBannerShown){
        if(this.enableVScroll==true){
          this.BannerUtil(-1, this.bannerHeight);
        } else {
          this.adjustHeight(this.y + this.pady, this.height-2*(this.pady));
        }
        this.isBannerShown=false;
      }
    }
  
    BannerUtil(dir, heightAdjustment){
      for(let i=0; i<this.children.length; i++){
        let curr = this.children[i];
        curr.y += dir*heightAdjustment;
  
        if(curr.constructor.name=="ScrollFrame"){
          curr.BannerUtil(dir, heightAdjustment);
        }
      }
    }
    
    adjustHeight(y, h){
      //[element, weight, padL, padR, padT, padB]
      for(let i=0; i<this.children.length; i++){
  
        let curr = this.children[i];
  
        if(i-1>=0){
          let prev = this.children[i-1];
          if(this.alignment=="v"){
            curr.y = prev.y + prev.height + this.preferences[i-1][4] + this.preferences[i][3];
          } else {
            curr.y = y + this.preferences[i][3];
          }
        } else {
          curr.y = y + this.preferences[i][3];
        }
        
        if(this.enableVScroll==false){
          if(this.alignment=="v"){
            curr.height = (this.preferences[i][0]/(this.totalWeight))*(h) - this.preferences[i][3] - this.preferences[i][4];
          } else {
            curr.height = h - this.preferences[i][3] - this.preferences[i][4];
          }
        }
  
        if(curr.type=="Frame"){
         curr.adjustHeight(curr.y + curr.pady, curr.height - 2*(curr.pady));
        } else {
          if(this.enableVScroll==false){
            curr.updateHeight();
          }
        }
  
      }
    }
  
    adjustWidth(x, w){
      //[element, weight, padL, padR, padT, padB]
      for(let i=0; i<this.children.length; i++){
        let curr = this.children[i];
        if(i-1>=0){
          let prev = this.children[i-1];
          if(this.alignment!="v"){
            curr.x = prev.x + prev.width + this.preferences[i-1][2] + this.preferences[i][1];
          } else {
            curr.x = x + this.preferences[i][1];
          }
        } else {
          curr.x = x + this.preferences[i][1];
        }
  
        if(this.enableHScroll==false){
          if(this.alignment=="v"){
            curr.width = w - this.preferences[i][1] - this.preferences[i][2];
          } else {
            curr.width = (this.preferences[i][0]/(this.totalWeight))*(w) - this.preferences[i][1] - this.preferences[i][2];
          }
        }
  
        if(curr.type=="Frame"){
          curr.adjustWidth(curr.x + curr.padx, curr.width - 2*(curr.padx));
        } else {
          if(this.enableHScroll==false){
            curr.updateWidth();
          }
        }
  
      }
    }
  
    updatePosUtil(xDiff, yDiff){
      for(let i=0; i<this.children.length; i++){
        this.children[i].x -= xDiff;
        this.children[i].y -= yDiff;
        if(this.children[i].type=="Frame"){
          this.children[i].updatePosUtil(xDiff, yDiff);
        }
      }
    }
  }