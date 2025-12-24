import { Cell } from './cell.svelte'
import { StateHistory } from 'runed'
import { getLocalGrid } from './utils'
import { generateFillPixPuzzle } from './generator'

export class FillPixGame {
	#grid: Cell[][] = $state([])
	#gridHistory: StateHistory<Cell[][]>
	#width: number
	#height: number
	#autoFillMode = $state(true)

	constructor(width: number, height: number) {
		this.#width = width
		this.#height = height
		const puzzle = generateFillPixPuzzle(width, height)
		this.#grid = this.#createCells(puzzle)
		this.#gridHistory = new StateHistory(this.#grid, (value) => {
			this.#grid = value
		})
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

	get gridHistory() {
		return this.#gridHistory
	}

	get autoFillMode() {
		return this.#autoFillMode
	}

	#createCells(map: boolean[][]): Cell[][] {
		return map.map((row, y) =>
			row.map(
				(shouldFill, x) =>
					new Cell({
						x,
						y,
						shouldFill,
						getLocalCells: () => getLocalGrid(this.#grid, y, x),
					}),
			),
		)
	}

	#getLocalGrid(cell: Cell): Cell[] {
		return getLocalGrid(this.#grid, cell.y, cell.x)
	}

	toggleCell(cell: Cell) {
		cell.toggleState()
	}

	autoFill(cell: Cell) {
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

	undo() {
		this.#gridHistory.undo()
	}

	redo() {
		this.#gridHistory.redo()
	}

	get canUndo() {
		return this.#gridHistory.canUndo
	}

	get canRedo() {
		return this.#gridHistory.canRedo
	}

	handleCellClick(cell: Cell) {
		if (this.#autoFillMode) this.autoFill(cell)
		else this.toggleCell(cell)
	}

	check(): boolean {
		for (let r = 0; r < this.#height; r++) {
			for (let c = 0; c < this.#width; c++) {
				const cell = this.#grid[r][c]
				const playerFilledCount = cell.localCells.filter(
					(localCell) => localCell.state === 'marked',
				).length
				if (playerFilledCount !== cell.hint) return false
				if (cell.state === 'unmarked') return false
			}
		}
		return true
	}
}
