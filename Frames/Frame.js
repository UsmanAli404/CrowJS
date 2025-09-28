import { GUIEvent } from '../Core/GUIEvent/GUIEvent.js';
import { DummyFrame } from './DummyFrame.js';
import { FrameComponent } from './FrameComponent.js';

//frame should allow, closing off -> remove it and all of its childern from the root array
//frames should also allow docking -> adding frames in frames

export class Frame extends FrameComponent{
  /**
   * Creates a resizable and draggable frame container
   * @param {number} x - The x-coordinate
   * @param {number} y - The y-coordinate
   * @param {number} width - The width
   * @param {number} height - The height
   * @param {string|null} id - Component ID
   * @param {p5.Color} backgroundColor - Background color
   * @param {p5.Color} borderColor - Border color
   * @param {p5.Color} highlightedBorderColor - Highlighted border color
   * @param {number} borderWidth - Border width
   * @param {number} cornerRadius - Corner radius
   * @param {number} padx - Horizontal padding
   * @param {number} pady - Vertical padding
   * @param {boolean} alwaysShowBanner - Whether to always show the banner
   * @param {number} bannerHeight - Height of the top banner
   * @param {number} nearestBorderThreshold - Distance threshold for border detection
   * @param {Component|null} parent - Parent component
   * @param {string} type - Component type
   * @param {boolean} enableReposition - Allow dragging
   * @param {boolean} enableOptimisedReposition - Use optimized repositioning
   * @param {boolean} enableResizing - Allow resizing
   * @param {boolean} enableOptimisedResizing - Use optimized resizing
   * @param {boolean} enableShadow - Enable shadow rendering
   * @param {string} shadowColor - Shadow color
   * @param {number} shadowIntensity - Shadow opacity
   * @param {number} shadowSpread - Shadow spread
   * @param {number} shadowDetail - Number of shadow layers
   */
    constructor(x, y, width, height, id, backgroundColor, borderColor, highlightedBorderColor, borderWidth,
      cornerRadius, padx, pady, alwaysShowBanner, bannerHeight, nearestBorderThreshold, parent, type, 
      enableReposition, enableOptimisedReposition, enableResizing, enableOptimisedResizing, enableShadow, shadowColor, shadowIntensity, shadowSpread, shadowDetail){
      super(x, y, width, height, {parent: parent, type: type, id: id});
  
      this.backgroundColor = backgroundColor;
      this.borderColor = borderColor;
      this.highlightedBorderColor = highlightedBorderColor;
      this.borderWidth = borderWidth;
      this.cornerRadius = cornerRadius;
      this.padx = padx;
      this.pady = pady;
  
      this.enableShadow = enableShadow;
      this.enableReposition = enableReposition;
      this.enableOptimisedReposition = enableOptimisedReposition;
      this.enableResizing = enableResizing;
      this.enableOptimisedResizing = enableOptimisedResizing;
      this.alwaysShowBanner = alwaysShowBanner;

      if(this.enableReposition || this.alwaysShowBanner){
        this.bannerHeight = bannerHeight;
        
        if(this.enableReposition){
          this.isBannerShown = false;
          this.xDist = null;
          this.yDist = null;
          this.prevX = null;
          this.prevY = null;
        }

        if(this.alwaysShowBanner){
          this.isBannerShown = true;
        }
      }

      if(this.enableResizing){
        this.nearestBorder = null;
        this.nearestBorderThreshold = nearestBorderThreshold;
      }

      if(this.enableShadow){
        this.shadowColor = shadowColor;//rgb value
        this.shadowIntensity = shadowIntensity;//opacity value between 0 and 1
        this.shadowSpread = shadowSpread;//stroke width of each of those rectangles
        this.shadowDetail = shadowDetail;//number of rectangles that will be drawn around the component
      }

      this.addEventListener("hover", (event) => this.onMouseHover(event));
      this.addEventListener("mouseLeave", (event)=> this.onMouseLeave(event));
      this.addEventListener("drag", (event)=> this.onMouseDrag(event));
      this.addEventListener("press", (event) => this.onMouseBtnPress(event));
      this.addEventListener("release", (event) => this.onMouseRelease(event));
      this.addEventListener("resize", (event) => this.onResize(event));
      this.addEventListener("reposition", (event) => this.onRepos(event));
    }

