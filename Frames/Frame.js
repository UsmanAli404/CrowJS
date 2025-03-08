import { FrameComponent } from './FrameComponent.js';

//frame should allow, closing off -> remove it and all of its childern from the root array
//frames should also allow docking -> adding frames in frames

export class Frame extends FrameComponent{
    constructor(x, y, width, height, backgroundColor, borderColor, highlightedBorderColor, borderWidth,
      cornerRadius, padx, pady, bannerHeight, nearestBorderThreshold, parent, type, 
      enableReposition, enableResizing, enableShadow, shadowColor, shadowIntensity, shadowSpread, shadowDetail){
      super(x, y, width, height, {parent: parent, type: type});
  
      this.backgroundColor = backgroundColor;
      this.borderColor = borderColor;
      this.highlightedBorderColor = highlightedBorderColor;
      this.borderWidth = borderWidth;
      this.cornerRadius = cornerRadius;
      this.padx = padx;
      this.pady = pady;
  
      this.enableShadow = enableShadow;
      this.enableReposition = enableReposition;
      this.enableResizing = enableResizing;
  
      if(this.enableReposition){
        this.bannerFlag = false;
        this.bannerHeight = bannerHeight;
        this.xDist = null;
        this.yDist = null;
        this.prevX = null;
        this.prevY = null;
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
    }

    drawEventListener(){};
    updatePosUtil(){};
  
    mouseReleasedEventListener(){
      if(this.enableReposition && this.xDist!=null && this.yDist!=null){
        this.xDist=null;
        this.yDist=null;
      }
    }
  
    checkNearestBorder(){
      if(mouseX>=this.x-this.nearestBorderThreshold && mouseX<=this.x && mouseY>=this.y + this.cornerRadius && mouseY<=this.y+this.height-this.cornerRadius){
        this.nearestBorder = "left";
      } else if(mouseX>=this.x + this.width && mouseX<=this.x + this.width + this.nearestBorderThreshold && mouseY>=this.y+this.cornerRadius && mouseY<=this.y+this.height-this.cornerRadius){
        this.nearestBorder = "right";
      } else if(mouseY>=this.y-this.nearestBorderThreshold && mouseY<=this.y && mouseX>=this.x+this.cornerRadius && mouseX<=this.x+this.width-this.cornerRadius){
        this.nearestBorder = "top";
      } else if(mouseY>=this.y + this.height && mouseY<=this.y + this.height+this.nearestBorderThreshold && mouseX>=this.x+this.cornerRadius && mouseX<=this.x+this.width-this.cornerRadius){
        this.nearestBorder = "bottom";
      } else if(abs(mouseX-this.x)<=this.nearestBorderThreshold && abs(mouseY-this.y)<=this.nearestBorderThreshold){
        this.nearestBorder = "top-left";
      } else if(abs(mouseX-(this.x+this.width))<=this.nearestBorderThreshold && abs(mouseY-this.y)<=this.nearestBorderThreshold){
        this.nearestBorder = "top-right";
      } else if(abs(mouseX-this.x)<=this.nearestBorderThreshold && abs(mouseY - (this.y+this.height))<=this.nearestBorderThreshold){
        this.nearestBorder = "bottom-left";
      } else if(abs(mouseX-(this.x+this.width))<=this.nearestBorderThreshold && abs(mouseY - (this.y+this.height))<=this.nearestBorderThreshold){
        this.nearestBorder = "bottom-right";
      } else {
        this.nearestBorder = null;
      }
    }
  
    showHighlightedBorder(){
      push();
      stroke(this.highlightedBorderColor);
      strokeWeight(this.borderWidth+5);
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
  
    updateDimensions(){
      if(mouseIsPressed){
        //call check function here
        if(this.nearestBorder=="left" || this.nearestBorder=="right"){
          if( this.nearestBorder=="left"){
            if(this.x+this.width-mouseX>=50){
              this.width = this.x + this.width - mouseX;
              this.x = mouseX;
            }
          } else {
            if(mouseX-this.x>=50){
              this.width = mouseX - this.x;
            }
          }
  
          if(this.nearestBorder=="right" && this.xScroll==true){
            return;
          }
  
          this.adjustWidth(this.x + this.padx, this.width - 2*(this.padx));
  
        } else if(this.nearestBorder=="top"||this.nearestBorder=="bottom"){
          if(this.nearestBorder=="top"){
            if(this.y+this.height-mouseY>=50){
              this.height =this.y + this.height - mouseY;
              this.y = mouseY;
            }
          } else {
            if(mouseY-this.y>=50){
              this.height = mouseY - this.y;
            }
          }
          
          if(this.yScroll==true && this.nearestBorder=="bottom"){
            return;
          }
  
          this.adjustHeight(this.y + this.pady, this.height - 2*(this.pady));
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
          this.adjustHeight(this.y + this.pady, this.height - 2*(this.pady));
        }
  
        //console.log("(",this.width,"x",this.height,")");
      }
    }
    
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
  
    clearHoverCache(){
      if(this.enableReposition){
        //gives error in ScrollFrame
        if(this.type=="Frame"){
          this.hideBanner();
        }
        this.xDist=null;
        this.yDist=null;
        this.prevX=null;
        this.prevY=null;
      }
      
      if(this.enableResizing){
        this.nearestBorder=null;
      }
    }

    rgbToArray(shadowColor) {
      let match = shadowColor.match(/\d+/g);
      return match ? match.map(Number) : null;
    }

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