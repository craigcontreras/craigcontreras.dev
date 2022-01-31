"use strict";

import lottie from "lottie-web/build/player/lottie_light.min.js";

const hamburgerAnim = lottie.loadAnimation({
    container: document.querySelector("#hamburger-icon"),
    renderer: 'svg',
    loop: false,
    autoplay: false,
    useWebWorker: false,
    path: '/assets/json/hamburger.json'
  });

const hamburger = document.querySelector("#hamburger");
let hamburgerMenuOpened;

hamburger.addEventListener("click", e => {
  e.preventDefault();
  if (!hamburgerMenuOpened) {
    hamburgerMenuOpened = true;
    hamburgerAnim.playSegments([0, 10], true);
    document.querySelector("article").classList.add("no-events");
    document.querySelectorAll(".desktop-hyperlink").forEach(element => {
      element.style.display = "block";
    })  
    document.querySelector("article").classList.add("blur-animation");
  } else {
    hamburgerMenuOpened = false;
    hamburgerAnim.playSegments([10, 21], true);
    document.querySelector("article").classList.remove("no-events");
    document.querySelectorAll(".desktop-hyperlink").forEach(element => {
      element.style.display = "none";
    });

    document.querySelector("article").classList.remove("blur-animation");
  }
});

function closeHamburgerMenu() {
  if (hamburgerMenuOpened) {
    hamburgerMenuOpened = false;
    document.querySelector("article").classList.remove("blur-animation");
    document.querySelector("article").classList.remove("no-events");
    document.querySelectorAll(".desktop-hyperlink").forEach(element => {
      element.style.display = "none";
    });
    hamburgerAnim.playSegments([10, 21], true);
  }
}