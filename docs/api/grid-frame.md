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
| `grid` | `Array[][]` | `null` | 2D array of grid cells (initialized by `gridConfig()`) |
| `rowWeights` | `number[]` | `[]` | Weight per row (populated by `gridConfig()` or `rowConfig()`) |
| `colWeights` | `number[]` | `[]` | Weight per column (populated by `gridConfig()` or `colConfig()`) |
| `totalRowWeight` | `number` | `0` | Sum of row weights |
| `totalColWeight` | `number` | `0` | Sum of column weights |

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

Reinitialize the grid dimensions. Clears existing children (unsets their `parent`) and resets all row/column weights to `1`.

::: tip
If `add()` is called before `gridConfig()`, the grid is **auto-configured** using the constructor's `rows` and `cols` values. Any weights set via `rowConfig()` / `colConfig()` before the first `add()` are preserved.
:::

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

### `getElementPos(element)`

Finds the grid position of a child component.

```js
const pos = grid.getElementPos(label); // [row, col] or null
```

**Returns:** `number[]|null` — `[row, col]` of the element, or `null` if not found.

### `show()`

Renders the grid frame and all child components. Handles background, clipping, children, banner, and border drawing.

### `updatePosUtil(xDiff, yDiff)`

Updates child component positions during frame movement (e.g. drag). Recursively propagates to nested frames.

**Parameters:** `xDiff` (number) — X offset, `yDiff` (number) — Y offset.
