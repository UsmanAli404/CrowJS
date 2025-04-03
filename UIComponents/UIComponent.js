import { Component } from "../Core/Component.js";

export class UIComponent extends Component{
    constructor(x, y, width, height, backgroundColor, borderFlag, borderColor,
         borderWidth, cornerRadius, {parent=null, type="", id=null} = {}){
        super(x, y, width, height, {parent: parent, type: type, id: id});

        this.backgroundColor = backgroundColor;

        this.borderFlag = borderFlag;
        if(this.borderFlag){
            this.borderColor = borderColor;
            this.borderWidth = borderWidth;
        }
        
        this.cornerRadius = cornerRadius;
    }

    updateWidth(){};
    updateHeight(){};
}