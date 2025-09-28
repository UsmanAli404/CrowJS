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
   */
    constructor(x, y, width, height, {parent=null, type="", id=null} = {}){
        super(x, y, width, height, {parent: parent, type: type, id: id,});
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