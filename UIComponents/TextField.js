import { Input } from "./Input.js";

export class TextField extends Input{
    /**
   * Creates a text input field with advanced editing features
   * @param {number} x - The x-coordinate
   * @param {number} y - The y-coordinate
   * @param {number} width - The width
   * @param {number} height - The height
   * @param {Object} options - Configuration options
   * @param {string|null} options.id - Component ID
   * @param {Component|null} options.parent - Parent component
   * @param {string} options.backgroundColor - Background color
   * @param {string} options.textColor - Text color
   * @param {boolean} options.borderFlag - Show border
   * @param {p5.Color} options.borderColor - Border color
   * @param {number} options.borderWidth - Border width
   * @param {number} options.cornerRadius - Corner radius
   * @param {boolean} options.enableShadow - Enable shadow
    * @param {string} options.shadowColor - Shadow color (CSS color string)
    * @param {number} options.shadowBlur - Shadow blur radius
    * @param {number} options.shadowOffsetX - Shadow offset on X axis
    * @param {number} options.shadowOffsetY - Shadow offset on Y axis
   * @param {string} options.placeholder - Placeholder text
   * @param {string} options.text - Initial text
   * @param {string} options.textAlign - Text alignment
   * @param {number} options.padding - Internal padding
   */
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
        shadowColor= 'rgba(0,0,0,0.35)',
        shadowBlur= 12,
        shadowOffsetX= 0,
        shadowOffsetY= 4,
        placeholder="",
        text="",
        textAlign = "left",
        padding = 10,
    }={}) {
        super(x, y, width, height, backgroundColor, borderFlag, borderColor,
            borderWidth, cornerRadius, enableShadow, shadowColor, shadowBlur,
            shadowOffsetX, shadowOffsetY, {parent: parent, type: "Input", id: id});
        
            this.cursorPos = 0;
            this.text = text;
            this.textSize = 30;
            this.displayXOffset = 0;

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
            // this.addEventListener("click", (event)=>this.onMouseClick(event));
            this.addEventListener("press", (event)=>this.onMousePress(event)); // NEW
            this.addEventListener("drag", (event)=>this.onMouseDrag(event));
            this.addEventListener("release", (event)=>this.onMouseRelease(event));
            this.addEventListener("hover", (event)=>this.onMouseHover(event));
            this.addEventListener("blur", (event)=>this.onBlur(event));
            // this.addEventListener("focus", (event)=>this.onFocus(event));
    }

    /**
   * Handles mouse hover events
   * @param {MouseEvent} event - The hover event
   */
    onMouseHover(event){
        // event.stopPropagation();
    }

    /**
   * Handles mouse release events
   * @param {MouseEvent} event - The release event
   */
    onMouseRelease(event) {
        this.isSelecting = false;
    }

    // onFocus(event){
    //     console.log("focus called!");
    // }

    onBlur(event){
        this.isSelecting = false;

        // Clear selection
        this.selectionStart = null;
        this.selectionEnd = null;

        // Cursor usually hides after blur in textfields
        this.cursorVisible = false;

        console.log("blur called!");

        event.stopPropagation();
    }

    onMousePress(event) {
        if (!this.isFocused) {
            this.focus();
        }

        this.isSelecting = true;

        // Clamp X for initial cursor position
        let x = event.x;
        if (x <= this.x - 1000) x = this.x - 1000;
        if (x >= this.x + this.width + 1000) x = this.x + this.width + 1000;

        // Convert X → character index
        let idx = this.getCursorIndexFromX(x);

        // Set selection start and cursor immediately (start selecting instantly)
        this.selectionStart = idx;
        this.selectionEnd = idx;
        this.cursorPos = idx;

        // Ensure cursor visible & auto scroll
        this.scrollCursorIntoView();
        this.cursorVisible = true;
        this.lastCursorToggle = millis();

        event.stopPropagation();
    }

    onMouseDrag(event) {
        if (this.isSelecting && this.isFocused) {

            let x = event.x;
            if (x <= this.x - 1000) x = this.x - 1000;
            if (x >= this.x + this.width + 1000) x = this.x + this.width + 1000;

            let pos = this.getCursorIndexFromX(x);

            this.selectionEnd = pos;
            this.cursorPos = pos;

            this.scrollCursorIntoView();
            this.cursorVisible = true;
            this.lastCursorToggle = millis();

            event.stopPropagation();
        }
    }

    onKeyPress(event) {
        // ADDED: if there's an active selection and user types or presses backspace/delete,
        // we should remove the selection first (so typed char replaces selection)
        const hasSelection = this.selectionStart !== null && this.selectionStart !== this.selectionEnd;

        if (keyCode === LEFT_ARROW) {
            if (keyIsDown(CONTROL)) {
                this.jumpLeftByOneWord();
            } else {
                this.moveCursorLeft(1);
            }
            // collapse selection when using arrows (typical behavior)
            this.selectionStart = this.selectionEnd = this.cursorPos;
        } else if (keyCode === RIGHT_ARROW) {
            if (keyIsDown(CONTROL)) {
                this.jumpRightByOneWord();
            } else {
                this.moveCursorRight(1);
            }
            this.selectionStart = this.selectionEnd = this.cursorPos;
        } else if (keyCode === BACKSPACE) {
            if (hasSelection) {
                // ADDED: delete selection (Backspace with selection deletes selection)
                this.deleteSelectedText();
            } else if (keyIsDown(CONTROL)) {
                this.deleteOneWord();
            } else {
                this.deleteOneChar();
            }
            // collapse selection after deletion
            this.selectionStart = this.selectionEnd = this.cursorPos;
        } else if (key.length === 1) {
            // ADDED: if a selection exists, remove it before insertion so typed char replaces selection
            if (hasSelection) {
                this.deleteSelectedText();
            }
            // Insert the character at cursor
            this.text = this.text.slice(0, this.cursorPos) + key + this.text.slice(this.cursorPos);
            this.moveCursorRight(1);
            // collapse selection after insertion
            this.selectionStart = this.selectionEnd = this.cursorPos;
        }

        this.cursorVisible = true;
        this.lastCursorToggle = millis();
    }


    /**
     * Compute the X coordinate where the rendered text starts (accounts for alignment & displayXOffset)
     * ADDED helper -- use this from click/drag/any cursor-from-x routines.
     */
    computeTextStartX() {
        // ADDED: measure full text width once
        push();
        textSize(this.textSize);
        let fullWidth = textWidth(this.text || ""); // safe for empty string
        pop();

        if (this.textAlign === "left") {
            // left aligned starts at left padding, minus the scroll offset
            return this.x + this.padding - this.displayXOffset;
        } else if (this.textAlign === "right") {
            // right aligned: text ends at width - padding, so start is that minus fullWidth
            return this.x + this.width - this.padding - fullWidth - this.displayXOffset;
        } else { // center or anything else
            return this.x + this.width / 2 - fullWidth / 2 - this.displayXOffset;
        }
    }

    /**
     * Convert absolute click X into cursor index (0..text.length).
     * ADDED helper - replaces duplicated click/drag loop logic.
     */
    getCursorIndexFromX(clickX) {
        // Compute text start and relative click
        let textStartX = this.computeTextStartX(); // ADDED use centralized function
        let relativeX = clickX - textStartX;

        // Early out: before start
        if (relativeX <= 0) return 0;

        // Measure and walk characters
        push();
        textSize(this.textSize);
        let cumulativeWidth = 0;
        let pos = 0;
        const len = this.text.length;
        for (let i = 0; i < len; i++) { // ADDED: loop < len (avoid charAt(len))
            let ch = this.text.charAt(i);
            let nextWidth = textWidth(ch);
            // Midpoint rule: place cursor before the character if closer to left half
            if (relativeX < cumulativeWidth + nextWidth / 2) {
                pos = i;
                pop();
                return pos;
            }
            cumulativeWidth += nextWidth;
            pos = i + 1; // cursor after this char
        }
        pop();

        // If we got here, click is after all characters -> cursor at end
        return len;
    }


    deleteSelectedText(){
        if (this.selectionStart !== null && this.selectionStart !== this.selectionEnd) {
            let start = min(this.selectionStart, this.selectionEnd);
            let end = max(this.selectionStart, this.selectionEnd);

            this.text = this.text.slice(0, start) + this.text.slice(end);
            this.cursorPos = start;

            // ADDED: clear selection anchors and ensure they reflect cursor
            this.selectionStart = this.selectionEnd = null;
        }
    }

    /**
   * Moves cursor left by one word (Ctrl+Left arrow)
   */
    jumpLeftByOneWord(){
        if (this.cursorPos > 0) {
            let i = this.cursorPos - 1;
            while (i > 0 && this.text[i] === ' ') i--;
            while (i > 0 && this.text[i - 1] !== ' ') i--;
            this.cursorPos = i;

            this.scrollCursorIntoViewLeft();
        }
    }

    /**
   * Moves cursor right by one word (Ctrl+Right arrow)
   */
    jumpRightByOneWord(){
        if (this.cursorPos < this.text.length) {
            let i = this.cursorPos;
            while (i < this.text.length && this.text[i] !== ' ') i++;
            while (i < this.text.length && this.text[i] === ' ') i++;
            this.cursorPos = i;

            this.scrollCursorIntoViewRight();
        }
    }

    /**
   * Deletes one word to the left (Ctrl+Backspace)
   */
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
    
    /**
   * Deletes one character to the left (Backspace)
   */
    deleteOneChar(){
        if (this.cursorPos > 0) {
            this.text = this.text.slice(0, this.cursorPos - 1) + this.text.slice(this.cursorPos);
            this.moveCursorLeft(1);
        }
    }

     /**
   * Calculates the width of text between two positions
   * @param {number} startPos - Starting character position
   * @param {number} endPos - Ending character position
   * @returns {number} The width in pixels
   */
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

    /**
   * Calculates the width of given text
   * @param {string} text - The text to measure
   * @returns {number} The width in pixels
   */
    findTextWidthOfGivenText(text){
        push();
        textSize(this.textSize);
        let txtWidth = textWidth(text);
        pop();
        return txtWidth;
    }

    /**
   * Moves cursor right by specified number of characters
   * @param {number} increment - Number of characters to move
   */
    moveCursorRight(increment){
        if (this.cursorPos < this.text.length) {
            this.cursorPos += increment;
        }

        this.scrollCursorIntoViewRight();
    }    

    /**
   * Moves cursor left by specified number of characters
   * @param {number} decrement - Number of characters to move
   */
    moveCursorLeft(decrement){
        if(this.cursorPos > 0){
            this.cursorPos -= decrement;
        }

        this.scrollCursorIntoViewLeft();
    }

    /**
   * Ensures cursor remains visible when moving right
   * @param {Object} options - Scroll options
   * @param {number|null} options.cursorX - Optional cursor X position
   */
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

    /**
   * Ensures cursor remains visible when moving left
   * @param {Object} options - Scroll options
   * @param {number|null} options.cursorX - Optional cursor X position
   */
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

    /**
   * Ensures cursor remains within visible area
   */
    scrollCursorIntoView(){
        let cursorX = this.findTextWidth(0, this.cursorPos);
        this.scrollCursorIntoViewRight(cursorX);
        this.scrollCursorIntoViewLeft(cursorX);
        this.displayXOffset = max(0, this.displayXOffset);
    }

    /**
   * Converts text alignment string to P5 constant
   * @returns {number} P5 alignment constant
   */
    getTextAlignment(){
        if(this.textAlign==="right"){
            return RIGHT;
        } else {
            return LEFT;
        }
    }

    /**
   * Renders the text field with text, cursor, and selection
   */
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

    /**
   * Updates text size based on current height
   */
    updateTextSize(){
        this.textSize = this.height * 0.9;
        this.scrollCursorIntoView();
    }

    /**
   * Handles width changes
   */
    updateWidth(){
        //don't do anything here!
    }

    /**
   * Handles height changes and updates text size
   */
    updateHeight(){
        this.updateTextSize();
    }
}