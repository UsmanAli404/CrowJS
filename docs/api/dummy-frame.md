---
outline: deep
---

# DummyFrame <Badge type="tip" text="API" />

Temporary overlay frame used during optimized resize and reposition operations. When a `Frame` has `enableOptimisedResizing` or `enableOptimisedReposition` enabled, a `DummyFrame` is created to preview the new size/position before applying it to the actual frame on mouse release.

**Import:**

```js
import { DummyFrame } from "./Frames/DummyFrame.js";
```

**Extends:** [Component](./component)

## Constructor

```js
new DummyFrame(x, y, width, height, type)
```

| Parameter | Type | Description |
|---|---|---|
| `x` | `number` | X position |
| `y` | `number` | Y position |
| `width` | `number` | Width |
| `height` | `number` | Height |
| `type` | `string` | Operation type — `DummyFrame.RESIZE_DF` or `DummyFrame.REPOSITION_DF` |

## Static Constants

| Constant | Value | Description |
|---|---|---|
| `DummyFrame.RESIZE_DF` | `"ResizeDF"` | Indicates a resize operation |
| `DummyFrame.REPOSITION_DF` | `"RepositionDF"` | Indicates a reposition (drag) operation |

## Properties

| Property | Type | Description |
|---|---|---|
| `nearestBorder` | `string \| null` | _(Resize only)_ The border being dragged — `"left"`, `"right"`, `"top"`, `"bottom"`, `"top-left"`, `"top-right"`, `"bottom-left"`, or `"bottom-right"` |
| `prevX` | `number \| null` | _(Reposition only)_ Previous x position |
| `prevY` | `number \| null` | _(Reposition only)_ Previous y position |
| `xDist` | `number \| null` | _(Reposition only)_ Horizontal offset from mouse to frame origin |
| `yDist` | `number \| null` | _(Reposition only)_ Vertical offset from mouse to frame origin |

## Methods

### `updateDimensions()`

Recalculates the frame's dimensions based on the current mouse position and the `nearestBorder` value. Respects the parent frame's effective minimum width and height constraints.

### `updatePosition()`

Updates the frame position to follow the mouse cursor during a reposition operation, maintaining the original grab offset.

### `onMouseHover(event)`

Handles hover events on the dummy frame. Stops event propagation.

### `onMouseDrag(event)`

Handles drag events. Delegates to `updateDimensions()` for resize operations or `updatePosition()` for reposition operations.

### `onMouseRelease(event)`

Finalizes the operation — transfers the dummy frame's position and dimensions back to the parent frame, hides the banner, triggers a redraw, and removes itself from the root.

### `show()`

Renders an outline preview rectangle using the parent frame's border color, width, and corner radius.

## Usage

`DummyFrame` is created internally by [Frame](./frame) via `createDummyFrame(type)` — you typically don't instantiate it directly.

```js
// Inside Frame, when optimised resizing starts:
const dummy = frame.createDummyFrame(DummyFrame.RESIZE_DF);
```

The dummy appears as a border outline that follows the mouse. On release, the parent frame snaps to match the dummy's final geometry.
