import './main.css'
import { Clock, Scene, LoadingManager, WebGLRenderer, sRGBEncoding, Group, PerspectiveCamera, DirectionalLight, PointLight, MeshPhongMaterial } from 'three'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/////////////////////////////////////////////////////////////////////////
//// LOADING MANAGER
const ftsLoader = document.querySelector(".lds-roller")
const looadingCover = document.getElementById("loading-text-intro")
const loadingManager = new LoadingManager()

loadingManager.onLoad = function() {
    document.querySelector(".main-container").style.visibility = 'visible'
    document.querySelector("body").style.overflow = 'auto'

    const yPosition = {y: 0}
    
    new TWEEN.Tween(yPosition).to({y: 100}, 900).easing(TWEEN.Easing.Quadratic.InOut).start()
    .onUpdate(function(){ looadingCover.style.setProperty('transform', `translate( 0, ${yPosition.y}%)`)})
    .onComplete(function () {looadingCover.parentNode.removeChild(document.getElementById("loading-text-intro")); TWEEN.remove(this)})

    introAnimation()
    ftsLoader.parentNode.removeChild(ftsLoader)

    window.scroll(0, 0)
}

/////////////////////////////////////////////////////////////////////////
//// DRACO LOADER
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/') // Certifique-se que este caminho está correto
dracoLoader.setDecoderConfig({ type: 'js' })
const loader = new GLTFLoader(loadingManager)
loader.setDRACOLoader(dracoLoader)

/////////////////////////////////////////////////////////////////////////
///// DIV CONTAINERS
const container = document.getElementById('canvas-container')
const containerDetails = document.getElementById('canvas-container-details')

/////////////////////////////////////////////////////////////////////////
///// GENERAL VARIABLES
let secondContainer = false
let width = container.clientWidth
let height = container.clientHeight

/////////////////////////////////////////////////////////////////////////
///// SCENE
const scene = new Scene()

/////////////////////////////////////////////////////////////////////////
///// RENDERERS
const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance"})
renderer.autoClear = true
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1))
renderer.setSize( width, height)
renderer.outputEncoding = sRGBEncoding
container.appendChild(renderer.domElement)

const renderer2 = new WebGLRenderer({ antialias: false})
renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1))
renderer2.setSize( width, height)
renderer2.outputEncoding = sRGBEncoding
containerDetails.appendChild(renderer2.domElement)

/////////////////////////////////////////////////////////////////////////
///// CAMERAS
const cameraGroup = new Group()
scene.add(cameraGroup)

const camera = new PerspectiveCamera(35, width / height, 1, 100)
camera.position.set(19, 1.54, -0.1) // Posição inicial geral
cameraGroup.add(camera)

const camera2 = new PerspectiveCamera(35, containerDetails.clientWidth / containerDetails.clientHeight, 1, 100)
// Posição inicial para a visão de detalhes (focada na asa dianteira)
camera2.position.set(6, 0.5, 4.5)
camera2.rotation.set(0, 1.1, 0)
scene.add(camera2)

/////////////////////////////////////////////////////////////////////////
///// RESIZE
window.addEventListener('resize', () => {
    width = container.clientWidth
    height = container.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    
    camera2.aspect = containerDetails.clientWidth / containerDetails.clientHeight
    camera2.updateProjectionMatrix()

    renderer.setSize(width, height)
    renderer2.setSize(containerDetails.clientWidth, containerDetails.clientHeight)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1))
    renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1))
})

/////////////////////////////////////////////////////////////////////////
///// LIGHTS
const sunLight = new DirectionalLight(0x435c72, 0.08)
sunLight.position.set(-100,0,-100)
scene.add(sunLight)

// --- ALTERAÇÕES ASTON MARTIN ---
// LUZ ALTERADA PARA VERDE ASTON MARTIN
const fillLight = new PointLight(0x26492c, 3.5, 6, 2.5)
fillLight.position.set(30,3,1.8)
scene.add(fillLight)

/////////////////////////////////////////////////////////////////////////
///// LOADING MODEL
// Mude o caminho para o seu modelo do Aston Martin se for diferente
loader.load('models/gltf/aston_martin_f1_amr23_2023.glb', function (gltf) {
    // MODELO MAIOR E MAIS PARA CIMA
    gltf.scene.scale.set(1.6, 1.6, 1.6)
    gltf.scene.position.y = -0.8
    scene.add(gltf.scene)
})
// --- FIM DAS ALTERAÇÕES ---


/////////////////////////////////////////////////////////////////////////
//// INTRO ANIMATION
function introAnimation() {
    new TWEEN.Tween(camera.position.set(0, 10, 15)).to({ x: 0, y: 1.5, z: 12}, 3500).easing(TWEEN.Easing.Quadratic.InOut).start()
    .onComplete(function () {
        TWEEN.remove(this)
        document.querySelector('.header').classList.add('ended')
        document.querySelector('.first>p').classList.add('ended')
    })
}

