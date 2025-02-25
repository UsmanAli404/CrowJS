import { Component } from "../Core/Component.js";

export class FrameComponent extends Component{
    constructor(x, y, width, height, {parent=null, type=""} = {}){
        super(x, y, width, height, {parent: parent, type: type});
    }

    adjustHeight(){};
    adjustWidth(){};
    showBanner(){};
    hideBanner(){};
    updatePosition(){};//for dragging
    add(){};
}