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
   * @param {string} shadowColor - Shadow color in RGB format
   * @param {number} shadowIntensity - Shadow opacity (0-1)
   * @param {number} shadowSpread - Shadow spread amount
   * @param {number} shadowDetail - Number of shadow layers
   * @param {Object} options - Additional options
   * @param {Component|null} options.parent - Parent component
   * @param {string} options.type - Component type
   * @param {string|null} options.id - Component ID
   */
    constructor(x, y, width, height, backgroundColor, borderFlag, borderColor,
         borderWidth, cornerRadius, enableShadow, shadowColor, shadowIntensity,
         shadowSpread, shadowDetail, {parent=null, type="", id=null} = {}){
        super(x, y, width, height, {parent: parent, type: type, id: id});

        this.backgroundColor = backgroundColor;

        this.borderFlag = borderFlag;
        if(this.borderFlag){
            this.borderColor = borderColor;
            this.borderWidth = borderWidth;
        }
        
        this.enableShadow = enableShadow;

        if(this.enableShadow){
            this.shadowColor = shadowColor;//rgb value
            this.shadowIntensity = shadowIntensity;//opacity value between 0 and 1
            this.shadowSpread = shadowSpread;//stroke width of each of those rectangles
            this.shadowDetail = shadowDetail;//number of rectangles that will be drawn around the component
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
   * Converts RGB color string to array of numbers
   * @param {string} shadowColor - RGB color string like "rgb(255,255,255)"
   * @returns {number[]|null} Array of [r, g, b] values or null if invalid
   */
    rgbToArray(shadowColor) {
        let match = shadowColor.match(/\d+/g);
        return match ? match.map(Number) : null;
    }
    /**
   * Renders a shadow effect around the component
   * @param {Object} options - Shadow rendering options
   */
    drawShadow({}={}){
        let color = this.rgbToArray(this.shadowColor);
        if(color==null){
            console.log("shadow color value is not in the correct format: rgb(0,0,0)");
            return;
        }

        if(this.shadowIntensity>1){
            this.shadowIntensity=1;
            console.log("shadow intensity should be between 0 and 1 inclusive.\nAny value given outside of the range will be clipped to the ends.");
        } else if(this.shadowIntensity<0){
            console.log("shadow intensity should be between 0 and 1 inclusive.\nAny value given outside of the range will be clipped to the ends.");
            this.shadowIntensity=0;
        }

        for(let i=1; i<=this.shadowDetail; i++){
            push();
            noFill();
            let alpha = this.shadowIntensity * pow(1 - i / this.shadowDetail, 2);
            stroke(`rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`);
            strokeWeight(this.shadowSpread);
            rect(this.x-((i*this.shadowSpread)/2), this.y-((i*this.shadowSpread)/2), this.width+(i*this.shadowSpread), this.height+(i*this.shadowSpread), this.cornerRadius);
            pop();
        }
    }
}