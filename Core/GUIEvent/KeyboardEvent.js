import { GUIEvent } from "./GUIEvent.js";

export class KeyboardEvent extends GUIEvent{
    /**
   * Creates a keyboard-specific event
   * @param {number} x - The current mouse x-coordinate
   * @param {number} y - The current mouse y-coordinate
   * @param {string} type - The type of keyboard event
   * @param {Component} target - The target component
   */
    constructor(x, y, type, target){
        super(x, y, type, target);
    }
}