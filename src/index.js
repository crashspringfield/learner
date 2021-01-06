import { MonoSynth } from 'tone'

const oscType = document.getElementById('osc-type')

const synth = new MonoSynth({
	oscillator: {
		type: "sine"
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
const playNote = key => {
  const id = key.id
  let note = key.note

  document.getElementById(id).classList.add('playing')

  if (note.match(/oct/)) {
    note = note.replace(/oct/, OCTAVE + 1)
  } else {
    note = `${note}${OCTAVE}`
  }

  synth.triggerAttack(note)
}

// Play note when key pressed.
document.addEventListener('keydown', e => {
  if (keyMapping.map(k => k.id).includes(e.key)) {
    const key = keyMapping.filter(k => k.id === e.key)[0]

    playNote(key)
  }
})

// Stop note when key lifted.
document.addEventListener('keyup', e => {
  if (keyMapping.map(k => k.id).includes(e.key)) {
    const key = keyMapping.filter(k => k.id === e.key)[0]

    document.getElementById(e.key).classList.remove('playing')

    synth.triggerRelease()
  }
})

// Play notes for click events
keyMapping.forEach(key => {
  document.getElementById(key.id).addEventListener('mousedown', () => {
    playNote(key)
  })
  document.getElementById(key.id).addEventListener('touchstart', () => {
    playNote(key)
  })

  document.getElementById(key.id).addEventListener('mouseup', () => {
    document.getElementById(key.id).classList.remove('playing')

    synth.triggerRelease()
  })
  document.getElementById(key.id).addEventListener('touchend', () => {
    document.getElementById(key.id).classList.remove('playing')

    synth.triggerRelease()
  })
})

// Change oscillator type.
oscType.addEventListener('change', e => {
	synth.set({
		oscillator: {
			type: e.target.title
		},
	})
})
