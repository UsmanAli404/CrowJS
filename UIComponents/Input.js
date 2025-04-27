import { UIComponent } from "./UIComponent.js";

export class Input extends UIComponent{
    constructor(x, y, width, height, backgroundColor, borderFlag, borderColor, borderWidth,
        cornerRadius, enableShadow, shadowColor, shadowIntensity, shadowSpread, shadowDetail,
        {parent=null, type="", id=null} = {}
    ){
        super(x, y, width, height, backgroundColor, borderFlag, borderColor,
            borderWidth, cornerRadius, enableShadow, shadowColor, shadowIntensity,
            shadowSpread, shadowDetail, {parent: parent, type: type, id: id});
        this.isFocused = false;
    }

    focus(){
        console.log("Focus!");
        if(!this.isFocused){
            this.isFocused = true;
            this.borderWidth += 3;
        }
    }

    blur(){
        console.log("Blur!");
        if(this.isFocused){
            this.isFocused = false;
            this.borderWidth -= 3;
        }
    }
}