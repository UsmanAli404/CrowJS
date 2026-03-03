---
outline: deep
---

# Checkbox <Badge type="tip" text="API" />

A toggleable checkbox component with label text, hover effects, and customisable styling.

**Import:**

```js
import { Checkbox } from "./UIComponents/Checkbox.js";
```

**Extends:** [TextComponent](./text-component) → [UIComponent](./ui-component) → [Component](./component)

## Constructor

```js
new Checkbox(x, y, width, height, label, options?)
```

Accepts all options from [TextComponent](./text-component), plus:

| Option | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | `false` | Initial checked state |
| `boxColor` | `p5.Color` | `'#2a2a3d'` | Checkbox box background (unchecked) |
| `boxBorderColor` | `p5.Color` | `'#3a3a4d'` | Checkbox box border color |
| `boxBorderWidth` | `number` | `2` | Checkbox box border width |
| `checkedColor` | `p5.Color` | `'#4a9eff'` | Box background when checked |
| `checkmarkColor` | `p5.Color` | `'#ffffff'` | Checkmark stroke color |
| `boxSize` | `number` | `18` | Size of the checkbox box in pixels |
| `boxGap` | `number` | `8` | Gap between checkbox box and label text |
| `boxCornerRadius` | `number` | `4` | Corner radius of the checkbox box |
| `hoverBoxBorderColor` | `p5.Color` | `'#5a5a7a'` | Box border color on hover |
| `enabled` | `boolean` | `true` | Whether the checkbox is interactive |

See the [Checkbox guide](../guide/components/checkbox) for detailed usage and examples.

## Properties

| Property | Type | Description |
|---|---|---|
| `checked` | `boolean` | Whether the checkbox is currently checked |
| `isHovered` | `boolean` | Whether the checkbox is currently hovered |
| `enabled` | `boolean` | Whether the checkbox is interactive |
| `boxSize` | `number` | Size of the checkbox box |
| `boxGap` | `number` | Gap between box and label |

## Methods

### `isChecked()`

Returns `true` if the checkbox is currently checked.

### `setChecked(checked)`

Sets the checked state programmatically.

| Parameter | Type | Description |
|---|---|---|
| `checked` | `boolean` | The new checked state |

### `toggle()`

Toggles the checked state (checked → unchecked, or vice-versa).

### `setEnabled(enabled)`

Enable or disable the checkbox.

| Parameter | Type | Description |
|---|---|---|
| `enabled` | `boolean` | True to enable, false to disable |

### `show()`

Renders the checkbox with its current state, box, checkmark, and label.

### `getContentWidth()`

Returns the available content width after accounting for the checkbox box and gap. Used internally for text layout.

## Built-in Listeners

The checkbox automatically registers these internal listeners:

- `mouseEnter` — sets hover state
- `hover` — changes cursor to pointer
- `mouseLeave` — clears hover state
- `click` — toggles checked state
