---
outline: deep
---

# Icon

An `Icon` component displays an image with optional tinting, opacity, and multiple fit modes. It uses off-screen caching for efficient rendering.

## Import

```js
import { Icon } from "./UIComponents/Icon.js";
```

## Basic Usage

```js
let img;

window.preload = function () {
  img = loadImage("my-icon.png");
};

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  const root = new Root();

  const icon = new Icon(50, 50, 64, 64, img, {
    cornerRadius: 8,
    fitMode: "contain",
  });

  root.add(icon);
};
```

## Constructor Options

```js
new Icon(x, y, width, height, img, options?)
```

| Option | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | `null` | Unique identifier |
| `img` | `p5.Image` | — | The image to display (loaded via `loadImage()`) |
| `fitMode` | `string` | `"contain"` | How the image fits: `"contain"`, `"cover"`, `"fill"`, `"none"` |
| `tintColor` | `string` | `null` | Apply a color tint to the image |
| `opacity` | `number` | `255` | Image opacity (0–255) |
| `backgroundColor` | `string` | `"rgba(200,200,200,1)"` | Background color |
| `borderFlag` | `boolean` | `true` | Show border |
| `borderColor` | `string` | `"rgba(0,0,0,1)"` | Border color |
| `borderWidth` | `number` | `2` | Border width |
| `cornerRadius` | `number` | `0` | Rounded corners |
| `enableShadow` | `boolean` | `false` | Enable drop shadow |
| `margin` | `number` | `0` | Outer margin |

## Fit Modes

| Mode | Description |
|---|---|
| `"contain"` | Scale to fit within bounds, maintaining aspect ratio (may leave empty space) |
| `"cover"` | Scale to cover bounds completely, maintaining aspect ratio (may crop edges) |
| `"fill"` | Stretch to fill the full bounds (may distort) |
| `"none"` | Display at original size, centered |

## Methods

### `setImage(img)`

Replace the displayed image.

```js
icon.setImage(newImage);
```

### `setFitMode(mode)`

Change the fit mode at runtime.

```js
icon.setFitMode("cover");
```

### `setTintColor(color)`

Apply a color tint.

```js
icon.setTintColor("#ff0000"); // Red tint
icon.setTintColor(null);      // Remove tint
```

### `setOpacity(value)`

Set the opacity (0 = fully transparent, 255 = fully opaque).

```js
icon.setOpacity(128); // 50% transparent
```

## Caching

`Icon` uses an off-screen `p5.Graphics` buffer to cache the rendered image. The cache is automatically invalidated when you change the image, dimensions, fit mode, tint, or opacity. This means rendering is efficient even with complex clipping and fit calculations.
