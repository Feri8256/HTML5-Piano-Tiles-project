function SongLoaderV2(data) {

    var outputData = {
        Title:"",
        baseSpeed: 0,
        speedIncrement: 0,
        Notes:[]
    };

    outputData.Title = data.Title || "Default title";
    outputData.baseSpeed = data.baseSpeed || 10;
    outputData.speedIncrement = data.speedIncrement || 0.5;

    var dNotes = data.Notes;
    for (var i = 0; i < dNotes.length; i++) {
        if (dNotes[i].l) {
            outputData.Notes.push(dNotes[i])
            for (var j = 0; j < dNotes[i].l; j++) {
                outputData.Notes.push({n:0})
            }
        }
        else {
            outputData.Notes.push(dNotes[i])
        }
    }

    //Kész
    Song = outputData;
    bestScore = getBestScore(outputData.Title);
}