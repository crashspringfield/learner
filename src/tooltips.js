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

const LPF_INSTRUCTIONS = `
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

const HPF_INSTRUCTIONS = `
	<p>
		Here we have a High Pass Filter. It filters out lower frequencies while
		letting higher ones pass through.
	</p>
	<p>
		Turning the knob clockwise closes the filters, cutting off the fundamental and bringing
		out the overtones of <b class="orange">SQUARE</b> and <b class="orange">SAWTOOTH</b>
		waves.
	</p>
	<p>
		Turning the filter counter-clockwise opens it, making the sound fuller
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

const FILTER_TYPE_INSTRUCTIONS = `
type
`

const LFO_INSTRUCTIONS = `
LFO
`

const RESONANCE_INSTRUCTIONS = `
res hits
`

/**
 * {Array}
 *   {Object} DOM id and html for synth instructions
 */
const instructionsMapping = [
  { id: 'filter-control', html: '' },
  { id: 'resonance-control', html: RESONANCE_INSTRUCTIONS },
  { id: 'type',           html: FILTER_TYPE_INSTRUCTIONS },
	{ id: 'amp-env',        html: AMP_ENV_INSTRUCTIONS },
	{ id: 'filter-env',     html: FILTER_ENV_INSTRUCTIONS },
	{ id: 'keyboard',       html: KEYBOARD_INSTRUCTIONS },
	{ id: 'osc-type',       html: OSC_INSTRUCTIONS },
  { id: 'lfo',            html: LFO_INSTRUCTIONS }
]

/**
 * {Function} - Creates mouse and touch events for rendering instructions.
 *   @param {Object} containing id and html keys
 */
const createTooltip = rule => {
	const el = document.getElementById(rule.id)

	el.addEventListener('mouseenter', () => {
    // TODO: I hate this
    if (rule.id == 'filter-control') {
      instructions.innerHTML = document.getElementById('lp').checked
                             ? LPF_INSTRUCTIONS
                             : HPF_INSTRUCTIONS
    } else {
      instructions.innerHTML = instructionsMapping.find(k => k.id == el.id).html
    }
	})

	el.addEventListener('mouseleave', () => {
		instructions.innerHTML = DEFAULT_INSTRUCTIONS
	})

	el.addEventListener('touchstart', () => {
    if (rule.id == 'filter-control') {
      instructions.innerHTML = document.getElementById('lp').checked
                             ? LPF_INSTRUCTIONS
                             : HPF_INSTRUCTIONS
    } else {
      instructions.innerHTML = instructionsMapping.find(k => k.id == el.id).html
    }
	})
}

// Iterate over instructions, creating functions that map rules to IDs
instructionsMapping.forEach(rule => {
	const fn = () => createTooltip(rule)
	fn()
})

// Set default instructions to overview.
const instructions     = document.getElementById('instructions')
instructions.innerHTML = DEFAULT_INSTRUCTIONS
