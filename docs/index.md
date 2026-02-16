---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "CrowJS"
  text: "P5js Powered GUI Framework"
  tagline: A lightweight GUI framework for ...
  image:
    src: /crow.png
    alt: CrowJS logo
  actions:
    - theme: brand
      text: Get Started
      link: /get-started
    - theme: alt
      text: Examples
      link: /examples

features:
  - title: Structured Frame System
    details: Organize UI using ScrollFrame and GridFrame layouts instead of manual coordinate management.
  - title: Built-in Event Handling
    details: Automatic mouse, focus, and interaction management without boilerplate.
  - title: Designed for p5.js
    details: Works naturally with the p5.js draw loop and rendering lifecycle.
  - title: Lightweight & Extensible
    details: Minimal overhead with the ability to build custom components easily.
---
## Build P5.js Native UI in Minutes

<div class="home-build">
  <div class="home-build-text">

```js
import { Root } from "./Core/Root.js";
import { Button } from "./UIComponents/Button.js";

/** @type {Root} */
let root;
let clickTimes = 0;

function setup(){
  root = new Root();

  const button = new Button(0, 0, 200, 100, "Click Me! 🐦‍⬛", {
    cornerRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 1)",
    textColor: "rgba(255, 255, 255, 1)"
  });

  button.addEventListener('click', (event) => {
    clickTimes += 1
    event.target.setText(`You clicked ${clickTimes} times!`)
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

  </div>
  <div class="home-build-demo">
    <ClientOnly>
      <P5CrowDemo />
    </ClientOnly>
  </div>
</div>
