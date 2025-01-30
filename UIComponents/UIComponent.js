import { Component } from "../Core/Component.js";

export class UIComponent extends Component{
    constructor(x, y, width, height, {parent=null, parentType=""} = {}){
        super(x, y, width, height, {parent: parent, parentType: parentType});
    }

    updateWidth(){};
    updateHeight(){};
}