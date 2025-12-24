export class Cell {
	#x: number
	#y: number
	#state: 'unmarked' | 'marked' | 'blocked'
	#shouldFill: boolean
	#hint: number
	localCells: Cell[]
	#filledCount: number

	constructor(options: {
		x: number
		y: number
		state?: 'unmarked' | 'marked' | 'blocked'
		shouldFill: boolean
		getLocalCells?: () => Cell[]
	}) {
		this.#y = options.y
		this.#x = options.x
		this.#state = $state(options.state ?? 'unmarked')
		this.#shouldFill = options.shouldFill

		this.localCells = $derived(options.getLocalCells?.() ?? [this])
		this.#hint = $derived(this.localCells.filter((cell) => cell.shouldFill).length)
		this.#filledCount = $derived(this.localCells.filter((cell) => cell.state !== 'unmarked').length)
	}

	get x() {
		return this.#x
	}
	get y() {
		return this.#y
	}
	get hint() {
		return this.#hint
	}
	get state() {
		return this.#state
	}
	get shouldFill() {
		return this.#shouldFill
	}
	get filledCount() {
		return this.#filledCount
	}

	set state(val) {
		// Update if we are resetting to 'unmarked' OR if the current state is 'unmarked'
		if (val === 'unmarked' || this.#state === 'unmarked') {
			this.#state = val
		}
	}

	toggleState() {
		if (this.#state === 'unmarked') {
			this.#state = 'marked'
		} else if (this.#state === 'marked') {
			this.#state = 'blocked'
		} else {
			this.#state = 'unmarked'
		}
	}
}
