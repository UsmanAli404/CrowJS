---
outline: deep
---

# GridFrame <Badge type="tip" text="API" />

Grid-based layout container with row/column weights and cell spanning.

**Import:**

```js
import { GridFrame } from "./Frames/GridFrame.js";
```

**Extends:** [Frame](./frame) → [Component](./component)

## Constructor

```js
new GridFrame(x, y, width, height, options?)
```

See the [GridFrame guide](../guide/frames/grid-frame) for the full options table.

## Key Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `rows` | `number` | `1` | Number of rows |
| `cols` | `number` | `1` | Number of columns |
| `grid` | `Array[][]` | — | 2D array of grid cells |
| `rowWeights` | `number[]` | `[1, ...]` | Weight per row |
| `colWeights` | `number[]` | `[1, ...]` | Weight per column |
| `totalRowWeight` | `number` | — | Sum of row weights |
| `totalColWeight` | `number` | — | Sum of column weights |

## Methods

### `add(element, row, col, options?)`

Place a component in a grid cell.

```js
grid.add(label, 0, 0, { rowSpan: 2, colSpan: 1, padL: 5 });
```

**Options:** `rowSpan` (default: 1), `colSpan` (default: 1), `padL`, `padR`, `padT`, `padB` (default: 0)

### `remove(element)`

Remove a component from the grid.

### `gridConfig(rows, cols)`

Reinitialize the grid dimensions. Clears existing children.

### `rowConfig(rowNum, weight)`

Set the weight of a specific row.

### `colConfig(colNum, weight)`

Set the weight of a specific column.

### `adjustWidth(x, w)` / `adjustHeight(y, h)`

Reflow children by weights when resized.

### `adjustToGrid(row, col, rowSpan, colSpan)`

Position a new element according to grid coordinates.

### `expandElement(row, col, rowSpan, colSpan)`

Expand an element across multiple cells.

### `showBanner()` / `hideBanner()`

Toggle the banner bar.

### `getEffectiveMinWidth()` / `getEffectiveMinHeight()`

Compute minimum size from children's effective minimum sizes.

### `printGrid()`

Log a visual representation of the grid to the console for debugging.
