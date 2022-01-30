"use strict";

import lottie from "lottie-web";

window.onbeforeunload = () => window.scrollTo(0, 0);

const headerAnim = lottie.loadAnimation({
    container: document.querySelector("#intro-anim"),
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: '/assets/json/blog-header.json'
});