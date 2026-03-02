<script setup>
/**
 * Injects a 4-pointed-star glint over the crow logo's eye.
 *
 * Position is calculated from the *rendered* <img> bounding rect,
 * so it stays aligned at every viewport width — no media-query
 * gymnastics needed.
 */
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRoute } from 'vitepress'

// ── Eye position as a fraction of the crow image's dimensions ──
const EYE_X = 0.555
const EYE_Y = 0.237

const route = useRoute()
let glintEl = null
let observer = null

const reposition = () => {
  const img = document.querySelector('.VPHero .VPImage')
  if (!img || !glintEl) return

  const container = img.closest('.image-container')
  if (!container) return

  const imgRect = img.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()

  // Offset within the container based on where the <img> actually renders
  const x = imgRect.left - containerRect.left + imgRect.width * EYE_X
  const y = imgRect.top - containerRect.top + imgRect.height * EYE_Y

  glintEl.style.left = `${x}px`
  glintEl.style.top = `${y}px`
}

const inject = () => {
  // Only act on the home page
  const container = document.querySelector('.VPHero .image-container')
  if (!container) return

  // Avoid duplicates on hot-reload
  container.querySelector('.crow-eye-glint')?.remove()

  glintEl = document.createElement('div')
  glintEl.className = 'crow-eye-glint'
  container.style.position = 'relative'
  container.appendChild(glintEl)

  const img = container.querySelector('.VPImage')
  if (img) {
    if (img.complete) reposition()
    else img.addEventListener('load', reposition, { once: true })
  }

  observer = new ResizeObserver(reposition)
  observer.observe(container)
  window.addEventListener('resize', reposition)
}

const cleanup = () => {
  if (observer) { observer.disconnect(); observer = null }
  window.removeEventListener('resize', reposition)
  if (glintEl) { glintEl.remove(); glintEl = null }
}

onMounted(() => {
  inject()
})

onBeforeUnmount(() => {
  cleanup()
})
</script>

<template>
  <!-- Renderless — the glint is injected into .image-container via JS -->
  <span style="display:none" />
</template>
