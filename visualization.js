import * as THREE from "three";

import {
    OrbitControls
} from "three/addons/controls/OrbitControls.js";


/* =========================
   GET SELECTED LESSON
========================= */

const params =
    new URLSearchParams(window.location.search);

const lesson =
    params.get("lesson") || "Solar System";


const title =
    document.getElementById(
        "visualizationTitle"
    );

const description =
    document.getElementById(
        "visualizationDescription"
    );

const container =
    document.getElementById(
        "canvas-container"
    );


title.textContent =
    lesson + " - 3D Visualization";

description.textContent =
    "Explore " +
    lesson +
    " using an interactive 3D model.";


/* =========================
   THREE.JS SETUP
========================= */

const scene =
    new THREE.Scene();

scene.background =
    new THREE.Color(0x050816);


const camera =
    new THREE.PerspectiveCamera(
        60,
        container.clientWidth /
        container.clientHeight,
        0.1,
        1000
    );


camera.position.set(
    0,
    4,
    12
);


const renderer =
    new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });


renderer.setSize(
    container.clientWidth,
    container.clientHeight
);


renderer.setPixelRatio(
    window.devicePixelRatio
);


container.appendChild(
    renderer.domElement
);


/* =========================
   CAMERA CONTROLS
========================= */

const controls =
    new OrbitControls(
        camera,
        renderer.domElement
    );


controls.enableDamping = true;


/* =========================
   LIGHTING
========================= */

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        1.5
    );

scene.add(ambientLight);


const mainLight =
    new THREE.DirectionalLight(
        0xffffff,
        2
    );

mainLight.position.set(
    5,
    10,
    5
);

scene.add(mainLight);


/* =========================
   VARIABLES
========================= */

let model = null;

let solarSystem = null;

let rotating = true;
let xrSession = null;

let hitTestSource = null;

let hitTestSourceRequested = false;

let placementMarker = null;

let modelPlaced = false;


/* ==================================================
   1. SOLAR SYSTEM
================================================== */

function createSolarSystem() {

    const group =
        new THREE.Group();


    /* Sun */

    const sunGeometry =
        new THREE.SphereGeometry(
            2,
            32,
            32
        );


    const sunMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xffcc33,
            emissive: 0xff9900
        });


    const sun =
        new THREE.Mesh(
            sunGeometry,
            sunMaterial
        );


    group.add(sun);


    /* Planets */

    const planetData = [

        {
            size: 0.3,
            distance: 3,
            color: 0xaaaaaa
        },

        {
            size: 0.5,
            distance: 4.3,
            color: 0xddaa66
        },

        {
            size: 0.55,
            distance: 5.7,
            color: 0x3388ff
        },

        {
            size: 0.4,
            distance: 7,
            color: 0xcc5533
        },

        {
            size: 0.9,
            distance: 8.8,
            color: 0xddaa77
        }

    ];


    const planets = [];


    planetData.forEach(
        data => {

            const geometry =
                new THREE.SphereGeometry(
                    data.size,
                    32,
                    32
                );


            const material =
                new THREE.MeshStandardMaterial({
                    color: data.color
                });


            const planet =
                new THREE.Mesh(
                    geometry,
                    material
                );


            planet.position.x =
                data.distance;


            group.add(planet);

            planets.push(planet);

        }
    );


    scene.add(group);


    return {
        group: group,
        sun: sun,
        planets: planets
    };
}


/* ==================================================
   2. HUMAN BODY
================================================== */

function createHumanBody() {

    const group =
        new THREE.Group();


    const skinMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xffb38a
        });


    /* Body */

    const bodyGeometry =
        new THREE.CylinderGeometry(
            1,
            1.2,
            3.5,
            32
        );


    const body =
        new THREE.Mesh(
            bodyGeometry,
            skinMaterial
        );


    group.add(body);


    /* Head */

    const headGeometry =
        new THREE.SphereGeometry(
            0.9,
            32,
            32
        );


    const head =
        new THREE.Mesh(
            headGeometry,
            skinMaterial
        );


    head.position.y = 2.5;

    group.add(head);


    /* Arms */

    const armGeometry =
        new THREE.CylinderGeometry(
            0.25,
            0.25,
            3,
            20
        );


    const leftArm =
        new THREE.Mesh(
            armGeometry,
            skinMaterial
        );


    leftArm.rotation.z =
        -0.4;

    leftArm.position.set(
        -1.3,
        0.2,
        0
    );


    group.add(leftArm);


    const rightArm =
        new THREE.Mesh(
            armGeometry,
            skinMaterial
        );


    rightArm.rotation.z =
        0.4;

    rightArm.position.set(
        1.3,
        0.2,
        0
    );


    group.add(rightArm);


    /* Legs */

    const legGeometry =
        new THREE.CylinderGeometry(
            0.3,
            0.3,
            3,
            20
        );


    const leftLeg =
        new THREE.Mesh(
            legGeometry,
            skinMaterial
        );


    leftLeg.position.set(
        -0.5,
        -3,
        0
    );


    group.add(leftLeg);


    const rightLeg =
        new THREE.Mesh(
            legGeometry,
            skinMaterial
        );


    rightLeg.position.set(
        0.5,
        -3,
        0
    );


    group.add(rightLeg);


    scene.add(group);


    return group;
}


