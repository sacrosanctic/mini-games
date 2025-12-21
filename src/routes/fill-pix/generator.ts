type Algo = (width: number, height: number) => boolean[][]

const name: Algo = (width, height) => {
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
	return map
}

const algoMap = {
	default: name,
}

export function generateFillPixPuzzle(width: number, height: number, algo: keyof typeof algoMap) {
	return (algoMap[algo] ?? name)(width, height)
}
