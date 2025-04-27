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
        padding = 10,
    }={}) {
        super(x, y, width, height, backgroundColor, borderFlag, borderColor,
            borderWidth, cornerRadius, enableShadow, shadowColor, shadowIntensity,
            shadowSpread, shadowDetail, {parent: parent, type: "Input", id: id});
        
            this.cursorPos = 0;
            this.text = text;
            this.textSize = 30;
            this.displayXOffset = 0;
            this.leftCount = 0;
            this.prevWidth = 0;

            this.textAlign = textAlign;
            this.padding = padding;
            this.textColor = textColor;
            this.placeholder = placeholder;

            this.cursorVisible = true;
            this.lastCursorToggle = millis();
            this.cursorBlinkInterval = 500;

            this.selectionStart = null;
            this.selectionEnd = null;
            this.isSelecting = false;

            this.addEventListener("keyPress", (event)=>this.onKeyPress(event));
            this.addEventListener("click", (event)=>this.onMouseClick(event));
            this.addEventListener("drag", (event)=>this.onMouseDrag(event));
            this.addEventListener("release", (event)=>this.onMouseRelease(event));
            this.addEventListener("hover", (event)=>this.onMouseHover(event));
    }

    onMouseHover(event){
        // event.stopPropagation();
    }

    onMouseRelease(event){
        this.isSelecting = false;
    }

    onMouseDrag(event){
        if (this.isSelecting && this.isFocused) {
            let textStartX = this.textAlign === "left"
                ? this.x + this.padding - this.displayXOffset
                : this.x + this.width - this.textSize - this.displayXOffset;
    
            let relativeX = event.x - textStartX;
    
            textSize(this.textSize);
            let cumulativeWidth = 0;
            let pos = 0;
    
            for (let i = 0; i <= this.text.length; i++) {
                let nextWidth = textWidth(this.text.charAt(i));
                if (relativeX < cumulativeWidth + nextWidth / 2) {
                    pos = i;
                    break;
                }
                cumulativeWidth += nextWidth;
                pos = i;
            }
    
            this.cursorPos = pos;
            this.selectionEnd = pos;
            this.scrollCursorIntoView();
        }

        event.stopPropagation();
    }

    onKeyPress(event) {
        if (keyCode === LEFT_ARROW) {
            if(keyIsDown(CONTROL)){
                this.jumpLeftByOneWord();
            } else {
                this.moveCursorLeft(1);
            }
        } else if (keyCode === RIGHT_ARROW) {
            if(keyIsDown(CONTROL)){
                this.jumpRightByOneWord();
            } else {
                this.moveCursorRight(1);
            }
        } else if (keyCode === BACKSPACE) {
            if (keyIsDown(CONTROL)) {
                this.deleteOneWord();
            } else {
                this.deleteOneChar();
            }
        } else if (key.length === 1) {
            this.text = this.text.slice(0, this.cursorPos) + key + this.text.slice(this.cursorPos);
            this.moveCursorRight(1);
        }
    
        this.cursorVisible = true;
        this.lastCursorToggle = millis();
    }

    deleteSelectedText(){
        if (this.selectionStart !== null && this.selectionStart !== this.selectionEnd) {
            let start = min(this.selectionStart, this.selectionEnd);
            let end = max(this.selectionStart, this.selectionEnd);
        
            this.text = this.text.slice(0, start) + this.text.slice(end);
            this.cursorPos = start;
        
            this.selectionStart = this.selectionEnd = null;
        }
    }

    onMouseClick(event) {
        this.selectionStart = this.cursorPos;
        this.selectionEnd = this.cursorPos;
        this.isSelecting = true;

        if (event.x >= this.x && event.x <= this.x + this.width &&
            event.y >= this.y && event.y <= this.y + this.height) {
    
            let textStartX;
            if (this.textAlign === "left") {
                textStartX = this.x + this.padding - this.displayXOffset;
            } else if (this.textAlign === "right") {
                textStartX = this.x + this.width - this.textSize - this.displayXOffset;
            }
    
            let clickX = event.x;
            let relativeX = clickX - textStartX;
    
            textSize(this.textSize);
            let cumulativeWidth = 0;
    
            this.cursorPos = 0;

            for (let i = 0; i <= this.text.length; i++) {
                let nextWidth = textWidth(this.text.charAt(i));
                if (relativeX < cumulativeWidth + nextWidth / 2) {
                    this.cursorPos = i;
                    break;
                }
                cumulativeWidth += nextWidth;
                this.cursorPos = i;
            }

            this.scrollCursorIntoView()

            this.cursorVisible = true;
            this.lastCursorToggle = millis();
        }
    }

    jumpLeftByOneWord(){
        if (this.cursorPos > 0) {
            let i = this.cursorPos - 1;
            while (i > 0 && this.text[i] === ' ') i--;
            while (i > 0 && this.text[i - 1] !== ' ') i--;
            this.cursorPos = i;

            this.scrollCursorIntoViewLeft();
        }
    }

    jumpRightByOneWord(){
        if (this.cursorPos < this.text.length) {
            let i = this.cursorPos;
            while (i < this.text.length && this.text[i] !== ' ') i++;
            while (i < this.text.length && this.text[i] === ' ') i++;
            this.cursorPos = i;

            this.scrollCursorIntoViewRight();
        }
    }

    deleteOneWord(){
        if (this.cursorPos > 0) {
            let i = this.cursorPos - 1;

            while (i > 0 && this.text[i] === ' ') {
                i--;
            }

            while (i > 0 && this.text[i - 1] !== ' ') {
                i--;
            }

            this.text = this.text.slice(0, i) + this.text.slice(this.cursorPos);
            this.cursorPos = i;

            this.scrollCursorIntoViewLeft();
        }
    }
    
    deleteOneChar(){
        if (this.cursorPos > 0) {
            this.text = this.text.slice(0, this.cursorPos - 1) + this.text.slice(this.cursorPos);
            this.moveCursorLeft(1);
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
        if (this.cursorPos < this.text.length) {
            this.cursorPos += increment;
        }

        this.scrollCursorIntoViewRight();
    }    

    moveCursorLeft(decrement){
        if(this.cursorPos > 0){
            this.cursorPos -= decrement;
        }

        this.scrollCursorIntoViewLeft();
    }

    scrollCursorIntoViewRight({cursorX=null} = {}){
        if(!cursorX){
            cursorX = this.findTextWidth(0, this.cursorPos);
        }
    
        if (cursorX - this.displayXOffset > this.width - this.padding) {
            this.displayXOffset = cursorX - this.width + 2*this.padding;
        }
    
        if(!cursorX){
            this.displayXOffset = max(0, this.displayXOffset);
        }
    }

    scrollCursorIntoViewLeft({cursorX=null} = {}){
        if(!cursorX){
            cursorX = this.findTextWidth(0, this.cursorPos);
        }
    
        if(cursorX - this.displayXOffset < this.padding){
            this.displayXOffset = cursorX - this.padding;
        }
    
        if(!cursorX){
            this.displayXOffset = max(0, this.displayXOffset);
        }
    }

    scrollCursorIntoView(){
        let cursorX = this.findTextWidth(0, this.cursorPos);
        this.scrollCursorIntoViewRight(cursorX);
        this.scrollCursorIntoViewLeft(cursorX);
        this.displayXOffset = max(0, this.displayXOffset);
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

        push();
        fill(this.backgroundColor);
        rect(this.x, this.y, this.width, this.height, this.cornerRadius);
        pop();

        fill(this.textColor);
        textAlign(this.getTextAlignment(), CENTER);
        textSize(this.textSize);
        
        let x, y;
        if(this.textAlign==="left"){
            x = this.x - this.displayXOffset + this.padding;
        } else if(this.textAlign==="right") {
            x = this.x - this.displayXOffset + this.width - this.textSize;
        }
        y = this.y + this.height/2 + this.height*0.01;

        if (this.selectionStart !== null && this.selectionEnd !== null && this.selectionStart !== this.selectionEnd) {
            let start = min(this.selectionStart, this.selectionEnd);
            let end = max(this.selectionStart, this.selectionEnd);
            
            let highlightX = x + this.findTextWidth(0, start);
            let highlightWidth = this.findTextWidth(start, end);
            let highlightY = y - this.textSize * 0.7;
            
            push();
            fill('rgba(15, 111, 206, 0.7)');
            noStroke();
            rect(highlightX, highlightY, highlightWidth, this.textSize);
            pop();
        }

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
                line(cursorX, y - this.textSize * 0.5, cursorX, y + this.textSize * 0.45);
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
        this.scrollCursorIntoView();
    }

    updateWidth(){
        //don't do anything here!
    }

    updateHeight(){
        this.updateTextSize();
    }
}