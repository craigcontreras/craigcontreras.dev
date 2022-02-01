"use strict";

import { LoadingManager, Scene, PerspectiveCamera, WebGLRenderer, Color, AmbientLight } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

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
            obj.position.set(0, 0, 0);

            setInterval(() => {
                obj.rotateY(0.01);
                obj.rotateX(0.01);
            }, 1 / 60);
        }
    );

    animate();
}

manager.onLoad = () => {
    document.querySelector("#keyboard canvas").classList.add("fade-animation");
}

export function resize() {
    renderer.setSize(keyboardContainer.clientWidth, keyboardContainer.clientHeight);
    camera.aspect = keyboardContainer.clientWidth / keyboardContainer.clientHeight;
    camera.updateProjectionMatrix();
};

function animate() {
    frameId = requestAnimationFrame(animate);
    renderer.render(scene, camera);
}  