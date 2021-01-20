function keyPressed() {

    //Press any hit key to start
    if (HitKeys.includes(key) &&
        PauseState &&
        !FailState &&
        ScreenStates.Screen_Game
    ) {
        SetSpeedAtStart();
        PauseState = false;
    }

    if (ScreenStates.Screen_Game) {
        let chkKey;
        if (tiles[currentTile+1].y >= HitLineOffset) chkKey = tiles[currentTile+1].tilePos;
        if (key === HitKeys[chkKey] && tiles[currentTile+1].y >= HitLineOffset) {
            DecodeNote(tiles[currentTile+1].tileNote.n, false, tiles[currentTile+1].tapped);
            tiles[currentTile+1].tapped = true;
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

function mouseWheel(event) {
    if (ScreenStates.Screen_Menu) {
        if (event.delta < 0) MenuScrollY += Math.abs(event.delta) / 2; //up
        if (event.delta > 0) MenuScrollY += -event.delta / 2; //down
    }
    return false;
}