---
outline: deep
---

# Checkbox

A `Checkbox` is a toggleable component that displays a labelled checkbox box with a checkmark indicator. It extends `TextComponent`, inheriting all text styling and wrapping features from [Label](./label).

## Import

```js
import { Checkbox } from "./UIComponents/Checkbox.js";
```

## Basic Usage

```js
const cb = new Checkbox(50, 50, 200, 40, "Accept Terms", {
  checked: false,
  boxSize: 18,
  backgroundColor: "#1e1e2e",
  textColor: "#e0e0e0",
});

cb.addEventListener("click", () => {
  console.log("Checked:", cb.isChecked());
});

root.add(cb);
```

## Constructor Options

```js
new Checkbox(x, y, width, height, label, options?)
```

Inherits all options from [Label](./label). Additional options:

| Option | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | `false` | Initial checked state |
| `boxColor` | `p5.Color` | `'#2a2a3d'` | Box background (unchecked) |
| `boxBorderColor` | `p5.Color` | `'#3a3a4d'` | Box border color |
| `boxBorderWidth` | `number` | `2` | Box border width |
| `checkedColor` | `p5.Color` | `'#4a9eff'` | Box background when checked |
| `checkmarkColor` | `p5.Color` | `'#ffffff'` | Checkmark color |
| `boxSize` | `number` | `18` | Size of box in pixels |
| `boxGap` | `number` | `8` | Gap between box and label |
| `boxCornerRadius` | `number` | `4` | Box corner radius |
| `hoverBoxBorderColor` | `p5.Color` | `'#5a5a7a'` | Box border on hover |
| `enabled` | `boolean` | `true` | Whether interactive |

## Visual States

| State | Box Background | Box Border | Cursor |
|---|---|---|---|
| **Unchecked** | `boxColor` | `boxBorderColor` | default |
| **Checked** | `checkedColor` + checkmark | `boxBorderColor` | default |
| **Hovered** | — | `hoverBoxBorderColor` | pointer |
| **Disabled** | — | — (dimmed label) | default |

## Methods

### `isChecked()`

Returns `true` if the checkbox is currently checked.

```js
if (cb.isChecked()) {
  console.log("Terms accepted");
}
```

### `setChecked(checked)`

Programmatically set the checked state.

```js
cb.setChecked(true);
```

### `toggle()`

Toggle the checked state.

```js
cb.toggle();
```

### `setEnabled(enabled)`

Enable or disable the checkbox. Disabled checkboxes do not respond to clicks.

```js
cb.setEnabled(false); // Disable
cb.setEnabled(true);  // Re-enable
```

### Inherited Methods

All methods from `TextComponent` / `Label` are available:

```js
cb.setText("I agree to the Terms");
```

## Examples

### Styled Checkbox

```js
const styled = new Checkbox(20, 20, 220, 40, "Dark Mode", {
  checked: true,
  checkedColor: "#10b981",
  checkmarkColor: "#fff",
  boxSize: 20,
  boxCornerRadius: 4,
  backgroundColor: "#1e1e2e",
  borderFlag: false,
});

root.add(styled);
```

### Checkbox with Event Handling

```js
const cb = new Checkbox(20, 80, 240, 40, "Enable Notifications", {
  checked: false,
});

cb.addEventListener("click", () => {
  if (cb.isChecked()) {
    console.log("Notifications enabled");
  } else {
    console.log("Notifications disabled");
  }
});

root.add(cb);
```

### Multiple Checkboxes (Independent)

```js
const options = ["Option A", "Option B", "Option C"];
const checkboxes = [];

for (let i = 0; i < options.length; i++) {
  const cb = new Checkbox(20, 20 + i * 45, 200, 40, options[i]);
  checkboxes.push(cb);
  root.add(cb);
}

// Later, read which are checked
const selected = checkboxes
  .filter((cb) => cb.isChecked())
  .map((cb) => cb.text);
```
