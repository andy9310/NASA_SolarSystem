// camera
new GLTFLoader().load('models/Soldier.glb', function(gltf){
    const model = gltf.scene;
    model.traverse(function(object: any){
        if(object.isMesh)
    })
})
// control keys
document.addEventListener('keydown',)