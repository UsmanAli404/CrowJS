import { UIComponent } from './UIComponent.js';
import { Component } from '../Core/Component.js';
import { GUIEvent } from '../Core/GUIEvent/GUIEvent.js';

export class Slider extends UIComponent {
  /**
   * Creates a slider component for selecting values within a range
   * @param {number} x - The x-coordinate
   * @param {number} y - The y-coordinate
   * @param {number} width - The width
   * @param {number} height - The height
   * @param {Object} options - Configuration options
   * @param {string|null} options.id - Component ID
   * @param {Component|null} options.parent - Parent component
   * @param {number} options.minValue - Minimum slider value
   * @param {number} options.maxValue - Maximum slider value
   * @param {number} options.currentValue - Initial slider value
   * @param {number} options.step - Step increment for value changes
   * @param {p5.Color} options.backgroundColor - Background color of the component
   * @param {p5.Color} options.trackColor - Color of the slider track
   * @param {p5.Color} options.trackFillColor - Color of the filled portion of the track
   * @param {p5.Color} options.handleColor - Color of the slider handle/thumb
   * @param {p5.Color} options.handleHoverColor - Handle color on hover
   * @param {p5.Color} options.handleDragColor - Handle color while dragging
   * @param {number} options.trackHeight - Height of the track in pixels
   * @param {number} options.handleRadius - Radius of the slider handle in pixels
   * @param {boolean} options.borderFlag - Whether to show component border
   * @param {p5.Color} options.borderColor - Component border color
   * @param {number} options.borderWidth - Component border width
   * @param {number} options.cornerRadius - Component corner radius
   * @param {boolean} options.enableShadow - Enable shadow rendering
   * @param {string} options.shadowColor - Shadow color (CSS color string)
   * @param {number} options.shadowBlur - Shadow blur radius
   * @param {number} options.shadowOffsetX - Shadow offset on X axis
   * @param {number} options.shadowOffsetY - Shadow offset on Y axis
   * @param {boolean} options.enabled - Whether the slider is interactive
   * @param {boolean} options.showValue - Whether to display the current value
   * @param {p5.Color} options.valueTextColor - Color of the value text
   * @param {number} options.valueTextSize - Size of the value text
   * @param {number} options.margin - General margin for all sides
   * @param {number} options.marginx - Horizontal margin (left and right)
   * @param {number} options.marginy - Vertical margin (top and bottom)
   * @param {number} options.marginl - Left margin
   * @param {number} options.marginr - Right margin
   * @param {number} options.margint - Top margin
   * @param {number} options.marginb - Bottom margin
   */
  constructor(x, y, width, height, {
    id = null,
    parent = null,
    minValue = 0,
    maxValue = 100,
    currentValue = 50,
    step = 1,
    backgroundColor = color('#1e1e2e'),
    trackColor = color('#2a2a3d'),
    trackFillColor = color('#4a9eff'),
    handleColor = color('#4a9eff'),
    handleHoverColor = color('#5aafff'),
    handleDragColor = color('#3a8fff'),
    trackHeight = 6,
    handleRadius = 10,
    borderFlag = true,
    borderColor = color('#3a3a4d'),
    borderWidth = 1,
    cornerRadius = 8,
    enableShadow = false,
    shadowColor = 'rgba(0,0,0,0.5)',
    shadowBlur = 12,
    shadowOffsetX = 0,
    shadowOffsetY = 4,
    enabled = true,
    showValue = true,
    valueTextColor = color('#e0e0e0'),
    valueTextSize = 14,
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
  } = {}) {
    super(x, y, width, height, backgroundColor, borderFlag, borderColor,
      borderWidth, cornerRadius, enableShadow, shadowColor, shadowBlur,
      shadowOffsetX, shadowOffsetY, {
        parent: parent, type: "Slider", id: id, margin: margin, marginx: marginx,
        marginy: marginy, marginl: marginl, marginr: marginr, margint: margint,
        marginb: marginb, minWidth: minWidth, minHeight: minHeight, showDebugOverlay: showDebugOverlay
      });

    this.minValue = minValue;
    this.maxValue = maxValue;
    this.currentValue = constrain(currentValue, minValue, maxValue);
    this.step = step;

    this.trackColor = trackColor;
    this.trackFillColor = trackFillColor;
    this.handleColor = handleColor;
    this.handleHoverColor = handleHoverColor;
    this.handleDragColor = handleDragColor;
    this.trackHeight = trackHeight;
    this.handleRadius = handleRadius;

    this.enabled = enabled;
    this.isDragging = false;
    this.isHovering = false;

    this.showValue = showValue;
    this.valueTextColor = valueTextColor;
    this.valueTextSize = valueTextSize;

    // Event listeners
    this.addEventListener("press", (event) => this.onMousePress(event));
    this.addEventListener("drag", (event) => this.onMouseDrag(event));
    this.addEventListener("release", (event) => this.onMouseRelease(event));
    this.addEventListener("hover", (event) => this.onMouseHover(event));
    this.addEventListener("blur", (event) => this.onBlur(event));
  }

  /**
   * Handles mouse press event
   * @param {MouseEvent} event - The press event
   */
  onMousePress(event) {
    if (!this.enabled) return;
    this.isDragging = true;
    this.updateValueFromMouse(event.x, event.y);
    event.stopPropagation();
  }

  /**
   * Handles mouse drag event
   * @param {MouseEvent} event - The drag event
   */
  onMouseDrag(event) {
    if (!this.enabled || !this.isDragging) return;
    this.updateValueFromMouse(event.x, event.y);
    event.stopPropagation();
  }

  /**
   * Handles mouse release event
   * @param {MouseEvent} event - The release event
   */
  onMouseRelease(event) {
    this.isDragging = false;
    event.stopPropagation();
  }

