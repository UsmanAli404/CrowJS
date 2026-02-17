---
outline: deep
---

# UIComponent <Badge type="tip" text="API" />

Base class for all visual UI elements. Adds background, border, corner radius, and shadow support to `Component`.

**Import:**

```js
import { UIComponent } from "./UIComponents/UIComponent.js";
```

**Extends:** [Component](./component)

## Constructor

```js
new UIComponent(x, y, width, height, backgroundColor, borderFlag,
  borderColor, borderWidth, cornerRadius, enableShadow, shadowColor,
  shadowBlur, shadowOffsetX, shadowOffsetY,
  { parent, type, id, margin*, minWidth, minHeight, showDebugOverlay })
```

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `backgroundColor` | `string` | `"rgba(200,200,200,1)"` | Background color |
| `borderFlag` | `boolean` | `true` | Whether to draw a border |
| `borderColor` | `string` | `"rgba(0,0,0,1)"` | Border color |
| `borderWidth` | `number` | `2` | Border stroke width |
| `cornerRadius` | `number` | `0` | Rounded corner radius |
| `enableShadow` | `boolean` | `false` | Enable drop shadow |
| `shadowColor` | `string` | `"rgba(0,0,0,0.5)"` | Shadow color |
| `shadowBlur` | `number` | `10` | Shadow blur radius |
| `shadowOffsetX` | `number` | `5` | Shadow X offset |
| `shadowOffsetY` | `number` | `5` | Shadow Y offset |

## Methods

### `setShadowColor(color)` / `setShadowBlur(blur)` / `setShadowOffsetX(x)` / `setShadowOffsetY(y)`

Configure shadow properties.

### `drawShadow()`

Render the shadow via Canvas 2D API. Called internally by `show()`.

### `updateWidth()` / `updateHeight()`

Abstract — override in subclasses to handle resize events.
