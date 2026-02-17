---
outline: deep
---

# Button <Badge type="tip" text="API" />

Interactive button with hover, pressed, and disabled visual states.

**Import:**

```js
import { Button } from "./UIComponents/Button.js";
```

**Extends:** [TextComponent](./text-component) → [UIComponent](./ui-component) → [Component](./component)

## Constructor

```js
new Button(x, y, width, height, label, options?)
```

Accepts all options from [TextComponent](./text-component), plus:

| Option | Type | Default | Description |
|---|---|---|---|
| `hoverBackgroundColor` | `string` | `null` | Background on hover |
| `hoverTextColor` | `string` | `null` | Text color on hover |
| `pressedBackgroundColor` | `string` | `null` | Background when pressed |
| `pressedTextColor` | `string` | `null` | Text color when pressed |
| `enabled` | `boolean` | `true` | Whether the button is interactive |

See the [Button guide](../guide/components/button) for detailed usage and examples.

## Properties

| Property | Type | Description |
|---|---|---|
| `isHovered` | `boolean` | Whether the button is currently hovered |
| `isPressed` | `boolean` | Whether the button is currently pressed |
| `enabled` | `boolean` | Whether the button is interactive |

## Methods

### `setEnabled(enabled)`

Enable or disable the button.

### `show()`

Renders the button with state-appropriate colors.

### `getBackgroundColor()` / `getTextColor()` / `getBorderColor()`

Returns the current color based on hover/pressed/enabled state.

### Built-in Listeners

The button automatically registers these internal listeners:
- `mouseEnter` — sets hover state, changes cursor to pointer
- `hover` — maintains pointer cursor
- `mouseLeave` — clears hover state, restores cursor
- `press` — sets pressed state
- `release` — clears pressed state
