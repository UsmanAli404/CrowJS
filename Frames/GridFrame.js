import {Frame} from './Frame.js';

export class GridFrame extends Frame{
  /**
   * Creates a grid-based layout container
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
   * @param {number} options.rows - Number of rows in grid
   * @param {number} options.cols - Number of columns in grid
   * @param {number} options.nearestBorderThreshold - Border detection threshold
   * @param {number} options.bannerHeight - Banner height
   * @param {p5.Color|string} options.bannerColor - Banner background color
   * @param {p5.Color|string} options.bannerDotColor - Banner dot indicator color
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
      rows=1,
      cols=1,
      nearestBorderThreshold=8,
      bannerHeight=35,
      bannerColor='#2a2a3d',
      bannerDotColor='#6a6a8a',
      parent=null,
      enableReposition=false,
      enableOptimisedReposition=false,
      enableResizing=false,
      enableOptimisedResizing=false,
      enableShadow=false,
      shadowColor= 'rgba(0,0,0,0.5)',
      shadowBlur = 12,
      shadowOffsetX = 0,
      shadowOffsetY = 4,
      margin = 0,
      marginx = null,
      marginy = null,
      marginl = null,
      marginr = null,
      margint = null,
      marginb = null,
      showDebugOverlay = false,
    }
    ){
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

      //for storing child elements
      this.rows=rows;
      this.cols=cols;
      this.rowWeights = [];
      this.colWeights = [];
      this.grid=null;
      this.totalRowWeight = 0;
      this.totalColWeight = 0;
    }
  
    /**
   * Adds an element to the grid at specified position
   * @param {Component} element - The component to add
   * @param {number} row - Grid row index
   * @param {number} col - Grid column index
   * @param {Object} options - Placement options
   * @param {number} options.rowSpan - Number of rows to span
   * @param {number} options.colSpan - Number of columns to span
   * @param {number} options.padL - Left padding
   * @param {number} options.padR - Right padding
   * @param {number} options.padT - Top padding
   * @param {number} options.padB - Bottom padding
   */
    add(element, row, col, {
      rowSpan=1,
      colSpan=1,
      padL=0,
      padR=0,
      padT=0,
      padB=0
    }={})
    {
      //check if grid is configured or not
      if(this.grid===null){
        this.gridConfig(this.rows, this.cols);
        console.log(`grid configured automatically [${this.rows}x${this.cols}]`);

        // console.log("element can't be added: gird not configured,");
        // console.log("call .gridConfig(rows, cols) first to configure grid before adding any elements!");
        return;
      }

      if(element===null){
        console.log("element to add can't be null");
        return;
      }

      if(this.findElement(element)){
        console.log(`the component (id: ${element.id}) is already added to the Gridframe (${this.id})`);
        console.log("component: ", element, "\nGridFrame: ", this);
        return;
      }

      if(row<0 || row>=this.rows || col<0 || col>=this.cols){
        console.log("index out of range; can't add the element at (",row,",",col,")");
        return;
      }

      if(this.grid[row][col]!=null){
        console.log("Grid cell (",row,",",col,") already taken");
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
      this.grid[row][col] = [element, rowSpan, colSpan, padL, padR, padT, padB];
      this.adjustToGrid(row, col, rowSpan, colSpan);

      // this.printGrid();
    }

    /**
   * Finds the grid position of an element
   * @param {Component} element - The element to find
   * @returns {number[]|null} [row, col] or null if not found
   */
    getElementPos(element){
      for(let i=0; i<this.rows; i++){
        for(let j=0; j<this.cols; j++){
          if(this.grid[i][j][0]===element)
            return [i, j];
        }
      }

      return null;
    }

    /**
   * Removes an element from the grid
   * @param {Component} element - The element to remove
   */
    remove(element){
      let index = this.findIndexOfElement(element);
      if(index==-1){
        console.log(`element (id: ${element.id}) can't be removed from ScrollFrame (id: ${this.id})
           because it was not found in immediate children!`);
        return;
      }

      element.parent = null;
      let res = this.getElementPos(element);
      // console.log(res);
      let x = res[0];
      let y = res[1];
      let rowSpan = this.grid[x][y][1];
      let colSpan = this.grid[x][y][2];
      //reclaiming the space taken up by the 
      //element in the grid
      if(res !== null){
        for(let i=x; i < x+rowSpan; i++){
          for(let j=y; j< y+colSpan; j++){
            this.grid[i][j] = null;
          }
        }
      }
      
      this.removeChild(element);
      this.redraw();
      console.log(`element (id: ${element.id}) successfully removed from ${this.constructor.name} (id: ${this.id})!`);
      // this.printGrid();
    }
    
    /**
   * Configures row weight for proportional sizing
   * @param {number} rowNum - Row index to configure
   * @param {number} weight - Weight value for proportional sizing
   */
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
  
    /**
   * Configures column weight for proportional sizing
   * @param {number} colNum - Column index to configure
   * @param {number} weight - Weight value for proportional sizing
   */
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
  
    /**
   * Initializes the grid structure with specified rows and columns
   * @param {number} rows - Number of rows
   * @param {number} cols - Number of columns
   */
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
  
    /**
   * Adjusts child component widths based on grid weights
   * @param {number} x - Starting x position
   * @param {number} w - Available width
   */
    adjustWidth(x, w){
      //[element, rowSpan, colSpan, padL, padR, padT, padB];
      for(let i=0; i<this.cols; i++){
        for(let j=0; j<this.rows; j++){
          if(this.grid && this.grid[j][i]!=null && this.grid[j][i]!="taken"){
            let curr = this.grid[j][i];
  
            curr[0].x = x + curr[3] + curr[0].marginl;
            curr[0].width = 0;
  
            for(let k=0; k<curr[2]; k++){
              curr[0].width += (this.colWeights[i+k]/this.totalColWeight) * w;
            }
  
            curr[0].width -= curr[3] + curr[4] + curr[0].marginl + curr[0].marginr;
  
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
  
    /**
   * Adjusts child component heights based on grid weights
   * @param {number} y - Starting y position
   * @param {number} h - Available height
   */
    adjustHeight(y, h){
      //[element, rowSpan, colSpan, padL, padR, padT, padB];
      for(let i=0; i<this.rows; i++){
        for(let j=0; j<this.cols; j++){
          if(this.grid && this.grid[i][j]!=null && this.grid[i][j]!="taken"){
            let curr = this.grid[i][j];
  
            curr[0].y = y + curr[5] + curr[0].margint;
            curr[0].height = 0;
  
            for(let k=0; k<curr[1]; k++){
              curr[0].height += (this.rowWeights[i+k]/this.totalRowWeight) * h;
            }
  
            curr[0].height -= curr[5] + curr[6] + curr[0].margint + curr[0].marginb;
  
            //console.log("curr[0].type:"+curr[0].type);

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
  
    //only called when a new element is added
    //to make the element fit into the grid cell
    /**
   * Positions a new element within the grid cell
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @param {number} rowSpan - Row span
   * @param {number} colSpan - Column span
   */
    adjustToGrid(row, col, rowSpan, colSpan){
      let x = this.x + this.padx;
      let y = this.y + this.pady;
      if(this.alwaysShowBanner){
        y += this.bannerHeight;
      }
  
      let w = this.width - 2*this.padx;
      let h = this.height - 2*this.pady;
      if(this.alwaysShowBanner){
        h -= this.bannerHeight;
      }
  
      for(let i=0; i<col; i++){
        x += (this.colWeights[i]/this.totalColWeight) * w;
      }
      
      for(let i=0; i<row; i++){
        y += (this.rowWeights[i]/this.totalRowWeight) * h;
      }
  
      this.grid[row][col][0].x = x + this.grid[row][col][3] + this.grid[row][col][0].marginl;
      this.grid[row][col][0].y = y + this.grid[row][col][5] + this.grid[row][col][0].margint;
  
      this.expandElement(row, col, rowSpan, colSpan);
  
      //this.storeProportions(row, col);
  
      if(this.grid[row][col][0].constructor.name=="GridFrame"){
        this.grid[row][col][0].adjustWidth(this.grid[row][col][0].x + this.grid[row][col][0].padx, this.grid[row][col][0].width - 2*this.grid[row][col][0].padx);
        this.grid[row][col][0].adjustHeight(this.grid[row][col][0].y + this.grid[row][col][0].pady, this.grid[row][col][0].height - 2*this.grid[row][col][0].pady);
      } else if(this.grid[row][col][0].constructor.name=="ScrollFrame"){
        this.grid[row][col][0].redraw();
      } else {
        this.grid[row][col][0].updateWidth();
        if(this.grid[row][col][0].constructor.name!="Label"){
          this.grid[row][col][0].updateHeight();
        }
      }
    }
  
    //expand the element to as much grid cells as possible
    //while keeping the desired row and col spans in consideration
    /**
   * Expands element to span multiple grid cells
   * @param {number} row - Starting row
   * @param {number} col - Starting column
   * @param {number} rowSpan - Desired row span
   * @param {number} colSpan - Desired column span
   */
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
          if(this.grid && this.grid[i][j]!=null){
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
        if(this.alwaysShowBanner){
          h += (this.rowWeights[i]/this.totalRowWeight) * (this.height - this.bannerHeight - 2*this.pady);
        } else {
          h += (this.rowWeights[i]/this.totalRowWeight) * (this.height - 2*this.pady);
        }
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
  
      this.grid[row][col][0].width = w - this.grid[row][col][3] - this.grid[row][col][4] - this.grid[row][col][0].marginl - this.grid[row][col][0].marginr;
      this.grid[row][col][0].height = h - this.grid[row][col][5] - this.grid[row][col][6] - this.grid[row][col][0].margint - this.grid[row][col][0].marginb;
      this.grid[row][col][1] = yLimit+1;
      this.grid[row][col][2] = xLimit+1;
    }
    
    /**
   * Shows the frame banner and adjusts layout
   */
    showBanner(){
      this.adjustHeight(this.y + (this.bannerHeight) + this.pady, this.height - (this.bannerHeight) - 2*(this.pady));
      this.isBannerShown=true;
    }
    
     /**
   * Hides the frame banner and adjusts layout
   */
    hideBanner(){
      this.adjustHeight(this.y + this.pady, this.height-2*(this.pady));
      this.isBannerShown=false;
    }
  
  /**
   * Updates child component positions during frame movement
   * @param {number} xDiff - X position difference
   * @param {number} yDiff - Y position difference
   */
    updatePosUtil(xDiff, yDiff){
      for(let i=0; i<this.rows; i++){
        for(let j=0; j<this.cols; j++){
          if(this.grid && this.grid[i][j]!=null && this.grid[i][j]!="taken"){
            this.grid[i][j][0].x -= xDiff;
            this.grid[i][j][0].y -= yDiff;
            if(this.grid[i][j][0].type=="Frame"){
              this.grid[i][j][0].updatePosUtil(xDiff, yDiff);
            }
          }
        }
      }
    }
  
    /**
   * Renders the grid frame and all child components
   */
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
          if(this.grid && this.grid[i][j]!=null && this.grid[i][j]!="taken"){
            this.grid[i][j][0].show();
          }
        }
      }
  
      //showing the top banner
      if(this.alwaysShowBanner || (this.enableReposition && this.isBannerShown==true)){
        noStroke();
        fill(this.bannerColor);
        rect(this.x, this.y, this.width, this.bannerHeight, this.cornerRadius, this.cornerRadius, 0, 0);
  
        fill(this.bannerDotColor);
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
      // if(this.enableResizing && this.nearestBorder!=null){
      //   this.showHighlightedBorder();
      // }
    }

    /**
   * Prints grid structure to console for debugging
   */
    printGrid(){
      for(let i=0; i<this.rows; i++){
        let row = "";
        for(let j=0; j<this.cols; j++){
          if(this.grid[i][j]){
            row += "* ";
          } else {
            row += "_ ";
          }
        }
        console.log(row);
      }
    }
  }