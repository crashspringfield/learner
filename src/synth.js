// import { MonoSynth } from 'tone'
import { AutoFilter, AmplitudeEnvelope, Destination, Filter, OmniOscillator } from 'tone'


// DOM elements
// const ampEnv        = document.getElementById('amp-env')
const ampAttack     = document.getElementById('amp-attack')
const ampDecay      = document.getElementById('amp-decay')
const ampSustain    = document.getElementById('amp-sustain')
const ampRelease    = document.getElementById('amp-release')
// const filter        = document.getElementById('filter')
const filterAttack  = document.getElementById('filter-attack')
const filterDecay   = document.getElementById('filter-decay')
const filterSustain = document.getElementById('filter-sustain')
const filterRelease = document.getElementById('filter-release')
const filterCutoff  = document.getElementById('filter-cutoff')
const filterEnv     = document.getElementById('filter-env')
const oscType       = document.getElementById('osc-type')

// Initialize Oscillator
const oscillator = new OmniOscillator({
	type: 'sine'
})

const FILTER_TYPE = 'lowpass'
const FILTER_FREQUENCY = 20000
const FILTER_ROLLOFF = -24
const LFO_FREQUENCY = 1
let filter = new Filter(
	FILTER_FREQUENCY, FILTER_TYPE, FILTER_ROLLOFF
).toDestination()
let autoFilter = new AutoFilter(
	LFO_FREQUENCY,
	FILTER_FREQUENCY
)
autoFilter.filter.rolloff = FILTER_ROLLOFF
// filter.start()

// attack 0-2
// decay 0-2
// sustain 0-1
// release 0-5
const ampEnv = new AmplitudeEnvelope({
	attack: 0,
	decay: 2,
	sustain: 1,
	release: 0
}).toDestination()

// oscillator.chain(filter, ampEnv).start()
// oscillator.connect(ampEnv).start() // works
// oscillator.connect(autoFilter).start() // works
oscillator.chain(ampEnv, autoFilter).start()

console.log('osc', oscillator.get())

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
  let note = key.note.match(/oct/)
	         ? key.note.replace(/oct/, OCTAVE + 1)
					 : `${key.note}${OCTAVE}`

  document.getElementById(id).classList.add('playing')

	oscillator.set({ frequency: note })

	// ampEnv.triggerAttack() // works
	// ampEnv.connect(autoFilter).triggerAttack()
	// oscillator.chain(filter, ampEnv.triggerAttack()) // sort of works

	autoFilter.toDestination().start()
	ampEnv.triggerAttack()

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

		ampEnv.triggerRelease()

		// oscillator.disconnect(autoFilter)
		// ampEnv.triggerRelease() // works
		// ampEnv.triggerRelease().disconnect(autoFilter)
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

    ampEnv.triggerRelease()
  })
  document.getElementById(key.id).addEventListener('touchend', () => {
    document.getElementById(key.id).classList.remove('playing')

    ampEnv.triggerRelease()
		oscillator.disconnect(filter)
  })
})

// Change oscillator type.
oscType.addEventListener('change', e => {
	oscillator.set({
		type: e.target.title
	})
oscillator.chain(ampEnv, autoFilter).start()

})

// Filter Cutoff
filterCutoff.addEventListener('change', e => {
	const percentToHz = 20000 * (e.target.value / 100)
	const frequency   = percentToHz > 100 ? percentToHz : 100 // Filter screws up at low values
	// console.log('f', frequency)
	// autoFilter.set({
	// 	baseFrequency: f
	// })
	// console.log('filter', autoFilter.baseFrequency)
// oscillator.disconnect(filter)
	// filter.frequency.rampTo(frequency, 0)
	// // oscillator.connect(filter)
	// console.log('filter.frequency', filter.frequency)
	// console.log('filter.frequency.value', filter.frequency.value)

	console.log('before', autoFilter.get())

	autoFilter.baseFrequency = frequency // works

	// oscillator.connect(filter)
	console.log('after', autoFilter.get())

})

// Filter envelope
// filterAttack.addEventListener('change', e => {
// 	synth.set({
// 		filterEnvelope: {
// 			attack: 2 * (e.target.value / 100)
// 		}
// 	})
// })
// filterDecay.addEventListener('change', e => {
// 	synth.set({
// 		filterEnvelope: {
// 			decay: 2 * (e.target.value / 100)
// 		}
// 	})
// })
// filterSustain.addEventListener('change', e => {
// 	synth.set({
// 		filterEnvelope: {
// 			sustain: e.target.value / 100
// 		}
// 	})
// })
// filterRelease.addEventListener('change', e => {
// 	synth.set({
// 		filterEnvelope: {
// 			release: 5 * (e.target.value / 100)
// 		}
// 	})
// })

// Amp envelope
ampAttack.addEventListener('change', e => {
	ampEnv.set({
		attack: 2 * (e.target.value / 100)
	})
})
ampDecay.addEventListener('change', e => {
	ampEnv.set({
		decay: 2 * (e.target.value / 100)
	})
})
ampSustain.addEventListener('change', e => {
	ampEnv.set({
		sustain: e.target.value / 100
	})
})
ampRelease.addEventListener('change', e => {
	ampEnv.set({
		release: 5 * (e.target.value / 100)
	})
})
