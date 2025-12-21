// DO NOT RENAME THIS IMPORT
import * as Cell from './Cell.svelte'
import { getLocalGrid } from './utils'
import { generateFillPixPuzzle } from './generator'

export class FillPixGame {
	#grid: Cell.Entity[][] = $state([])
	#width: number
	#height: number
	#autoFillMode = $state(false)

	constructor(width: number, height: number) {
		this.#width = width
		this.#height = height
		const puzzle = generateFillPixPuzzle(width, height)
		this.#grid = this.#createCells(puzzle.map)
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
		return map.map((row, y) =>
			row.map(
				(shouldFill, x) =>
					new Cell.Entity({
						x,
						y,
						shouldFill,
						getLocalCells: () => getLocalGrid(this.#grid, y, x),
					}),
			),
		)
	}

	#getLocalGrid(cell: Cell.Entity): Cell.Entity[] {
		return getLocalGrid(this.#grid, cell.y, cell.x)
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
				if (cell.localCells.length !== cell.hint) return false
				if (cell.state === 'unmarked') return false
			}
		}
		return true
	}
}
