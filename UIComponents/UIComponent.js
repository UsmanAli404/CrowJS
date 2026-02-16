import { Component } from "../Core/Component.js";

export class UIComponent extends Component{
    /**
   * Creates a new UIComponent with visual styling
   * @param {number} x - The x-coordinate
   * @param {number} y - The y-coordinate
   * @param {number} width - The width
   * @param {number} height - The height
   * @param {p5.Color} backgroundColor - Background color
   * @param {boolean} borderFlag - Whether to show border
   * @param {p5.Color} borderColor - Border color
   * @param {number} borderWidth - Border width
   * @param {number} cornerRadius - Corner radius for rounded corners
   * @param {boolean} enableShadow - Whether to render shadow
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
    constructor(x, y, width, height, backgroundColor, borderFlag, borderColor,
         borderWidth, cornerRadius, enableShadow, shadowColor, shadowBlur,
         shadowOffsetX, shadowOffsetY, {parent=null, type="", id=null, margin=0, marginx=null, marginy=null, marginl=null, marginr=null, margint=null, marginb=null} = {}){
        super(x, y, width, height, {parent: parent, type: type, id: id, margin: margin, marginx: marginx, marginy: marginy, marginl: marginl, marginr: marginr, margint: margint, marginb: marginb});

        this.backgroundColor = backgroundColor;

        this.borderFlag = borderFlag;
        if(this.borderFlag){
            this.borderColor = borderColor;
            this.borderWidth = borderWidth;
        }
        
        this.enableShadow = enableShadow;

        if(this.enableShadow){
            this.shadowColor = shadowColor;
            this.shadowBlur = shadowBlur;
            this.shadowOffsetX = shadowOffsetX;
            this.shadowOffsetY = shadowOffsetY;
        }

        this.cornerRadius = cornerRadius;
    }
    /**
   * Updates the component's width (abstract method)
   * @abstract
   */
    updateWidth(){};
    /**
   * Updates the component's height (abstract method)
   * @abstract
   */
    updateHeight(){};
    /**
   * Updates shadow color
   * @param {string} shadowColor - Shadow color (CSS color string)
   */
    setShadowColor(shadowColor){
        this.shadowColor = shadowColor;
    }

    /**
   * Updates shadow blur radius
   * @param {number} shadowBlur - Shadow blur
   */
    setShadowBlur(shadowBlur){
        this.shadowBlur = shadowBlur;
    }

    /**
   * Updates shadow X offset
   * @param {number} shadowOffsetX - Shadow offset on X axis
   */
    setShadowOffsetX(shadowOffsetX){
        this.shadowOffsetX = shadowOffsetX;
    }

    /**
   * Updates shadow Y offset
   * @param {number} shadowOffsetY - Shadow offset on Y axis
   */
    setShadowOffsetY(shadowOffsetY){
        this.shadowOffsetY = shadowOffsetY;
    }
    /**
   * Renders a shadow effect around the component
   * @param {Object} options - Shadow rendering options
   */
    drawShadow({}={}){
        if(this.width<=0 || this.height<=0){
            return;
        }

        let blur = Math.max(0, this.shadowBlur ?? 0);
        let offsetX = this.shadowOffsetX ?? 0;
        let offsetY = this.shadowOffsetY ?? 0;
        let resolvedShadowColor = (typeof this.shadowColor === "string")
            ? this.shadowColor
            : (this.shadowColor && this.shadowColor.toString ? this.shadowColor.toString() : "rgba(0,0,0,0.35)");

        if(blur===0 && offsetX===0 && offsetY===0){
            return;
        }

        let baseFill = this.backgroundColor ?? color(0, 0, 0, 0);

        push();
        let ctx = drawingContext;
        ctx.shadowColor = resolvedShadowColor;
        ctx.shadowBlur = blur;
        ctx.shadowOffsetX = offsetX;
        ctx.shadowOffsetY = offsetY;
        noStroke();
        fill(baseFill);
        rect(this.x, this.y, this.width, this.height, this.cornerRadius);
        pop();
    }
}