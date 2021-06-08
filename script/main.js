console.log("%cWelcome to\n%cp5 Tiles", "font-size: 16pt", "font-size: 20pt; font-family: Arial");
const versionText = "20210608"
const songsBaseURL = "assets/res/songs/"
const ImgBaseUrl = "assets/res/images/";
const SndBaseUrl = "assets/res/sounds/";
const HitLineOffset = 370; 
const HitWindowAddHeight = 80;
const HitKeys = ["d","f","j","k"];
const NextTileAfter =   150;
const TilesOnScreen = 6
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

//Buttons
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
 * 3: end
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
        AutoPlayEnable = false;
    },500);
}

function ReduceLife(t) {
    if (Lifes > 0) Lifes--;
    if (Lifes === 0) SetFail(t);
}

function SetFail(t) {
    if (FailState === false && ScreenState === 1) {
        if (t) t.revealFail()
        //currentSpeed = 0;
        if (Options.PlayFailSound) DecodeNote(FailSound,true);

        if (t){ setTimeout(()=>{FailState = true; ScreenState = 3;},2000) }
        else { setTimeout(()=>{FailState = true; ScreenState = 3;},300) }

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
        AutoPlayEnable = false;
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
    
            for (var i = currentTile; i < currentTile + TilesOnScreen; i++) {
                if (tiles[i+1]) tiles[i+1].y = tiles[i]?.y - NextTileAfter

                tiles[i]?.show();
                tiles[i]?.animate(currentSpeed);

                if (AutoPlayEnable && tiles[i]?.y > HitLineOffset && !tiles[i].tapped) {
                    DecodeNote(tiles[i].tileNote.n, false, false);
                    tiles[i].tapped = true;
                }

                if (!tiles[i].commandCheck) {
                    if (tiles[i].tileNote.a) AddSpeed();
                    if (tiles[i].tileNote.b && completedLap === 0) CalcReward();
                    tiles[i].commandCheck = true;
                }

                if (currentTile === tilesLength - 5) {
                    CalcReward();
                    RepeatSong();
                }

                if (tiles[i]?.y > NextTileAfter * 5) {
                    if (!tiles[i].tapped && tiles[i].tileNote.n !== 0 && !tiles[i].failCheck) ReduceLife(tiles[i])
                    tiles[i].failCheck = true;
                }

                if (tiles[i]?.y > NextTileAfter * 6) currentTile++
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
            if (AutoPlayEnable) {
                textSize(Layouts.GameAutoPlayTextFontSize);
                fill(Layouts.GameAutoPlayTextColor);
                textAlign(CENTER);
                text("Autoplay enabled", width/2, Layouts.GameAutoPlayTextMarginTop);
            }
            //Score display
            if (Options.DisplayScore) {
                textSize(Layouts.GameScoreFontSize);
                textAlign(CENTER);
                textFont(ScoreFont);

                fill(40);
                text(Score, width / 2, Layouts.GameScoreMarginTop + 2);

                fill(Layouts.GameScoreColor);
                text(Score, width / 2, Layouts.GameScoreMarginTop);
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