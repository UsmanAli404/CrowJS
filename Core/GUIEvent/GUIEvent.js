export class GUIEvent {
    /**
   * Creates a base GUI event
   * @param {number} x - The x-coordinate where the event occurred
   * @param {number} y - The y-coordinate where the event occurred
   * @param {string} type - The type of event (e.g., "click", "hover")
   * @param {Component} target - The component that is the target of the event
   */
    constructor(x, y, type, target) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.target = target;
        this.propagationStopped = false;
    }

    /**
   * Stops the event from propagating to parent components
   */
    stopPropagation() {
        this.propagationStopped = true;
    }
}