import * as Cell from './Cell.svelte'
import { getLocalGrid } from './utils'

export class FillPixGame {
	#grid: Cell.Entity[][]
	#width: number
	#height: number

	constructor(width: number, height: number, map?: boolean[][]) {
		this.#width = width
		this.#height = height
		this.#grid = this.#createCells(map)
	}
	get width() {
		return this.#width
	}
	get grid() {
		return this.#grid
	}

	#createCells(map?: boolean[][]): Cell.Entity[][] {
		const cells: Cell.Entity[][] = []
		for (let r = 0; r < this.#height; r++) {
			cells[r] = []
			for (let c = 0; c < this.#width; c++) {
				const randomHint = () => (Math.random() < 0.3 ? Math.floor(Math.random() * 9) + 1 : 0)
				const hint = map ? getLocalGrid(map, r, c).length : randomHint()

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
		return getLocalGrid(this.#grid, cell.row, cell.col)
	}

	getFilled(cell: Cell.Entity): number {
		return this.#getLocalGrid(cell).filter((c) => c.state !== 'unmarked').length
	}
}