/* ==================================================
   3. PLANT
================================================== */

function createPlant() {

    const group =
        new THREE.Group();


    /* Stem */

    const stemGeometry =
        new THREE.CylinderGeometry(
            0.15,
            0.2,
            4,
            20
        );


    const stemMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x228833
        });


    const stem =
        new THREE.Mesh(
            stemGeometry,
            stemMaterial
        );


    group.add(stem);


    /* Leaves */

    const leafMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x44aa44
        });


    for (
        let i = 0;
        i < 5;
        i++
    ) {

        const leafGeometry =
            new THREE.SphereGeometry(
                0.7,
                20,
                20
            );


        const leaf =
            new THREE.Mesh(
                leafGeometry,
                leafMaterial
            );


        leaf.scale.set(
            1.5,
            0.35,
            0.6
        );


        leaf.position.set(
            i % 2 === 0
                ? -0.8
                : 0.8,

            1.5 -
            i * 0.65,

            0
        );


        group.add(leaf);

    }


    /* Flower */

    const flowerGeometry =
        new THREE.SphereGeometry(
            0.6,
            20,
            20
        );


    const flowerMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xff6699
        });


    const flower =
        new THREE.Mesh(
            flowerGeometry,
            flowerMaterial
        );


    flower.position.y = 2.5;


    group.add(flower);


    scene.add(group);


    return group;
}


/* ==================================================
   4. ANIMAL
================================================== */

function createAnimal() {

    const group =
        new THREE.Group();


    const animalMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x8b5a2b
        });


    /* Body */

    const bodyGeometry =
        new THREE.SphereGeometry(
            1.5,
            32,
            32
        );


    const body =
        new THREE.Mesh(
            bodyGeometry,
            animalMaterial
        );


    body.scale.set(
        1.5,
        0.8,
        0.8
    );


    group.add(body);


    /* Head */

    const headGeometry =
        new THREE.SphereGeometry(
            0.9,
            32,
            32
        );


    const head =
        new THREE.Mesh(
            headGeometry,
            animalMaterial
        );


    head.position.x = 2;


    group.add(head);


    /* Legs */

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        const legGeometry =
            new THREE.CylinderGeometry(
                0.2,
                0.2,
                2,
                20
            );


        const leg =
            new THREE.Mesh(
                legGeometry,
                animalMaterial
            );


        leg.position.set(

            i < 2
                ? -0.8
                : 0.8,

            -1,

            i % 2 === 0
                ? -0.5
                : 0.5

        );


        group.add(leg);

    }


    /* Tail */

    const tailGeometry =
        new THREE.CylinderGeometry(
            0.12,
            0.12,
            2,
            16
        );


    const tail =
        new THREE.Mesh(
            tailGeometry,
            animalMaterial
        );


    tail.rotation.z =
        -0.8;


    tail.position.x =
        -2;


    group.add(tail);


    scene.add(group);


    return group;
}


/* ==================================================
   5. CELL
================================================== */

