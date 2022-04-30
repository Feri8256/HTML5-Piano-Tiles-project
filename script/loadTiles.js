/**
 * Creating an array of tiles from provided class and song object
 * @param {*} tilesClass objects in the returned array will be created from this class
 * @param {*} song song object
 * @param {Function} gameStartFn this function will start the game. Passed to every tile
 * @param {Function} scoreCounterFn function for score counting
 */
export function loadTiles(tilesClass, song, gameStartFn, playNoteFn, scoreCounterFn) {
    function random(max){
        return Math.floor(Math.random() * max)
    }

    let tiles = [];
    let tilePositions = [];
    let { notes } = song;

    let firstPos = random(4);
    tiles.push(new tilesClass(firstPos, {"n":0}, gameStartFn, playNoteFn, scoreCounterFn));
    tilePositions.push(firstPos);

    for (let i in notes) {
        let r = random(4);
        
        while (tilePositions[i] === r) {
            r = random(4);
        }
        tilePositions.push(r);

        tiles.push(new tilesClass(r, notes[i], gameStartFn, playNoteFn, scoreCounterFn));
    }

    //+5 rows for ending properly
    for (let a = 0; a < 7; a++) {
        tiles.push(new tilesClass(0, {"n":0}, gameStartFn, playNoteFn, scoreCounterFn));
    }

    return tiles;
}