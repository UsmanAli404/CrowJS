---
outline: deep
---

# MouseEvent

Extends `GUIEvent` with mouse-specific properties. Used for scroll events.

**Import:**

```js
import { MouseEvent } from "./Core/GUIEvent/MouseEvent.js";
```

## Constructor

```js
new MouseEvent(x, y, type, target, { event })
```

| Parameter | Type | Description |
|---|---|---|
| `x` | `number` | Mouse X position |
| `y` | `number` | Mouse Y position |
| `type` | `string` | Event type |
| `target` | `Component` | Target component |
| `event` | `WheelEvent` | Native browser wheel event (optional) |

## Properties

Inherits all properties from [GUIEvent](./gui-event), plus:

| Property | Type | Description |
|---|---|---|
| `delta` | `number` | Scroll delta — positive = scroll up, negative = scroll down. Derived from the native `event.delta`. |
