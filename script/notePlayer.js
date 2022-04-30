/**
 * Handling piano note playback
 */
export class NotePlayer {
    /**
     * Preloading piano sounds
     * @param {String} s path to sounds folder
     * @param {String} p path to piano sounds inside sounds folder
     * @param {*} A Audio loader and player class
     */
    constructor(s, p, A) {
        this.snd = {};
        this.snd.P21 = new A(s + p + "a0.mp3");
        this.snd.P22 = new A(s + p + "a-0.mp3");
        this.snd.P23 = new A(s + p + "b0.mp3");
        this.snd.P24 = new A(s + p + "c1.mp3");
        this.snd.P25 = new A(s + p + "c-1.mp3");
        this.snd.P26 = new A(s + p + "d1.mp3");
        this.snd.P27 = new A(s + p + "d-1.mp3");
        this.snd.P28 = new A(s + p + "e1.mp3");
        this.snd.P29 = new A(s + p + "f1.mp3");
        this.snd.P30 = new A(s + p + "f-1.mp3");
        this.snd.P31 = new A(s + p + "g1.mp3");
        this.snd.P32 = new A(s + p + "g-1.mp3");
        this.snd.P33 = new A(s + p + "a1.mp3");
        this.snd.P34 = new A(s + p + "a-1.mp3");
        this.snd.P35 = new A(s + p + "b1.mp3");
        this.snd.P36 = new A(s + p + "c2.mp3");
        this.snd.P37 = new A(s + p + "c-2.mp3");
        this.snd.P38 = new A(s + p + "d2.mp3");
        this.snd.P39 = new A(s + p + "d-2.mp3");
        this.snd.P40 = new A(s + p + "e2.mp3");
        this.snd.P41 = new A(s + p + "f2.mp3");
        this.snd.P42 = new A(s + p + "f-2.mp3");
        this.snd.P43 = new A(s + p + "g2.mp3");
        this.snd.P44 = new A(s + p + "g-2.mp3");
        this.snd.P45 = new A(s + p + "a2.mp3");
        this.snd.P46 = new A(s + p + "a-2.mp3");
        this.snd.P47 = new A(s + p + "b2.mp3");
        this.snd.P48 = new A(s + p + "c3.mp3");
        this.snd.P49 = new A(s + p + "c-3.mp3");
        this.snd.P50 = new A(s + p + "d3.mp3");
        this.snd.P51 = new A(s + p + "d-3.mp3");
        this.snd.P52 = new A(s + p + "e3.mp3");
        this.snd.P53 = new A(s + p + "f3.mp3");
        this.snd.P54 = new A(s + p + "f-3.mp3");
        this.snd.P55 = new A(s + p + "g3.mp3");
        this.snd.P56 = new A(s + p + "g-3.mp3");
        this.snd.P57 = new A(s + p + "a3.mp3");
        this.snd.P58 = new A(s + p + "a-3.mp3");
        this.snd.P59 = new A(s + p + "b3.mp3");
        this.snd.P60 = new A(s + p + "c4.mp3");
        this.snd.P61 = new A(s + p + "c-4.mp3");
        this.snd.P62 = new A(s + p + "d4.mp3");
        this.snd.P63 = new A(s + p + "d-4.mp3");
        this.snd.P64 = new A(s + p + "e4.mp3");
        this.snd.P65 = new A(s + p + "f4.mp3");
        this.snd.P66 = new A(s + p + "f-4.mp3");
        this.snd.P67 = new A(s + p + "g4.mp3");
        this.snd.P68 = new A(s + p + "g-4.mp3");
        this.snd.P69 = new A(s + p + "a4.mp3");
        this.snd.P70 = new A(s + p + "a-4.mp3");
        this.snd.P71 = new A(s + p + "b4.mp3");
        this.snd.P72 = new A(s + p + "c5.mp3");
        this.snd.P73 = new A(s + p + "c-5.mp3");
        this.snd.P74 = new A(s + p + "d5.mp3");
        this.snd.P75 = new A(s + p + "d-5.mp3");
        this.snd.P76 = new A(s + p + "e5.mp3");
        this.snd.P77 = new A(s + p + "f5.mp3");
        this.snd.P78 = new A(s + p + "f-5.mp3");
        this.snd.P79 = new A(s + p + "g5.mp3");
        this.snd.P80 = new A(s + p + "g-5.mp3");
        this.snd.P81 = new A(s + p + "a5.mp3");
        this.snd.P82 = new A(s + p + "a-5.mp3");
        this.snd.P83 = new A(s + p + "b5.mp3");
        this.snd.P84 = new A(s + p + "c6.mp3");
        this.snd.P85 = new A(s + p + "c-6.mp3");
        this.snd.P86 = new A(s + p + "d6.mp3");
        this.snd.P87 = new A(s + p + "d-6.mp3");
        this.snd.P88 = new A(s + p + "e6.mp3");
        this.snd.P89 = new A(s + p + "f6.mp3");
        this.snd.P90 = new A(s + p + "f-6.mp3");
        this.snd.P91 = new A(s + p + "g6.mp3");
        this.snd.P92 = new A(s + p + "g-6.mp3");
        this.snd.P93 = new A(s + p + "a6.mp3");
        this.snd.P94 = new A(s + p + "a-6.mp3");
        this.snd.P95 = new A(s + p + "b6.mp3");
        this.snd.P96 = new A(s + p + "c7.mp3");
        this.snd.P97 = new A(s + p + "c-7.mp3");
        this.snd.P98 = new A(s + p + "d7.mp3");
        this.snd.P99 = new A(s + p + "d-7.mp3");
        this.snd.P100 = new A(s + p + "e7.mp3");
        this.snd.P101 = new A(s + p + "f7.mp3");
        this.snd.P102 = new A(s + p + "f-7.mp3");
        this.snd.P103 = new A(s + p + "g7.mp3");
        this.snd.P104 = new A(s + p + "g-7.mp3");
        this.snd.P105 = new A(s + p + "a7.mp3");
        this.snd.P106 = new A(s + p + "a-7.mp3");
        this.snd.P107 = new A(s + p + "b7.mp3");
        this.snd.P108 = new A(s + p + "c8.mp3");
    }

    playNote(n) {
        if (!n || n < 21 || n > 108) return;
        this.snd["P" + n].play();
    }

    /**
     * Decode a note, then play it
     * @param {*} note can be a number or an array of numbers
     */
    decodeNote(note) {
        if (note.length) {
            for (let n of note) {
                this.playNote(n);
            }
        }
        else {
            this.playNote(note);
        }
    }
}