    /**
   * Handles frame resize events
   * @param {GUIEvent} event - The resize event
   */
    onResize(event){
      console.log("resizing...");
    }

    /**
   * Handles frame reposition events
   * @param {GUIEvent} event - The reposition event
   */
    onRepos(event){
      console.log("repositioning...")
    }

    /**
   * Handles mouse button release events
   * @param {GUIEvent} event - The release event
   */
    onMouseRelease(event){
      if(!this.isOverBannerArea()){
        cursor("");
      }
    }

    /**
   * Handles mouse leave events
   * @param {GUIEvent} event - The mouse leave event
   */
    onMouseLeave(event){
      // console.log("mouse left...");
      this.clearHoverCache();
      cursor("");
    }

    /**
   * Checks if cursor is near any border for resizing
   * @returns {boolean} True if cursor is near a border
   */
    isNearBorder(){
      return this.nearestBorder!==null;
    }

    /**
   * Handles mouse hover events for banner and cursor changes
   * @param {GUIEvent} event - The hover event
   */
    onMouseHover(event){
      // console.log("mouse hovering...");
      if(this.enableResizing) {
        this.checkAndFindNearestBorder();
        if(this.isNearBorder()){
          if(this.isBannerShown){
            this.clearHoverCache({clearResizingCache:false});
          }
          return;
        }
      }

      if(this.enableReposition && this.isOverBannerArea() && !mouseIsPressed){
        cursor("grab");
      }

      if(!this.isOverBannerArea()){
        cursor("");
      }

      if(this.isOverBannerArea() && (this.enableReposition && !this.isBannerShown)) {
        this.showBanner();
      } else {
        if(!this.isOverBannerArea()) {
          if(this.enableReposition && this.isBannerShown){
            this.clearHoverCache({clearResizingCache:false});
          }

          if(!this.alwaysShowBanner){
            this.hideBanner();
          }
        }
      }
    }

    /**
   * Handles mouse button press events for dragging and resizing
   * @param {GUIEvent} event - The press event
   */
    onMouseBtnPress(event) {
      if(this.enableResizing && this.isNearBorder()){
        //dummy resize frame
        if(this.enableOptimisedResizing){
          this.createDummyFrame(DummyFrame.RESIZE_DF);
        }

        return;
      }
      
      if(this.isOverBannerArea()){
        if(this.enableReposition) {
          cursor("grabbing");
          this.xDist = mouseX - this.x;
          this.yDist = mouseY - this.y;

          //dummy reposition frame
          if(this.enableOptimisedReposition){
            this.createDummyFrame(DummyFrame.REPOSITION_DF);
          }
        }
      }
    }

    /**
   * Checks if the frame is currently being repositioned
   * @returns {boolean} True if repositioning is in progress
   */
    isRepositioning(){
      return (this.xDist!=null && this.yDist!=null);
    }

    /**
   * Handles mouse drag events for resizing and repositioning
   * @param {GUIEvent} event - The drag event
   */
    onMouseDrag(event){
      if(this.enableResizing){
        if(this.isNearBorder() && !this.isRepositioning()){
          this.updateDimensions();
          this.dispatchTrickleDownEvent(new GUIEvent(event.x, event.y, "resize", this));
          return;
        }
      }

      if(this.enableReposition && this.isRepositioning()){
        this.updatePosition();
        this.dispatchTrickleDownEvent(new GUIEvent(event.x, event.y, "reposition", this));
      }
    }

