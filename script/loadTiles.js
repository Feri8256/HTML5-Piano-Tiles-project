LoadTiles = function () {
    let tilePositions = [];
    let {Notes} = Song;

    for (let i in Notes) {
        let r = Math.floor(random(0, 4));
        if (tilePositions.length > 0) {
            while (tilePositions[i - 1] === r) {
                r = Math.floor(random(0, 4));
                
            }
            tilePositions.push(r);
        } 
        else {
            tilePositions.push(r);
        }

        tiles.push(new Tile(r, Notes[i]));
    }

    //+5 rows for ending properly
    for (let a = 0; a < 4; a++) {
        tiles.push(new Tile(0, {"n":0}));
    }

    tilesLength = tiles.length;
}