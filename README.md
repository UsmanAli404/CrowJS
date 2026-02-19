<div align="center">
  <img src="/docs/public/crowjs_favicon.png" alt="CrowJS Logo" width="270" />
  
  # CrowJS
  
  **A lightweight, canvas-native GUI library built for p5.js.**
  
  [![NPM Version](https://img.shields.io/npm/v/@usman404/crowjs?style=for-the-badge&logo=npm&color=CB3837)](https://www.npmjs.com/package/@usman404/crowjs)
  [![Read the Docs](https://img.shields.io/badge/📖_Read_The_Docs-181717?style=for-the-badge&logo=vercel&logoColor=white)](https://crow-js.vercel.app/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

  <br/>

  *Designed for creative coders and simulation builders who need intuitive UI components like buttons, sliders, and input fields rendered directly inside the p5.js canvas.*
</div>

---

## 🌟 Why CrowJS?
While p5.js is amazing for generative art and simulations, there's a noticeable gap when it comes to in-sketch UI. CrowJS fills that gap by giving you a **canvas-first GUI framework** that blends seamlessly with your visuals without relying on clunky HTML overlays or DOM interference.

## ✨ Features
- **Minimal & Canvas-Native:** UI drawn directly inside your p5.js sketches.
- **Layout Systems:** Frames, nested layouts, scrollable areas, and grid containers.
- **Customizable Components:** Buttons, sliders, toggles, input fields, and more.
- **Web-Style Event System:** Supports `click`, `hover`, `focus`, and `blur`.
- **Modular Design:** Easily create and integrate your own custom components.
- **Perfect For:** Creative coding, visual experiments, simulations, and internal tools.

---

## 🚀 Getting Started

### 1. Installation

**Via NPM (Recommended)**
```bash
npm install @usman404/crowjs
```

**Via Manual Download**
Download this repository and place the `CrowJS` folder inside your project's source code. Open the `index.html` file in your browser (it already contains the required setup for p5.js and module loading). 

> [!WARNING]
> - **Do not rename** the `sketch.js` file. CrowJS depends on this filename for consistent module loading.  
> - **Do not alter** the structure or script tags inside `index.html`. Modifying them may prevent CrowJS from running correctly.  

### 2. Basic Example
All GUI development should be done inside **`sketch.js`**, which serves as the main entry point for both your p5.js sketch and your CrowJS components.

```javascript
import { Root } from "./Core/Root.js";
import { Button } from "./UIComponents/Button.js";

/** @type {Root} */
let root;
let clickTimes = 0;

function setup() {
  root = new Root();

  const button = new Button(0, 0, 200, 100, "Click Me! 🐦‍⬛", {
    cornerRadius: 10,
  });

  button.addEventListener('click', (event) => {
    clickTimes += 1;
    event.target.setText(`You clicked ${clickTimes} times!`);
  });

  root.add(button);
}

function draw() {
  root.show();
  
  // Event Listeners
  root.mouseEnterEventListeners(mouseX, mouseY);
  root.hoverEventListeners(mouseX, mouseY);
  root.mouseLeaveEventListeners(mouseX, mouseY);
}

window.mouseClicked = function() { 
  root.mouseClickedEventListeners(mouseX, mouseY);
}

window.mousePressed = function() {
  root.mousePressedEventListeners(mouseX, mouseY);
}

window.mouseReleased = function() {
  root.mouseReleasedEventListeners(mouseX, mouseY);
}
```

---

## 🧩 Components Overview
  
- Label(x, y, width, height, text, {options})
- Button
- ScrollFrame
- GridFrame
  
*More components and detailed API documentation coming soon!*

---

## 📚 Documentation & Tutorials
A full **video series** and our documentation site are actively being updated! 

Check out the official docs at **[crow-js.vercel.app](https://crow-js.vercel.app/)** for:  
- Getting started tutorials  
- Custom component creation guides  
- Internals of CrowJS for contributors  

---

## 🤝 Contributing
CrowJS is open-source! Contributions, bug reports, and ideas are highly welcome.  
Please see the `CONTRIBUTING.md` file for details on how to get started.

## 🔗 Links
- **Creator's Sketches:** [Usman's p5.js Editor](https://editor.p5js.org/Usman_Ali/sketches/)
- **Powered By:** [p5.js Official Site](https://p5js.org)

---

<div align="center">
  Created with ❤️ by <b>Usman</b> <br/>
  <i>Licensed under the MIT License.</i>
</div>
