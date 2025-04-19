import { Input } from "./Input.js";

export class TextField extends Input{
    constructor(x, y, width, height, 
    {
        id=null,
        parent=null,
        backgroundColor='rgb(255, 255, 255)',
        textColor='rgb(0, 0, 0)',
        borderFlag = true,
        borderColor = color(0),
        borderWidth = 1, 
        cornerRadius = 0,
        enableShadow=false,
        shadowColor= 'rgb(0,0,0)',
        shadowIntensity= 0.4,
        shadowSpread= 3,
        shadowDetail=5,
        placeholder="",
        text="",
        textAlign = "left",
        padding = 5,
    }={}) {
        super(x, y, width, height, backgroundColor, borderFlag, borderColor,
            borderWidth, cornerRadius, enableShadow, shadowColor, shadowIntensity,
            shadowSpread, shadowDetail, {parent: parent, type: "Input", id: id});
        
            this.cursorPos = 0;
            this.text = text;
            this.textSize = 30;//height of text in pixels
            this.displayXOffset = 0;
            this.leftCount = 0;
            this.prevWidth = 0;

            this.textAlign = textAlign;
            this.padding = padding;
            this.textColor = textColor;
            this.placeholder = placeholder;

            this.cursorVisible = true;
            this.lastCursorToggle = millis();
            this.cursorBlinkInterval = 500; // milliseconds

            this.addEventListener("keyPress", (event)=>this.onKeyPress(event));
            this.addEventListener("click", (event)=>this.onMouseClick(event));
    }

    onKeyPress(event){
        if (keyCode === LEFT_ARROW) {
            this.moveCursorLeft(1);
        } else if (keyCode === RIGHT_ARROW) {
            this.moveCursorRight(1);
        } else if (keyCode === BACKSPACE) {
            // Delete the character before the cursor
            if (this.cursorPos > 0) {
                this.text = this.text.slice(0, this.cursorPos - 1) + this.text.slice(this.cursorPos);
                this.moveCursorLeft(1); // Move the cursor left after deleting a character
            }
        } else if (key.length === 1) {
            this.text = this.text.slice(0, this.cursorPos) + key + this.text.slice(this.cursorPos);
            this.moveCursorRight(1);
        }
    
        this.cursorVisible = true;
        this.lastCursorToggle = millis();
    }    

    onMouseClick(event) {
        // console.log("Mouse Clicked at: ", event.x, event.y);
    
        // Check if the click is inside the text field
        if (
            event.x >= this.x && event.x <= this.x + this.width &&
            event.y >= this.y && event.y <= this.y + this.height
        ) {
            // console.log("Click is inside the text field");
    
            let textStartX;
            if (this.textAlign === "left") {
                textStartX = this.x + this.padding - this.displayXOffset;
                // console.log("Text Start X (left-aligned): ", textStartX);
            } else if (this.textAlign === "right") {
                textStartX = this.x + this.width - this.textSize - this.displayXOffset;
                // console.log("Text Start X (right-aligned): ", textStartX);
            }
    
            let clickX = event.x;
            let relativeX = clickX - textStartX;
            // console.log("Click X: ", clickX, "Relative X: ", relativeX);
    
            textSize(this.textSize);
            let cumulativeWidth = 0;
    
            this.cursorPos = 0; // default if click is before the first character
            // console.log("Initial cursor position: ", this.cursorPos);
    
            for (let i = 0; i <= this.text.length; i++) {
                let nextWidth = textWidth(this.text.charAt(i));
                // console.log("Character: ", this.text.charAt(i), "Width: ", nextWidth);
    
                if (relativeX < cumulativeWidth + nextWidth / 2) {
                    this.cursorPos = i;
                    // console.log("Setting cursor position to: ", this.cursorPos);
                    break;
                }
                cumulativeWidth += nextWidth;
                this.cursorPos = i;
                // console.log("Updated cursor position in loop: ", this.cursorPos);
            }
    
            // Adjust displayXOffset if click is too far right or left
            let cursorX = this.findTextWidth(0, this.cursorPos);
            // console.log("Cursor X position: ", cursorX);
    
            if (cursorX - this.displayXOffset > this.width - this.padding) {
                this.displayXOffset = cursorX - (this.width - this.padding);
                // console.log("Adjusting displayXOffset (right): ", this.displayXOffset);
            } else if (cursorX - this.displayXOffset < this.padding) {
                this.displayXOffset = cursorX - this.padding;
                // console.log("Adjusting displayXOffset (left): ", this.displayXOffset);
            }
    
            this.displayXOffset = max(0, this.displayXOffset); // clamp to 0
            // console.log("Final displayXOffset: ", this.displayXOffset);
    
            // Set cursor visibility and blink logic
            this.cursorVisible = true;
            this.lastCursorToggle = millis();
            // console.log("Cursor visibility set to true");
        }
    }    

