function keyPressed() {

    //Press any hit key to start
    /*if (HitKeys.includes(key) &&
        PauseState &&
        !FailState &&
        ScreenState === 1
    ) {
        SetSpeedAtStart();
        PauseState = false;
    }*/

    if (ScreenState === 1 && !FailState) {
        for (let c = currentTile; c < currentTile + 3; c++) {
            let chkKey = tiles[c].tilePos;
            if (key === HitKeys[chkKey] && tiles[c].y >= HitLineOffset && !tiles[c].tapped && tiles[c].tileNote !== 0) {
                tiles[c].tap()
            }
        }

        if (key === 'r') {
            if (FailState){
                retryFromFail();
            }
            else {
                resetReward();
                resetTiles();
                startingState = true;
                tiles[0].y = 450;
                tiles[0].startingTile = true;
            }
        }
    
        if (key === 'i') {
            if (Options.DisplayInfo) {
                Options.DisplayInfo = false;
            }
            else {
                Options.DisplayInfo = true;
            }
        }
    
        if (key === 'a') {
            if (AutoPlayEnable) {
                AutoPlayEnable = false;
            }
            else {
                AutoPlayEnable = true;
            }
        }
    
        if (key === 'q') setFail();
        if (key === 'x' && FailState) failToMenu();
    }

    if (ScreenState === 3) {
        if (key === 'x') failToMenu();
        if (key === 'r') retryFromFail();
    }
}

function touchStarted() {
    touchstart = true;
    //Nem engedi, hogy a hosszabb ideig rajta tartott ujjak érvényesnek számítsanak
    if (touches.length >= 2) {
        setTimeout(()=>{
            touchstart = false;
        }, 100);
    }
}

function touchEnded() {
    if(touches.length === 0) {
        touchstart = false;
    }
}

function mouseWheel(event) {
    if (ScreenState === 0) {
        if (event.delta < 0 && MenuPageNumber != 0) MenuPageNumber--; //up
        if (event.delta > 0 && MenuPageNumber < SongListElements.length - 4) MenuPageNumber++; //down
    }
    return false;
}