<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { Root } from '../../../../Core/Root.js'
import { Button } from '../../../../UIComponents/Button.js'
import { Label } from '../../../../UIComponents/Label.js'
import { ScrollFrame } from "../../../../Frames/ScrollFrame.js";
import { TextField } from '../../../../UIComponents/TextField.js'

const container = ref(null)
let p5Instance = null
let resizeHandler = null
let isMounted = false

const loadP5 = () => {
  if (typeof window === 'undefined') {
    return Promise.resolve()
  }

  if (window.p5) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const existing = document.getElementById('p5-cdn-script')
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = 'p5-cdn-script'
    script.src = 'https://cdn.jsdelivr.net/npm/p5@1.9.0/lib/p5.min.js'
    script.defer = true
    script.addEventListener('load', () => resolve(), { once: true })
    document.head.appendChild(script)
  })
}

const bindGlobals = (p) => {
  const functions = [
    'createCanvas',
    'createGraphics',
    'background',
    'rect',
    'fill',
    'text',
    'textWidth',
    'textAscent',
    'textDescent',
    'textSize',
    'textAlign',
    'ellipse',
    'image',
    'imageMode',
    'loadImage',
    'noFill',
    'noStroke',
    'noTint',
    'tint',
    'stroke',
    'strokeWeight',
    'cursor',
    'push',
    'pop',
    'translate',
    'beginClip',
    'endClip',
    'abs',
    'dist',
    'min',
    'max',
    'color',
    'pow',
    'millis',
    'line',
    'arc',
    'resizeCanvas',
    'constrain',
    'keyIsDown',
  ]

  functions.forEach((name) => {
    if (typeof p[name] === 'function') {
      window[name] = p[name].bind(p)
    }
  })

  const constants = ['LEFT', 'RIGHT', 'CENTER', 'TOP', 'BOTTOM', 'BASELINE', 'CORNER', 'PI', 'HALF_PI', 'TWO_PI', 'LEFT_ARROW', 'RIGHT_ARROW', 'UP_ARROW', 'DOWN_ARROW', 'BACKSPACE', 'CONTROL', 'ENTER', 'DELETE', 'TAB', 'ESCAPE', 'SHIFT', 'ALT']
  constants.forEach((name) => {
    window[name] = p[name]
  })

  const defineLiveProp = (name, getter) => {
    const existing = Object.getOwnPropertyDescriptor(window, name)
    if (existing && existing.configurable === false) {
      return
    }

    Object.defineProperty(window, name, {
      get: getter,
      configurable: true
    })
  }

  defineLiveProp('mouseIsPressed', () => p.mouseIsPressed)
  defineLiveProp('mouseX', () => p.mouseX)
  defineLiveProp('mouseY', () => p.mouseY)
  defineLiveProp('keyIsPressed', () => p.keyIsPressed)
  defineLiveProp('keyCode', () => p.keyCode)
  defineLiveProp('key', () => p.key)
  defineLiveProp('drawingContext', () => p.drawingContext)
}

const isTouchDevice = () => {
  if (typeof window === 'undefined') {
    return false
  }

  return (
    window.matchMedia?.('(pointer: coarse)').matches ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  )
}

const teardownSketch = () => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }

  if (p5Instance) {
    p5Instance.remove()
    p5Instance = null
  }
}

