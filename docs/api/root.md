---
outline: deep
---

# Root

The `Root` class is the top-level scene manager. It holds all components, dispatches events, manages focus and z-ordering.

**Import:**

```js
import { Root } from "./Core/Root.js";
```

## Constructor

```js
new Root(options?)
```

| Option | Type | Default | Description |
|---|---|---|---|
| `showDebugOverlay` | `boolean` | `false` | Show debug overlays (margins/padding) on all components |

## Properties

| Property | Type | Description |
|---|---|---|
| `layers` | `Component[]` | Ordered array of top-level components (z-order) |
| `elementsMap` | `Map<string, Component>` | ID-to-component lookup map |
| `activeElement` | `Component \| null` | Currently interacted component |
| `lastActiveElement` | `Component \| null` | Previously active component |
| `focusedField` | `Input \| null` | Currently focused input field |
| `showDebugOverlay` | `boolean` | Global debug overlay flag |

## Methods

### Scene Management

#### `add(element)`

Add a component to the scene. Registers its IDs in the elements map and sets the component's root reference.

```js
root.add(myButton);
```

#### `remove(element)`

Remove a component from the scene. Cleans up ID registrations and root references.

```js
root.remove(myButton);
```

#### `getElementById(id)`

Find a component by its `id` string.

```js
const label = root.getElementById("statusLabel");
```

#### `show()`

Render all layers. Call this every frame in `draw()`.

```js
root.show();
```

### Z-Ordering

#### `sendToFront(element)`

Move a component to the topmost layer (rendered last).

#### `sendToBack(element)`

Move a component to the bottommost layer (rendered first).

#### `sendForwards(element)`

Move a component one layer forward.

#### `sendBackwards(element)`

Move a component one layer backward.

### Event Dispatch

#### Continuous (call in `draw()`)

| Method | Description |
|---|---|
| `hoverEventListeners(x, y)` | Dispatch hover events |
| `mouseEnterEventListeners(x, y)` | Dispatch mouseEnter events |
| `mouseLeaveEventListeners(x, y)` | Dispatch mouseLeave events |
| `keyDownEventListeners(x, y)` | Dispatch keyDown events (held keys) |

#### One-Shot (call from window handlers)

| Method | Description |
|---|---|
| `mouseClickedEventListeners(x, y)` | Dispatch click events |
| `mousePressedEventListeners(x, y)` | Dispatch press events |
| `mouseReleasedEventListeners(x, y)` | Dispatch release events |
| `mouseDoubleClickedEventListeners(x, y)` | Dispatch doubleClick events |
| `mouseDraggedEventListeners(x, y)` | Dispatch drag events |
| `mouseWheelEventListeners(x, y, event)` | Dispatch scroll events |
| `keyPressedEventListeners(x, y, nativeEvent?)` | Dispatch keyPress events |