    /**
   * Creates a temporary dummy frame for smooth resizing/repositioning
   * @param {string} type - Type of dummy frame (RESIZE_DF or REPOSITION_DF)
   */
    createDummyFrame(type){
      let DF = new DummyFrame(this.x, this.y, this.width, this.height, type);
      DF.parent = this;
      DF.root = this.root;

      if(type === DummyFrame.RESIZE_DF){
        DF.nearestBorder = this.nearestBorder;
      } else if(type === DummyFrame.REPOSITION_DF){
        DF.xDist = this.xDist;
        DF.yDist = this.yDist;
      }

      this.root.add(DF);
      this.root.activeElement = DF;

      // console.log(DF);
    }

    /**
   * Checks if mouse is over the banner area
   * @returns {boolean} True if mouse is over the banner
   */
    isOverBannerArea(){
      return (mouseX>this.x && mouseX<this.x+this.width && mouseY>this.y && mouseY<this.y+(this.bannerHeight));
    }

    /**
   * Utility method for position updates (to be overridden)
   */
    updatePosUtil(){};
  
    /**
   * Handles mouse release events for repositioning
   */
    mouseReleasedEventListener(){
      if(this.enableReposition && this.isRepositioning()){
        this.xDist=null;
        this.yDist=null;
      }
    }
  
    /**
   * Detects which border is nearest to the cursor for resizing
   */
    checkAndFindNearestBorder(){
      if(mouseX>=this.x && mouseX<=this.x+this.nearestBorderThreshold && mouseY>=this.y+this.cornerRadius && mouseY<=this.y+this.height-this.cornerRadius){
        this.nearestBorder = "left";
        cursor("ew-resize");
      } else if(mouseX>=this.x + this.width - this.nearestBorderThreshold && mouseX<=this.x + this.width && mouseY>=this.y+this.cornerRadius && mouseY<=this.y+this.height-this.cornerRadius){
        this.nearestBorder = "right";
        cursor("ew-resize");
      } else if(mouseY>=this.y && mouseY<=this.y+this.nearestBorderThreshold && mouseX>=this.x+this.cornerRadius && mouseX<=this.x+this.width-this.cornerRadius){
        this.nearestBorder = "top";
        cursor("ns-resize");
      } else if(mouseY>=this.y +this.height - this.nearestBorderThreshold && mouseY<=this.y + this.height && mouseX>=this.x+this.cornerRadius && mouseX<=this.x+this.width-this.cornerRadius){
        this.nearestBorder = "bottom";
        cursor("ns-resize");
      } else if(abs(mouseX-this.x)<=this.nearestBorderThreshold && abs(mouseY-this.y)<=this.nearestBorderThreshold){
        this.nearestBorder = "top-left";
        cursor("nwse-resize");
      } else if(abs(mouseX-(this.x+this.width))<=this.nearestBorderThreshold && abs(mouseY-this.y)<=this.nearestBorderThreshold){
        this.nearestBorder = "top-right";
        cursor("nesw-resize");
      } else if(abs(mouseX-this.x)<=this.nearestBorderThreshold && abs(mouseY - (this.y+this.height))<=this.nearestBorderThreshold){
        this.nearestBorder = "bottom-left";
        cursor("nesw-resize");
      } else if(abs(mouseX-(this.x+this.width))<=this.nearestBorderThreshold && abs(mouseY - (this.y+this.height))<=this.nearestBorderThreshold){
        this.nearestBorder = "bottom-right";
        cursor("nwse-resize");
      } else {
        this.nearestBorder = null;
      }
    }
  
