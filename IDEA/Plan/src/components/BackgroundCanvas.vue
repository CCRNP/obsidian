<template>
  <canvas ref="canvasRef" class="background-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasRef = ref(null)
let ctx = null
let animationId = null
let lastTime = 0
const FRAME_INTERVAL = 1000 / 30

const particles = []
const EMOJIS = ['😋', '✨', '💫', '🌟', '⭐', '💜', '🎨', '🌈', '💭', '🎯']

class Particle {
  constructor(canvas) {
    this.canvas = canvas
    this.reset()
    this.y = Math.random() * canvas.height
  }

  reset() {
    this.x = Math.random() * this.canvas.width
    this.y = this.canvas.height + Math.random() * 50
    this.size = 14 + Math.random() * 20
    this.speed = 0.3 + Math.random() * 0.7
    this.drift = (Math.random() - 0.5) * 0.5
    this.emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
    this.opacity = 0.1 + Math.random() * 0.3
    this.rotation = Math.random() * Math.PI * 2
    this.rotationSpeed = (Math.random() - 0.5) * 0.02
    this.wobbleAngle = Math.random() * Math.PI * 2
    this.wobbleSpeed = 0.01 + Math.random() * 0.02
    this.wobbleRadius = 20 + Math.random() * 40
  }

  update() {
    this.wobbleAngle += this.wobbleSpeed
    this.x += Math.sin(this.wobbleAngle) * 0.3 + this.drift
    this.y -= this.speed
    this.rotation += this.rotationSpeed

    if (this.y < -50 || this.x < -50 || this.x > this.canvas.width + 50) {
      this.reset()
    }
  }

  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)
    ctx.font = `${this.size}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(this.emoji, 0, 0)
    ctx.restore()
  }
}

const initCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  ctx = canvas.getContext('2d')
  resizeCanvas()
  initParticles()
}

const resizeCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

const initParticles = () => {
  particles.length = 0
  const canvas = canvasRef.value
  const particleCount = Math.min(25, Math.floor((canvas.width * canvas.height) / 50000))

  for (let i = 0; i < particleCount; i++) {
    const particle = new Particle(canvas)
    particle.y = Math.random() * canvas.height
    particles.push(particle)
  }
}

const animate = (timestamp) => {
  if (timestamp - lastTime >= FRAME_INTERVAL) {
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

    particles.forEach((particle) => {
      particle.update()
      particle.draw(ctx)
    })

    lastTime = timestamp
  }

  animationId = requestAnimationFrame(animate)
}

const handleResize = () => {
  resizeCanvas()
  initParticles()
}

const checkReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

onMounted(() => {
  initCanvas()

  if (!checkReducedMotion()) {
    animationId = requestAnimationFrame(animate)
  } else {
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    particles.forEach((particle) => {
      particle.draw(ctx)
    })
  }

  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.background-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}
</style>
