function preload() {
    console.log('%cStarting preload resources...',"color: yellow")
    var PreloadBefore = performance.now();

    PreloadPianoSounds();
    Layouts = loadJSON('assets/style/ui.json');

    GameBg = loadImage(ImgBaseUrl + 'game-bg.png');

    GameIcons = loadImage(ImgBaseUrl + 'game-icons.png');
    GameIconsJSON = loadJSON(ImgBaseUrl + 'game-icons.json');

    GameEndBg = loadImage(ImgBaseUrl + 'gameend-bg.png');
    GameHitLine = loadImage(ImgBaseUrl + 'hitline.png');
    ScoreFont = loadFont('assets/res/fonts/ocr_a_ext.ttf');
    SongList = loadJSON('assets/res/songlist.json');
    BtnMenu = loadImage(ImgBaseUrl + 'btn-menu.png');
    BtnRetry = loadImage(ImgBaseUrl + 'btn-retry.png');
    BtnArrowUp = loadImage(ImgBaseUrl + 'btn-up.png');
    BtnArrowDown = loadImage(ImgBaseUrl + 'btn-down.png');
    UICheckBoxBase = loadImage(ImgBaseUrl + 'checkbox.png');
    UICheckboxMark = loadImage(ImgBaseUrl + 'checkbox-mark.png');
    BtnSettings = loadImage(ImgBaseUrl + 'btn-settings.png');
    BtnBack = loadImage(ImgBaseUrl + 'btn-back.png');

    var testRead = localStorage.getItem("userOptions");
    if (testRead != null || testRead != undefined) {
        let parsedUserOptions = JSON.parse(testRead);
        Options = parsedUserOptions;
    }

    var PreloadAfter = performance.now();
    console.log(`%cResource preload finished!\n%cProcess took ${Math.max((PreloadAfter - PreloadBefore) / 1000)} sec.`, "color: #55ff55","color: #777777")
}