console.log("%cWelcome to\n%cp5 Tiles", "font-size: 16pt", "font-size: 20pt; font-family: Arial");
const versionText = "14-03-2021"
const songsBaseURL = "assets/res/songs/"
const ImgBaseUrl = "assets/res/images/";
const SndBaseUrl = "assets/res/sounds/";
const HitLineOffset = 370; 
const HitWindowAddHeight = 80;
const HitKeys = ["d","f","j","k"];
const NextTileAfter =   167.99999999999991;
const FailSound = [48,52,55];

let Layouts;

//image res
let BackImg;
let GameBg;
let GameEndBg;
let GameTile;
let GameTileTapped;
let GameTileBlank;
let GameTileDouble;
let GameLines;
let GameHitLine;
let FailPanel;
let ScoreFont;
let LifeBlank;
let Life;
let Star;
let StarBlank;
let Crown;
let CrownBlank;
let BtnMenu;
let BtnRetry;
let BtnArrowUp;
let BtnArrowDown;

//Game variables
let Song;
let tiles = [];
let currentTile = 0;
let Score = 0;
let baseSpeed;
let tilesLength;
let currentSpeed = 0;
let completedLap = 0;
let DisplayInfo = false;
let AutoPlayEnable = false;
let FailState = false;
let PauseState = true;
let Lifes = 3;
let bestScore = 0;
let newBest = false;

/**Reward counter
 * 0: Nothing,
 * 1: 1 star,
 * 2: 2 star,
 * 3: 3 star,
 * 4: 1 crown,
 * 5: 2 crown,
 * 6: 3 crown
*/
let RewardCount = 0;

let IsItHorizontalScreen = false;

/**
 * 0: menu
 * 1: game
 * 2: loading
 */
let ScreenState = 0;

let touchstart = false;

let MenuScrollY = 0;

let BtnMenuPressedOnce = false;
let BtnRetryPressedOnce = false;

let MenuElementsYPosition = 0;
let SongListElements = [];
let LoadMenu;
let SongList;
let PlayNote;
let LoadTiles;
let canvas;

let AppWidth = 0;
let AppHeight = 0;

let CanvasCenterPosition = 0;

window.onerror = function () {
    var confirmation = confirm('Sorry!... A script error occurred. Press OK to reload the page.');
    if (confirmation) location.reload();
}

function setup() {
    AppWidth = window.innerWidth;
    AppHeight = window.innerHeight;

    //Is it desktop screen?
    if (AppWidth > AppHeight) IsItHorizontalScreen = true;

    CanvasCenterPosition = AppWidth / 2;

    canvas = createCanvas(400,600); //400x600
    canvas.position(window.innerWidth / 2 - 200, 0);
    frameRate(60);
    //pixelDensity(1);
    noStroke();
    LoadMenu();
}

function windowResized() {
    canvas.position(window.innerWidth / 2 - 200, 0);
}

function getBestScore(id){
    let testRead = localStorage.getItem(id);
    let output = parseInt(testRead);

    if (isNaN(output)) {
        return 0;
    }
    else return output;
}

function setNewScore(id, score) {
    localStorage.setItem(id, score.toString());
}

function ResetTiles() {
    tiles = [];
    currentTile = 0;
    Score = 0;
    currentSpeed = 0;
    completedLap = 0;
    FailState = false;
    Lifes = 3;
    LoadTiles();
}

function SetSpeedAtStart() {
    currentSpeed = Song.baseSpeed;
}

function AddSpeed() {
    currentSpeed = currentSpeed + Song.speedIncrement;
}

function CalcReward() {
    RewardCount++;
}

function ResetReward() {
    RewardCount = 0;
}

function RepeatSong() {
    completedLap++;
    tiles = [];
    currentTile = 0;
    LoadTiles();
}

function RetryFromFail() {
    if (Score > bestScore) {
        setNewScore(Song.Title, Score);
    } 
    setTimeout(()=>{
        PauseState = true;
        ScreenState = 1;
        ResetTiles();
        ResetReward();
        bestScore = getBestScore(Song.Title);
        newBest = false;
    },500);
}

function ReduceLife() {
    if (Lifes > 0) Lifes--;
    if (Lifes === 0) SetFail();
}

