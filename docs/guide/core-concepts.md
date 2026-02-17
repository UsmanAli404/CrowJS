---
outline: deep
---

# Core Concepts

This page explains the architecture and design principles behind CrowJS.

## Component Hierarchy

Every visual element in CrowJS extends the base `Component` class. The inheritance tree is:

```
Component
├── FrameComponent
│   └── Frame
│       ├── GridFrame
│       └── ScrollFrame
└── UIComponent
    ├── TextComponent
    │   ├── Label
    │   └── Button
    ├── Icon
    └── Input
        └── TextField
```

- **Component** — provides positioning, margins, event handling, parent/child relationships, and hit testing.
- **FrameComponent / Frame** — adds container behavior (resizing, dragging, banners, shadows).
- **UIComponent** — adds visual styling (background, border, corner radius, shadow).
- **TextComponent** — adds text rendering, wrapping, alignment, and icon support.

## The Root

`Root` is the top-level manager. It is **not** a `Component` itself — it holds an array of top-level components called **layers** and orchestrates rendering, event dispatch, and focus management.

```js
const root = new Root();
root.add(myButton);      // Add to scene
root.remove(myButton);   // Remove from scene
root.getElementById("myId"); // Lookup by ID
```

### Z-Ordering

Components are rendered in layer order (first added = back, last added = front). You can change order at runtime:

```js
root.sendToFront(element);   // Move to top
root.sendToBack(element);    // Move to bottom
root.sendForwards(element);  // Move up one layer
root.sendBackwards(element); // Move down one layer
```

## Parent-Child Relationships

When a component is added to a `Frame`, `ScrollFrame`, or `GridFrame`, it becomes a **child** of that frame. This creates a tree structure. Each component has:

- `parent` — reference to the parent component (or `null` for top-level)
- `children` — array of child components
- `root` — reference to the `Root` manager

Events propagate up this tree (bubbling) unless stopped.

## Event System

CrowJS uses an event model inspired by the DOM. You register listeners with `addEventListener` and events automatically bubble from the target component up through its parents.

```js
component.addEventListener("click", (event) => {
  console.log("Clicked:", event.target);
  event.stopPropagation(); // Prevent bubbling
});
```

### Supported Events

| Event | Trigger |
|---|---|
| `click` | Mouse click on component |
| `press` | Mouse button pressed down |
| `release` | Mouse button released |
| `doubleClick` | Double-click |
| `drag` | Mouse dragged while pressed |
| `hover` | Mouse over component (every frame) |
| `mouseEnter` | Mouse enters component bounds |
| `mouseLeave` | Mouse leaves component bounds |
| `scroll` | Mouse wheel scrolled |
| `keyPress` | Key pressed (single fire) |
| `keyDown` | Key held down (continuous, every frame) |
| `focus` | Component receives focus |
| `blur` | Component loses focus |
| `resize` | Component was resized |
| `reposition` | Component was moved |

### Event Dispatch Patterns

| Pattern | Method | Behavior |
|---|---|---|
| **Bubble** | `dispatchEvent(event)` | Fires on target, then walks up to each parent |
| **Self-only** | `dispatchEventOnlyOnSelf(event)` | Fires only on the target, no propagation |
| **Trickle-down** | `dispatchTrickleDownEvent(event)` | Fires on target and all descendants |

## Rendering Lifecycle

CrowJS renders inside the p5.js `draw()` loop. Every frame:

1. `background()` is called to clear the canvas.
2. `root.show()` iterates layers and calls `show()` on each component.
3. Continuous event listeners (`hover`, `mouseEnter`, `mouseLeave`, `keyDown`) are polled.

One-shot events (`click`, `press`, `release`, `drag`, `scroll`, `keyPress`) are dispatched from the corresponding `window` event handlers.

```js
// Continuous (call every frame in draw)
root.hoverEventListeners(mouseX, mouseY);
root.mouseEnterEventListeners(mouseX, mouseY);
root.mouseLeaveEventListeners(mouseX, mouseY);
root.keyDownEventListeners(mouseX, mouseY);

// One-shot (call from window event handlers)
root.mouseClickedEventListeners(mouseX, mouseY);
root.mousePressedEventListeners(mouseX, mouseY);
root.mouseReleasedEventListeners(mouseX, mouseY);
root.mouseDraggedEventListeners(mouseX, mouseY);
root.mouseWheelEventListeners(mouseX, mouseY, event);
root.keyPressedEventListeners(mouseX, mouseY);
```

## Margins and Padding

Components support margins (external spacing) and padding (internal spacing).

### Margins

Set via constructor options:

| Option | Description |
|---|---|
| `margin` | Uniform margin on all sides |
| `marginx` | Left + right margin |
| `marginy` | Top + bottom margin |
| `marginl` | Left margin |
| `marginr` | Right margin |
| `margint` | Top margin |
| `marginb` | Bottom margin |

Computed properties `outerX`, `outerY`, `outerWidth`, `outerHeight` include margins.

### Padding

Frames use `padx` / `pady` (or `pad` for uniform). Text components use `padl`, `padr`, `padt`, `padb` for text insets.

## IDs and Lookup

Assign an `id` string to any component at creation, then retrieve it from anywhere via `Root`:

```js
const label = new Label(0, 0, 100, 30, "Name", { id: "nameLabel" });
root.add(label);

// Later...
const found = root.getElementById("nameLabel");
found.setText("Updated!");
```

::: warning
IDs must be unique across the entire component tree. CrowJS will throw an error if duplicate IDs are detected.
:::

## Debug Overlay

Pass `showDebugOverlay: true` to any component or to the `Root` constructor to visualize margins (orange) and padding (blue) as colored overlays:

```js
const root = new Root({ showDebugOverlay: true });
```

Or enable on individual components:

```js
const btn = new Button(0, 0, 100, 40, "Debug", {
  showDebugOverlay: true,
});
```
