export class Component{
  constructor(x, y, width, height, {parent=null, type="", id=null} = {}){
    this.x = x;
    this.y = y;
    this.id = id;
    this.height = height;
    this.width = width;
    this.parent = parent;
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

  //is cursor inside
  isInside(){
    return mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height;
  }

  //finds element in children
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

  setRoot(root){
    this.root = root;
    
    for(let i=0; i<this.children.length; i++){
      let child = this.children[i];
      child.setRoot(root);
    }
  }

}