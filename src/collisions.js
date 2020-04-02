viewer.addEventListener("urdf-processed", () => {
    // Collision highlight material
    const collisionHilightMaterial = new THREE.MeshPhongMaterial({
        shininess: 10,
        emissiveIntensity: 0.25,
        color: new THREE.Color(0xff0000),
        emissive: new THREE.Color(0xff0000)
    });

    // Get all meshes
    const meshes = [];
    const robot = viewer.robot;

    robot.traverse( m => {
        if (m.name == "node") {
            //console.log(m);
            //m.material = collisionHilightMaterial;
        }
    });
});
