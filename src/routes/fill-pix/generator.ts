type Puzzle = boolean[][]

export function generateFillPixPuzzle(width: number, height: number): Puzzle {
	const map: boolean[][] = Array.from({ length: height }).map(() => Array(width).fill(false))

	// Stage 1: Seed grid with random true values
	const seedPercentage = 0.2 // 20% of cells
	const numSeeds = Math.floor(width * height * seedPercentage)
	const allPositions: { r: number; c: number }[] = []
	for (let r = 0; r < height; r++) {
		for (let c = 0; c < width; c++) {
			allPositions.push({ r, c })
		}
	}
	// Shuffle and select seeds
	for (let i = allPositions.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]]
	}
	for (let i = 0; i < numSeeds; i++) {
		const { r, c } = allPositions[i]
		map[r][c] = true
	}

	// Stage 2: Find 4 cells and max out their neighbors so that the hint value is === to totalLocalCells
	const numClueCells = 4
	const selectedCells: { r: number; c: number }[] = []
	// Randomly select 4 cells
	for (let i = 0; i < numClueCells; i++) {
		const r = Math.floor(Math.random() * height)
		const c = Math.floor(Math.random() * width)
		selectedCells.push({ r, c })
	}
	for (const { r, c } of selectedCells) {
		// Max out the 3x3 neighborhood
		for (let dr = -1; dr <= 1; dr++) {
			for (let dc = -1; dc <= 1; dc++) {
				const nr = r + dr
				const nc = c + dc
				if (nr >= 0 && nr < height && nc >= 0 && nc < width) {
					map[nr][nc] = true
				}
			}
		}
	}

	return map
}
