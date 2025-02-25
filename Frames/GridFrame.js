import {Frame} from './Frame.js';

export class GridFrame extends Frame{
    constructor(x, y, width, height, {
      backgroundColor = color(255),
      borderColor = color(0),
      highlightedBorderColor = color(0),
      borderWidth = 1,
      cornerRadius = 0,
      padx=0,
      pady=0,
      rows=1,
      cols=1,
      nearestBorderThreshold=5,
      bannerHeight=50,
      parent=null,
      enableReposition=false,
      enableResizing=false,
      enableShadow=false,
      shadowColor= 'rgb(0,0,0)',
      shadowIntensity= 0.4,
      shadowSpread= 3,
      shadowDetail=5,
    }
    ){
      bannerHeight = bannerHeight%height;
      super(x, y, width, height, backgroundColor, borderColor, highlightedBorderColor, borderWidth,
        cornerRadius, padx, pady, bannerHeight, nearestBorderThreshold, parent, "Frame",
        enableReposition, enableResizing, enableShadow, shadowColor, shadowIntensity, shadowSpread, shadowDetail);

      //for storing child elements
      this.rows=rows;
      this.cols=cols;
      this.rowWeights = [];
      this.colWeights = [];
      this.grid=null;
      this.totalRowWeight = 0;
      this.totalColWeight = 0;
    }
  
    add(element, row, col, {
      rowSpan=1,
      colSpan=1,
      padL=0,
      padR=0,
      padT=0,
      padB=0
    }={})
    {
      if(row<0 || row>=this.rows || col<0 || col>=this.cols){
        console.log("index out of range; can't add the element at (",row,",",col,")");
        return;
      }
      if(this.grid[row][col]!=null){
        console.log("Grid cell (",row,",",col,") already taken");
        return;
      }
  
      element.parent=this;
      this.grid[row][col] = [element, rowSpan, colSpan, padL, padR, padT, padB];
      this.adjustToGrid(row, col, rowSpan, colSpan);
    }
    
    rowConfig(rowNum, weight){
      if(rowNum<0 || rowNum>=this.rows){
        return;
      }
      if(this.rowWeights[rowNum]!=null){
        this.totalRowWeight-=this.rowWeights[rowNum];
      }
      this.rowWeights[rowNum] = weight;
      this.totalRowWeight+=weight;
    }
  
    colConfig(colNum, weight){
      if(colNum<0 || colNum>=this.cols){
        return;
      }
      if(this.colWeights[colNum]!=null){
        this.totalColWeight-=this.colWeights[colNum];
      }
      this.colWeights[colNum] = weight;
      this.totalColWeight+=weight;
    }
  
    gridConfig(rows, cols){
      this.rows = rows;
      this.cols = cols;
  
      for(let i=0; i<this.rows; i++){
        this.rowConfig(i, 1);
      }
  
      for(let i=0; i<this.cols; i++){
        this.colConfig(i, 1);
      }
  
      this.grid = new Array(this.rows);
      for(let i=0; i<this.rows; i++){
        this.grid[i] = new Array(this.cols);
      }
  
      for(let i=0; i<this.rows; i++){
        for(let j=0; j<this.cols; j++){
          this.grid[i][j]=null;
        }
      }
    }
  
    adjustWidth(x, w){
      //[element, rowSpan, colSpan, padL, padR, padT, padB];
      for(let i=0; i<this.cols; i++){
        for(let j=0; j<this.rows; j++){
          if(this.grid[j][i]!=null && this.grid[j][i]!="taken"){
            let curr = this.grid[j][i];
  
            curr[0].x = x + curr[3];
            curr[0].width = 0;
  
            for(let k=0; k<curr[2]; k++){
              curr[0].width += (this.colWeights[i+k]/this.totalColWeight) * w;
            }
  
            curr[0].width -= curr[3] + curr[4];
  
            if(curr[0].type=="Frame"){
              curr[0].adjustWidth(curr[0].x + curr[0].padx, curr[0].width - 2*curr[0].padx);
            } else {
              curr[0].updateWidth();
            }
  
          }
        }
  
        x += (this.colWeights[i]/this.totalColWeight) * w;
      }
    }
  
