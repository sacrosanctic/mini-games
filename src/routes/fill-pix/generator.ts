type Generator = (width: number, height: number) => boolean[][]

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

const generatorMap = {
	random,
	default: random,
}

export function generateFillPixPuzzle(
	width: number,
	height: number,
	generator: keyof typeof generatorMap,
) {
	return generatorMap[generator](width, height)
}
