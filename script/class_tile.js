class Tile {

    constructor(y, tilePos, tileNote, tapped, commandCheck) {
        this.y = y;
        this.tilePos = tilePos;
        this.tileNote = tileNote;
        this.tapped = tapped;
        this.commandCheck = commandCheck;
    }

    show() {
        let tilePixelPos;
        switch (this.tilePos) {
            case 0: //Column 1
                tilePixelPos = width / 2 - 200;
                break;
            case 1: //Column 2
                tilePixelPos = width / 2 - 100;
                break;
            case 2: //Column 3
                tilePixelPos = width / 2;
                break;
            case 3: //Column 4
                tilePixelPos = width / 2 + 100;
                break;
        }

        const tileYoffset   =   159.99999999999991;

        if (this.tileNote.n === 0) { //Blank tile
            image(GameTileBlank, tilePixelPos, this.y - tileYoffset,100,155);
        }
        else {
            if (this.tapped) { //Single tile
                image(GameTileTapped, tilePixelPos, this.y - tileYoffset,100,155);
            }
            else {
                image(GameTile, tilePixelPos, this.y - tileYoffset,100,155);

                //Érintőképernyős bevitelt támogató rész
                if (touchstart && !this.tapped) {
                    //Ellenörzi a azokat a pontokat, ahol a képernyő érintések történtek
                    for (var i = 0; i < touches.length; i++) {
                        if (
                            touches[i].x >= tilePixelPos &&
                            touches[i].x <= tilePixelPos + 100 &&
                            touches[i].y >= this.y - tileYoffset &&
                            touches[i].y <= this.y - tileYoffset + 160
                        ) {
                            if (!FailState) {
                                DecodeNote(this.tileNote.n,false, this.tapped);
                                this.tapped = true;
                            }
                        }
                    }
                }

                //Egér bevitelt támogató rész
                if (
                    mouseX >= tilePixelPos &&
                    mouseX <= tilePixelPos + 100 &&
                    mouseY >= this.y - tileYoffset &&
                    mouseY <= this.y -tileYoffset + 160
                ) {
                    if (mouseIsPressed && !this.tapped) {
                        if (!FailState) {
                            DecodeNote(this.tileNote.n,false, this.tapped);
                            this.tapped = true;
                        }
                    }
                }
            }
        }
    }

    animate(currentSpeed) {
        this.y += currentSpeed;
    }
}