    adjustHeight(y, h){
      //[element, rowSpan, colSpan, padL, padR, padT, padB];
      for(let i=0; i<this.rows; i++){
        for(let j=0; j<this.cols; j++){
          if(this.grid[i][j]!=null && this.grid[i][j]!="taken"){
            let curr = this.grid[i][j];
  
            curr[0].y = y + curr[5];
            curr[0].height = 0;
  
            for(let k=0; k<curr[1]; k++){
              curr[0].height += (this.rowWeights[i+k]/this.totalRowWeight) * h;
            }
  
            curr[0].height -= curr[5] + curr[6];
  
            console.log("curr[0].type:"+curr[0].type);

            if(curr[0].type=="Frame"){
              curr[0].adjustHeight(curr[0].y + curr[0].pady, curr[0].height - 2*curr[0].pady);
            } else {
              curr[0].updateHeight();
            }
          }
        }
  
        y += (this.rowWeights[i]/this.totalRowWeight) * h;
      }
    }
  
    //to make the element fit into the grid cell
    adjustToGrid(row, col, rowSpan, colSpan){
      let x = this.x + this.padx;
      let y = this.y + this.pady;
  
      let w = this.width - 2*this.padx;
      let h = this.height - 2*this.pady;
  
      for(let i=0; i<col; i++){
        x += (this.colWeights[i]/this.totalColWeight) * w;
      }
      
      for(let i=0; i<row; i++){
        y += (this.rowWeights[i]/this.totalRowWeight) * h;
      }
  
      this.grid[row][col][0].x = x + this.grid[row][col][3];
      this.grid[row][col][0].y = y + this.grid[row][col][5];
  
      this.expandElement(row, col, rowSpan, colSpan);
  
      //this.storeProportions(row, col);
  
      if(this.grid[row][col][0].constructor.name=="GridFrame"){
        this.grid[row][col][0].adjustWidth(this.grid[row][col][0].x + this.grid[row][col][0].padx, this.grid[row][col][0].width - 2*this.grid[row][col][0].padx);
        this.grid[row][col][0].adjustHeight(this.grid[row][col][0].y + this.grid[row][col][0].pady, this.grid[row][col][0].height - 2*this.grid[row][col][0].pady);
      } else if(this.grid[row][col][0].constructor.name=="ScrollFrame"){
        this.grid[row][col][0].correctPosAndDim();
      } else {
        this.grid[row][col][0].updateWidth();
        if(this.grid[row][col][0].constructor.name!="Label"){
          this.grid[row][col][0].updateHeight();
        }
      }
    }
  
    //expand the element to as much grid cells as possible
    //while keeping the desired row and col spans in consideration
    expandElement(row, col, rowSpan, colSpan){
      let xLimit = 0;
      let yLimit = 0;
      let rBoundary = rowSpan+row-1;
      let cBoundary = colSpan+col-1;
  
      if(rBoundary>=this.rows){
        rBoundary = this.rows-1;
      }
  
      if(cBoundary>=this.cols){
        cBoundary = this.cols-1;
      }
  
      for(let i=row+1; i<=rBoundary; i++){
        if(this.grid[i][col]==null){
          yLimit++;
        } else {
          console.log("can't expand beyond row ",row+yLimit," since there's a non-null element in row ",row+yLimit+1);
          break;
        }
      }
      
      let breakFlag=false;
      for(let j=col+1; j<=cBoundary; j++){
        xLimit++;
        for(let i=row; i<=yLimit+row; i++){
          if(this.grid[i][j]!=null){
            if(xLimit>0){
              xLimit--;
              console.log("can't expand beyond col ",col+xLimit," since there's a non-null element in col ",col+xLimit+1);
            }
            breakFlag=true;
            break;
          }
        }
        if(breakFlag){
          break;
        }
      }
  
      let w=0;
      let h=0;
      for(let i=row; i<=row+yLimit; i++){
        h += (this.rowWeights[i]/this.totalRowWeight) * (this.height - 2*this.pady);
      }
  
      for(let j=col; j<=col+xLimit; j++){
        w += (this.colWeights[j]/this.totalColWeight) * (this.width - 2*this.padx);
      }
  
      for(let i=row; i<=row+yLimit; i++){
        for(let j=col; j<=col+xLimit; j++){
          if(this.grid[i][j]==null){
            this.grid[i][j]="taken";
          }
        }
      }
  
      this.grid[row][col][0].width = w - this.grid[row][col][3] - this.grid[row][col][4];
      this.grid[row][col][0].height = h - this.grid[row][col][5] - this.grid[row][col][6];
      //this.grid[row][col] = [element, rowSpan, colSpan, padL, padR, padT, padB];
      //console.log(this.grid[row][col][1], this.grid[row][col][2]);
      this.grid[row][col][1] = yLimit+1;
      this.grid[row][col][2] = xLimit+1;
      //console.log(this.grid[row][col][1], this.grid[row][col][2]);
    }
    
