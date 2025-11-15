# CrowJS 🐦‍⬛
**CrowJS** is a lightweight and extensible GUI library built on top of [p5.js](https://p5js.org/), designed for creative coders and simulation builders who need intuitive, canvas-native UI components like buttons, sliders, input fields, and more — all rendered directly inside the p5.js canvas.

![Logo](/crowjs-01-01.png)

## ✨ Features
- Minimal and canvas-native UI for p5.js sketches  
- Frames, nested layouts, scrollable & grid containers  
- Customizable UI components: buttons, sliders, toggles, input fields, etc.  
- Event system inspired by the web (click, hover, focus, blur)  
- Modular design with support for custom components  
- Fully drawn inside p5.js (no HTML overlays or DOM interference)  
- Ideal for creative coding, simulations, visual experiments, and tools  

## 🚀 Getting Started

### 1. Install

To use **CrowJS**, begin by downloading this repository and placing the `CrowJS` folder inside your project's source code.  
Once included, open the `index.html` file in your browser; it already contains the required setup for p5.js and for loading CrowJS modules.

All GUI development should be done inside **`sketch.js`**, which serves as the main entry point for both your p5.js sketch and all CrowJS components.

---

### ⚠ Important Notes
- **Do not rename** the `sketch.js` file. CrowJS depends on this filename for consistent module loading.  
- **Do not alter** the structure or script tags inside `index.html`. Modifying them may prevent CrowJS from running correctly.  
- A **CDN-based installation** method will be added in the future to make setup even easier.

---

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
- `Label(x, y, width, height, text, {options})`  
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
