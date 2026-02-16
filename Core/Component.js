import { GUIEvent } from "./GUIEvent/GUIEvent.js";

export class Component{
  /**
   * Creates a new Component instance
   * @param {number} x - The x-coordinate of the component
   * @param {number} y - The y-coordinate of the component
   * @param {number} width - The width of the component
   * @param {number} height - The height of the component
   * @param {Object} options - Configuration options
   * @param {string} options.type - The type identifier of the component
   * @param {string|null} options.id - Unique identifier for the component
   * @param {number} options.margin - General margin for all sides
   * @param {number} options.marginx - Horizontal margin (left and right)
   * @param {number} options.marginy - Vertical margin (top and bottom)
   * @param {number} options.marginl - Left margin
   * @param {number} options.marginr - Right margin
   * @param {number} options.margint - Top margin
   * @param {number} options.marginb - Bottom margin
   */
  constructor(x, y, width, height, {type="", id=null, margin=0, marginx=null, marginy=null, marginl=null, marginr=null, margint=null, marginb=null, minWidth=0, minHeight=0, showDebugOverlay=false} = {}){
    this.x = x;
    this.y = y;
    this.id = id;
    this.height = height;
    this.width = width;
    this.parent = null;
    this.type = type;
    this.root = null;
    this.eventListeners = {};
    this.children = [];
    this.showDebugOverlay = showDebugOverlay;

    // Margin resolution
    const resolvedMarginx = (marginx ?? margin ?? 0);
    const resolvedMarginy = (marginy ?? margin ?? 0);
    this.margin = margin;
    this.marginx = resolvedMarginx;
    this.marginy = resolvedMarginy;
    this.marginl = marginl ?? resolvedMarginx;
    this.marginr = marginr ?? resolvedMarginx;
    this.margint = margint ?? resolvedMarginy;
    this.marginb = marginb ?? resolvedMarginy;

    // Minimum dimensions
    this.minWidth = minWidth;
    this.minHeight = minHeight;
  }

  /**
   * Returns the x-coordinate including left margin (outer bound)
   * @returns {number}
   */
  get outerX() {
    return this.x - this.marginl;
  }

  /**
   * Returns the y-coordinate including top margin (outer bound)
   * @returns {number}
   */
  get outerY() {
    return this.y - this.margint;
  }

  /**
   * Returns the total width including left and right margins
   * @returns {number}
   */
  get outerWidth() {
    return this.width + this.marginl + this.marginr;
  }

  /**
   * Returns the total height including top and bottom margins
   * @returns {number}
   */
  get outerHeight() {
    return this.height + this.margint + this.marginb;
  }

  /**
   * Returns the effective minimum width, accounting for children's constraints.
   * Subclasses (e.g. GridFrame, ScrollFrame) override this to compute
   * the minimum from their children's requirements.
   * @returns {number}
   */
  getEffectiveMinWidth() {
    return this.minWidth;
  }

  /**
   * Returns the effective minimum height, accounting for children's constraints.
   * Subclasses (e.g. GridFrame, ScrollFrame) override this to compute
   * the minimum from their children's requirements.
   * @returns {number}
   */
  getEffectiveMinHeight() {
    return this.minHeight;
  }

  //to show itself
  /**
   * Renders the component on the canvas
   * @abstract
   */
  show(){};

