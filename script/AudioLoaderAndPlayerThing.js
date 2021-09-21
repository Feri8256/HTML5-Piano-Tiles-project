const audioCTX = new AudioContext();

class Aaa {
    constructor(url) {
        this.myBuffer;

        fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioCTX.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
            this.myBuffer = audioBuffer;
        });
    }

    play() {
        const source = audioCTX.createBufferSource();
        source.buffer = this.myBuffer;
        source.connect(audioCTX.destination);
        source.start();
    }
}