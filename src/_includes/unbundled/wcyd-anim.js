import lottie from "lottie-web/build/player/lottie_light.min.js";

let wcydAnim, wcydObserver;
let scrollEffect = 0, lastScrollTop = 0, animationStart = 0;
let complete = false;

let x = window.matchMedia("(max-width: 992px)");
export function loadWcydAnim() {
    if (x.matches) {
        wcydAnim = lottie.loadAnimation({
            container: document.querySelector("#wcyd-anim"),
            renderer: 'svg',
            loop: false,
            autoplay: false,
            useWebWorker: false,
            progressiveLoad: true,
            path: '/assets/json/wcyd-animation-mobile.json'
        })
    } else {
        wcydAnim = lottie.loadAnimation({
            container: document.querySelector("#wcyd-anim"),
            renderer: 'svg',
            loop: false,
            autoplay: false,
            useWebWorker: false,
            progressiveLoad: true,
            path: '/assets/json/wcyd-animation-desktop.json',
            rendererSettings: {
                preserveAspectRatio: 'xMidYMax slice'
            }
        })
    };
}

export function attachObserverToWcyd() {
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

export function endlessScroll() {
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
    const {createViewAllAnim, createLetsTalkAnim, assignViewAllEvents, assignLetsTalkEvents} = await import("./anims-after-wcyd.js");
    createViewAllAnim();
    assignViewAllEvents();
    createLetsTalkAnim();
    assignLetsTalkEvents();
}