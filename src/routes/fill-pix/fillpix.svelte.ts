// DO NOT RENAME THIS IMPORT
import * as Cell from './Cell.svelte'
import { getLocalGrid } from './utils'
import { generateFillPixPuzzle } from './generator'

export class FillPixGame {
	#grid: Cell.Entity[][]
	#width: number
	#height: number
	#autoFillMode = $state(false)

	constructor(width: number, height: number) {
		this.#width = width
		this.#height = height
		this.#grid = this.#createCells(generateFillPixPuzzle(width, height, 'random'))
	}

	get width() {
		return this.#width
	}

	get height() {
		return this.#height
	}

	get grid() {
		return this.#grid
	}

	get autoFillMode() {
		return this.#autoFillMode
	}

	#createCells(map: boolean[][]): Cell.Entity[][] {
		const cells: Cell.Entity[][] = []
		for (let r = 0; r < this.#height; r++) {
			cells[r] = []
			for (let c = 0; c < this.#width; c++) {
				const hint = getLocalGrid(map, r, c).filter((cell) => cell).length

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

	toggleCell(cell: Cell.Entity) {
		cell.toggleState()
	}

	autoFill(cell: Cell.Entity) {
		const localCells = this.#getLocalGrid(cell)
		const totalMarked = localCells.filter((c) => c.state === 'marked').length

		if (cell.hint === totalMarked && totalMarked !== 0)
			localCells.forEach((c) => {
				if (c.state === 'unmarked') c.state = 'blocked'
			})
		else
			localCells.forEach((c) => {
				if (c.state === 'unmarked') c.state = 'marked'
			})
	}

	toggleAutoFillMode() {
		this.#autoFillMode = !this.#autoFillMode
	}

	handleCellClick(cell: Cell.Entity) {
		if (this.#autoFillMode) this.autoFill(cell)
		else this.toggleCell(cell)
	}

	check(): boolean {
		for (let r = 0; r < this.#height; r++) {
			for (let c = 0; c < this.#width; c++) {
				const cell = this.#grid[r][c]
				const localCells = this.#getLocalGrid(cell)
				const markedCount = localCells.filter((c) => c.state === 'marked').length
				if (markedCount !== cell.hint) return false
				if (cell.state === 'unmarked') return false
			}
		}
		return true
	}
}
