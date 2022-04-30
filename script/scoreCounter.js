/**
 * Score counter used in game canvas
 */
export class ScoreCounter {
    /**
     * 
     * @param {String} fillColor text color in hex
     * @param {Number} sizeFrom text size when animation starts form
     * @param {Number} sizeTo text size when animation ends
     * @param {Number} sizeStep size changing on each update until reach `sizeTo`
     * @param {Number} marginTop top margin in pixels
     */
    constructor (fillColor, sizeFrom, sizeTo, sizeStep, marginTop) {
        this.value = 0;
        this.fillColor = fillColor;
        this.sizeFrom = sizeFrom;
        this.sizeTo = sizeTo;
        this.sizeStep = sizeStep;
        this.currentSize = this.sizeTo;
        this.marginTop = marginTop;
    }

    /**
     * Drawing method
     * @param {CanvasRenderingContext2D} c context
     * @param {Number} w screen width
     */
    draw(c, w) {
        c.save();
        c.font = `${this.currentSize}px futura`;
        c.textAlign = "center";
        c.textBaseline = "top";
        c.fillStyle = "#101010";
        c.fillText(this.value, w*0.5, this.marginTop+2);
        c.fillStyle = this.fillColor;
        c.fillText(this.value, w*0.5, this.marginTop);
        c.restore();
    }

    /**
     * Updates the animation parameters
     */
    update() {
        this.currentSize > this.sizeTo ? this.currentSize += this.sizeStep : this.currentSize = this.sizeTo;
    }

    /**
     * Incrementing the score and start animating
     * @param {Number} v score increment (default is +1 when there is no increment)
     */
    add(v) {
        if (v > 0) this.value += v;
        else this.value += 1;

        this.currentSize = this.sizeFrom;
    }

    /**
     * reset the score count to 0
     */
    reset() {
        this.value = 0;
    }
}
