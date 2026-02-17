---
outline: deep
---

# Label

A `Label` is a static text display component. It supports background colors, borders, text wrapping, alignment, ellipsis, and inline icons.

## Import

```js
import { Label } from "./UIComponents/Label.js";
```

## Basic Usage

```js
const label = new Label(x, y, width, height, "Hello World", {
  backgroundColor: "#000",
  textColor: "#fff",
  cornerRadius: 8,
});

root.add(label);
```

## Constructor Options

```js
new Label(x, y, width, height, text, options?)
```

| Option | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | `null` | Unique identifier for lookup |
| `backgroundColor` | `string` | `"rgba(200,200,200,1)"` | Background color |
| `textColor` | `string` | `"rgba(0,0,0,1)"` | Text color |
| `borderFlag` | `boolean` | `true` | Whether to draw a border |
| `borderColor` | `string` | `"rgba(0,0,0,1)"` | Border color |
| `borderWidth` | `number` | `2` | Border stroke width |
| `cornerRadius` | `number` | `0` | Rounded corner radius |
| `HTextAlign` | `string` | `CENTER` | Horizontal alignment (`LEFT`, `CENTER`, `RIGHT`) |
| `VTextAlign` | `string` | `CENTER` | Vertical alignment (`TOP`, `CENTER`, `BOTTOM`) |
| `wrap` | `boolean` | `false` | Enable text wrapping |
| `wrapMode` | `string` | `"word"` | `"word"` or `"char"` wrapping mode |
| `noWrapMode` | `string` | `"font-size"` | When `wrap` is off: `"font-size"` (shrink text) or `"ellipsis"` |
| `ellipsisMode` | `string` | `"trailing"` | `"leading"`, `"center"`, or `"trailing"` |
| `pad` | `number` | — | Uniform text padding |
| `padx` / `pady` | `number` | — | Horizontal / vertical text padding |
| `padl` / `padr` / `padt` / `padb` | `number` | `0` | Per-side text padding |
| `icon` | `p5.Image` | `null` | Icon image to display alongside text |
| `iconSize` | `number` | `20` | Icon display size |
| `iconPosition` | `string` | `"left"` | `"left"` or `"right"` of text |
| `iconGap` | `number` | `5` | Space between icon and text |
| `iconTintColor` | `string` | `null` | Tint color for the icon |
| `iconOpacity` | `number` | `255` | Icon opacity (0–255) |
| `enableShadow` | `boolean` | `false` | Enable drop shadow |
| `shadowColor` | `string` | `"rgba(0,0,0,0.5)"` | Shadow color |
| `shadowBlur` | `number` | `10` | Shadow blur radius |
| `shadowOffsetX` | `number` | `5` | Shadow X offset |
| `shadowOffsetY` | `number` | `5` | Shadow Y offset |
| `margin` | `number` | `0` | Uniform margin |
| `minWidth` / `minHeight` | `number` | `0` | Minimum size constraints |
| `showDebugOverlay` | `boolean` | `false` | Show debug overlay |

## Methods

### `setText(text)`

Update the label's display text.

```js
label.setText("New text content");
```

### `setWrap(enabled)`

Toggle text wrapping.

```js
label.setWrap(true);
```

### `setWrapMode(mode)`

Set the wrapping strategy: `"word"` or `"char"`.

```js
label.setWrapMode("char");
```

### `setNoWrapMode(mode)`

Set behavior when wrapping is disabled: `"font-size"` (shrink to fit) or `"ellipsis"`.

```js
label.setNoWrapMode("ellipsis");
```

### `setEllipsisMode(mode)`

Set the ellipsis position: `"leading"`, `"center"`, or `"trailing"`.

```js
label.setEllipsisMode("center"); // Produces "He...ld"
```

### Icon Methods

```js
label.setIcon(img);              // Set icon image
label.setIconSize(32);           // Icon dimensions
label.setIconPosition("right");  // "left" or "right"
label.setIconGap(10);            // Space between icon & text
label.setIconTintColor("#fff");  // Apply tint
label.setIconOpacity(200);       // 0–255
```

## Text Wrapping Examples

### Word Wrap

```js
const wrapped = new Label(20, 20, 200, 150, "This is a long text that wraps by words", {
  wrap: true,
  wrapMode: "word",
  backgroundColor: "#eee",
});
```

### Ellipsis (No Wrap)

```js
const ellipsis = new Label(20, 20, 120, 40, "A very long text that overflows", {
  wrap: false,
  noWrapMode: "ellipsis",
  ellipsisMode: "trailing", // "A very long te..."
});
```

### Auto-Shrink Font (No Wrap)

```js
const shrink = new Label(20, 20, 120, 40, "This text shrinks to fit", {
  wrap: false,
  noWrapMode: "font-size", // Default — automatically reduces font size
});
```

## Event Handling

Labels support all standard events:

```js
label.addEventListener("click", (event) => {
  console.log("Label clicked!");
});

label.addEventListener("mouseEnter", () => {
  label.setText("Hovering!");
});

label.addEventListener("mouseLeave", () => {
  label.setText("Hello World");
});
```
