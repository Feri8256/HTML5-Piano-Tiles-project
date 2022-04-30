class uiIconButton {
    constructor(ButtonIcon, posX, posY, sizeX, sizeY, callback, debouncing) {
        this.ButtonIcon = ButtonIcon; //p5 image object
        this.posX = posX; //Number
        this.posY = posY; //Number
        this.sizeX = sizeX; //Number
        this.sizeY = sizeY; //Number
        this.callback = callback; //function
        this.debouncing = debouncing ?? 100; //Number
        this.pressedOnce = false;
    }
    draw() {
        image(this.ButtonIcon, this.posX, this.posY, this.sizeX, this.sizeY);
        if (
            mouseX > this.posX &&
            mouseX < this.posX + this.sizeX &&
            mouseY > this.posY &&
            mouseY < this.posY + this.sizeY &&
            mouseIsPressed && 
            !this.pressedOnce
        ) {
            this.callback();
            this.pressedOnce = true;
            setTimeout(()=>{ this.pressedOnce = false },this.debouncing);
        }
    }
}