    /**
   * Draws highlighted borders when cursor is near them
   */
    showHighlightedBorder(){
      push();
      stroke(this.highlightedBorderColor);
      strokeWeight(this.borderWidth+2);
      if(this.nearestBorder=="left"){
        line(this.x, this.y+this.cornerRadius, this.x, this.y+this.height-this.cornerRadius);
      } else if(this.nearestBorder=="right"){
        line(this.x+this.width, this.y+this.cornerRadius, this.x+this.width, this.y+this.height-this.cornerRadius);
      } else if(this.nearestBorder=="top"){
        line(this.x+this.cornerRadius, this.y, this.x+this.width-this.cornerRadius, this.y);
      } else if(this.nearestBorder=="bottom"){
        line(this.x+this.cornerRadius, this.y+this.height, this.x+this.width-this.cornerRadius, this.y+this.height);
      } else {
        noFill();
        strokeWeight(6);
        if(this.nearestBorder=="top-left"){
          arc(this.x+this.cornerRadius, this.y+this.cornerRadius, 2*this.cornerRadius, 2*this.cornerRadius, PI, PI+HALF_PI);
        } else if(this.nearestBorder=="top-right"){
          arc(this.x+this.width-this.cornerRadius, this.y+this.cornerRadius, 2*this.cornerRadius, 2*this.cornerRadius, PI+HALF_PI, TWO_PI);
        } else if(this.nearestBorder=="bottom-left"){
          arc(this.x+this.cornerRadius, this.y+this.height-this.cornerRadius, 2*this.cornerRadius, 2*this.cornerRadius, HALF_PI, PI);
        } else if(this.nearestBorder=="bottom-right"){
          arc(this.x+this.width-this.cornerRadius, this.y+this.height-this.cornerRadius, 2*this.cornerRadius, 2*this.cornerRadius, 0, HALF_PI);
        }
      }
      pop();
    }

