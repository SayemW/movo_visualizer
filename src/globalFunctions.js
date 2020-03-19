/* globals URDFViewer */
// customElements.define("urdf-viewer", URDFViewer);

// If we want to control the joints on the model using a mouse
customElements.define("urdf-viewer", URDFManipulator);

/* globals viewer THREE */

// declare these globally
viewer = document.querySelector("urdf-viewer");

const limitsToggle = document.getElementById("ignore-joint-limits");
const upSelect = document.getElementById("up-select");
const sliderList = document.querySelector("#controls ul");
const controlsel = document.getElementById("controls");
const controlsToggle = document.getElementById("toggle-controls");
var DEG2RAD = Math.PI / 180;
const RAD2DEG = 1 / DEG2RAD;
let sliders = {};

// Global Functions
window.setColor = color => {
    document.body.style.backgroundColor = color;
    viewer.highlightColor =
        "#" +
        new THREE.Color(0xffffff)
            .lerp(new THREE.Color(color), 0.35)
            .getHexString();
};

// Events
// toggle checkbox
limitsToggle.addEventListener("click", () => {
    limitsToggle.classList.toggle("checked");
    viewer.ignoreLimits = limitsToggle.classList.contains("checked");
});

upSelect.addEventListener("change", () => (viewer.up = upSelect.value));

controlsToggle.addEventListener("click", () =>
    controlsel.classList.toggle("hidden")
);

// watch for urdf changes
viewer.addEventListener("urdf-change", () => {
    Object.values(sliders).forEach(sl => sl.remove());
    sliders = {};
});

viewer.addEventListener('ignore-limits-change', () => {

    Object
        .values(sliders)
        .forEach(sl => sl.update());

});

// change slider values when we change angles
viewer.addEventListener('angle-change', e => {

    if (sliders[e.detail]) sliders[e.detail].update();

});

viewer.addEventListener('joint-mouseover', e => {

    const j = document.querySelector(`li[joint-name="${ e.detail }"]`);
    if (j) j.setAttribute('robot-hovered', true);

});

viewer.addEventListener('joint-mouseout', e => {

    const j = document.querySelector(`li[joint-name="${ e.detail }"]`);
    if (j) j.removeAttribute('robot-hovered');

});

let originalNoAutoRecenter;
viewer.addEventListener('manipulate-start', e => {

    const j = document.querySelector(`li[joint-name="${ e.detail }"]`);
    if (j) {
        j.scrollIntoView({ block: 'nearest' });
        window.scrollTo(0, 0);
    }

    originalNoAutoRecenter = viewer.noAutoRecenter;
    viewer.noAutoRecenter = true;

});

viewer.addEventListener('manipulate-end', e => {

    viewer.noAutoRecenter = originalNoAutoRecenter;

});

document.addEventListener("WebComponentsReady", () => {
    viewer.loadMeshFunc = (path, manager, done) => {
        new THREE.ModelLoader(manager).load(
            path,
            res => done(res.model),
            null,
            err => done(null, err)
        );
    };

    document.querySelector("li[urdf]").dispatchEvent(new Event("click"));

    viewer.package = "./urdf";
});
