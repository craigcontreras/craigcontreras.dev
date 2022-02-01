"use strict";

import { loadAnimation } from "lottie-web/build/player/lottie_light.min.js";

let header, headerImg;

window.onbeforeunload = () => window.scrollTo(0, 0);

function loadHeaderAnim() {
  headerAnim = loadAnimation({
    container: document.querySelector("#intro-anim"),
    renderer: 'svg',
    loop: false,
    autoplay: true,
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

const keyboardContainerEnter = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      importModel();
      keyboardContainerEnter.disconnect();
    }
  })
});

keyboardContainerEnter.observe(document.querySelector("#keyboard-trigger"));

async function importModel() {
  const {createScene, loadModel, resize} = await import("./keyboard-anim.js");
  createScene();
  loadModel();
  window.addEventListener("resize", resize);
}

function init() {
  loadHeaderAnim();

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