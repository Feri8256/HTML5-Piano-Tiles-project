function keyPressed() {

    //Press any hit key to start
    if (HitKeys.includes(key) &&
        PauseState &&
        !FailState &&
        ScreenState === 1
    ) {
        SetSpeedAtStart();
        PauseState = false;
    }

    if (ScreenState === 1) {
        for (var c = currentTile; c < currentTile + 3; c++) {
            let chkKey = tiles[c].tilePos;
            if (key === HitKeys[chkKey] && tiles[c].y >= HitLineOffset && !tiles[c].tapped) {
                DecodeNote(tiles[c].tileNote.n, false, tiles[c].tapped);
                if(!AutoPlayEnable){
                    if (tiles[c].tileNote.n.length && tiles[c].tileNote.n[0].sn) {
                        Score = Score + tiles[c].tileNote.n.length;
                    }
                    else {
                       Score++; 
                    }
                }
                tiles[c].tapped = true;
            }
        }
    }

    if (key === 'r') {
        if (FailState){
            RetryFromFail();
        }
        else {
            ResetReward();
            ResetTiles();
            PauseState = true;
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

    if (key === 'q') {
        SetFail();
    }

    if (key === 'x' && FailState) {
        FailToMenu();
    }
}


function touchStarted() {
    touchstart = true;

    //Nem engedi, hogy a hosszabb ideig rajta tartott újjak érvényesnek számítsanak
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