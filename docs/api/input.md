---
outline: deep
---

# Input <Badge type="tip" text="API" />

Base focusable input component with focus/blur border feedback. Extended by `TextField`.

**Import:**

```js
import { Input } from "./UIComponents/Input.js";
```

**Extends:** [UIComponent](./ui-component) → [Component](./component)

## Constructor

```js
new Input(x, y, width, height, backgroundColor, borderFlag, borderColor,
  borderWidth, cornerRadius, enableShadow, shadowColor, shadowBlur,
  shadowOffsetX, shadowOffsetY, options?)
```

Same positional arguments as `UIComponent`, with `type` set to `"Input"`.

## Properties

| Property | Type | Description |
|---|---|---|
| `isFocused` | `boolean` | Whether the input currently has focus |

## Methods

### `focus()`

Give focus to this input. Increases border width by 3 and dispatches a `"focus"` event.

### `blur()`

Remove focus from this input. Decreases border width by 3 and dispatches a `"blur"` event.

### `onFocus()` / `onBlur()`

Internal focus/blur handlers. Override in subclasses for custom behavior.

## Events

| Event | When Fired |
|---|---|
| `focus` | Input receives focus (click or programmatic) |
| `blur` | Input loses focus (click elsewhere or programmatic) |
