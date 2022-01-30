window.onload = () => {
    const transitionElement = document.querySelector(".transition");
    const anchors = document.querySelectorAll("a");
    setTimeout(() => {
        transitionElement.classList.remove("is-active");
    }, 500);

    for (let anchor of anchors) {
        anchor.addEventListener("click", e => {
            if (anchor.classList.contains("transitionable")) {
                e.preventDefault();
                let target = e.target.href;
                
                transitionElement.classList.add("is-active");
                setTimeout(() => {
                    window.location.href = target;
                }, 500);
            }
        })
    }
}

// using intersection observer to see when elements enter the viewport
let delay = 0;

const slideInObserver = new IntersectionObserver(entries => {
  entries.forEach((entry) => {
    if (entry.intersectionRatio > 0) {
      setTimeout(() => {
        entry.target.classList.remove("not-visible");
        entry.target.classList.add("slide-in-animation");
        delay += 5;
      }, delay * 20);
    } else {
      delay = 0;
      entry.target.classList.add("not-visible");
      entry.target.classList.remove("slide-in-animation");
    }
  });
});

const slideAnimations = document.querySelectorAll(".slide-animation");
slideAnimations.forEach((element) => {
  slideInObserver.observe(element);
});