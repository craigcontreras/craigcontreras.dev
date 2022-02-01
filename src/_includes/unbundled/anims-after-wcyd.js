"use strict";

import { loadAnimation } from "lottie-web/build/player/lottie_light.min.js";

let letsTalk, viewAll, viewAllContainer, letsTalkContainer;

export function createLetsTalkAnim() {
    letsTalk = loadAnimation({
        container: document.querySelector("#lets-talk"),
        renderer: 'svg',
        loop: false,
        autoplay: false,
        progressiveLoad: true,
        path: "/assets/json/letstalk.json"
    });
}

export function assignLetsTalkEvents() {
    letsTalkContainer = document.querySelector("#lets-talk");
    letsTalkContainer.addEventListener("mouseenter", e => {
        e.stopPropagation();
        letsTalk.play();
        letsTalk.loop = true;
    })

    letsTalkContainer.addEventListener("mouseleave", e => {
        letsTalk.loop = false;
    })

    letsTalkContainer.addEventListener("click", e => {
        open("mailto:craigcontreras@protonmail.com");
    });
}

export function createViewAllAnim() {
    viewAll = loadAnimation({
        container: document.querySelector("#view-all-posts"),
        renderer: 'svg',
        loop: false,
        autoplay: false,
        useWebWorker: false,
        progressiveLoad: true,
        path: "/assets/json/view-all.json"
    });
}

export function assignViewAllEvents() {
    viewAllContainer = document.querySelector("#view-all-posts");
    viewAllContainer.addEventListener("mouseenter", e => {
        e.stopPropagation();
        viewAll.play();
        viewAll.loop = true;
    })

    viewAllContainer.addEventListener("mouseleave", e => {
        viewAll.loop = false;
    })

    viewAllContainer.addEventListener("click", e => {
        document.querySelector(".transition").classList.add("is-active");
        setTimeout(() => {
            window.location.replace("/blog.html");
        }, 500);
    });
}