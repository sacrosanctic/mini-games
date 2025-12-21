type Generator = (width: number, height: number) => boolean[][]

const rectangle: Generator = (width, height) => {
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

const random: Generator = (width, height) => {
	const map: boolean[][] = []
	for (let r = 0; r < height; r++) {
		map[r] = []
		for (let c = 0; c < width; c++) {
			map[r][c] = Math.random() < 0.25 // 25% chance of being filled
		}
	}
	return map
}

const symmetric: Generator = (width, height) => {
	const map: boolean[][] = []
	for (let r = 0; r < height; r++) {
		map[r] = []
		for (let c = 0; c < width; c++) {
			// Mirror across the center
			const mirrored = c < width / 2 ? Math.random() < 0.3 : (map[r][width - 1 - c] ?? false)
			map[r][c] = mirrored
		}
	}
	return map
}

const diagonal: Generator = (width, height) => {
	const map: boolean[][] = []
	for (let r = 0; r < height; r++) {
		map[r] = []
		for (let c = 0; c < width; c++) {
			map[r][c] = (r + c) % 2 === 0 // Checkerboard pattern
		}
	}
	return map
}

const circles: Generator = (width, height) => {
	const map: boolean[][] = []
	const centerX = width / 2
	const centerY = height / 2
	const radius = Math.min(width, height) / 4
	for (let r = 0; r < height; r++) {
		map[r] = []
		for (let c = 0; c < width; c++) {
			const dist = Math.sqrt((c - centerX) ** 2 + (r - centerY) ** 2)
			map[r][c] = dist < radius
		}
	}
	return map
}

const generatorMap = {
	rectangle,
	random,
	symmetric,
	diagonal,
	circles,
	default: rectangle,
}

export function generateFillPixPuzzle(
	width: number,
	height: number,
	generator: keyof typeof generatorMap,
) {
	return generatorMap[generator](width, height)
}
