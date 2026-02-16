import {Frame} from './Frame.js';

export class ScrollFrame extends Frame{
  /**
   * Creates a scrollable container for child components
   * @param {number} x - The x-coordinate
   * @param {number} y - The y-coordinate
   * @param {number} width - The width
   * @param {number} height - The height
   * @param {Object} options - Configuration options
   * @param {string|null} options.id - Component ID
   * @param {p5.Color} options.backgroundColor - Background color
   * @param {p5.Color} options.borderColor - Border color
   * @param {p5.Color} options.highlightedBorderColor - Highlighted border color
   * @param {number} options.borderWidth - Border width
   * @param {number} options.cornerRadius - Corner radius
  * @param {number} options.pad - Unified padding for both axes
   * @param {number} options.padx - Horizontal padding
   * @param {number} options.pady - Vertical padding
   * @param {boolean} options.alwaysShowBanner - Always show banner
   * @param {boolean} options.enableVScroll - Enable vertical scrolling
   * @param {boolean} options.enableHScroll - Enable horizontal scrolling
   * @param {number} options.scrollSensitivity - Scroll speed
   * @param {number} options.bannerHeight - Banner height
   * @param {p5.Color|string} options.bannerColor - Banner background color
   * @param {p5.Color|string} options.bannerDotColor - Banner dot indicator color
   * @param {string} options.alignment - Layout alignment ("v" or "h")
   * @param {number} options.nearestBorderThreshold - Border detection threshold
   * @param {Component|null} options.parent - Parent component
   * @param {boolean} options.enableReposition - Allow dragging
   * @param {boolean} options.enableOptimisedReposition - Optimized repositioning
   * @param {boolean} options.enableResizing - Allow resizing
   * @param {boolean} options.enableOptimisedResizing - Optimized resizing
   * @param {boolean} options.enableShadow - Enable shadow
  * @param {string} options.shadowColor - Shadow color (CSS color string)
  * @param {number} options.shadowBlur - Shadow blur radius
  * @param {number} options.shadowOffsetX - Shadow offset on X axis
  * @param {number} options.shadowOffsetY - Shadow offset on Y axis
   * @param {number} options.margin - General margin for all sides
   * @param {number} options.marginx - Horizontal margin (left and right)
   * @param {number} options.marginy - Vertical margin (top and bottom)
   * @param {number} options.marginl - Left margin
   * @param {number} options.marginr - Right margin
   * @param {number} options.margint - Top margin
   * @param {number} options.marginb - Bottom margin
   */
    constructor(x, y, width, height, {
      id=null,
      backgroundColor = color('#1e1e2e'),
      borderColor = color('#3a3a4d'),
      highlightedBorderColor = color('#5a5a7a'),
      borderWidth = 1,
      cornerRadius = 8,
      pad=null,
      padx=null,
      pady=null,
      alwaysShowBanner = false,
      enableVScroll=false,
      enableHScroll=false,
      scrollSensitivity=20,
      bannerHeight=35,
      bannerColor='#2a2a3d',
      bannerDotColor='#6a6a8a',
      alignment="v", //v for vertical, h for horizontal
      nearestBorderThreshold=8,
      parent=null,
      enableReposition=false,
      enableOptimisedReposition=false,
      enableResizing=false,
      enableOptimisedResizing=false,
      enableShadow=false,
      shadowColor= 'rgba(0,0,0,0.5)',
      shadowBlur= 12,
      shadowOffsetX= 0,
      shadowOffsetY= 4,
      margin = 0,
      marginx = null,
      marginy = null,
      marginl = null,
      marginr = null,
      margint = null,
      marginb = null,
      showDebugOverlay = false,
    } = {}) {
      if (pad !== null && pad !== undefined) {
        padx = pad;
        pady = pad;
      }

      if (padx === null || padx === undefined) {
        padx = 0;
      }

      if (pady === null || pady === undefined) {
        pady = 0;
      }

      bannerHeight = bannerHeight%height;
      super(x, y, width, height, id, backgroundColor, borderColor, highlightedBorderColor, borderWidth,
        cornerRadius, padx, pady, alwaysShowBanner, bannerHeight, bannerColor, bannerDotColor, nearestBorderThreshold, parent, "Frame",
        enableReposition, enableOptimisedReposition, enableResizing, enableOptimisedResizing, enableShadow, shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY,
        {margin, marginx, marginy, marginl, marginr, margint, marginb, showDebugOverlay});
      
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

    /**
   * Handles keyboard navigation for scrolling
   * @param {KeyboardEvent} event - The key down event
   */
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
  
    /**
   * Renders the scroll frame and child components
   */
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
        fill(this.bannerColor);
        rect(this.x, this.y, this.width, this.bannerHeight, this.cornerRadius, this.cornerRadius, 0, 0);
  
        fill(this.bannerDotColor);
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
  
    /**
   * Adds a component to the scroll frame with weighted sizing
   * @param {Component} element - The component to add
   * @param {Object} options - Placement options
   * @param {number} options.weight - Proportional weight for sizing
   * @param {number} options.padL - Left padding
   * @param {number} options.padR - Right padding
   * @param {number} options.padT - Top padding
   * @param {number} options.padB - Bottom padding
   */
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

    /**
   * Removes a component from the scroll frame
   * @param {Component} element - The component to remove
   */
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

    /**
   * Sets the weight of a child component
   * @param {number} index - Child index
   * @param {number} weight - New weight value
   */
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

    /**
   * Gets the weight of a child component
   * @param {number} index - Child index
   * @returns {number} The weight value
   */
    getWeight(index){
      if(index<0 || index>this.children.length-1){
        console.log("index out of range! can't set new weight");
        return;
      }

      return this.preferences[index][0];
    }

    /**
   * Sets left padding for a child component
   * @param {number} index - Child index
   * @param {number} padL - Left padding value
   */
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

    /**
   * Gets left padding of a child component
   * @param {number} index - Child index
   * @returns {number} Left padding value
   */
    getPadL(index){
      if(index<0 || index>this.children.length-1){
        console.log("index out of range! can't set new padL");
        return;
      }

      return this.preferences[index][1];
    }

    /**
   * Sets right padding for a child component
   * @param {number} index - Child index
   * @param {number} padR - Right padding value
   */
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

    /**
   * Gets right padding of a child component
   * @param {number} index - Child index
   * @returns {number} Right padding value
   */
    getPadR(index){
      if(index<0 || index>this.children.length-1){
        console.log("index out of range! can't set new padR");
        return;
      }

      return this.preferences[index][2];
    }

    /**
   * Sets top padding for a child component
   * @param {number} index - Child index
   * @param {number} padT - Top padding value
   */
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

    /**
   * Gets top padding of a child component
   * @param {number} index - Child index
   * @returns {number} Top padding value
   */
    getPadT(index){
      if(index<0 || index>this.children.length-1){
        console.log("index out of range! can't set new padT");
        return;
      }

      return this.preferences[index][3];
    }

    /**
   * Sets bottom padding for a child component
   * @param {number} index - Child index
   * @param {number} padB - Bottom padding value
   */
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

    /**
   * Gets bottom padding of a child component
   * @param {number} index - Child index
   * @returns {number} Bottom padding value
   */
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
    /**
   * Finds the topmost child component
   */
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
    /**
   * Finds the bottommost child component
   */

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
    /**
   * Finds the leftmost child component
   */
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
    /**
   * Finds the rightmost child component
   */
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
    /**
   * Scrolls content downward
   */
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
    /**
   * Scrolls content upward
   */
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
    /**
   * Utility method for vertical scrolling
   * @param {number} multiple - Scroll direction and multiplier
   */
    vScrollUtil(multiple){
      for(let i=0; i<this.children.length; i++){
        let elem = this.children[i];
        
        if(elem.constructor.name=="ScrollFrame"){
          elem.vScrollUtil(multiple);
        }
        
        elem.y+=multiple*this.scrollSensitivity;
      }
    }
    /**
   * Scrolls content to the left
   */
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
    /**
   * Scrolls content to the right
   */
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
    /**
   * Utility method for horizontal scrolling
   * @param {number} multiple - Scroll direction and multiplier
   */
    hScrollUtil(multiple){
      for(let i=0; i<this.children.length; i++){
        let elem = this.children[i];
        
        if(elem.constructor.name=="ScrollFrame"){
          elem.hScrollUtil(multiple);
        }
        
        elem.x+=multiple*this.scrollSensitivity;
      }
    }
    /**
   * Shows banner and adjusts content position
   */
    showBanner(){
      if(this.enableVScroll==true){
        this.BannerUtil(1, this.bannerHeight);
      } else {
        this.adjustHeight(this.y + (this.bannerHeight) + this.pady, this.height - (this.bannerHeight) - 2*(this.pady));
      }
      this.isBannerShown=true;
    }
    /**
   * Hides banner and adjusts content position
   */
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
  /**
   * Utility for banner visibility changes
   * @param {number} dir - Direction (1 for show, -1 for hide)
   * @param {number} heightAdjustment - Height adjustment amount
   */
    BannerUtil(dir, heightAdjustment){
      for(let i=0; i<this.children.length; i++){
        let curr = this.children[i];
        curr.y += dir*heightAdjustment;
  
        if(curr.constructor.name=="ScrollFrame"){
          curr.BannerUtil(dir, heightAdjustment);
        }
      }
    }
    /**
   * Adjusts child component heights based on weights and alignment
   * @param {number} y - Starting y position
   * @param {number} h - Available height
   */
    adjustHeight(y, h){
      let len = this.children.length;
      let invWeight = this.totalWeight > 0 ? 1 / this.totalWeight : 0;
      for(let i=0; i<len; i++){
  
        let curr = this.children[i];
        let pref = this.preferences[i];
  
        if(i > 0){
          let prev = this.children[i-1];
          if(this.alignment=="v"){
            curr.y = prev.y + prev.height + prev.marginb + this.preferences[i-1][4] + curr.margint + pref[3];
          } else {
            curr.y = y + curr.margint + pref[3];
          }
        } else {
          curr.y = y + curr.margint + pref[3];
        }
        
        if(this.enableVScroll==false){
          if(this.alignment=="v"){
            curr.height = (pref[0] * invWeight) * h - pref[3] - pref[4] - curr.margint - curr.marginb;
          } else {
            curr.height = h - pref[3] - pref[4] - curr.margint - curr.marginb;
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
    /**
   * Adjusts child component widths based on weights and alignment
   * @param {number} x - Starting x position
   * @param {number} w - Available width
   */
    adjustWidth(x, w){
      let len = this.children.length;
      let invWeight = this.totalWeight > 0 ? 1 / this.totalWeight : 0;
      for(let i=0; i<len; i++){
        let curr = this.children[i];
        let pref = this.preferences[i];
        if(i > 0){
          let prev = this.children[i-1];
          if(this.alignment!="v"){
            curr.x = prev.x + prev.width + prev.marginr + this.preferences[i-1][2] + curr.marginl + pref[1];
          } else {
            curr.x = x + curr.marginl + pref[1];
          }
        } else {
          curr.x = x + curr.marginl + pref[1];
        }
  
        if(this.enableHScroll==false){
          if(this.alignment=="v"){
            curr.width = w - pref[1] - pref[2] - curr.marginl - curr.marginr;
          } else {
            curr.width = (pref[0] * invWeight) * w - pref[1] - pref[2] - curr.marginl - curr.marginr;
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
    /**
   * Updates child positions during frame movement
   * @param {number} xDiff - X position difference
   * @param {number} yDiff - Y position difference
   */
    updatePosUtil(xDiff, yDiff){
      let len = this.children.length;
      for(let i=0; i<len; i++){
        let child = this.children[i];
        child.x -= xDiff;
        child.y -= yDiff;
        if(child.type==="Frame"){
          child.updatePosUtil(xDiff, yDiff);
        }
      }
    }
  }