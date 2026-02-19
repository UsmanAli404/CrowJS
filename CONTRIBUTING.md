# Contributing to CrowJS 🐦‍⬛

First off, thank you for considering contributing to CrowJS! It’s people like you who make the p5.js ecosystem better for everyone.

To maintain code quality and stability, we follow a strict contribution workflow. Please read the guidelines below before getting started.

---

## 🏗️ Getting Started

### 1. Understand the Structure
CrowJS is a canvas-native library. Before writing code, please:
* **Read the Documentation:** Visit [crow-js.vercel.app](https://crow-js.vercel.app/) to understand the component lifecycle and event system.
* **Explore the Source:** Look at `Core/Root.js` to see how the main engine works and `UIComponents/` to see how existing components (like Buttons or Sliders) are implemented.

### 2. Local Setup
1. Fork the repository.
2. Clone your fork locally:
   ```bash
   git clone [https://github.com/YOUR_USERNAME/CrowJS.git](https://github.com/YOUR_USERNAME/CrowJS.git)
   ```
3. Run `npm install` to set up the development environment (including VitePress for docs).

---

## 🚦 Contribution Workflow

**Note:** Direct pushes to the `main` branch are disabled. All changes must come through a Pull Request (PR).

### Step 1: Create a Branch
Always create a descriptive branch for your work:
```bash
git checkout -b feature/your-feature-name
# OR
git checkout -b fix/issue-description
```

### Step 2: Make Your Changes
* Follow the existing code style (clean, documented, and modular).
* If you add a new component, ensure it inherits from the appropriate base class.
* Update the documentation in the `docs/` folder if your changes affect the API.

### Step 3: Open a Pull Request
1. Push your branch to your fork.
2. Open a Pull Request against the CrowJS `main` branch.
3. **Requirement:** Per our repository settings, at least **one approving review** is required before a PR can be merged. 
4. Ensure all conversations and feedback in the PR are resolved.

---

## 📝 Coding Guidelines
* **No DOM Interference:** Remember, CrowJS is canvas-native. Avoid using `document.createElement` or CSS overlays unless absolutely necessary.
* **Performance:** p5.js sketches run at 60fps. Ensure your component's `draw` (or `show`) methods are highly optimized.
* **Compatibility:** Ensure your code works with the latest version of p5.js.

## 🐛 Reporting Bugs
If you find a bug, please open an **Issue** with:
* A clear description of the bug.
* A minimal `sketch.js` example demonstrating the issue.
* Your browser and OS version.

## 💡 Feature Requests
Have an idea for a new component (like a Color Picker or Graph)? Open an issue with the "Feature Request" label to discuss it before starting work!

---

Created with ❤️ by [Usman Ali](https://github.com/UsmanAli404)
