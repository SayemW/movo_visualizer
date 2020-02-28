/* eslint-disable */
/* globals viewer */
var DEG2RAD = Math.PI / 180;
window.animToggle = document.getElementById("do-animate");

const lerp = (from, to, ratio) => from + (to - from) * ratio;
const updateAngles = () => {
    if (!viewer.setAngle) return;

    // reset everything to 0 first
    const resetangles = viewer.angles;
    for (const name in resetangles) resetangles[name] = 0;
    viewer.setAngles(resetangles);

    // add animation
    var newAngles = viewer.angles;
   
    const time = Date.now() / 3e2;
    const offset = (Math.PI) / 3;
    const ratio = Math.max(0, Math.sin(time + offset));

    // D Animation
    // viewer.setAngle(`tilt_joint`, lerp(0, -62.4, ratio) * DEG2RAD);
    // viewer.setAngle(`right_shoulder_pan_joint`, lerp(0, -13.5, ratio) * DEG2RAD);
    // viewer.setAngle(`right_elbow_joint`, lerp(0, -129.6, ratio) * DEG2RAD);
    // viewer.setAngle(`right_shoulder_lift_joint`, lerp(0, 8, ratio) * DEG2RAD);

    // viewer.setAngle(`left_shoulder_pan_joint`, lerp(0, -28, ratio) * DEG2RAD);
    // viewer.setAngle(`left_shoulder_lift_joint`, lerp(0, 119.2, ratio) * DEG2RAD);
    // viewer.setAngle(`left_arm_half_joint`, lerp(0, -55, ratio) * DEG2RAD);
};

const updateLoop = () => {
    if (animToggle.classList.contains("checked")) {
        updateAngles();
    }

    requestAnimationFrame(updateLoop);
};

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
    animToggle.addEventListener("click", () =>
        animToggle.classList.toggle("checked")
    );

    // stop the animation if user tried to manipulate the model
    viewer.addEventListener("manipulate-start", e =>
        animToggle.classList.remove("checked")
    );
    viewer.addEventListener("urdf-processed", e => updateAngles());
    updateLoop();
    viewer.camera.position.set(1.5, 1.5, 1.5);
});
