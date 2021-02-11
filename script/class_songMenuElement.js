class SongMenuElement {
    constructor(songlist_element, pressedOnce, indexNumber) {
        this.songlist_element = songlist_element;
        this.pressedOnce = pressedOnce;
        this.indexNumber = indexNumber;
    }

    show(MenuElementsYPosition, MenuScrollY) {
        push()

        if (
            mouseX > 0 &&
            mouseX < Layouts.MenuCardWidth &&
            mouseY > MenuElementsYPosition + MenuScrollY &&
            mouseY < MenuElementsYPosition + MenuScrollY + Layouts.MenuCardHeight
        ) {
            fill(Layouts.MenuCardHoverColor);
            if (mouseIsPressed && !this.pressedOnce) {
                FetchSong(this.songlist_element.filename);
                this.pressedOnce = true;
                setTimeout(() => { this.pressedOnce = false; }, 1000);
            }
            if (this.pressedOnce) fill(Layouts.MenuCardClickColor);
        }
        else {
            fill(Layouts.MenuCardColor)
        }
        rect(Layouts.MenuCardLeftMargin, MenuElementsYPosition + MenuScrollY, Layouts.MenuCardWidth, Layouts.MenuCardHeight);

        fill(Layouts.MenuCardNumberColor);
        textSize(Layouts.MenuCardNumberFontSize)
        textAlign(CENTER);
        text(this.indexNumber, Layouts.MenuCardNumberAlignX, MenuElementsYPosition + 65 + MenuScrollY);

        fill(Layouts.MenuCardTitleColor);
        textSize(Layouts.MenuCardTitleFontSize);
        textAlign(LEFT);
        text(this.songlist_element.name, Layouts.MenuCardTitleAlignX, MenuElementsYPosition + 30 + MenuScrollY);

        fill(Layouts.MenuCardArtistColor);
        textSize(Layouts.MenuCardArtistFontSize);
        textAlign(LEFT);
        text(this.songlist_element.performer, Layouts.MenuCardArtistAlignX, MenuElementsYPosition + 80 + MenuScrollY);

        pop()
    }
}