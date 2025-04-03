import { GUIEvent } from "./GUIEvent.js";

export class KeyboardEvent extends GUIEvent{
    constructor(x, y, type, target){
        super(x, y, type, target);
    }
}