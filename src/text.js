import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import * as THREE from 'three'
function textLoaderFunction( font ) {

	const geometry = new TextGeometry( 'Hello three.js!', {
		font: font,
		size: 10,
		height: 5,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 10,
		bevelSize: 8,
		bevelOffset: 0,
		bevelSegments: 5
	} );
    const textMesh = new THREE.Mesh(geometry,[
        new THREE.MeshPhongMaterial({color:0xad4000}),
        new THREE.MeshPhongMaterial({color:0x5c2301})
    ]) 
    textMesh.castShadow = true
    textMesh.position.y += 15
    textMesh.position.z -= 40
    textMesh.position.x = -8
    textMesh.rotation.y = -0.5
    return textMesh
}
export default textLoaderFunction;



