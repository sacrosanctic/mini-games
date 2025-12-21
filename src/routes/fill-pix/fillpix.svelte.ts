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
				cells[r][c] = new Cell({
					row: r,
					col: c,
					value,
					getMarkedCount: (currentCell: Cell) =>
						this.#getLocalGrid(currentCell).filter((cell) => cell.state === 'marked').length,
				})
			}
		}
		return cells
	}

	// Get 3x3 local grid including self
	#getLocalGrid(cell: Cell): Cell[] {
		const cells: Cell[] = []
		for (let dr = -1; dr <= 1; dr++) {
			for (let dc = -1; dc <= 1; dc++) {
				const nr = cell.row + dr
				const nc = cell.col + dc
				if (nr >= 0 && nr < this.#height && nc >= 0 && nc < this.#width) {
					cells.push(this.#cells[nr][nc])
				}
			}
		}
		return cells
	}
}

export class Cell {
	#row: number
	#col: number
	#value: number // 0 for empty, number for clue
	#state: 'unmarked' | 'marked' | 'blocked'
	#getMarkedCount: (cell: Cell) => number

	constructor(options: {
		row: number
		col: number
		value?: number
		state?: 'unmarked' | 'marked' | 'blocked'
		getMarkedCount?: (cell: Cell) => number
	}) {
		this.#row = options.row
		this.#col = options.col
		this.#value = options.value ?? 0
		this.#state = $state(options.state ?? 'unmarked')
		this.#getMarkedCount = options.getMarkedCount ?? (() => 0)
	}

	get markedCount(): number {
		return this.#getMarkedCount(this)
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
