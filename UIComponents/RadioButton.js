import { TextComponent } from './TextComponent.js';
import { Component } from '../Core/Component.js';

/**
 * Static registry of radio button groups.
 * Maps group name → Set of RadioButton instances.
 * @type {Map<string, Set<RadioButton>>}
 */
const _radioGroups = new Map();

export class RadioButton extends TextComponent {
  /**
   * Creates a radio button component with group-exclusive selection and label text.
   * Only one radio button per `group` can be selected at a time.
   *
   * @param {number} x - The x-coordinate
   * @param {number} y - The y-coordinate
   * @param {number} width - The width
   * @param {number} height - The height
   * @param {string} label - The text to display next to the radio button
   * @param {Object} options - Configuration options
   * @param {string|null} options.id - Component ID
   * @param {Component|null} options.parent - Parent component
   * @param {string} options.group - The group name this radio button belongs to
   * @param {boolean} options.selected - Initial selected state
   * @param {string|*} options.value - The value this radio button represents
   * @param {p5.Color} options.backgroundColor - Background color
   * @param {p5.Color} options.textColor - Text color
   * @param {p5.Color} options.circleColor - Outer circle background color (unselected)
   * @param {p5.Color} options.circleBorderColor - Outer circle border color
   * @param {number} options.circleBorderWidth - Outer circle border width
   * @param {p5.Color} options.selectedColor - Inner dot color when selected
   * @param {p5.Color} options.selectedCircleBorderColor - Outer circle border color when selected
   * @param {number} options.circleSize - Diameter of the outer circle in pixels
   * @param {number} options.dotSize - Diameter of the inner dot in pixels
   * @param {number} options.circleGap - Gap between circle and label text
   * @param {p5.Color} options.hoverCircleBorderColor - Circle border color on hover
   * @param {boolean} options.enabled - Whether the radio button is interactive
   * @param {boolean} options.borderFlag - Whether to show component border
   * @param {p5.Color} options.borderColor - Component border color
   * @param {number} options.borderWidth - Component border width
   * @param {number} options.cornerRadius - Component corner radius
   * @param {boolean} options.enableShadow - Enable shadow rendering
   * @param {string} options.shadowColor - Shadow color (CSS color string)
   * @param {number} options.shadowBlur - Shadow blur radius
   * @param {number} options.shadowOffsetX - Shadow offset on X axis
   * @param {number} options.shadowOffsetY - Shadow offset on Y axis
   * @param {string} options.HTextAlign - Horizontal text alignment
   * @param {string} options.VTextAlign - Vertical text alignment
   * @param {number} options.pad - General padding
   * @param {number} options.padx - Horizontal padding
   * @param {number} options.pady - Vertical padding
   * @param {number} options.padl - Left padding
   * @param {number} options.padr - Right padding
   * @param {number} options.padt - Top padding
   * @param {number} options.padb - Bottom padding
   * @param {boolean} options.wrap - Whether to wrap text
   * @param {string} options.wrapMode - Wrap mode: "word" or "char"
   * @param {string} options.noWrapMode - No-wrap mode: "ellipsis" or "font-size"
   * @param {string} options.ellipsisMode - Ellipsis mode: "leading", "center", or "trailing"
   * @param {number} options.margin - General margin for all sides
   * @param {number} options.marginx - Horizontal margin (left and right)
   * @param {number} options.marginy - Vertical margin (top and bottom)
   * @param {number} options.marginl - Left margin
   * @param {number} options.marginr - Right margin
   * @param {number} options.margint - Top margin
   * @param {number} options.marginb - Bottom margin
   */
  constructor(x, y, width, height, label, {
    id = null,
    parent = null,
    group = 'default',
    selected = false,
    value = null,
    backgroundColor = color('#1e1e2e'),
    textColor = color('#e0e0e0'),
    circleColor = color('#2a2a3d'),
    circleBorderColor = color('#3a3a4d'),
    circleBorderWidth = 2,
    selectedColor = color('#4a9eff'),
    selectedCircleBorderColor = color('#4a9eff'),
    circleSize = 18,
    dotSize = 10,
    circleGap = 8,
    hoverCircleBorderColor = color('#5a5a7a'),
    enabled = true,
    borderFlag = false,
    borderColor = color('#3a3a4d'),
    borderWidth = 1,
    cornerRadius = 8,
    enableShadow = false,
    shadowColor = 'rgba(0,0,0,0.5)',
    shadowBlur = 12,
    shadowOffsetX = 0,
    shadowOffsetY = 4,
    HTextAlign = 'left',
    VTextAlign = 'center',
    pad = 5,
    padx = null,
    pady = null,
    padl = null,
    padr = null,
    padt = null,
    padb = null,
    wrap = false,
    wrapMode = 'word',
    noWrapMode = 'font-size',
    ellipsisMode = 'trailing',
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
    super(x, y, width, height, label, {
      id,
      parent,
      backgroundColor,
      textColor,
      borderFlag,
      borderColor,
      borderWidth,
      cornerRadius,
      enableShadow,
      shadowColor,
      shadowBlur,
      shadowOffsetX,
      shadowOffsetY,
      HTextAlign,
      VTextAlign,
      pad,
      padx,
      pady,
      padl,
      padr,
      padt,
      padb,
      wrap,
      wrapMode,
      noWrapMode,
      ellipsisMode,
      icon: null,
      iconSize: 20,
      iconPosition: 'left',
      iconGap: 6,
      iconTintColor: null,
      iconOpacity: 255,
      margin,
      marginx,
      marginy,
      marginl,
      marginr,
      margint,
      marginb,
      minWidth,
      minHeight,
      showDebugOverlay,
    });

    this.group = group;
    this.selected = false;
    this.value = value ?? label;
    this.circleColor = circleColor;
    this.circleBorderColor = circleBorderColor;
    this.circleBorderWidth = circleBorderWidth;
    this.selectedColor = selectedColor;
    this.selectedCircleBorderColor = selectedCircleBorderColor;
    this.circleSize = circleSize;
    this.dotSize = dotSize;
    this.circleGap = circleGap;
    this.hoverCircleBorderColor = hoverCircleBorderColor;
    this.enabled = enabled;
    this.isHovered = false;

    // Absorb circle space into left padding so that all TextComponent layout
    // machinery (renderText, updateLabelSize, getContentWidth, debug overlay)
    // works correctly without any overrides.
    this.padl += this.circleSize + this.circleGap;

    // Recalculate label size with the updated padl
    if (!this.wrap && this.noWrapMode === 'font-size') {
      this.updateLabelSize();
    }

    // Register in group
    if (!_radioGroups.has(this.group)) {
      _radioGroups.set(this.group, new Set());
    }
    _radioGroups.get(this.group).add(this);

    // If initially selected, deselect others in the group
    if (selected) {
      this.select();
    }

    this.addEventListener('mouseEnter', () => {
      if (!this.enabled) return;
      this.isHovered = true;
    });

    this.addEventListener('hover', (event) => {
      if (!this.enabled) return;
      cursor('pointer');
      event.stopPropagation();
    });

    this.addEventListener('mouseLeave', () => {
      this.isHovered = false;
    });

    this.addEventListener('click', () => {
      if (!this.enabled) return;
      this.select();
    });
  }

  /**
   * Selects this radio button and deselects all others in the same group.
   */
  select() {
    const group = _radioGroups.get(this.group);
    if (group) {
      for (const rb of group) {
        if (rb !== this) {
          rb.selected = false;
        }
      }
    }
    this.selected = true;
  }

  /**
   * Deselects this radio button.
   */
  deselect() {
    this.selected = false;
  }

  /**
   * Returns whether this radio button is currently selected.
   * @returns {boolean}
   */
  isSelected() {
    return this.selected;
  }

  /**
   * Returns the value of the currently selected radio button in this group.
   * @returns {*|null} The value, or null if none selected.
   */
  getSelectedValue() {
    const group = _radioGroups.get(this.group);
    if (group) {
      for (const rb of group) {
        if (rb.selected) return rb.value;
      }
    }
    return null;
  }

  /**
   * Returns all RadioButton instances in the same group.
   * @returns {RadioButton[]}
   */
  getGroupMembers() {
    const group = _radioGroups.get(this.group);
    return group ? [...group] : [];
  }

  /**
   * Enables or disables the radio button.
   * @param {boolean} enabled - True to enable, false to disable
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) {
      this.isHovered = false;
    }
  }

  /**
   * Removes this radio button from its group registry.
   * Call this when the radio button is permanently removed from the UI.
   */
  destroy() {
    const group = _radioGroups.get(this.group);
    if (group) {
      group.delete(this);
      if (group.size === 0) {
        _radioGroups.delete(this.group);
      }
    }
  }

  /**
   * Renders the radio button with label.
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

    // Background
    fill(this.backgroundColor);
    rect(0, 0, this.width, this.height, this.cornerRadius);

    // Radio circle position: sits in the gap between original padl and expanded padl
    const originalPadl = this.padl - this.circleSize - this.circleGap;
    const cx = originalPadl + this.circleSize / 2;
    const cy = this.height / 2;

    // Draw outer circle
    if (this.selected) {
      fill(this.circleColor);
      stroke(this.selectedCircleBorderColor);
    } else {
      fill(this.circleColor);
      if (this.isHovered && this.enabled) {
        stroke(this.hoverCircleBorderColor);
      } else {
        stroke(this.circleBorderColor);
      }
    }
    strokeWeight(this.circleBorderWidth);
    ellipse(cx, cy, this.circleSize, this.circleSize);

    // Draw inner dot when selected
    if (this.selected) {
      noStroke();
      fill(this.selectedColor);
      ellipse(cx, cy, this.dotSize, this.dotSize);
    }

    // Draw label text — renderText uses this.padl which already includes circle space
    noStroke();
    fill(this.enabled ? this.textColor : color(120, 120, 140));
    this.renderText();

    // Border
    if (this.borderFlag) {
      noFill();
      stroke(this.borderColor);
      strokeWeight(this.borderWidth);
      rect(0, 0, this.width, this.height, this.cornerRadius);
    }

    pop();
  }
}
