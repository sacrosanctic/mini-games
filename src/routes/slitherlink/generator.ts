export interface SimpleSlitherlinkPuzzle {
	width: number
	height: number
	solution: {
		horizontalLines: boolean[][] // [gridRow][gridCol] = true if part of the loop
		verticalLines: boolean[][] // [gridRow][gridCol] = true if part of the loop
	}
	cellNumbers: number[][] // All numbers calculated from solution
}

function generateValidLoop(width: number, height: number): SimpleSlitherlinkPuzzle['solution'] {
	// Initialize empty solution
	const horizontalLines: boolean[][] = []
	const verticalLines: boolean[][] = []

	// Create grid with proper dimensions: (2*height+1) x (2*width+1)
	const gridRows = 2 * height + 1
	const gridCols = 2 * width + 1

	for (let row = 0; row < gridRows; row++) {
		horizontalLines[row] = new Array(gridCols).fill(false)
		verticalLines[row] = new Array(gridCols).fill(false)
	}

	// Create a simple rectangular loop around the perimeter
	// This guarantees a single closed loop

	// Top edge: horizontal lines
	for (let col = 1; col < gridCols - 1; col += 2) {
		horizontalLines[0][col] = true
	}

	// Right edge: vertical lines
	for (let row = 1; row < gridRows - 1; row += 2) {
		verticalLines[row][gridCols - 1] = true
	}

	// Bottom edge: horizontal lines
	for (let col = gridCols - 2; col > 0; col -= 2) {
		horizontalLines[gridRows - 1][col] = true
	}

	// Left edge: vertical lines
	for (let row = gridRows - 2; row > 0; row -= 2) {
		verticalLines[row][0] = true
	}

	return { horizontalLines, verticalLines }
}

function calculateAllCellNumbers(
	solution: SimpleSlitherlinkPuzzle['solution'],
	width: number,
	height: number,
): number[][] {
	const cellNumbers: number[][] = []

	for (let cellRow = 0; cellRow < height; cellRow++) {
		cellNumbers[cellRow] = []
		for (let cellCol = 0; cellCol < width; cellCol++) {
			// Count how many sides of this cell are part of the solution
			let count = 0

			// Check top side (horizontal line above the cell)
			const topLineRow = cellRow * 2
			const topLineCol = cellCol * 2 + 1
			if (solution.horizontalLines[topLineRow][topLineCol]) count++

			// Check bottom side (horizontal line below the cell)
			const bottomLineRow = cellRow * 2 + 2
			const bottomLineCol = cellCol * 2 + 1
			if (solution.horizontalLines[bottomLineRow][bottomLineCol]) count++

			// Check left side (vertical line left of the cell)
			const leftLineRow = cellRow * 2 + 1
			const leftLineCol = cellCol * 2
			if (solution.verticalLines[leftLineRow][leftLineCol]) count++

			// Check right side (vertical line right of the cell)
			const rightLineRow = cellRow * 2 + 1
			const rightLineCol = cellCol * 2 + 2
			if (solution.verticalLines[rightLineRow][rightLineCol]) count++

			cellNumbers[cellRow][cellCol] = count
		}
	}

	return cellNumbers
}

export function generateSlitherlinkPuzzle(width: number, height: number): SimpleSlitherlinkPuzzle {
	// Phase 1: Generate a valid solution loop
	const solution = generateValidLoop(width, height)

	// Calculate all cell numbers from the solution
	const cellNumbers = calculateAllCellNumbers(solution, width, height)

	return { width, height, solution, cellNumbers }
}
