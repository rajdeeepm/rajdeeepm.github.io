// CORTEX BOOT - Dense 3D Brain Neural Network Loader (Three.js)
// Sparse structure with visible edges + traveling spikes
// Black void + electric blue only (#000000 + #0000FF)

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface Neuron {
  position: THREE.Vector3
  isCortical: boolean
  firing: number // 0-1 intensity
  refractoryTimer: number
  spikeChance: number
  visible: boolean
  revealProgress: number
  index: number
}

interface Synapse {
  from: Neuron
  to: Neuron
  distance: number
  isLongRange: boolean
  packets: SpikePacket[]
  showIdle: boolean // Random 2-6% selection
}

interface SpikePacket {
  progress: number
  speed: number
  intensity: number
}

export const CortexBoot = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // === SCENE SETUP ===
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    scene.fog = new THREE.Fog(0x000000, 150, 350) // Critical for depth

    // === CAMERA ===
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 400)

    // === RENDERER ===
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.domElement.style.cursor = 'default'
    containerRef.current.appendChild(renderer.domElement)

    // === BRAIN VOLUME GENERATOR ===
    const brainSDF = (x: number, y: number, z: number): number => {
      const mainDist = Math.sqrt(
        (x * x) / (120 * 120) +
        (y * y) / (100 * 100) +
        (z * z) / (140 * 140)
      )

      const leftBulge = Math.sqrt(
        ((x + 60) * (x + 60)) / (80 * 80) +
        ((y - 20) * (y - 20)) / (80 * 80) +
        (z * z) / (100 * 100)
      )

      const rightBulge = Math.sqrt(
        ((x - 60) * (x - 60)) / (80 * 80) +
        ((y - 20) * (y - 20)) / (80 * 80) +
        (z * z) / (100 * 100)
      )

      const smoothMin = (a: number, b: number, k: number) => {
        const h = Math.max(0, Math.min(1, (b - a + k) / (2 * k)))
        return a * h + b * (1 - h) - k * h * (1 - h)
      }

      let dist = smoothMin(mainDist, leftBulge, 0.3)
      dist = smoothMin(dist, rightBulge, 0.3)
      return dist
    }

    const isInsideBrain = (x: number, y: number, z: number) => brainSDF(x, y, z) < 1.0
    const distanceToSurface = (x: number, y: number, z: number) => Math.abs(brainSDF(x, y, z) - 1.0)

    // === NEURON GENERATION ===
    const neurons: Neuron[] = []
    const targetNeuronCount = 1500 // Optimized for performance
    const corticalRatio = 0.7

    let attempts = 0
    while (neurons.length < targetNeuronCount && attempts < targetNeuronCount * 5) {
      attempts++

      const x = (Math.random() - 0.5) * 280
      const y = (Math.random() - 0.5) * 240
      const z = (Math.random() - 0.5) * 320

      if (isInsideBrain(x, y, z)) {
        const distToSurface = distanceToSurface(x, y, z)
        const isCortical = Math.random() < corticalRatio

        const acceptCortical = isCortical && distToSurface < 0.25
        const acceptSubcortical = !isCortical && distToSurface >= 0.25

        if (acceptCortical || acceptSubcortical) {
          neurons.push({
            position: new THREE.Vector3(x, y, z),
            isCortical,
            firing: 0,
            refractoryTimer: 0,
            spikeChance: 0.002,
            visible: false,
            revealProgress: 0,
            index: neurons.length
          })
        }
      }
    }

    console.log(`Generated ${neurons.length} neurons`)

    // === k-NN SYNAPSE GRAPH ===
    const synapses: Synapse[] = []
    const k = 6 // Reduced for performance

    neurons.forEach((neuron) => {
      const distances = neurons
        .map((other) => ({
          neuron: other,
          dist: neuron.position.distanceTo(other.position)
        }))
        .filter(d => d.neuron !== neuron)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, k)

      distances.forEach(({ neuron: other, dist }) => {
        synapses.push({
          from: neuron,
          to: other,
          distance: dist,
          isLongRange: false,
          packets: [],
          showIdle: Math.random() < 0.04 // Only 4% visible when idle
        })
      })
    })

    // Long-range connections
    const leftNeurons = neurons.filter(n => n.position.x < -30)
    const rightNeurons = neurons.filter(n => n.position.x > 30)
    for (let i = 0; i < 150; i++) {
      const left = leftNeurons[Math.floor(Math.random() * leftNeurons.length)]
      const right = rightNeurons[Math.floor(Math.random() * rightNeurons.length)]
      if (left && right) {
        synapses.push({
          from: left,
          to: right,
          distance: left.position.distanceTo(right.position),
          isLongRange: true,
          packets: [],
          showIdle: Math.random() < 0.02
        })
      }
    }

    console.log(`Generated ${synapses.length} synapses`)

    // === NEURON POINTS (BufferGeometry) ===
    const neuronGeometry = new THREE.BufferGeometry()
    const neuronPositions = new Float32Array(neurons.length * 3)
    const neuronColors = new Float32Array(neurons.length * 3)
    const neuronSizes = new Float32Array(neurons.length)

    neurons.forEach((neuron, i) => {
      neuronPositions[i * 3] = neuron.position.x
      neuronPositions[i * 3 + 1] = neuron.position.y
      neuronPositions[i * 3 + 2] = neuron.position.z

      // Start with very dim blue (idle state)
      neuronColors[i * 3] = 0.0 // R
      neuronColors[i * 3 + 1] = 0.0 // G
      neuronColors[i * 3 + 2] = 0.15 // B (very dim)

      neuronSizes[i] = neuron.isCortical ? 1.8 : 2.5
    })

    neuronGeometry.setAttribute('position', new THREE.BufferAttribute(neuronPositions, 3))
    neuronGeometry.setAttribute('color', new THREE.BufferAttribute(neuronColors, 3))
    neuronGeometry.setAttribute('size', new THREE.BufferAttribute(neuronSizes, 1))

    const neuronMaterial = new THREE.PointsMaterial({
      size: 2.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.15, // Very low idle opacity to prevent blob
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    })

    const neuronPoints = new THREE.Points(neuronGeometry, neuronMaterial)
    scene.add(neuronPoints)

    // === SYNAPSE LINES (LineSegments) ===
    const createSynapseMesh = () => {
      const positions: number[] = []
      const colors: number[] = []

      synapses.forEach(synapse => {
        if (!synapse.showIdle && synapse.packets.length === 0) return

        positions.push(
          synapse.from.position.x, synapse.from.position.y, synapse.from.position.z,
          synapse.to.position.x, synapse.to.position.y, synapse.to.position.z
        )

        const hasActivity = synapse.packets.length > 0
        const alpha = hasActivity ? 0.3 : 0.08

        // Use blue for synapses (will transition to maize via material color)
        colors.push(0, 0, alpha, 0, 0, alpha)
      })

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

      const material = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      })

      return new THREE.LineSegments(geometry, material)
    }

    let synapseMesh = createSynapseMesh()
    scene.add(synapseMesh)

    // === SPIKE PACKETS (Point Sprites) ===
    const packetGeometry = new THREE.BufferGeometry()
    const packetMaterial = new THREE.PointsMaterial({
      color: 0x0000ff, // Pure blue
      size: 4,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
    const packetPoints = new THREE.Points(packetGeometry, packetMaterial)
    scene.add(packetPoints)

    // === SPIKE SYSTEM ===
    const fireNeuron = (neuron: Neuron) => {
      if (neuron.refractoryTimer > 0) return

      neuron.firing = 1.0
      neuron.refractoryTimer = 0.15

      synapses.forEach(synapse => {
        if (synapse.from === neuron) {
          synapse.packets.push({
            progress: 0,
            speed: 0.015 + Math.random() * 0.01,
            intensity: 0.8 + Math.random() * 0.2
          })
        }
      })
    }

    const updateSpikes = (dt: number) => {
      let colorsNeedUpdate = false
      const colors = neuronGeometry.attributes.color.array as Float32Array

      neurons.forEach(neuron => {
        // Decay firing
        if (neuron.firing > 0) {
          neuron.firing *= 0.85

          // Only update color if firing changed (pure blue)
          const colorIdx = neuron.index * 3
          const baseIntensity = 0.15
          const firingIntensity = neuron.firing * 0.85

          colors[colorIdx] = 0 // R
          colors[colorIdx + 1] = 0 // G
          colors[colorIdx + 2] = baseIntensity + firingIntensity // B (pure blue)
          colorsNeedUpdate = true
        }

        // Update refractory
        if (neuron.refractoryTimer > 0) {
          neuron.refractoryTimer -= dt
        }

        // Poisson spiking
        if (neuron.visible && neuron.refractoryTimer <= 0) {
          if (Math.random() < neuron.spikeChance * dt * 60) {
            fireNeuron(neuron)
          }
        }
      })

      if (colorsNeedUpdate) {
        neuronGeometry.attributes.color.needsUpdate = true
      }

      // Update packets
      synapses.forEach(synapse => {
        synapse.packets = synapse.packets.filter(packet => {
          packet.progress += packet.speed

          if (packet.progress >= 0.95 && packet.progress < 1.0) {
            synapse.to.spikeChance = Math.min(0.3, synapse.to.spikeChance * 1.5)
            if (Math.random() > 0.4) {
              fireNeuron(synapse.to)
            }
          }

          return packet.progress < 1.0
        })
      })

      // Update packet positions
      const packetPositions: number[] = []
      synapses.forEach(synapse => {
        synapse.packets.forEach(packet => {
          const pos = new THREE.Vector3().lerpVectors(
            synapse.from.position,
            synapse.to.position,
            packet.progress
          )
          packetPositions.push(pos.x, pos.y, pos.z)
        })
      })

      packetGeometry.setAttribute('position', new THREE.Float32BufferAttribute(packetPositions, 3))
    }

    // === PHASE CHOREOGRAPHY ===
    let phase = 0
    let phaseProgress = 0
    const phaseDurations = [0.6, 1.4, 0.8, 0.5]

    const updatePhase = (t: number) => {
      const totalTime = phaseDurations.reduce((a, b) => a + b, 0)
      const cycleTime = t % totalTime

      let accum = 0
      for (let i = 0; i < phaseDurations.length; i++) {
        if (cycleTime < accum + phaseDurations[i]) {
          phase = i
          phaseProgress = (cycleTime - accum) / phaseDurations[i]
          break
        }
        accum += phaseDurations[i]
      }

      // PHASE 0: Boot nucleus
      if (phase === 0) {
        const revealCount = Math.floor(neurons.length * 0.2 * phaseProgress)
        neurons.forEach((n, i) => {
          if (i < revealCount) {
            n.visible = true
            n.revealProgress = Math.min(1, n.revealProgress + 0.05)
            n.spikeChance = 0.002
          }
        })
      }

      // PHASE 1: Synaptic growth
      else if (phase === 1) {
        const revealCount = Math.floor(neurons.length * (0.2 + 0.5 * phaseProgress))
        neurons.forEach((n, i) => {
          if (i < revealCount) {
            n.visible = true
            n.revealProgress = Math.min(1, n.revealProgress + 0.03)
            n.spikeChance = 0.005 + phaseProgress * 0.01
          }
        })
      }

      // PHASE 2: Full cortex resonance
      else if (phase === 2) {
        neurons.forEach(n => {
          n.visible = true
          n.revealProgress = 1
          n.spikeChance = 0.015 + phaseProgress * 0.02
        })
      }

      // PHASE 3: Convergence
      else if (phase === 3) {
        neurons.forEach(n => {
          n.spikeChance = 0.1 * (1 - phaseProgress) + 0.8 * phaseProgress
        })
      }

      // Update neuron opacity based on reveal progress
      neuronMaterial.opacity = 0.15 + (phase / 3) * 0.15 // Max 0.30 to avoid blob
    }

    // === ANIMATION LOOP ===
    let rotationY = 0
    let mouseX = 0
    let mouseY = 0
    let targetRotationX = 0.1
    let targetRotationY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.3
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.3
      targetRotationY = mouseX
      targetRotationX = 0.1 + mouseY * 0.2
    }
    window.addEventListener('mousemove', handleMouseMove)

    let lastTime = Date.now()
    const startTime = Date.now()

    const animate = () => {
      const now = Date.now()
      const dt = (now - lastTime) / 1000
      lastTime = now

      const t = (now - startTime) / 1000

      updatePhase(t)
      updateSpikes(dt)

      // Smooth camera rotation with mouse parallax
      rotationY += (targetRotationY - rotationY) * 0.05

      neuronPoints.rotation.y = rotationY
      neuronPoints.rotation.x = targetRotationX

      // Rotate synapse mesh with neurons (no rebuilding)
      synapseMesh.rotation.copy(neuronPoints.rotation)

      packetPoints.rotation.copy(neuronPoints.rotation)

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()

    // === RESIZE ===
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // === CLEANUP ===
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      containerRef.current?.removeChild(renderer.domElement)
      neuronGeometry.dispose()
      neuronMaterial.dispose()
      packetGeometry.dispose()
      packetMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 10000,
        cursor: 'default',
        pointerEvents: 'auto'
      }}
    />
  )
}
