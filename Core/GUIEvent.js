export class GUIEvent {
    constructor(x, y, type, target) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.target = target;
        this.propagationStopped = false;
    }

    stopPropagation() {
        this.propagationStopped = true;
    }
}