// SYNAPSE GATE - Professional Neural Network Loader
// Tech-art aesthetic: black void + electric blue accents

import { useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  z: number
  baseX: number
  baseY: number
  size: 1.5 | 2.5 | 4
  opacity: number
  glowIntensity: number
  ringWave: number
  specularPhase: number
}

interface Edge {
  from: Node
  to: Node
  drawProgress: number
  pulseActive: number
  shimmerOffset: number
}

export const SynapseGate = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Create 40-70 nodes (60% tiny, 30% small, 10% medium)
    const nodes: Node[] = []
    const totalNodes = 55
    const sizes: (1.5 | 2.5 | 4)[] = [
      ...Array(33).fill(1.5), // 60%
      ...Array(17).fill(2.5), // 30%
      ...Array(5).fill(4)      // 10%
    ] as (1.5 | 2.5 | 4)[]

    // Create nodes in designed pattern
    for (let i = 0; i < totalNodes; i++) {
      const angle = (i / totalNodes) * Math.PI * 2
      const radius = 180 + Math.random() * 140
      const x = centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 80
      const y = centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 80
      const z = (Math.random() - 0.5) * 0.5

      nodes.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        size: sizes[i],
        opacity: 0,
        glowIntensity: 0,
        ringWave: 0,
        specularPhase: Math.random() * Math.PI * 2
      })
    }

    // Create selective edges (120-220)
    const edges: Edge[] = []
    nodes.forEach((node, i) => {
      const distances = nodes
        .map((other, idx) => ({ idx, dist: Math.hypot(other.x - node.x, other.y - node.y) }))
        .filter(d => d.idx !== i)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 4)

      distances.forEach(({ idx }) => {
        if (edges.length < 180 && Math.random() > 0.35) {
          edges.push({
            from: node,
            to: nodes[idx],
            drawProgress: 0,
            pulseActive: 0,
            shimmerOffset: Math.random() * Math.PI * 2
          })
        }
      })
    })

    // Dust particles (10-20)
    const dust: { x: number; y: number; vx: number; vy: number }[] = []
    for (let i = 0; i < 15; i++) {
      dust.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15
      })
    }

    // Pulse path (curated route)
    const pulsePath = [0, 5, 11, 18, 26, 34, 42, 49, 54]
    let pulseIndex = 0
    let phaseStartTime = 0

    // Animation loop
    let animationId: number
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const t = elapsed / 1000
      const phase = t % 2.8

      // Pure black background
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Background outlined typography (6-10% opacity)
      ctx.strokeStyle = `rgba(0, 0, 255, 0.08)`
      ctx.lineWidth = 2
      ctx.font = `${canvas.height * 0.4}px Arial Black`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.strokeText('RAJDEEP', centerX, centerY)

      // Draw dust particles
      dust.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.fillStyle = 'rgba(0, 0, 255, 0.03)'
        ctx.fillRect(p.x, p.y, 1, 1)
      })

      // PHASE 1: SEED (0.0 → 0.45s) - Cold boot flicker
      if (phase < 0.45) {
        const seedProgress = phase / 0.45
        nodes.forEach((node, i) => {
          const delay = (i / totalNodes) * 0.3
          if (seedProgress > delay) {
            const flickerProgress = (seedProgress - delay) / 0.15
            node.opacity = Math.min(1, flickerProgress * 1.5 + Math.sin(flickerProgress * 20) * 0.2)
          }
        })

        edges.forEach((edge, i) => {
          const delay = (i / edges.length) * 0.35
          if (seedProgress > delay) {
            edge.drawProgress = Math.min(1, (seedProgress - delay) / 0.1)
          }
        })
      }

      // PHASE 2: INFERENCE (0.45 → 1.85s) - Signal pulse
      else if (phase < 1.85) {
        nodes.forEach(n => { n.opacity = 1 })
        edges.forEach(e => { e.drawProgress = 1 })

        const inferenceProgress = (phase - 0.45) / 1.4
        pulseIndex = Math.floor(inferenceProgress * pulsePath.length)

        pulsePath.forEach((nodeIdx, i) => {
          if (i <= pulseIndex && i < pulsePath.length) {
            const node = nodes[nodeIdx]
            node.glowIntensity = 1
            node.ringWave = (inferenceProgress * pulsePath.length - i) * 40

            // Activate connected edges
            edges.forEach(edge => {
              if (edge.from === node || edge.to === node) {
                edge.pulseActive = 0.8
              }
            })
          }
        })

        // Decay glow and pulses
        nodes.forEach(n => {
          n.glowIntensity *= 0.95
          if (n.ringWave > 0) n.ringWave *= 0.92
        })
        edges.forEach(e => { e.pulseActive *= 0.9 })
      }

      // PHASE 3: CONVERGE (1.85 → 2.35s) - Form aperture
      else if (phase < 2.35) {
        const convergeProgress = (phase - 1.85) / 0.5
        nodes.forEach((node, i) => {
          const angle = (i / totalNodes) * Math.PI * 2
          const targetRadius = 250
          const targetX = centerX + Math.cos(angle) * targetRadius
          const targetY = centerY + Math.sin(angle) * targetRadius

          node.x = node.baseX + (targetX - node.baseX) * convergeProgress * 0.3
          node.y = node.baseY + (targetY - node.baseY) * convergeProgress * 0.3
        })
      }

      // PHASE 4: UNLOCK (2.35 → 2.8s) - Aperture opens
      else {
        const unlockProgress = (phase - 2.35) / 0.45
        nodes.forEach(n => {
          n.glowIntensity = Math.max(n.glowIntensity, unlockProgress * 1.5)
          n.opacity = 1 - unlockProgress * 0.5
        })
        edges.forEach(e => {
          e.pulseActive = unlockProgress
        })
      }

      // RENDER: Edges with tapered lines
      edges.forEach(edge => {
        if (edge.drawProgress === 0) return

        const { from, to, drawProgress, pulseActive } = edge
        const dx = to.x - from.x
        const dy = to.y - from.y
        const endX = from.x + dx * drawProgress
        const endY = from.y + dy * drawProgress

        const baseOpacity = 0.15
        const opacity = baseOpacity + pulseActive * 0.4
        const thickness = 0.5 + pulseActive * 0.75

        ctx.strokeStyle = `rgba(0, 0, 255, ${opacity})`
        ctx.lineWidth = thickness
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(endX, endY)
        ctx.stroke()

        // Edge shimmer during pulse
        if (pulseActive > 0.2) {
          const shimmer = Math.sin(t * 3 + edge.shimmerOffset) * 0.5 + 0.5
          const midX = (from.x + endX) / 2
          const midY = (from.y + endY) / 2
          ctx.fillStyle = `rgba(0, 0, 255, ${shimmer * pulseActive * 0.3})`
          ctx.fillRect(midX - 1, midY - 1, 2, 2)
        }
      })

      // RENDER: Nodes with tight bloom
      nodes.forEach(node => {
        if (node.opacity === 0) return

        const { x, y, size, opacity, glowIntensity, ringWave, specularPhase } = node
        const depthScale = 1 + node.z * 0.1

        // Outer glow (controlled bloom)
        if (glowIntensity > 0.1) {
          const glowRadius = 6 + size * 2 + glowIntensity * 12
          const grad = ctx.createRadialGradient(x, y, 0, x, y, glowRadius)
          grad.addColorStop(0, `rgba(0, 0, 255, ${glowIntensity * 0.5})`)
          grad.addColorStop(0.5, `rgba(0, 0, 255, ${glowIntensity * 0.2})`)
          grad.addColorStop(1, 'rgba(0, 0, 255, 0)')
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(x, y, glowRadius, 0, Math.PI * 2)
          ctx.fill()
        }

        // Ring wave
        if (ringWave > 0 && ringWave < 50) {
          const waveOpacity = (1 - ringWave / 50) * 0.6
          ctx.strokeStyle = `rgba(0, 0, 255, ${waveOpacity})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(x, y, ringWave, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Node core
        ctx.fillStyle = `rgba(0, 0, 255, ${opacity})`
        ctx.beginPath()
        ctx.arc(x, y, size * depthScale, 0, Math.PI * 2)
        ctx.fill()

        // Specular glint (chromed highlight)
        const glintX = x + Math.cos(t + specularPhase) * size * 0.4
        const glintY = y + Math.sin(t + specularPhase) * size * 0.4
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`
        ctx.fillRect(glintX, glintY, size * 0.3, size * 0.3)
      })

      // Status text (bottom-left)
      if (phase < 2.35) {
        const statusTexts = ['LOADING', 'SHADERS', 'TEXTURES', 'AUDIO']
        const currentStatus = statusTexts[Math.floor((phase / 2.35) * statusTexts.length)]
        ctx.font = '10px monospace'
        ctx.fillStyle = 'rgba(0, 0, 255, 0.5)'
        ctx.textAlign = 'left'
        ctx.fillText(currentStatus, 20, canvas.height - 20)
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000000',
        zIndex: 10000
      }}
    />
  )
}
