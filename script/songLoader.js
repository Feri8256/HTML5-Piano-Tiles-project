/**
 * Validates `Title` `baseSpeed` and `speedIncrement`.
 * Extends the music sequence with blank notes, 
 * this will make invisible tiles to give correct time spacing.
 * @param {*} data Song object
 * @param {String} id song id
 */
export function songLoader(data, id) {

    let outputData = {
        id: "",
        title:"",
        baseSpeed: 0,
        speedIncrement: 0,
        notes:[]
    };

    outputData.id = id || "none";
    outputData.title = data.title || "Default title";
    outputData.baseSpeed = data.baseSpeed || 10;
    outputData.speedIncrement = data.speedIncrement || 0.5;

    let dNotes = data.notes;
    for (let i = 0; i < dNotes.length; i++) {
        if (dNotes[i].l) {
            outputData.notes.push(dNotes[i])
            for (let j = 0; j < dNotes[i].l; j++) {
                outputData.notes.push({n:0})
            }
        }
        else {
            outputData.notes.push(dNotes[i])
        }
    }

    return outputData;
}