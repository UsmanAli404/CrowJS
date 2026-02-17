---
outline: deep
---

# ScrollFrame

A `ScrollFrame` is a scrollable container that arranges children vertically or horizontally with weighted sizing. It extends `Frame`, inheriting dragging, resizing, banner, and shadow features.

## Import

```js
import { ScrollFrame } from "./Frames/ScrollFrame.js";
```

## Basic Usage

```js
import { ScrollFrame } from "./Frames/ScrollFrame.js";
import { Label } from "./UIComponents/Label.js";

const scroll = new ScrollFrame(50, 50, 300, 400, {
  alignment: "v",           // "v" = vertical, "h" = horizontal
  backgroundColor: "#f5f5f5",
  cornerRadius: 10,
  enableVScroll: true,
});

// Add children — each one is sized to fill the frame width
// and given a height proportional to its weight
scroll.add(new Label(0, 0, 0, 0, "Item 1", { backgroundColor: "#e0e0e0" }), { weight: 1 });
scroll.add(new Label(0, 0, 0, 0, "Item 2", { backgroundColor: "#d0d0d0" }), { weight: 1 });
scroll.add(new Label(0, 0, 0, 0, "Item 3", { backgroundColor: "#c0c0c0" }), { weight: 2 });

root.add(scroll);
```

::: tip
When adding children to a `ScrollFrame`, the `x`, `y`, `width`, and `height` arguments passed to the child are **ignored** — the frame calculates positions and sizes based on weights, padding, and alignment.
:::

## Constructor Options

```js
new ScrollFrame(x, y, width, height, options?)
```

| Option | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | `null` | Unique identifier |
| `alignment` | `string` | `"v"` | `"v"` for vertical stack, `"h"` for horizontal |
| `enableVScroll` | `boolean` | `false` | Enable vertical scrolling |
| `enableHScroll` | `boolean` | `false` | Enable horizontal scrolling |
| `scrollSensitivity` | `number` | `2` | Scroll speed multiplier |
| `backgroundColor` | `string` | `"rgba(200,200,200,1)"` | Background color |
| `borderColor` | `string` | `"rgba(0,0,0,1)"` | Border color |
| `highlightedBorderColor` | `string` | `"rgba(0,100,255,1)"` | Border highlight on resize hover |
| `borderWidth` | `number` | `2` | Border thickness |
| `cornerRadius` | `number` | `0` | Corner rounding |
| `pad` | `number` | — | Uniform padding (sets `padx` and `pady`) |
| `padx` / `pady` | `number` | `0` | Horizontal / vertical padding |
| `alwaysShowBanner` | `boolean` | `false` | Always show banner bar |
| `bannerHeight` | `number` | `20` | Banner height |
| `bannerColor` | `string` | `"rgba(100,100,100,1)"` | Banner color |
| `bannerDotColor` | `string` | `"rgba(255,255,255,1)"` | Banner dot color |
| `nearestBorderThreshold` | `number` | `5` | Resize activation distance |
| `enableReposition` | `boolean` | `false` | Enable drag to reposition |
| `enableOptimisedReposition` | `boolean` | `false` | Optimised drag mode |
| `enableResizing` | `boolean` | `false` | Enable resize |
| `enableOptimisedResizing` | `boolean` | `false` | Optimised resize mode |
| `enableShadow` | `boolean` | `false` | Enable drop shadow |
| `shadowColor` / `shadowBlur` / `shadowOffsetX` / `shadowOffsetY` | — | — | Shadow settings |
| `margin` | `number` | `0` | Outer margin |
| `minWidth` / `minHeight` | `number` | `0` | Minimum dimensions |
| `showDebugOverlay` | `boolean` | `false` | Debug overlay |

## Adding Children

### `add(element, options?)`

```js
scroll.add(child, {
  weight: 2,     // Relative size weight (default: 1)
  padL: 5,       // Left padding for this child
  padR: 5,       // Right padding
  padT: 5,       // Top padding
  padB: 5,       // Bottom padding
});
```

The **weight** determines how much space a child occupies relative to its siblings. For example, with three children of weights 1, 1, and 2, the third child gets 50% of the available space and the other two get 25% each.

### `remove(element)`

Remove a child from the frame.

```js
scroll.remove(child);
```

## Weight and Padding Configuration

You can adjust weights and per-child padding after creation:

```js
scroll.setWeight(0, 3);     // Set weight of first child to 3
scroll.getWeight(0);         // Get weight of first child

scroll.setPadL(1, 10);      // Set left padding of second child
scroll.setPadR(1, 10);
scroll.setPadT(1, 10);
scroll.setPadB(1, 10);
```

## Scrolling

### Mouse Wheel

When `enableVScroll` or `enableHScroll` is `true`, the mouse wheel scrolls content. Make sure `mouseWheel` is wired up in your sketch:

```js
window.mouseWheel = function (event) {
  root.mouseWheelEventListeners(mouseX, mouseY, event);
};
```

### Keyboard

When the `ScrollFrame` has focus (contains a focused child), arrow keys scroll the content:

- `Up Arrow` / `Down Arrow` — vertical scroll
- `Left Arrow` / `Right Arrow` — horizontal scroll

### Programmatic

```js
scroll.scrollUp();
scroll.scrollDown();
scroll.scrollLeft();
scroll.scrollRight();
```

## Examples

### Vertical List

```js
const list = new ScrollFrame(20, 20, 250, 400, {
  alignment: "v",
  enableVScroll: true,
  cornerRadius: 8,
  backgroundColor: "#fafafa",
  pad: 8,
});

for (let i = 0; i < 20; i++) {
  list.add(
    new Label(0, 0, 0, 0, `Item ${i + 1}`, {
      backgroundColor: i % 2 === 0 ? "#e5e7eb" : "#f3f4f6",
      cornerRadius: 4,
    }),
    { weight: 1, padT: 2, padB: 2 }
  );
}

root.add(list);
```

### Horizontal Toolbar

```js
const toolbar = new ScrollFrame(20, 20, 600, 60, {
  alignment: "h",
  enableHScroll: true,
  backgroundColor: "#1e1e1e",
  cornerRadius: 6,
  pad: 4,
});

const tools = ["Select", "Draw", "Erase", "Fill", "Text", "Shape"];
tools.forEach((name) => {
  toolbar.add(
    new Button(0, 0, 0, 0, name, {
      backgroundColor: "#333",
      textColor: "#fff",
      hoverBackgroundColor: "#555",
      cornerRadius: 4,
      borderFlag: false,
    }),
    { weight: 1, padL: 2, padR: 2 }
  );
});

root.add(toolbar);
```
