function FetchSong(filename) {
    ScreenStates.Screen_Loading = true;

    fetch(songsBaseURL+filename)
        .then(response => response.json())
        .then(data => SongLoaderV2(data))
        .then(data => LoadTiles())
        .then(data => PauseState = true)
        .then(data => MenuToGame())
}