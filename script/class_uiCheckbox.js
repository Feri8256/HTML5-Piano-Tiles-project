class uiCheckbox {
    constructor(cBoxBase, cBoxMark, posX, posY, sizeX, sizeY, defaultState, callback, debouncing) {
        this.cBoxBase = cBoxBase; //p5 image oblect
        this.cBoxMark = cBoxMark; //p5 image oblect
        this.posX = posX; //Number
        this.posY = posY; //Number
        this.sizeX = sizeX; //Number
        this.sizeY = sizeY; //Number
        this.defaultState = defaultState ?? false; //Boolean
        this.callback = callback; //function
        this.debouncing = debouncing ?? 100; //Number
        this.pressedOnce = false;
        this.state = false || defaultState;
    }

    draw() {
        image(this.cBoxBase, this.posX, this.posY, this.sizeX, this.sizeY);
        if (this.state) image(this.cBoxMark, this.posX, this.posY, this.sizeX, this.sizeY);
        if (
            mouseX > this.posX &&
            mouseX < this.posX + this.sizeX &&
            mouseY > this.posY &&
            mouseY < this.posY + this.sizeY &&
            mouseIsPressed && !this.pressedOnce
        ) {

            this.state = !this.state;

            this.callback(this.state);
            this.pressedOnce = true
            setTimeout(()=>{this.pressedOnce = false},this.debouncing)
        }
    }
}