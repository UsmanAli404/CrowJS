import { Root } from "./Core/Root.js";
import { Label } from "./UIComponents/Label.js";
import { Checkbox } from "./UIComponents/Checkbox.js";
import { RadioButton } from "./UIComponents/RadioButton.js";
import { GridFrame } from "./Frames/GridFrame.js";

/** @type {Root} */
let root;
let clickTimes=0;

window.setup = function(){
    createCanvas(windowWidth, windowHeight);
    root = new Root();

    const frame = new GridFrame(20, 20, 500, 50, {
      rows: 1,
      cols: 3,
      backgroundColor: "#1e1e2e",
    });

    const rb1 = new RadioButton(0, 0, 0, 0, "Low", { group: "quality", value: "low", selected: true });
    const rb2 = new RadioButton(0, 0, 0, 0, "Medium", { group: "quality", value: "medium" });
    const rb3 = new RadioButton(0, 0, 0, 0, "High", { group: "quality", value: "high" });

    frame.colConfig(1, 5);

    frame.add(rb1, 0, 0);
    frame.add(rb2, 0, 1);
    frame.add(rb3, 0, 2);

    root.add(frame);
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