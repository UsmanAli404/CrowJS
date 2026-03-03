---
outline: deep
---

# RadioButton

A `RadioButton` is a group-exclusive selection component — only one radio button per group can be selected at a time. It extends `TextComponent`, inheriting text styling and wrapping features from [Label](./label).

## Import

```js
import { RadioButton } from "./UIComponents/RadioButton.js";
```

## Basic Usage

```js
const rb1 = new RadioButton(50, 50, 200, 40, "Small", {
  group: "size",
  selected: true,
  value: "sm",
});

const rb2 = new RadioButton(50, 100, 200, 40, "Medium", {
  group: "size",
  value: "md",
});

const rb3 = new RadioButton(50, 150, 200, 40, "Large", {
  group: "size",
  value: "lg",
});

root.add(rb1);
root.add(rb2);
root.add(rb3);

// Clicking rb2 automatically deselects rb1
```

## Constructor Options

```js
new RadioButton(x, y, width, height, label, options?)
```

Inherits all options from [Label](./label). Additional options:

| Option | Type | Default | Description |
|---|---|---|---|
| `group` | `string` | `'default'` | Group name (only one selected per group) |
| `selected` | `boolean` | `false` | Initially selected |
| `value` | `string\|*` | label text | Value this radio button represents |
| `circleColor` | `p5.Color` | `'#2a2a3d'` | Outer circle background |
| `circleBorderColor` | `p5.Color` | `'#3a3a4d'` | Outer circle border |
| `circleBorderWidth` | `number` | `2` | Outer circle border width |
| `selectedColor` | `p5.Color` | `'#4a9eff'` | Inner dot color when selected |
| `selectedCircleBorderColor` | `p5.Color` | `'#4a9eff'` | Circle border when selected |
| `circleSize` | `number` | `18` | Outer circle diameter |
| `dotSize` | `number` | `10` | Inner dot diameter |
| `circleGap` | `number` | `8` | Gap between circle and label |
| `hoverCircleBorderColor` | `p5.Color` | `'#5a5a7a'` | Circle border on hover |
| `enabled` | `boolean` | `true` | Whether interactive |

## Group Behavior

Radio buttons with the same `group` string are mutually exclusive — selecting one automatically deselects all others in the group.

```js
// These three form one group
new RadioButton(x, y, w, h, "A", { group: "letters" });
new RadioButton(x, y2, w, h, "B", { group: "letters" });
new RadioButton(x, y3, w, h, "C", { group: "letters" });

// These two form a separate group
new RadioButton(x2, y, w, h, "On", { group: "toggle" });
new RadioButton(x2, y2, w, h, "Off", { group: "toggle", selected: true });
```

## Visual States

| State | Circle | Inner Dot | Border | Cursor |
|---|---|---|---|---|
| **Unselected** | `circleColor` | hidden | `circleBorderColor` | default |
| **Selected** | `circleColor` | `selectedColor` | `selectedCircleBorderColor` | default |
| **Hovered** | — | — | `hoverCircleBorderColor` | pointer |
| **Disabled** | — | — | — (dimmed label) | default |

## Methods

### `select()`

Selects this radio button and deselects all others in its group.

```js
rb2.select(); // Deselects rb1 and rb3
```

### `deselect()`

Deselects this radio button.

```js
rb2.deselect();
```

### `isSelected()`

Returns `true` if this radio button is selected.

```js
if (rb1.isSelected()) {
  console.log("Small is selected");
}
```

### `getSelectedValue()`

Returns the `value` of the currently selected radio button in this group. Returns `null` if none is selected.

```js
const size = rb1.getSelectedValue();
console.log("Selected size:", size); // "sm", "md", or "lg"
```

### `getGroupMembers()`

Returns an array of all `RadioButton` instances in the same group.

```js
const members = rb1.getGroupMembers();
console.log("Group has", members.length, "members");
```

### `setEnabled(enabled)`

Enable or disable the radio button.

```js
rb3.setEnabled(false); // Grey out
rb3.setEnabled(true);  // Enable
```

### `destroy()`

Removes this radio button from its group registry. Call when permanently removing a radio button.

```js
rb3.destroy();
```

### Inherited Methods

All methods from `TextComponent` / `Label` are available:

```js
rb1.setText("Extra Small");
```

## Examples

### Styled Radio Group

```js
const colors = [
  { label: "Red", value: "#ef4444" },
  { label: "Green", value: "#22c55e" },
  { label: "Blue", value: "#3b82f6" },
];

const radios = [];

for (let i = 0; i < colors.length; i++) {
  const rb = new RadioButton(20, 20 + i * 45, 180, 40, colors[i].label, {
    group: "color-picker",
    value: colors[i].value,
    selected: i === 0,
    selectedColor: colors[i].value,
    selectedCircleBorderColor: colors[i].value,
  });
  radios.push(rb);
  root.add(rb);
}
```

### Reading the Selected Value

```js
rb1.addEventListener("click", () => {
  const val = rb1.getSelectedValue();
  console.log("Selected:", val);
});
```

### Radio Buttons in a Frame

```js
import { GridFrame } from "./Frames/GridFrame.js";

// in setup function
const frame = new GridFrame(20, 20, 250, 200, {
  rows: 1,
  cols: 3,
  backgroundColor: "#1e1e2e",
});

const rb1 = new RadioButton(0, 0, 0, 0, "Low", { group: "quality", value: "low", selected: true });
const rb2 = new RadioButton(0, 0, 0, 0, "Medium", { group: "quality", value: "medium" });
const rb3 = new RadioButton(0, 0, 0, 0, "High", { group: "quality", value: "high" });

frame.add(rb1 0, 0);
frame.add(rb2, 0, 1);
frame.add(rb3, 0, 2);

root.add(frame);
```
