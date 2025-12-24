// Types
import type { GUI } from 'lil-gui'
import type { RootState } from 'store'

// Fonts
import fnt from '/fonts/MSDF/SairaSemiCondensed-SemiBold-msdf.json?url'
import png from '/fonts/MSDF/SairaSemiCondensed-SemiBold.png?url'

// Utils
import * as THREE from 'three'
import { gsap } from 'gsap'
import lerp from 'utils/lerp'
import { scaleValue, randomIntFromInterval } from 'utils/math'
import { Howl } from 'howler'
import breakpoints from 'utils/breakpoints'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'
import { rootNavigate } from 'components/CustomRouter'
import {
  ClickableMesh,
  StateMaterialSet,
  MouseEventManager,
  ThreeMouseEventType
} from '@masatomakino/threejs-interactive-object'
import { MSDFTextGeometry, uniforms } from '../utils/MSDFText'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import StoreWatcher from '../utils/StoreWatcher'

// Shaders
import vertexShader from './shaders/portfolio/vertex'
import fragmentShader from './shaders/portfolio/fragment'
import captionVertexShader from './shaders/title/vertex'
import captionFragmentShader from './shaders/title/fragment'
import flashcardVertexShader from './shaders/flashcard/vertex'
import flashcardFragmentShader from './shaders/flashcard/fragment'

// Components
import Experience from '../Experience'
import { createProjectCardTexture } from '../utils/projectCardGenerator'

type DebugObject = {
  offsetX: number
  offsetY: number
  offsetZ: number
  iColorOuter: THREE.Color
  iColorInner: THREE.Color
}

type ItemSnapshot = {
  position: THREE.Vector3
  rotation: THREE.Euler
  iFactor: number
}

type Project = {
  name: string
  url: string
}

export default class Portfolio {
  experience: Experience
  scene: Experience['scene']
  world: Experience['world']
  resources: Experience['resources']
  debug: Experience['debug']
  time: Experience['time']
  sizes: Experience['sizes']
  debugFolder: GUI | undefined
  group!: THREE.Group
  groupPosition!: THREE.Vector3
  items!: THREE.Mesh[]
  captions!: THREE.Mesh[]
  snapshots: ItemSnapshot[]
  debugObject: DebugObject
  material!: StateMaterialSet
  camera: THREE.PerspectiveCamera
  howls: Howl[]
  manager: MouseEventManager | undefined
  projects: Project[]
  scrollBoundaries: [number, number]
  screenSizes: { screenWidth: number; screenHeight: number }
  xPosition: number
  scrollOffset: number
  isVisible: boolean
  visibleItemIndex: number
  flippedStates: boolean[]
  frontTextures: THREE.CanvasTexture[]
  backTextures: THREE.CanvasTexture[]
  positionTween: gsap.core.Tween | null
  targetXPosition: number

  constructor() {
    this.isVisible = false
    this.scrollBoundaries = [0, 0]
    this.xPosition = 0
    this.scrollOffset = 0
    this.visibleItemIndex = -1
    this.snapshots = []
    this.flippedStates = []
    this.frontTextures = []
    this.backTextures = []
    this.positionTween = null
    this.targetXPosition = 0

    this.experience = new Experience()
    this.resources = this.experience.resources
    this.scene = this.experience.scene
    this.world = this.experience.world
    this.sizes = this.experience.sizes

    this.time = this.experience.time

    this.camera = this.experience.world.cameraOnPath.camera
    if (this.camera && this.experience.renderer.canvas) {
      this.manager = new MouseEventManager(this.scene, this.camera, this.experience.renderer.canvas)
    }

    const bells = 4
    this.howls = []
    for (let i = 1; i <= bells; i++) {
      this.howls.push(
        new Howl({
          src: [`/audio/bell${i}.mp3`],
          volume: 1
        })
      )
    }

    this.projects = [
      {
        name: 'Accessibility Agents',
        url: 'accessibility'
      },
      {
        name: 'EC-TSS',
        url: 'ectss'
      },
      {
        name: 'AWS Agentic System',
        url: 'aws-agentic'
      },
      {
        name: 'Multimodal Web Agents',
        url: 'multimodal'
      },
      {
        name: 'VTI Aero',
        url: 'vti-aero'
      },
      {
        name: 'Retrospect AI',
        url: 'retrospect-ai'
      },
      {
        name: 'Aero-LLM',
        url: 'aerollm'
      },
      {
        name: 'Net-GPT',
        url: 'net-gpt'
      },
      {
        name: 'Heterogeneous Generative Dataset',
        url: 'heterogeneous-dataset'
      }
    ]

    this.debug = this.experience.debug

    if (this.debug.active) {
      this.debugFolder = this.debug.ui?.addFolder('Portfolio').close()
    }

    this.debugObject = {
      offsetX: 1.9,
      offsetY: -0.039,
      offsetZ: -1,
      iColorOuter: new THREE.Color(0x426ff5),
      iColorInner: new THREE.Color(0xc9ddf2)
    }

    this.setItems()
    this.setCaptions()
    this.screenSizes = this.getScreenSizes()

    const storeWatcher = new StoreWatcher()
    storeWatcher.addListener(this.stateChangeHandler.bind(this))
  }

