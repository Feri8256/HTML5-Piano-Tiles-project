console.log("%cWelcome to\n%cp5 Tiles", "font-size: 16pt", "font-size: 20pt; font-family: Arial");
const songsBaseURL = "assets/res/songs/"
const ImgBaseUrl = "assets/res/images/";
const SndBaseUrl = "assets/res/sounds/";
const PianoSounds = "piano/";
const SfxSounds = "sfx/";
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

let GameIcons;
let GameIconsJSON;

let Buttons;
let ButtonsJSON;

//Game variables
let Song;
let tiles = [];
let currentTile = 0;
let baseSpeed;
let tilesLength;
let currentSpeed = 0;
let completedLap = 0;
let DisplayInfo = false;
let AutoPlayEnable = false;
let FailState = false;
let startingState = true;
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

let isItDesktopScreen = false;

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
let RewardCounterSmall;
let RewardCounterLarge;
let LifeDisplaySmall;
let scoreCounter;
let loadMenu;
let SongList;
let PlayNote;
let loadTiles;
let canvasElement;

let bodyWidth = 0;
let bodyHeight = 0;

window.onerror = function () {
    var confirmation = confirm('Sorry!... A script error occurred. Press OK to reload the page.');
    if (confirmation) location.reload();
}

function setup() {
    bodyWidth = window.innerWidth;
    bodyHeight = window.innerHeight;

    for (let i in GameIconsJSON) {
        this[GameIconsJSON[i].name] = GameIcons.get(GameIconsJSON[i].x, GameIconsJSON[i].y, GameIconsJSON[i].w, GameIconsJSON[i].h);
    }

    for (let i in ButtonsJSON) {
        this[ButtonsJSON[i].name] = Buttons.get(ButtonsJSON[i].x, ButtonsJSON[i].y, ButtonsJSON[i].w, ButtonsJSON[i].h);
    }

    CheckBoxScore = new uiCheckbox(Checkbox_base, Checkbox_mark, Layouts.SettingsOptionButtonsAlignX, 15, 40, 40, Options.DisplayScore, function(r){Options.DisplayScore = r}, 250);
    CheckBoxLifes = new uiCheckbox(Checkbox_base, Checkbox_mark, Layouts.SettingsOptionButtonsAlignX, 75, 40, 40, Options.DisplayLifes, function(r){Options.DisplayLifes = r}, 250);
    CheckBoxRewards = new uiCheckbox(Checkbox_base, Checkbox_mark, Layouts.SettingsOptionButtonsAlignX, 135, 40, 40, Options.DisplayRewards, function(r){Options.DisplayRewards = r}, 250);
    CheckBoxTimeProgressBar = new uiCheckbox(Checkbox_base, Checkbox_mark, Layouts.SettingsOptionButtonsAlignX, 195, 40, 40, Options.DisplayTimeProgress, function(r){Options.DisplayTimeProgress = r}, 250);
    CheckBoxFailSound = new uiCheckbox(Checkbox_base, Checkbox_mark, Layouts.SettingsOptionButtonsAlignX, 255, 40, 40, Options.PlayFailSound, function(r){Options.PlayFailSound = r}, 250);
    CheckBoxDisplayInfo = new uiCheckbox(Checkbox_base, Checkbox_mark, Layouts.SettingsOptionButtonsAlignX, 315, 40, 40, Options.DisplayInfo, function(r){Options.DisplayInfo = r}, 250);
    CheckBoxHighQuality = new uiCheckbox(Checkbox_base, Checkbox_mark, Layouts.SettingsOptionButtonsAlignX, 375, 40, 40, Options.HighQuality, function(r){Options.HighQuality = r}, 250);
    MenuArrowDownButton = new uiIconButton(Button_down, Layouts.MenuArrowDownAlignX, Layouts.MenuArrowDownAlignY, Layouts.MenuArrowDownSizeX, Layouts.MenuArrowDownSizeY, function(){MenuPageNumber++}, 100);
    MenuArrowUpButton = new uiIconButton(Button_up, Layouts.MenuArrowUpAlignX, Layouts.MenuArrowUpAlignY, Layouts.MenuArrowUpSizeX, Layouts.MenuArrowUpSizeY, function(){MenuPageNumber--}, 100);
    MenuButton = new uiIconButton(Button_menu, Layouts.FailBtnMenuAlignX, Layouts.FailBtnMenuAlignY, Layouts.FailBtnMenuSizeX, Layouts.FailBtnMenuSizeY, failToMenu, 250);
    RetryButton = new uiIconButton(Button_retry, Layouts.FailBtnRetryAlignX, Layouts.FailBtnRetryAlignY, Layouts.FailBtnRetrySizeX, Layouts.FailBtnRetrySizeY, retryFromFail, 250);
    SettingsButton = new uiIconButton(Button_settings, Layouts.SettingsBtnAlignX, Layouts.SettingsBtnAlignY, Layouts.SettingsBtnSizeX, Layouts.SettingsBtnSizeY, menuToSettings, 250);
    SettingsBackButton = new uiIconButton(Button_back, Layouts.SettingsBackAlignX, Layouts.SettingsBackAlignY, Layouts.SettingsBackSizeX, Layouts.SettingsBackSizeY, settingsToMenu, 250);
    RewardCounterSmall = new RewardCounter(Star, Star_faded, Crown, Crown_faded, Glare, Layouts.GameRewardAlignX, 0, Layouts.GameRewardSizeX, Layouts.GameRewardSizeY, 36);
    RewardCounterLarge = new RewardCounter(Star, Star_faded, Crown, Crown_faded, Glare, Layouts.FailRewardAlignX, Layouts.FailRewardAlignY, Layouts.FailRewardSizeX,Layouts.FailRewardSizeY, 60);
    LifeDisplaySmall = new LifeDisplay(Life, Life_faded, Layouts.GameLifeAlignX, 0, 36, 36, 36);
    scoreCounter = new ScoreCounter(ScoreFont, Layouts.GameScoreColor, Layouts.GameScoreFontSize + 7, Layouts.GameScoreFontSize, -1.4, 200, Layouts.GameScoreMarginTop, true, 40, 200, Layouts.GameScoreMarginTop + 2);

    createCanvas(400,600);
    frameRate(60);
    if (!Options.HighQuality) pixelDensity(1);
    noStroke();
    loadMenu();

    canvasElement = document.querySelector('.p5Canvas');
    canvasElement.removeAttribute('style');

    if (window.innerWidth > window.innerHeight) {
        canvasElement.classList.add('desktop');
        isItDesktopScreen = true;
    }

    if (window.innerWidth < window.innerHeight) {
        canvasElement.classList.add('mobile');
    }

}