const startSketch = () => {
  if (!container.value || !window.p5) {
    return
  }

  const sketch = (p) => {
    let root = null
    let crowImg = null
    let clickTimes = 0

    const getSize = () => {
      const bounds = container.value?.getBoundingClientRect()
      return {
        width: Math.max(320, Math.floor(bounds?.width || 420)),
        height: Math.max(320, Math.floor(bounds?.height || 400))
      }
    }

    const layoutButton = (width, height) => {
    }

    p.preload = () => {
      crowImg = p.loadImage('/crow.png')
    }

    p.setup = () => {
      const { width, height } = getSize()
      const canvas = p.createCanvas(width, height)
      canvas.parent(container.value)

      bindGlobals(p)
      root = new Root({showDebugOverlay: false})

      const useScrollFrame = !isTouchDevice()
      const scrollFrameWidth = 320
      const scrollFrameHeight = 360
      const scrollFrame = useScrollFrame
        ? new ScrollFrame(
          (width - scrollFrameWidth) / 2,
          (height - scrollFrameHeight) / 2,
          scrollFrameWidth,
          scrollFrameHeight, {
          cornerRadius: 13,
          alwaysShowBanner: true,
          enableHScroll: false,
          enableReposition: true,
          enableResizing: true,
          pad: 10,
          margin: 10,
        })
        : null

      // ---- 1. Text-only button (existing behaviour) ----
      const textOnlyBtn = new Button(
        0, 0, 200, 45,
        'Text Only 🐦‍⬛',
        {
          pad: 10,
          margin: 5,
        }
      )
      textOnlyBtn.addEventListener('click', (event) => {
        clickTimes += 1
        event.target.setText(`Clicked ${clickTimes} times!`)
      })

      // ---- 2. Text + icon button (icon left) ----
      const textIconBtn = new Button(
        0, 0, 200, 45,
        'Text + Icon',
        {
          icon: crowImg,
          iconSize: 22,
          iconPosition: 'left',
          iconGap: 8,
          pad: 10,
          margin: 5,
        }
      )

      // ---- 3. Icon-only button ----
      const iconOnlyBtn = new Button(
        0, 0, 50, 45,
        '',
        {
          icon: crowImg,
          iconSize: 26,
          pad: 8,
          margin: 5,
        }
      )

      // ---- 4. Text-only label ----
      const textOnlyLabel = new Label(
        0, 0, 200, 40,
        'Text-only Label',
        {
          pad: 8,
          margin: 5,
        }
      )

      // ---- 5. Text + icon label (icon right) ----
      const textIconLabel = new Label(
        0, 0, 200, 40,
        'Label + Icon',
        {
          icon: crowImg,
          iconSize: 20,
          iconPosition: 'right',
          iconGap: 6,
          pad: 8,
          margin: 5,
        }
      )

      // ---- 6. Icon-only label ----
      const iconOnlyLabel = new Label(
        0, 0, 45, 40,
        '',
        {
          icon: crowImg,
          iconSize: 24,
          pad: 6,
          margin: 5,
        }
      )

      // ---- TextField ----
      const textField = new TextField(
        20,
        height - 60,
        width - 40,
        40,
        {
          pad: 10,
          margin: 5,
          placeholder: 'Type something...'
        }
      )

      if (scrollFrame) {
        scrollFrame.add(textOnlyBtn)
        scrollFrame.add(textIconBtn)
        scrollFrame.add(iconOnlyBtn)
        scrollFrame.add(textOnlyLabel)
        scrollFrame.add(textIconLabel)
        scrollFrame.add(iconOnlyLabel)
        scrollFrame.add(textField)
        root.add(scrollFrame)
      } else {
        root.add(textOnlyBtn)
        root.add(textIconBtn)
        root.add(iconOnlyBtn)
        root.add(textOnlyLabel)
        root.add(textIconLabel)
        root.add(iconOnlyLabel)
        root.add(textField)
      }
    }

    p.draw = () => {
      if (!root) {
        return
      }

      p.background(30)

      root.show()
      root.mouseEnterEventListeners(p.mouseX, p.mouseY)
      root.hoverEventListeners(p.mouseX, p.mouseY)
      root.mouseLeaveEventListeners(p.mouseX, p.mouseY)
      root.keyDownEventListeners(p.mouseX, p.mouseY)
    }

    p.mouseDragged = () => {
      if (root) {
        root.mouseDraggedEventListeners(p.mouseX, p.mouseY)
      }
    }

    p.mouseClicked = () => {
      if (root) {
        root.mouseClickedEventListeners(p.mouseX, p.mouseY)
      }
    }

    p.mousePressed = () => {
      if (root) {
        root.mousePressedEventListeners(p.mouseX, p.mouseY)
      }
    }

    p.mouseReleased = () => {
      if (root) {
        root.mouseReleasedEventListeners(p.mouseX, p.mouseY)
      }
    }

    p.mouseWheel = (event) => {
      if (root) {
        root.mouseWheelEventListeners(p.mouseX, p.mouseY, event)
      }
    }

    p.keyPressed = (event) => {
      if (
        p.keyCode === p.UP_ARROW ||
        p.keyCode === p.DOWN_ARROW ||
        p.keyCode === p.LEFT_ARROW ||
        p.keyCode === p.RIGHT_ARROW
      ) {
        event.preventDefault()
      }

      if (root) {
        root.keyPressedEventListeners(p.mouseX, p.mouseY, event)
      }
    }

    resizeHandler = () => {
      if (!container.value) {
        return
      }

      const { width, height } = getSize()
      p.resizeCanvas(width, height)
      layoutButton(width, height)
    }
  }

  p5Instance = new window.p5(sketch)
  if (resizeHandler) {
    window.addEventListener('resize', resizeHandler)
  }
}

const resetSketch = () => {
  if (!isMounted) {
    return
  }

  teardownSketch()
  startSketch()
}

onMounted(async () => {
  isMounted = true
  if (!container.value) {
    return
  }

  await loadP5()
  if (!isMounted || !window.p5) {
    return
  }

  startSketch()
})

onBeforeUnmount(() => {
  isMounted = false

  teardownSketch()
})
</script>

<template>
  <div ref="container" class="p5-canvas">
    <button
      type="button"
      class="p5-reset-button"
      aria-label="Reset demo"
      @click.stop="resetSketch"
    >
      <Icon icon="material-symbols:refresh-rounded" />
    </button>
  </div>
</template>
