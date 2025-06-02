# CrowJS 🐦‍⬛
**CrowJS** is a lightweight and extensible GUI library built on top of [p5.js](https://p5js.org/), designed for creative coders and simulation builders who need intuitive, canvas-native UI components like buttons, sliders, input fields, and more — all rendered directly inside the p5.js canvas.

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
let root, btn;

function setup() {
  createCanvas(400, 400);
  root = new Crow.Root();

  btn = new Crow.Button("Click Me", () => {
    console.log("Button Clicked!");
  });

  root.add(btn);
}

function draw() {
  background(220);
  root.draw();
}

function mousePressed() {
  root.handleMousePressed(mouseX, mouseY);
}
```

## 🧰 Components Overview
- `Button(text, callback)`   
- `TextField(placeholder, callback)`  
- `ScrollFrame`, `GridFrame`, `Panel`, `Label`, etc.  

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
- GitHub: https://github.com/UsmanAli404
- p5.js: [https://p5js.org](https://p5js.org)

Created with ❤️ by **Usman**
