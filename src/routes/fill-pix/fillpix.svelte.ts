import * as Cell from './Cell.svelte'

class Grid {
	#cells: Cell.Entity[][]
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

	#createCells(): Cell.Entity[][] {
		const cells: Cell.Entity[][] = []
		for (let r = 0; r < this.#height; r++) {
			cells[r] = []
			for (let c = 0; c < this.#width; c++) {
				// For now, random clues; replace with proper generator
				const hint = Math.random() < 0.3 ? Math.floor(Math.random() * 9) + 1 : 0
				cells[r][c] = new Cell.Entity({
					row: r,
					col: c,
					hint,
					totalCells,
				})
			}
		}
		return cells
	}

	// Get 3x3 local grid including self
	#getLocalGrid(cell: Cell.Entity): Cell.Entity[] {
		const cells: Cell.Entity[] = []
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

	getFilled(cell: Cell.Entity): number {
		return this.#getLocalGrid(cell).filter((c) => c.state !== 'unmarked').length
	}
}

export class FillPixGame {
	grid: Grid

	constructor(width = 10, height = 10) {
		this.grid = new Grid(width, height)
	}

	// Add methods for game logic, validation, etc.
}
