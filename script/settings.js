// page loads --> get inputs, set event listeners, read settings --> apply readed settings and modify inputs on UI
// receive change event from an input --> apply new values --> save

import { changeGain } from "./audioLoaderAndPlayerThing.js";

let settingsObject = {
    audio: {
        volume: 100
    }
};

let volumeSlider;

function getSettings() {
    let loaded = localStorage.getItem("settings");
    if (loaded) settingsObject = JSON.parse(loaded);
}

function applySettings() {
    volumeSlider.value = settingsObject.audio.volume;
    changeGain(settingsObject.audio.volume);
}

function loadSettings() {
    volumeSlider = document.querySelector("#vol");
    volumeSlider.addEventListener("change", (ev) => {
        let val = parseInt(ev.target.value);
        settingsObject.audio.volume = val;
        changeGain(val);
        saveSettings();
    });

    getSettings();
    applySettings();
}

function saveSettings() {
    localStorage.setItem("settings", JSON.stringify(settingsObject));
}

export { loadSettings }
