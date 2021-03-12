function preload() {
    console.log('%cStarting preload resources...',"color: yellow")
    var PreloadBefore = performance.now();

    PreloadPianoSounds();
    Layouts = loadJSON('assets/style/ui.json');
    GameBg = loadImage(ImgBaseUrl + 'game-bg.png');
    GameLines = loadImage(ImgBaseUrl + 'lines.png');
    GameTile = loadImage(ImgBaseUrl + 'tile.png');
    GameTileTapped = loadImage(ImgBaseUrl + 'tile-t.png');
    GameTileBlank = loadImage(ImgBaseUrl + 'tile-b.png');
    GameTileDouble = loadImage(ImgBaseUrl + 'tile-d.png');
    GameHitLine = loadImage(ImgBaseUrl + 'hitline.png');
    FailPanel = loadImage(ImgBaseUrl + 'fail-panel.png');
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

    var PreloadAfter = performance.now();
    console.log(`%cResource preload finished!\n%cProcess took ${Math.round((PreloadAfter - PreloadBefore) / 1000)} sec.`, "color: #55ff55","color: #777777")
}