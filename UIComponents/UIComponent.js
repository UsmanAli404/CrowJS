import { Component } from "../Core/Component.js";

export class UIComponent extends Component{
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

    updateWidth(){};
    updateHeight(){};

    rgbToArray(shadowColor) {
        let match = shadowColor.match(/\d+/g);
        return match ? match.map(Number) : null;
    }

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