  //you can add multiple callback functions to one eventType
  //for each component
  /**
   * Registers an event listener for the component
   * 
   * @param {EventType} eventType - The type of event to listen for. Available options:
   * 
   * ## Mouse Events
   * - `"hover"` - Fires continuously while mouse is over the component (use in draw loop)
   * - `"mouseEnter"` - Fires once when mouse enters component boundaries
   * - `"mouseLeave"` - Fires once when mouse leaves component boundaries  
   * - `"click"` - Fires on mouse click (press + release on same component)
   * - `"press"` - Fires when mouse button is pressed down
   * - `"release"` - Fires when mouse button is released
   * - `"drag"` - Fires continuously while mouse is dragged with button pressed
   * - `"doubleClick"` - Fires on double click
   * - `"scroll"` - Fires on mouse wheel scroll
   * 
   * ## Keyboard Events
   * - `"keyPress"` - Fires once when a key is pressed
   * - `"keyDown"` - Fires continuously while a key is held down (use in draw loop)
   * 
   * ## Frame Events (Frame, GridFrame, ScrollFrame only)
   * - `"resize"` - Fires when frame is being resized by user
   * - `"reposition"` - Fires when frame is being dragged/moved by user
   * 
   * ## Input Events (TextField, Input only)  
   * - `"focus"` - Fires when input field gains focus
   * - `"blur"` - Fires when input field loses focus
   * 
   * @param {function(GUIEvent): void} callback - The function to call when event occurs.
   * The callback receives a GUIEvent object with the following properties:
   * - `x` {number} - The x-coordinate where event occurred
   * - `y` {number} - The y-coordinate where event occurred  
   * - `type` {string} - The event type that triggered
   * - `target` {Component} - The component that received the event
   * - `propagationStopped` {boolean} - Whether event propagation was stopped
   * 
   * For specific event types:
   * - **MouseEvent** (extends GUIEvent): All mouse-related events
   * - **KeyboardEvent** (extends GUIEvent): `keyPress`, `keyDown`
   * - **Scroll events**: Includes `delta` property for scroll direction
   * 
   * @example
   * // Basic click handler
   * component.addEventListener("click", (event) => {
   *   console.log(`Clicked at ${event.x}, ${event.y}`);
   * });
   * 
   * @example
   * // Frame resize handler
   * frame.addEventListener("resize", (event) => {
   *   console.log(`Frame resized to ${event.target.width}x${event.target.height}`);
   * });
   * 
   * @example  
   * // Input focus handler
   * textField.addEventListener("focus", (event) => {
   *   event.target.borderWidth += 2; // Visual feedback
   * });
   * 
   * @example
   * // Stop event propagation
   * component.addEventListener("click", (event) => {
   *   event.stopPropagation(); // Prevents parent components from receiving event
   *   console.log("Event handled here only");
   * });
   * 
   * @throws {Error} If eventType is not a string or callback is not a function
   * 
   */

  addEventListener(eventType, callback){
    if(!this.eventListeners[eventType]){
      this.eventListeners[eventType] = [];
    }
    this.eventListeners[eventType].push(callback);
  }
  /**
   * Dispatches a mouse enter event to the component
   * @param {MouseEvent} event - The mouse enter event
   */
  dispatchMouseEnterEvent(event){
    this.dispatchMouseEnterLeaveEventUtil(event);
  }
  /**
   * Dispatches a mouse leave event to the component
   * @param {MouseEvent} event - The mouse leave event
   */
  dispatchMouseLeaveEvent(event){
    this.dispatchMouseEnterLeaveEventUtil(event);
  }
  /**
   * Internal utility for mouse enter/leave event handling
   * @param {MouseEvent} event - The mouse event
   * @private
   */
  dispatchMouseEnterLeaveEventUtil(event){
    if(this.eventListeners[event.type]){
      for(let callback of this.eventListeners[event.type]){
        callback(event);
      }
    }
  }

  //to take action upon event occurence
  /**
   * Dispatches an event to the component and propagates to parents
   * @param {GUIEvent} event - The event to dispatch
   */
  dispatchEvent(event){
    // console.log("Dispatching to:", event.target, "Event type:", event.type);
    if(this.eventListeners[event.type]){
      for(let callback of this.eventListeners[event.type]){
        callback(event);
        if(event.propagationStopped){
          return;
        }
      }
    }
    // Bubble up to parent
    if(this.parent){
      this.parent.dispatchEvent(event);
    }
  }

  /**
   * Dispatches an event only to this component (no propagation)
   * @param {GUIEvent} event - The event to dispatch
   */
  dispatchEventOnlyOnSelf(event){
    if(this.eventListeners[event.type]){
      for(let callback of this.eventListeners[event.type]){
        callback(event);
      }
    }
  }