    findTextWidth(startPos, endPos){
        startPos = constrain(startPos, 0, this.text.length);
        endPos = constrain(endPos, 0, this.text.length);

        push();
        textSize(this.textSize);
        let txt = this.text.slice(startPos, endPos);
        let txtWidth = textWidth(txt);
        pop();
        return txtWidth;
    }

    findTextWidthOfGivenText(text){
        push();
        textSize(this.textSize);
        let txtWidth = textWidth(text);
        pop();
        return txtWidth;
    }

    moveCursorRight(increment){
        if(this.cursorPos < this.text.length){
            this.cursorPos += increment;
        }
    
        let cursorX = this.findTextWidth(0, this.cursorPos);
        // console.log('cursorX: ', cursorX);
    
        if(cursorX - this.displayXOffset > this.width - this.padding){
            this.displayXOffset = cursorX - (this.width - this.padding);
            // console.log('displayXOffset', this.displayXOffset);
        }
    }

    moveCursorLeft(decrement){
        if(this.cursorPos > 0){
            this.cursorPos -= decrement;
        }
    
        let cursorX = this.findTextWidth(0, this.cursorPos);
    
        if(cursorX - this.displayXOffset < this.padding){
            this.displayXOffset = cursorX - this.padding;
        }
    
        this.displayXOffset = max(0, this.displayXOffset); // prevent scrolling too far left
    }    

    getTextAlignment(){
        if(this.textAlign==="right"){
            return RIGHT;
        } else {
            return LEFT;
        }
    }

    show(){
        if(this.enableShadow){
            this.drawShadow();
        }

        push();
        beginClip();
        rect(this.x, this.y, this.width, this.height, this.cornerRadius);
        endClip();

        fill(this.textColor);
        textAlign(this.getTextAlignment(), CENTER);
        textSize(this.textSize);
        
        let x, y;
        if(this.textAlign==="left"){
            x = this.x - this.displayXOffset + this.padding;
            // + this.padding;
        } else if(this.textAlign==="right") {
            x = this.x - this.displayXOffset + this.width - this.textSize;
        }
        y = this.y + this.height/2 + 4;

        text(this.text, x, y);

        if (millis() - this.lastCursorToggle > this.cursorBlinkInterval) {
            this.cursorVisible = !this.cursorVisible;
            this.lastCursorToggle = millis();
        }

        if(this.isFocused){
            let cursorX = x + this.findTextWidth(0, this.cursorPos);
            if (this.cursorVisible) {
                stroke(this.textColor);
                strokeWeight(2);
                line(cursorX, y - this.textSize * 0.5, cursorX, y + this.textSize * 0.3);
            }
        }

        if(this.borderFlag) {
            noFill();
            stroke(this.borderColor);
            strokeWeight(this.borderWidth);
            rect(this.x, this.y, this.width, this.height, this.cornerRadius);
        }

        pop();
    }

    updateTextSize(){
        this.textSize = this.height * 0.9;
    }

    updateWidth(){

    }

    updateHeight(){
        this.updateTextSize();
    }
}