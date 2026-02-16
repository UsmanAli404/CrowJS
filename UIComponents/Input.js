import { GUIEvent } from "../Core/GUIEvent/GUIEvent.js";
import { UIComponent } from "./UIComponent.js";
import { Component } from "../Core/Component.js";

export class Input extends UIComponent{
     /**
   * Creates a base input component
   * @param {number} x - The x-coordinate
   * @param {number} y - The y-coordinate
   * @param {number} width - The width
   * @param {number} height - The height
   * @param {p5.Color} backgroundColor - Background color
   * @param {boolean} borderFlag - Whether to show border
   * @param {p5.Color} borderColor - Border color
   * @param {number} borderWidth - Border width
   * @param {number} cornerRadius - Corner radius
   * @param {boolean} enableShadow - Enable shadow
   * @param {string} shadowColor - Shadow color (CSS color string)
   * @param {number} shadowBlur - Shadow blur radius
   * @param {number} shadowOffsetX - Shadow offset on X axis
   * @param {number} shadowOffsetY - Shadow offset on Y axis
   * @param {Object} options - Additional options
   * @param {Component|null} options.parent - Parent component
   * @param {string} options.type - Component type
   * @param {string|null} options.id - Component ID
   * @param {number} options.margin - General margin for all sides
   * @param {number} options.marginx - Horizontal margin (left and right)
   * @param {number} options.marginy - Vertical margin (top and bottom)
   * @param {number} options.marginl - Left margin
   * @param {number} options.marginr - Right margin
   * @param {number} options.margint - Top margin
   * @param {number} options.marginb - Bottom margin
   */
    constructor(x, y, width, height, backgroundColor, borderFlag, borderColor, borderWidth,
        cornerRadius, enableShadow, shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY,
        {parent=null, type="", id=null, margin=0, marginx=null, marginy=null, marginl=null, marginr=null, margint=null, marginb=null} = {}
    ){
        super(x, y, width, height, backgroundColor, borderFlag, borderColor,
            borderWidth, cornerRadius, enableShadow, shadowColor, shadowBlur,
            shadowOffsetX, shadowOffsetY, {parent: parent, type: type, id: id, margin: margin, marginx: marginx, marginy: marginy, marginl: marginl, marginr: marginr, margint: margint, marginb: marginb});
        this.isFocused = false;
        // this.addEventListener("focus", (event)=>this.onFocus());
        // this.addEventListener("blur", (event)=>this.onBlur());
    }

    /**
   * Handles focus event
   * @param {GUIEvent} event - The focus event
   */
    onFocus(event){
        console.log("focused...");
    }

    /**
   * Handles blur event
   * @param {GUIEvent} event - The blur event
   */
    onBlur(event){
        console.log("blurred...");
    }
    /**
   * Sets focus on the input field with visual feedback
   */
    focus(){
        // console.log("Focus!");
        if(!this.isFocused){
            this.isFocused = true;
            this.borderWidth += 3;
        }

        this.dispatchEventOnlyOnSelf(new GUIEvent(0, 0, "focus", this));
    }
    /**
   * Removes focus from the input field
   */
    blur(){
        // console.log("Blur!");
        if(this.isFocused){
            this.isFocused = false;
            this.borderWidth -= 3;
        }

        this.dispatchEventOnlyOnSelf(new GUIEvent(0, 0, "blur", this));
    }
}