  /**
   * Dispatches an event to this component and all children
   * @param {GUIEvent} event - The event to dispatch
   */
  dispatchTrickleDownEvent(event){
    if(this.eventListeners[event.type]){
      for(let callback of this.eventListeners[event.type]){
        callback(event);
      }
    }

    for(let i=0; i<this.children.length; i++){
      this.children[i].dispatchTrickleDownEvent(event);
    }
  }

  /**
   * Disables resizing and repositioning for this component (if Frame) and all of its children
   */
  turnResizingAndRepositionOff(){
    if(this.type==="Frame"){
      this.enableResizing=false;
      this.enableReposition=false;

      for(let i=0; i<this.children.length; i++){
        this.children[i].turnResizingAndRepositionOff();
      }
    }
  }

  /**
   * Checks if the mouse is inside the component boundaries
   * @returns {boolean} True if mouse is inside the component
   */
  isInside() {
    let insideRect = mouseX > this.x && mouseX < this.x + this.width &&
                     mouseY > this.y && mouseY < this.y + this.height;
  
    if (!insideRect) return false;
  
    let r = this.cornerRadius || 0;
  
    // If corner radius is 0, we don't need further checks
    if (r <= 0) return this.checkParent();
  
    // Define the 4 corner centers
    let corners = [
      { x: this.x + r, y: this.y + r },                                 // top-left
      { x: this.x + this.width - r, y: this.y + r },                    // top-right
      { x: this.x + r, y: this.y + this.height - r },                   // bottom-left
      { x: this.x + this.width - r, y: this.y + this.height - r },      // bottom-right
    ];
  
    // Check if mouse is within the quarter circle of any corner
    if (mouseX < this.x + r && mouseY < this.y + r && dist(mouseX, mouseY, corners[0].x, corners[0].y) > r)
      return false;
    if (mouseX > this.x + this.width - r && mouseY < this.y + r && dist(mouseX, mouseY, corners[1].x, corners[1].y) > r)
      return false;
    if (mouseX < this.x + r && mouseY > this.y + this.height - r && dist(mouseX, mouseY, corners[2].x, corners[2].y) > r)
      return false;
    if (mouseX > this.x + this.width - r && mouseY > this.y + this.height - r && dist(mouseX, mouseY, corners[3].x, corners[3].y) > r)
      return false;
  
    return this.checkParent();
  }

  //removes child from children array
  //only from the immediate children
  /**
   * Removes a child component from immediate children
   * @param {Component} element - The child component to remove
   * @returns {boolean} True if component was found and removed
   */
  removeChild(element){
    if(this.children.includes(element)){
      this.children = this.children.filter((elem)=>elem!==element);
      // console.log(`element (id: ${element.id}) removed successfully from ${this.constructor.name} (id: ${this.id})!`);
      return true;
    }

    return false;
  }
  
  // helper to deal with scrollable parent
    /**
   * Helper method to check parent boundaries for scrollable containers
   * @returns {boolean} True if parent boundaries allow interaction
   * @private
   */
  checkParent() {
    if (this.parent && this.parent.constructor.name === "ScrollFrame" &&
        (this.parent.enableVScroll || this.parent.enableHScroll)) {
      return this.parent.isInside();
    }
    return true;
  }
  

  //finds element recursively among children
  /**
   * Recursively searches for an element in the children tree
   * @param {Component} element - The element to find
   * @returns {boolean} True if element is found in the hierarchy or matches to self
   */
  findElement(element){
    if(element==this){
      return true;
    }

    for(let i = this.children.length - 1; i >= 0; i--){
      let child = this.children[i];
      if(child.findElement(element)){
        return true;
      }
    }

    return false;
  }

  /**
   * Finds the index of a child element
   * @param {Component} element - The child element to find
   * @returns {number} Index of the element or -1 if not found
   */
  findIndexOfElement(element){
    return this.children.findIndex((elem)=> elem===element);
  }

