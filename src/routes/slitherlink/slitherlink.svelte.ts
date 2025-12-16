import { generateSlitherlinkPuzzle } from './generator'

type HorizontalLineElement = { type: 'hline'; state: 'unknown' | 'include' | 'exclude' }
type VerticalLineElement = { type: 'vline'; state: 'unknown' | 'include' | 'exclude' }
type CellElement = { type: 'cell'; actual: number | null; current: number }
type LineElement = HorizontalLineElement | VerticalLineElement

type Positioned<T> = T & { row: number; col: number }
type GridElement = { type: 'dot' } | CellElement | HorizontalLineElement | VerticalLineElement
type Grid = GridElement[][]

export class SlitherlinkGame {
	#grid: Grid
	#width: number
	#height: number
	#gridcache: Grid
	status = $state('Grid loaded - ready to add line drawing functionality')

	constructor(options: { width?: number; height?: number } = {}) {
		this.#width = options.width ?? 3
		this.#height = options.height ?? 3

		this.#grid = this.generator()
		this.#gridcache = $state.snapshot(this.#grid)
		this.status = 'New puzzle generated!'
	}

	get grid() {
		return this.#grid
	}

	#getElement = (row: number, col: number): Positioned<GridElement> => {
		const rowOutOfBounds = row < 0 || row >= this.#grid.length
		const colOutOfBounds = col < 0 || col >= this.#grid[0].length

		if (rowOutOfBounds || colOutOfBounds) {
			throw new Error(`Invalid grid position: ${row}, ${col}`)
		}
		return Object.assign(this.#grid[row][col], { row, col })
	}

	convertPuzzleToGrid(puzzle: ReturnType<typeof generateSlitherlinkPuzzle>): Grid {
		const grid: Grid = []

		for (let row = 0; row < 2 * puzzle.height + 1; row++) {
			const gridRow: GridElement[] = []
			for (let col = 0; col < 2 * puzzle.width + 1; col++) {
				if (row % 2 === 0) {
					// Even rows: dots and horizontal lines
					if (col % 2 === 0) {
						gridRow.push({ type: 'dot' })
					} else {
						gridRow.push({ type: 'hline', state: 'unknown' })
					}
				} else {
					// Odd rows: vertical lines and cells
					if (col % 2 === 0) {
						gridRow.push({ type: 'vline', state: 'unknown' })
					} else {
						// Calculate cell position in puzzle coordinates
						const cellRow = Math.floor(row / 2)
						const cellCol = Math.floor(col / 2)
						const actual = puzzle.cellNumbers[cellRow][cellCol]
						gridRow.push({ type: 'cell', actual, current: 0 })
					}
				}
			}
			grid.push(gridRow)
		}

		return grid
	}

	createInitialGrid(width: number, height: number): Grid {
		const grid: Grid = []

		for (let row = 0; row < 2 * height + 1; row++) {
			const gridRow: GridElement[] = []
			for (let col = 0; col < 2 * width + 1; col++) {
				if (row % 2 === 0) {
					// Even rows: dots and horizontal lines
					if (col % 2 === 0) {
						gridRow.push({ type: 'dot' })
					} else {
						gridRow.push({ type: 'hline', state: 'unknown' })
					}
				} else {
					// Odd rows: vertical lines and cells
					if (col % 2 === 0) {
						gridRow.push({ type: 'vline', state: 'unknown' })
					} else {
						gridRow.push({ type: 'cell', actual: null, current: 0 })
					}
				}
			}
			grid.push(gridRow)
		}

		return grid
	}

	toggleLine(row: number, col: number, type: 'hline' | 'vline') {
		const element = this.#getElement(row, col)
		if (element.type !== type) return

		if (element.state === 'unknown') {
			element.state = 'include'
		} else if (element.state === 'include') {
			element.state = 'exclude'
		} else {
			element.state = 'unknown'
		}

		this.#getAdjacentCells(element).forEach((cell) => {
			cell.current = this.#getLineCount(cell)
		})
	}

	#getAdjacentCells = (element: Positioned<LineElement>): Positioned<CellElement>[] => {
		const cells: Positioned<CellElement>[] = []

		if (element.type === 'hline') {
			// Horizontal line connects cells above and below
			if (element.row > 0)
				cells.push(this.#getElement(element.row - 1, element.col) as Positioned<CellElement>) // Cell above
			if (element.row < this.#grid.length - 1)
				cells.push(this.#getElement(element.row + 1, element.col) as Positioned<CellElement>) // Cell below
		} else {
			// Vertical line connects cells left and right
			if (element.col > 0)
				cells.push(this.#getElement(element.row, element.col - 1) as Positioned<CellElement>) // Cell left
			if (element.col < this.#grid[0].length - 1)
				cells.push(this.#getElement(element.row, element.col + 1) as Positioned<CellElement>) // Cell right
		}

		return cells
	}

	#getLineCount(cell: Positioned<CellElement>): number {
		let count = 0
		// Check all four sides
		const top = this.#getElement(cell.row - 1, cell.col)
		if (top.type === 'hline' && top.state === 'include') count++

		const bottom = this.#getElement(cell.row + 1, cell.col)
		if (bottom.type === 'hline' && bottom.state === 'include') count++

		const left = this.#getElement(cell.row, cell.col - 1)
		if (left.type === 'vline' && left.state === 'include') count++

		const right = this.#getElement(cell.row, cell.col + 1)
		if (right.type === 'vline' && right.state === 'include') count++

		return count
	}

	checker(): boolean {
		if (!this.#checkCellNumbers()) {
			this.status = 'Incorrect: Some cells have wrong number of lines'
			return false
		}

		this.status = 'Correct! Puzzle solved!'
		return true
	}

	#checkCellNumbers(): boolean {
		for (let row = 0; row < this.grid.length; row++) {
			for (let col = 0; col < this.grid[0].length; col++) {
				const element = this.#getElement(row, col)
				if (element.type === 'cell' && element.actual !== null) {
					if (element.current !== element.actual) {
						return false
					}
				}
			}
		}
		return true
	}

	generator(): Grid {
		const grid = this.convertPuzzleToGrid(generateSlitherlinkPuzzle(this.#width, this.#height))
		return grid
	}

	reset() {
		this.#grid = this.#gridcache
	}

	get width(): number {
		return this.#width
	}

	get height(): number {
		return this.#height
	}

	solver(): boolean {
		// Basic constraint propagation solver
		// TODO: Implement full backtracking solver for complex cases
		return false
	}
}
