---
outline: deep
---

# Contributing to CrowJS

Thank you for considering contributing to CrowJS! It's people like you who make the p5.js ecosystem better for everyone.

To maintain code quality and stability, we follow a strict contribution workflow. Please read the guidelines below before getting started.

## Getting Started

### Understand the Structure

CrowJS is a canvas-native library. Before writing code, please:

::: tip Before You Code
- **Read the Documentation** — browse this site to understand the component lifecycle and event system.
- **Explore the Source** — look at `Core/Root.js` to see how the main engine works and `UIComponents/` to see how existing components are implemented.
:::

### Local Setup

1. **Fork** the repository on GitHub.

2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/CrowJS.git
   ```

3. **Install** dependencies (includes VitePress for docs):
   ```bash
   npm install
   ```

## Contribution Workflow

::: warning Important
Direct pushes to the `main` branch are disabled. All changes **must** come through a Pull Request (PR).
:::

### Step 1 — Create a Branch

Always create a descriptive branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### Step 2 — Make Your Changes

| Guideline | Details |
|---|---|
| **Follow the code style** | Keep code clean, documented, and modular |
| **Inherit correctly** | New components must extend the appropriate base class |
| **Update docs** | If your changes affect the API, update the `docs/` folder |

### Step 3 — Open a Pull Request

1. Push your branch to your fork.
2. Open a Pull Request against the CrowJS `main` branch.
3. At least **one approving review** is required before merging.
4. Resolve all conversations and feedback in the PR.

## Coding Guidelines

::: details Canvas-Native — No DOM Interference
CrowJS renders everything on the p5.js canvas. Avoid using `document.createElement` or CSS overlays unless absolutely necessary.
:::

::: details Performance Matters
p5.js sketches run at 60 fps. Ensure your component's `draw` / `show` methods are highly optimized — avoid allocations and heavy computation in the render loop.
:::

::: details Compatibility
Ensure your code works with the latest version of p5.js.
:::

## Reporting Bugs

If you find a bug, please open an **Issue** with:

- A clear description of the bug.
- A minimal `sketch.js` example demonstrating the issue.
- Your browser and OS version.

## Feature Requests

Have an idea for a new component (like a Color Picker or Graph)? Open an issue with the **Feature Request** label to discuss it before starting work!

---

<div style="text-align: center; margin-top: 2rem; opacity: 0.7;">
  Created with ❤️ by <a href="https://github.com/UsmanAli404" target="_blank">Usman Ali</a>
</div>
