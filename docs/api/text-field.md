---
outline: deep
---

# TextField <Badge type="tip" text="API" />

Full-featured single-line text input with cursor, selection, scrolling, and key repeat.

**Import:**

```js
import { TextField } from "./UIComponents/TextField.js";
```

**Extends:** [Input](./input) → [UIComponent](./ui-component) → [Component](./component)

## Constructor

```js
new TextField(x, y, width, height, options?)
```

| Option | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | `null` | Unique identifier |
| `text` | `string` | `""` | Initial text |
| `placeholder` | `string` | `""` | Placeholder text |
| `placeholderColor` | `string` | `"rgba(150,150,150,1)"` | Placeholder color |
| `textColor` | `string` | `"rgba(0,0,0,1)"` | Text color |
| `textAlign` | `string` | `LEFT` | Text alignment |
| `backgroundColor` | `string` | `"rgba(255,255,255,1)"` | Background |
| `borderFlag` | `boolean` | `true` | Show border |
| `borderColor` | `string` | `"rgba(0,0,0,1)"` | Border color |
| `borderWidth` | `number` | `2` | Border width |
| `cornerRadius` | `number` | `0` | Corner radius |
| `pad` | `number` | — | Uniform padding |
| `enableShadow` | `boolean` | `false` | Enable shadow |

See the [TextField guide](../guide/components/text-field) for detailed usage and examples.

## Properties

| Property | Type | Description |
|---|---|---|
| `text` | `string` | Current text value |
| `cursorPos` | `number` | Cursor position (character index) |
| `textSize` | `number` | Current font size |
| `textColor` | `string` | Text color |
| `placeholder` | `string` | Placeholder text |
| `placeholderColor` | `string` | Placeholder color |
| `selectionStart` | `number` | Start of text selection |
| `selectionEnd` | `number` | End of text selection |
| `isSelecting` | `boolean` | Whether text is being selected |
| `cursorVisible` | `boolean` | Whether cursor is currently visible (blinks) |

## Methods

### Text Manipulation

| Method | Description |
|---|---|
| `deleteSelectedText()` | Delete the currently selected text range |
| `deleteOneChar()` | Delete one character before cursor |
| `deleteOneWord()` | Delete one word before cursor |

### Cursor Navigation

| Method | Description |
|---|---|
| `moveCursorLeft(n)` | Move cursor left by n characters |
| `moveCursorRight(n)` | Move cursor right by n characters |
| `jumpLeftByOneWord()` | Move cursor to start of previous word |
| `jumpRightByOneWord()` | Move cursor to end of next word |

### Scroll

| Method | Description |
|---|---|
| `scrollCursorIntoView()` | Ensure cursor is visible |
| `scrollCursorIntoViewRight()` | Scroll right to show cursor |
| `scrollCursorIntoViewLeft()` | Scroll left to show cursor |

### Internal

| Method | Description |
|---|---|
| `onKeyPress(event)` | Handle key press (character insertion, navigation) |
| `onKeyDown(event)` | Handle continuous key-down (repeat) |
| `onMousePress(event)` | Handle click-to-position cursor |
| `onMouseDrag(event)` | Handle drag-to-select |
| `onMouseRelease(event)` | End selection |
| `onBlur(event)` | Clear selection, hide cursor |
| `findTextWidth(start, end)` | Measure text width between positions |
| `computeTextStartX()` | Calculate text rendering start X |
| `getCursorIndexFromX(clickX)` | Convert click X to character index |
| `updateTextSize()` | Recalculate text size from height |
| `updateWidth()` / `updateHeight()` | Handle resize |