function createCell() {

    const group =
        new THREE.Group();


    /* Cell */

    const cellGeometry =
        new THREE.SphereGeometry(
            3,
            32,
            32
        );


    const cellMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x66cc99,
            transparent: true,
            opacity: 0.65
        });


    const cell =
        new THREE.Mesh(
            cellGeometry,
            cellMaterial
        );


    group.add(cell);


    /* Nucleus */

    const nucleusGeometry =
        new THREE.SphereGeometry(
            1.2,
            32,
            32
        );


    const nucleusMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xcc55aa
        });


    const nucleus =
        new THREE.Mesh(
            nucleusGeometry,
            nucleusMaterial
        );


    group.add(nucleus);


    /* Small organelles */

    for (
        let i = 0;
        i < 6;
        i++
    ) {

        const organelleGeometry =
            new THREE.SphereGeometry(
                0.3,
                16,
                16
            );


        const organelleMaterial =
            new THREE.MeshStandardMaterial({
                color: 0xffaa44
            });


        const organelle =
            new THREE.Mesh(
                organelleGeometry,
                organelleMaterial
            );


        organelle.position.set(

            Math.sin(i) * 2,

            Math.cos(i) * 1.5,

            Math.sin(i * 2) * 1.5

        );


        group.add(organelle);

    }


    scene.add(group);


    return group;
}


/* ==================================================
   6. FORCE AND MOTION
================================================== */

function createForceMotion() {

    const group =
        new THREE.Group();


    /* Object */

    const ballGeometry =
        new THREE.SphereGeometry(
            1.2,
            32,
            32
        );


    const ballMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xff5555
        });


    const ball =
        new THREE.Mesh(
            ballGeometry,
            ballMaterial
        );


    group.add(ball);


    /* Direction arrow */

    const direction =
        new THREE.Vector3(
            1,
            0,
            0
        );


    const arrow =
        new THREE.ArrowHelper(
            direction,
            new THREE.Vector3(
                0,
                0,
                0
            ),
            4,
            0xffff00
        );


    group.add(arrow);


    /* Ground */

    const groundGeometry =
        new THREE.BoxGeometry(
            10,
            0.2,
            4
        );


    const groundMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x777777
        });


    const ground =
        new THREE.Mesh(
            groundGeometry,
            groundMaterial
        );


    ground.position.y = -1.5;


    group.add(ground);


    scene.add(group);


    return group;
}


/* ==================================================
   7. LIGHT
================================================== */

function createLight() {

    const group =
        new THREE.Group();


    /* Bulb */

    const bulbGeometry =
        new THREE.SphereGeometry(
            1.5,
            32,
            32
        );


    const bulbMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xffff55,
            emissive: 0xffff22
        });


    const bulb =
        new THREE.Mesh(
            bulbGeometry,
            bulbMaterial
        );


    group.add(bulb);


    /* Light rays */

    for (
        let i = 0;
        i < 8;
        i++
    ) {

        const rayDirection =
            new THREE.Vector3(
                Math.cos(i * Math.PI / 4),
                Math.sin(i * Math.PI / 4),
                0
            );


        const ray =
            new THREE.ArrowHelper(
                rayDirection,
                new THREE.Vector3(
                    0,
                    0,
                    0
                ),
                3,
                0xffff00
            );


        group.add(ray);

    }


    scene.add(group);


    return group;
}


/* ==================================================
   8. ENERGY
================================================== */

function createEnergy() {

    const group =
        new THREE.Group();


    const geometry =
        new THREE.TorusGeometry(
            2,
            0.5,
            16,
            50
        );


    const material =
        new THREE.MeshStandardMaterial({
            color: 0xffaa22,
            emissive: 0xff6600
        });


    const energy =
        new THREE.Mesh(
            geometry,
            material
        );


    group.add(energy);


    const innerGeometry =
        new THREE.SphereGeometry(
            1,
            32,
            32
        );


    const innerMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xffff44,
            emissive: 0xffaa00
        });


    const inner =
        new THREE.Mesh(
            innerGeometry,
            innerMaterial
        );


    group.add(inner);


    scene.add(group);


    return group;
}


/* ==================================================
   9. EARTH
================================================== */

function createEarth() {

    const group =
        new THREE.Group();


    /* Earth */

    const earthGeometry =
        new THREE.SphereGeometry(
            3,
            32,
            32
        );


    const earthMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x3388cc
        });


    const earth =
        new THREE.Mesh(
            earthGeometry,
            earthMaterial
        );


    group.add(earth);


    /* Continents */

    const continentMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x44aa55
        });


    for (
        let i = 0;
        i < 8;
        i++
    ) {

        const continentGeometry =
            new THREE.SphereGeometry(
                0.5,
                16,
                16
            );


        const continent =
            new THREE.Mesh(
                continentGeometry,
                continentMaterial
            );


        const angle =
            i * Math.PI / 4;


        continent.position.set(

            Math.cos(angle) * 2.7,

            Math.sin(angle) * 1.2,

            Math.sin(angle) * 2

        );


        group.add(continent);

    }


    scene.add(group);


    return group;
}


