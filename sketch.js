import { Root } from "./Core/Root.js";
import { Button } from "./UIComponents/Button.js";
import { Slider } from "./UIComponents/Slider.js";
import { ScrollFrame } from "./Frames/ScrollFrame.js";

/** @type {Root} */
let root;
let clickTimes=0;

window.setup = function(){
    createCanvas(windowWidth, windowHeight);
    root = new Root();

    const button = new Button(0, 0, 200, 100, "Click Me! 🐦‍⬛", {
      cornerRadius: 10,
    });
    button.addEventListener('click', (event) => {
      clickTimes += 1;
      event.target.setText(`You clicked ${clickTimes} times!`);
    });

    const slider = new Slider(windowWidth/2, windowHeight/2, 300, 50, {});

    const sf = new ScrollFrame(windowWidth/2, windowHeight/2, 300, 300, {
      enableReposition: true,
      alwaysShowBanner: true,
      enableResizing: true,
      pad: 5,
    });
    sf.add(button);
    sf.add(slider);
    
    // root.add(button);
    root.add(sf);
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