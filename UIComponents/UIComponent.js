import { Component } from "../Core/Component.js";

export class UIComponent extends Component{
    constructor(x, y, width, height, {parent=null, type=""} = {}){
        super(x, y, width, height, {parent: parent, type: type});
    }

    updateWidth(){};
    updateHeight(){};
}