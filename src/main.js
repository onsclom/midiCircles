class Note {
  constructor (color) {
    this.x=random(0,width);
    this.y=random(0,height);
    this.color=color;
    this.transparency=125;
    this.decay=2;
    this.size=width*.1;
  }

  draw () {

    (this.color).setAlpha(this.transparency);
    fill(this.color);
    circle(this.x,this.y,this.size);
    this.transparency-=this.decay;
    this.size+=width*.001;

  }
}


let noteC;
let noteColors = [];
let notes = [];

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  noteC=color('#000');
  createCanvas(windowWidth, windowHeight);

  connectMIDI();

  noteColors=[color('#55004f'),color('#740000'),color('#b30000'),color('#ee0000'),color('#ff6300'),color('#ffec00'),color('#99ff00'),color('#28ff00'),color('#00ffe8'),color('#007cff'),color('#0500ff'),color('#4500ea')];
}

function draw() {
  strokeWeight(0);
  background(color('#111'));
  for (let i = notes.length; i>0; i--)
  {
    if (notes[i-1].transparency<=0)
    {
      notes.splice(i-1, 1);
    }
  }
  for (note of notes) {
    note.draw();
  }
}

function connectMIDI() {
  navigator.requestMIDIAccess()
  .then(onMIDISuccess, onMIDIFailure);

  function onMIDISuccess(midiAccess) {
    console.log(midiAccess);
    var inputs = midiAccess.inputs;
    var outputs = midiAccess.outputs;
  }

  function onMIDIFailure() {
    console.log('Could not access your MIDI devices.');
  }

  function onMIDISuccess(midiAccess) {
    for (var input of midiAccess.inputs.values())
        input.onmidimessage = getMIDIMessage;
  }

  function getMIDIMessage(message) {
    var command = message.data[0];
    var note = message.data[1];
    var velocity = (message.data.length > 2) ? message.data[2] : 0; // a velocity value might not be included with a noteOff command

    switch (command) {
        case 144: // noteOn
            if (velocity > 0) {
                noteOn(note, velocity);
            } else {
                noteOff(note);
            }
            break;
        case 128: // noteOff
            noteOff(note);
            break;
        // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
    }
  } 
}

function noteOn(note,vel) {
  notes.push(new Note(noteColors[note%12]));
}

function noteOff() {
  console.log("off");
}