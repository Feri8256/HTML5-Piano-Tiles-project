class RewardCounter {
    constructor (star, star_faded, crown, crown_faded, glare, posX, posY, sizeX, sizeY, spacing) {
        this.star = star; //p5 image object
        this.star_faded = star_faded; //p5 image object
        this.crown = crown; //p5 image object
        this.glare = glare; //p5 image object
        this.crown_faded = crown_faded; //p5 image object
        this.posX = posX; //Number
        this.posY = posY; //Number
        this.sizeX = sizeX; //Number
        this.sizeY = sizeY; //Number
        this.spacing = spacing; //Number
        this.counter = 0;
        this.glareTransparency = 255;
    }

    show() {
        let alignX = this.posX;
        for (let i=1; i<4; i++) {
            //Stars
            if (this.counter < 4) {
                if (i <= this.counter) {
                    image(this.star, alignX, this.posY, this.sizeX, this.sizeY);
                    if (i === this.counter && this.glareTransparency > 0) {
                        push()
                        tint(255, this.glareTransparency > 10 ? this.glareTransparency = this.glareTransparency-10 : 0)
                        image(this.glare, alignX, this.posY, this.sizeX, this.sizeY);
                        pop()
                    }
                }
                else {
                    image(this.star_faded, alignX, this.posY, this.sizeX, this.sizeY);
                }
            }
            //Crowns
            else {
                if (i <= this.counter-3 && this.glareTransparency > 0) {
                    image(this.crown, alignX, this.posY, this.sizeX, this.sizeY);
                    if (i === this.counter-3) {
                        push()
                        tint(255, this.glareTransparency > 10 ? this.glareTransparency = this.glareTransparency-10 : 0)
                        image(this.glare, alignX, this.posY, this.sizeX, this.sizeY);
                        pop()
                    }
                }
                else {
                    image(this.crown_faded, alignX, this.posY, this.sizeX, this.sizeY);
                }
            }
            
            alignX += this.spacing;
        }
    }

    countUp() {
        this.counter++;
        this.glareTransparency = 255;
    }

    reset() {
        this.counter = 0;
        this.glareTransparency = 255;
    }
}