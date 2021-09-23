function delayTimer(ms) {
    return new Promise(res => setTimeout(res, ms));
}
const tileYoffset   =   150;
class Tile {

    constructor(tilePos, tileNote) {
        this.y = 0;
        this.tilePos = tilePos;
        this.tileNoteObject = tileNote;
        this.tileNote = tileNote.n;
        this.tileType = 0;
        this.tapped = false;
        this.commandCheck = false;
        this.failCheck = false;
        this.blinksRed = false;
        this.failFired = false;
        this.tappedAlpha = 256;
        this.bonusPopupSize = 60;
        this.bonusPopupAlpha = 256;

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

        if (this.tileNote === 0) this.tileType = 0;
        if (this.tileNote !== 0) this.tileType = 1;
        if (this.tileNote[0] && this.tileNote[0].sn) this.tileType = 2;

    }

    show() {
        if (this.tileType !== 0) { //Not blank tile
            if (this.tapped) {
                {
                    let tappedColor = color(100,100,100);
                    let newAlphaValue = this.tappedAlpha > 40 ? this.tappedAlpha = this.tappedAlpha-20 : 40;
                    tappedColor.setAlpha(newAlphaValue);
                    fill(tappedColor);
                    rect(this.tilePixelPos, this.y - tileYoffset, 100,150);
                }

                if (this.tileType === 2) {
                    textAlign(CENTER)
                    textSize(this.bonusPopupSize < 100 ? this.bonusPopupSize += 2 : this.bonusPopupSize = 100)
                    let bonusColor = color(80,80,200);
                    let newAlphaValue = this.bonusPopupAlpha > 10 ? this.bonusPopupAlpha -= 10 : 0;
                    bonusColor.setAlpha(newAlphaValue);
                    fill(bonusColor);
                    text(`+${this.tileNote.length}`, this.tilePixelPos+50, this.y - tileYoffset);
                } 
            }
            else {
                if (this.tileType === 2) fill(80,80,200);
                else fill(200);
                rect(this.tilePixelPos, this.y - tileYoffset, 100,150)

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
                                this.tap();
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
                            this.tap();
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

    tap() {
        if (this.tapped) return;
        this.tapped = true;

        if (this.tileNote.length && this.tileNote[0].sn) {
            async function delayed(tn) {
                let snL = tn.length;
                let spd = currentSpeed;
                //delay = (((1000ms/[framerate])*[tile pixel height])/[currentSpeed])/[# of notes]
                let snD = (2500 / spd) / snL;

                for (let s of tn) {
                    DecodeNote(s.sn);
                    await delayTimer(snD);
                }
            }
            delayed(this.tileNote)
        }
        else {
            DecodeNote(this.tileNote);
        }

        if(!AutoPlayEnable){
            if (this.tileNote.length && this.tileNote[0].sn) {
                Score = Score + this.tileNote.length;
            }
            else {
               Score++; 
            }
        }
    }

    revealFail() {
        this.failFired = true
        this.blinksRed = true
        currentSpeed =  -10;
        const blinkDuration = 1500
        const changeInterval = 150

        let blinkInterval = setInterval(()=>{
            this.blinksRed = !this.blinksRed;
        }, changeInterval);

        setTimeout(()=>{
            clearInterval(blinkInterval)
            this.blinksRed = false
        }, blinkDuration);
    }
}