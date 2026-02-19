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
      link: /guide/getting-started
    - theme: alt
      text: API Reference
      link: /api/root

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

  const button = new Button(0, 0, 200, 100, "Click Me! ðŸ¦â€â¬›", {
    cornerRadius: 10,
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
## Available components

A quick reference to CrowJS's built-in components â€” each item includes a short description, major features, and a link to the API page.

### UI components

- **Button** â€” Clickable button with text/icon and styling options.
  - Major features: click events, icon support, corner radius & styles
  - Docs: [/api/button](/api/button)

- **Label** â€” Read-only text element for static UI text.
  - Major features: text wrapping, alignment, simple styling
  - Docs: [/api/label](/api/label)

- **Icon** â€” Render images or icons inside the UI.
  - Major features: fit modes, tinting, size control
  - Docs: [/api/icon](/api/icon)

- **Input** â€” Low-level input element for custom editors.
  - Major features: focus handling, keyboard events, value access
  - Docs: [/api/input](/api/input)

- **TextComponent** â€” Simple text renderer for styled text blocks.
  - Major features: formatting, layout-friendly sizing
  - Docs: [/api/text-component](/api/text-component)

- **TextField** â€” Editable single/multi-line text field.
  - Major features: caret & selection, keyboard input, validation hooks
  - Docs: [/api/text-field](/api/text-field)

- **UIComponent** â€” Base class every UI component extends.
  - Major features: common lifecycle, styling & event hooks
  - Docs: [/api/ui-component](/api/ui-component)

### Frames

- **Frame** â€” Basic container for grouping components.
  - Major features: position/size management, add/remove children
  - Docs: [/api/frame](/api/frame)

- **GridFrame** â€” Grid layout for rows/columns.
  - Major features: automatic cell sizing, spacing & alignment
  - Docs: [/api/grid-frame](/api/grid-frame)

- **ScrollFrame** â€” Scrollable container for overflow content.
  - Major features: vertical/horizontal scrolling, inertia support
  - Docs: [/api/scroll-frame](/api/scroll-frame)
