import { KeyboardEvent } from "./GUIEvent/KeyboardEvent.js";
import { MouseEvent } from "./GUIEvent/MouseEvent.js";

export class Root{
    constructor(){
      this.layers = [];//determines order of display
      this.lastActiveElement = -2;
      this.activeElement = -1;
      //for keeping track of entry order,
      //useful for mouseEnter and mouseLeave events
      this.entryOrderStack = [];
      this.elementsMap = new Map();//for storing ids
      // this.preferences = {};
    }

    printEnterStack(){
      for(let i=this.entryOrderStack.length-1; i>=0; i--){
        console.log(this.entryOrderStack[i]);
      }
    }

    getElementById(id){
      return this.elementsMap.get(id);
    }
  
    show(){
      for(let i=0; i<this.layers.length; i++){
        this.layers[i].show();
      }
    }
  
    add(element){
      let res = element.fillElementsMap(this.elementsMap);
      if(res!=="<<map_filled_successfully>>"){
        console.log(`duplicate id (${res}) found across this element and previously added elements;
           this element (${element.constructor.name}) can't be added!`);
        console.log(element);
        console.log("");
        return;
      }

      this.layers.push(element);
      element.setRoot(this);
    }

    isNum(val){
      return Number.isInteger(val);
    }

    remove(element){
      let index = this.getElementIndex(element);
      if(index===-1){
        return;
      }

      this.layers.splice(index, 1);

      if(this.lastActiveElement === element || 
        (!this.isNum(this.lastActiveElement) &&
         this.lastActiveElement.isChildOf(element))
      ){
        this.lastActiveElement = -2;
      }

      if(this.activeElement === element ||
        (!this.isNum(this.activeElement) &&
        this.activeElement.isChildOf(element))
      ){
        this.activeElement = -1;
      }

      this.entryOrderStack.splice(index, 1);
      if(element.id!==null){
        this.elementsMap.delete(element.id);
      }

      // console.log(`Element ${element.type} removed successfully from root!`);
      // console.log(element);
      // console.log("");
    }

    //finds element only in layers
    getElementIndex(element){
      for(let i=0; i<this.layers.length; i++){
        if(this.layers[i]===element){
          return i;
        }
      }

      console.log("Element not found!\n");
      return -1;
    }
  
    // if it's a child of an element in layers,
    // return paren't index
    // else if is an element in layers,
    // return the element's index
    getElementIndexRec(element){
      for(let i=0; i<this.layers.length; i++){
        if(this.layers[i].findElement(element)){
          return i;
        }
      }

      console.log("Element not found!\n");
      return -1;
    }
  
    sendBackwards(element){
      let i = this.getElementIndexRec(element);
      if(i!=1){
        if(i-1>=0){
          let temp = this.layers[i-1];
          this.layers[i-1]=element;
          this.layers[i]=temp;
        }
      }
    }
  
    sendToBack(element){
      if(this.layers.length!==0){
        if(this.layers[0]==element){
          return;
        }
      }
  
      let i = this.getElementIndexRec(element);
      if(i!=-1){
        let temp = this.layers[i];
        for(let j=i; j>0; j--){
          this.layers[j]=this.layers[j-1];
        }
        this.layers[0]=temp;
      }
    }
  
    sendForwards(element){
      let i = this.getElementIndexRec(element);
      if(i!=-1){
        if(i+1<this.layers.length){
          let temp = this.layers[i+1];
          this.layers[i+1]=element;
          this.layers[i]=temp;
        }
      }
    }
  
    sendToFront(element){
      if(this.layers.length!=0){
        //already in front
        if(this.layers[this.layers.length-1]==element){
          return;
        }
      }
  
      let i=this.getElementIndexRec(element);
      if(i!=-1){
        let temp = this.layers[i];
        for(let j=i; j<this.layers.length-1; j++){
          this.layers[j]=this.layers[j+1];
        }
        this.layers[this.layers.length-1] = temp;
      }
    }

    handleMouseEvent(type, x, y, {e=null}={}){
      //currently engaged element
      if(mouseIsPressed && !this.isNum(this.activeElement)){
        this.sendToFront(this.activeElement);

        let target = this.activeElement;
        let event = new MouseEvent(x, y, type, target, {event: e});
        target.dispatchEvent(event);
        return;
      }
      

      let target = null;
      for(let i=this.layers.length-1; i>=0; i--){
        target = this.layers[i].findTarget();
        if(target!=null){
          if(this.activeElement!=this.lastActiveElement){
            this.mouseLeaveEventHandler(x, y);
          }
          this.lastActiveElement = this.activeElement;
          this.activeElement = target;
          break;
        }
      }

      if(target==null){
        this.activeElement = -1;
        return;
      }

      let event = new MouseEvent(x, y, type, target, {event: e});
      target.dispatchEvent(event);
    }