/* ==================================================
   10. MAP
================================================== */

function createMap() {

    const group =
        new THREE.Group();


    const mapGeometry =
        new THREE.BoxGeometry(
            7,
            0.3,
            5
        );


    const mapMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xddddaa
        });


    const map =
        new THREE.Mesh(
            mapGeometry,
            mapMaterial
        );


    group.add(map);


    /* Map grid */

    for (
        let i = -3;
        i <= 3;
        i++
    ) {

        const lineGeometry =
            new THREE.BoxGeometry(
                0.03,
                0.05,
                5
            );


        const lineMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x555555
            });


        const line =
            new THREE.Mesh(
                lineGeometry,
                lineMaterial
            );


        line.position.x = i;


        group.add(line);

    }


    for (
        let i = -2;
        i <= 2;
        i++
    ) {

        const lineGeometry =
            new THREE.BoxGeometry(
                7,
                0.05,
                0.03
            );


        const lineMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x555555
            });


        const line =
            new THREE.Mesh(
                lineGeometry,
                lineMaterial
            );


        line.position.z = i;


        group.add(line);

    }


    scene.add(group);


    return group;
}


/* ==================================================
   11. CONTINENTS
================================================== */

function createContinents() {

    const group =
        new THREE.Group();


    const globeGeometry =
        new THREE.SphereGeometry(
            3,
            32,
            32
        );


    const globeMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x55aadd
        });


    const globe =
        new THREE.Mesh(
            globeGeometry,
            globeMaterial
        );


    group.add(globe);


    const continentMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x44aa55
        });


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const continentGeometry =
            new THREE.SphereGeometry(
                0.7,
                16,
                16
            );


        const continent =
            new THREE.Mesh(
                continentGeometry,
                continentMaterial
            );


        const angle =
            i * Math.PI * 2 / 7;


        continent.position.set(

            Math.cos(angle) * 2.5,

            Math.sin(angle * 2) * 1.2,

            Math.sin(angle) * 2.5

        );


        group.add(continent);

    }


    scene.add(group);


    return group;
}
function createPlacementMarker() {

    const geometry =
        new THREE.RingGeometry(
            0.15,
            0.2,
            32
        );

    const material =
        new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            side: THREE.DoubleSide
        });

    const marker =
        new THREE.Mesh(
            geometry,
            material
        );

    marker.rotation.x =
        -Math.PI / 2;

    marker.visible = false;

    scene.add(marker);

    return marker;
}
/* Create the AR placement marker */

placementMarker =
    createPlacementMarker();
function placeModel() {

    if (model) {

        model.position.copy(
            placementMarker.position
        );

        model.visible = true;

    }


    if (solarSystem) {

        solarSystem.group.position.copy(
            placementMarker.position
        );

        solarSystem.group.visible =
            true;

    }


    modelPlaced = true;


    arMessage.textContent =
        "Model placed. Move around it to explore.";
}

/* ==================================================
   SELECT CORRECT MODEL
================================================== */

if (
    lesson ===
    "Solar System"
) {

    solarSystem =
        createSolarSystem();

}
else if (
    lesson ===
    "Human Body"
) {

    model =
        createHumanBody();

}
else if (
    lesson ===
    "Plants"
) {

    model =
        createPlant();

}
else if (
    lesson ===
    "Animals"
) {

    model =
        createAnimal();

}
else if (
    lesson ===
    "Cells"
) {

    model =
        createCell();

}
else if (
    lesson ===
    "Force and Motion"
) {

    model =
        createForceMotion();

}
else if (
    lesson ===
    "Light"
) {

    model =
        createLight();

}
else if (
    lesson ===
    "Energy"
) {

    model =
        createEnergy();

}
else if (
    lesson ===
    "Earth"
) {

    model =
        createEarth();

}
else if (
    lesson ===
    "Maps"
) {

    model =
        createMap();

}
else if (
    lesson ===
    "Continents"
) {

    model =
        createContinents();

}
else {

    console.log(
        "No model found for:",
        lesson
    );

}
function handleARFrame(
    timestamp,
    frame
) {

    const session =
        frame.session;


    if (
        !hitTestSourceRequested
    ) {

        session.requestReferenceSpace(
            "viewer"
        ).then(
            function (referenceSpace) {

                session.requestHitTestSource({
                    space: referenceSpace
                }).then(
                    function (source) {

                        hitTestSource =
                            source;

                    }
                );

            }
        );


        hitTestSourceRequested =
            true;

    }


    if (hitTestSource) {

        const referenceSpace =
            renderer.xr.getReferenceSpace();


        const hitTestResults =
            frame.getHitTestResults(
                hitTestSource
            );


        if (
            hitTestResults.length > 0
        ) {

            const hit =
                hitTestResults[0];


            const pose =
                hit.getPose(
                    referenceSpace
                );


            if (pose) {

                placementMarker
                    .visible = true;


                placementMarker
                    .position.set(
                        pose.transform.position.x,
                        pose.transform.position.y,
                        pose.transform.position.z
                    );


                if (!modelPlaced) {

                    arMessage.textContent =
                        "Surface found. Tap the screen to place the model.";

                }

            }

        }
        else {

            placementMarker.visible =
                false;

        }

    }
}


