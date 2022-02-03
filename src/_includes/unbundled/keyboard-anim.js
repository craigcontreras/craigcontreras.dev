"use strict";

import { LoadingManager, Scene, PerspectiveCamera, WebGLRenderer, Color, AmbientLight, XRRay } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import TWEEN from "@tweenjs/tween.js/dist/tween.esm.js"

let position = { x: 0, y: 0, z: 10 };
let scene, camera, renderer, frameId;
let keyboardContainer;

const manager = new LoadingManager();

export function createScene() {
    scene = new Scene(); //set up the scene
    camera = new PerspectiveCamera(
        60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 1.25);
    renderer = new WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    keyboardContainer = document.querySelector("#keyboard");
    keyboardContainer.append(renderer.domElement);
}

export function loadModel() {
    const color = new Color("rgb(0, 12, 165)");
    var ambient = new AmbientLight(color);
    scene.add(ambient);

    const loader = new OBJLoader(manager);

    const kb = loader.load(
        "/assets/models/keyboard.obj",
        function (obj) {
            // Add the loaded object to the scene
            scene.add(obj);
            obj.name = "keyboard";
            obj.position.set(position.x, position.y, position.z);

            setInterval(() => {
                obj.rotateY(0.01);
                obj.rotateX(0.01);
            }, 1 / 60);
        }
    );

    animate();
}

const finalPosition = { x: 0, y: 0, z: 0 };
const tween = new TWEEN.Tween(position).to(finalPosition, 750);
tween.easing(TWEEN.Easing.Quadratic.InOut);
tween.start();

manager.onLoad = () => {
    tween.onUpdate(() => {
        scene.getObjectByName("keyboard").position.set(position.x, position.y, position.z);
    });

    animate();
}

export function resize() {
    renderer.setSize(keyboardContainer.clientWidth, keyboardContainer.clientHeight);
    camera.aspect = keyboardContainer.clientWidth / keyboardContainer.clientHeight;
    camera.updateProjectionMatrix();
};

function animate() {
    frameId = requestAnimationFrame(animate);
    renderer.render(scene, camera);
    TWEEN.update();
}  