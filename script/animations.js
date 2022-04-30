let starLeft;
let starMiddle;
let starRight;
let starLight;

let crownLeft;
let crownMiddle;
let crownRight;
let crownLight;

function initImages () {
    starLeft = document.querySelector("#star-1");
    starMiddle = document.querySelector("#star-2");
    starRight = document.querySelector("#star-3");
    starLight = document.querySelector("#star-light");

    crownLeft = document.querySelector("#crown-1");
    crownMiddle = document.querySelector("#crown-2");
    crownRight = document.querySelector("#crown-3");
    crownLight = document.querySelector("#crown-light");
}

let animations = {
    scaleIn: {
        KF: [
            { transform: "scale(4)" },
            { transform: "scale(1)" }
        ],
        t: {
            duration: 250
        }
    },
    blink: {
        KF: [
            { opacity: 1 },
            { opacity: 0 },
        ],
        t: {
            delay: 300,
            duration: 300
        }
    },
    fadeOut: {
        KF: [
            { opacity: 1 },
            { opacity: 0 },
        ],
        t: {
            delay: 1000,
            duration: 250
        }
    },
    toLeft: {
        KF: [
            { transform: "translateX(0px)" },
            { transform: "translateX(-48px)" }
        ],
        t: {
            duration: 200,
            easing: "ease-out",
            fill: "forwards"
        }
    },
    toRight: {
        KF: [
            { transform: "translateX(0px)" },
            { transform: "translateX(48px)" }
        ],
        t: {
            duration: 200,
            easing: "ease-out",
            fill: "forwards"
        }
    }
};

let animation = {
    star1: function() {
        starRight.style.display = "block";

        starRight.animate(animations.scaleIn.KF, animations.scaleIn.t);
        starLight.animate(animations.blink.KF, animations.blink.t);
        starRight.animate(animations.fadeOut.KF, animations.fadeOut.t);
        setTimeout(()=> {
            starRight.style.display = "none";
        },1250);
    },
    star2: function() {
        starLeft.style.transform = "translateX(0px)";
        starRight.style.display = "block";
        starLeft.style.display = "block";

        starLeft.animate(animations.toLeft.KF, animations.toLeft.t);
        starRight.animate(animations.scaleIn.KF, animations.scaleIn.t);
        starLight.animate(animations.blink.KF, animations.blink.t);

        starLeft.animate(animations.fadeOut.KF, animations.fadeOut.t);
        starRight.animate(animations.fadeOut.KF, animations.fadeOut.t);
        setTimeout(()=> {
            starLeft.style.display = "none";
            starRight.style.display = "none";
        },1250);
    },
    star3: function() {
        starLeft.style.transform = "translateX(-48px)";
        starMiddle.style.display = "block";
        starRight.style.display = "block";
        starLeft.style.display = "block";

        starMiddle.animate(animations.toRight.KF, animations.toRight.t);
        starRight.animate(animations.scaleIn.KF, animations.scaleIn.t);
        starLight.animate(animations.blink.KF, animations.blink.t);

        starLeft.animate(animations.fadeOut.KF, animations.fadeOut.t);
        starRight.animate(animations.fadeOut.KF, animations.fadeOut.t);
        starMiddle.animate(animations.fadeOut.KF, animations.fadeOut.t);

        setTimeout(()=> {
            starLeft.style.display = "none";
            starRight.style.display = "none";
            starMiddle.style.display = "none";
        },1250);

    },
    crown1: function() {
        crownRight.style.display = "block";

        crownRight.animate(animations.scaleIn.KF, animations.scaleIn.t);
        crownLight.animate(animations.blink.KF, animations.blink.t);
        crownRight.animate(animations.fadeOut.KF, animations.fadeOut.t);
        setTimeout(()=> {
            crownRight.style.display = "none";
        },1250);
    },
    crown2: function() {
        crownLeft.style.transform = "translateX(0px)";
        crownRight.style.display = "block";
        crownLeft.style.display = "block";

        crownLeft.animate(animations.toLeft.KF, animations.toLeft.t);
        crownRight.animate(animations.scaleIn.KF, animations.scaleIn.t);
        crownLight.animate(animations.blink.KF, animations.blink.t);

        crownLeft.animate(animations.fadeOut.KF, animations.fadeOut.t);
        crownRight.animate(animations.fadeOut.KF, animations.fadeOut.t);
        setTimeout(()=> {
            crownLeft.style.display = "none";
            crownRight.style.display = "none";
        },1250);
    },
    crown3: function() {
        crownLeft.style.transform = "translateX(-48px)";
        crownMiddle.style.display = "block";
        crownRight.style.display = "block";
        crownLeft.style.display = "block";

        crownMiddle.animate(animations.toRight.KF, animations.toRight.t);
        crownRight.animate(animations.scaleIn.KF, animations.scaleIn.t);
        crownLight.animate(animations.blink.KF, animations.blink.t);

        crownLeft.animate(animations.fadeOut.KF, animations.fadeOut.t);
        crownRight.animate(animations.fadeOut.KF, animations.fadeOut.t);
        crownMiddle.animate(animations.fadeOut.KF, animations.fadeOut.t);

        setTimeout(()=> {
            crownLeft.style.display = "none";
            crownRight.style.display = "none";
            crownMiddle.style.display = "none";
        },1250);
    }
};

export { initImages, animation };