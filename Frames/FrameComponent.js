import { Component } from "../Core/Component.js";

export class FrameComponent extends Component{
    /**
   * Creates a base frame component for container elements
   * @param {number} x - The x-coordinate
   * @param {number} y - The y-coordinate
   * @param {number} width - The width
   * @param {number} height - The height
   * @param {Object} options - Configuration options
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
    constructor(x, y, width, height, {parent=null, type="", id=null, margin=0, marginx=null, marginy=null, marginl=null, marginr=null, margint=null, marginb=null} = {}){
        super(x, y, width, height, {parent: parent, type: type, id: id, margin: margin, marginx: marginx, marginy: marginy, marginl: marginl, marginr: marginr, margint: margint, marginb: marginb});
    }

    /**
   * Adjusts the height of child components (abstract method)
   * @abstract
   */
    adjustHeight(){};

    /**
   * Adjusts the width of child components (abstract method)
   * @abstract
   */
    adjustWidth(){};

    /**
   * Shows the frame banner (abstract method)
   * @abstract
   */
    showBanner(){};

    /**
   * Hides the frame banner (abstract method)
   * @abstract
   */
    hideBanner(){};

    /**
   * Updates the position during dragging (abstract method)
   * @abstract
   */
    updatePosition(){};//for dragging
    
    /**
   * Adds a child component (abstract method)
   * @abstract
   */
    add(){};
}