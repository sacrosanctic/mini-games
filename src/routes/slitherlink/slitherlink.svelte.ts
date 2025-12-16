type HorizontalLineElement = { type: 'hline'; state: 'unknown' | 'include' | 'exclude' }
type VerticalLineElement = { type: 'vline'; state: 'unknown' | 'include' | 'exclude' }
type CellElement = { type: 'cell'; actual: number | null; current: number }

type LineElement = HorizontalLineElement | VerticalLineElement

type GridElement = { type: 'dot' } | CellElement | HorizontalLineElement | VerticalLineElement

type Grid = GridElement[][]

type Positioned<T> = T & { row: number; col: number }

export class SlitherlinkGame {
	grid: Grid
	#width: number
	#height: number
	status = $state('Grid loaded - ready to add line drawing functionality')

	constructor(options: { width?: number; height?: number } = {}) {
		this.#width = options.width ?? 3
		this.#height = options.height ?? 3
		this.grid = $state(this.createInitialGrid(this.#width, this.#height))
	}

	#getElement = (row: number, col: number): Positioned<GridElement> => {
		const rowOutOfBounds = row < 0 || row >= this.grid.length
		const colOutOfBounds = col < 0 || col >= this.grid[0].length

		if (rowOutOfBounds || colOutOfBounds) {
			throw new Error(`Invalid grid position: ${row}, ${col}`)
		}
		return Object.assign(this.grid[row][col], { row, col })
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

		this.#updateAdjacentCellCounts(element)
	}

	#getAdjacentCells = (element: Positioned<LineElement>): Positioned<CellElement>[] => {
		const cells: Positioned<CellElement>[] = []

		if (element.type === 'hline') {
			// Horizontal line connects cells above and below
			if (element.row > 0)
				cells.push(this.#getElement(element.row - 1, element.col) as Positioned<CellElement>) // Cell above
			if (element.row < this.grid.length - 1)
				cells.push(this.#getElement(element.row + 1, element.col) as Positioned<CellElement>) // Cell below
		} else {
			// Vertical line connects cells left and right
			if (element.col > 0)
				cells.push(this.#getElement(element.row, element.col - 1) as Positioned<CellElement>) // Cell left
			if (element.col < this.grid[0].length - 1)
				cells.push(this.#getElement(element.row, element.col + 1) as Positioned<CellElement>) // Cell right
		}

		return cells
	}

	getAdjacentLineCount(row: number, col: number): number {
		let count = 0
		// Check all four sides
		const top = this.#getElement(row - 1, col)
		if (top.type === 'hline' && top.state === 'include') count++

		const bottom = this.#getElement(row + 1, col)
		if (bottom.type === 'hline' && bottom.state === 'include') count++

		const left = this.#getElement(row, col - 1)
		if (left.type === 'vline' && left.state === 'include') count++

		const right = this.#getElement(row, col + 1)
		if (right.type === 'vline' && right.state === 'include') count++

		return count
	}

	#updateAdjacentCellCounts = (element: Positioned<LineElement>) => {
		const adjacentCells = this.#getAdjacentCells(element)
		for (const cell of adjacentCells) {
			if (cell.type === 'cell') {
				cell.current = this.getAdjacentLineCount(cell.row, cell.col)
			}
		}
	}

	updateCellCounts() {
		const cellPositions = [
			[1, 1],
			[1, 3],
			[1, 5],
			[3, 1],
			[3, 3],
			[3, 5],
			[5, 1],
			[5, 3],
			[5, 5],
		]

		for (const [row, col] of cellPositions) {
			const cell = this.#getElement(row, col)
			if (cell.type === 'cell') {
				cell.current = this.getAdjacentLineCount(row, col)
			}
		}
	}

	validateNumbers(): boolean {
		const cellPositions = [
			[1, 1],
			[1, 3],
			[1, 5],
			[3, 1],
			[3, 3],
			[3, 5],
			[5, 1],
			[5, 3],
			[5, 5],
		]

		for (const [row, col] of cellPositions) {
			const cell = this.#getElement(row, col)
			if (cell.type !== 'cell' || cell.actual === null) continue

			if (cell.current !== cell.actual) return false
		}
		return true
	}

	validateLoop(): boolean {
		// Find all dots and their connections (dots are at even indices: 0,2,4,6)
		const dots: [number, number, string][][][] = Array(4)
			.fill(undefined)
			.map(() =>
				Array(4)
					.fill(undefined)
					.map(() => [] as [number, number, string][]),
			)

		// Build connections for each dot
		// Map grid positions to dot indices: grid row/col 0,2,4,6 → dot row/col 0,1,2,3
		const gridToDot = (pos: number) => pos / 2

		for (let gridRow = 0; gridRow < this.grid.length; gridRow++) {
			for (let gridCol = 0; gridCol < this.grid[0].length; gridCol++) {
				const element = this.#getElement(gridRow, gridCol)

				if (element.type === 'hline' && element.state === 'include') {
					// Connects dots to the left and right
					const dotRow = gridToDot(gridRow)
					const leftDotCol = gridToDot(gridCol - 1)
					const rightDotCol = gridToDot(gridCol + 1)

					dots[dotRow][leftDotCol].push([dotRow, rightDotCol, 'h'])
					dots[dotRow][rightDotCol].push([dotRow, leftDotCol, 'h'])
				}

				if (element.type === 'vline' && element.state === 'include') {
					// Connects dots above and below
					const dotCol = gridToDot(gridCol)
					const topDotRow = gridToDot(gridRow - 1)
					const bottomDotRow = gridToDot(gridRow + 1)

					dots[topDotRow][dotCol].push([bottomDotRow, dotCol, 'v'])
					dots[bottomDotRow][dotCol].push([topDotRow, dotCol, 'v'])
				}
			}
		}

		// Find dots with connections (should all have exactly 2 for a valid loop)
		let startDot = null
		let totalConnections = 0

		for (let row = 0; row < 4; row++) {
			for (let col = 0; col < 4; col++) {
				const connections = dots[row][col].length
				if (connections > 0) {
					totalConnections += connections
					if (startDot === null) startDot = [row, col]
					if (connections !== 2) return false // Must have exactly 2 connections
				}
			}
		}

		if (totalConnections === 0) return false // No lines drawn
		if (totalConnections % 2 !== 0) return false // Should be even

		// Traverse the loop to ensure it's connected
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const visited = new Set<string>()
		const stack = [startDot]
		let visitedCount = 0

		while (stack.length > 0) {
			const [row, col] = stack.pop()!
			const key = `${row},${col}`
			if (visited.has(key)) continue

			visited.add(key)
			visitedCount++

			for (const [nextRow, nextCol] of dots[row][col]) {
				const nextKey = `${nextRow},${nextCol}`
				if (!visited.has(nextKey)) {
					stack.push([nextRow, nextCol])
				}
			}
		}

		// Check if all connected dots were visited
		let connectedDots = 0
		for (let row = 0; row < 4; row++) {
			for (let col = 0; col < 4; col++) {
				if (dots[row][col].length > 0) connectedDots++
			}
		}

		return visitedCount === connectedDots
	}

	checkSolution() {
		const numbersValid = this.validateNumbers()
		const loopValid = this.validateLoop()

		if (numbersValid && loopValid) {
			this.status = '🎉 Correct! You solved the puzzle!'
		} else if (!numbersValid) {
			this.status = '❌ Numbers are not satisfied. Check the line counts around numbered cells.'
		} else if (!loopValid) {
			this.status = '❌ Lines do not form a single continuous loop.'
		}
	}

	resetGame() {
		// Reset all line states to 'unknown'
		for (let row = 0; row < this.grid.length; row++) {
			for (let col = 0; col < this.grid[0].length; col++) {
				const element = this.#getElement(row, col)
				if (element.type === 'hline' || element.type === 'vline') {
					element.state = 'unknown'
				} else if (element.type === 'cell') {
					element.current = 0
				}
			}
		}
		this.status = 'Game reset - start drawing lines!'
	}

	generatePuzzle(difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
		// For now, just reset to a known solvable puzzle
		// TODO: Implement proper puzzle generation algorithm
		this.grid = this.createInitialGrid(this.#width, this.#height)
		this.status = `New ${difficulty} puzzle generated!`
	}

	solvePuzzle(): boolean {
		// Basic constraint propagation solver
		// TODO: Implement full backtracking solver for complex cases
		let changed = true
		let iterations = 0
		const maxIterations = 100

		while (changed && iterations < maxIterations) {
			changed = false
			iterations++

			// Apply basic rules
			for (let row = 0; row < this.grid.length; row++) {
				for (let col = 0; col < this.grid[0].length; col++) {
					const element = this.#getElement(row, col)
					if (
						(element.type === 'hline' || element.type === 'vline') &&
						element.state === 'unknown'
					) {
						// Check if this line must be included or excluded based on cell constraints
						const mustInclude = this.#mustIncludeLine(element)
						const mustExclude = this.#mustExcludeLine(element)

						if (mustInclude && !mustExclude) {
							element.state = 'include'
							changed = true
						} else if (mustExclude && !mustInclude) {
							element.state = 'exclude'
							changed = true
						}
					}
				}
			}

			if (changed) {
				this.updateCellCounts()
			}
		}

		const isSolved = this.validateNumbers() && this.validateLoop()
		this.status = isSolved ? 'Puzzle solved automatically!' : 'Could not solve puzzle automatically'
		return isSolved
	}

	#mustIncludeLine = (element: Positioned<LineElement>): boolean => {
		// Check if any adjacent cell requires this line to be present
		const adjacentCells = this.#getAdjacentCells(element)
		for (const cell of adjacentCells) {
			if (cell.type === 'cell' && cell.actual !== null) {
				const currentCount = this.getAdjacentLineCount(cell.row, cell.col)
				if (currentCount < cell.actual) {
					// This cell still needs more lines
					return true
				}
			}
		}
		return false
	}

	#mustExcludeLine = (element: Positioned<LineElement>): boolean => {
		// Check if any adjacent cell would exceed its limit if this line is included
		const adjacentCells = this.#getAdjacentCells(element)
		for (const cell of adjacentCells) {
			if (cell.type === 'cell' && cell.actual !== null) {
				const currentCount = this.getAdjacentLineCount(cell.row, cell.col)
				if (currentCount >= cell.actual) {
					// This cell already has enough lines
					return true
				}
			}
		}
		return false
	}

	enhancedCheckSolution() {
		const numbersValid = this.validateNumbers()
		const loopValid = this.validateLoop()

		if (numbersValid && loopValid) {
			this.status = '🎉 Correct! You solved the puzzle!'
		} else if (!numbersValid) {
			this.status = '❌ Numbers are not satisfied. Check the line counts around numbered cells.'
		} else if (!loopValid) {
			this.status = '❌ Lines do not form a single continuous loop.'
		} else {
			this.status = 'Grid loaded - ready to add line drawing functionality'
		}

		return {
			isValid: numbersValid && loopValid,
			numbersSatisfied: numbersValid,
			loopValid: loopValid,
			message: this.status,
		}
	}
}
