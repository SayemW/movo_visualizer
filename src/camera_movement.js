// Animate camera
var camera = viewer.camera;
var controls = viewer.controls;
var animationFrameID;

function tweenCamera() {
    controls.enabled = false;
    var duration = 2500;
    var position = new THREE.Vector3().copy(camera.position);
    var targetPosition = new THREE.Vector3(1.4, 1.5, -1.2);

    var tween = new TWEEN.Tween(position)
        .to(targetPosition, duration)
        .easing(TWEEN.Easing.Back.InOut)
        .onUpdate(function() {
            camera.position.copy(position);
            camera.lookAt(controls.target);
        })
        .onComplete(function() {
            camera.position.copy(targetPosition);
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
