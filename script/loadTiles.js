LoadTiles = function () {
    tiles.push(new Tile(0, 0, {"n":0}, false, false, false));

    for (var i = 1; i <= Song.Notes.length; i++) {
        let tilePosA = Math.floor(random(0, 4));
        let tilePosNotSame;
        let tile;

        if (tiles[i - 1] && tiles[i - 1].tilePos === tilePosA) {
            while (tiles[i - 1].tilePos === tilePosA) {
                tilePosA = Math.floor(random(0, 4));
            }
            tilePosNotSame = tilePosA;
        }
        else {
            tilePosNotSame = tilePosA;
        }

        tile = new Tile(0, tilePosNotSame, Song.Notes[i-1], false, false, false);
        tiles.push(tile);
    }

    //A vége pedig +5, hogy szebben jelenjen meg a játék
    for (var i = 0; i < 5; i++) {
        tiles.push(new Tile(0, 0, {"n":0}, false, false, false));
    }

    tilesLength = tiles.length;
}