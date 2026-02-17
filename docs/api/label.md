---
outline: deep
---

# Label <Badge type="tip" text="API" />

Static text display component with background, border, and all TextComponent features.

**Import:**

```js
import { Label } from "./UIComponents/Label.js";
```

**Extends:** [TextComponent](./text-component) → [UIComponent](./ui-component) → [Component](./component)

## Constructor

```js
new Label(x, y, width, height, text, options?)
```

Accepts all options from [TextComponent](./text-component). Default `wrap=false`, `noWrapMode="font-size"`.

See the [Label guide](../guide/components/label) for detailed usage, options table, and examples.

## Methods

### `show()`

Renders the label — background, text (with wrapping/ellipsis), border, and icon. Applies corner-radius clipping.

### Inherited

All methods from [TextComponent](./text-component) are available:

- `setText(text)`, `setWrap(enabled)`, `setWrapMode(mode)`, `setNoWrapMode(mode)`, `setEllipsisMode(mode)`
- `setIcon(img)`, `setIconSize(size)`, `setIconPosition(pos)`, `setIconGap(gap)`, `setIconTintColor(color)`, `setIconOpacity(opacity)`
