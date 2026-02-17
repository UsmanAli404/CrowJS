---
outline: deep
---

# GridFrame

A `GridFrame` is a grid-based layout container that positions children across rows and columns with configurable weights and spanning. It extends `Frame`.

## Import

```js
import { GridFrame } from "./Frames/GridFrame.js";
```

## Basic Usage

```js
import { GridFrame } from "./Frames/GridFrame.js";
import { Label } from "./UIComponents/Label.js";

const grid = new GridFrame(50, 50, 400, 300, {
  rows: 2,
  cols: 3,
  backgroundColor: "#f0f0f0",
  cornerRadius: 10,
  pad: 5,
});

// Place components in specific cells
grid.add(new Label(0, 0, 0, 0, "A", { backgroundColor: "#fca5a5" }), 0, 0);
grid.add(new Label(0, 0, 0, 0, "B", { backgroundColor: "#86efac" }), 0, 1);
grid.add(new Label(0, 0, 0, 0, "C", { backgroundColor: "#93c5fd" }), 0, 2);
grid.add(new Label(0, 0, 0, 0, "D", { backgroundColor: "#fde047" }), 1, 0);
grid.add(new Label(0, 0, 0, 0, "E", { backgroundColor: "#c4b5fd" }), 1, 1);
grid.add(new Label(0, 0, 0, 0, "F", { backgroundColor: "#fdba74" }), 1, 2);

root.add(grid);
```

::: tip
Like `ScrollFrame`, the `x`, `y`, `width`, `height` on child components are **ignored** — the grid calculates everything from row/column weights and frame dimensions.
:::

## Constructor Options

```js
new GridFrame(x, y, width, height, options?)
```

| Option | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | `null` | Unique identifier |
| `rows` | `number` | `1` | Number of rows |
| `cols` | `number` | `1` | Number of columns |
| `backgroundColor` | `string` | `"rgba(200,200,200,1)"` | Background color |
| `borderColor` | `string` | `"rgba(0,0,0,1)"` | Border color |
| `highlightedBorderColor` | `string` | `"rgba(0,100,255,1)"` | Border highlight on resize hover |
| `borderWidth` | `number` | `2` | Border thickness |
| `cornerRadius` | `number` | `0` | Corner rounding |
| `pad` | `number` | — | Uniform padding (sets `padx` and `pady`) |
| `padx` / `pady` | `number` | `0` | Horizontal / vertical padding |
| `alwaysShowBanner` | `boolean` | `false` | Always show banner |
| `bannerHeight` | `number` | `20` | Banner height |
| `bannerColor` | `string` | `"rgba(100,100,100,1)"` | Banner color |
| `bannerDotColor` | `string` | `"rgba(255,255,255,1)"` | Banner dot color |
| `nearestBorderThreshold` | `number` | `5` | Resize activation distance |
| `enableReposition` | `boolean` | `false` | Enable drag |
| `enableOptimisedReposition` | `boolean` | `false` | Optimised drag |
| `enableResizing` | `boolean` | `false` | Enable resize |
| `enableOptimisedResizing` | `boolean` | `false` | Optimised resize |
| `enableShadow` | `boolean` | `false` | Enable shadow |
| `shadowColor` / `shadowBlur` / `shadowOffsetX` / `shadowOffsetY` | — | — | Shadow settings |
| `margin` | `number` | `0` | Outer margin |
| `minWidth` / `minHeight` | `number` | `0` | Minimum dimensions |
| `showDebugOverlay` | `boolean` | `false` | Debug overlay |

## Adding Children

### `add(element, row, col, options?)`

```js
grid.add(component, row, col, {
  rowSpan: 1,   // Number of rows to span (default: 1)
  colSpan: 1,   // Number of columns to span (default: 1)
  padL: 0,      // Left cell padding
  padR: 0,      // Right cell padding
  padT: 0,      // Top cell padding
  padB: 0,      // Bottom cell padding
});
```

### `remove(element)`

Remove a child from the grid.

```js
grid.remove(child);
```

## Row and Column Weights

By default, all rows and columns have equal weight. Use `rowConfig` and `colConfig` to change the proportional sizing:

```js
grid.rowConfig(0, 2);  // Row 0 gets double the space
grid.rowConfig(1, 1);  // Row 1 gets normal space

grid.colConfig(0, 1);  // Column 0 = 1x
grid.colConfig(1, 3);  // Column 1 = 3x wider
grid.colConfig(2, 1);  // Column 2 = 1x
```

Weights are relative — a row with weight 2 gets twice the height of a row with weight 1.

## Grid Configuration

### `gridConfig(rows, cols)`

Reinitialize the grid structure after creation:

```js
grid.gridConfig(3, 4); // 3 rows, 4 columns
```

::: warning
This clears the existing grid. Re-add children after calling `gridConfig`.
:::

## Cell Spanning

Components can span multiple rows and/or columns:

```js
// A header spanning all 3 columns
grid.add(
  new Label(0, 0, 0, 0, "Header", { backgroundColor: "#1e293b", textColor: "#fff" }),
  0, 0,
  { rowSpan: 1, colSpan: 3 }
);

// A sidebar spanning 2 rows
grid.add(
  new Label(0, 0, 0, 0, "Sidebar", { backgroundColor: "#334155", textColor: "#fff" }),
  1, 0,
  { rowSpan: 2, colSpan: 1 }
);
```

## Examples

### Dashboard Layout

```js
const dashboard = new GridFrame(20, 20, 600, 400, {
  rows: 3,
  cols: 3,
  backgroundColor: "#0f172a",
  cornerRadius: 12,
  pad: 6,
  enableResizing: true,
  enableReposition: true,
  alwaysShowBanner: true,
  bannerColor: "#1e293b",
});

// Header spans full width
dashboard.rowConfig(0, 1);
dashboard.rowConfig(1, 3);
dashboard.rowConfig(2, 1);

dashboard.add(
  new Label(0, 0, 0, 0, "Dashboard", {
    backgroundColor: "#1e40af",
    textColor: "#fff",
    cornerRadius: 6,
  }),
  0, 0,
  { colSpan: 3, padL: 3, padR: 3, padT: 3, padB: 3 }
);

// Content panels
dashboard.add(
  new Label(0, 0, 0, 0, "Chart", { backgroundColor: "#1e293b", textColor: "#94a3b8" }),
  1, 0,
  { colSpan: 2, padL: 3, padR: 3, padT: 3, padB: 3 }
);

dashboard.add(
  new Label(0, 0, 0, 0, "Stats", { backgroundColor: "#1e293b", textColor: "#94a3b8" }),
  1, 2,
  { padL: 3, padR: 3, padT: 3, padB: 3 }
);

// Footer
dashboard.add(
  new Label(0, 0, 0, 0, "Status: OK", {
    backgroundColor: "#064e3b",
    textColor: "#6ee7b7",
    cornerRadius: 6,
  }),
  2, 0,
  { colSpan: 3, padL: 3, padR: 3, padT: 3, padB: 3 }
);

root.add(dashboard);
```

### Debug Output

Use `printGrid()` to log the grid structure to the console:

```js
grid.printGrid();
```

This outputs a visual map of which cells are occupied and by which components.
