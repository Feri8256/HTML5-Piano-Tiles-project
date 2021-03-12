function DecodeNote(tileInput,outside,tapped) {
    if(outside){//Játékon kívüli hangok lejátszása
        if (tileInput.length) {
            for (var i = 0; i < tileInput.length; i++) {
                PlayNote[tileInput[i]]();
            }
        }
        else {
            PlayNote[tileInput]();
        }
    }

    else{
        function delayTimer(ms) {
            return new Promise(res => setTimeout(res, ms));
        }
        if (!tapped && tileInput != 0) {
            if (tileInput.length) {
                if (tileInput[0].sn && tileInput[0].s) {
                    let snL = tileInput.length;
                    let spd = currentSpeed / tileInput[0].s;
                    let snD = (150 / snL) * 2 - (spd * 4);
                    async function Delayed() {
                        for (var i = 0; i < tileInput.length; i++) {
                            if (tileInput[i].sn[0]) {
                                for (var j = 0; j < tileInput[i].sn.length; j++) {
                                    PlayNote[tileInput[i].sn[j]]();
                                }
                            }
                            else {
                                PlayNote[tileInput[i].sn]();
                            }
                            await delayTimer(snD);
                        }
                    }
                    Delayed();
                }

                if (tileInput[0].sn && !tileInput[0].s) {
                    let snL = tileInput.length;
                    let spd = currentSpeed;
                    let snD = (150 / snL) * 2 - (spd * 4);
                    async function Delayed() {
                        for (var i = 0; i < tileInput.length; i++) {
                            if (tileInput[i].sn[0]) {
                                for (var j = 0; j < tileInput[i].sn.length; j++) {
                                    PlayNote[tileInput[i].sn[j]]();
                                }
                            }
                            else {
                                PlayNote[tileInput[i].sn]();
                            }
                            await delayTimer(snD);
                        }
                    }
                    Delayed();
                }

                else if (!tileInput[0].s) {
                    for (var i = 0; i < tileInput.length; i++) {
                        PlayNote[tileInput[i]]();
                    }
                }
            }
            else {
                PlayNote[tileInput]();
            }
        }
    }
}