  stateChangeHandler(state: RootState, prevState: RootState) {
    const currentSection = state.section.current
    const prevSection = prevState.section.current

    // Section
    if (currentSection !== prevSection && currentSection === 'portfolio') {
      this.enterAnimation()
    }

    if (currentSection !== prevSection && prevSection === 'portfolio') {
      this.leaveAnimation()
    }

    // Menu
    const menuOpen = state.menu.open
    const prevMenuOpen = prevState.menu.open
    if (menuOpen && !prevMenuOpen) {
      // Open Menu
      this.openMenuAnimation()
    }
    if (!menuOpen && prevMenuOpen) {
      // Close Menu
      this.closeMenuAnimation()
    }
  }

  setItems() {
    this.group = new THREE.Group()
    this.group.name = 'portfolio'

    // Set the group in front of the camera
    const { offsetX, offsetY, offsetZ } = this.debugObject
    this.group.position.set(offsetX, offsetY, offsetZ)

    this.items = []

    for (let i = 0; i < this.projects.length; i++) {
      // Geometry - PlaneGeometry for flat cards
      const geometry = new THREE.PlaneGeometry(0.7, 0.5, 12, 12)

      // Create both front and back textures
      const { name, url } = this.projects[i]
      const frontTexture = createProjectCardTexture(url, false)
      const backTexture = createProjectCardTexture(url, true)
      const maxAnisotropy = this.experience.renderer.instance.capabilities.getMaxAnisotropy()

      frontTexture.encoding = THREE.sRGBEncoding
      backTexture.encoding = THREE.sRGBEncoding
      frontTexture.anisotropy = maxAnisotropy
      backTexture.anisotropy = maxAnisotropy

      this.frontTextures[i] = frontTexture
      this.backTextures[i] = backTexture
      this.flippedStates[i] = false

      // Custom shader material with adjusted fresnel for glossy flat cards
      const uniforms = {
        time: { value: this.time.clockElapsed },
        cardTexture: { value: frontTexture },
        outline: { value: this.resources.items.manVibrantSkin },
        fresnelMax: { value: 2.1 },
        fresnelMultiplier: { value: 1.1 }
      }

      const cardMaterial = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: flashcardVertexShader,
        fragmentShader: flashcardFragmentShader,
        side: THREE.DoubleSide,
        transparent: false
      })

      const material = new StateMaterialSet({
        normal: cardMaterial
      })

      const clickableMesh: ClickableMesh & { pathname?: string } = new ClickableMesh({
        geo: geometry,
        material
      })
      clickableMesh.castShadow = false
      clickableMesh.receiveShadow = false
      clickableMesh.name = name
      clickableMesh.pathname = url
      clickableMesh.position.set(i * 1.1, 0, -0.5)
      clickableMesh.rotation.set(Math.PI / 4, Math.PI / -8, 0)

