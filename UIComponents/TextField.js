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
   * @param {string} options.placeholderColor - Placeholder text color (muted)
   * @param {string} options.text - Initial text
   * @param {string} options.textAlign - Text alignment
   * @param {number} options.pad - Internal padding
   * @param {number} options.margin - General margin for all sides
   * @param {number} options.marginx - Horizontal margin (left and right)
   * @param {number} options.marginy - Vertical margin (top and bottom)
   * @param {number} options.marginl - Left margin
   * @param {number} options.marginr - Right margin
   * @param {number} options.margint - Top margin
   * @param {number} options.marginb - Bottom margin
   */
    constructor(x, y, width, height, 
    {
        id=null,
        parent=null,
        backgroundColor='rgb(30, 30, 46)',
        textColor='rgb(224, 224, 224)',
        borderFlag = true,
        borderColor = color('#3a3a4d'),
        borderWidth = 1, 
        cornerRadius = 8,
        enableShadow=false,
        shadowColor= 'rgba(0,0,0,0.5)',
        shadowBlur= 12,
        shadowOffsetX= 0,
        shadowOffsetY= 4,
        placeholder="",
        placeholderColor='rgb(120, 120, 140)',
        text="",
        textAlign = "left",
        pad = 10,
        margin = 0,
        marginx = null,
        marginy = null,
        marginl = null,
        marginr = null,
        margint = null,
        marginb = null,
        minWidth = 0,
        minHeight = 0,
        showDebugOverlay = false,
    }={}) {
        super(x, y, width, height, backgroundColor, borderFlag, borderColor,
            borderWidth, cornerRadius, enableShadow, shadowColor, shadowBlur,
            shadowOffsetX, shadowOffsetY, {parent: parent, type: "Input", id: id, margin: margin, marginx: marginx, marginy: marginy, marginl: marginl, marginr: marginr, margint: margint, marginb: marginb, minWidth: minWidth, minHeight: minHeight, showDebugOverlay: showDebugOverlay});
        
            this.cursorPos = 0;
            this.text = text;
            this.textSize = 30;
            this.displayXOffset = 0;

            this.textAlign = textAlign;
            this.pad = pad;
            this.padl = pad;
            this.padr = pad;
            this.padt = pad;
            this.padb = pad;
            this.textColor = textColor;
            this.placeholder = placeholder;
            this.placeholderColor = placeholderColor;

            this.cursorVisible = true;
            this.lastCursorToggle = 0;
            this.cursorBlinkInterval = 500;

            this.selectionStart = null;
            this.selectionEnd = null;
            this.isSelecting = false;

            // Key repeat state for long-press behavior
            this._lastKeyCode = null;
            this._keyDownStartTime = 0;
            this._lastRepeatTime = 0;
            this._keyRepeatDelay = 500;  // ms before repeat starts
            this._keyRepeatInterval = 30; // ms between repeats

            this.addEventListener("keyPress", (event)=>this.onKeyPress(event));
            this.addEventListener("keyDown", (event)=>this.onKeyDown(event));
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
        cursor('text');
        event.stopPropagation();
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

        // Reset key repeat state
        this._lastKeyCode = null;

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

    /**
     * Handles continuous key down for key repeat (long-press arrow keys, backspace, etc.)
     * Called from draw loop while key is held.
     */
    onKeyDown(event) {
        const now = millis();
        const repeatableKeys = [LEFT_ARROW, RIGHT_ARROW, BACKSPACE];

        if (!repeatableKeys.includes(keyCode)) {
            return;
        }

        // Detect new key press
        if (this._lastKeyCode !== keyCode) {
            this._lastKeyCode = keyCode;
            this._keyDownStartTime = now;
            this._lastRepeatTime = 0;
            return; // first press handled by onKeyPress
        }

        // Wait for initial delay before repeating
        if (now - this._keyDownStartTime < this._keyRepeatDelay) {
            return;
        }

        // Throttle repeats
        if (now - this._lastRepeatTime < this._keyRepeatInterval) {
            return;
        }

        this._lastRepeatTime = now;
        this._handleRepeatable();
    }

    /**
     * Executes the repeatable key action (shared by onKeyPress and onKeyDown repeat).
     */
    _handleRepeatable() {
        const hasSelection = this.selectionStart !== null && this.selectionStart !== this.selectionEnd;

        if (keyCode === LEFT_ARROW) {
            if (keyIsDown(SHIFT) && (this.selectionStart === null || this.selectionStart === this.selectionEnd)) {
                this.selectionStart = this.cursorPos;
                this.selectionEnd = this.cursorPos;
            }

            if (keyIsDown(CONTROL)) {
                this.jumpLeftByOneWord();
            } else {
                this.moveCursorLeft(1);
            }

            if (keyIsDown(SHIFT)) {
                this.selectionEnd = this.cursorPos;
            } else {
                this.selectionStart = this.selectionEnd = this.cursorPos;
            }
        } else if (keyCode === RIGHT_ARROW) {
            if (keyIsDown(SHIFT) && (this.selectionStart === null || this.selectionStart === this.selectionEnd)) {
                this.selectionStart = this.cursorPos;
                this.selectionEnd = this.cursorPos;
            }

            if (keyIsDown(CONTROL)) {
                this.jumpRightByOneWord();
            } else {
                this.moveCursorRight(1);
            }

            if (keyIsDown(SHIFT)) {
                this.selectionEnd = this.cursorPos;
            } else {
                this.selectionStart = this.selectionEnd = this.cursorPos;
            }
        } else if (keyCode === BACKSPACE) {
            if (hasSelection) {
                this.deleteSelectedText();
            } else if (keyIsDown(CONTROL)) {
                this.deleteOneWord();
            } else {
                this.deleteOneChar();
            }
            this.selectionStart = this.selectionEnd = this.cursorPos;
        }

        this.cursorVisible = true;
        this.lastCursorToggle = millis();
    }

    onKeyPress(event) {
        // Reset key repeat tracking on new press
        this._lastKeyCode = keyCode;
        this._keyDownStartTime = millis();
        this._lastRepeatTime = 0;

        // ADDED: if there's an active selection and user types or presses backspace/delete,
        // we should remove the selection first (so typed char replaces selection)
        const hasSelection = this.selectionStart !== null && this.selectionStart !== this.selectionEnd;

        if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW || keyCode === BACKSPACE) {
            this._handleRepeatable();
            return; // cursor/selection already updated, skip to end
        } else if (keyIsDown(CONTROL) && (key === 'a' || key === 'A')) {
            // Select all text in the field
            this.selectionStart = 0;
            this.selectionEnd = this.text.length;
            this.cursorPos = this.text.length;
            // Prevent the browser from selecting all page content
            if (event.nativeEvent) {
                event.nativeEvent.preventDefault();
            }
        } else if (key.length === 1) {
            // Skip if Ctrl is held (avoid inserting control characters)
            if (keyIsDown(CONTROL)) {
                return;
            }
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
            return this.x + this.pad - this.displayXOffset;
        } else if (this.textAlign === "right") {
            // right aligned: text ends at width - padding, so start is that minus fullWidth
            return this.x + this.width - this.pad - fullWidth - this.displayXOffset;
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

            // Reset scroll offset and ensure cursor is visible
            this.displayXOffset = 0;
            this.scrollCursorIntoView();
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
    
        if (cursorX - this.displayXOffset > this.width - this.pad) {
            this.displayXOffset = cursorX - this.width + 2*this.pad;
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
    
        if(cursorX - this.displayXOffset < this.pad){
            this.displayXOffset = cursorX - this.pad;
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
            x = this.x - this.displayXOffset + this.pad;
        } else if(this.textAlign==="right") {
            x = this.x - this.displayXOffset + this.width - this.textSize;
        }
        y = this.y + this.height/2 + this.height*0.01;

        if (this.selectionStart !== null && this.selectionEnd !== null && this.selectionStart !== this.selectionEnd) {
            let start = min(this.selectionStart, this.selectionEnd);
            let end = max(this.selectionStart, this.selectionEnd);
            
            let highlightX = x + this.findTextWidth(0, start);
            let highlightWidth = this.findTextWidth(start, end);
            
            push();
            fill('rgba(15, 111, 206, 0.7)');
            noStroke();
            rect(highlightX, this.y + this.pad, highlightWidth, this.height - 2 * this.pad);
            pop();
        }

        if (this.text.length === 0 && this.placeholder && !this.isFocused) {
            push();
            fill(this.placeholderColor);
            noStroke();
            text(this.placeholder, x, y);
            pop();
        } else {
            text(this.text, x, y);
        }

        if (millis() - this.lastCursorToggle > this.cursorBlinkInterval) {
            this.cursorVisible = !this.cursorVisible;
            this.lastCursorToggle = millis();
        }

        if(this.isFocused){
            let cursorX = x + this.findTextWidth(0, this.cursorPos);
            if (this.cursorVisible) {
                stroke(this.textColor);
                strokeWeight(2);
                line(cursorX, this.y + this.pad, cursorX, this.y + this.height - this.pad);
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
        this.textSize = (this.height - 2 * this.pad) * 0.9;
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