  // cheking if it or any of its children have ids
  // already present in the map
  // if there is, then the duplicate id is returned
  /**
   * Checks if this component can be safely added to the elements map
   * @param {Map} map - The elements map to check against
   * @returns {string} "<<no_match_found>>" if safe, duplicate ID otherwise
   */
  safeToFillElementsMap(map){
    if(map.has(this.id)){
      return this.id;//false
    }

    for(let i=0; i<this.children.length; i++){
      let res = this.children[i].safeToFillElementsMap(map);
      if(res!=="<<no_match_found>>"){
        return res;//return the duplicate id
      }
    }

    return "<<no_match_found>>";//true
  }
  /**
   * Fills the elements map with this component and all children
   * @param {Map} map - The elements map to populate
   * @returns {string} "<<map_filled_successfully>>" or duplicate ID
   */
  fillElementsMap(map){
    let res = this.safeToFillElementsMap(map);
    if(res!=="<<no_match_found>>"){
      return res;//return duplicate id
    }

    this.fillElementsMapUtil(map);
    return "<<map_filled_successfully>>";
  }
  /**
   * Internal recursive method to populate elements map
   * @param {Map} map - The elements map to populate
   * @private
   */
  fillElementsMapUtil(map){
    if(this.id!==null){
      map.set(this.id, this);
    }

    for(let i=0; i<this.children.length; i++){
      this.children[i].fillElementsMapUtil(map);
    }
  }

  //recursively finds element by ID
  /**
   * Recursively finds a component by its ID
   * @param {string} id - The ID to search for
   * @returns {Component|null} The found component or null
   */
  getElementById(id){
    if(id===null){
      return null;
    }

    if(this.id===id){
      return this;
    }

    for(let i=0; i<this.children.length; i++){
      let result = this.children[i].getElementById(id);
      if(result){
        return result;
      }
    }

    return null;
  }

  //recursively finds target component
  /**
   * Recursively finds the target component for mouse events
   * @returns {Component|null} The deepest component under the mouse
   */
  findTarget(){
    for(let i = this.children.length - 1; i >= 0; i--){
      let child = this.children[i];
      if(child.isInside()){
        return child.findTarget();
      }
    }

    if(this.isInside()){
      return this;
    }

    return null;
  }
  /**
   * Checks if this component is a child of the specified element
   * @param {Component} elem - The potential parent element
   * @returns {boolean} True if this is a child of the element
   */
  isChildOf(elem){
    if(!this.parent || !elem){
      return false;
    }

    if(this.parent === elem){
      return true;
    }

    return this.parent.isChildOf(elem);
  }

  //recursively sets root of itself and of its children
  /**
   * Sets the root reference for this component and all children
   * @param {Root} root - The root manager instance
   */
  setRoot(root){
    this.root = root;
    
    for(let i=0; i<this.children.length; i++){
      let child = this.children[i];
      child.setRoot(root);
    }
  }