      // Click handler for flipping cards (Quizlet-style)
      clickableMesh.addEventListener(ThreeMouseEventType.CLICK, () => {
        if (!this.isVisible) return
        this.flipCard(i)
      })
      clickableMesh.addEventListener(ThreeMouseEventType.OVER, () => {
        window.store.dispatch.pointer.setType('hover')
        const index = randomIntFromInterval(1, this.howls.length - 1)
        if (this.howls[index]) {
          this.howls[index].play()
        }
      })
      clickableMesh.addEventListener(ThreeMouseEventType.OUT, () => {
        window.store.dispatch.pointer.setType('default')
      })

      this.group.add(clickableMesh)
      this.items[i] = clickableMesh
    }

    this.setScale()

    this.camera.add(this.group)

    // Debug
    if (this.debug.active && this.debugFolder) {
      this.debugFolder
        .add(this.debugObject, 'offsetY')
        .min(-5)
        .max(5)
        .step(0.001)
        .onChange(() => {
          this.group.position.y = this.debugObject.offsetY
        })
      this.debugFolder
        .add(this.debugObject, 'offsetZ')
        .min(-5)
        .max(5)
        .step(0.001)
        .onChange(() => {
          this.group.position.z = this.debugObject.offsetZ
        })
    }
  }

  setCaptions() {
    const promises = [this.loadFontAtlas(png), this.loadFont(fnt)]

    this.captions = []

    return Promise.all(promises).then(([atlas, fnt]) => {
      const font = (fnt as { data: any }).data

      for (let i = 0; i < this.items.length; i++) {
        const geometry = new MSDFTextGeometry({
          text: this.items[i].name,
          font
        })
        const material = new THREE.ShaderMaterial({
          side: THREE.DoubleSide,
          transparent: true,
          defines: {
            IS_SMALL: false
          },
          extensions: {
            derivatives: true
          },
          uniforms: {
            // Common
            ...uniforms.common,

            // Rendering
            ...uniforms.rendering,

            // Strokes
            ...uniforms.strokes,

            uOpacity: { value: 1.0 },

            uStrokeOutsetWidth: { value: 0.1 },
            uStrokeInsetWidth: { value: 0.0 },
            uProgress1: { value: 1 },
            uProgress2: { value: 0 },
            uProgress3: { value: 0 },
            uProgress4: { value: 0 },
            uProgress5: { value: 0 },
            uDirection: { value: 1 }
          },
          vertexShader: captionVertexShader,
          fragmentShader: captionFragmentShader
        })
        material.uniforms.uMap.value = atlas

        const mesh = new THREE.Mesh(geometry, material)
        mesh.rotation.x = Math.PI

        this.captions[i] = mesh

        this.group.add(mesh)
      }
      this.positionCaptions()
    })
  }

  positionCaptions() {
    const captions = this.group.children.filter(
      (mesh) => (mesh as THREE.Mesh).geometry instanceof MSDFTextGeometry
    )
    for (let i = 0; i < captions.length; i++) {
      const mesh = captions[i]
      if (this.sizes.width >= breakpoints.mdL) {
        const scale = 0.0025  // Further reduced to prevent overlap
        mesh.scale.set(scale, scale, scale)
        mesh.position.set(i * 1.1 - 0.06, -0.32, 0.1)  // Adjusted Y position lower
      } else {
        const scale = 0.001  // Further reduced
        mesh.scale.set(scale, scale, scale)
        mesh.position.set(i * 0.5 - 0.06, -0.14, 0.1)
      }
    }
  }

  enterAnimation() {
    this.isVisible = true
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].visible = this.isVisible
      this.captions[i].visible = this.isVisible
    }

    this.setBoundaries()
    this.scrollHandler()
    window.addEventListener('scroll', this.scrollHandler)
  }

  revealItem(index: number) {
    if (!this.items[index]) return

    const duration = 3
    const delay = 0.3
    const ease = 'power3.out'

    gsap.to(this.items[index].position, {
      z: 0,
      duration,
      delay,
      ease
    })
    gsap.to(this.items[index].rotation, {
      x: 0,
      y: 0,
      duration,
      delay,
      ease
    })
    // Glossy appearance maintained by adjusted fresnel parameters in shader uniforms
  }

  openMenuAnimation() {
    // Save snapshots and animate captions
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]
      const caption = this.captions[i]

      const captionMaterial = caption.material as THREE.ShaderMaterial

      this.snapshots.push({
        position: item.position,
        rotation: item.rotation,
        iFactor: 1.0  // Not used with shader material, but kept for compatibility
      })

      gsap.killTweensOf(captionMaterial.uniforms.uOpacity, 'value')
      // Animation - fade out caption when menu opens
      gsap.to(captionMaterial.uniforms.uOpacity, {
        value: 0,
        duration: 1.5,
        ease: 'power3.out'
      })
      // Shader material maintains glossy appearance automatically
    }
  }

  closeMenuAnimation() {
    // Position group based on the next section
    const portfolioSectionIndex = 1
    const newSectionIndex = window.store.getState().menu.index

    if (newSectionIndex !== portfolioSectionIndex) {
      // Set this.isVisible false and stop animation in loop
      this.leaveAnimation()
      requestAnimationFrame(() => {
        this.scrollHandler()
        gsap.killTweensOf(this.group.position, 'x')
        this.group.position.x = this.xPosition
      })
    }

    // Restore caption visibility
    for (let i = 0; i < this.items.length; i++) {
      const caption = this.captions[i]
      const captionMaterial = caption.material as THREE.ShaderMaterial

      // Animation - fade caption back in
      gsap.killTweensOf(captionMaterial.uniforms.uOpacity, 'value')
      gsap.to(captionMaterial.uniforms.uOpacity, {
        value: 1,
        duration: 1.5,
        ease: 'power3.inOut'
      })
      // Shader material maintains glossy appearance automatically
    }

    // Restore snapshot
    this.snapshots = []
  }

  flipCard(index: number) {
    const item = this.items[index]
    const itemMaterial = item.material as THREE.ShaderMaterial
    const isFlipped = this.flippedStates[index]

    // Create flip animation without lateral inversion
    // Scale down on X-axis, swap texture at midpoint, scale back up
    const timeline = gsap.timeline()

    // First half: scale down to 0
    timeline.to(item.scale, {
      x: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        // Swap cardTexture uniform at the invisible midpoint
        const nextTexture = isFlipped ? this.frontTextures[index] : this.backTextures[index]
        itemMaterial.uniforms.cardTexture.value = nextTexture
        itemMaterial.needsUpdate = true
        // Update flipped state
        this.flippedStates[index] = !isFlipped
      }
    })

    // Second half: scale back up
    timeline.to(item.scale, {
      x: this.sizes.width >= breakpoints.mdL ? 1 : 0.4,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  restoreItems() {
    // for (const item of this.items) {
    //   // @ts-ignore
    //   gsap.killTweensOf(item.material.uniforms.iFactor, 'value')
    //   // @ts-ignore
    //   gsap.set(item.material.uniforms.iFactor, { value: 2 })
    // }
  }

  scrollHandler = () => {
    this.xPosition = scaleValue(window.scrollY, this.scrollBoundaries, [
      this.debugObject.offsetX,
      -this.projects.length - 1
    ])
  }

  leaveAnimation() {
    this.isVisible = false
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].visible = this.isVisible
      this.captions[i].visible = this.isVisible
    }
    this.restoreItems()
    window.removeEventListener('scroll', this.scrollHandler)
  }

  openProjectAnimation() {
    // Get the project name and its card
    const location = window.comingLocation
    const projectName = location.pathname.split('/')[1]

    const item = this.items.find(
      (item) => (item as THREE.Mesh & { pathname: string }).pathname === projectName
    )
    if (!item) throw new Error('Project not found')

    // Disable scroll
    disablePageScroll()

    // move object to scene without changing it's world orientation
    // restored in closeProjectAnimation
    this.scene.attach(item)

    this.camera.updateMatrixWorld()

    const distanceFromCamera = 0.5
    const target = new THREE.Vector3(0, 0, -distanceFromCamera)
    target.applyMatrix4(this.camera.matrixWorld)

    // Position
    gsap.to(item.position, {
      x: target.x,
      y: target.y,
      z: target.z,
      duration: 1,
      ease: 'power4.in'
    })

    // Transition
    gsap.to(item.rotation, {
      x: this.camera.rotation.x,
      y: this.camera.rotation.y,
      z: this.camera.rotation.z,
      duration: 1,
      ease: 'power4.in'
    })
  }

  closeProjectAnimation() {
    const name = window.currentLocation.pathname.split('/')[1]

    const index = this.items.findIndex(
      (item) => (item as THREE.Mesh & { pathname: string }).pathname === name
    )
    const item = this.items[index]
    if (!item) throw new Error('Project not found')

    // move object to parent without changing it's world orientation
    this.group.attach(item)

    this.camera.updateMatrixWorld()

    // Position
    gsap.to(item.position, {
      x: index * 1.1,
      y: 0,
      z: 0,
      delay: 0.7,
      ease: 'power4.inOut',
      duration: 1.4
    })

    // Transition
    gsap.to(item.rotation, {
      x: 0,
      y: 0,
      z: 0,
      delay: 0.7,
      ease: 'power4.inOut',
      duration: 1.4,
      onComplete: () => {
        // Enable scroll
        enablePageScroll()
      }
    })
  }

  setScale() {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]
      if (this.sizes.width >= breakpoints.mdL) {
        item.scale.set(1, 1, 1)
        // item.position.set(i * 1.1, 0, 0)
        item.position.x = i * 1.1
      } else {
        const item = this.items[i]
        item.scale.set(0.4, 0.4, 0.4)
        // item.position.set(i * 0.5, 0, 0)
        item.position.x = i * 0.5
      }
    }
  }

  setBoundaries() {
    const cardContainerEl = document.getElementById('card-container')
    if (cardContainerEl) {
      const start = cardContainerEl.offsetTop + this.sizes.height + this.sizes.height * 0.5 // adding half height to enter the cards after the text
      const end = start + cardContainerEl.clientHeight + this.sizes.height * 0.5
      this.scrollBoundaries = [start, end]
    }
  }

  loadFontAtlas(path: string) {
    const promise = new Promise((resolve) => {
      const loader = new THREE.TextureLoader()
      loader.load(path, resolve)
    })

    return promise
  }

  loadFont(path: string) {
    const promise = new Promise((resolve) => {
      const loader = new FontLoader()
      loader.load(path, resolve)
    })

    return promise
  }

  getScreenSizes(): { screenWidth: number; screenHeight: number } {
    // Find out the width of a rendered portion of the scene
    // https://stackoverflow.com/a/13351534/2150128
    const vFOV = THREE.MathUtils.degToRad(this.camera.fov) // convert vertical fov to radians
    const screenHeight = 2 * Math.tan(vFOV / 2) * Math.abs(this.debugObject.offsetZ) // visible height
    let screenWidth = screenHeight * this.camera.aspect // visible width

    // Clamp for ultrawide screens to prevent off-screen cards from being visible
    const MAX_SCREEN_WIDTH = 2.0
    screenWidth = Math.min(screenWidth, MAX_SCREEN_WIDTH)

    return { screenWidth, screenHeight }
  }

  update() {
    if (!this.isVisible) return

    const scrollY = window.scrollY
    this.scrollOffset = lerp(this.scrollOffset, scrollY, 0.1)

    let i = 0
    for (const item of this.items) {
      const itemMaterial = item.material as THREE.ShaderMaterial
      if (itemMaterial.uniforms && itemMaterial.uniforms.time) {
        itemMaterial.uniforms.time.value = this.time.clockElapsed
      }

      const itemX = this.group.position.x + i * (this.sizes.width >= breakpoints.mdL ? 1.1 : 0.5)

      if (itemX < this.screenSizes.screenWidth && this.visibleItemIndex < i) {
        this.visibleItemIndex = i
        this.revealItem(i)
      }

      i++
    }

    // Only create new tween if position changed significantly (> 0.01 units)
    if (Math.abs(this.targetXPosition - this.xPosition) > 0.01) {
      this.targetXPosition = this.xPosition

      // Kill existing tween before creating new one
      if (this.positionTween) this.positionTween.kill()

      this.positionTween = gsap.to(this.group.position, {
        x: this.xPosition,
        duration: 1
      })
    }
  }

  resize() {
    this.setScale()
    this.setBoundaries()
    this.positionCaptions()
  }
}
