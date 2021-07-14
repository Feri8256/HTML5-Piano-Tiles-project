class LifeDisplay { 
    constructor (life, life_faded, posX, posY, sizeX, sizeY, spacing) {
        this.life = life; //p5 image object
        this.life_faded = life_faded; //p5 image object
        this.posX = posX; //Number
        this.posY = posY; //Number
        this.sizeX = sizeX; //Number
        this.sizeY = sizeY; //Number
        this.spacing = spacing; //Number
        this.counter = 3;
    }

    show() {
        let alignX = this.posX;
        for (let i=1; i<4; i++) {
            
            if (i <= this.counter) {
                image(this.life, alignX, this.posY, this.sizeX, this.sizeY);
            }
            else {
                image(this.life_faded, alignX, this.posY, this.sizeX, this.sizeY);
            }

            alignX += this.spacing;
        }
    }

    countDown() {
        if (this.counter > 0) this.counter--;
    }

    reset() {
        this.counter = 3;
    }

}