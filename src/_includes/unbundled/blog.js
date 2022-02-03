"use strict";

import { loadAnimation } from "lottie-web/build/player/lottie_light.min.js";

window.onbeforeunload = () => window.scrollTo(0, 0);

const headerAnim = loadAnimation({
    container: document.querySelector("#intro-anim"),
    renderer: 'svg',
    loop: false,
    autoplay: true,
    progressiveLoad: true,
    path: '/assets/json/blog-header.json'
});

document.querySelector("#top-post").addEventListener("click", e => {
    let target = document.querySelector("#top-post a").href;
                
    document.querySelector(".transition").classList.add("is-active");
    setTimeout(() => {
        window.location.replace(target);
    }, 500);
});