    //corrects position and dimensions of all the child elements so that
    //they fit right in the parent frame
    /**
   * Adjusts child components to fit within the frame's new dimensions
   */
    redraw(){
      if(this.alwaysShowBanner || (this.isOverBannerArea() && this.enableReposition && !this.isBannerShown)){
        this.adjustHeight(this.y + (this.bannerHeight) + this.pady, this.height - (this.bannerHeight) - 2*(this.pady));
      } else {
        this.adjustHeight(this.y+this.pady, this.height-2*this.pady);
      }
      
      this.adjustWidth(this.x+this.padx, this.width-2*this.padx);
    }
    /**
   * Updates frame dimensions during resizing
   */
    updateDimensions(){
      if(this.nearestBorder=="left" || this.nearestBorder=="right"){
        if( this.nearestBorder=="left"){
          if(this.x+this.width-mouseX>=this.bannerHeight){
            this.width = this.x + this.width - mouseX;
            this.x = mouseX;
          }
        } else {
          if(mouseX-this.x>=this.bannerHeight){
            this.width = mouseX - this.x;
          }
        }

        if(this.nearestBorder=="right" && this.xScroll==true){
          return;
        }

        this.adjustWidth(this.x + this.padx, this.width - 2*(this.padx));

      } else if(this.nearestBorder=="top"||this.nearestBorder=="bottom"){
        if(this.nearestBorder=="top"){
          if(this.y+this.height-mouseY>=this.bannerHeight){
            this.height =this.y + this.height - mouseY;
            this.y = mouseY;
          }
        } else {
          if(mouseY-this.y>=this.bannerHeight){
            this.height = mouseY - this.y;
          }
        }
        
        if(this.yScroll==true && this.nearestBorder=="bottom"){
          return;
        }

        if(this.alwaysShowBanner){
          this.adjustHeight(this.y + (this.bannerHeight) + this.pady, this.height - (this.bannerHeight) - 2*(this.pady));
        } else {
          this.adjustHeight(this.y+this.pady, this.height-2*this.pady);
        }

      } else {
        if(this.nearestBorder=="top-left"){
          if(this.x+this.width-mouseX>=50){
            this.width = this.x + this.width - mouseX;
            this.x = mouseX;
          }

          if(this.y+this.height-mouseY>=50){
            this.height =this.y + this.height - mouseY;
            this.y = mouseY;
          }
        } else if(this.nearestBorder=="top-right"){
          if(mouseX-this.x>=50){
            this.width = mouseX - this.x;
          }

          if(this.y+this.height-mouseY>=50){
            this.height =this.y + this.height - mouseY;
            this.y = mouseY;
          }
        } else if(this.nearestBorder=="bottom-left"){
          if(this.x+this.width-mouseX>=50){
            this.width = this.x + this.width - mouseX;
            this.x = mouseX;
          }

          if(mouseY-this.y>=50){
            this.height = mouseY - this.y;
          }
        } else if(this.nearestBorder=="bottom-right"){
          if(mouseX-this.x>=50){
            this.width = mouseX - this.x;
          }

          if(mouseY-this.y>=50){
            this.height = mouseY - this.y;
          }
        }

        this.adjustWidth(this.x + this.padx, this.width - 2*(this.padx));
        if(this.alwaysShowBanner){
          this.adjustHeight(this.y + (this.bannerHeight) + this.pady, this.height - (this.bannerHeight) - 2*(this.pady));
        } else {
          this.adjustHeight(this.y+this.pady, this.height-2*this.pady);
        }
      }
    }
    /**
   * Updates frame position during dragging
   */
    updatePosition(){
      this.prevX = this.x;
      this.prevY = this.y;
  
      this.x = mouseX - abs(this.xDist);
      this.y = mouseY - abs(this.yDist);
  
      if(this.prevX-this.x==0 && this.prevY-this.y==0){
        return;
      }
  
      //console.log("(",this.x,",",this.y,")");
      
      this.updatePosUtil(this.prevX-this.x, this.prevY-this.y);
    }
   /**
   * Clears hover and interaction cache
   * @param {Object} options - Clear options
   * @param {boolean} options.clearRepositionCache - Clear reposition cache
   * @param {boolean} options.clearResizingCache - Clear resizing cache
   */
    clearHoverCache({clearRepositionCache=true, clearResizingCache=true}={}){
      // console.log("Hover cache cleared...");
      if(clearRepositionCache && this.enableReposition){
        if(!this.alwaysShowBanner){
          this.hideBanner();
        }

        this.xDist=null;
        this.yDist=null;
        this.prevX=null;
        this.prevY=null;
        // console.log("reposition cache removed...");
      }
      
      if(clearResizingCache && this.enableResizing){
        this.nearestBorder=null;
        // console.log("resizing cache removed...");
      }

      // console.log("");
    }
    /**
   * Converts RGB color string to array
   * @param {string} shadowColor - RGB color string
   * @returns {number[]|null} Array of RGB values or null
   */
    rgbToArray(shadowColor) {
      let match = shadowColor.match(/\d+/g);
      return match ? match.map(Number) : null;
    }
    /**
   * Renders shadow effect around the frame
   * @param {Object} options - Shadow options
   */
    drawShadow({}={}){
      let color = this.rgbToArray(this.shadowColor);
      if(color==null){
        console.log("shadow color value is not in the correct format: rgb(0,0,0)");
        return;
      }

      if(this.shadowIntensity>1){
        this.shadowIntensity=1;
        console.log("shadow intensity should be between 0 and 1 inclusive.\nAny value given outside of the range will be clipped to the ends.");
      } else if(this.shadowIntensity<0){
        console.log("shadow intensity should be between 0 and 1 inclusive.\nAny value given outside of the range will be clipped to the ends.");
        this.shadowIntensity=0;
      }

      for(let i=1; i<=this.shadowDetail; i++){
        push();
        noFill();
        let alpha = this.shadowIntensity * pow(1 - i / this.shadowDetail, 2);
        stroke(`rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`);
        strokeWeight(this.shadowSpread);
        rect(this.x-((i*this.shadowSpread)/2), this.y-((i*this.shadowSpread)/2), this.width+(i*this.shadowSpread), this.height+(i*this.shadowSpread), this.cornerRadius);
        pop();
      }
    }
  }