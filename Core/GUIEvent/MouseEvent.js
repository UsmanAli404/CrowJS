import { GUIEvent } from "./GUIEvent.js";

export class MouseEvent extends GUIEvent{
    /**
   * Creates a mouse-specific event
   * @param {number} x - The x-coordinate of the mouse event
   * @param {number} y - The y-coordinate of the mouse event
   * @param {string} type - The type of mouse event
   * @param {Component} target - The target component
   * @param {Object} options - Additional options
   * @param {WheelEvent|null} options.event - The original wheel event for scroll events
   */
    constructor(x, y, type, target, {event=null}={}){
        super(x, y, type, target);
        //storing scroll info
        if(event){
            //positive delta value denotes scroll up
            //non-positive denotes scroll down
            this.delta = event.delta;
        }
    }
}