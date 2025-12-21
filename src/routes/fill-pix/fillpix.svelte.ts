class Grid {
	#cells: Cell[][]
	#width: number
	#height: number

	constructor(width: number, height: number) {
		this.#width = width
		this.#height = height
		this.#cells = this.#createCells()
	}
	get width() {
		return this.#width
	}
	get cells() {
		return this.#cells
	}

	#createCells(): Cell[][] {
		const cells: Cell[][] = []
		for (let r = 0; r < this.#height; r++) {
			cells[r] = []
			for (let c = 0; c < this.#width; c++) {
				// For now, random clues; replace with proper generator
				const value = Math.random() < 0.3 ? Math.floor(Math.random() * 9) + 1 : 0
				cells[r][c] = new Cell({ row: r, col: c, value, grid: this })
			}
		}
		return cells
	}

	// Get 3x3 neighborhood including self
	getNeighbours(cell: Cell): Cell[] {
		const neighbors: Cell[] = []
		for (let dr = -1; dr <= 1; dr++) {
			for (let dc = -1; dc <= 1; dc++) {
				const nr = cell.row + dr
				const nc = cell.col + dc
				if (nr >= 0 && nr < this.#height && nc >= 0 && nc < this.#width) {
					neighbors.push(this.#cells[nr][nc])
				}
			}
		}
		return neighbors
	}
}

export class Cell {
	#row: number
	#col: number
	#value: number // 0 for empty, number for clue
	#state: 'unmarked' | 'marked' | 'blocked' = $state('unmarked')
	#grid: Grid
	#markedNeighbours = $derived(
		this.#getNeighbours().filter((cell) => cell.state === 'marked').length,
	)

	constructor(options: { row: number; col: number; value?: number; grid: Grid }) {
		this.#row = options.row
		this.#col = options.col
		this.#value = options.value ?? 0
		this.#state = 'unmarked'
		this.#grid = options.grid
	}

	get markedNeighbours() {
		return this.#markedNeighbours
	}

	get row() {
		return this.#row
	}
	get col() {
		return this.#col
	}
	get value() {
		return this.#value
	}
	get state() {
		return this.#state
	}

	// Get 3x3 neighborhood including self
	#getNeighbours(): Cell[] {
		return this.#grid.getNeighbours(this)
	}

	// Check if sum of filled cells in 3x3 equals target (for cells with clues)
	check3x3Sum(): boolean {
		if (this.#value === 0) return true // No clue to check
		const filledCount = this.#getNeighbours().filter((cell) => cell.state === 'marked').length
		return filledCount === this.#value
	}

	getNeighbourFillCount(): number {
		return this.#getNeighbours().filter((cell) => cell.state === 'marked').length
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

export class FillPixGame {
	grid: Grid

	constructor(width = 10, height = 10) {
		this.grid = new Grid(width, height)
	}

	// Add methods for game logic, validation, etc.
}
