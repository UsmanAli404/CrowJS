---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "CrowJS"
  text: "P5js Powered GUI Framework"
  tagline: A lightweight GUI framework for P5js
  image:
    src: /crow.png
    alt: CrowJS logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: API Reference
      link: /api/root

features:
  - title: Structured Frame System
    details: Organize UI using ScrollFrame and GridFrame layouts instead of manual coordinate management.
    icon: 📦
    link: /guide/frames/frame
  - title: Built-in Event Handling
    details: Automatic mouse, focus, and interaction management without boilerplate.
    icon: 🖱️
    link: /guide/events
  - title: Designed for p5.js
    details: Works naturally with the p5.js draw loop and rendering lifecycle.
    icon: 🎨
    link: https://p5js.org
  - title: Lightweight & Extensible
    details: Minimal overhead with the ability to build custom components easily.
    icon: ⚡
    link: /guide/contributing
---
## Build P5.js Native UI in Minutes

<div class="home-build">
  <div class="home-build-text">

  ::: code-group

  ```js:line-numbers [CrowJS]
  import { Root } from "./Core/Root.js";
  import { Button } from "./UIComponents/Button.js";

  /** @type {Root} */
  let root;
  let clickTimes = 0;

  function setup(){
    createCanvas(windowWidth, windowHeight);
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

  ```js:line-numbers [Only p5.js]
  let btnX = 20;
  let btnY = 40;
  let btnW = 200;
  let btnH = 100;
  let btnLabel = "Click Me! 🐦‍⬛";
  let clickTimes = 0;

  // Emulate CrowJS Button defaults
  const BG = '#2a2a3d';
  const TEXT = '#e0e0e0';
  const HOVER_BG = '#3a3a5a';
  const PRESSED_BG = '#4a4a6a';
  const BORDER = '#3a3a4d';
  const CORNER = 8;

  let isHovered = false;
  let isPressed = false;

  function setup() {
    createCanvas(480, 220);
    textFont('sans-serif');
  }

  function draw() {
    background(240);

    // Determine current colors based on state
    let bg = BG;
    let txt = TEXT;
    let border = BORDER;
    if (isPressed) {
      bg = PRESSED_BG;
      txt = '#ffffff';
      border = '#6a6a9a';
    } else if (isHovered) {
      bg = HOVER_BG;
      txt = '#ffffff';
      border = '#5a5a7a';
    }

    // Optionally draw subtle shadow when hovered
    if (isHovered) {
      push();
      noStroke();
      fill('rgba(0,0,0,0.08)');
      rect(btnX + 2, btnY + 4, btnW, btnH, CORNER);
      pop();
    }

    // Button background
    push();
    stroke(border);
    strokeWeight(1);
    fill(bg);
    rect(btnX, btnY, btnW, btnH, CORNER);

    // Text
    noStroke();
    fill(txt);
    textAlign(CENTER, CENTER);
    textSize(18);
    text(btnLabel, btnX + btnW / 2, btnY + btnH / 2);
    pop();

    // Update cursor
    if (isHovered) cursor('pointer');
    else cursor();
  }

  function mouseMoved() {
    const over = isMouseOverBtn();
    if (over !== isHovered) {
      isHovered = over;
    }
  }

  function mousePressed() {
    if (isMouseOverBtn()) {
      isPressed = true;
    }
  }

  function mouseReleased() {
    if (isPressed && isMouseOverBtn()) {
      // emulate click event
      clickTimes++;
      btnLabel = `You clicked ${clickTimes} times!`;
    }
    isPressed = false;
  }

  function isMouseOverBtn() {
    return mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH;
  }
  ```
  :::

  </div>
  <div class="home-build-demo">
    <ClientOnly>
      <P5CrowDemo />
    </ClientOnly>
  </div>
</div>