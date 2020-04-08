viewer.addEventListener("urdf-processed", () => {
    // Collision highlight material
    const collisionHilightMaterial = new THREE.MeshPhongMaterial({
        shininess: 10,
        emissiveIntensity: 0.25,
        color: new THREE.Color(0xff0000),
        emissive: new THREE.Color(0xff0000)
    });

    const camera = viewer.camera;
    const raycaster = new THREE.Raycaster();
    const el = viewer.renderer.domElement;
    const robot = viewer.robot;

    var mouse = new THREE.Vector2();
    var cameraTargetPosition = new THREE.Vector3(1.4, 1.5, -1.2);
    var collisionPosition = new THREE.Vector3();

    // Perform start-up animation
    tweenCamera(collisionPosition, cameraTargetPosition);

    el.addEventListener("mousedown", event => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        // find objects intersecting the picking ray
        var intersects = raycaster.intersectObjects(robot.children, true);
        
        for (var i = 0; i < Math.min(1, intersects.length); i++) {
            collisionPosition.copy(intersects[i].point);
            tweenCamera(collisionPosition, null);
        }
    });
});
