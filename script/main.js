/*******************************
 * HTML-5 Piano Tiles Project  *
 *          main.js            *
 * https://github.com/Feri8256 *
 *******************************/
//

import { loadMenu } from "./menuLoader.js";
import { initGameOverScreen } from "./endScreen.js";
import { initGameplay, fetchSong, gameOverBack, gameOverRetry, handleResize, displayNavBar } from "./gameplay.js";
import { changeGain } from "./audioLoaderAndPlayerThing.js";
import { initImages } from "./animations.js";

const songListUrl = "assets/res/songlist.json";

let loading;
let screenSongs;
let screenHome;
let screenSettings;
let screenEnd;
let settingsVolumeSlider;
let screens = [];
let screenScrollPositions = [0, 0, 0, 0];
let currentScreen;
let currentScreenId = 0;
let navButtons;

function preload() {
    //Grab HTML elements
    navButtons = document.querySelectorAll(".nav-btn");
    loading = document.querySelector("#loading");
    screenSongs = document.querySelector("#songlist");
    screenHome = document.querySelector("#home");
    screenSettings = document.querySelector("#settings");
    screenEnd = document.querySelector("#end");
    settingsVolumeSlider = document.querySelector("#vol");
    settingsVolumeSlider.addEventListener("change", (ev) => {
        changeGain(parseInt(ev.target.value));
    });

    fetch(songListUrl)
        .then(response => response.json())
        .then(data => {
            loadMenu(data.menuList, screenSongs);
            setup();
        });
}

function setup() {
    screens = [
        screenHome,
        screenSongs,
        screenSettings
    ];

    //Make navigation buttons work
    navButtons.forEach((element) => {
        element.addEventListener("click", (evt) => {
            let screenId = parseInt(evt.target.dataset.id);
            navButtons.forEach(el => el.classList.remove("active"));
            evt.target.classList.add("active");

            screens.forEach(s => s.style.display = "none");
            screens[screenId].style.display = "block";
            currentScreen = screens[screenId];
            currentScreenId = screenId;

            window.scrollTo(0, screenScrollPositions[screenId]);
        });
    });

    initImages();
    initGameOverScreen(screenEnd, gameOverBack, gameOverRetry)
    initGameplay();
    //Grab every play button and attach click event listener to them
    let playButtons = document.querySelectorAll(".play-btn");
    playButtons.forEach(btn => {
        btn.addEventListener("click", (evt) => {
            fetchSong(evt.target.dataset.filename, evt.target.dataset.id, currentScreen);
        });
    });

    //Remove the loading circle and switch to the home screen when everything is ready
    loading.remove();
    currentScreen = screens[0];
    currentScreen.style.display = "block";
    displayNavBar();
}

//====================[EVENT LISTENERS]====================
window.addEventListener("load", preload);
window.addEventListener("resize", handleResize);
window.addEventListener("scroll", function () {
    screenScrollPositions[currentScreenId] = window.scrollY;
});
