---
outline: deep
---

# TextField

A `TextField` is a single-line text input with cursor navigation, text selection, copy-friendly selection highlight, and keyboard repeat support.

## Import

```js
import { TextField } from "./UIComponents/TextField.js";
```

## Basic Usage

```js
const field = new TextField(50, 50, 250, 40, {
  placeholder: "Enter your name...",
  textColor: "#000",
  backgroundColor: "#fff",
  borderColor: "#ccc",
  cornerRadius: 6,
});

root.add(field);
```

::: tip
Make sure your `sketch.js` wires up `keyPressed`, `mouseDragged`, `mousePressed`, and `mouseReleased` events to `Root` — they are all needed for full `TextField` functionality.
:::

## Constructor Options

```js
new TextField(x, y, width, height, options?)
```

| Option | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | `null` | Unique identifier |
| `text` | `string` | `""` | Initial text content |
| `placeholder` | `string` | `""` | Placeholder text when empty |
| `placeholderColor` | `string` | `"rgba(150,150,150,1)"` | Placeholder text color |
| `textColor` | `string` | `"rgba(0,0,0,1)"` | Text color |
| `textAlign` | `string` | `LEFT` | Text alignment (`LEFT`, `CENTER`, `RIGHT`) |
| `backgroundColor` | `string` | `"rgba(255,255,255,1)"` | Background color |
| `borderFlag` | `boolean` | `true` | Show border |
| `borderColor` | `string` | `"rgba(0,0,0,1)"` | Border color |
| `borderWidth` | `number` | `2` | Border width |
| `cornerRadius` | `number` | `0` | Corner radius |
| `pad` | `number` | — | Uniform inner padding |
| `enableShadow` | `boolean` | `false` | Enable shadow |
| `shadowColor` / `shadowBlur` / `shadowOffsetX` / `shadowOffsetY` | — | — | Shadow configuration |
| `margin` | `number` | `0` | Outer margin |
| `minWidth` / `minHeight` | `number` | `0` | Minimum dimensions |

## Features

### Focus & Blur

Clicking a `TextField` gives it focus (visually highlighted with a thicker border). Clicking elsewhere blurs it.

```js
field.addEventListener("focus", () => {
  console.log("Field focused");
});

field.addEventListener("blur", () => {
  console.log("Field blurred, value:", field.text);
});
```

### Cursor Navigation

| Key | Action |
|---|---|
| `Left Arrow` | Move cursor left |
| `Right Arrow` | Move cursor right |
| `Ctrl + Left` | Jump left by one word |
| `Ctrl + Right` | Jump right by one word |
| `Backspace` | Delete character before cursor |
| `Ctrl + Backspace` | Delete word before cursor |
| `Ctrl + A` | Select all text |

### Text Selection

Click and drag to select text. The selection is highlighted. Typing while text is selected replaces the selection.

### Cursor Blink

The cursor blinks at a configurable interval when the field is focused, providing a familiar text editing experience.

### Auto-Scroll

When the text content is wider than the visible area, the field automatically scrolls horizontally to keep the cursor visible as you type or navigate.

## Reading the Value

Access the current text via the `text` property:

```js
field.addEventListener("blur", () => {
  const value = field.text;
  console.log("User entered:", value);
});
```

## Examples

### Login Form

```js
import { TextField } from "./UIComponents/TextField.js";
import { Label } from "./UIComponents/Label.js";
import { Button } from "./UIComponents/Button.js";
import { ScrollFrame } from "./Frames/ScrollFrame.js";

const form = new ScrollFrame(100, 100, 300, 200, {
  alignment: "v",
  backgroundColor: "#f9f9f9",
  cornerRadius: 12,
});

const usernameLabel = new Label(0, 0, 260, 25, "Username", {
  backgroundColor: "rgba(0,0,0,0)",
  borderFlag: false,
  HTextAlign: LEFT,
});

const username = new TextField(0, 0, 260, 40, {
  placeholder: "Enter username",
  cornerRadius: 6,
  borderColor: "#ccc",
});

const passwordLabel = new Label(0, 0, 260, 25, "Password", {
  backgroundColor: "rgba(0,0,0,0)",
  borderFlag: false,
  HTextAlign: LEFT,
});

const password = new TextField(0, 0, 260, 40, {
  placeholder: "Enter password",
  cornerRadius: 6,
  borderColor: "#ccc",
});

const submitBtn = new Button(0, 0, 260, 45, "Log In", {
  backgroundColor: "#2563eb",
  textColor: "#fff",
  cornerRadius: 8,
  borderFlag: false,
});

form.add(usernameLabel);
form.add(username);
form.add(passwordLabel);
form.add(password);
form.add(submitBtn);

root.add(form);
```
