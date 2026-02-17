---
outline: deep
---

# Event System

CrowJS provides a DOM-inspired event system for handling mouse, keyboard, and focus interactions on canvas components.

## Overview

Events in CrowJS flow through the component tree similarly to browser DOM events. When an event occurs, CrowJS finds the deepest component at the mouse position and dispatches the event there, then **bubbles** it up through parent components until it reaches the root or is stopped.

## Registering Listeners

Use `addEventListener` on any component:

```js
component.addEventListener("click", (event) => {
  console.log("Clicked on:", event.target);
});
```

You can register multiple listeners for the same event type.

## Event Object

All events extend `GUIEvent`:

| Property | Type | Description |
|---|---|---|
| `x` | `number` | Mouse X position at the time of the event |
| `y` | `number` | Mouse Y position at the time of the event |
| `type` | `string` | Event type string (e.g., `"click"`, `"hover"`) |
| `target` | `Component` | The component that originally triggered the event |
| `propagationStopped` | `boolean` | Whether propagation has been stopped |

### `event.stopPropagation()`

Prevents the event from bubbling up to parent components:

```js
button.addEventListener("click", (event) => {
  event.stopPropagation(); // Parent frame won't receive this click
});
```

## Event Types

### Mouse Events

These events carry `MouseEvent` properties, which extend `GUIEvent`.

| Event | When Fired | Dispatch |
|---|---|---|
| `click` | Mouse click on component | One-shot, bubbles |
| `press` | Mouse button pressed down | One-shot, bubbles |
| `release` | Mouse button released | One-shot, bubbles |
| `doubleClick` | Double-click | One-shot, bubbles |
| `drag` | Mouse moved while pressed | One-shot, bubbles |
| `hover` | Mouse is over component | Continuous (every frame) |
| `mouseEnter` | Mouse enters component bounds | One-shot, no bubble |
| `mouseLeave` | Mouse leaves component bounds | One-shot, no bubble |
| `scroll` | Mouse wheel scrolled | One-shot, bubbles |

For `scroll` events, `event.delta` indicates scroll direction (positive = up, negative = down).

### Keyboard Events

These events carry `KeyboardEvent` properties, extending `GUIEvent` with a `nativeEvent` property.

| Event | When Fired | Dispatch |
|---|---|---|
| `keyPress` | Key pressed (single fire) | One-shot |
| `keyDown` | Key held (continuous) | Continuous (every frame) |

Access the native browser `KeyboardEvent` via `event.nativeEvent`:

```js
field.addEventListener("keyPress", (event) => {
  console.log("Key:", event.nativeEvent.key);
  console.log("Code:", event.nativeEvent.code);
});
```

### Focus Events

| Event | When Fired |
|---|---|
| `focus` | Component receives input focus |
| `blur` | Component loses input focus |

### Layout Events

| Event | When Fired |
|---|---|
| `resize` | Component dimensions changed |
| `reposition` | Component position changed |

## Wiring Events to Root

For events to reach your components, you must wire p5.js lifecycle callbacks to the corresponding `Root` methods.

### Continuous Events (in `draw()`)

These must be called every frame:

```js
window.draw = function () {
  background(255);
  root.show();

  // Required for hover, mouseEnter/Leave, and keyDown
  root.hoverEventListeners(mouseX, mouseY);
  root.mouseEnterEventListeners(mouseX, mouseY);
  root.mouseLeaveEventListeners(mouseX, mouseY);
  root.keyDownEventListeners(mouseX, mouseY);
};
```

### One-Shot Events (window handlers)

```js
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
  // Prevent default arrow key scrolling
  if ([UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW].includes(keyCode)) {
    event.preventDefault();
  }
  root.keyPressedEventListeners(mouseX, mouseY);
};
```

## Event Dispatch Patterns

### Bubble (default)

Events fire on the target component, then propagate up through each parent:

```
Target → Parent → Grandparent → ... → Root layer
```

Use `event.stopPropagation()` to stop at any point.

### Self-Only

`dispatchEventOnlyOnSelf(event)` fires only on the target. Used internally for events like `mouseEnter` and `mouseLeave`.

### Trickle-Down

`dispatchTrickleDownEvent(event)` fires on the target and **all** its descendants. Useful for broadcasting state changes:

```js
// Notify all children that the frame was resized
frame.dispatchTrickleDownEvent(new GUIEvent(0, 0, "resize", frame));
```

## Practical Examples

### Hover Effect on Label

```js
const label = new Label(50, 50, 200, 60, "Hover me!", {
  backgroundColor: "#e5e7eb",
  cornerRadius: 8,
});

label.addEventListener("mouseEnter", () => {
  label.backgroundColor = "#bfdbfe";
});

label.addEventListener("mouseLeave", () => {
  label.backgroundColor = "#e5e7eb";
});
```

### Keyboard Navigation in ScrollFrame

```js
const scrollFrame = new ScrollFrame(50, 50, 300, 400, {
  alignment: "v",
  enableVScroll: true,
});

// Arrow keys automatically scroll when a child has focus
// You can also listen for keyDown on children:
child.addEventListener("keyDown", (event) => {
  // Custom key handling
});
```

### Event Delegation

Since events bubble, you can listen on a parent to handle events from any child:

```js
const frame = new ScrollFrame(50, 50, 300, 400, { alignment: "v" });

// Add many buttons
for (let i = 0; i < 10; i++) {
  frame.add(new Button(0, 0, 0, 0, `Button ${i}`, { id: `btn-${i}` }));
}

// Single listener on the frame catches all child clicks
frame.addEventListener("click", (event) => {
  console.log("Clicked child:", event.target.id);
});
```
