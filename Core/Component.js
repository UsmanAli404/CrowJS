export class Component{
    constructor(x, y, width, height, {parent=null, parentType=""} = {}){
      this.x = x;
      this.y = y;
      this.height = height;
      this.width = width;
      this.parent = parent;
      this.parentType = parentType;
    }
  
    show(){};
  }