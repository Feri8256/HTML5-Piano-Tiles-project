/**
 * Tiles in the game are constructed from this class
 */
export class Tile {
    /**
     * Create a new object from the Tile class
     * @param {Number} tilePos column position (0 is first column)
     * @param {*} tileNote object that contains musical information
     * @param {Function} gameStartFn if the `startingTile` is set to `true` tapping on this tile will call the game starting function
     * @param {Function} playNoteFn function that plays the musical note stored in `tileNote` object (passes `tileNote` object to this function)
     * @param {Function} scoreCounterFn function for score counting
     */
    constructor(tilePos, tileNote, gameStartFn, playNoteFn, scoreCounterFn) {
        this.y = 0;
        this.x = 0;
        this.w = 0;
        this.h = 0;
        this.cs = 0;
        this.gameStartFn = gameStartFn;
        this.playNoteFn = playNoteFn;
        this.scoreCounterFn = scoreCounterFn;
        this.tilePos = tilePos;
        this.tileNoteObject = tileNote;
        this.tileNote = tileNote.n;
        this.tileType = 0;
        this.tapped = false;
        this.commandCheck = false;
        this.failCheck = false;
        this.tappedColorAlpha = 1;
        this.tapGrow = 10;
        this.tapGrowAlpha = 1;
        this.startingTile = false;
        this.delayTimer = (ms) => new Promise(res => setTimeout(res, ms));
        this.scoreIncrement = 0;

        if (this.tileNote === 0 && !this.tileNote.length) this.tileType = 0;
        if (this.tileNote !== 0 || this.tileNote.length) this.tileType = 1;
        if (this.tileNote.length && this.tileNote[0].n) {
            this.tileType = 2;
            this.scoreIncrement = this.tileNote.length;
        }
    }

    /**
     * Tile drawing method
     * @param {CanvasRenderingContext2D} c context
     */
    draw(c) {
        c.save();

        if (this.tileType !== 0 || this.startingTile) { //Not blank tile
            if (this.tapped) {
                c.fillStyle = `rgba(150,150,240, ${this.tappedColorAlpha})`;
                c.fillRect(this.x, this.y - this.h, this.w, this.h);

                c.strokeStyle = `rgba(50,50,50, ${this.tapGrowAlpha})`;
                c.lineWidth = this.tapGrow;
                c.strokeRect(this.x + (this.tapGrow * 0.5), (this.y - this.h) + (this.tapGrow * 0.5), this.w - this.tapGrow, this.h - this.tapGrow);

                if (this.tileType === 2) {
                    c.fillStyle = `rgba(200,200,240, ${this.tappedColorAlpha})`;
                    c.textAlign = "center";
                    c.font = `60px futura`;
                    c.fillText(`+${this.scoreIncrement}`, this.x + (this.w * 0.5), this.y - this.h);
                }
            }
            else {
                c.fillStyle = "#000000";
                c.fillRect(this.x, this.y - this.h, this.w, this.h);
            }
        }

        if (this.startingTile && !this.tapped) {
            c.fillStyle = "#ffffff";
            c.textAlign = "center";
            c.font = "40px futura";
            c.fillText("START", this.x + (this.w * 0.5), this.y - (this.h * 0.6));
        }

        c.restore();
    }

    /**
     * Updating Y coordinate and animation states of the tile.
     * Also checking mouse position and touch coordinates, to perform tap
     * @param {Number} w tile width
     * @param {Number} h tile height
     * @param {Number} currentSpeed speed in px/frame
     * @param {*} mouse object of current mouse status `{ x: 0, y: 0, click: false }`
     * @param {Touch[]} touches array of active touch coordinates
     * @param {Boolean} inGame tile cannot be tapped when not in game
     */
    update(w, h, currentSpeed, mouse, touches, inGame) {
        this.x = w * this.tilePos;
        this.w = w;
        this.h = h;
        this.y += currentSpeed;
        this.cs = currentSpeed;

        if (this.tapped) {
            this.tappedColorAlpha > 0.3 ? this.tappedColorAlpha -= 0.05 : this.tappedColorAlpha = 0.3;
            this.tapGrowAlpha > 0.3 ? this.tapGrowAlpha -= 0.1 : this.tapGrowAlpha = 0.0;
            this.tapGrow > 0 ? this.tapGrow -= 2 : this.tapGrow = 0;
        }

        if (!inGame) return;

        if (
            mouse.x >= this.x &&
            mouse.x <= this.x + this.w &&
            mouse.y >= this.y - this.h &&
            mouse.y <= this.y
        ) {
            if (mouse.click) {
                this.tap();
            }
        }

        for (let t of touches) {
            if (
                t.clientX >= this.x &&
                t.clientX <= this.x + this.w &&
                t.clientY >= this.y - this.h &&
                t.clientY <= this.y
            ) {
                this.tap();
                break;
            }
        }
    }

    /**
     * Registers tap.
     * Responsible for commanding note playback.
     */
    tap() {
        if (this.tileType === 0 && !this.startingTile) return;
        if (this.startingTile) this.gameStartFn();
        if (this.tapped) return;
        this.tapped = true;
        if (!this.startingTile) this.scoreCounterFn(this.scoreIncrement);

        if (this.tileNote.length && this.tileNote[0].n) {

            async function delayed(tn, h, s, p, df) {
                let snL = tn.length;
                //delay = (((1000ms/[framerate])*[tile pixel height])/[currentSpeed])/[# of notes]
                let snD = ((16*h)/s)/snL;

                for (let n of tn) {
                    p(n.n);
                    await df(snD);
                }
            }
            delayed(this.tileNote, this.h, this.cs, this.playNoteFn, this.delayTimer);
        }
        else {
            this.playNoteFn(this.tileNote);
        }
    }
}
