// Core
const Root = require('./Core/Root');
const Component = require('./Core/Component');
const GUIEvent = require('./Core/GUIEvent/GUIEvent');
const KeyboardEvent = require('./Core/GUIEvent/KeyboardEvent');
const MouseEvent = require('./Core/GUIEvent/MouseEvent');

// Frames
const DummyFrame = require('./Frames/DummyFrame');
const Frame = require('./Frames/Frame');
const FrameComponent = require('./Frames/FrameComponent');
const GridFrame = require('./Frames/GridFrame');
const ScrollFrame = require('./Frames/ScrollFrame');

// UIComponents
const Input = require('./UIComponents/Input');
const Label = require('./UIComponents/Label');
const TextField = require('./UIComponents/TextField');
const UIComponent = require('./UIComponents/UIComponent');

module.exports = {
  // Core
  Component,
  Root,
  GUIEvent,
  KeyboardEvent,
  MouseEvent,

  // Frames
  DummyFrame,
  Frame,
  FrameComponent,
  GridFrame,
  ScrollFrame,

  // UIComponents
  Input,
  Label,
  TextField,
  UIComponent
};