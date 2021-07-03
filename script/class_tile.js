const tileYoffset   =   150;
class Tile {

    constructor(y, tilePos, tileNote, tapped, commandCheck, failCheck) {
        this.y = y;
        this.tilePos = tilePos;
        this.tileNote = tileNote;
        this.tapped = tapped;
        this.commandCheck = commandCheck;
        this.failCheck = failCheck;
        this.blinksRed = false;
        this.failFired = false;

        this.tilePixelPos = 0;
        switch (this.tilePos) {
            case 0: //Column 1
                this.tilePixelPostilePixelPos = width / 2 - 200;
                break;
            case 1: //Column 2
                this.tilePixelPos = width / 2 - 100;
                break;
            case 2: //Column 3
                this.tilePixelPos = width / 2;
                break;
            case 3: //Column 4
                this.tilePixelPos = width / 2 + 100;
                break;
        }
    }

    show() {
        if (this.tileNote.n !== 0) { //Not blank tile
            if (this.tapped) { //Single tile
                image(GameTileTapped, this.tilePixelPos, this.y - tileYoffset,100,150); 
            }
            else {
                if (this.tileNote.n.length && this.tileNote.n[0].sn) {
                    {
                        fill(80,80,200);
                        rect(this.tilePixelPos, this.y - tileYoffset, 100,150);
                    }
                }
                else { 
                    {
                        fill(200);
                        rect(this.tilePixelPos, this.y - tileYoffset, 100,150);
                    }
                }

                //Érintőképernyős bevitelt támogató rész
                if (touchstart && !this.tapped) {
                    //Ellenörzi a azokat a pontokat, ahol a képernyő érintések történtek
                    for (var i = 0; i < touches.length; i++) {
                        if (
                            touches[i].x >= this.tilePixelPos &&
                            touches[i].x <= this.tilePixelPos + 100 &&
                            touches[i].y >= this.y - tileYoffset &&
                            touches[i].y <= this.y - tileYoffset + 150
                        ) {
                            if (!FailState) {
                                DecodeNote(this.tileNote.n,false, this.tapped);
                                this.tapped = true;
                                if(!AutoPlayEnable){
                                    if (this.tileNote.n.length && this.tileNote.n[0].sn) {
                                        Score = Score + this.tileNote.n.length;
                                    }
                                    else {
                                       Score++; 
                                    }
                                } 
                            }
                        }
                    }
                }

                //Egér bevitelt támogató rész
                if (
                    mouseX >= this.tilePixelPos &&
                    mouseX <= this.tilePixelPos + 100 &&
                    mouseY >= this.y - tileYoffset &&
                    mouseY <= this.y -tileYoffset + 150
                ) {
                    if (mouseIsPressed && !this.tapped) {
                        if (!FailState) {
                            DecodeNote(this.tileNote.n,false, this.tapped);
                            this.tapped = true;
                            if(!AutoPlayEnable){
                                if (this.tileNote.n.length && this.tileNote.n[0].sn) {
                                    Score = Score + this.tileNote.n.length;
                                }
                                else {
                                   Score++; 
                                }
                            } 
                        }
                    }
                }
            }
        }

        if (this.blinksRed) {
            fill(200,10,10)
            rect(this.tilePixelPos, this.y - tileYoffset,100,150)
        }

        if (this.failFired) {
            if (this.y <= 600) currentSpeed = 0
        }
    }

    animate(currentSpeed) {
        this.y += currentSpeed;
    }

    revealFail() {
        this.failFired = true
        this.blinksRed = true
        currentSpeed = -(currentSpeed * 0.7)
        const blinkDuration = 1500
        const changeInterval = 150

        let blinkInterval = setInterval(()=>{
            if (!this.blinksRed){ this.blinksRed = true } 
            else { this.blinksRed = false }
        }, changeInterval)

        setTimeout(()=>{
            clearInterval(blinkInterval)
            this.blinksRed = false
        }, blinkDuration)
    }
}