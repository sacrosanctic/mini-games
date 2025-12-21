export interface FillPixPuzzle {
	width: number
	height: number
	map: boolean[][]
}

export function generateFillPixPuzzle(width: number, height: number): FillPixPuzzle {
	// Generate a simple rectangular pattern in the center
	const map: boolean[][] = []

	for (let r = 0; r < height; r++) {
		map[r] = []
		for (let c = 0; c < width; c++) {
			// Create a filled rectangle in the center area
			const margin = Math.min(width, height) / 4
			const filled = r >= margin && r < height - margin && c >= margin && c < width - margin
			map[r][c] = filled
		}
	}

	return { width, height, map }
}
