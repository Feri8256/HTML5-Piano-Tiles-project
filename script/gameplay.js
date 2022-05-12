/*******************************
 * HTML-5 Piano Tiles Project  *
 *        gameplay.js          *
 * https://github.com/Feri8256 *
 *******************************/
//

import { songLoader } from "./songLoader.js";
import { loadTiles } from "./loadTiles.js";
import { Tile } from "./tile.js";
import { ScoreCounter } from "./scoreCounter.js";
import { switcher } from "./switcher.js";
import { AudioThing } from "./audioLoaderAndPlayerThing.js";
import { NotePlayer } from "./notePlayer.js";
import { updateGameOverScreen } from "./endScreen.js";
import { animation } from "./animations.js";

const songsBaseUrl = "assets/res/songs/";
const soundsBaseUrl = "assets/res/sounds/";
const failSound = [48, 52, 55];
const hitKeys = ["KeyD","KeyF","KeyJ","KeyK"];
const FPSconstant = 60;
let mouse = { x: 0, y: 0, click: false };
let touches = [];

let c;
let frameId;
let lastFrameTimeStamp = 0;
let delta = 0;
let lastFPS = 0;
let heightSpeedScaling = 0;
let frameRateSpeedScaling = 0;

let s;
let scoreCounter;
let canvasElement;
let navBar;
let screenEnd;
let previousScreenElement;
let song;
let tiles = [];
let width = 0;
let height = 0;
let tileWidth = 0;
let tileHeight = 0;
let linePos = 0;
let tilesOnScreen = 6
let currentTile = 0;
let currentSpeed = 0;
let state = 0;
let rewardCount = 0;
let inGame = false;
let scoreVisible = true;
let isGameOver = false;

function dn(n) { s.decodeNote(n); }
function sc(v) { scoreCounter.add(v); }

function initGameplay() {
    navBar = document.querySelector("#nav");
    screenEnd = document.querySelector("#end");
    canvasElement = document.querySelector("canvas");
    c = canvasElement.getContext("2d");
    width = canvasElement.width = window.innerWidth;
    height = canvasElement.height = window.innerHeight;
    tileWidth = width * 0.25;
    tileHeight = height * 0.25;
    heightSpeedScaling = height / 600;
    linePos = height * 0.75;
    s = new NotePlayer(soundsBaseUrl, "piano/", AudioThing);
    scoreCounter = new ScoreCounter("#f04664", 67, 60, -1.4, 10);
}

function displayNavBar() {
    navBar.style.display = "flex";
}

function hideNavBar() {
    navBar.style.display = "none";
}

function handleResize() {
    width = canvasElement.width = window.innerWidth;
    height = canvasElement.height = window.innerHeight;
    tileWidth = width * 0.25;
    tileHeight = height * 0.25;
    heightSpeedScaling = height / 600;
    linePos = height * 0.75;
}

function calcReward() {
    rewardCount++;
    if (rewardCount > 6) return;

    scoreVisible = false;
    setTimeout(() => scoreVisible = true, 1300);
    switch (rewardCount) {
        case 1:
            animation.star1();
            break;
        case 2:
            animation.star2();
            break;
        case 3:
            animation.star3();
            break;
        case 4:
            animation.crown1();
            break;
        case 5:
            animation.crown2();
            break;
        case 6:
            animation.crown3();
            break;
    }
}

function setGameStart() {
    tiles[0].y = tileHeight * 3;
    tiles[0].startingTile = true;
}

function setSpeedAtStart() { currentSpeed = song.baseSpeed; }

function addSpeed() { currentSpeed += song.speedIncrement; }

function repeatSong() {
    currentTile = 0;
    tiles = [];
    tiles = loadTiles(Tile, song, setSpeedAtStart, dn, sc);
}

function gameOver(t) {
    console.log(t)
    currentSpeed = 0;
    inGame = false;
    s.decodeNote(failSound);

    setTimeout(() => {
        switcher(canvasElement, screenEnd);
        c.clearRect(0, 0, width, height);
        currentTile = 0;
        tiles = [];
        state = 0;
        updateGameOverScreen(height, song.title, scoreCounter.value, song.id);
        isGameOver = true;
    }, 1000);
}

function gameOverRetry() {
    switcher(screenEnd, canvasElement)
    c.clearRect(0, 0, width, height);
    rewardCount = 0;
    tiles = loadTiles(Tile, song, setSpeedAtStart, dn, sc);
    setGameStart();
    state = 1;
    inGame = true;
    isGameOver = false;
    scoreCounter.reset();
}

