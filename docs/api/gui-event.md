---
outline: deep
---

# GUIEvent

Base event class for all CrowJS events.

**Import:**

```js
import { GUIEvent } from "./Core/GUIEvent/GUIEvent.js";
```

## Constructor

```js
new GUIEvent(x, y, type, target)
```

| Parameter | Type | Description |
|---|---|---|
| `x` | `number` | Mouse X position |
| `y` | `number` | Mouse Y position |
| `type` | `string` | Event type (e.g. `"click"`, `"hover"`) |
| `target` | `Component` | The component that originated the event |

## Properties

| Property | Type | Description |
|---|---|---|
| `x` | `number` | Mouse X at time of event |
| `y` | `number` | Mouse Y at time of event |
| `type` | `string` | Event type string |
| `target` | `Component` | Originating component |
| `propagationStopped` | `boolean` | Whether propagation was stopped |

## Methods

### `stopPropagation()`

Prevents the event from bubbling up to parent components.

```js
button.addEventListener("click", (event) => {
  event.stopPropagation();
});
```
