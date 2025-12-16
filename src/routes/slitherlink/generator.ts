export enum Difficulty {
	BEGINNER = 'beginner',
	EASY = 'easy',
	MEDIUM = 'medium',
	HARD = 'hard',
	EXPERT = 'expert',
}

export interface SimpleSlitherlinkPuzzle {
	width: number
	height: number
	difficulty: Difficulty
	solution: {
		horizontalLines: boolean[][] // [gridRow][gridCol] = true if part of the loop
		verticalLines: boolean[][] // [gridRow][gridCol] = true if part of the loop
	}
	cellNumbers: number[][] // All numbers calculated from solution
}

function generateValidLoop(
	width: number,
	height: number,
	difficulty: Difficulty,
): SimpleSlitherlinkPuzzle['solution'] {
	switch (difficulty) {
		case Difficulty.BEGINNER:
			return generateSimpleRectangle(width, height)
		case Difficulty.EASY:
			return generateRectangleWithBranch(width, height)
		case Difficulty.MEDIUM:
			return generateMultipleBranches(width, height)
		case Difficulty.HARD:
			return generateComplexIntersections(width, height)
		case Difficulty.EXPERT:
			return generateHighlyConstrainedLoop(width, height)
		default:
			return generateSimpleRectangle(width, height)
	}
}

function generateSimpleRectangle(
	width: number,
	height: number,
): SimpleSlitherlinkPuzzle['solution'] {
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

function generateRectangleWithBranch(
	width: number,
	height: number,
): SimpleSlitherlinkPuzzle['solution'] {
	const solution = generateSimpleRectangle(width, height)

	// Add a simple branch - a small protrusion from the rectangle
	if (width >= 3 && height >= 3) {
		// Add a small L-shaped branch in the middle
		const midRow = Math.floor(height / 2) * 2 + 1
		const midCol = Math.floor(width / 2) * 2 + 1

		// Add horizontal branch
		if (midCol + 2 < solution.horizontalLines[0].length) {
			solution.horizontalLines[midRow][midCol + 1] = true
			solution.horizontalLines[midRow][midCol + 3] = true
		}

		// Add vertical connection
		if (midRow + 2 < solution.verticalLines.length) {
			solution.verticalLines[midRow + 1][midCol + 2] = true
			solution.verticalLines[midRow + 2][midCol + 2] = true
		}
	}

	return solution
}

function generateMultipleBranches(
	width: number,
	height: number,
): SimpleSlitherlinkPuzzle['solution'] {
	const solution = generateSimpleRectangle(width, height)

	// Add multiple branches for more complexity
	if (width >= 4 && height >= 4) {
		// Add branches on different sides
		const positions = [
			{ row: 1, col: Math.floor(width / 3) * 2 + 1 }, // Top side branch
			{ row: height - 2, col: Math.floor((width * 2) / 3) * 2 + 1 }, // Bottom side branch
		]

		for (const pos of positions) {
			const gridRow = pos.row * 2 + 1
			const gridCol = pos.col

			if (gridCol + 2 < solution.horizontalLines[0].length) {
				solution.horizontalLines[gridRow][gridCol + 1] = true
				solution.horizontalLines[gridRow][gridCol + 3] = true
				solution.verticalLines[gridRow + 1][gridCol + 2] = true
				solution.verticalLines[gridRow + 2][gridCol + 2] = true
			}
		}
	}

	return solution
}

function generateComplexIntersections(
	width: number,
	height: number,
): SimpleSlitherlinkPuzzle['solution'] {
	const solution = generateSimpleRectangle(width, height)

	// Create intersecting branches that form more complex patterns
	if (width >= 5 && height >= 5) {
		// Create a cross-shaped pattern in the center
		const centerRow = Math.floor(height / 2) * 2 + 1
		const centerCol = Math.floor(width / 2) * 2 + 1

		// Horizontal crossbar
		for (let col = centerCol - 2; col <= centerCol + 2; col += 2) {
			if (col >= 1 && col < solution.horizontalLines[0].length - 1) {
				solution.horizontalLines[centerRow][col] = true
			}
		}

		// Vertical crossbar
		for (let row = centerRow - 2; row <= centerRow + 2; row += 2) {
			if (row >= 1 && row < solution.verticalLines.length - 1) {
				solution.verticalLines[row][centerCol] = true
			}
		}

		// Add diagonal connections to create loops
		if (
			centerRow + 2 < solution.verticalLines.length &&
			centerCol + 2 < solution.verticalLines[0].length
		) {
			solution.verticalLines[centerRow + 1][centerCol + 2] = true
			solution.horizontalLines[centerRow + 2][centerCol + 1] = true
		}
	}

	return solution
}

function generateHighlyConstrainedLoop(
	width: number,
	height: number,
): SimpleSlitherlinkPuzzle['solution'] {
	const solution = generateSimpleRectangle(width, height)

	// Create a very complex pattern with multiple loops and branches
	if (width >= 6 && height >= 6) {
		// Add multiple interconnected loops
		const patterns = [
			// Inner rectangle
			{ startRow: 2, startCol: 2, w: width - 4, h: height - 4 },
			// Offset cross pattern
			{ startRow: 1, startCol: 4, w: width - 6, h: height - 2 },
		]

		for (const pattern of patterns) {
			const endRow = pattern.startRow + pattern.h
			const endCol = pattern.startCol + pattern.w

			// Top
			for (let col = pattern.startCol; col < endCol; col++) {
				const gridCol = col * 2 + 1
				if (gridCol < solution.horizontalLines[0].length) {
					solution.horizontalLines[pattern.startRow * 2][gridCol] = true
				}
			}

			// Right
			for (let row = pattern.startRow; row < endRow; row++) {
				const gridRow = row * 2 + 1
				const gridCol = endCol * 2
				if (gridRow < solution.verticalLines.length && gridCol < solution.verticalLines[0].length) {
					solution.verticalLines[gridRow][gridCol] = true
				}
			}

			// Bottom
			for (let col = endCol - 1; col >= pattern.startCol; col--) {
				const gridCol = col * 2 + 1
				const gridRow = endRow * 2
				if (
					gridRow < solution.horizontalLines.length &&
					gridCol < solution.horizontalLines[0].length
				) {
					solution.horizontalLines[gridRow][gridCol] = true
				}
			}

			// Left
			for (let row = endRow - 1; row >= pattern.startRow; row--) {
				const gridRow = row * 2 + 1
				const gridCol = pattern.startCol * 2
				if (gridRow < solution.verticalLines.length && gridCol < solution.verticalLines[0].length) {
					solution.verticalLines[gridRow][gridCol] = true
				}
			}
		}
	}

	return solution
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
	// Hard coded to medium difficulty for now
	const difficulty = Difficulty.MEDIUM

	// Generate a valid solution loop based on difficulty
	const solution = generateValidLoop(width, height, difficulty)

	// Calculate all cell numbers from the solution
	const cellNumbers = calculateAllCellNumbers(solution, width, height)

	return { width, height, difficulty, solution, cellNumbers }
}
