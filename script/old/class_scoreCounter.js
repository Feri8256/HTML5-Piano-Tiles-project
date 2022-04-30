class ScoreCounter {
    constructor (font, fillColor, sizeFrom, sizeTo, sizeStep, alignX, alignY, shadow, shadowColor, shadowXoffset, shadowYoffset) {
        this.value = 0;
        this.font = font;
        this.fillColor = fillColor;
        this.sizeFrom = sizeFrom;
        this.sizeTo = sizeTo;
        this.sizeStep = sizeStep;
        this.alignX = alignX;
        this.alignY = alignY;
        this.shadow = shadow;
        this.shadowColor = shadowColor;
        this.currentSize = this.sizeTo;
        this.shadowXoffset = shadowXoffset;
        this.shadowYoffset = shadowYoffset;
    }

    draw() {
        push();

        textFont(this.font)
        textAlign(CENTER);
        textSize(this.currentSize > this.sizeTo ? this.currentSize += this.sizeStep : this.currentSize = this.sizeTo);

        if (this.shadow) {
            fill(this.shadowColor);
            text(this.value, this.shadowXoffset ?? this.alignX, this.shadowYoffset ?? this.alignY);
        }
        
        fill(this.fillColor);
        text(this.value, this.alignX, this.alignY);

        pop();
    }

    add(v) {
        if (v) this.value += v;
        else this.value += 1;

        this.currentSize = this.sizeFrom;
    }

    reset() {
        this.value = 0;
    }
}