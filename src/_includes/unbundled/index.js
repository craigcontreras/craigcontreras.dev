"use strict";

import lottie from "lottie-web";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

let scene, camera, renderer, frameId;
let header, headerImg;
let headerAnim, wcydAnim, wcydObserver, keyboardContainer;
let scrollEffect = 0, lastScrollTop = 0, animationStart = 0;
let complete = false;

window.onbeforeunload = () => window.scrollTo(0, 0);

function createScene() {
  scene = new THREE.Scene(); //set up the scene
  camera = new THREE.PerspectiveCamera(
    60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 1.25);
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  keyboardContainer = document.querySelector("#keyboard")
  keyboardContainer.append(renderer.domElement);
}

function loadModel() {
  const color = new THREE.Color("rgb(0, 12, 165)");
  var ambient = new THREE.AmbientLight(color);
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
  headerAnim = lottie.loadAnimation({
    container: document.querySelector("#intro-anim"),
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: 'https://assets5.lottiefiles.com/packages/lf20_ftnubpoc.json'
  });
}

let x = window.matchMedia("(max-width: 992px)");
function loadWcydAnim() {
  if (x.matches) {
    wcydAnim = lottie.loadAnimation({
      container: document.querySelector("#wcyd-anim"),
      renderer: 'canvas',
      loop: false,
      autoplay: false,
      path: '/assets/json/wcyd-animation-mobile.json'
    })
  } else {
    wcydAnim = lottie.loadAnimation({
      container: document.querySelector("#wcyd-anim"),
      renderer: 'canvas',
      loop: false,
      autoplay: false,
      path: '/assets/json/wcyd-animation-desktop.json',
      rendererSettings: {
        preserveAspectRatio: 'xMidYMax slice'
      }
    })
  };
}

function attachObserverToWcyd() {
  if (x.matches) {
    wcydObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          document.addEventListener("scroll", playAnimation);
        } else {
          document.removeEventListener("scroll", playAnimation);
        }
      })
    });
  } else {
    wcydObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio >= 1) {
          document.addEventListener("scroll", playAnimation);
        } else {
          document.removeEventListener("scroll", playAnimation);
        }
      })
    }, {
      threshold: 1.0
    });
  }

  wcydObserver.observe(document.querySelector("#wcyd-anim"));
}

function playAnimation() {
  let st = window.pageYOffset || document.documentElement.scrollTop;
  if (st > lastScrollTop) {
    wcydAnim.playSegments([animationStart, animationStart + 1], true);
    if (animationStart >= 432) {
      complete = true;
    } else {
      animationStart++;
    }
  } else {
    wcydAnim.playSegments([animationStart, animationStart - 1], true);
    if (animationStart != 0) {
      animationStart--;
    } else {
      document.querySelector("#spacer").style.height = `0vh`;
      scrollEffect = 0;
    }
  }
  lastScrollTop = st <= 0 ? 0 : st;
}

function endlessScroll() {
  scrollEffect += 1;
  document.querySelector("#spacer").style.height = `${100 + (scrollEffect * 75)}vh`;

  if (complete) {
    document.removeEventListener("scroll", endlessScroll);
    document.querySelector("#wcyd-anim").classList.add("hidden");
    document.querySelector("#spacer").classList.add("hidden");
    document.querySelector("#project-section").classList.remove("hidden");
    document.querySelector("#blog-section").classList.remove("hidden");
    document.querySelector("footer").classList.remove("hidden");
    document.querySelector("#spacer").style.display = "none";
    loadAnimationsLoadedAfter();
  }
}

async function loadAnimationsLoadedAfter() {
  const {createViewAllAnim, assignViewAllEvents, createLetsTalkAnim, assignLetsTalkEvents} = await import("./invisible-animations.js");
  console.log("imported methods");
  createViewAllAnim();
  assignViewAllEvents();
  createLetsTalkAnim();
  assignLetsTalkEvents();
}

function init() {
  loadHeaderAnim();
  createScene();
  loadModel();
  window.addEventListener("resize", resize);

  loadWcydAnim();
  attachObserverToWcyd();
  document.addEventListener("scroll", endlessScroll);

  header = document.querySelector("header");
  headerImg = document.querySelector("#header-img");

  header.addEventListener("mouseenter", (e) => {
    const paths = ["/assets/img/img-1.png", "/assets/img/img-2.jpg", "/assets/img/img-3.jpg", "/assets/img/img-4.jpg", "/assets/img/img-5.jpg"];
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