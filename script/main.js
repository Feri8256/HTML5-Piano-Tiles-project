console.log("%cWelcome to\n%cp5 Tiles", "font-size: 16pt", "font-size: 20pt; font-family: Arial");
const versionText = "20210416"
const songsBaseURL = "assets/res/songs/"
const ImgBaseUrl = "assets/res/images/";
const SndBaseUrl = "assets/res/sounds/";
const HitLineOffset = 370; 
const HitWindowAddHeight = 80;
const HitKeys = ["d","f","j","k"];
const NextTileAfter =   167.99999999999991;
const FailSound = [48,52,55];

/**
 * Contains properties of ui elements
 * "resourcePreload.js" fills this with the contents of "ui.json"
 */
let Layouts;

/**
 * Default game variables, configurable by the user
 */
let Options = {
    DisplayScore: true,
    DisplayInfo: false,
    DisplayLifes: true,
    DisplayRewards: true,
    DisplayTimeProgress: false,
    PlayFailSound: true,
    HighQuality: true,
}

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
let UICheckBoxBase;
let UICheckboxMark;
let BtnSettings;
let BtnBack;

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

//Buttons, ect.
let CheckBoxScore;
let CheckBoxLifes;
let CheckBoxRewards;
let CheckBoxTimeProgressBar;
let CheckBoxFailSound;
let CheckBoxDisplayInfo;
let CheckBoxHighQuality;
let RetryButton;
let MenuButton;
let MenuArrowDownButton;
let MenuArrowUpButton;
let SettingsButton;
let SettingsBackButton;

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

let MenuPageNumber = 0;

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

    CheckBoxScore = new uiCheckbox(UICheckBoxBase, UICheckboxMark, Layouts.SettingsOptionButtonsAlignX, 15, 40, 40, Options.DisplayScore, function(r){Options.DisplayScore = r}, 250);
    CheckBoxLifes = new uiCheckbox(UICheckBoxBase, UICheckboxMark, Layouts.SettingsOptionButtonsAlignX, 75, 40, 40, Options.DisplayLifes, function(r){Options.DisplayLifes = r}, 250);
    CheckBoxRewards = new uiCheckbox(UICheckBoxBase, UICheckboxMark, Layouts.SettingsOptionButtonsAlignX, 135, 40, 40, Options.DisplayRewards, function(r){Options.DisplayRewards = r}, 250);
    CheckBoxTimeProgressBar = new uiCheckbox(UICheckBoxBase, UICheckboxMark, Layouts.SettingsOptionButtonsAlignX, 195, 40, 40, Options.DisplayTimeProgress, function(r){Options.DisplayTimeProgress = r}, 250);
    CheckBoxFailSound = new uiCheckbox(UICheckBoxBase, UICheckboxMark, Layouts.SettingsOptionButtonsAlignX, 255, 40, 40, Options.PlayFailSound, function(r){Options.PlayFailSound = r}, 250);
    CheckBoxDisplayInfo = new uiCheckbox(UICheckBoxBase, UICheckboxMark, Layouts.SettingsOptionButtonsAlignX, 315, 40, 40, Options.DisplayInfo, function(r){Options.DisplayInfo = r}, 250);
    CheckBoxHighQuality = new uiCheckbox(UICheckBoxBase, UICheckboxMark, Layouts.SettingsOptionButtonsAlignX, 375, 40, 40, Options.HighQuality, function(r){Options.HighQuality = r}, 250);

    MenuArrowDownButton = new uiIconButton(BtnArrowDown, Layouts.MenuArrowDownAlignX, Layouts.MenuArrowDownAlignY, Layouts.MenuArrowDownSizeX, Layouts.MenuArrowDownSizeY, function(){MenuPageNumber++}, 100);
    MenuArrowUpButton = new uiIconButton(BtnArrowUp, Layouts.MenuArrowUpAlignX, Layouts.MenuArrowUpAlignY, Layouts.MenuArrowUpSizeX, Layouts.MenuArrowUpSizeY, function(){MenuPageNumber--}, 100);
    MenuButton = new uiIconButton(BtnMenu, Layouts.FailBtnMenuAlignX, Layouts.FailBtnMenuAlignY, Layouts.FailBtnMenuSizeX, Layouts.FailBtnMenuSizeY, FailToMenu, 250);
    RetryButton = new uiIconButton(BtnRetry, Layouts.FailBtnRetryAlignX, Layouts.FailBtnRetryAlignY, Layouts.FailBtnRetrySizeX, Layouts.FailBtnRetrySizeY, RetryFromFail, 250);
    SettingsButton = new uiIconButton(BtnSettings, Layouts.SettingsBtnAlignX, Layouts.SettingsBtnAlignY, Layouts.SettingsBtnSizeX, Layouts.SettingsBtnSizeY, MenuToSettings, 250);
    SettingsBackButton = new uiIconButton(BtnBack, Layouts.SettingsBackAlignX, Layouts.SettingsBackAlignY, Layouts.SettingsBackSizeX, Layouts.SettingsBackSizeY, SettingsToMenu, 250);

    //Is it desktop screen?
    if (AppWidth > AppHeight) IsItHorizontalScreen = true;

    CanvasCenterPosition = AppWidth / 2;

    canvas = createCanvas(400,600); //400x600
    canvas.position(window.innerWidth / 2 - 200, 0);
    frameRate(60);
    if (!Options.HighQuality) pixelDensity(1);
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
        if (Options.PlayFailSound) DecodeNote(FailSound,true);
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