//////////////////////////////////////////////////
//// CLICK LISTENERS PARA O CARRO
document.getElementById('aglaea').addEventListener('click', () => { // Asa Dianteira
    document.getElementById('aglaea').classList.add('active')
    document.getElementById('euphre').classList.remove('active')
    document.getElementById('thalia').classList.remove('active')
    document.getElementById('content').innerHTML = 'Projetada para máxima eficiência aerodinâmica, guiando o fluxo de ar para o resto do carro e gerando downforce essencial para as curvas.'
    animateCamera({ x: 6, y: 0.5, z: 4.5 },{ y: 1.1 }) // Posição e rotação para a asa dianteira
})

document.getElementById('thalia').addEventListener('click', () => { // Cockpit
    document.getElementById('thalia').classList.add('active')
    document.getElementById('aglaea').classList.remove('active')
    document.getElementById('euphre').classList.remove('active')
    document.getElementById('content').innerHTML = 'O centro de controlo do piloto, equipado com tecnologia de ponta para monitorização e performance, e protegido pelo sistema de segurança Halo.'
    animateCamera({ x: 0.5, y: 1.8, z: 4 },{ y: 0.1 }) // Posição e rotação para o cockpit
})

document.getElementById('euphre').addEventListener('click', () => { // Asa Traseira
    document.getElementById('euphre').classList.add('active')
    document.getElementById('aglaea').classList.remove('active')
    document.getElementById('thalia').classList.remove('active')
    document.getElementById('content').innerHTML = 'Sistema de Redução de Arrasto (DRS) que abre para aumentar a velocidade máxima nas retas, uma vantagem tática crucial durante as corridas.'
    animateCamera({ x: -6.5, y: 1.2, z: 3.5 },{ y: -0.8 }) // Posição e rotação para a asa traseira
})

/////////////////////////////////////////////////////////////////////////
//// ANIMATE CAMERA
function animateCamera(position, rotation){
    new TWEEN.Tween(camera2.position).to(position, 1800).easing(TWEEN.Easing.Quadratic.InOut).start()
    .onComplete(function () { TWEEN.remove(this) })
    new TWEEN.Tween(camera2.rotation).to(rotation, 1800).easing(TWEEN.Easing.Quadratic.InOut).start()
    .onComplete(function () { TWEEN.remove(this) })
}

/////////////////////////////////////////////////////////////////////////
//// PARALLAX
const cursor = {x:0, y:0}
const clock = new Clock()
let previousTime = 0

/////////////////////////////////////////////////////////////////////////
//// RENDER LOOP
function rendeLoop() {
    TWEEN.update()

    if (secondContainer){
        renderer2.render(scene, camera2)
    } else{
        renderer.render(scene, camera)
    }

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    const parallaxY = cursor.y
    fillLight.position.y -= ( parallaxY * 9 + fillLight.position.y -2) * deltaTime

    const parallaxX = cursor.x
    fillLight.position.x += (parallaxX *8 - fillLight.position.x) * 2 * deltaTime

    cameraGroup.position.z -= (parallaxY/3 + cameraGroup.position.z) * 2 * deltaTime
    cameraGroup.position.x += (parallaxX/3 - cameraGroup.position.x) * 2 * deltaTime

    requestAnimationFrame(rendeLoop)
}
rendeLoop()

//////////////////////////////////////////////////
//// MOUSE MOVE
document.addEventListener('mousemove', (event) => {
    event.preventDefault()
    cursor.x = event.clientX / window.innerWidth -0.5
    cursor.y = event.clientY / window.innerHeight -0.5
    handleCursor(event)
}, false)

//////////////////////////////////////////////////
//// SCROLL OBSERVER
const watchedSection = document.querySelector('.second')

function obCallback(payload) {
    if (payload[0].intersectionRatio > 0.05){
        secondContainer = true
    }else{
        secondContainer = false
    }
}
const ob = new IntersectionObserver(obCallback, { threshold: 0.05 })
ob.observe(watchedSection)

//////////////////////////////////////////////////
//// MAGNETIC MENU CURSOR
const btn = document.querySelectorAll('nav > .a')
const customCursor = document.querySelector('.cursor')

function update(e) {
    const span = this.querySelector('span')
    if(e.type === 'mouseleave') {
        span.style.cssText = ''
    } else {
        const { offsetX: x, offsetY: y } = e,{ offsetWidth: width, offsetHeight: height } = this,
        walk = 20, xWalk = (x / width) * (walk * 2) - walk, yWalk = (y / height) * (walk * 2) - walk
        span.style.cssText = `transform: translate(${xWalk}px, ${yWalk}px);`
    }
}

const handleCursor = (e) => {
    const x = e.clientX
    const y =  e.clientY
    customCursor.style.cssText =`left: ${x}px; top: ${y}px;`
}

btn.forEach(b => b.addEventListener('mousemove', update))
btn.forEach(b => b.addEventListener('mouseleave', update))