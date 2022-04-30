function FetchSong(filename) {
    ScreenState = 2;

    fetch(songsBaseURL+filename)
        .then(response => response.json())
        .then(data => SongLoaderV2(data))
        .then(data => loadTiles())
        .then(data => PauseState = true)
        .then(data => menuToGame())
}