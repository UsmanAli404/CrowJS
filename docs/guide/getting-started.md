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
├── index.html # app entry [keep as-is]
├── sketch.js # p5.js sketch [required; place app code here]
├── Core/
│   ├── Root.js # scene manager [public; use]
│   ├── Component.js # base component class [abstract/internal; don't] instantiate
│   └── GUIEvent/
│       └── GUIEvent.js # event base types [internal]
│           ├── KeyboardEvent.js # keyboard event wrapper [internal]
│           └── MouseEvent.js # mouse event wrapper [internal]
├── Frames/
│   ├── DummyFrame.js # example/testing frame [optional to use]
│   └── FrameComponent.js # frame wrapper [internal; not for direct use]
│       └── Frame.js # layout frame base [abstract; use subclasses] instead
│           ├── ScrollFrame.js # scrollable layout [public; use]
│           └── GridFrame.js # grid layout [public; use]
└── UIComponents/
    └── UIComponent.js # base UI component [abstract/internal; don't instantiate]
        ├── Input.js # input family wrapper [internal; use children]
        │   └── TextField.js # text input [public; use]
        ├── TextComponent.js # text family base [internal]
        │   ├── Label.js # read-only text [public; use]
        │   └── Button.js # clickable control [public; use]
        ├── Icon.js # icon renderer [public; use]
        |
        ...

```

::: warning Important
- **Do not rename** `sketch.js`. CrowJS depends on this filename.
- **Do not modify** the `<script>` tags in `index.html`.
:::

## Quick Start

All GUI code goes in `sketch.js`. Here's a minimal example that creates a clickable button:

```js
import { Root } from "./Core/Root.js";
import { Button } from "./UIComponents/Button.js";

/** @type {Root} */
let root;
let clickTimes = 0;

function setup(){
  root = new Root();

  const button = new Button(0, 0, 200, 100, "Click Me! 🐦‍⬛", {
    cornerRadius: 10,
  });

  button.addEventListener('click', (event) => {
    clickTimes += 1;
    event.target.setText(`You clicked ${clickTimes} times!`);
  });

  root.add(button);
};

function draw(){
  root.show();
  root.mouseEnterEventListeners(mouseX, mouseY);
};

window.mouseClicked = function(){ 
  root.mouseClickedEventListeners(mouseX, mouseY);
};
```

Open `index.html` in a browser — you'll see a styled button that updates its label as you click it.

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
