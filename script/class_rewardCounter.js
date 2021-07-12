class RewardCounter {
    constructor (star, star_faded, crown, crown_faded, posX, posY, sizeX, sizeY, spacing) {
        this.star = star; //p5 image object
        this.star_faded = star_faded; //p5 image object
        this.crown = crown; //p5 image object
        this.crown_faded = crown_faded; //p5 image object
        this.posX = posX; //Number
        this.posY = posY; //Number
        this.sizeX = sizeX; //Number
        this.sizeY = sizeY; //Number
        this.spacing = spacing; //Number
        this.counter = 0;
    }

    show() {
        let alignX = this.posX;
        for (let i=1; i<4; i++) {
            //Stars
            if (this.counter < 4) {
                if (i <= this.counter) {
                    image(this.star, alignX, this.posY, this.sizeX, this.sizeY);
                }
                else {
                    image(this.star_faded, alignX, this.posY, this.sizeX, this.sizeY);
                }
            }
            //Crowns
            else {
                if (i <= this.counter-3) {
                    image(this.crown, alignX, this.posY, this.sizeX, this.sizeY);
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
    }

    reset() {
        this.counter = 0;
    }
}