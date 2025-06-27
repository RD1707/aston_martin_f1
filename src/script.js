import './main.css'
import { Clock, Scene, LoadingManager, WebGLRenderer, sRGBEncoding, Group, PerspectiveCamera, DirectionalLight, PointLight, AmbientLight } from 'three' // Adicionada AmbientLight
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
dracoLoader.setDecoderPath('/draco/')
dracoLoader.setDecoderConfig({ type: 'js' })
const loader = new GLTFLoader(loadingManager)
loader.setDRACOLoader(dracoLoader)

/////////////////////////////////////////////////////////////////////////
///// DIV CONTAINER
const container = document.getElementById('canvas-container')
const containerDetails = document.getElementById('canvas-container-details')

/////////////////////////////////////////////////////////////////////////
///// GENERAL VARIABLES
let secondContainer = false
let width = container.clientWidth
let height = container.clientHeight

/////////////////////////////////////////////////////////////////////////
///// SCENE CREATION
const scene = new Scene()

/////////////////////////////////////////////////////////////////////////
///// RENDERER CONFIG
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
///// CAMERAS CONFIG
const cameraGroup = new Group()
scene.add(cameraGroup)

const camera = new PerspectiveCamera(35, width / height, 1, 100)
// Posição ajustada para a cena inicial do carro
camera.position.set(0, 2, 12)
cameraGroup.add(camera)

const camera2 = new PerspectiveCamera(35, containerDetails.clientWidth / containerDetails.clientHeight, 1, 100)
// Posição inicial da câmera de detalhes, olhando para o carro de lado
camera2.position.set(5, 1.5, 5)
camera2.rotation.set(0, 0.8, 0)
scene.add(camera2)

/////////////////////////////////////////////////////////////////////////
///// RESIZE EVENT
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    
    camera2.aspect = containerDetails.clientWidth / containerDetails.clientHeight
    camera2.updateProjectionMatrix()

    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer2.setSize(containerDetails.clientWidth, containerDetails.clientHeight)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1))
    renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1))
})

/////////////////////////////////////////////////////////////////////////
///// SCENE LIGHTS - Luzes ajustadas para o carro
// Luz ambiente para preencher a cena
const ambientLight = new AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// Luz direcional principal, como o sol
const sunLight = new DirectionalLight(0xffffff, 1.5)
sunLight.position.set(5, 5, 5)
scene.add(sunLight)

// Luz de preenchimento para destacar detalhes
const fillLight = new PointLight(0x88b2d9, 3.0, 6, 2)
fillLight.position.set(-5, 2, -3)
scene.add(fillLight)


/////////////////////////////////////////////////////////////////////////
///// LOADING GLB/GLTF MODEL
// Alterado o caminho para o modelo do Aston Martin
loader.load('models/gltf/aston_martin_f1_amr23_2023.glb', function (gltf) {
    const model = gltf.scene
    // Ajuste a posição e escala do carro se necessário
    model.scale.set(1.2, 1.2, 1.2)
    model.position.y = -1 // Ajusta a altura do carro para que as rodas toquem o "chão"
    scene.add(model)
})


/////////////////////////////////////////////////////////////////////////
//// INTRO CAMERA ANIMATION
// Animação de introdução ajustada para o carro
function introAnimation() {
    new TWEEN.Tween(camera.position).to({ x: 0, y: 1.5, z: 7 }, 3500).easing(TWEEN.Easing.Quadratic.InOut).start()
    .onComplete(function () {
        TWEEN.remove(this)
        document.querySelector('.header').classList.add('ended')
        document.querySelector('.first>p').classList.add('ended')
    })
}

//////////////////////////////////////////////////
//// CLICK LISTENERS - Alterado para os pontos de interesse do carro
// Certifique-se que o seu HTML tem botões com os IDs: 'asa-dianteira', 'cockpit', e 'asa-traseira'

document.getElementById('asa-dianteira').addEventListener('click', () => {
    // Ativa o botão correto
    document.getElementById('asa-dianteira').classList.add('active')
    document.getElementById('cockpit').classList.remove('active')
    document.getElementById('asa-traseira').classList.remove('active')
    // Atualiza o texto de descrição
    document.getElementById('content').innerHTML = 'Asa dianteira: Projetada para máxima eficiência aerodinâmica, guiando o fluxo de ar para o resto do carro e gerando downforce essencial para as curvas.'
    // Anima a câmera para focar na asa dianteira
    animateCamera({ x: 3.5, y: 0.2, z: 2.5 },{ y: 1.8 })
})

document.getElementById('cockpit').addEventListener('click', () => {
    // Ativa o botão correto
    document.getElementById('cockpit').classList.add('active')
    document.getElementById('asa-dianteira').classList.remove('active')
    document.getElementById('asa-traseira').classList.remove('active')
    // Atualiza o texto de descrição
    document.getElementById('content').innerHTML = 'Cockpit: O centro de controlo do piloto, equipado com tecnologia de ponta para monitorização e performance, e protegido pelo sistema de segurança Halo.'
    // Anima a câmera para focar no cockpit
    animateCamera({ x: 0.5, y: 2.0, z: 2.8 },{ y: 0.4 })
})

document.getElementById('asa-traseira').addEventListener('click', () => {
    // Ativa o botão correto
    document.getElementById('asa-traseira').classList.add('active')
    document.getElementById('asa-dianteira').classList.remove('active')
    document.getElementById('cockpit').classList.remove('active')
    // Atualiza o texto de descrição
    document.getElementById('content').innerHTML = 'Asa traseira com DRS: Sistema de Redução de Arrasto (DRS) que abre para aumentar a velocidade máxima nas retas, uma vantagem tática crucial durante as corridas.'
    // Anima a câmera para focar na asa traseira
    animateCamera({ x: -4.5, y: 0.9, z: 1.5 },{ y: -1.5 })
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
//// PARALLAX CONFIG
const cursor = {x:0, y:0}
const clock = new Clock()
let previousTime = 0

/////////////////////////////////////////////////////////////////////////
//// RENDER LOOP FUNCTION
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
    fillLight.position.y -= ( parallaxY * 9 + fillLight.position.y - 2) * deltaTime

    const parallaxX = cursor.x
    fillLight.position.x += (parallaxX * 8 - fillLight.position.x) * 2 * deltaTime

    cameraGroup.position.z -= (parallaxY / 3 + cameraGroup.position.z) * 2 * deltaTime
    cameraGroup.position.x += (parallaxX / 3 - cameraGroup.position.x) * 2 * deltaTime

    requestAnimationFrame(rendeLoop)
}

rendeLoop()

//////////////////////////////////////////////////
//// ON MOUSE MOVE TO GET CAMERA POSITION
document.addEventListener('mousemove', (event) => {
    event.preventDefault()
    cursor.x = event.clientX / window.innerWidth - 0.5
    cursor.y = event.clientY / window.innerHeight - 0.5
    handleCursor(event)
}, false)

//////////////////////////////////////////////////
//// DISABLE RENDERER BASED ON CONTAINER VIEW
const watchedSection = document.querySelector('.second')

function obCallback(payload) {
    if (payload[0].intersectionRatio > 0.05){
        secondContainer = true
    } else {
        secondContainer = false
    }
}

const ob = new IntersectionObserver(obCallback, {
    threshold: 0.05
})
ob.observe(watchedSection)

//////////////////////////////////////////////////
//// MAGNETIC MENU
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