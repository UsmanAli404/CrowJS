---
outline: deep
---

# FrameComponent <Badge type="tip" text="API" />

Abstract base class for all frame (container) elements. Extends `Component` with abstract layout and interaction methods that concrete frames must implement.

**Import:**

```js
import { FrameComponent } from "./Frames/FrameComponent.js";
```

**Extends:** [Component](./component)

## Constructor

```js
new FrameComponent(x, y, width, height, options?)
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
| `parent` | `Component \| null` | `null` | Parent component |
| `type` | `string` | `""` | Component type identifier |
| `id` | `string \| null` | `null` | Unique string ID |
| `margin` | `number` | `0` | Uniform margin |
| `marginx` | `number` | `null` | Left + right margin |
| `marginy` | `number` | `null` | Top + bottom margin |
| `marginl` | `number` | `null` | Left margin |
| `marginr` | `number` | `null` | Right margin |
| `margint` | `number` | `null` | Top margin |
| `marginb` | `number` | `null` | Bottom margin |
| `minWidth` | `number` | `0` | Minimum width constraint |
| `minHeight` | `number` | `0` | Minimum height constraint |
| `showDebugOverlay` | `boolean` | `false` | Show margin/padding debug overlay |

## Abstract Methods

Subclasses (e.g. [Frame](./frame), [ScrollFrame](./scroll-frame), [GridFrame](./grid-frame)) must implement these methods.

### `adjustHeight()`

Reflow child components after a height change.

### `adjustWidth()`

Reflow child components after a width change.

### `showBanner()`

Display the frame's banner bar.

### `hideBanner()`

Hide the frame's banner bar.

### `updatePosition()`

Update the frame's position during a drag operation.

### `add()`

Add a child component to the frame.

## Inheritance

`FrameComponent` is the direct parent of [Frame](./frame), which in turn is the parent of [ScrollFrame](./scroll-frame) and [GridFrame](./grid-frame).

```
Component
  └─ FrameComponent
       └─ Frame
            ├─ ScrollFrame
            └─ GridFrame
```
