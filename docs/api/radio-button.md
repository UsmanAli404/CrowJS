---
outline: deep
---

# RadioButton <Badge type="tip" text="API" />

A group-exclusive radio button component with label text and visual selection indicator.

Only one radio button per group can be selected at a time.

**Import:**

```js
import { RadioButton } from "./UIComponents/RadioButton.js";
```

**Extends:** [TextComponent](./text-component) → [UIComponent](./ui-component) → [Component](./component)

## Constructor

```js
new RadioButton(x, y, width, height, label, options?)
```

Accepts all options from [TextComponent](./text-component), plus:

| Option | Type | Default | Description |
|---|---|---|---|
| `group` | `string` | `'default'` | Group name — only one per group can be selected |
| `selected` | `boolean` | `false` | Initial selected state |
| `value` | `string\|*` | label text | The value this radio button represents |
| `circleColor` | `p5.Color` | `'#2a2a3d'` | Outer circle background color |
| `circleBorderColor` | `p5.Color` | `'#3a3a4d'` | Outer circle border color |
| `circleBorderWidth` | `number` | `2` | Outer circle border width |
| `selectedColor` | `p5.Color` | `'#4a9eff'` | Inner dot color when selected |
| `selectedCircleBorderColor` | `p5.Color` | `'#4a9eff'` | Outer circle border when selected |
| `circleSize` | `number` | `18` | Outer circle diameter in pixels |
| `dotSize` | `number` | `10` | Inner dot diameter in pixels |
| `circleGap` | `number` | `8` | Gap between circle and label text |
| `hoverCircleBorderColor` | `p5.Color` | `'#5a5a7a'` | Circle border color on hover |
| `enabled` | `boolean` | `true` | Whether the radio button is interactive |

See the [RadioButton guide](../guide/components/radio-button) for detailed usage and examples.

## Properties

| Property | Type | Description |
|---|---|---|
| `group` | `string` | The group this radio button belongs to |
| `selected` | `boolean` | Whether this radio button is selected |
| `value` | `*` | The value this radio button represents |
| `isHovered` | `boolean` | Whether hovered |
| `enabled` | `boolean` | Whether interactive |
| `circleSize` | `number` | Outer circle diameter |
| `dotSize` | `number` | Inner dot diameter |
| `circleGap` | `number` | Gap between circle and label |

## Methods

### `select()`

Selects this radio button and deselects all others in the same group.

### `deselect()`

Deselects this radio button.

### `isSelected()`

Returns `true` if this radio button is currently selected.

### `getSelectedValue()`

Returns the `value` of the currently selected radio button in this group. Returns `null` if none is selected.

### `getGroupMembers()`

Returns an array of all `RadioButton` instances in the same group.

### `setEnabled(enabled)`

Enable or disable the radio button.

| Parameter | Type | Description |
|---|---|---|
| `enabled` | `boolean` | True to enable, false to disable |

### `destroy()`

Removes this radio button from its group registry. Call when permanently removing the component.

### `show()`

Renders the radio button with its outer circle, inner dot (if selected), and label.

### `getContentWidth()`

Returns the available content width after accounting for the radio circle and gap. Used internally for text layout.

## Built-in Listeners

The radio button automatically registers these internal listeners:

- `mouseEnter` — sets hover state
- `hover` — changes cursor to pointer
- `mouseLeave` — clears hover state
- `click` — selects this radio button (deselects others in group)
