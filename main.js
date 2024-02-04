import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
// import {setText} from './src/text.js'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import * as THREE from 'three'
import textLoaderFunction from './src/text.js'

const loader = new FontLoader();

var MoonURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/lroc_color_poles_1k.jpg"; 
var MoonsurfaceURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/ldem_3_8bit.jpg"; 
var galaxyURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/hipp8_s.jpg"

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight , 0.1, 1000); 
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render( scene, camera );
const geometry = new THREE.TorusGeometry(10,3,16,100);
const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
const torus = new THREE.Mesh(geometry, material);
torus.position.set(20,20,20)

// create words 

loader.load( 'src/text_font/helvetiker_regular.typeface.json', (font)=>{
  scene.add(textLoaderFunction(font))
});

// create bulletin
function bulletin(){
  const geometry = new THREE.PlaneGeometry( 1, 1 );
  const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
  const plane = new THREE.Mesh( geometry, material );
  plane.position.set(10,6,1);
  scene.add( plane );
}


// create decorator
scene.add(torus)
const pointlight = new THREE.PointLight(0xffffff);
pointlight.position.set(10,5,5)
const ambientlight = new THREE.AmbientLight(0xffffff);

scene.add(pointlight, ambientlight)

const lighthelper = new THREE.PointLightHelper(pointlight);
const gridhelper = new THREE.GridHelper(200,50);
scene.add(lighthelper,gridhelper)

const controls = new OrbitControls(camera, renderer.domElement);


const moon_geometry = new THREE.SphereGeometry( 2,60,60 );
// const material = new THREE.MeshStandardMaterial({color: "rgb(25, 25, 112)"});
var textureLoader = new THREE.TextureLoader();
var moon_texture = textureLoader.load( MoonURL );
var moon_surface = textureLoader.load(MoonsurfaceURL);
var background  = textureLoader.load(galaxyURL)
const moon_material = new THREE.MeshPhongMaterial({color: 'rgb(255, 255, 255)', map: moon_texture, displacementMap: moon_surface, displacementScale: 0.06, bumpMap: moon_surface, bumpScale:0.04})
const moon = new THREE.Mesh(moon_geometry, moon_material)
moon.position.set(10,10,0);
scene.add(moon)


function floor (){
  const geometry = new THREE.PlaneGeometry(20,20)  
  const material = new THREE.MeshStandardMaterial({color: "rgb(25, 25, 112)"});
  const one_piece_floor = new THREE.Mesh(geometry, material)
  one_piece_floor.material.side = THREE.DoubleSide;
  // one_piece_floor.rotation([-Math.PI*0.5, 0, 0])
  one_piece_floor.rotation.x = -Math.PI*0.5
  scene.add(one_piece_floor)
}
function house_wall(){
  const geometry = new THREE.BoxGeometry(10,10,10)  
  const material = new THREE.MeshStandardMaterial({color: "rgb(255, 255, 255)"});
  const house = new THREE.Mesh(geometry, material)
  house.position.set(0,5,0);
  scene.add(house)
}
function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x,y,z);
  scene.add(star);
}

function animate(){
  requestAnimationFrame(animate);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;
  moon.rotation.y += 0.002;
  moon.rotation.x += 0.0001;
  controls.update();
  renderer.render(scene, camera);
}


Array(200).fill().forEach(addStar);
floor()
house_wall()
animate()
bulletin()
// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))
