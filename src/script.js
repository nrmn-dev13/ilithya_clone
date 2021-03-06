import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xff69b4);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/9.png')
const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

const donutGeometry = new THREE.TorusBufferGeometry(0.20, 0.10, 16, 100)
const boxGeometry = new THREE.BoxBufferGeometry(0.25, 0.25, 0.25)


for (let i = 0; i < 150; i++) {
  const donut = new THREE.Mesh(donutGeometry, material)
  donut.position.x = (Math.random() - 0.5) * 10
  donut.position.y = (Math.random() - 0.5) * 10
  donut.position.z = (Math.random() - 0.5) * 10

  donut.rotation.x = Math.random() * Math.PI
  donut.rotation.y = Math.random() * Math.PI

  const scale = Math.random()
  donut.scale.set(scale, scale, scale)

  scene.add(donut)
}
for (let i = 0; i < 150; i++) {
  const box = new THREE.Mesh(boxGeometry, material)
  box.position.x = (Math.random() - 0.5) * 10
  box.position.y = (Math.random() - 0.5) * 10
  box.position.z = (Math.random() - 0.5) * 10

  box.rotation.x = Math.random() * Math.PI
  box.rotation.y = Math.random() * Math.PI

  const scale = Math.random()
  box.scale.set(scale, scale, scale)

  scene.add(box)
}


/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader()
fontLoader.load(
  '/fonts/helvetiker_regular.typeface.json',
  (font) => {
    const textGeometry = new THREE.TextBufferGeometry(
      'Hello Three.js',
      {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4
      }
    )
    textGeometry.center()
    const text = new THREE.Mesh(textGeometry, material)
    // text.rotation.z = 0.5 * 2;
    scene.add(text)

    const clock = new THREE.Clock()

    const textRotation = () => {

      const elapsedTime = clock.getElapsedTime()

      // text.rotation.x = Math.cos(elapsedTime * 0.3)
      // text.rotation.z = Math.sin(elapsedTime * 0.3)

      window.requestAnimationFrame(textRotation)
    }

    textRotation()
  }
)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableZoom = false;
controls.enableRotate = false;
controls.enabled = false
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Animate
 */
const clock = new THREE.Clock()
const cursor = {
  x: Math.random(),
  y: Math.random()
}

window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5
  cursor.y = -(event.clientY / sizes.height - 0.5)
})

gsap.from(camera.position, { duration: 1, delay: 0, z: 20 })
gsap.to(camera.position, { duration: 1, delay: 0.5, z: 3 })

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  
  camera.position.x = Math.sin((cursor.x / Math.PI) * elapsedTime * 1) * 5.5;
  camera.position.y = Math.sin((cursor.y / Math.PI) * elapsedTime * 1) * 5.5;
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()