  /**
   * Handles mouse hover event
   * @param {MouseEvent} event - The hover event
   */
  onMouseHover(event) {
    if (!this.enabled) return;
    this.isHovering = true;
    event.stopPropagation();
  }

  /**
   * Handles blur event
   * @param {GUIEvent} event - The blur event
   */
  onBlur(event) {
    this.isDragging = false;
    this.isHovering = false;
    event.stopPropagation();
  }

  /**
   * Updates the slider value based on mouse position
   * @param {number} mouseX - Mouse X coordinate
   * @param {number} mouseY - Mouse Y coordinate
   */
  updateValueFromMouse(mouseX, mouseY) {
    // Calculate the padding for the handle
    const padding = this.handleRadius;
    const trackStartX = this.x + padding;
    const trackEndX = this.x + this.width - padding;

    // Constrain mouse X to track bounds
    const constrainedX = constrain(mouseX, trackStartX, trackEndX);

    // Calculate normalized position (0 to 1)
    const trackWidth = trackEndX - trackStartX;
    const normalizedPos = trackWidth > 0 ? (constrainedX - trackStartX) / trackWidth : 0;

    // Calculate raw value
    const rawValue = this.minValue + normalizedPos * (this.maxValue - this.minValue);

    // Apply step
    if (this.step > 0) {
      this.currentValue = Math.round(rawValue / this.step) * this.step;
    } else {
      this.currentValue = rawValue;
    }

    // Constrain final value
    this.currentValue = constrain(this.currentValue, this.minValue, this.maxValue);

    // Dispatch change event
    this.dispatchEventOnlyOnSelf(new GUIEvent(0, 0, "valueChange", this));
  }

  /**
   * Gets the current slider value
   * @returns {number} The current value
   */
  getValue() {
    return this.currentValue;
  }

  /**
   * Sets the slider value
   * @param {number} value - The new value
   */
  setValue(value) {
    this.currentValue = constrain(value, this.minValue, this.maxValue);
  }

  /**
   * Sets the minimum value
   * @param {number} minValue - The new minimum value
   */
  setMinValue(minValue) {
    this.minValue = minValue;
    if (this.currentValue < this.minValue) {
      this.currentValue = this.minValue;
    }
  }

  /**
   * Sets the maximum value
   * @param {number} maxValue - The new maximum value
   */
  setMaxValue(maxValue) {
    this.maxValue = maxValue;
    if (this.currentValue > this.maxValue) {
      this.currentValue = this.maxValue;
    }
  }

  /**
   * Updates the component's width (required by UIComponent)
   * Ensures minimum width for proper slider interaction
   */
  updateWidth() {
    // Slider needs minimum width to be usable (at least the handle diameter)
    const minimumWidth = this.handleRadius * 4;
    if (this.width < minimumWidth) {
      this.width = minimumWidth;
    }
  }

  /**
   * Updates the component's height (required by UIComponent)
   * Calculates height based on track, handle, and value text
   */
  updateHeight() {
    // Calculate required height for all components
    let requiredHeight = this.handleRadius * 2; // Handle diameter
    
    if (this.showValue) {
      // Add space for value text below the track
      requiredHeight += this.valueTextSize + 20; // text size + padding
    }
    
    // Ensure minimum height
    requiredHeight = Math.max(requiredHeight, this.handleRadius * 2 + this.trackHeight);
    
    // Update height if current is too small
    if (this.height < requiredHeight) {
      this.height = requiredHeight;
    }
  }

  /**
   * Renders the slider component
   */
  show() {
    if (this.enableShadow) {
      this.drawShadow();
    }

    push();
    beginClip();
    rect(this.x, this.y, this.width, this.height, this.cornerRadius);
    endClip();
    translate(this.x, this.y);

    // Draw background if enabled
    if (this.borderFlag || this.backgroundColor) {
      fill(this.backgroundColor);
      if (this.borderFlag) {
        stroke(this.borderColor);
        strokeWeight(this.borderWidth);
      } else {
        noStroke();
      }
      rect(0, 0, this.width, this.height, this.cornerRadius);
    }

    // Calculate track position
    const padding = this.handleRadius;
    const trackStartX = padding;
    const trackEndX = this.width - padding;
    const trackCenterY = this.height / 2;

    // Draw track background
    noStroke();
    fill(this.trackColor);
    const trackY = trackCenterY - this.trackHeight / 2;
    rect(trackStartX, trackY, trackEndX - trackStartX, this.trackHeight, this.trackHeight / 2);

    // Calculate handle position
    const range = this.maxValue - this.minValue;
    const normalizedValue = range > 0 ? (this.currentValue - this.minValue) / range : 0;
    const handleX = trackStartX + normalizedValue * (trackEndX - trackStartX);

    // Draw filled track
    fill(this.trackFillColor);
    rect(trackStartX, trackY, handleX - trackStartX, this.trackHeight, this.trackHeight / 2);

    // Draw handle
    noStroke();
    if (this.isDragging) {
      fill(this.handleDragColor);
    } else if (this.isHovering) {
      fill(this.handleHoverColor);
    } else {
      fill(this.handleColor);
    }
    circle(handleX, trackCenterY, this.handleRadius * 2);

    // Draw value text if enabled
    if (this.showValue) {
      fill(this.valueTextColor);
      textSize(this.valueTextSize);
      textAlign(CENTER, TOP);
      const displayValue = this.step > 0 ? 
        this.currentValue.toFixed(Math.max(0, -Math.log10(this.step))) :
        this.currentValue.toFixed(2);
      text(displayValue, this.width / 2, this.trackHeight + 15);
    }

    pop();
  }
}
