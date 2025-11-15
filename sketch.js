import { Root } from "./Core/Root.js";
import { Label } from "./UIComponents/Label.js";


/** @type {Root} */
let root;
let clickTimes=0;

window.setup = function(){
    createCanvas(windowWidth, windowHeight);
    root = new Root();

    let btnWidth = 200;
    let btnHeight = 100;

    let btn = new Label((windowWidth/2)-(btnWidth/2), (windowHeight/2)-(btnHeight/2), 200, 100, "Hello! 👋", 
      {cornerRadius: 20,
       backgroundColor: "rgba(0, 0, 0, 1)",
       textColor: "rgba(255, 255, 255, 1)",
      });

    btn.addEventListener("click", (event)=>{
      clickTimes+=1;
      event.target.setText(`You clicked ${clickTimes} \ntimes!`);
    });

    root.add(btn);
}

window.draw = function () {
  background('rgba(255,255,255,255)');
  root.show();
  root.mouseEnterEventListeners(mouseX, mouseY);
  root.hoverEventListeners(mouseX, mouseY);
  root.mouseLeaveEventListeners(mouseX, mouseY);
  root.keyDownEventListeners(mouseX, mouseY);
}

window.mouseDragged = function (){
  root.mouseDraggedEventListeners(mouseX, mouseY);
}

window.mouseClicked = function(){ 
  root.mouseClickedEventListeners(mouseX, mouseY);
}

window.mousePressed = function(){
  root.mousePressedEventListeners(mouseX, mouseY);
}

window.mouseReleased = function(){
  root.mouseReleasedEventListeners(mouseX, mouseY);
}

window.mouseWheel = function(event){
  root.mouseWheelEventListeners(mouseX, mouseY, event);
}

window.keyPressed = function(event){
  if (keyCode === UP_ARROW || keyCode === DOWN_ARROW || keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    event.preventDefault();
  }

  root.keyPressedEventListeners(mouseX, mouseY);
}