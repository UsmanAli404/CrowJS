---
outline: deep
---

# Component

The base class for all CrowJS elements. Provides positioning, margins, parent-child relationships, event handling, and hit testing.

**Import:**

```js
import { Component } from "./Core/Component.js";
```

## Constructor

```js
new Component(x, y, width, height, options?)
```

| Parameter | Type | Description |
|---|---|---|
| `x` | `number` | X position |
| `y` | `number` | Y position |
| `width` | `number` | Width |
| `height` | `number` | Height |

**Options:**

| Option | Type | Default | Description |
|---|---|---|---|
| `type` | `string` | `null` | Component type identifier |
| `id` | `string` | `null` | Unique string ID |
| `margin` | `number` | `0` | Uniform margin |
| `marginx` | `number` | `0` | Left + right margin |
| `marginy` | `number` | `0` | Top + bottom margin |
| `marginl` | `number` | `0` | Left margin |
| `marginr` | `number` | `0` | Right margin |
| `margint` | `number` | `0` | Top margin |
| `marginb` | `number` | `0` | Bottom margin |
| `minWidth` | `number` | `0` | Minimum width constraint |
| `minHeight` | `number` | `0` | Minimum height constraint |
| `showDebugOverlay` | `boolean` | `false` | Show margin/padding overlay |

## Properties

| Property | Type | Description |
|---|---|---|
| `x`, `y` | `number` | Position |
| `width`, `height` | `number` | Dimensions |
| `id` | `string \| null` | Unique identifier |
| `parent` | `Component \| null` | Parent component |
| `root` | `Root \| null` | Root manager reference |
| `children` | `Component[]` | Child components |
| `eventListeners` | `object` | Map of event type to callback arrays |

### Computed Properties

| Getter | Description |
|---|---|
| `outerX` | `x - marginl` |
| `outerY` | `y - margint` |
| `outerWidth` | `width + marginl + marginr` |
| `outerHeight` | `height + margint + marginb` |

## Methods

### Event Handling

#### `addEventListener(eventType, callback)`

Register an event listener.

```js
component.addEventListener("click", (event) => { /* ... */ });
```

#### `dispatchEvent(event)`

Dispatch event with bubbling (fires on self, then propagates to parent).

#### `dispatchEventOnlyOnSelf(event)`

Dispatch event without propagation.

#### `dispatchTrickleDownEvent(event)`

Dispatch event to self and all descendants.

#### `dispatchMouseEnterEvent(event)` / `dispatchMouseLeaveEvent(event)`

Dispatch mouseEnter/mouseLeave events (no bubbling).

### Tree Traversal

#### `findElement(element)`

Recursively search for a component in the subtree.

#### `findIndexOfElement(element)`

Get the index of a direct child.

#### `getElementById(id)`

Recursively find a component by ID.

#### `findTarget()`

Find the deepest component under the current mouse position.

#### `isChildOf(element)`

Check if this component is a descendant of the given element.

#### `removeChild(element)`

Remove a direct child from the children array.

### Utility

#### `isInside()`

Hit test — returns `true` if the mouse is inside this component's bounds, accounting for corner radius and parent scroll frame clipping.

#### `setRoot(root)`

Set the Root reference recursively on this component and all descendants.

#### `getEffectiveMinWidth()` / `getEffectiveMinHeight()`

Get the effective minimum dimensions (overridden by subclasses like GridFrame).

#### `turnResizingAndRepositionOff()`

Recursively disable resizing and repositioning on this component and all descendants.

#### `drawDebugOverlay()` / `drawDebugOverlayRecursive()`

Render margin (orange) and padding (blue) debug overlays.

#### `fillElementsMap(map)`

Populate an ID-to-component map for this subtree.

## Supported Events

`hover`, `mouseEnter`, `mouseLeave`, `click`, `press`, `release`, `drag`, `doubleClick`, `scroll`, `keyPress`, `keyDown`, `resize`, `reposition`, `focus`, `blur`
