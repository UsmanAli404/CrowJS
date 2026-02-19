---
outline: deep
---

# Getting Started

CrowJS is a lightweight and extensible GUI library built on top of [p5.js](https://p5js.org/). It provides canvas-native UI components — buttons, labels, text fields, icons, and layout frames — all rendered directly inside the p5.js canvas with no HTML overlays.

## Installation

### Install via npm

Install CrowJS from npm into your project:

```bash
npm install @usman404/crowjs
```

### Download

Download or clone the [CrowJS repository](https://github.com/UsmanAli404/CrowJS) and place the project folder in your workspace. The `index.html` file already includes the required `<script>` tags for p5.js and CrowJS modules.

```bash
git clone https://github.com/UsmanAli404/CrowJS.git
```

### Project Structure

```
CrowJS/
├── index.html          # Entry point (do not modify)
├── sketch.js           # Your main sketch file
├── Core/
│   ├── Root.js         # Root manager
│   ├── Component.js    # Base component class
│   └── GUIEvent/       # Event classes
├── Frames/
│   ├── Frame.js        # Draggable/resizable container
│   ├── ScrollFrame.js  # Scrollable container
│   └── GridFrame.js    # Grid layout container
└── UIComponents/
    ├── Label.js         # Static text display
    ├── Button.js        # Interactive button
    ├── TextField.js     # Text input field
    └── Icon.js          # Image/icon display
```

::: warning Important
- **Do not rename** `sketch.js`. CrowJS depends on this filename.
- **Do not modify** the `<script>` tags in `index.html`.
:::

## Quick Start

All GUI code goes in `sketch.js`. Here's a minimal example that creates a clickable label:

```js
import { Root } from "./Core/Root.js";
import { Label } from "./UIComponents/Label.js";

/** @type {Root} */
let root;

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  root = new Root();

  const label = new Label(100, 100, 200, 60, "Hello CrowJS!", {
    cornerRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 1)",
    textColor: "rgba(255, 255, 255, 1)",
  });

  label.addEventListener("click", (event) => {
    event.target.setText("Clicked!");
  });

  root.add(label);
};

window.draw = function () {
  background(255);
  root.show();
  root.mouseEnterEventListeners(mouseX, mouseY);
  root.hoverEventListeners(mouseX, mouseY);
  root.mouseLeaveEventListeners(mouseX, mouseY);
  root.keyDownEventListeners(mouseX, mouseY);
};

window.mouseClicked = function () {
  root.mouseClickedEventListeners(mouseX, mouseY);
};

window.mousePressed = function () {
  root.mousePressedEventListeners(mouseX, mouseY);
};

window.mouseReleased = function () {
  root.mouseReleasedEventListeners(mouseX, mouseY);
};

window.mouseDragged = function () {
  root.mouseDraggedEventListeners(mouseX, mouseY);
};

window.mouseWheel = function (event) {
  root.mouseWheelEventListeners(mouseX, mouseY, event);
};

window.keyPressed = function (event) {
  if ([UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW].includes(keyCode)) {
    event.preventDefault();
  }
  root.keyPressedEventListeners(mouseX, mouseY);
};
```

Open `index.html` in a browser — you'll see a black rounded label that changes text when clicked.

## The Root Object

Every CrowJS application starts with a `Root` instance. It acts as the scene manager: it holds all top-level components, dispatches events, manages focus, and controls z-ordering.

```js
const root = new Root();
```

You then **wire up** p5.js lifecycle functions to `Root` methods so that mouse, keyboard, and hover events reach your components. The template above shows the standard wiring — copy it into every new project.

::: tip
The `draw()` loop must call `root.show()` every frame to render the GUI, along with the continuous event listeners (`hover`, `mouseEnter`, `mouseLeave`, `keyDown`).
:::

## Adding Components

Use `root.add(component)` to place a component on screen:

```js
import { Button } from "./UIComponents/Button.js";

const btn = new Button(50, 50, 160, 50, "Press Me", {
  cornerRadius: 8,
  backgroundColor: "#333",
  textColor: "#fff",
  hoverBackgroundColor: "#555",
  pressedBackgroundColor: "#111",
});

btn.addEventListener("click", () => {
  console.log("Button was clicked!");
});

root.add(btn);
```

## What's Next?

- Learn about the [Core Concepts](./core-concepts) — component hierarchy, event bubbling, and the rendering lifecycle.
- Explore individual components: [Label](./components/label), [Button](./components/button), [TextField](./components/text-field), [Icon](./components/icon).
- Organize your UI with layout frames: [Frame](./frames/frame), [ScrollFrame](./frames/scroll-frame), [GridFrame](./frames/grid-frame).
- Understand the [Event System](./events) for mouse, keyboard, and focus interactions.
