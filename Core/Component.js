export class Component{
  constructor(x, y, width, height, {parent=null, type=""} = {}){
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.parent = parent;
    this.type = type;
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

  //children?
  findTarget(x, y){
    for(let i = this.children.length - 1; i >= 0; i--){
      let child = this.children[i];
      if(child.isInside(x, y)){
        return child.findTarget(x, y);
      }
    }
    return this; // Return the topmost element under the cursor
  }

}