    showBanner(){
      this.adjustHeight(this.y + (this.bannerHeight) + this.pady, this.height - (this.bannerHeight) - 2*(this.pady));
      this.bannerFlag=true;
    }
    
    hideBanner(){
      this.adjustHeight(this.y + this.pady, this.height-2*(this.pady));
      this.bannerFlag=false;
    }
  
    updatePosUtil(xDiff, yDiff){
      for(let i=0; i<this.rows; i++){
        for(let j=0; j<this.cols; j++){
          if(this.grid[i][j]!=null && this.grid[i][j]!="taken"){
            this.grid[i][j][0].x -= xDiff;
            this.grid[i][j][0].y -= yDiff;
            if(this.grid[i][j][0].type=="Frame"){
              this.grid[i][j][0].updatePosUtil(xDiff, yDiff);
            }
          }
        }
      }
    }
  
    drawEventListener(){
      let cursorOverFrame = this.isCursorHoveringOver();
  
      if(cursorOverFrame){
        if(!(mouseIsPressed && this.nearestBorder!=null) && mouseX>this.x && mouseX<this.x+this.width && mouseY>this.y && mouseY<this.y+(this.bannerHeight)){
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
        this.updateDimensions();
      }
  
      if(this.enableReposition && mouseIsPressed && this.xDist!=null && this.yDist!=null){
        this.updatePosition();
      }
  
      return cursorOverFrame;
    }
  
    show(){

      //shadow
      if(this.enableShadow){
        this.drawShadow();
      }

      //applying background color
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
  
      //displaying all the child elements
      for(let i=0; i<this.rows; i++){
        for(let j=0; j<this.cols; j++){
          if(this.grid[i][j]!=null && this.grid[i][j]!="taken"){
            this.grid[i][j][0].show();
          }
        }
      }
  
      //showing the top banner
      if(this.enableReposition && this.bannerFlag==true){
        noStroke();
        fill(0);
        rect(this.x, this.y, this.width, this.bannerHeight);
  
        fill(255);        
        ellipse(this.x+this.width/2,
           this.y+(this.bannerHeight)/2,
           (this.bannerHeight)/4,
           (this.bannerHeight)/4);
        ellipse(this.x+this.width/2 - (this.bannerHeight)/2,
         this.y+(this.bannerHeight)/2, (this.bannerHeight)/4,
        (this.bannerHeight)/4);
        ellipse(this.x+this.width/2 + (this.bannerHeight)/2,
        this.y+(this.bannerHeight)/2,
        (this.bannerHeight)/4,
        (this.bannerHeight)/4);
      }
  
      pop();
  
      //showing the border
      if(this.borderColor!=null){
        push();
        stroke(this.borderColor);
        strokeWeight(this.borderWidth);
        noFill();
        rect(this.x, this.y, this.width, this.height, this.cornerRadius);
        pop();
      }

      //highlighting the relevant border if cursor is sufficiently near to it
      if(this.enableResizing && this.nearestBorder!=null){
        this.showHighlightedBorder();
      }
    }
  }