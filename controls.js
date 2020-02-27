// create the sliders
viewer.addEventListener("urdf-processed", () => {
    const r = viewer.robot;
    console.log(r);
    Object.keys(r.joints)
        .map(key => r.joints[key])
        .filter(joint => joint.limit.upper != 0)
        .forEach(joint => {
            const li = document.createElement("li");
            li.innerHTML = `
            <span title="${joint.name}">${joint.name}</span>
            <input type="range" value="0" step="0.0001"/>
            <input type="number" step="0.0001" />
            `;
            li.setAttribute("joint-type", joint.jointType);
            li.setAttribute("joint-name", joint.name);

            sliderList.appendChild(li);

            // update the joint display
            const slider = li.querySelector('input[type="range"]');
            const input = li.querySelector('input[type="number"]');
            li.update = () => {
                let degVal = joint.angle;

                if (
                    joint.jointType === "revolute" ||
                    joint.jointType === "continuous"
                ) {
                    degVal *= RAD2DEG;
                }

                if (Math.abs(degVal) > 1) {
                    degVal = degVal.toFixed(1);
                } else {
                    degVal = degVal.toPrecision(2);
                }

                input.value = parseFloat(degVal);

                // directly input the value
                slider.value = joint.angle;

                if (viewer.ignoreLimits || joint.jointType === "continuous") {
                    slider.min = -6.28;
                    slider.max = 6.28;

                    input.min = -6.28 * RAD2DEG;
                    input.max = 6.28 * RAD2DEG;
                } else {
                    slider.min = joint.limit.lower;
                    slider.max = joint.limit.upper;

                    input.min = joint.limit.lower * RAD2DEG;
                    input.max = joint.limit.upper * RAD2DEG;
                }
            };

            switch (joint.jointType) {
                case "continuous":
                case "prismatic":
                case "revolute":
                    break;
                default:
                    li.update = () => {};
                    input.remove();
                    slider.remove();
            }

            slider.addEventListener("input", () => {
                viewer.setAngle(joint.name, slider.value);
                li.update();
            });

            input.addEventListener("change", () => {
                viewer.setAngle(joint.name, input.value * DEG2RAD);
                li.update();
            });

            li.update();

            sliders[joint.name] = li;
        });
});