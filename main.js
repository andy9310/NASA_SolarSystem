import './style.css'
import { KeyDisplay, characterControls } from './src/controls/characterControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'
import {Floor, Bulletin, Vedio} from './src/object/WebInfo.js' 
// import {Moon} from './src/object/Planets.js' 
import {Starfield} from './src/object/starField.js' 
import {Sun} from './src/object/Sun.js' 
import {Planet} from './src/object/Planets.js' 
import {Earth} from './src/object/Earth.js' 

// planet texture map
import mercuryPic from "./src/models/mercury-map.jpg";
import venusPic from "./src/models/venus-map.jpg";
import jupiterPic from "./src/models/jupiter-map.jpg";
import marsPic from "./src/models/mars-map.jpg";
import neptunePic from "./src/models/neptune-map.jpg";
import saturnPic from "./src/models/saturn-map.jpg";
import uranusPic from "./src/models/saturn-map.jpg";
import saturnPic_ring from "./src/models/saturn-rings.jpg";
import uranusPic_ring from "./src/models/uranus-rings.jpg";
import earthPic from "./src/models/earth-map-1.jpg";
import soldier from "./src/models/Soldier.glb";

// scene setting 
const scene = new THREE.Scene();

// camera setting
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight , 0.1, 1000); 

// renderer setting
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight);
camera.position.setZ(30);


// create decorator, lighter
// const pointlight = new THREE.PointLight(0xffffff);
// pointlight.position.set(10,5,5)
// const ambientlight = new THREE.AmbientLight(0xffffff);
// // scene.add(pointlight, ambientlight)
// const lighthelper = new THREE.PointLightHelper(pointlight);
// // const gridhelper = new THREE.GridHelper(200,50);
// scene.add(lighthelper)

// create controller
const controls = new OrbitControls(camera, renderer.domElement);

// create key compress for character
// CONTROL KEYS
const keysPressed = {};
const keyDisplayQueue = new KeyDisplay();
document.addEventListener('keydown', (event) => {
    keyDisplayQueue.down(event.key);
    if (event.shiftKey && characterControls) {
        characterControls.switchRunToggle();
    } else {
        keysPressed[event.key.toLowerCase()] = true;
    }
}, false);
document.addEventListener('keyup', (event) => {
    keyDisplayQueue.up(event.key);
    keysPressed[event.key.toLowerCase()] = false;
}, false);

// MODEL WITH ANIMATIONS
let CharacterControls = '';
new GLTFLoader().load(soldier, function (gltf) {
    const model = gltf.scene;
    model.traverse(function (object) {
        if (object.isMesh) object.castShadow = true;
    });
    model.position.set(0, 0, 20);
    scene.add(model);

    const gltfAnimations = gltf.animations;
    const mixer = new THREE.AnimationMixer(model);
    const animationsMap = new Map();
    gltfAnimations.filter(a => a.name != 'TPose').forEach(a => {
        animationsMap.set(a.name, mixer.clipAction(a));
    });

    CharacterControls = new characterControls(model, mixer, animationsMap, controls, camera, 'Idle');
});
// adding object
const floorMesh = Floor();
const bulletinMesh = Bulletin();
const {imageObject: videoMesh, video} = Vedio();
// const moon = Moon(); 
const starfield = new Starfield().getStarfield();
const sun = new Sun().getSun();

scene.add(starfield);
// scene.add(floorMesh)
// scene.add(bulletinMesh)
videoMesh.position.set(0, 30, -40); // Centered in the scene
scene.add(videoMesh); // Add the mesh to the scene


const playButton = document.createElement('button');
playButton.textContent = 'Play Video';
document.body.appendChild(playButton);

// Style the play button (optional)
playButton.style.position = 'absolute';
playButton.style.top = '10px';
playButton.style.left = '10px';
playButton.style.zIndex = '1';

// Add an event listener to the play button
playButton.addEventListener('click', () => {
  video.play().then(() => {
    console.log('Video playback started.');
    playButton.style.display = 'none'; // Hide the button after playing
  }).catch((error) => {
    console.error('Error attempting to play the video:', error);
  });
});

// scene.add(moon)
scene.add(sun)

const planets = [
    {
      orbitSpeed: 0.00048,
      orbitRadius: 10,
      orbitRotationDirection: "clockwise",
      planetSize: 0.2,
      planetRotationSpeed: 0.005,
      planetRotationDirection: "counterclockwise",
      planetTexture: mercuryPic,
      rimHex: 0xf9cf9f,
    },
    {
      orbitSpeed: 0.00035,
      orbitRadius: 13,
      orbitRotationDirection: "clockwise",
      planetSize: 0.5,
      planetRotationSpeed: 0.0005,
      planetRotationDirection: "clockwise",
      planetTexture: venusPic,
      rimHex: 0xb66f1f,
    },
    {
      orbitSpeed: 0.00024,
      orbitRadius: 19,
      orbitRotationDirection: "clockwise",
      planetSize: 0.3,
      planetRotationSpeed: 0.01,
      planetRotationDirection: "counterclockwise",
      planetTexture: marsPic,
      rimHex: 0xbc6434,
    },
    {
      orbitSpeed: 0.00013,
      orbitRadius: 22,
      orbitRotationDirection: "clockwise",
      planetSize: 1,
      planetRotationSpeed: 0.06,
      planetRotationDirection: "counterclockwise",
      planetTexture: jupiterPic,
      rimHex: 0xf3d6b6,
    },
    {
      orbitSpeed: 0.0001,
      orbitRadius: 25,
      orbitRotationDirection: "clockwise",
      planetSize: 0.8,
      planetRotationSpeed: 0.05,
      planetRotationDirection: "counterclockwise",
      planetTexture: saturnPic,
      rimHex: 0xd6b892,
      rings: {
        ringsSize: 0.5,
        ringsTexture: saturnPic_ring,
      },
    },
    {
      orbitSpeed: 0.00007,
      orbitRadius: 28,
      orbitRotationDirection: "clockwise",
      planetSize: 0.5,
      planetRotationSpeed: 0.02,
      planetRotationDirection: "clockwise",
      planetTexture: uranusPic,
      rimHex: 0x9ab6c2,
      rings: {
        ringsSize: 0.4,
        ringsTexture: uranusPic_ring,
      },
    },
    {
      orbitSpeed: 0.000054,
      orbitRadius: 31,
      orbitRotationDirection: "clockwise",
      planetSize: 0.5,
      planetRotationSpeed: 0.02,
      planetRotationDirection: "counterclockwise",
      planetTexture: neptunePic,
      rimHex: 0x5c7ed7,
    },
  ];
  
  planets.forEach((item) => {
    const planet = new Planet(item).getPlanet();
    scene.add(planet);
  });
  
  const earth = new Earth({
    orbitSpeed: 0.00029,
    orbitRadius: 16,
    orbitRotationDirection: "clockwise",
    planetSize: 0.5,
    planetAngle: (-23.4 * Math.PI) / 180,
    planetRotationSpeed: 0.01,
    planetRotationDirection: "counterclockwise",
    planetTexture: earthPic,
  }).getPlanet();
  
  scene.add(earth);
  

const clock = new THREE.Clock();
function animate(){
    let mixerUpdateDelta = clock.getDelta();

    if (CharacterControls) {
        CharacterControls.update(mixerUpdateDelta, keysPressed);
    }
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate()

