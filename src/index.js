import { MonoSynth } from 'tone'

let cutoff = 12000

// HTML for instructions block
const DEFAULT_INSTRUCTIONS = `
	<p>
		Learner is a synthesizer that teaches you the basics of subtractive synthesis.
	<p>
	</p>
		Simply follow the numbers and look here for instructions as you hover over each block.
		If on a phone, tap the number to see the instructions.
	</p>

`
const OSC_INSTRUCTIONS = `
	<p>
		Oscillators generate the sound.
	</p>
	<p>
		Different shapes sound different because they add different harmonic overtones
		to the fundamental frequency. These different harmonic overtones (and the
		ratio between them) generate different timbres.
	</p>
	<p>
		<b class="orange">SINE</b> A sinewave is just the fundamental pitch. For example,
		concert A is vibrating at 440Hz (that's 440 times a second).
	</p>
	<p>
		<b class="orange">SQUARE</b> A square wave has the fundamental pitch,
		but also odd harmonic overtones.
	</p>
	<p>
		<b class="orange">SAWTOOTH</b> A sawtooch wave has the fundamental pitch and
		both the even and odd harmonic overtones.
	</p>
`
const FILTER_INSTRUCTIONS = `
	<p>
		Here we have a Low Pass Filter. It filters out higher frequencies while
		letting lower ones pass through.
	</p>
	<p>
		Turning the knob counter-clockwise closes the filters, cutting off the rich
		overtones  that give <b class="orange">SQUARE</b> and <b class="orange">SAWTOOTH</b>
		waves their rich sound.
	</p>
	<p>
		Turning the filter clockwise opens it, letting the harmonic overtones through.
	</p>
`
const FILTER_ENV_INSTRUCTIONS = `
<p>
	<span class="orange">ATTACK</span>
	How long it takes for the filter to engage.
</p>
<p>
	<span class="orange">DECAY</span>
	Once the filter is engaged, how long it takes to disengage.
</p>
<p>
	<span class="orange">SUSTAIN</span>
	The amount the filter sustains itself at.
</p>
<p>
	<span class="orange">RELEASE</span>
	How long the filter is engaged once the key is released.
</p>
`
const AMP_ENV_INSTRUCTIONS = `
	<p>
		<span class="orange">ATTACK</span>
		How long it takes the sound to start or fade in.
	</p>
	<p>
		<span class="orange">DECAY</span>
		Once the sound reaches its maximum volume, how long it takes to get quieter.
	</p>
	<p>
		<span class="orange">SUSTAIN</span>
		The sustained volume of the sound.
	</p>
	<p>
		<span class="orange">RELEASE</span>
		How long the note rings out once the key is released.
	</p>
`
const KEYBOARD_INSTRUCTIONS = `
	<p>
		Many synths are controlled by keyboards. Pressing the corresponding key will play the note. On a phone, you can tap/hold a key to hear it.
	</p>
`

// DOM elements
const ampEnv        = document.getElementById('amp-env')
const ampAttack     = document.getElementById('amp-attack')
const ampDecay      = document.getElementById('amp-decay')
const ampSustain    = document.getElementById('amp-sustain')
const ampRelease    = document.getElementById('amp-release')
const filter        = document.getElementById('filter')
const filterAttack  = document.getElementById('filter-attack')
const filterDecay   = document.getElementById('filter-decay')
const filterSustain = document.getElementById('filter-sustain')
const filterRelease = document.getElementById('filter-release')
const filterCutoff  = document.getElementById('filter-cutoff')
const filterEnv     = document.getElementById('filter-env')
const instructions  = document.getElementById('instructions')
const oscType       = document.getElementById('osc-type')

const synth = new MonoSynth({
	oscillator: {
		type: "sine"
	},
	filter: {
		type: 'lowpass',
		frequency: 'C8'
	},
	envelope: {
		attack: 0,
		decay: 2,
		sustain: 1,
		release: 0
	},
	filterEnvelope: {
		attack: 0,
		decay: 2,
		sustain: 1,
		release: 0
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

const instructionsMapping = [
	{ id: 'amp-env',    html: AMP_ENV_INSTRUCTIONS },
	{ id: 'filter',     html: FILTER_INSTRUCTIONS },
	{ id: 'filter-env', html: FILTER_ENV_INSTRUCTIONS },
	{ id: 'keyboard',   html: KEYBOARD_INSTRUCTIONS },
	{ id: 'osc-type',   html: OSC_INSTRUCTIONS },
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

// Create instructions for each element.
const createTooltip = rule => {
	const el   = document.getElementById(rule.id)
	// const tool = document.getElementById(`${rule.id}-tooltip`)

	el.addEventListener('mouseenter', () => {
		instructions.innerHTML = instructionsMapping.find(k => k.id == el.id).html
	})

	el.addEventListener('mouseleave', () => {
		instructions.innerHTML = DEFAULT_INSTRUCTIONS
	})

	el.addEventListener('touchstart', () => {
		instructions.innerHTML = instructionsMapping.find(k => k.id == el.id).html
	})
}

instructionsMapping.forEach(rule => {
	const fn = () => createTooltip(rule)
	fn()
})

instructions.innerHTML = DEFAULT_INSTRUCTIONS

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

// Filter Cutoff
filterCutoff.addEventListener('change', e => {
	const octave = e.target.value > 80 ? 8 : e.target.value[0]

	synth.set({
		filter: {
			frequency: `C${octave}`,
			type: 'lowpass'
		}
	})
})

// Amp envelope
filterAttack.addEventListener('change', e => {
	synth.set({
		filterEnvelope: {
			attack: 2 * (e.target.value / 100)
		}
	})
})
filterDecay.addEventListener('change', e => {
	synth.set({
		filterEnvelope: {
			decay: 2 * (e.target.value / 100)
		}
	})
})
filterSustain.addEventListener('change', e => {
	synth.set({
		filterEnvelope: {
			sustain: e.target.value / 100
		}
	})
})
filterRelease.addEventListener('change', e => {
	synth.set({
		filterEnvelope: {
			release: 5 * (e.target.value / 100)
		}
	})
})

// Filter envelope
ampAttack.addEventListener('change', e => {
	synth.set({
		envelope: {
			attack: 2 * (e.target.value / 100)
		}
	})
})
ampDecay.addEventListener('change', e => {
	synth.set({
		envelope: {
			decay: 2 * (e.target.value / 100)
		}
	})
})
ampSustain.addEventListener('change', e => {
	synth.set({
		envelope: {
			sustain: e.target.value / 100
		}
	})
})
ampRelease.addEventListener('change', e => {
	synth.set({
		envelope: {
			release: 5 * (e.target.value / 100)
		}
	})
})
