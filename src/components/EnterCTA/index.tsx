// Types
import type { RootState } from 'store'

// Styles
import style from './index.module.css'

// Utils
import { gsap } from 'gsap'
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin'
import cn from 'classnames'
import { randomIntFromInterval } from 'utils/math'

// Hooks
import { useRef, useEffect, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

// Components
import { CortexBoot } from './CortexBoot'

gsap.registerPlugin(ScrambleTextPlugin)

const chars = '▲△◀∅∏▒▢◁≈▶▣▭'

const EnterCTA = () => {
  const { t } = useTranslation()

  const app = useSelector((state: RootState) => state.app)
  const [visible, setVisible] = useState(false)

  const buttonRef = useRef<HTMLButtonElement>(null)
  const labelRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dispatch = useDispatch()

  // Full-Screen CNN Neural Network Animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      console.log('Canvas ref not found')
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.log('Canvas context not available')
      return
    }

    console.log('Neural network canvas initialized', canvas.width, canvas.height)

    // Set canvas to full screen
    const initCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      console.log('Canvas resized to:', canvas.width, canvas.height)
    }
    initCanvas()

    const centerY = canvas.height / 2
    const centerX = canvas.width / 2

    // Sophisticated Neural Network Architecture
    interface Neuron {
      x: number
      y: number
      z: number
      activation: number
      targetActivation: number
      pulsePhase: number
    }

    interface Connection {
      from: Neuron
      to: Neuron
      strength: number
      particles: Particle[]
    }

    interface Particle {
      progress: number
      speed: number
      size: number
    }

    // Create circular network layout (more organic than grid)
    const neuronLayers: Neuron[][] = []
    const layerSizes = [8, 12, 16, 12, 8]
    const connections: Connection[] = []

    layerSizes.forEach((size, layerIdx) => {
      const layer: Neuron[] = []
      const radius = 150 + layerIdx * 120
      const angleStep = (Math.PI * 2) / size

      for (let i = 0; i < size; i++) {
        const angle = i * angleStep - Math.PI / 2
        layer.push({
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          z: layerIdx * 50,
          activation: 0,
          targetActivation: 0,
          pulsePhase: Math.random() * Math.PI * 2
        })
      }
      neuronLayers.push(layer)
    })

    // Create connections with particles
    neuronLayers.forEach((layer, layerIdx) => {
      if (layerIdx < neuronLayers.length - 1) {
        const nextLayer = neuronLayers[layerIdx + 1]
        layer.forEach(from => {
          nextLayer.forEach(to => {
            if (Math.random() > 0.3) { // Sparse connections for cleaner look
              connections.push({
                from,
                to,
                strength: Math.random() * 0.5 + 0.5,
                particles: []
              })
            }
          })
        })
      }
    })

    // Background particles for depth
    const bgParticles: { x: number; y: number; size: number; speed: number; opacity: number }[] = []
    for (let i = 0; i < 100; i++) {
      bgParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.3 + 0.1
      })
    }

    let animationTime = 0

    // Update activations with wave propagation
    const updateActivations = (time: number) => {
      const t = time * 0.001

      neuronLayers.forEach((layer, layerIdx) => {
        layer.forEach((neuron, neuronIdx) => {
          // Breathing/pulsing effect
          neuron.pulsePhase += 0.02

          // Wave propagation from center outward
          const waveProgress = (t * 0.5 - layerIdx * 0.3) % 2
          const wave = Math.max(0, 1 - Math.abs(waveProgress - 1))

          // Individual neuron variation
          const individualPulse = Math.sin(t + neuronIdx * 0.5) * 0.5 + 0.5

          neuron.targetActivation = wave * 0.7 + individualPulse * 0.3
          neuron.activation += (neuron.targetActivation - neuron.activation) * 0.1
        })
      })

      // Update connection particles
      connections.forEach(conn => {
        // Spawn new particles
        if (conn.from.activation > 0.5 && Math.random() > 0.95) {
          conn.particles.push({
            progress: 0,
            speed: 0.02 + Math.random() * 0.03,
            size: 2 + Math.random() * 3
          })
        }

        // Update existing particles
        conn.particles = conn.particles.filter(p => {
          p.progress += p.speed
          return p.progress < 1
        })

        // Activate target neuron when particle arrives
        conn.particles.forEach(p => {
          if (p.progress > 0.9) {
            conn.to.targetActivation = Math.max(conn.to.targetActivation, 0.8)
          }
        })
      })

      // Animate background particles
      bgParticles.forEach(p => {
        p.y += p.speed
        if (p.y > canvas.height) p.y = 0
      })
    }

    // Draw background particles for depth
    const drawBackgroundParticles = () => {
      bgParticles.forEach(p => {
        ctx.fillStyle = `rgba(66, 111, 245, ${p.opacity})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    // Draw connections with bezier curves
    const drawConnections = () => {
      connections.forEach(conn => {
        const activation = (conn.from.activation + conn.to.activation) / 2

        if (activation > 0.1) {
          // Smooth bezier curve
          const cp1x = conn.from.x + (conn.to.x - conn.from.x) * 0.3
          const cp1y = conn.from.y
          const cp2x = conn.from.x + (conn.to.x - conn.from.x) * 0.7
          const cp2y = conn.to.y

          ctx.strokeStyle = `rgba(66, 111, 245, ${activation * 0.15})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(conn.from.x, conn.from.y)
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, conn.to.x, conn.to.y)
          ctx.stroke()
        }

        // Draw traveling particles
        conn.particles.forEach(particle => {
          const t = particle.progress
          const tt = t * t
          const ttt = tt * t
          const u = 1 - t
          const uu = u * u
          const uuu = uu * u

          // Bezier curve calculation
          const cp1x = conn.from.x + (conn.to.x - conn.from.x) * 0.3
          const cp1y = conn.from.y
          const cp2x = conn.from.x + (conn.to.x - conn.from.x) * 0.7
          const cp2y = conn.to.y

          const px = uuu * conn.from.x + 3 * uu * t * cp1x + 3 * u * tt * cp2x + ttt * conn.to.x
          const py = uuu * conn.from.y + 3 * uu * t * cp1y + 3 * u * tt * cp2y + ttt * conn.to.y

          // Glow
          const gradient = ctx.createRadialGradient(px, py, 0, px, py, particle.size * 3)
          gradient.addColorStop(0, 'rgba(0, 255, 255, 0.8)')
          gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.3)')
          gradient.addColorStop(1, 'rgba(0, 255, 255, 0)')
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(px, py, particle.size * 3, 0, Math.PI * 2)
          ctx.fill()

          // Core
          ctx.fillStyle = 'rgba(255, 255, 255, 1)'
          ctx.beginPath()
          ctx.arc(px, py, particle.size, 0, Math.PI * 2)
          ctx.fill()
        })
      })
    }

    // Draw neurons with sophisticated glow
    const drawNeurons = () => {
      neuronLayers.forEach(layer => {
        layer.forEach(neuron => {
          const baseRadius = 4
          const pulse = Math.sin(neuron.pulsePhase) * 0.3 + 0.7
          const radius = baseRadius * pulse
          const glowRadius = radius + neuron.activation * 20

          // Outer glow
          const outerGlow = ctx.createRadialGradient(neuron.x, neuron.y, 0, neuron.x, neuron.y, glowRadius)
          outerGlow.addColorStop(0, `rgba(0, 255, 255, ${neuron.activation * 0.6})`)
          outerGlow.addColorStop(0.3, `rgba(66, 111, 245, ${neuron.activation * 0.3})`)
          outerGlow.addColorStop(1, 'rgba(66, 111, 245, 0)')
          ctx.fillStyle = outerGlow
          ctx.beginPath()
          ctx.arc(neuron.x, neuron.y, glowRadius, 0, Math.PI * 2)
          ctx.fill()

          // Middle ring
          if (neuron.activation > 0.5) {
            ctx.strokeStyle = `rgba(0, 255, 255, ${neuron.activation * 0.8})`
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.arc(neuron.x, neuron.y, radius * 2, 0, Math.PI * 2)
            ctx.stroke()
          }

          // Inner glow
          const innerGlow = ctx.createRadialGradient(neuron.x, neuron.y, 0, neuron.x, neuron.y, radius * 1.5)
          innerGlow.addColorStop(0, `rgba(255, 255, 255, ${neuron.activation})`)
          innerGlow.addColorStop(0.5, `rgba(0, 255, 255, ${neuron.activation * 0.8})`)
          innerGlow.addColorStop(1, `rgba(66, 111, 245, ${neuron.activation * 0.3})`)
          ctx.fillStyle = innerGlow
          ctx.beginPath()
          ctx.arc(neuron.x, neuron.y, radius * 1.5, 0, Math.PI * 2)
          ctx.fill()

          // Core
          ctx.fillStyle = 'rgba(255, 255, 255, 1)'
          ctx.beginPath()
          ctx.arc(neuron.x, neuron.y, radius * 0.5, 0, Math.PI * 2)
          ctx.fill()
        })
      })
    }

    // Draw sophisticated text
    const drawText = (time: number) => {
      const alpha = Math.sin(time * 0.002) * 0.3 + 0.7

      // Main title
      ctx.font = 'bold 48px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Text glow
      ctx.shadowColor = 'rgba(0, 255, 255, 0.8)'
      ctx.shadowBlur = 30
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
      ctx.fillText('RAJDEEP', centerX, centerY - 280)

      ctx.shadowBlur = 0

      // Subtitle
      ctx.font = '16px Inter, sans-serif'
      ctx.fillStyle = `rgba(66, 111, 245, ${alpha * 0.8})`
      ctx.fillText('Initializing Neural Systems', centerX, centerY - 230)

      // Progress indicators
      const dots = Math.floor((time / 500) % 4)
      ctx.fillText('.'.repeat(dots), centerX, centerY + 250)
    }

    // Main animation loop
    let animationId: number
    const animate = () => {
      animationTime += 16

      // Clear with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      updateActivations(animationTime)

      // Draw in layers for depth
      drawBackgroundParticles()
      drawConnections()
      drawNeurons()
      drawText(animationTime)

      animationId = requestAnimationFrame(animate)
    }

    // Initial clear to black
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw a test to verify canvas is working
    console.log('Starting neural network animation')

    animate()

    // Handle resize
    const handleResize = () => {
      initCanvas()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const clickHandler = useCallback(() => {
    if (!app.loaded) return
    dispatch.app.setReady()
  }, [app.loaded, dispatch.app])

  useEffect(() => {
    const rings = buttonRef.current?.querySelectorAll(`.${style.ring}`)
    if (rings) {
      for (const ring of rings) {
        const delay = randomIntFromInterval(1, 4)
        const rotateDuration = randomIntFromInterval(3, 8)
        gsap.to(ring, {
          opacity: 1,
          duration: 2,
          delay
        })
        gsap.to(ring, {
          rotation: 360,
          ease: 'none',
          duration: rotateDuration,
          repeat: -1,
          delay
        })
      }
    }
  }, [])

  useEffect(() => {
    if (app.loaded) {
      const rings = buttonRef.current?.querySelectorAll(`.${style.ring}`)
      if (rings) {
        gsap.to(labelRef.current, {
          scrambleText: {
            text: t('enter'),
            chars
          },
          duration: 2
        })
        if (rings) {
          gsap.killTweensOf(rings, 'opacity')
          gsap.to(rings, {
            // rotation: 0,
            opacity: 0.5,
            duration: 0.5
          })
        }
      }
    }
  }, [app.loaded, t])

  const setHover = useCallback(() => {
    if (!app.loaded) return

    dispatch.pointer.setType('hover')
  }, [app.loaded, dispatch.pointer])

  const removeHover = useCallback(() => {
    if (!app.loaded) return

    dispatch.pointer.setType('')
  }, [app.loaded, dispatch.pointer])

  // Visible
  useEffect(() => {
    setTimeout(() => {
      setVisible(true)
    }, 3000)
  }, [])

  const classes = cn(style.root, {
    [style.loaded]: app.loaded,
    [style.hidden]: app.ready || !visible
  })

  return (
    <>
      {/* CORTEX BOOT - Dense 3D Brain Neural Network Loader */}
      {!app.ready && <CortexBoot />}

      {/* Enter Button Container */}
      <div
        className={classes}
        style={{
          position: 'fixed',
          bottom: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10001
        }}
      >
        <button
          className={style.button}
          ref={buttonRef}
          onClick={clickHandler}
          onMouseEnter={app.loaded ? setHover : undefined}
          onMouseLeave={app.loaded ? removeHover : undefined}
        >
          <span className={style.ring} />
          <span className={style.ring} />
          <span className={style.ring} />
          <span className={style.ring} />
          <span className={style.ring} />
          <em className={style.label} ref={labelRef}>
            {t('loading')}
          </em>
        </button>
      </div>
    </>
  )
}

export default EnterCTA
