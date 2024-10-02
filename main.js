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

function Moon(){
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
function sun_object(){
  // Create the Sun
  const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
  const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sun);
}
// Array to hold planet meshes
const planetsMeshes = [];
// Main function
function main() {
  // Get current Julian centuries since J2000.0
  const now = new Date();
  const jd = getJulianDate(now.getTime());
  const T = getJulianCenturies(jd);

  planets.forEach((planet) => {
    // Update orbital elements
    const a = planet.a[0] + planet.a[1] * T;
    const e = planet.e[0] + planet.e[1] * T;
    const I = planet.I[0] + planet.I[1] * T;
    const L = planet.L[0] + planet.L[1] * T;
    const longPeri = planet.longPeri[0] + planet.longPeri[1] * T;
    const longNode = planet.longNode[0] + planet.longNode[1] * T;

    // Mean anomaly M = L - longPeri
    let M = L - longPeri;
    M = deg2rad(M % 360);

    // Solve Kepler's Equation
    const E = solveKepler(M, e);

    // True anomaly
    const ν = 2 * Math.atan2(
      Math.sqrt(1 + e) * Math.sin(E / 2),
      Math.sqrt(1 - e) * Math.cos(E / 2)
    );

    // Distance r
    const r = a * (1 - e * Math.cos(E));

    // Heliocentric coordinates in orbital plane
    const x_orb = r * Math.cos(ν);
    const y_orb = r * Math.sin(ν);

    // Convert to 3D space
    const cosI = Math.cos(deg2rad(I));
    const sinI = Math.sin(deg2rad(I));
    const cosNode = Math.cos(deg2rad(longNode));
    const sinNode = Math.sin(deg2rad(longNode));
    const cosPeri = Math.cos(deg2rad(longPeri - longNode));
    const sinPeri = Math.sin(deg2rad(longPeri - longNode));

    const x_ec =
      x_orb * (cosNode * cosPeri - sinNode * sinPeri * cosI) -
      y_orb * (cosNode * sinPeri + sinNode * cosPeri * cosI);
    const y_ec =
      x_orb * (sinNode * cosPeri + cosNode * sinPeri * cosI) -
      y_orb * (sinNode * sinPeri - cosNode * cosPeri * cosI);
    const z_ec = x_orb * (sinPeri * sinI) + y_orb * (cosPeri * sinI);

    // Scale positions for visualization
    const scale = 20;
    const position = new THREE.Vector3(
      x_ec * scale,
      y_ec * scale,
      z_ec * scale
    );

    // Create planet mesh
    const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color: planet.color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    scene.add(mesh);

    // Store mesh for animation updates
    planetsMeshes.push({ mesh: mesh, planet: planet });
  });
}

function animate() {
  requestAnimationFrame(animate);

  // Update time for planet positions
  const now = new Date();
  const jd = getJulianDate(now.getTime());
  const T = getJulianCenturies(jd);

  planetsMeshes.forEach((obj) => {
    const { mesh, planet } = obj;

    // Update orbital elements
    const a = planet.a[0] + planet.a[1] * T;
    const e = planet.e[0] + planet.e[1] * T;
    const I = planet.I[0] + planet.I[1] * T;
    const L = planet.L[0] + planet.L[1] * T;
    const longPeri = planet.longPeri[0] + planet.longPeri[1] * T;
    const longNode = planet.longNode[0] + planet.longNode[1] * T;

    // Mean anomaly M = L - longPeri
    let M = L - longPeri;
    M = deg2rad(M % 360);

    // Solve Kepler's Equation
    const E = solveKepler(M, e);

    // True anomaly
    const ν = 2 * Math.atan2(
      Math.sqrt(1 + e) * Math.sin(E / 2),
      Math.sqrt(1 - e) * Math.cos(E / 2)
    );

    // Distance r
    const r = a * (1 - e * Math.cos(E));

    // Heliocentric coordinates in orbital plane
    const x_orb = r * Math.cos(ν);
    const y_orb = r * Math.sin(ν);

    // Convert to 3D space
    const cosI = Math.cos(deg2rad(I));
    const sinI = Math.sin(deg2rad(I));
    const cosNode = Math.cos(deg2rad(longNode));
    const sinNode = Math.sin(deg2rad(longNode));
    const cosPeri = Math.cos(deg2rad(longPeri - longNode));
    const sinPeri = Math.sin(deg2rad(longPeri - longNode));

    const x_ec =
      x_orb * (cosNode * cosPeri - sinNode * sinPeri * cosI) -
      y_orb * (cosNode * sinPeri + sinNode * cosPeri * cosI);
    const y_ec =
      x_orb * (sinNode * cosPeri + cosNode * sinPeri * cosI) -
      y_orb * (sinNode * sinPeri - cosNode * cosPeri * cosI);
    const z_ec = x_orb * (sinPeri * sinI) + y_orb * (cosPeri * sinI);

    // Scale positions
    const scale = 20;
    const position = new THREE.Vector3(
      x_ec * scale,
      y_ec * scale,
      z_ec * scale
    );

    // Update planet position
    mesh.position.copy(position);

    // Rotate planet on its axis
    mesh.rotation.y += 0.01;
  });

  controls.update();
  renderer.render(scene, camera);
}





Array(200).fill().forEach(addStar);
floor()
house_wall()
animate()
bulletin()
Moon()


/// main function
main();
animate();

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
