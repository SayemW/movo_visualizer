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
    
    console.log("updateAngles");
    
    // animate the legs
    // const time = Date.now() / 3e2;
    // for (let i = 1; i <= 6; i++) {
    //     const offset = (i * Math.PI) / 3;
    //     const ratio = Math.max(0, Math.sin(time + offset));

    //     viewer.setAngle(`HP${i}`, lerp(30, 0, ratio) * DEG2RAD);
    //     viewer.setAngle(`KP${i}`, lerp(90, 150, ratio) * DEG2RAD);
    //     viewer.setAngle(`AP${i}`, lerp(-30, -60, ratio) * DEG2RAD);

    //     viewer.setAngle(`TC${i}A`, lerp(0, 0.065, ratio));
    //     viewer.setAngle(`TC${i}B`, lerp(0, 0.065, ratio));

    //     viewer.setAngle(`W${i}`, window.performance.now() * 0.001);
    // }
};

const updateLoop = () => {
    console.log("updateLoop");
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