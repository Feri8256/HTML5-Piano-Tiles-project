function DecodeNote(note) {
    if (note.length) {
        for (let n of note) {
            PlayNote[n]();
        }
    }
    else {
        PlayNote[note]();
    }
}