  /**
   * Draws debug overlay for margin and padding visualization.
   * Margin is shown in orange, padding in blue, both with low opacity.
   * Small numbers are drawn when there is enough room.
   */
  drawDebugOverlay(){
    const marginColor = [255, 140, 0, 80];   // orange, low opacity
    const marginBorder = [255, 100, 0];       // orange, high contrast border
    const paddingColor = [0, 120, 255, 80];   // blue, low opacity
    const paddingBorder = [0, 80, 220];       // blue, high contrast border
    const borderWeight = 1.5;
    const labelColor = [0, 0, 0, 200];
    const minLabelSize = 8;
    const labelFontSize = 9;

    push();

    // --- Margin areas (orange) ---
    // Top margin
    if(this.margint > 0){
      fill(...marginColor);
      stroke(...marginBorder);
      strokeWeight(borderWeight);
      rect(this.x, this.y - this.margint, this.width, this.margint);
      this._drawDebugLabel(this.margint, this.x, this.y - this.margint, this.width, this.margint, labelColor, labelFontSize, minLabelSize);
    }
    // Bottom margin
    if(this.marginb > 0){
      fill(...marginColor);
      stroke(...marginBorder);
      strokeWeight(borderWeight);
      rect(this.x, this.y + this.height, this.width, this.marginb);
      this._drawDebugLabel(this.marginb, this.x, this.y + this.height, this.width, this.marginb, labelColor, labelFontSize, minLabelSize);
    }
    // Left margin (full outer height including top/bottom margins)
    if(this.marginl > 0){
      fill(...marginColor);
      stroke(...marginBorder);
      strokeWeight(borderWeight);
      rect(this.x - this.marginl, this.y - this.margint, this.marginl, this.height + this.margint + this.marginb);
      this._drawDebugLabel(this.marginl, this.x - this.marginl, this.y - this.margint, this.marginl, this.height + this.margint + this.marginb, labelColor, labelFontSize, minLabelSize);
    }
    // Right margin (full outer height including top/bottom margins)
    if(this.marginr > 0){
      fill(...marginColor);
      stroke(...marginBorder);
      strokeWeight(borderWeight);
      rect(this.x + this.width, this.y - this.margint, this.marginr, this.height + this.margint + this.marginb);
      this._drawDebugLabel(this.marginr, this.x + this.width, this.y - this.margint, this.marginr, this.height + this.margint + this.marginb, labelColor, labelFontSize, minLabelSize);
    }

    // --- Padding areas (blue) ---
    // Resolve padding values: TextComponent uses padl/padr/padt/padb, Frame uses padx/pady
    let pl = this.padl ?? this.padx ?? 0;
    let pr = this.padr ?? this.padx ?? 0;
    let pt = this.padt ?? this.pady ?? 0;
    let pb = this.padb ?? this.pady ?? 0;

    // Top padding
    if(pt > 0){
      fill(...paddingColor);
      stroke(...paddingBorder);
      strokeWeight(borderWeight);
      rect(this.x, this.y, this.width, pt);
      this._drawDebugLabel(pt, this.x, this.y, this.width, pt, labelColor, labelFontSize, minLabelSize);
    }
    // Bottom padding
    if(pb > 0){
      fill(...paddingColor);
      stroke(...paddingBorder);
      strokeWeight(borderWeight);
      rect(this.x, this.y + this.height - pb, this.width, pb);
      this._drawDebugLabel(pb, this.x, this.y + this.height - pb, this.width, pb, labelColor, labelFontSize, minLabelSize);
    }
    // Left padding (between top and bottom padding)
    if(pl > 0){
      fill(...paddingColor);
      stroke(...paddingBorder);
      strokeWeight(borderWeight);
      rect(this.x, this.y + pt, pl, this.height - pt - pb);
      this._drawDebugLabel(pl, this.x, this.y + pt, pl, this.height - pt - pb, labelColor, labelFontSize, minLabelSize);
    }
    // Right padding (between top and bottom padding)
    if(pr > 0){
      fill(...paddingColor);
      stroke(...paddingBorder);
      strokeWeight(borderWeight);
      rect(this.x + this.width - pr, this.y + pt, pr, this.height - pt - pb);
      this._drawDebugLabel(pr, this.x + this.width - pr, this.y + pt, pr, this.height - pt - pb, labelColor, labelFontSize, minLabelSize);
    }

    pop();
  }

  /**
   * Draws a small numeric label centered in a debug overlay region if there's enough room
   * @param {number} value - The numeric value to display
   * @param {number} rx - Region x
   * @param {number} ry - Region y
   * @param {number} rw - Region width
   * @param {number} rh - Region height
   * @param {number[]} labelColor - RGBA color array for text
   * @param {number} fontSize - Font size for the label
   * @param {number} minSize - Minimum region dimension to show label
   * @private
   */
  _drawDebugLabel(value, rx, ry, rw, rh, labelColor, fontSize, minSize){
    if(rw < minSize || rh < minSize) return;
    push();
    fill(...labelColor);
    noStroke();
    textSize(fontSize);
    textAlign(CENTER, CENTER);
    text(Math.round(value), rx + rw / 2, ry + rh / 2);
    pop();
  }

  /**
   * Recursively draws debug overlays for this component and all children.
   * Draws if the component's own showDebugOverlay is true, or if the root's showDebugOverlay is true.
   */
  drawDebugOverlayRecursive(){
    const rootDebug = this.root && this.root.showDebugOverlay;
    if(this.showDebugOverlay || rootDebug){
      this.drawDebugOverlay();
    }
    for(let i = 0; i < this.children.length; i++){
      this.children[i].drawDebugOverlayRecursive();
    }
  }

}