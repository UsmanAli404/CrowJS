# CrowJS 🐦‍⬛
**CrowJS** is a lightweight and extensible GUI library built on top of [p5.js](https://p5js.org/), designed for creative coders and simulation builders who need intuitive, canvas-native UI components like buttons, sliders, input fields, and more — all rendered directly inside the p5.js canvas.

![Logo](/crowjs-01-01.png)

## ✨ Features
- 🪶 Minimal and canvas-native UI for p5.js sketches  
- 🧱 Frames, nested layouts, scrollable & grid containers  
- 🎛️ Customizable UI components: buttons, sliders, toggles, input fields, etc.  
- 🧠 Event system inspired by the web (click, hover, focus, blur)  
- 🧩 Modular design with support for custom components  
- 🎨 Fully drawn inside p5.js (no HTML overlays or DOM interference)  
- 🧪 Ideal for creative coding, simulations, visual experiments, and tools  

## 🚀 Getting Started

### 1. Install

Via CDN (not yet available):
```html
<script src="https://your-cdn-link.com/crow.min.js"></script>
```

Or include the source directly if you're contributing or customizing:
```html
<script src="crow.js"></script>
```

### 2. Basic Example
```javascript
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
```

## 🧰 Components Overview
- `Button(text, callback)`   
- `TextField(placeholder, callback)`  
- `ScrollFrame`, `GridFrame`, `Label`, etc.  

More components and documentation coming soon.

## 📚 Documentation & Tutorials
A full **video series** and documentation site are in the works!  
Stay tuned for:  
- Getting started tutorials  
- Custom component creation  
- Internals of CrowJS for contributors  

## 💡 Why CrowJS?
While p5.js is amazing for generative art and simulations, there's a noticeable gap when it comes to in-sketch UI. CrowJS fills that gap by giving you a canvas-first GUI framework that blends seamlessly with your visuals.

## 🤝 Contributing
CrowJS is open-source! Contributions, bug reports, and ideas are welcome.  
See the `CONTRIBUTING.md` file for details.

## 📄 License
This project is licensed under the MIT License.  
See the `LICENSE` file for details.

## 🌐 Links
- My sketches: [https://editor.p5js.org/Usman_Ali/sketches/](p5js.org/Usman_Ali/sketches/)
- p5.js: [https://p5js.org](https://p5js.org)

Created with ❤️ by **Usman**
