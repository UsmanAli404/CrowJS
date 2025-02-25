export class Component{
    constructor(x, y, width, height, {parent=null, type=""} = {}){
      this.x = x;
      this.y = y;
      this.height = height;
      this.width = width;
      this.parent = parent;
      this.type = type;
    }
  
    show(){};
  }