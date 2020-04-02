viewer.addEventListener("urdf-processed", () => {
    // Animate camera
    var camera = viewer.camera;
    
    // Smooth lookAt
    tweenRotation(new THREE.Quaternion(), 1);
});

function tweenRotation(targetQuaternion, duration){
    //tweens between zero and 1 values along Quaternion's SLERP method (http://threejs.org/docs/#Reference/Math/Quaternion)

    qm = new THREE.Quaternion(); //initiate an empty Qt to be filled by the .slerp function
    curQuaternion = viewer.camera.quaternion; //the starting point of your rotation

    var tween = new TWEEN.Tween({t:0}).to({t:1}, duration)
        .easing( TWEEN.Easing.Quadratic.InOut )
        .onUpdate(function(){
            THREE.Quaternion.slerp(curQuaternion, targetQuaternion, qm, this.t);
            qm.normalize();
            group.rotation.setFromQuaternion(qm);
    });

   tween.start();
}