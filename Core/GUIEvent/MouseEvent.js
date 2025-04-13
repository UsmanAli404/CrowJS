import { GUIEvent } from "./GUIEvent.js";

export class MouseEvent extends GUIEvent{
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