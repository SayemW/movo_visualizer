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
    const scene = viewer.scene;

    var mouse = new THREE.Vector2();
    var cameraTarget = new THREE.Vector3();
    var controlsTarget = new THREE.Vector3();

    tweenCamera();

    // el.addEventListener("mousedown", event => {
    //     console.log(controls.target);
    //     // console.log("Mouse Down")
    //     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //     raycaster.setFromCamera(mouse, camera);

    //     // calculate objects intersecting the picking ray
    //     var intersects = raycaster.intersectObjects(scene.children);
    //     console.log(intersects);

    //     for (var i = 0; i < intersects.length; i++) {
    //         cameraTarget.copy(intersects[i].point);
    //         cameraTarget.x -= 0.5;
    //         cameraTarget.y -= 0.5;
    //         cameraTarget.z -= 0.5;

    //         controlsTarget.copy(intersects[i].point);

    //         console.log(cameraTarget);
    //         console.log(controlsTarget);

    //         tweenCamera();
    //     }
    // });
});
