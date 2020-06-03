/* eslint-disable */
/* globals viewer */
var DEG2RAD = Math.PI / 180;
window.animToggle = document.getElementById("do-animate");

// Smooth animation from source to destination and back
const lerp = (from, to, ratio) => from + (to - from) * ratio;

// Get arm joint values
const set_arm_joints = (arm) => {
    arm.name.forEach( (item, index) => {
        viewer.setAngle(item, arm.position[index]);
    });
}

// Realtime Visualization
const updateAngles = () => {

    if (!viewer.setAngle) return;

    // reset everything to 0 first
    const resetangles = viewer.angles;
    for (const name in resetangles) resetangles[name] = 0;
    viewer.setAngles(resetangles);  

    // Camera
    viewer.setAngle("tilt_joint", tilt_joint);
    viewer.setAngle("pan_joint", pan_joint);

    // Torso
    viewer.setAngle("linear_joint", linear_joint);

    // Arms
    if (right_arm_joints) set_arm_joints(right_arm_joints);
    if (left_arm_joints) set_arm_joints(left_arm_joints);
};

// A simple key frame animation system
// TODO : Add capability to add several key frames and have the 
// robot interpolate them.
const keyFrameAnimation = () => {
    const time = Date.now() / 3e2;
    const offset = Math.PI / 3;
    const ratio = Math.max(0, Math.sin(time + offset));

    // DEMO ANIMATION
    viewer.setAngle(`tilt_joint`, lerp(0, 0.32, ratio) * DEG2RAD);
    viewer.setAngle(`linear_joint`, lerp(0, 12.3, ratio) * DEG2RAD);
    viewer.setAngle(
        `right_shoulder_pan_joint`,
        lerp(0, 37.2, ratio) * DEG2RAD
    );
    viewer.setAngle(`right_elbow_joint`, lerp(0, 12.3, ratio) * DEG2RAD);
    viewer.setAngle(`right_shoulder_lift_joint`, lerp(0, -76.3, ratio) * DEG2RAD);

    viewer.setAngle(`left_shoulder_pan_joint`, lerp(0, -48.9, ratio) * DEG2RAD);
    viewer.setAngle(
        `left_shoulder_lift_joint`,
        lerp(0, 58.6, ratio) * DEG2RAD
    );
    viewer.setAngle(`left_elbow_joint`, lerp(0, -35.6, ratio) * DEG2RAD); 

    if (animToggle.classList.contains("checked")) {
        requestAnimationFrame(keyFrameAnimation);
    }
}

document.querySelectorAll("#urdf-options li[urdf]").forEach(el => {
    el.addEventListener("click", e => {
        const urdf = e.target.getAttribute("urdf");
        const color = e.target.getAttribute("color");

        viewer.up = "+Z";
        document.getElementById("up-select").value = viewer.up;
        viewer.urdf = urdf;
        setColor(color);
    });
});

document.addEventListener("WebComponentsReady", () => {
    animToggle.addEventListener("click", () => {
        animToggle.classList.toggle("checked");
        if (animToggle.classList.contains("checked")) {
            updateAngles();
            // keyFrameAnimation();
        }
    });

    // stop the animation if user tried to manipulate the model
    viewer.addEventListener("manipulate-start", e =>
        animToggle.classList.remove("checked")
    );
    viewer.camera.position.set(1.5, 1.5, 1.5);
});
