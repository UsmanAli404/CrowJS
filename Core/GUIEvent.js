export class GUIEvent {
    constructor(type, target) {
        this.type = type;
        this.target = target;
        this.propagationStopped = false;
    }

    stopPropagation() {
        this.propagationStopped = true;
    }
}