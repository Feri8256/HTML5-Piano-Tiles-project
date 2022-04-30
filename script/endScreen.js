let backBtn;
let retryBtn;
let titleP;
let scoreP;
let endscreen;

/**
 * Initialize game over screen
 * @param {Function} backFn back function
 * @param {Function} retryFn retry function
 */
export function initGameOverScreen(end, backFn, retryFn) {
    endscreen = end;
    backBtn = document.querySelector("#end-back");
    retryBtn = document.querySelector("#end-retry");
    titleP = document.querySelector("#songtitle");
    scoreP = document.querySelector("#score");

    backBtn.addEventListener("click", backFn);
    retryBtn.addEventListener("click", retryFn);
}

export function updateGameOverScreen(windowHeight, songTitle, score, songId) {
    titleP.textContent = songTitle;
    scoreP.textContent = score;
}

