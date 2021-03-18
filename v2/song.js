class Song {
    constructor(json_data) {
        this.tracks = json_data.ableton.tracks;
        this.instruments = [];
        this.scenes_switches = [];
        this.volumes = json_data.knobs.volumes;
        this.sends = json_data.knobs.sends

        this.send_1 = new Tone.JCReverb(0.7);
        this.send_1.receive('reverb').toMaster();
        this.send_2 = new Tone.FeedbackDelay('4t', 0.8);
        this.send_2.receive('delay').toMaster();

        for (let i = 0; i < this.tracks.length; i++) {

            //set up instruments
            let instrument;
            if (Object.keys(this.tracks[i].drum_rack).length > 0) {
                let mapping = this.tracks[i].drum_rack;
                instrument = new Tone.Sampler(mapping, function () {
                }, '../sounds/paradoxes/');
            } else {
                let file = this.tracks[i].simpler.file;
                let mapping = { 'C3': file };
                instrument = new Tone.Sampler(mapping, function () {
                }, '../sounds/paradoxes/');
            }


            instrument.toMaster();

            //set up parts
            instrument.parts = [];
            let parts = this.tracks[i].parts;
            for (let j = 0; j < parts.length; j++) {
                let part_events = to_tone_values(parts[j].events);
                instrument.parts[j] = new Tone.Part(function (time, event) {
                    instrument.triggerAttackRelease(event.note, event.duration, time, event.velocity)
                }, part_events);
                instrument.parts[j].loop = true;
                instrument.parts[j].loopEnd = parts[j].loop_end;
            }

            //add instrument to song
            this.instruments.push(instrument);
            //set the volume from the knobs from the json data
            instrument.volume.value = this.volumes[i];
            //link to send bus
            instrument.send_1 = instrument.send('reverb', this.sends[i]);
            instrument.send_2 = instrument.send('delay', -Infinity);
            instrument.send_1 = instrument.send('reverb', this.sends[i + this.instruments.length]);
        }
        //set all scene triggers to false
        for (let i = 0; i < this.instruments[0].parts.length; i++) {
            this.scenes_switches[i] = false;
        }
    }

    startPart(instrument_index, part_index) {
        let part = this.instruments[instrument_index].parts[part_index]
        part.start(loop_length);
        // print('instrument ' + instrument_index + ' part ' + part_index + ' started');
    }

    stopPart(instrument_index, part_index) {
        let part = this.instruments[instrument_index].parts[part_index]
        part.stop(loop_length);
        // print('instrument ' + instrument_index + ' part ' + part_index + ' stopped');  
    }

    startPartInSession(instrument_index, part_index) {
        let instrument = this.instruments[instrument_index];
        //start the part with the part_index and stop all other parts of this instrument
        for (let p = 0; p < instrument.parts.length; p++) {
            if (part_index == p) {
                this.startPart(instrument_index, p)
            } else {
                this.stopPart(instrument_index, p)
            }
        }
    }

    startScene(index = 0) {
        if (this.scenes_switches[index] == false) {

            for (let s = 0; s < this.scenes_switches.length; s++) {
                if (s == index) {
                    this.scenes_switches[s] = true;
                } else {
                    this.scenes_switches[s] = false;
                }
            }
            for (let i = 0; i < this.instruments.length; i++) {
                this.startPartInSession(i, index);
            }
        }
    }
}



function to_tone_values(events) {
    processed = events.map(function (event) {
        return {
            time: event.time * Tone.Time('4n'),
            note: event.note, duration: event.duration * Tone.Time('4n'), velocity: event.velocity
        }
    });
    return processed;
}
