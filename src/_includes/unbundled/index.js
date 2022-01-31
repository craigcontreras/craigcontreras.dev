"use strict";

import { loadAnimation } from "lottie-web/build/player/lottie_light.min.js";
import { Scene, PerspectiveCamera, WebGLRenderer, Color, AmbientLight } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

let scene, camera, renderer, frameId;
let header, headerImg;
let keyboardContainer;

window.onbeforeunload = () => window.scrollTo(0, 0);

function createScene() {
  scene = new Scene(); //set up the scene
  camera = new PerspectiveCamera(
    60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 1.25);
  renderer = new WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  keyboardContainer = document.querySelector("#keyboard")
  keyboardContainer.append(renderer.domElement);
}

function loadModel() {
  const color = new Color("rgb(0, 12, 165)");
  var ambient = new AmbientLight(color);
  scene.add(ambient);

  const loader = new OBJLoader();

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

function resize() {
  renderer.setSize(keyboardContainer.clientWidth, keyboardContainer.clientHeight);
  camera.aspect = keyboardContainer.clientWidth / keyboardContainer.clientHeight;
  camera.updateProjectionMatrix();
};

function animate() {
  frameId = requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function loadHeaderAnim() {
  headerAnim = loadAnimation({
    container: document.querySelector("#intro-anim"),
    renderer: 'svg',
    loop: false,
    autoplay: true,
    useWebWorker: false,
    progressiveLoad: true,
    path: '/assets/json/index-header.json'
  });
}

const wcydContainerEnter = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      importWcydAnim();
      wcydContainerEnter.disconnect();
    }
  })
});

wcydContainerEnter.observe(document.querySelector("#wcyd-anim-trigger"));

async function importWcydAnim() {
  const {loadWcydAnim, attachObserverToWcyd, endlessScroll} = await import("./wcyd-anim.js");
  loadWcydAnim();
  attachObserverToWcyd();
  document.addEventListener("scroll", endlessScroll); 
}

function init() {
  loadHeaderAnim();
  createScene();
  loadModel();
  window.addEventListener("resize", resize);

  header = document.querySelector("header");
  headerImg = document.querySelector("#header-img");

  header.addEventListener("mouseenter", (e) => {
    const paths = ["/assets/img/img-2.webp", "/assets/img/img-3.webp", "/assets/img/img-4.webp"];
    const randomImg = paths[Math.floor(Math.random() * paths.length)];
    headerImg.src = randomImg;
    // set mouse cursor to the mouse pointer's position by using margin
    headerImg.style.left = e.clientX + "px";
    headerImg.style.top = e.clientY + "px";

    const random = (Math.random() * -25 + 1) + (Math.random() * 25 + 1);

    headerImg.style.transform = `rotate(${random}deg) translate(-50%)`;
    headerImg.classList.remove("hidden");

    // when it leaves header hide the image
    header.addEventListener("mouseleave", () => {
      headerImg.classList.add("hidden");
    });

    // on mouse move update image position
    header.addEventListener("mousemove", (e) => {
      // set mouse cursor to the mouse pointer's position by using margin
      headerImg.style.left = e.clientX + "px";
      headerImg.style.top = e.clientY + "px";
    });
  });
}

document.addEventListener("DOMContentLoaded", init);