function gameOverBack() {
    switcher(screenEnd, previousScreenElement);
    displayNavBar();
    c.clearRect(0, 0, width, height);
    rewardCount = 0;
    currentTile = 0;
    song = null;
    tiles = [];
    state = 0;
    isGameOver = false
    scoreCounter.reset();
    cancelAnimationFrame(frameId);
}

function fetchSong(filename, id, currentScreen) {
    hideNavBar();
    previousScreenElement = currentScreen;
    console.log("loading song file", filename);
    switcher(currentScreen, canvasElement);
    frameId = requestAnimationFrame(drawLoop);
    fetch(songsBaseUrl + filename)
        .then(res => res.json())
        .then(data => {
            song = songLoader(data, id);
            tiles = loadTiles(Tile, song, setSpeedAtStart, dn, sc);
            setGameStart();
            state = 1;
            inGame = true;
        })
        .catch(error => {
            cancelAnimationFrame(frameId);
            console.error(error);
            switcher(canvasElement, currentScreen);
            alert("Failed to load the song.");
        });
}



function drawLoop(timestamp) {
    delta = timestamp - lastFrameTimeStamp;
    lastFPS = 1000 / delta;
    frameRateSpeedScaling = (delta > 100) ? 1 : (FPSconstant / lastFPS);
    lastFrameTimeStamp = timestamp;

    c.clearRect(0, 0, width, height);

    switch (state) {
        case 0:
            c.fillStyle = "#ffffff";
            c.textAlign = "center";
            c.font = "50px futura";
            c.fillText("Loading", width * 0.5, height * 0.5);
            break;

        case 1:
            c.fillStyle = "#ffffff";
            c.fillRect(width * 0.25, 0, 1, height);
            c.fillRect(width * 0.5, 0, 1, height);
            c.fillRect(width * 0.75, 0, 1, height);

            for (let i = currentTile; i < currentTile + tilesOnScreen; i++) {
                if (tiles[i + 1]) tiles[i + 1].y = tiles[i].y - tileHeight;

                tiles[i]?.update(tileWidth, tileHeight, currentSpeed * (heightSpeedScaling * frameRateSpeedScaling), mouse, touches, inGame);
                tiles[i]?.draw(c);

                if (!tiles[i]?.commandCheck) {
                    if (tiles[i]?.tileNoteObject.a) addSpeed();
                    if (tiles[i]?.tileNoteObject.b) calcReward();
                    tiles[i].commandCheck = true;
                }

                if (currentTile === tiles.length - 8) {
                    calcReward();
                    repeatSong();
                }

                if (tiles[i]?.y >= tileHeight * (tilesOnScreen - 1)) {
                    if (!tiles[i].tapped && tiles[i].tileType !== 0 && !tiles[i].failCheck) gameOver(tiles[i]);//console.log("missed")//reduceLife(tiles[i]);
                    tiles[i].failCheck = true;
                }

                if (tiles[i]?.y > tileHeight * tilesOnScreen) currentTile++;
            }

            scoreCounter.update();
            if (scoreVisible) {
                scoreCounter.draw(c, width);
            }

            c.fillStyle = "#333333";
            c.fillRect(0, linePos + 1, width, 3);

            c.fillStyle = "#ff5522";
            c.fillRect(0, linePos, width, 3);

            break;
    }  

    frameId = requestAnimationFrame(drawLoop);
}

window.addEventListener("keydown", (ev) => {
    let k = ev.code;
    if (inGame) {
        for (let c = currentTile; c < currentTile + 3; c++) {
            let chkKey = tiles[c].tilePos;
            if (k === hitKeys[chkKey] && tiles[c].y >= linePos) {
                tiles[c].tap();
            }
        }
    }

    if (isGameOver) {
        if (k === "KeyR") gameOverRetry();
        if (k === "Escape") gameOverBack();
    }
});

window.addEventListener("mousemove", (ev) => {
    mouse.x = ev.clientX;
    mouse.y = ev.clientY;
});

window.addEventListener("mousedown", () => {
    mouse.click = true;
});

window.addEventListener("mouseup", () => {
    mouse.click = false;
});

window.addEventListener("touchstart", (ev) => {
    
    if (ev.touches.length > 2) return touches = [];
    for (let t of ev.touches) touches.push(t);
});

window.addEventListener("touchend", (ev) => {
    for (let ct of ev.changedTouches) touches = touches.filter(t => t.identifier !== ct.identifier);
});

window.addEventListener("touchcancel", () => {
    touches = [];
});

export { initGameplay, displayNavBar, hideNavBar, handleResize, gameOverRetry, gameOverBack, fetchSong }
