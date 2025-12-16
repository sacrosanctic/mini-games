type GridElement =
	| { type: 'dot' }
	| { type: 'cell'; actual: number | null; current: number }
	| { type: 'hline'; state: 'unknown' | 'include' | 'exclude' }
	| { type: 'vline'; state: 'unknown' | 'include' | 'exclude' }

type Grid = GridElement[][]

export class SlitherlinkGame {
	grid: Grid
	status = $state('Grid loaded - ready to add line drawing functionality')

	constructor(initialGrid?: GridElement[][]) {
		this.grid = $state(initialGrid ?? this.createInitialGrid())
	}

	createInitialGrid(): GridElement[][] {
		return [
			// Row 0: dots and horizontal lines
			[
				{ type: 'dot' },
				{ type: 'hline', state: 'unknown' },
				{ type: 'dot' },
				{ type: 'hline', state: 'unknown' },
				{ type: 'dot' },
				{ type: 'hline', state: 'unknown' },
				{ type: 'dot' },
			],
			// Row 1: vertical lines and cells
			[
				{ type: 'vline', state: 'unknown' },
				{ type: 'cell', actual: 1, current: 0 },
				{ type: 'vline', state: 'unknown' },
				{ type: 'cell', actual: null, current: 0 },
				{ type: 'vline', state: 'unknown' },
				{ type: 'cell', actual: 2, current: 0 },
				{ type: 'vline', state: 'unknown' },
			],
			// Row 2: dots and horizontal lines
			[
				{ type: 'dot' },
				{ type: 'hline', state: 'unknown' },
				{ type: 'dot' },
				{ type: 'hline', state: 'unknown' },
				{ type: 'dot' },
				{ type: 'hline', state: 'unknown' },
				{ type: 'dot' },
			],
			// Row 3: vertical lines and cells
			[
				{ type: 'vline', state: 'unknown' },
				{ type: 'cell', actual: null, current: 0 },
				{ type: 'vline', state: 'unknown' },
				{ type: 'cell', actual: 3, current: 0 },
				{ type: 'vline', state: 'unknown' },
				{ type: 'cell', actual: null, current: 0 },
				{ type: 'vline', state: 'unknown' },
			],
			// Row 4: dots and horizontal lines
			[
				{ type: 'dot' },
				{ type: 'hline', state: 'unknown' },
				{ type: 'dot' },
				{ type: 'hline', state: 'unknown' },
				{ type: 'dot' },
				{ type: 'hline', state: 'unknown' },
				{ type: 'dot' },
			],
			// Row 5: vertical lines and cells
			[
				{ type: 'vline', state: 'unknown' },
				{ type: 'cell', actual: 2, current: 0 },
				{ type: 'vline', state: 'unknown' },
				{ type: 'cell', actual: null, current: 0 },
				{ type: 'vline', state: 'unknown' },
				{ type: 'cell', actual: 1, current: 0 },
				{ type: 'vline', state: 'unknown' },
			],
			// Row 6: dots and horizontal lines
			[
				{ type: 'dot' },
				{ type: 'hline', state: 'unknown' },
				{ type: 'dot' },
				{ type: 'hline', state: 'unknown' },
				{ type: 'dot' },
				{ type: 'hline', state: 'unknown' },
				{ type: 'dot' },
			],
		]
	}

	toggleLine(row: number, col: number, type: 'hline' | 'vline') {
		const element = this.grid[row][col]
		if (element.type === type) {
			element.state =
				element.state === 'unknown'
					? 'include'
					: element.state === 'include'
						? 'exclude'
						: 'unknown'
			this.updateCellCounts()
		}
	}

	getAdjacentLineCount(row: number, col: number): number {
		let count = 0
		// Check all four sides
		const top = this.grid[row - 1][col]
		if (top.type === 'hline' && top.state === 'include') count++

		const bottom = this.grid[row + 1][col]
		if (bottom.type === 'hline' && bottom.state === 'include') count++

		const left = this.grid[row][col - 1]
		if (left.type === 'vline' && left.state === 'include') count++

		const right = this.grid[row][col + 1]
		if (right.type === 'vline' && right.state === 'include') count++

		return count
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
			const cell = this.grid[row][col]
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
			const cell = this.grid[row][col]
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

		for (let gridRow = 0; gridRow < 7; gridRow++) {
			for (let gridCol = 0; gridCol < 7; gridCol++) {
				const element = this.grid[gridRow][gridCol]

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
		for (let row = 0; row < 7; row++) {
			for (let col = 0; col < 7; col++) {
				const element = this.grid[row][col]
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
		this.grid = this.createInitialGrid()
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
			for (let row = 0; row < 7; row++) {
				for (let col = 0; col < 7; col++) {
					const element = this.grid[row][col]
					if (
						(element.type === 'hline' || element.type === 'vline') &&
						element.state === 'unknown'
					) {
						// Check if this line must be included or excluded based on cell constraints
						const mustInclude = this.mustIncludeLine(row, col, element.type)
						const mustExclude = this.mustExcludeLine(row, col, element.type)

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

	private mustIncludeLine(row: number, col: number, type: 'hline' | 'vline'): boolean {
		// Check if any adjacent cell requires this line to be present
		const adjacentCells = this.getAdjacentCells(row, col, type)
		for (const [cellRow, cellCol] of adjacentCells) {
			const cell = this.grid[cellRow][cellCol]
			if (cell.type === 'cell' && cell.actual !== null) {
				const currentCount = this.getAdjacentLineCount(cellRow, cellCol)
				if (currentCount < cell.actual) {
					// This cell still needs more lines
					return true
				}
			}
		}
		return false
	}

	private mustExcludeLine(row: number, col: number, type: 'hline' | 'vline'): boolean {
		// Check if any adjacent cell would exceed its limit if this line is included
		const adjacentCells = this.getAdjacentCells(row, col, type)
		for (const [cellRow, cellCol] of adjacentCells) {
			const cell = this.grid[cellRow][cellCol]
			if (cell.type === 'cell' && cell.actual !== null) {
				const currentCount = this.getAdjacentLineCount(cellRow, cellCol)
				if (currentCount >= cell.actual) {
					// This cell already has enough lines
					return true
				}
			}
		}
		return false
	}

	private getAdjacentCells(row: number, col: number, type: 'hline' | 'vline'): [number, number][] {
		const cells: [number, number][] = []

		if (type === 'hline') {
			// Horizontal line connects cells above and below
			if (row > 0) cells.push([row - 1, col]) // Cell above
			if (row < 6) cells.push([row + 1, col]) // Cell below
		} else {
			// Vertical line connects cells left and right
			if (col > 0) cells.push([row, col - 1]) // Cell left
			if (col < 6) cells.push([row, col + 1]) // Cell right
		}

		return cells
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
