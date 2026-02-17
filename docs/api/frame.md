---
outline: deep
---

# Frame <Badge type="tip" text="API" />

Resizable, draggable container with banner, shadow, and border highlight. Base class for `ScrollFrame` and `GridFrame`.

**Import:**

```js
import { Frame } from "./Frames/Frame.js";
```

**Extends:** [FrameComponent](./component) → [Component](./component)

## Constructor

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

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `backgroundColor` | `string` | `"rgba(200,200,200,1)"` | Background color |
| `borderColor` | `string` | `"rgba(0,0,0,1)"` | Border color |
| `highlightedBorderColor` | `string` | `"rgba(0,100,255,1)"` | Border color when near resize edge |
| `borderWidth` | `number` | `2` | Border thickness |
| `cornerRadius` | `number` | `0` | Corner rounding |
| `padx` | `number` | `0` | Horizontal padding |
| `pady` | `number` | `0` | Vertical padding |
| `enableReposition` | `boolean` | `false` | Real-time drag enabled |
| `enableOptimisedReposition` | `boolean` | `false` | Optimized drag (uses DummyFrame) |
| `enableResizing` | `boolean` | `false` | Real-time resize enabled |
| `enableOptimisedResizing` | `boolean` | `false` | Optimized resize (uses DummyFrame) |
| `alwaysShowBanner` | `boolean` | `false` | Banner always visible |
| `bannerHeight` | `number` | `20` | Banner bar height |
| `bannerColor` | `string` | `"rgba(100,100,100,1)"` | Banner color |
| `bannerDotColor` | `string` | `"rgba(255,255,255,1)"` | Decorative dot color |
| `nearestBorderThreshold` | `number` | `5` | Pixel distance from edge to activate resize |
| `enableShadow` | `boolean` | `false` | Shadow enabled |
| `nearestBorder` | `string \| null` | — | Currently detected border (`"left"`, `"right"`, `"top"`, `"bottom"`) |

## Methods

### `setPad(pad)`

Set uniform padding (both `padx` and `pady`).

### `setShadowColor(color)` / `setShadowBlur(blur)` / `setShadowOffsetX(x)` / `setShadowOffsetY(y)`

Configure shadow properties.

### `showBanner()` / `hideBanner()`

Toggle the banner bar.

### `updateDimensions()`

Recalculate dimensions during resize. Respects minimum size constraints.

### `updatePosition()`

Recalculate position during drag.

### `redraw()`

Reflow children to match current dimensions.

### `turnResizingAndRepositionOff()`

Recursively disable all resizing and repositioning.

### `clearHoverCache(options?)`

Clear internal hover/interaction state.

### `createDummyFrame(type)`

Create a `DummyFrame` overlay for optimized resize/reposition operations.

### `drawShadow()`

Render the drop shadow using Canvas 2D API.
