import { KeyboardEvent } from "./GUIEvent/KeyboardEvent.js";
import { MouseEvent } from "./GUIEvent/MouseEvent.js";
import { Component } from "./Component.js";

export class Root{
   /**
   * Creates the root manager that handles all GUI components and events
   */
    constructor(){
      /** @type {Array<Component>} */
      this.layers = [];//determines order of display
      this.lastActiveElement = -2;
      this.activeElement = -1;
      //for keeping track of entry order,
      //useful for mouseEnter and mouseLeave events
      this.entryOrderStack = [];
      this.elementsMap = new Map();//for storing ids
      // this.preferences = {};
      this.focusedField = null;//for focusable input fields
    }

    /**
   * Prints the current mouse enter stack for debugging
   */
    printEnterStack(){
      for(let i=this.entryOrderStack.length-1; i>=0; i--){
        console.log(this.entryOrderStack[i]);
      }
    }

    /**
   * Finds a component by its ID from all registered components
   * @param {string} id - The ID to search for
   * @returns {Component|null} The found component or null
   */
    getElementById(id){
      return this.elementsMap.get(id);
    }
  
    /**
   * Renders all components in the correct z-order
   */
    show(){
      for(let i=0; i<this.layers.length; i++){
        this.layers[i].show();
      }
    }
  
    /**
   * Adds a component to the root manager and registers it in the elements map
   * @param {Component} element - The component to add
   */
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

    /**
   * Checks if a value is a number
   * @param {*} val - The value to check
   * @returns {boolean} True if the value is a number
   * @private
   */
    isNum(val){
      return Number.isInteger(val);
    }

    /**
   * Removes a component from the root manager and cleans up references
   * @param {Component} element - The component to remove
   */
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
    /**
   * Finds the index of an element in the layers array
   * @param {Component} element - The element to find
   * @returns {number} Index of the element or -1 if not found
   */
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
    // return parent's index
    // else if is an element in layers,
    // return the element's index
    /**
   * Recursively finds the index of an element or its parent in layers
   * @param {Component} element - The element to find
   * @returns {number} Index of the element or its parent, or -1 if not found
   */
    getElementIndexRec(element){
      for(let i=0; i<this.layers.length; i++){
        if(this.layers[i].findElement(element)){
          return i;
        }
      }

      console.log("Element not found!\n");
      return -1;
    }

    /**
   * Moves an element one position backward in the z-order
   * @param {Component} element - The element to move backward
   */
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
  /**
   * Moves an element to the very back of the z-order
   * @param {Component} element - The element to send to back
   */
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
  
    /**
   * Moves an element one position forward in the z-order
   * @param {Component} element - The element to move forward
   */
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
  
    /**
   * Moves an element to the very front of the z-order
   * @param {Component} element - The element to send to front
   */
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

    /**
   * Handles mouse events and routes them to the appropriate component
   * @param {string} type - The type of mouse event
   * @param {number} x - The x-coordinate of the event
   * @param {number} y - The y-coordinate of the event
   * @param {Object} options - Additional options
   * @param {Event|null} options.e - The original browser event
   */
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
          if(target)
          break;
        }
      }

      //clicked somewhere outside
      if(target==null){
        if(type=="click"||type=="press"){
          if(!this.focusedField){
            return;
          }

          this.focusedField.blur();
          this.focusedField = null;
        }
        this.activeElement = -1;
        return;
      }

      let event = new MouseEvent(x, y, type, target, {event: e});
      target.dispatchEvent(event);
      if(event.type=="click" || event.type=="press"){
        if(target.type=="Input"){
          if(this.focusedField){
            this.focusedField.blur();
          }

          this.focusedField = target;
          this.focusedField.focus();
        }
      }
    }

    /**
   * Handles keyboard events and routes them to focused components
   * @param {string} type - The type of keyboard event
   * @param {number} x - The x-coordinate
   * @param {number} y - The y-coordinate
   */
    handleKeyboardEvent(type, x, y){
      if(this.focusedField){
        // console.log(this.focusedField);
        let target = this.focusedField;
        let event = new KeyboardEvent(x, y, type, target);
        // console.log(event);
        target.dispatchEvent(event);
        return;
      }

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
    /**
   * Continuously handles mouse hover events (call in draw loop)
   * @param {number} x - The current mouse x-coordinate
   * @param {number} y - The current mouse y-coordinate
   */
    hoverEventListeners(x, y){
      this.handleMouseEvent("hover", x, y);
    }

    //runs immediately after a mouse button
    //is pressed
    //separate function
    /**
   * Handles mouse click events (call when mouse is clicked)
   * @param {number} x - The click x-coordinate
   * @param {number} y - The click y-coordinate
   */
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
    /**
   * Handles mouse press events (call when mouse button is pressed)
   * @param {number} x - The press x-coordinate
   * @param {number} y - The press y-coordinate
   */
    mousePressedEventListeners(x, y){
      this.handleMouseEvent("press", x, y);
    }

    //runs once after double click
    //separate function
    /**
   * Handles mouse double-click events
   * @param {number} x - The double-click x-coordinate
   * @param {number} y - The double-click y-coordinate
   */
    mouseDoubleClickedEventListeners(x, y){
      this.handleMouseEvent("doubleClick", x, y);
    }

    //runs once after a mouse button is released
    //separate function
     /**
   * Handles mouse release events (call when mouse button is released)
   * @param {number} x - The release x-coordinate
   * @param {number} y - The release y-coordinate
   */
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
    /**
   * Handles mouse drag events (call when mouse is dragged)
   * @param {number} x - The current drag x-coordinate
   * @param {number} y - The current drag y-coordinate
   */
    mouseDraggedEventListeners(x, y){
      this.handleMouseEvent("drag", x, y);
    }

    //(enters one component and leaves another)
    //in draw function
    /**
   * Handles mouse enter events for components (call in draw function)
   * @param {number} x - The current mouse x-coordinate
   * @param {number} y - The current mouse y-coordinate
   */
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
    /**
   * Recursively pushes parent components to the entry order stack
   * @param {Component} element - The element whose parents should be pushed
   */
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
    /**
   * Handles mouse leave events for components (call in draw function)
   * @param {number} x - The current mouse x-coordinate
   * @param {number} y - The current mouse y-coordinate
   */
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
    /**
   * Handles component-to-component cursor transitions
   * @param {number} x - The current mouse x-coordinate
   * @param {number} y - The current mouse y-coordinate
   */
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
    /**
   * Handles mouse wheel scroll events
   * @param {number} x - The current mouse x-coordinate
   * @param {number} y - The current mouse y-coordinate
   * @param {WheelEvent} event - The wheel event object
   */
    mouseWheelEventListeners(x, y, event){
      this.handleMouseEvent("scroll", x, y, {e:event});
    }

    //runs once
    //separate function
    /**
   * Handles key press events (call once when key is pressed)
   * @param {number} x - The current mouse x-coordinate
   * @param {number} y - The current mouse y-coordinate
   */
    keyPressedEventListeners(x, y){
      this.handleKeyboardEvent("keyPress", x, y);
    }

    //runs continously when a key is pressed
    //to check for key continously pressed
    //keyIsPressed
    //key === 'A'
    //keyCode === ENTER
    //draw function
    /**
   * Handles continuous key down events (call in draw loop when keyIsPressed)
   * @param {number} x - The current mouse x-coordinate
   * @param {number} y - The current mouse y-coordinate
   */
    keyDownEventListeners(x, y){
      if(!keyIsPressed){
        return;
      }

      this.handleKeyboardEvent("keyDown", x, y);
    }
  }