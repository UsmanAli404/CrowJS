<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Root } from '../../../../Core/Root.js'
import { Button } from '../../../../UIComponents/Button.js'

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
    'background',
    'rect',
    'fill',
    'text',
    'textWidth',
    'textAscent',
    'textDescent',
    'textSize',
    'textAlign',
    'noFill',
    'stroke',
    'strokeWeight',
    'push',
    'pop',
    'translate',
    'beginClip',
    'endClip',
    'min',
    'max',
    'color'
  ]

  functions.forEach((name) => {
    if (typeof p[name] === 'function') {
      window[name] = p[name].bind(p)
    }
  })

  const constants = ['LEFT', 'RIGHT', 'CENTER', 'TOP', 'BOTTOM']
  constants.forEach((name) => {
    window[name] = p[name]
  })

  Object.defineProperty(window, 'mouseIsPressed', {
    get: () => p.mouseIsPressed
  })

  Object.defineProperty(window, 'mouseX', {
    get: () => p.mouseX
  })

  Object.defineProperty(window, 'mouseY', {
    get: () => p.mouseY
  })

  Object.defineProperty(window, 'keyIsPressed', {
    get: () => p.keyIsPressed
  })
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

  const sketch = (p) => {
    let root = null
    let button = null
    let clickTimes = 0

    const getSize = () => {
      const bounds = container.value?.getBoundingClientRect()
      return {
        width: Math.max(320, Math.floor(bounds?.width || 420)),
        height: Math.max(240, Math.floor(bounds?.height || 280))
      }
    }

    const layoutButton = (width, height) => {
      if (!button) {
        return
      }

      button.x = (width - button.width) / 2
      button.y = (height - button.height) / 2
    }

    p.setup = () => {
      const { width, height } = getSize()
      const canvas = p.createCanvas(width, height)
      canvas.parent(container.value)

      bindGlobals(p)
      root = new Root()

      const btnWidth = 200
      const btnHeight = 100
      button = new Button(
        (width - btnWidth) / 2,
        (height - btnHeight) / 2,
        btnWidth,
        btnHeight,
        'Hello! 👋',
        {
          cornerRadius: 20,
          backgroundColor: 'rgba(0, 0, 0, 1)',
          textColor: 'rgba(255, 255, 255, 1)',
        }
      )

      button.addEventListener('click', (event) => {
        clickTimes += 1
        event.target.setText(`You clicked ${clickTimes}\ntimes!`)
      })

      root.add(button)
    }

    p.draw = () => {
      if (!root) {
        return
      }

      p.background(255)
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
        root.keyPressedEventListeners(p.mouseX, p.mouseY)
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
})

onBeforeUnmount(() => {
  isMounted = false
  if (p5Instance) {
    p5Instance.remove()
    p5Instance = null
  }

  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }
})
</script>

<template>
  <div ref="container" class="p5-canvas"></div>
</template>
