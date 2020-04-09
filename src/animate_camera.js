/**
 * Construct bounding sphere along which the camera moves
 **/
var sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
var sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
});

var boundingSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
viewer.scene.add(boundingSphere);

// Set sphere position
viewer.addEventListener("urdf-processed", () => {
    boundingSphere.position.y = 0.3;
});

/**
 * Animate the camera
 */
var camera = viewer.camera;
var controls = viewer.controls;
var animationFrameID;
var currentCameraPosition = new THREE.Vector3();

const duration = 2500;

function tweenCamera(collisionPosition, cameraTargetPosition, faceNormal) {
    controls.enabled = false;

    currentCameraPosition.copy(camera.position);

    // If the new camera position is not provided then calculate it
    if (cameraTargetPosition == null)
        cameraTargetPosition = getNextCameraPosition(collisionPosition, faceNormal);

    var tween = new TWEEN.Tween(currentCameraPosition)
        .to(cameraTargetPosition, duration)
        .easing(TWEEN.Easing.Back.InOut)
        .onUpdate(function () {
            camera.position.copy(currentCameraPosition);
            camera.lookAt(controls.target);
        })
        .onComplete(function () {
            camera.position.copy(cameraTargetPosition);
            camera.lookAt(controls.target);
            controls.enabled = true;
            cancelAnimationFrame(animationFrameID);
        })
        .start();

    animateCamera();
}

function animateCamera() {
    animationFrameID = requestAnimationFrame(animateCamera);
    TWEEN.update();
}

/**
 * Calculate the best position to place the camera
 */
const raycaster = new THREE.Raycaster();
const direction = new THREE.Vector3(0, 0, 0);
const newPosition = new THREE.Vector3(0, 0, 0);

function getNextCameraPosition(collisionPosition, faceNormal) {
        // Test for collision with robot
        raycaster.set(collisionPosition, faceNormal);
        var robotIntersects = raycaster.intersectObjects(
            viewer.robot.children,
            true
        );

        // If no collision detected then the ray has an unobscured view 
        if (robotIntersects.length == 0) {
            var intersects = raycaster.intersectObject(boundingSphere, true);

            for (var i = 0; i < Math.min(1, intersects.length); i++) {
                newPosition.copy(intersects[i].point);
            }
            return newPosition;
        }
    // });
    return newPosition;
}
