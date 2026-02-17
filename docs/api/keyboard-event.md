---
outline: deep
---

# KeyboardEvent

Extends `GUIEvent` with access to the native browser keyboard event.

**Import:**

```js
import { KeyboardEvent } from "./Core/GUIEvent/KeyboardEvent.js";
```

## Constructor

```js
new KeyboardEvent(x, y, type, target, nativeEvent)
```

| Parameter | Type | Description |
|---|---|---|
| `x` | `number` | Mouse X position |
| `y` | `number` | Mouse Y position |
| `type` | `string` | Event type (`"keyPress"` or `"keyDown"`) |
| `target` | `Component` | Target component |
| `nativeEvent` | `KeyboardEvent` | The native browser `KeyboardEvent` object |

## Properties

Inherits all properties from [GUIEvent](./gui-event), plus:

| Property | Type | Description |
|---|---|---|
| `nativeEvent` | `KeyboardEvent` | Native browser KeyboardEvent. Access `key`, `code`, `ctrlKey`, `shiftKey`, etc. |

## Usage

```js
textField.addEventListener("keyPress", (event) => {
  if (event.nativeEvent.key === "Enter") {
    console.log("Enter pressed, value:", textField.text);
  }
});
```
