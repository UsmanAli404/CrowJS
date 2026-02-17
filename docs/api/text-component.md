---
outline: deep
---

# TextComponent <Badge type="tip" text="API" />

Shared text rendering behavior: alignment, wrapping, ellipsis, and inline icon support. Base class for `Label` and `Button`.

**Import:**

```js
import { TextComponent } from "./UIComponents/TextComponent.js";
```

**Extends:** [UIComponent](./ui-component) → [Component](./component)

## Constructor

```js
new TextComponent(x, y, width, height, label, options?)
```

See the [Label guide](../guide/components/label) for the full options table (Label passes through all TextComponent options).

## Key Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `text` | `string` | — | Display text |
| `labelSize` | `number` | — | Auto-calculated font size |
| `textColor` | `string` | `"rgba(0,0,0,1)"` | Text color |
| `HTextAlign` | `string` | `CENTER` | Horizontal alignment: `LEFT`, `CENTER`, `RIGHT` |
| `VTextAlign` | `string` | `CENTER` | Vertical alignment: `TOP`, `CENTER`, `BOTTOM` |
| `wrap` | `boolean` | `false` | Enable text wrapping |
| `wrapMode` | `string` | `"word"` | `"word"` or `"char"` |
| `noWrapMode` | `string` | `"font-size"` | `"font-size"` or `"ellipsis"` |
| `ellipsisMode` | `string` | `"trailing"` | `"leading"`, `"center"`, `"trailing"` |
| `padl` / `padr` / `padt` / `padb` | `number` | `0` | Per-side text padding |
| `icon` | `p5.Image \| null` | `null` | Inline icon |
| `iconSize` | `number` | `20` | Icon size |
| `iconPosition` | `string` | `"left"` | `"left"` or `"right"` |
| `iconGap` | `number` | `5` | Gap between icon and text |
| `iconTintColor` | `string \| null` | `null` | Icon tint |
| `iconOpacity` | `number` | `255` | Icon opacity |

## Methods

### Text

| Method | Description |
|---|---|
| `setText(text)` | Update display text |
| `setWrap(enabled)` | Toggle wrapping |
| `setWrapMode(mode)` | Set wrap mode (`"word"` / `"char"`) |
| `setNoWrapMode(mode)` | Set no-wrap mode (`"font-size"` / `"ellipsis"`) |
| `setEllipsisMode(mode)` | Set ellipsis position (`"leading"` / `"center"` / `"trailing"`) |

### Icon

| Method | Description |
|---|---|
| `setIcon(img)` | Set icon image |
| `setIconSize(size)` | Set icon dimensions |
| `setIconPosition(pos)` | `"left"` or `"right"` |
| `setIconGap(gap)` | Space between icon and text |
| `setIconTintColor(color)` | Apply tint color |
| `setIconOpacity(opacity)` | Set opacity (0–255) |

### Layout

| Method | Description |
|---|---|
| `getContentWidth()` | Padded content area width |
| `getContentHeight()` | Padded content area height |
| `updateLabelSize()` | Recalculate font size via binary search |
| `updateWidth()` / `updateHeight()` | Handle resize |
| `renderText()` | Main text drawing method |
| `getWrappedLines()` | Compute line breaks |
| `getTextPosition()` | Compute aligned text coordinates |
