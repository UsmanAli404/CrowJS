---
outline: deep
---

# ScrollFrame <Badge type="tip" text="API" />

Scrollable container with weighted child layout. Arranges children vertically or horizontally.

**Import:**

```js
import { ScrollFrame } from "./Frames/ScrollFrame.js";
```

**Extends:** [Frame](./frame) → [Component](./component)

## Constructor

```js
new ScrollFrame(x, y, width, height, options?)
```

See the [ScrollFrame guide](../guide/frames/scroll-frame) for the full options table.

## Key Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `alignment` | `string` | `"v"` | `"v"` (vertical) or `"h"` (horizontal) |
| `enableVScroll` | `boolean` | `false` | Enable vertical scrolling |
| `enableHScroll` | `boolean` | `false` | Enable horizontal scrolling |
| `scrollSensitivity` | `number` | `2` | Scroll speed multiplier |
| `preferences` | `Array` | `[]` | Per-child `[weight, padL, padR, padT, padB]` arrays |
| `totalWeight` | `number` | `0` | Sum of all child weights |

## Methods

### `add(element, options?)`

Add a child with optional weight and per-child padding.

```js
scrollFrame.add(label, { weight: 2, padT: 5, padB: 5 });
```

**Options:** `weight` (default: 1), `padL`, `padR`, `padT`, `padB` (default: 0)

### `remove(element)`

Remove a child from the frame.

### `setWeight(index, weight)` / `getWeight(index)`

Get or set the weight of a child by index.

### `setPadL(index, val)` / `setPadR(index, val)` / `setPadT(index, val)` / `setPadB(index, val)`

Set per-child padding by index.

### `getPadL(index)` / `getPadR(index)` / `getPadT(index)` / `getPadB(index)`

Get per-child padding by index.

### `scrollUp()` / `scrollDown()` / `scrollLeft()` / `scrollRight()`

Programmatic scroll.

### `adjustWidth(x, w)` / `adjustHeight(y, h)`

Reflow children when the frame is resized.

### `showBanner()` / `hideBanner()`

Toggle the banner bar.

### `getEffectiveMinWidth()` / `getEffectiveMinHeight()`

Compute minimum size from children's effective minimum sizes.