    handleKeyboardEvent(type, x, y){
      let target = null;
      for(let i=this.layers.length-1; i>=0; i--){
        target = this.layers[i].findTarget();
        if(target!=null){
          // console.log(target.constructor.name);
          this.lastActiveElement = this.activeElement;
          this.activeElement = target;
          break;
        }
      }

      if(target==null){
        this.activeElement = -1;
        return;
      }

      let event = new KeyboardEvent(x, y, type, target);
      target.dispatchEvent(event);
    }

    //runs continously on hover
    //put in draw loop
    hoverEventListeners(x, y){
      this.handleMouseEvent("hover", x, y);
    }

    //runs immediately after a mouse button
    //is pressed
    //separate function
    mouseClickedEventListeners(x, y){
      if(this.activeElement==-1){
        return;
      }

      // if(this.activeElement==this.lastActiveElement){
      //   return;
      // }

      this.handleMouseEvent("click", x, y);
    }

    //similar to click, but runs as soon as
    //any mouse button is clicked
    //separate function
    mousePressedEventListeners(x, y){
      this.handleMouseEvent("press", x, y);
    }

    //runs once after double click
    //separate function
    mouseDoubleClickedEventListeners(x, y){
      this.handleMouseEvent("doubleClick", x, y);
    }

    //runs once after a mouse button is released
    //separate function
    mouseReleasedEventListeners(x, y){
      if(!this.isNum(this.activeElement)){
        // this.sendToFront(this.activeElement);

        let target = this.activeElement;
        let event = new MouseEvent(x, y, "release", target);
        target.dispatchEvent(event);
        return;
      }

      this.handleMouseEvent("release", x, y);
    }
  
    //separate function
    mouseDraggedEventListeners(x, y){
      this.handleMouseEvent("drag", x, y);
    }

    //(enters one component and leaves another)
    //in draw function
    mouseEnterEventListeners(x, y){
      if(this.activeElement==-1){
        return;
      }

      if(this.entryOrderStack.includes(this.activeElement)){
        return;
      }

      let target = this.activeElement;
      this.pushParent(target);

      let event = new MouseEvent(x, y, "mouseEnter", target);
      target.dispatchMouseEnterEvent(event);
      this.entryOrderStack.push(target);
      // console.log(target);
      // console.log(this.entryOrderStack);
    }

    pushParent(element){
      if(element.parent==null){
        return;
      }

      if(this.entryOrderStack.includes(element.parent)){
        return;
      }

      this.pushParent(element.parent);
      this.entryOrderStack.push(element.parent);
    }



    //in draw function
    mouseLeaveEventListeners(x, y){
      if(mouseIsPressed && !this.isNum(this.activeElement)){
        return;
      }

      if(this.entryOrderStack.length==0){
        return;
      }

      // console.log("mouseLeaveEventListeners...");

      while(true && this.entryOrderStack.length>0){
        let top = this.entryOrderStack.pop();
        if(!top.isInside()){
          let event = new MouseEvent(x, y, "mouseLeave", top);
          top.dispatchMouseLeaveEvent(event);
        } else {
          this.entryOrderStack.push(top);
          break;
        }
      }

      // console.log(this.entryOrderStack);
    }

    //used for component to component cursor transition
    //triggered on the component the cursor left from
    mouseLeaveEventHandler(x, y){
      // console.log("mouseLeaveEventHandler ...");
      if(this.activeElement==-1 || this.isNum(this.lastActiveElement)){
        return;
      }

      let index = -1;
      for(let i=this.entryOrderStack.length-1; i>=0; i--){
        if(this.layers.includes(this.entryOrderStack[i])){
          index = i;
          // console.log("index:", index);
          break;
        }
      }

      if(index==-1){
        return;
      }

      let temp = this.entryOrderStack.slice(0, index);
      // console.log(temp);
      while(temp.length>0){
        let top = temp.pop();
        let event = new MouseEvent(x, y, "mouseLeave", top);
        top.dispatchMouseLeaveEvent(event);
      }

      this.entryOrderStack.splice(0, index);
    }

    //separate function
    mouseWheelEventListeners(x, y, event){
      this.handleMouseEvent("scroll", x, y, {e:event});
    }

    //runs once
    //separate function
    keyPressedEventListeners(x, y){
      this.handleKeyboardEvent("keyPress", x, y);
    }

    //runs continously when a key is pressed
    //to check for key continously pressed
    //keyIsPressed
    //key === 'A'
    //keyCode === ENTER
    //draw function
    keyDownEventListeners(x, y){
      if(!keyIsPressed){
        return;
      }

      this.handleKeyboardEvent("keyDown", x, y);
    }
  }