viewer.addEventListener("urdf-processed", () => {
    // Collision highlight material
    const collisionHilightMaterial = new THREE.MeshPhongMaterial({
        shininess: 10,
        emissiveIntensity: 0.25,
        color: new THREE.Color(0xff0000),
        emissive: new THREE.Color(0xff0000),
    });

    const camera = viewer.camera;
    const raycaster = new THREE.Raycaster();
    const el = viewer.renderer.domElement;
    const robot = viewer.robot;
    const controls = viewer.controls;

    var mouse = new THREE.Vector2();
    var cameraTargetPosition = new THREE.Vector3(1.4, 1.5, -1.2);

    var normalMatrix = new THREE.Matrix3(); // create once and reuse
    var worldNormal = new THREE.Vector3(); // create once and reuse

    // Perform start-up animation
    tweenCamera(controls.target, cameraTargetPosition);

    el.addEventListener("mousedown", (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        // find objects intersecting the picking ray
        var intersects = raycaster.intersectObjects(robot.children, true);

        if (intersects.length != 0) {
            // Convert face normal to world
            normalMatrix.getNormalMatrix(intersects[0].object.matrixWorld);
            worldNormal.copy(intersects[0].face.normal).applyMatrix3(normalMatrix).normalize();

            tweenCamera(intersects[0].point, null, worldNormal);
        }
    });
});
