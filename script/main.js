const songsBaseURL = "assets/res/songs/"
const ImgBaseUrl = "assets/res/images/";
const SndBaseUrl = "assets/res/sounds/";
const HitLineOffset = 380; 
const HitWindowAddHeight = 100; 
const HitKeys = ["d","f","j","k"];
const NextTileAfter =   167.99999999999991;
const FailSound = [48,52,55];

let Layouts;

//image res
let BackImg;
let GameBg;
let GameTile;
let GameTileTapped;
let GameTileBlank;
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

/*Reward counter
  0: Nothing,
  1: 1 star,
  2: 2 star,
  3: 3 star,
  4: 1 crown,
  5: 2 crown,
  6: 3 crown
*/
let RewardCount = 0;

let IsItHorizontalScreen = false;

let ScreenStates = {
    Screen_Game: false,
    Screen_Menu: true,
    Screen_Loading: false
}

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
    alert('Sorry!... A script error occurred. Press OK to reload the page.');
    location.reload();
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
    pixelDensity(1);
    noStroke();
    LoadMenu();
}

function windowResized() {
    canvas.position(window.innerWidth / 2 - 200, 0);
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
    ResetReward();
    setTimeout(()=>{
        PauseState = true;
        ResetTiles();    
    },500);
}

function ReduceLife() {
    if (Lifes > 0) Lifes--;
    if (Lifes === 0) SetFail();
}

function SetFail() {
    if (FailState === false && ScreenStates.Screen_Game) {
        currentSpeed = 0;
        DecodeNote(FailSound,true);
        setTimeout(()=>{FailState = true;},800);
    }
}

//Change screens
function MenuToGame() {
    ScreenStates.Screen_Menu = false;
    setTimeout(()=>{
        ScreenStates.Screen_Loading = false;
        ScreenStates.Screen_Game = true;
    },500);
}

function FailToMenu() {
    FailState = false;
    setTimeout(()=>{
        ScreenStates.Screen_Game = false;
        ScreenStates.Screen_Menu = true;
    },300);
    Song = null;
    currentTile = 0;
    completedLap = 0;
    ResetReward();
    Lifes = 3;
    Score = 0;
    tiles = [];
}

