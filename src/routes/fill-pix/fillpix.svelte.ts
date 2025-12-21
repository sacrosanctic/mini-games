import * as Cell from './Cell.svelte'

export class FillPixGame {
	#grid: Cell.Entity[][]
	#width: number
	#height: number

	constructor(width: number, height: number) {
		this.#width = width
		this.#height = height
		this.#grid = this.#createCells()
	}
	get width() {
		return this.#width
	}
	get grid() {
		return this.#grid
	}

	#createCells(): Cell.Entity[][] {
		const cells: Cell.Entity[][] = []
		for (let r = 0; r < this.#height; r++) {
			cells[r] = []
			for (let c = 0; c < this.#width; c++) {
				// For now, random clues; replace with proper generator
				const hint = Math.random() < 0.3 ? Math.floor(Math.random() * 9) + 1 : 0

				const minR = Math.max(0, r - 1)
				const maxR = Math.min(this.#height - 1, r + 1)
				const minC = Math.max(0, c - 1)
				const maxC = Math.min(this.#width - 1, c + 1)
				const totalCells = (maxR - minR + 1) * (maxC - minC + 1)

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
					cells.push(this.#grid[nr][nc])
				}
			}
		}
		return cells
	}

	getFilled(cell: Cell.Entity): number {
		return this.#getLocalGrid(cell).filter((c) => c.state !== 'unmarked').length
	}
}
