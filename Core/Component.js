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
   */
  constructor(x, y, width, height, {type="", id=null} = {}){
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
   * @param {string} eventType - The type of event to listen for
   * @param {Function} callback - The function to call when event occurs
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

}