function MenuToSettings() {
    setTimeout(()=>{
        ScreenState = 4;
    },300)
}

function SettingsToMenu() {
    localStorage.setItem("userOptions", JSON.stringify(Options))
    setTimeout(()=>{
        ScreenState = 0;
    },300)
}

//Main draw loop
function draw() {

    switch (ScreenState) {

        //Menu
        case 0:
            background(16);
            textFont(ScoreFont);
            for (var i = MenuPageNumber; i < MenuPageNumber+5; i++) {
                SongListElements[i]?.show(MenuElementsYPosition);
                MenuElementsYPosition += Layouts.MenuCardHeight + 20;
                if (MenuElementsYPosition === 120 * 5) MenuElementsYPosition = 0;
            }
    
            if (!IsItHorizontalScreen) {
                if (MenuPageNumber != 0) {
                    MenuArrowUpButton.draw();
                }
                
                if (MenuPageNumber < SongListElements.length - 4) {
                    MenuArrowDownButton.draw();
                }
            }

            SettingsButton.draw()

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
            if (Options.DisplayInfo) {
                textSize(15);
                textAlign(LEFT);
                fill(210, 170, 100);
                text("speed: "+currentSpeed+" px/frame", 0, 10);
                text("tile: "+currentTile+"/"+tilesLength, 0, 25);
                text("lap: "+completedLap, 0, 40);
            }
    
            //Reward display
            if (Options.DisplayRewards) {
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
            }
            
            //Life display
            if (Options.DisplayLifes) {
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
            }
            
            //Score display
            if (Options.DisplayScore) {
                textSize(Layouts.GameScoreFontSize);
                textAlign(CENTER);
                textFont(ScoreFont);
                fill(Layouts.GameScoreColor);
                if (Song) text(Score, width / 2, Layouts.GameScoreMarginTop);
            }
           
            //Time progress bar
            if (Options.DisplayTimeProgress) {
                let lineWidth = map(currentTile, 0, tilesLength-5, 0, width);
                fill(Layouts.GameTimeProgressBarColor)
                rect(0,0, lineWidth,3)
            }
           
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
                image(Star, Layouts.FailReward2AlignX, Layouts.FailRewardAlignY, Layouts.FailRewardSizeX,Layouts.FailRewardSizeY);
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
    
            //Menu button
            MenuButton.draw();
    
            //Retry button
            RetryButton.draw();
            break;

        //Settings
        case 4:
            background(16)
            
            textSize(Layouts.SettingsOptionFontSize)
            fill(160)
            text('Display score', 20, 40)
            CheckBoxScore.draw()

            text('Display lifes', 20, 100)
            CheckBoxLifes.draw()

            text('Display rewards', 20, 160)
            CheckBoxRewards.draw()

            text('Display time progress', 20, 220)
            CheckBoxTimeProgressBar.draw()

            text('Play fail sound', 20, 280)
            CheckBoxFailSound.draw()

            text('Display info', 20, 340)
            CheckBoxDisplayInfo.draw()

            text('High quality (reload)', 20, 400)
            CheckBoxHighQuality.draw()

            SettingsBackButton.draw()
            break;
    }

    textFont(ScoreFont);
    textAlign(LEFT);
    textSize(Layouts.VersionLabelFontSize);
    fill(Layouts.VersionLabelColor);
    text(versionText, 2, Layouts.VersionLabelAlignY);
}