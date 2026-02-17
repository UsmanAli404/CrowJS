---
outline: deep
---

# Button

A `Button` is an interactive component with built-in hover, press, and disabled states. It extends `TextComponent`, inheriting all text styling, wrapping, and icon features from [Label](./label).

## Import

```js
import { Button } from "./UIComponents/Button.js";
```

## Basic Usage

```js
const btn = new Button(50, 50, 180, 50, "Click Me", {
  cornerRadius: 10,
  backgroundColor: "#333",
  textColor: "#fff",
  hoverBackgroundColor: "#555",
  pressedBackgroundColor: "#111",
});

btn.addEventListener("click", () => {
  console.log("Button pressed!");
});

root.add(btn);
```

## Constructor Options

```js
new Button(x, y, width, height, label, options?)
```

Inherits all options from [Label](./label). Additional options:

| Option | Type | Default | Description |
|---|---|---|---|
| `hoverBackgroundColor` | `string` | `null` | Background color on hover |
| `hoverTextColor` | `string` | `null` | Text color on hover |
| `pressedBackgroundColor` | `string` | `null` | Background color when pressed |
| `pressedTextColor` | `string` | `null` | Text color when pressed |
| `enabled` | `boolean` | `true` | Whether the button is interactive |

## Visual States

The button automatically cycles through visual states:

| State | Background | Text Color | Cursor |
|---|---|---|---|
| **Default** | `backgroundColor` | `textColor` | default |
| **Hovered** | `hoverBackgroundColor` | `hoverTextColor` | pointer |
| **Pressed** | `pressedBackgroundColor` | `pressedTextColor` | pointer |
| **Disabled** | `backgroundColor` (dimmed) | `textColor` | default |

The hover and press colors fall back to the default colors if not specified.

## Methods

### `setEnabled(enabled)`

Enable or disable the button. Disabled buttons do not respond to hover or click events.

```js
btn.setEnabled(false); // Grey out and disable
btn.setEnabled(true);  // Re-enable
```

### Inherited Methods

All methods from `TextComponent` / `Label` are available:

```js
btn.setText("New Label");
btn.setWrap(true);
btn.setIcon(img);
btn.setIconPosition("left");
```

## Examples

### Styled Button

```js
const styled = new Button(20, 20, 160, 45, "Submit", {
  backgroundColor: "#2563eb",
  textColor: "#fff",
  hoverBackgroundColor: "#1d4ed8",
  pressedBackgroundColor: "#1e40af",
  cornerRadius: 8,
  borderFlag: false,
});
```

### Button with Icon

```js
let iconImg;

window.preload = function () {
  iconImg = loadImage("icon.png");
};

window.setup = function () {
  // ...
  const btn = new Button(20, 20, 180, 45, "Download", {
    icon: iconImg,
    iconSize: 20,
    iconPosition: "left",
    iconGap: 8,
    backgroundColor: "#10b981",
    textColor: "#fff",
    cornerRadius: 6,
  });
  root.add(btn);
};
```

### Toggle Button

```js
let active = false;

const toggle = new Button(20, 20, 120, 40, "OFF", {
  backgroundColor: "#dc2626",
  textColor: "#fff",
  cornerRadius: 20,
});

toggle.addEventListener("click", () => {
  active = !active;
  toggle.setText(active ? "ON" : "OFF");
  toggle.backgroundColor = active ? "#16a34a" : "#dc2626";
});

root.add(toggle);
```