function windowResized() {
    if (window.innerWidth > window.innerHeight) {
        if (canvasElement.classList.contains('mobile')) canvasElement.classList.remove('mobile');
        canvasElement.classList.add('desktop');
    }

    if (window.innerWidth < window.innerHeight) {
        if (canvasElement.classList.contains('desktop')) canvasElement.classList.remove('desktop');
        canvasElement.classList.add('mobile');
    }
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

function resetTiles() {
    tiles = [];
    currentTile = 0;
    scoreCounter.reset();
    currentSpeed = 0;
    completedLap = 0;
    FailState = false;
    LifeDisplaySmall.reset();
    loadTiles();
}

function setSpeedAtStart() {
    currentSpeed = Song.baseSpeed;
    startingState = false;
}

function addSpeed() {
    currentSpeed = currentSpeed + Song.speedIncrement;
}

function calcReward() {
    RewardCounterSmall.countUp();
    RewardCounterLarge.countUp();
}

function resetReward() {
    RewardCounterSmall.reset();
    RewardCounterLarge.reset();
}

function repeatSong() {
    completedLap++;
    tiles = [];
    currentTile = 0;
    loadTiles();
}

function retryFromFail() {
    if (scoreCounter.value > bestScore) {
        setNewScore(Song.Title, scoreCounter.value);
    }
    setTimeout(()=>{
        startingState = true;
        ScreenState = 1;
        resetTiles();
        resetReward();
        bestScore = getBestScore(Song.Title);
        newBest = false;
        AutoPlayEnable = false;
        tiles[0].y = 450;
        tiles[0].startingTile = true;
    },500);
}

function reduceLife(t) {
    LifeDisplaySmall.countDown();
    if (LifeDisplaySmall.counter === 0) setFail(t);
}

function setFail(t) {
    if (FailState === false && ScreenState === 1) {
        FailState = true;
        if (t) t.revealFail()
        if (t && Options.PlayFailSound) DecodeNote(FailSound);

        if (t){ setTimeout(()=>{ ScreenState = 3; },2000) }
        else { setTimeout(()=>{ ScreenState = 3; },300) }

        if (scoreCounter.value > bestScore) {
            newBest = true;
            setNewScore(Song.Title, scoreCounter.value);
        }
    }
}

//Change screens
function menuToGame() {
    tiles[0].y = 450;
    tiles[0].startingTile = true;
    setTimeout(()=>{
        ScreenState = 1;
        startingState = true;
    },500);
}

function failToMenu() {
    FailState = false;
    setTimeout(()=>{
        Song = null;
        currentTile = 0;
        currentSpeed = 0;
        completedLap = 0;
        resetReward();
        LifeDisplaySmall.reset();
        scoreCounter.reset();
        tiles = [];
        ScreenState = 0;
        newBest = false;
        AutoPlayEnable = false;
    },300);
}

function menuToSettings() {
    setTimeout(()=>{
        ScreenState = 4;
    },300)
}

function settingsToMenu() {
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
                SongListElements[i]?.draw(MenuElementsYPosition);
                MenuElementsYPosition += Layouts.MenuCardHeight + 20;
                if (MenuElementsYPosition === 120 * 5) MenuElementsYPosition = 0;
            }
    
            if (!isItDesktopScreen) {
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
            image(GameBg, width / 2 - 200, 0,400,bodyHeight);
            //three vertical lines
            {
                fill(50);
                rect(99,0,2,600);
                rect(199,0,2,600);
                rect(299,0,2,600);
            }
    
            for (let i = currentTile; i < currentTile + TilesOnScreen; i++) {
                if (tiles[i+1]) tiles[i+1].y = tiles[i]?.y - NextTileAfter

                tiles[i]?.draw();
                tiles[i]?.animate(currentSpeed);

                if (AutoPlayEnable && tiles[i]?.y > HitLineOffset && !tiles[i].tapped) {
                    tiles[i].tap();
                }

                if (!tiles[i].commandCheck) {
                    if (tiles[i].tileNoteObject.a) addSpeed();
                    if (tiles[i].tileNoteObject.b && completedLap === 0) calcReward();
                    tiles[i].commandCheck = true;
                }

                if (currentTile === tilesLength - 5) {
                    calcReward();
                    repeatSong();
                }

                if (tiles[i]?.y > NextTileAfter * 5) {
                    if (!tiles[i].tapped && tiles[i].tileType !== 0 && !tiles[i].failCheck) reduceLife(tiles[i])
                    tiles[i].failCheck = true;
                }

                if (tiles[i]?.y > NextTileAfter * 6) currentTile++
            }
    
            //Red line
            if (isItDesktopScreen) image(GameHitLine, width / 2 - 200, HitLineOffset + 105);

            if (startingState) {
                textSize(Layouts.GameStartTextFontSize);
                textAlign(CENTER);
                fill(Layouts.GameStartTextColor);
                if (isItDesktopScreen) {
                    text(HitKeys[0], 50, Layouts.GameStartTextAlignY);
                    text(HitKeys[1], 150, Layouts.GameStartTextAlignY);
                    text(HitKeys[2], 250, Layouts.GameStartTextAlignY);
                    text(HitKeys[3], 350, Layouts.GameStartTextAlignY);
                }

                fill(200);
                textAlign(LEFT);
                textSize(22);
                text("Song: "+Song.Title, 0, 550)
                text("Best score: "+bestScore, 0, 580)
            }
    
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
                RewardCounterSmall.draw();
            }
            
            //Life display
            if (Options.DisplayLifes) {
                LifeDisplaySmall.draw();
            }

            if (AutoPlayEnable) {
                textSize(Layouts.GameAutoPlayTextFontSize);
                fill(Layouts.GameAutoPlayTextColor);
                textAlign(CENTER);
                text("Autoplay enabled", width/2, Layouts.GameAutoPlayTextMarginTop);
            }
            //Score display
            if (Options.DisplayScore) {
                scoreCounter.draw();
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
            text(scoreCounter.value, width / 2, Layouts.FailScoreAlignY);


            if (newBest) {
                textSize(Layouts.FailNewBestFontSize);
                text("New best", width / 2, Layouts.FailNewBestAlignY);
            }

            //Reward display on the results screen
            RewardCounterLarge.draw();
    
            //Menu button
            MenuButton.draw();
    
            //Retry button
            RetryButton.draw();
            break;

        //Settings
        case 4:
            background(16)
            textAlign(LEFT)
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
}