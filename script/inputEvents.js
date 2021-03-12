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
        let chkKey;
        if (tiles[currentTile+1].y >= HitLineOffset) chkKey = tiles[currentTile+1].tilePos;
        if (key === HitKeys[chkKey] && tiles[currentTile+1].y >= HitLineOffset) {
            DecodeNote(tiles[currentTile+1].tileNote.n, false, tiles[currentTile+1].tapped);
            tiles[currentTile+1].tapped = true;
            if(!AutoPlayEnable){
                if (tiles[currentTile+1].tileNote.n.length && tiles[currentTile+1].tileNote.n[0].sn) {
                    Score = Score + tiles[currentTile+1].tileNote.n.length;
                }
                else {
                   Score++; 
                }
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
        if (DisplayInfo) {
            DisplayInfo = false;
        }
        else {
            DisplayInfo = true;
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
        if (event.delta < 0) MenuScrollY += Math.abs(event.delta) / 2; //up
        if (event.delta > 0) MenuScrollY += -event.delta / 2; //down
    }
    return false;
}