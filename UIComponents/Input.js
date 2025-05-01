import { GUIEvent } from "../Core/GUIEvent/GUIEvent.js";
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
        // this.addEventListener("focus", (event)=>this.onFocus());
        // this.addEventListener("blur", (event)=>this.onBlur());
    }

    onFocus(event){
        console.log("focused...");
    }

    onBlur(event){
        console.log("blurred...");
    }

    focus(){
        // console.log("Focus!");
        if(!this.isFocused){
            this.isFocused = true;
            this.borderWidth += 3;
        }

        this.dispatchEventOnlyOnSelf(new GUIEvent(0, 0, "focus", this));
    }

    blur(){
        // console.log("Blur!");
        if(this.isFocused){
            this.isFocused = false;
            this.borderWidth -= 3;
        }

        this.dispatchEventOnlyOnSelf(new GUIEvent(0, 0, "blur", this));
    }
}