//Main draw loop
function draw() {

    //Tap to start
    if (
        mouseIsPressed && 
        !FailState &&
        ScreenStates.Screen_Game &&
        PauseState
    ) {
        SetSpeedAtStart();
        PauseState = false;
    }

    //Menu screen
    if (ScreenStates.Screen_Menu) {
        background(16);
        textFont(ScoreFont);
        for (var i = 0; i < SongListElements.length; i++) {
            SongListElements[i].show(MenuElementsYPosition,MenuScrollY);
            MenuElementsYPosition += Layouts.MenuCardHeight + 20;
            if (MenuElementsYPosition === 120 * SongListElements.length) MenuElementsYPosition = 0;
        }

        if (!IsItHorizontalScreen) {
            image(BtnArrowUp, Layouts.MenuArrowUpAlignX, Layouts.MenuArrowUpAlignY);
            if (
                mouseX > Layouts.MenuArrowUpAlignX &&
                mouseX < 400 &&
                mouseY > Layouts.MenuArrowUpAlignY &&
                mouseY < Layouts.MenuArrowUpSizeY + Layouts.MenuArrowUpAlignY
            ) {
                if (mouseIsPressed) MenuScrollY += 20;
            }

            image(BtnArrowDown, Layouts.MenuArrowDownAlignX, Layouts.MenuArrowDownAlignY);
            if (
                mouseX > Layouts.MenuArrowDownAlignX &&
                mouseX < 400 &&
                mouseY > Layouts.MenuArrowDownAlignY &&
                mouseY < Layouts.MenuArrowDownSizeY + Layouts.MenuArrowDownAlignY
            ) {
                if (mouseIsPressed) MenuScrollY -= 20;
            }
        }
        
    }

    ////Game screen
    if (ScreenStates.Screen_Game) {
        image(GameBg, width / 2 - 200, 0,400,AppHeight);
        image(GameLines, width / 2 - 200, 0,400,AppHeight);

        if (PauseState) {
            textSize(Layouts.GameStartTextFontSize);
            textAlign(CENTER);
            fill(Layouts.GameStartTextColor);
            if (IsItHorizontalScreen) {
                text("Press\nD / F / J / K\nkey to start", 200, Layouts.GameStartTextAlignY);
            }
            else {
                text("Tap to start", 200, Layouts.GameStartTextAlignY);
            }
        }

        if (currentTile < tiles.length) {
            //Tiles
            tiles[currentTile].show();
            tiles[currentTile].animate(currentSpeed)

            // AutoPlay
            if (AutoPlayEnable) {
                if (tiles[currentTile].y >= 640 && !tiles[currentTile+1].tapped) {
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
        if (IsItHorizontalScreen) image(GameHitLine, width / 2 - 200, HitLineOffset + 120);

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
            image(StarBlank, Layouts.GameReward1AlignX, 0, 36,36);
            image(StarBlank, Layouts.GameReward2AlignX, 0, 36,36);
            image(StarBlank, Layouts.GameReward3AlignX, 0, 36,36);
        }
        else if (RewardCount === 1) {
            image(Star, Layouts.GameReward1AlignX, 0, 36,36);
            image(StarBlank, Layouts.GameReward2AlignX, 0, 36,36);
            image(StarBlank, Layouts.GameReward3AlignX, 0, 36,36);
        }
        else if (RewardCount === 2) {
            image(Star, Layouts.GameReward1AlignX, 0, 36,36);
            image(Star, Layouts.GameReward2AlignX, 0, 36,36);
            image(StarBlank, Layouts.GameReward3AlignX, 0, 36,36);
        }
        else if (RewardCount === 3) {
            image(Star, Layouts.GameReward1AlignX, 0, 36,36);
            image(Star, Layouts.GameReward2AlignX, 0, 36,36);
            image(Star, Layouts.GameReward3AlignX, 0, 36,36);
        }
        else if (RewardCount === 4) {
            image(Crown, Layouts.GameReward1AlignX, 0, 36,36);
            image(CrownBlank, Layouts.GameReward2AlignX, 0, 36,36);
            image(CrownBlank, Layouts.GameReward3AlignX, 0, 36,36);
        }
        else if (RewardCount === 5) {
            image(Crown, Layouts.GameReward1AlignX, 0, 36,36);
            image(Crown, Layouts.GameReward2AlignX, 0, 36,36);
            image(CrownBlank, Layouts.GameReward3AlignX, 0, 36,36);
        }
        else if (RewardCount >= 6) {
            image(Crown, Layouts.GameReward1AlignX, 0, 36,36);
            image(Crown, Layouts.GameReward2AlignX, 0, 36,36);
            image(Crown, Layouts.GameReward3AlignX, 0, 36,36);
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

        //Fail popup
        if(FailState) {
            image(FailPanel, 0, height / 2 - 150, 400, 300)
            textSize(Layouts.FailTextFontSize);
            textAlign(CENTER);
            textFont(ScoreFont);
            fill(Layouts.FailTextColor);
            text("You failed!", 200, Layouts.FailTextAlignY);

            textSize(Layouts.FailTextTitleFontSize);
            textFont(ScoreFont);
            fill(Layouts.FailTextTitleColor);
            text(Song.Title, 200, Layouts.FailTextTitleAlignY);

            textSize(Layouts.FailScoreLapsFontSize);
            textAlign(CENTER);
            textFont(ScoreFont);
            fill(Layouts.FailScoreLapsColor);
            text(`Score: ${Score}`, Layouts.FailScoreAlignX, height / 2);
            text(`Laps: ${completedLap}`, Layouts.FailLapsAlignX, height / 2);

            //Menu button and click
            image(BtnMenu, Layouts.FailBtnMenuAlignX, Layouts.FailBtnMenuAlignY);
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
            image(BtnRetry, 218, height - 250);
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
        }
    }
    //Loading
    if (ScreenStates.Screen_Loading) {
        background(16);
        textSize(40);
        textAlign(CENTER);
        textFont(ScoreFont);
        fill(240, 240, 240);
        text("Loading...", width / 2, height / 2);
    }
}