"use strict";

import lottie from "lottie-web/build/player/lottie_light.min.js";

window.onbeforeunload = () => window.scrollTo(0, 0);

const headerAnim = lottie.loadAnimation({
    container: document.querySelector("#intro-anim"),
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: '/assets/json/blog-header.json'
});

document.querySelector("#top-post").addEventListener("click", e => {
    let target = e.target.querySelector('a').href;
    console.log(target);
                
    document.querySelector(".transition").classList.add("is-active");
    setTimeout(() => {
        window.location.replace(target);
    }, 500);
});