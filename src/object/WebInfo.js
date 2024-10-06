import * as THREE from 'three'
import placeholderUrl from './placeholder.png';
import introVedio from '../models/intro.mp4';

function wrapAndRepeatTexture (map) {
    map.wrapS = map.wrapT = THREE.RepeatWrapping
    map.repeat.x = map.repeat.y = 10
}
export function Vedio(){
    var video = document.getElementById('video');
    
    video.src = introVedio;
    video.muted = false;
    video.loop = true;
    video.playsInline = true; // For mobile devices
    video.load();
    video.play();

    var texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;

    var imageObject = new THREE.Mesh(
        new THREE.PlaneGeometry(50, 50),
        new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }),);
    return imageObject
}
   
// create bulletin
export function Bulletin(){
    const geometry = new THREE.PlaneGeometry( 20, 10 );
    const material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh( geometry, material );
    plane.position.set(10,10,100);
    return plane
}
  
export function Floor (){
    const textureLoader = new THREE.TextureLoader();
    const placeholder = textureLoader.load(placeholderUrl);
    const geometry = new THREE.PlaneGeometry(80,80,512,512)  
    const material = new THREE.MeshStandardMaterial({ map: placeholder});
    wrapAndRepeatTexture(material.map)
    const floor = new THREE.Mesh(geometry, material)
    floor.material.side = THREE.DoubleSide;
    floor.rotation.x = -Math.PI*0.5
    floor.receiveShadow = true
    return floor
}