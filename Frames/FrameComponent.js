import { Component } from "../Core/Component.js";

export class FrameComponent extends Component{
    constructor(x, y, width, height, {parent=null, parentType=""} = {}){
        super(x, y, width, height, {parent: parent, parentType: parentType});
    }

    adjustHeight(){};
    adjustWidth(){};
    showBanner(){};
    hideBanner(){};
    updatePosition(){};//for dragging
    add(){};
}