export class Root{
    constructor(){
      this.layers = []; //will primarily store frames
      this.preferences = []; //will store preferences for each frame
      this.lastActiveElement = -2;
      this.activeElement = -1;
      this.makeChange=false;
    }
  
    show(){
      for(let i=0; i<this.layers.length; i++){
        this.layers[i].show();
      }
    }
  
    //needs safeguards against illegal access
    add(element, {onClickSendToFront=true}={}){
      this.layers.push(element);
      this.preferences.push({onClickSendToFront: onClickSendToFront});
      
      if(element.constructor.name==="GridFrame"){
        for (let i = 0; i < element.rows; i++) {
          for (let j = 0; j < element.cols; j++) {
            if(element.grid[i][j]!=null && element.grid[i][j][0].type==="Frame"){
              this.add(element.grid[i][j][0], {onClickSendToFront: true});
            }
          }
        }
      } else if(element.constructor.name==="ScrollFrame"){
        for(let elem of element.elements){
          if(elem!=null && elem[0].type==="Frame"){
            this.add(elem[0], {onClickSendToFront: true});
          }
        }
      }
    }
  
    //needs safeguards against illegal access
    modifyPreferences(element, {onClickSendToFront=true}={}){
      let i = this.findElement(element);
      if(i!=-1){
        this.preferences[i] = {onClickSendToFront: onClickSendToFront};
      }
    }
  
    findElement(element){
      for(let i=0; i<this.layers.length; i++){
        if(this.layers[i]==element){
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
  
    //each elments's drawEventListener will send true or false depending on whether the cursor is hovering over it or not
    //it will also notify its parent if the cursor is over it
    drawEventListener(){
      if(mouseIsPressed && this.activeElement!=-1){
        //logic for sending the active element to front
        if(this.makeChange && this.preferences[this.activeElement].onClickSendToFront){
          this.sendToFront(this.layers[this.activeElement]);
          this.activeElement=this.layers.length-1;
          this.makeChange=false;
        }
        //logic for dragging an element
        this.layers[this.activeElement].drawEventListener();
        return;
      }
  
      //logic for finding the active element, the elements event listener will send a signal
      for(let i=this.layers.length-1; i>=0; i--){
        if(this.layers[i].drawEventListener()){
          if(this.lastActiveElement!=this.activeElement && this.activeElement!=i){
            this.lastActiveElement=this.activeElement;
            this.handleLastActiveElement();
          }
  
          this.activeElement=i;
          this.makeChange=true;
          console.log("active element: ",this.activeElement, "last active element: ",this.lastActiveElement);
          break;
        }
      }
    }
  
    handleLastActiveElement(){
      if(this.lastActiveElement<0){
        return;
      }
  
      if(this.layers[this.lastActiveElement].type=="Frame"){
        this.layers[this.lastActiveElement].clearHoverCache();
        console.log("handled last active element: "+this.lastActiveElement);
      }
      this.lastActiveElement=-2;
    }
  
    mouseReleasedEventListener(){
      if(this.activeElement<0){
        return;
      }
  
      this.layers[this.activeElement].mouseReleasedEventListener();
      this.activeElement=-1;
    }
  }