function SetFail() {
    if (FailState === false && ScreenState === 1) {
        currentSpeed = 0;
        DecodeNote(FailSound,true);
        setTimeout(()=>{FailState = true; ScreenState = 3;},1300);
        if (Score > bestScore) {
            newBest = true;
            setNewScore(Song.Title, Score);
        } 
    }
}

//Change screens
function MenuToGame() {
    setTimeout(()=>{
        ScreenState = 1;
    },500);
}

function FailToMenu() {
    FailState = false;
    setTimeout(()=>{
        Song = null;
        currentTile = 0;
        completedLap = 0;
        ResetReward();
        Lifes = 3;
        Score = 0;
        tiles = [];
        ScreenState = 0;
        newBest = false;
    },300);
    
}

//Main draw loop
function draw() {

    switch (ScreenState) {

        //Menu
        case 0:
            background(16);
            textFont(ScoreFont);
            for (var i = 0; i < SongListElements.length; i++) {
                SongListElements[i].show(MenuElementsYPosition,MenuScrollY);
                MenuElementsYPosition += Layouts.MenuCardHeight + 20;
                if (MenuElementsYPosition === 120 * SongListElements.length) MenuElementsYPosition = 0;
            }
    
            if (!IsItHorizontalScreen) {
                image(BtnArrowUp, Layouts.MenuArrowUpAlignX, Layouts.MenuArrowUpAlignY, Layouts.MenuArrowUpSizeX, Layouts.MenuArrowUpSizeY);
                if (
                    mouseX > Layouts.MenuArrowUpAlignX &&
                    mouseX < Layouts.MenuArrowUpSizeX + Layouts.MenuArrowUpAlignX &&
                    mouseY > Layouts.MenuArrowUpAlignY &&
                    mouseY < Layouts.MenuArrowUpSizeY + Layouts.MenuArrowUpAlignY
                ) {
                    if (mouseIsPressed) MenuScrollY += 20;
                }
    
                image(BtnArrowDown, Layouts.MenuArrowDownAlignX, Layouts.MenuArrowDownAlignY, Layouts.MenuArrowDownSizeX, Layouts.MenuArrowDownSizeY);
                if (
                    mouseX > Layouts.MenuArrowDownAlignX &&
                    mouseX < Layouts.MenuArrowDownSizeX + Layouts.MenuArrowDownAlignX &&
                    mouseY > Layouts.MenuArrowDownAlignY &&
                    mouseY < Layouts.MenuArrowDownSizeY + Layouts.MenuArrowDownAlignY
                ) {
                    if (mouseIsPressed) MenuScrollY -= 20;
                }
            }
            break;

        //Game
        case 1:
            if (
                mouseIsPressed && 
                !FailState &&
                PauseState
            ) {
                SetSpeedAtStart();
                PauseState = false;
            }

            image(GameBg, width / 2 - 200, 0,400,AppHeight);
            image(GameLines, width / 2 - 200, 0,400,AppHeight);
    
            if (PauseState) {
                textSize(Layouts.GameStartTextFontSize);
                textAlign(CENTER);
                fill(Layouts.GameStartTextColor);
                if (IsItHorizontalScreen) {
                    text("Press\nD / F / J / K", 200, Layouts.GameStartTextAlignY);
                }
                else {
                    text("Tap to start", 200, Layouts.GameStartTextAlignY);
                }

                fill(200)
                textAlign(LEFT)
                textSize(22)
                text("Song: "+Song.Title, 0, 550)
                text("Best score: "+bestScore, 0, 580)
            }
    
            if (currentTile < tiles.length) {
                //Tiles
                tiles[currentTile].show();
                tiles[currentTile].animate(currentSpeed)
    
                // AutoPlay
                if (AutoPlayEnable) {
                    if (tiles[currentTile].y >= 600 && !tiles[currentTile+1].tapped) {
                        DecodeNote(tiles[currentTile+1].tileNote.n, false, false);
                        tiles[currentTile+1].tapped = true;
                    } 
                }
    
                if (tiles[currentTile + 1] && tiles[currentTile].y >= NextTileAfter) {
                    tiles[currentTile + 1].show();
                    tiles[currentTile + 1].animate(currentSpeed);
                }
               
                if (tiles[currentTile + 2] && tiles[currentTile + 1].y >= NextTileAfter) {
                    tiles[currentTile + 2].show();
                    tiles[currentTile + 2].animate(currentSpeed);
                }
                
                if (tiles[currentTile + 3] && tiles[currentTile + 2].y >= NextTileAfter) {
                    tiles[currentTile + 3].show();
                    tiles[currentTile + 3].animate(currentSpeed);
                }
               
                if (tiles[currentTile + 4] && tiles[currentTile + 3].y >= NextTileAfter) {
                    tiles[currentTile + 4].show();
                    tiles[currentTile + 4].animate(currentSpeed);
                }
                
                if (tiles[currentTile + 5] && tiles[currentTile + 4].y >= NextTileAfter) {
                    tiles[currentTile + 5].show();
                    tiles[currentTile + 5].animate(currentSpeed);
                    if (tiles[currentTile].y > height && !tiles[currentTile].tapped && tiles[currentTile].tileNote.n != 0) ReduceLife();
                    if (!tiles[currentTile].commandCheck) {
                        if (tiles[currentTile].tileNote.a) AddSpeed();
                        if (tiles[currentTile].tileNote.b && completedLap === 0) CalcReward();
                        tiles[currentTile].commandCheck = true;
                    } 
                    currentTile++;
                    if (currentTile === tilesLength - 5) {
                        CalcReward();
                        RepeatSong();
                    }
                }
            }
    
            //Red line
            if (IsItHorizontalScreen) image(GameHitLine, width / 2 - 200, HitLineOffset + 105);
    
            //Info display
            if (DisplayInfo) {
                textSize(15);
                textAlign(LEFT);
                fill(210, 170, 100);
                text("speed: "+currentSpeed+" px/frame", 0, 10);
                text("tile: "+currentTile+"/"+tilesLength, 0, 25);
                text("lap: "+completedLap, 0, 40);
            }
    
            //Reward display
            if (RewardCount === 0) {
                image(StarBlank, Layouts.GameReward1AlignX, 0, Layouts.GameRewardSizeX,Layouts.GameRewardSizeY);
                image(StarBlank, Layouts.GameReward2AlignX, 0, Layouts.GameRewardSizeX,Layouts.GameRewardSizeY);
                image(StarBlank, Layouts.GameReward3AlignX, 0, Layouts.GameRewardSizeX,Layouts.GameRewardSizeY);
            }
            else if (RewardCount === 1) {
                image(Star, Layouts.GameReward1AlignX, 0, Layouts.GameRewardSizeX,Layouts.GameRewardSizeY);
                image(StarBlank, Layouts.GameReward2AlignX, 0, Layouts.GameRewardSizeX,Layouts.GameRewardSizeY);
                image(StarBlank, Layouts.GameReward3AlignX, 0, Layouts.GameRewardSizeX,Layouts.GameRewardSizeY);
            }
            else if (RewardCount === 2) {
                image(Star, Layouts.GameReward1AlignX, 0, Layouts.GameRewardSizeX,Layouts.GameRewardSizeY);
                image(Star, Layouts.GameReward2AlignX, 0, Layouts.GameRewardSizeX,Layouts.GameRewardSizeY);
                image(StarBlank, Layouts.GameReward3AlignX, 0, Layouts.GameRewardSizeX,Layouts.GameRewardSizeY);
            }
            else if (RewardCount === 3) {
                image(Star, Layouts.GameReward1AlignX, 0, Layouts.GameRewardSizeX,Layouts.GameRewardSizeY);
                image(Star, Layouts.GameReward2AlignX, 0, Layouts.GameRewardSizeX,Layouts.GameRewardSizeY);
                image(Star, Layouts.GameReward3AlignX, 0, Layouts.GameRewardSizeX,Layouts.GameRewardSizeY);
            }
            else if (RewardCount === 4) {
                image(Crown, Layouts.GameReward1AlignX, 0, Layouts.GameRewardSizeX,Layouts.GameRewardSizeY);
                image(CrownBlank, Layouts.GameReward2AlignX, 0, Layouts.GameRewardSizeX,Layouts.GameRewardSizeY);
                image(CrownBlank, Layouts.GameReward3AlignX, 0, Layouts.GameRewardSizeX,Layouts.GameRewardSizeY);
            }
            else if (RewardCount === 5) {
                image(Crown, Layouts.GameReward1AlignX, 0, Layouts.GameRewardSizeX,Layouts.GameRewardSizeY);
                image(Crown, Layouts.GameReward2AlignX, 0, Layouts.GameRewardSizeX,Layouts.GameRewardSizeY);
                image(CrownBlank, Layouts.GameReward3AlignX, 0, Layouts.GameRewardSizeX,Layouts.GameRewardSizeY);
            }
            else if (RewardCount >= 6) {
                image(Crown, Layouts.GameReward1AlignX, 0, Layouts.GameRewardSizeX,Layouts.GameRewardSizeY);
                image(Crown, Layouts.GameReward2AlignX, 0, Layouts.GameRewardSizeX,Layouts.GameRewardSizeY);
                image(Crown, Layouts.GameReward3AlignX, 0, Layouts.GameRewardSizeX,Layouts.GameRewardSizeY);
            }
    
            //Life display
            if (Lifes === 3) {
                image(Life, Layouts.GameLife3AlignX, 0, 36,36);
                image(Life, Layouts.GameLife2AlignX, 0, 36,36);
                image(Life, Layouts.GameLife1AlignX, 0, 36,36);
            }
            else if (Lifes === 2) {
                image(Life, Layouts.GameLife3AlignX, 0, 36,36);
                image(Life, Layouts.GameLife2AlignX, 0, 36,36);
                image(LifeBlank, Layouts.GameLife1AlignX, 0, 36,36);
            }
            else if(Lifes === 1) {
                image(Life, Layouts.GameLife3AlignX, 0, 36,36);
                image(LifeBlank, Layouts.GameLife2AlignX, 0, 36,36);
                image(LifeBlank, Layouts.GameLife1AlignX, 0, 36,36);
            }
            else if(Lifes === 0) {
                image(LifeBlank, Layouts.GameLife3AlignX, 0, 36,36);
                image(LifeBlank, Layouts.GameLife2AlignX, 0, 36,36);
                image(LifeBlank, Layouts.GameLife1AlignX, 0, 36,36);
            }
    
            //Score display
            textSize(Layouts.GameScoreFontSize);
            textAlign(CENTER);
            textFont(ScoreFont);
            fill(Layouts.GameScoreColor);
            if (Song) text(Score, width / 2, Layouts.GameScoreMarginTop);
            break;

        //Loading
        case 2:
            background(16);
            textSize(40);
            textAlign(CENTER);
            textFont(ScoreFont);
            fill(240, 240, 240);
            text("Loading...", width / 2, height / 2);
            break;

        //Game results screen
        case 3:
            image(GameEndBg, 0, 0, 400, 600);

            textSize(Layouts.FailTextFontSize);
            textAlign(CENTER);
            textFont(ScoreFont);
            fill(Layouts.FailTextColor);
    
            textSize(Layouts.FailTextTitleFontSize);
            textFont(ScoreFont);
            fill(Layouts.FailTextTitleColor);
            text(Song.Title, width / 2, Layouts.FailTextTitleAlignY);
    
            textSize(Layouts.FailScoreFontSize);
            textAlign(CENTER);
            textFont(ScoreFont);
            fill(Layouts.FailScoreLapsColor);
            text(Score, width / 2, Layouts.FailScoreAlignY);


            if (newBest) {
                textSize(Layouts.FailNewBestFontSize);
                text("New best", width / 2, Layouts.FailNewBestAlignY);
            }

            //Reward display on the results screen
            if (RewardCount === 1) {
                image(Star, Layouts.FailReward1AlignX, Layouts.FailRewardAlignY, Layouts.FailRewardSizeX,Layouts.FailRewardSizeY);
                image(StarBlank, Layouts.FailReward2AlignX, Layouts.FailRewardAlignY, Layouts.FailRewardSizeX,Layouts.FailRewardSizeY);
                image(StarBlank, Layouts.FailReward3AlignX, Layouts.FailRewardAlignY, Layouts.FailRewardSizeX,Layouts.FailRewardSizeY);
            }
            else if (RewardCount === 2) {
                image(Star, Layouts.FailReward1AlignX, Layouts.FailRewardAlignY, Layouts.FailRewardSizeX,Layouts.FailRewardSizeY);
                image(Star, Layouts.FailReward2AlignX, Layouts.FailRewardAlignY0, Layouts.FailRewardSizeX,Layouts.FailRewardSizeY);
                image(StarBlank, Layouts.FailReward3AlignX, Layouts.FailRewardAlignY, Layouts.FailRewardSizeX,Layouts.FailRewardSizeY);
            }
            else if (RewardCount === 3) {
                image(Star, Layouts.FailReward1AlignX, Layouts.FailRewardAlignY, Layouts.FailRewardSizeX,Layouts.FailRewardSizeY);
                image(Star, Layouts.FailReward2AlignX, Layouts.FailRewardAlignY, Layouts.FailRewardSizeX,Layouts.FailRewardSizeY);
                image(Star, Layouts.FailReward3AlignX, Layouts.FailRewardAlignY, Layouts.FailRewardSizeX,Layouts.FailRewardSizeY);
            }
            else if (RewardCount === 4) {
                image(Crown, Layouts.FailReward1AlignX, Layouts.FailRewardAlignY, Layouts.FailRewardSizeX,Layouts.FailRewardSizeY);
                image(CrownBlank, Layouts.FailReward2AlignX, Layouts.FailRewardAlignY, Layouts.FailRewardSizeX,Layouts.FailRewardSizeY);
                image(CrownBlank, Layouts.FailReward3AlignX, Layouts.FailRewardAlignY, Layouts.FailRewardSizeX,Layouts.FailRewardSizeY);
            }
            else if (RewardCount === 5) {
                image(Crown, Layouts.FailReward1AlignX, Layouts.FailRewardAlignY, Layouts.FailRewardSizeX,Layouts.FailRewardSizeY);
                image(Crown, Layouts.FailReward2AlignX, Layouts.FailRewardAlignY, Layouts.FailRewardSizeX,Layouts.FailRewardSizeY);
                image(CrownBlank, Layouts.FailReward3AlignX, Layouts.FailRewardAlignY, Layouts.FailRewardSizeX,Layouts.FailRewardSizeY);
            }
            else if (RewardCount >= 6) {
                image(Crown, Layouts.FailReward1AlignX, Layouts.FailRewardAlignY, Layouts.FailRewardSizeX,Layouts.FailRewardSizeY);
                image(Crown, Layouts.FailReward2AlignX, Layouts.FailRewardAlignY, Layouts.FailRewardSizeX,Layouts.FailRewardSizeY);
                image(Crown, Layouts.FailReward3AlignX, Layouts.FailRewardAlignY, Layouts.FailRewardSizeX,Layouts.FailRewardSizeY);
            }
    
            //Menu button and click
            image(BtnMenu, Layouts.FailBtnMenuAlignX, Layouts.FailBtnMenuAlignY, Layouts.FailBtnMenuSizeX, Layouts.FailBtnMenuSizeY);
            if (
                mouseX > Layouts.FailBtnMenuAlignX &&
                mouseX < Layouts.FailBtnMenuAlignX + Layouts.FailBtnMenuSizeX &&
                mouseY > Layouts.FailBtnMenuAlignY &&
                mouseY < Layouts.FailBtnMenuAlignY + Layouts.FailBtnMenuSizeY
            ) {
                if (mouseIsPressed && !BtnMenuPressedOnce) {
                    FailToMenu();
                    BtnMenuPressedOnce = true;
                    setTimeout(()=>{ BtnMenuPressedOnce = false },500);
                }
            }
    
            //Retry button and click
            image(BtnRetry, Layouts.FailBtnRetryAlignX, Layouts.FailBtnRetryAlignY, Layouts.FailBtnRetrySizeX, Layouts.FailBtnRetrySizeY);
            if (
                mouseX > Layouts.FailBtnRetryAlignX &&
                mouseX < Layouts.FailBtnRetryAlignX + Layouts.FailBtnRetrySizeX &&
                mouseY > Layouts.FailBtnRetryAlignY &&
                mouseY < Layouts.FailBtnRetryAlignY + Layouts.FailBtnRetrySizeY
            ) {
                if (mouseIsPressed && !BtnRetryPressedOnce) {
                    RetryFromFail();
                    BtnRetryPressedOnce = true;
                    setTimeout(()=>{ BtnRetryPressedOnce = false },500);
                }
            }
            break;
    }

    textFont(ScoreFont);
    textAlign(LEFT);
    textSize(Layouts.VersionLabelFontSize);
    fill(Layouts.VersionLabelColor);
    text(versionText, 2, Layouts.VersionLabelAlignY);
}