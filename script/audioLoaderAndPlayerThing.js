const audioCTX = new AudioContext();
audioCTX.onstatechange = () => { console.log(`Audio context state: ${audioCTX.state}`) }

let gainNode = audioCTX.createGain();
gainNode.connect(audioCTX.destination);

/**
 * Changes the Audio Context output volume
 * @param {Number} v value 0-100
 */
export function changeGain(v) {
    gainNode.gain.value = v / 100;
}

/**
 * Handles loading decoding and playback of sounds
 */
export class AudioThing {
    /**
     * Load an audio file
     * @param {String} url path to the audio file
     */
    constructor(url) {
        this.audioBuffer;
        this.playable = false;
        this.decodeSuccess = (aBuff) => { this.audioBuffer = aBuff; this.playable = true; }
        this.decodeFail = () => { this.playable = false; }
        fetch(url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioCTX.decodeAudioData(arrayBuffer, this.decodeSuccess, this.decodeFail))
            .catch(error => console.error(error));
    }

    play() {
        if (!this.playable) return;
        const source = audioCTX.createBufferSource();
        source.buffer = this.audioBuffer;
        source.connect(gainNode);
        source.start(0);
    }
}