renderer.setAnimationLoop(
    function (
        timestamp,
        frame
    ) {

        if (
            xrSession &&
            frame
        ) {

            handleARFrame(
                timestamp,
                frame
            );

        }


        if (rotating) {

            if (solarSystem) {

                solarSystem.sun.rotation.y +=
                    0.005;

                solarSystem.planets.forEach(
                    planet => {

                        planet.rotation.y +=
                            0.01;

                    }
                );

            }


            if (model) {

                model.rotation.y +=
                    0.01;

            }

        }


        controls.update();


        renderer.render(
            scene,
            camera
        );

    }
);


/* ==================================================
   ROTATE BUTTON
================================================== */

document.getElementById(
    "rotateButton"
).addEventListener(
    "click",
    function () {

        rotating =
            !rotating;


        this.textContent =
            rotating
                ? "Pause Rotation"
                : "Rotate";

    }
);


/* ==================================================
   RESET BUTTON
================================================== */

document.getElementById(
    "resetButton"
).addEventListener(
    "click",
    function () {

        camera.position.set(
            0,
            4,
            12
        );


        controls.target.set(
            0,
            0,
            0
        );


        controls.update();

    }
);


/* ==================================================
   BACK BUTTON
================================================== */

document.getElementById(
    "backButton"
).addEventListener(
    "click",
    function () {

        window.history.back();

    }
);


/* ==================================================
   AR MODE
================================================== */

const arButton =
    document.getElementById(
        "arButton"
    );


const arMessage =
    document.getElementById(
        "arMessage"
    );


arButton.addEventListener(
    "click",
    async function () {

        if (!navigator.xr) {

            alert(
                "WebXR is not available in this browser."
            );

            return;
        }


        const supported =
            await navigator.xr.isSessionSupported(
                "immersive-ar"
            );


        if (!supported) {

            alert(
                "AR is not supported on this device/browser."
            );

            return;
        }


        try {

            xrSession =
                await navigator.xr.requestSession(
                    "immersive-ar",
                    {
                        requiredFeatures: [
                            "hit-test",
                            "local-floor"
                        ]
                    }
                );


            renderer.xr.enabled =
                true;


            renderer.xr.setReferenceSpaceType(
                "local-floor"
            );


            await renderer.xr.setSession(
                xrSession
            );


            scene.background = null;


            modelPlaced = false;


            arMessage.textContent =
                "Move your phone slowly to find a surface.";


            arButton.textContent =
                "Exit AR";


            xrSession.addEventListener(
                "end",
                function () {

                    xrSession = null;

                    hitTestSource = null;

                    hitTestSourceRequested =
                        false;

                    renderer.xr.enabled =
                        false;

                    arButton.textContent =
                        "AR Mode";

                    arMessage.textContent =
                        "AR session ended.";

                }
            );


            xrSession.addEventListener(
                "select",
                function () {

                    if (
                        placementMarker &&
                        placementMarker.visible
                    ) {

                        placeModel();

                    }

                }
            );

        }
        catch (error) {

            console.error(
                "AR error:",
                error
            );

            alert(
                "Unable to start AR. Check camera permission and device support."
            );

        }

    }
);

/* ==================================================
   RESIZE
================================================== */

window.addEventListener(
    "resize",
    function () {

        camera.aspect =
            container.clientWidth /
            container.clientHeight;


        camera.updateProjectionMatrix();


        renderer.setSize(
            container.clientWidth,
            container.clientHeight
        );

    }
);