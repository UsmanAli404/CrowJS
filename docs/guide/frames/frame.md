---
outline: deep
---

# Frame

A `Frame` is a draggable, resizable container with optional banner, shadow, and border highlight. It serves as the base for `ScrollFrame` and `GridFrame`.

## Import

```js
import { Frame } from "./Frames/Frame.js";
```

## Basic Usage

```js
const frame = new Frame(
  100, 100,   // x, y
  400, 300,   // width, height
  "myFrame",  // id
  "#ffffff",  // backgroundColor
  "#cccccc",  // borderColor
  "#3b82f6",  // highlightedBorderColor
  2,          // borderWidth
  12,         // cornerRadius
);

root.add(frame);
```

::: tip
For most use cases, prefer `ScrollFrame` or `GridFrame` — they extend `Frame` with layout management and accept a clean options object instead of positional arguments.
:::

## Key Features

### Dragging (Reposition)

Frames can be dragged by their **banner** (a colored bar at the top). Enable with:

- `enableReposition: true` — real-time repositioning
- `enableOptimisedReposition: true` — shows a lightweight "dummy" frame during drag, applies final position on release (better performance)

### Resizing

Hover near a frame edge to reveal resize handles. Enable with:

- `enableResizing: true` — real-time resizing
- `enableOptimisedResizing: true` — shows a dummy frame during resize

Borders are highlighted when the cursor is near a resizable edge.

### Banner

The banner is a small colored bar at the top of the frame with decorative dots. When `alwaysShowBanner` is `true`, it is always visible. Otherwise, it appears only on hover.

### Shadow

Enable a drop shadow beneath the frame:

```js
// Pass in constructor or set with methods:
frame.setShadowColor("rgba(0,0,0,0.3)");
frame.setShadowBlur(15);
frame.setShadowOffsetX(4);
frame.setShadowOffsetY(4);
```

## Constructor Parameters

The `Frame` constructor uses positional arguments (unlike `ScrollFrame` / `GridFrame` which use an options object):

```js
new Frame(x, y, width, height, id, backgroundColor, borderColor,
  highlightedBorderColor, borderWidth, cornerRadius, padx, pady,
  alwaysShowBanner, bannerHeight, bannerColor, bannerDotColor,
  nearestBorderThreshold, parent, type, enableReposition,
  enableOptimisedReposition, enableResizing, enableOptimisedResizing,
  enableShadow, shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY,
  { margin, marginx, marginy, marginl, marginr, margint, marginb,
    minWidth, minHeight, showDebugOverlay })
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `x`, `y` | `number` | — | Position |
| `width`, `height` | `number` | — | Dimensions |
| `id` | `string` | `null` | Unique ID |
| `backgroundColor` | `string` | `"rgba(200,200,200,1)"` | Background |
| `borderColor` | `string` | `"rgba(0,0,0,1)"` | Border color |
| `highlightedBorderColor` | `string` | `"rgba(0,100,255,1)"` | Border color on hover near edge |
| `borderWidth` | `number` | `2` | Border thickness |
| `cornerRadius` | `number` | `0` | Corner rounding |
| `padx` / `pady` | `number` | `0` | Internal padding |
| `alwaysShowBanner` | `boolean` | `false` | Always show banner |
| `bannerHeight` | `number` | `20` | Banner height |
| `bannerColor` | `string` | `"rgba(100,100,100,1)"` | Banner color |
| `bannerDotColor` | `string` | `"rgba(255,255,255,1)"` | Banner dot color |
| `nearestBorderThreshold` | `number` | `5` | Resize activation distance |
| `enableReposition` | `boolean` | `false` | Enable real-time drag |
| `enableOptimisedReposition` | `boolean` | `false` | Enable optimised drag |
| `enableResizing` | `boolean` | `false` | Enable real-time resize |
| `enableOptimisedResizing` | `boolean` | `false` | Enable optimised resize |
| `enableShadow` | `boolean` | `false` | Enable shadow |

## Methods

### Padding

```js
frame.setPad(10); // Sets padx and pady to 10
```

### Shadow

```js
frame.setShadowColor("rgba(0,0,0,0.4)");
frame.setShadowBlur(12);
frame.setShadowOffsetX(3);
frame.setShadowOffsetY(3);
```

### Events

```js
frame.addEventListener("resize", (event) => {
  console.log("Frame resized to", frame.width, frame.height);
});

frame.addEventListener("reposition", (event) => {
  console.log("Frame moved to", frame.x, frame.y);
});
```

### Disabling Interactions

```js
frame.turnResizingAndRepositionOff(); // Recursively disables on this + children
```
