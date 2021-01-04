import { MonoSynth } from 'tone'

const synth = new MonoSynth({
	oscillator: {
		type: "square"
	},
	envelope: {
		attack: 0.1
	}
}).toDestination()

// TODO: set-able
const OCTAVE = 4

// Map key pressing/clicking to events.
const keyMapping = [
  { id: 'a', note: 'C' },
  { id: 'w', note: 'C#' },
  { id: 's', note: 'D' },
  { id: 'e', note: 'D#' },
  { id: 'd', note: 'E' },
  { id: 'f', note: 'F' },
  { id: 't', note: 'F#' },
  { id: 'g', note: 'G' },
  { id: 'y', note: 'G#' },
  { id: 'h', note: 'A' },
  { id: 'u', note: 'A#' },
  { id: 'j', note: 'B' },
  { id: 'k', note: 'Coct' },
]

// Wrapper to handle octaves && pass to key or click events
const playNote = (note) => {
  if (note.match(/oct/)) {
    note = note.replace(/oct/, OCTAVE + 1)
  } else {
    note = `${note}${OCTAVE}`
  }

  synth.triggerAttack(note)
}


document.addEventListener('keydown', e => {
  if (keyMapping.map(k => k.id).includes(e.key)) {
    const key = keyMapping.filter(k => k.id === e.key)[0]

    document.getElementById(e.key).classList.add('playing')

    playNote(key.note)
  }
})

document.addEventListener('keyup', e => {
  if (keyMapping.map(k => k.id).includes(e.key)) {
    const key = keyMapping.filter(k => k.id === e.key)[0]

    document.getElementById(e.key).classList.remove('playing')

    synth.triggerRelease()
  }
})
