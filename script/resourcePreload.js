function preload() {
    console.log('%cStarting preload resources...',"color: yellow")
    var PreloadBefore = performance.now();

    PreloadPianoSounds();
    Layouts = loadJSON('assets/style/ui.json');
    GameBg = loadImage(ImgBaseUrl + 'game-bg.png');
    GameEndBg = loadImage(ImgBaseUrl + 'gameend-bg.png');
    GameTileTapped = loadImage(ImgBaseUrl + 'tile-t.png');
    GameHitLine = loadImage(ImgBaseUrl + 'hitline.png');
    ScoreFont = loadFont('assets/res/fonts/ocr_a_ext.ttf');
    LifeBlank = loadImage(ImgBaseUrl + 'life-b.png');
    Life = loadImage(ImgBaseUrl + 'life.png');
    SongList = loadJSON('assets/res/songlist.json');
    BtnMenu = loadImage(ImgBaseUrl + 'btn-menu.png');
    BtnRetry = loadImage(ImgBaseUrl + 'btn-retry.png');
    BtnArrowUp = loadImage(ImgBaseUrl + 'btn-up.png');
    BtnArrowDown = loadImage(ImgBaseUrl + 'btn-down.png');
    Star = loadImage(ImgBaseUrl + 'star.png');
    StarBlank = loadImage(ImgBaseUrl + 'star-b.png');
    Crown = loadImage(ImgBaseUrl + 'crown.png');
    CrownBlank = loadImage(ImgBaseUrl + 'crown-b.png');
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
    console.log(`%cResource preload finished!\n%cProcess took ${Math.round((PreloadAfter - PreloadBefore) / 1000)} sec.`, "color: #55ff55","color: #777777")
}