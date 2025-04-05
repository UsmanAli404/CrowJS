import { KeyboardEvent } from "./GUIEvent/KeyboardEvent.js";
import { MouseEvent } from "./GUIEvent/MouseEvent.js";

export class Root{
    constructor(){
      this.layers = [];//determines order of display
      this.lastActiveElement = -2;
      this.activeElement = -1;
      //for keeping track of entry order,
      //useful for mouseEnter and mouseLeave events
      this.enterStack = [];
      this.elementsMap = new Map();//for storing ids
      // this.preferences = {};
    }

    printEnterStack(){
      for(let i=this.enterStack.length-1; i>=0; i--){
        console.log(this.enterStack[i]);
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
      // console.log(this.layers[this.layers.length-1]);
    }
  
    findElement(element){
      // if it's a child of an element, then return 
      // the element's index
      for(let i=0; i<this.layers.length; i++){
        if(this.layers[i].findElement(element)){
          return i;
        }
      }

      console.log("Element not found!\n");
      return -1;
    }
  
    sendBackwards(element){
      let i = this.findElement(element);
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
  
      let i = this.findElement(element);
      if(i!=-1){
        let temp = this.layers[i];
        for(let j=i; j>0; j--){
          this.layers[j]=this.layers[j-1];
        }
        this.layers[0]=temp;
      }
    }
  
    sendForwards(element){
      let i = this.findElement(element);
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
  
      let i=this.findElement(element);
      if(i!=-1){
        let temp = this.layers[i];
        for(let j=i; j<this.layers.length-1; j++){
          this.layers[j]=this.layers[j+1];
        }
        this.layers[this.layers.length-1] = temp;
      }
    }

    handleMouseEvent(type, x, y){
      //currently engaged element
      if(mouseIsPressed && !Number.isInteger(this.activeElement)){
        this.sendToFront(this.activeElement);

        let target = this.activeElement;
        let event = new MouseEvent(x, y, type, target);
        target.dispatchEvent(event);
        return;
      }
      

      let target = null;
      for(let i=this.layers.length-1; i>=0; i--){
        target = this.layers[i].findTarget();
        if(target!=null){
          if(this.activeElement!=this.lastActiveElement){
            // console.log("component to component...");
            // console.log(this.lastActiveElement);
            // console.log(this.activeElement);
            this.mouseLeaveEventHandler(x, y);
          }
          this.lastActiveElement = this.activeElement;
          this.activeElement = target;
          // this.sendToFront(this.activeElement);
          break;
        }
      }

      if(target==null){
        this.activeElement = -1;
        return;
      }

      let event = new MouseEvent(x, y, type, target);
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

      if(this.enterStack.includes(this.activeElement)){
        return;
      }

      let target = this.activeElement;
      this.pushParent(target);

      let event = new MouseEvent(x, y, "mouseEnter", target);
      target.dispatchMouseEnterEvent(event);
      this.enterStack.push(target);
      // console.log(target);
    }

    pushParent(element){
      if(element.parent==null){
        return;
      }

      if(this.enterStack.includes(element.parent)){
        return;
      }

      this.pushParent(element.parent);
      this.enterStack.push(element.parent);
    }



    //in draw function
    mouseLeaveEventListeners(x, y){
      if(mouseIsPressed && !Number.isInteger(this.activeElement)){
        return;
      }

      if(this.enterStack.length==0){
        return;
      }

      // console.log("mouseLeaveEventListeners...");

      while(true && this.enterStack.length>0){
        let top = this.enterStack.pop();
        if(!top.isInside()){
          let event = new MouseEvent(x, y, "mouseLeave", top);
          top.dispatchMouseLeaveEvent(event);
        } else {
          this.enterStack.push(top);
          break;
        }
      }
    }

    //used for component to component cursor transition
    //triggered on the component the cursor left from
    mouseLeaveEventHandler(x, y){
      // console.log("mouseLeaveEventHandler ...");
      // this.printEnterStack();
      if(this.activeElement==-1 || Number.isInteger(this.lastActiveElement)){
        return;
      }

      let index = -1;
      for(let i=this.enterStack.length-1; i>=0; i--){
        if(this.layers.includes(this.enterStack[i])){
          index = i;
          // console.log("index:", index);
          break;
        }
      }

      if(index==-1){
        return;
      }

      let temp = this.enterStack.slice(0, index);
      // console.log(temp);
      while(temp.length>0){
        let top = temp.pop();
        let event = new MouseEvent(x, y, "mouseLeave", top);
        top.dispatchMouseLeaveEvent(event);
      }

      this.enterStack.splice(0, index);
      // this.printEnterStack();
    }

    //separate function
    mouseWheelEventListeners(x, y, event){
      if(event.delta > 0){
        this.handleMouseEvent("scrollUp", x, y);
      } else{
        this.handleMouseEvent("scrollDown", x, y);
      }
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