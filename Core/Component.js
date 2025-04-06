export class Component{
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
  show(){};

  //you can add multiple callback functions to one eventType
  //for each component
  addEventListener(eventType, callback){
    if(!this.eventListeners[eventType]){
      this.eventListeners[eventType] = [];
    }
    this.eventListeners[eventType].push(callback);
  }

  dispatchMouseEnterEvent(event){
    this.dispatchMouseEnterLeaveEventUtil(event);
  }

  dispatchMouseLeaveEvent(event){
    this.dispatchMouseEnterLeaveEventUtil(event);
  }

  dispatchMouseEnterLeaveEventUtil(event){
    if(this.eventListeners[event.type]){
      for(let callback of this.eventListeners[event.type]){
        callback(event);
      }
    }
  }

  //to take action upon event occurence
  dispatchEvent(event){
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

  turnResizingAndRepositionOff(){
    if(this.type==="Frame"){
      this.enableResizing=false;
      this.enableReposition=false;

      for(let i=0; i<this.children.length; i++){
        this.children[i].turnResizingAndRepositionOff();
      }
    }
  }

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
  removeChild(element){
    if(this.children.includes(element)){
      this.children = this.children.filter((elem)=>elem!==element);
      // console.log(`element (id: ${element.id}) removed successfully from ${this.constructor.name} (id: ${this.id})!`);
      return true;
    }

    return false;
  }
  
  // helper to deal with scrollable parent
  checkParent() {
    if (this.parent && this.parent.constructor.name === "ScrollFrame" &&
        (this.parent.enableVScroll || this.parent.enableHScroll)) {
      return this.parent.isInside();
    }
    return true;
  }
  

  //finds element recursively among children
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

  findIndexOfElement(element){
    return this.children.findIndex((elem)=> elem===element);
  }

  // cheking if it or any of its children have ids
  // already present in the map
  // if there is, then the duplicate id is returned
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

  fillElementsMap(map){
    let res = this.safeToFillElementsMap(map);
    if(res!=="<<no_match_found>>"){
      return res;//return duplicate id
    }

    this.fillElementsMapUtil(map);
    return "<<map_filled_successfully>>";
  }

  fillElementsMapUtil(map){
    if(this.id!==null){
      map.set(this.id, this);
    }

    for(let i=0; i<this.children.length; i++){
      this.children[i].fillElementsMapUtil(map);
    }
  }

  //recursively finds element by ID
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

  //recursively sets root of itself and of its children
  setRoot(root){
    this.root = root;
    
    for(let i=0; i<this.children.length; i++){
      let child = this.children[i];
      child.setRoot(root);
    }
  }

}