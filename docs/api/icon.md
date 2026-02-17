---
outline: deep
---

# Icon <Badge type="tip" text="API" />

Image/icon display component with fit modes, tinting, opacity, and off-screen caching.

**Import:**

```js
import { Icon } from "./UIComponents/Icon.js";
```

**Extends:** [UIComponent](./ui-component) → [Component](./component)

## Constructor

```js
new Icon(x, y, width, height, img, options?)
```

| Option | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | `null` | Unique identifier |
| `fitMode` | `string` | `"contain"` | `"contain"`, `"cover"`, `"fill"`, `"none"` |
| `tintColor` | `string` | `null` | Color tint |
| `opacity` | `number` | `255` | Opacity (0–255) |
| `backgroundColor` | `string` | `"rgba(200,200,200,1)"` | Background |
| `borderFlag` | `boolean` | `true` | Show border |
| `borderColor` | `string` | `"rgba(0,0,0,1)"` | Border color |
| `borderWidth` | `number` | `2` | Border width |
| `cornerRadius` | `number` | `0` | Corner radius |
| `enableShadow` | `boolean` | `false` | Enable shadow |

See the [Icon guide](../guide/components/icon) for detailed usage and fit mode explanations.

## Properties

| Property | Type | Description |
|---|---|---|
| `img` | `p5.Image` | The displayed image |
| `fitMode` | `string` | Current fit mode |
| `tintColor` | `string \| null` | Current tint |
| `opacity` | `number` | Current opacity |

## Methods

### `setImage(img)`

Replace the displayed image. Invalidates the render cache.

### `setFitMode(mode)`

Change fit mode: `"contain"`, `"cover"`, `"fill"`, or `"none"`.

### `setTintColor(color)`

Apply or remove a color tint.

### `setOpacity(value)`

Set opacity (0 = transparent, 255 = opaque).

### `show()`

Renders the icon using a cached off-screen buffer for performance.

### Internal Caching

- `_buildCacheKey()` — generates a cache key from current properties
- `_invalidateCache()` — marks cache as stale
- `_rebuildCache()` — rebuilds the off-screen p5.Graphics buffer
- `_clipRoundedRect()` — applies corner radius clipping
- `_computeFit()` — calculates image position/size for the current fit mode
