function FetchSong(filename) {
    ScreenState = 2;

    fetch(songsBaseURL+filename)
        .then(response => response.json())
        .then(data => SongLoaderV2(data))
        .then(data => LoadTiles())
        .then(data => PauseState = true)
        .then(data => MenuToGame())
}