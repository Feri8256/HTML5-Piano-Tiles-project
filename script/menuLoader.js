/**
 * Build the song selection menu based on a list
 * @param {Array} data array of objects that contain "name" "performer" "filename" "id" properties
 * @param {Element} listContainer the HTML element where the menu elements will be appended to
 */
export function loadMenu(data, listContainer) {
    function card(number, title, performer, filename, id) {
        let menucard = document.createElement("div");
        menucard.dataset.id = id;
        menucard.classList.add("menucard");

        let cardLeftSide = document.createElement("div");
        cardLeftSide.classList.add("cardleft");

        let numberElement = document.createElement("p");
        numberElement.classList.add("num");
        numberElement.textContent = number;
        cardLeftSide.appendChild(numberElement);
        menucard.appendChild(cardLeftSide);

        let titleAndPerformerElement = document.createElement("div");
        titleAndPerformerElement.classList.add("title-and-performer");

        let titleElement = document.createElement("p");
        titleElement.classList.add("title");
        titleElement.textContent = title;
        titleAndPerformerElement.appendChild(titleElement);

        let performerElement = document.createElement("p");
        performerElement.classList.add("performer");
        performerElement.textContent = performer;
        titleAndPerformerElement.appendChild(performerElement);

        let playButton = document.createElement("button");
        playButton.classList.add("play-btn");
        playButton.dataset.filename = filename;
        playButton.dataset.id = id;
        playButton.textContent = "Play";
        titleAndPerformerElement.appendChild(playButton);

        menucard.appendChild(titleAndPerformerElement);

        return menucard;
    }

    let n = 1
    for (let e of data) {
        let c = card(n++, e.name, e.performer, e.filename, e.id);
        listContainer.appendChild(c);
    }

    let listEnd = document.createElement("p");
    listEnd.classList.add("listend");
    listEnd.textContent = "More songs to be expected...";
    listContainer.appendChild(listEnd);
}