import { Component } from "../Core/Component.js";

export class FrameComponent extends Component{
    constructor(x, y, width, height, {parent=null, type="", id=null} = {}){
        super(x, y, width, height, {parent: parent, type: type, id: id,});
    }

    adjustHeight(){};
    adjustWidth(){};
    showBanner(){};
    hideBanner(){};
    updatePosition(){};//for dragging
    add(){};
}