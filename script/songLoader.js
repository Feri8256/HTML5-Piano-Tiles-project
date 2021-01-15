function SongSelector(filename) {
    ScreenStates.Screen_Loading = true;

    fetch(songsBaseURL+filename)
        .then(response => response.json())
        .then(data => Song = data)
        .then(data => LoadTiles())
        .then(data => PauseState = true)
        .then(data => MenuToGame())
}