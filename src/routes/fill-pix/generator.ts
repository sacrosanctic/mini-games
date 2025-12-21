import { getLocalGrid } from './utils'

type Puzzle = boolean[][]

function generateRandomMap(width: number, height: number): boolean[][] {
	const map: boolean[][] = []
	for (let r = 0; r < height; r++) {
		map[r] = []
		for (let c = 0; c < width; c++) {
			map[r][c] = Math.random() < 0.25 // 25% chance of being filled
		}
	}
	return map
}

function calculateHints(map: boolean[][]): number[][] {
	const height = map.length
	const width = map[0].length
	const hints: number[][] = []
	for (let r = 0; r < height; r++) {
		hints[r] = []
		for (let c = 0; c < width; c++) {
			hints[r][c] = getLocalGrid(map, r, c).filter((cell) => cell).length
		}
	}
	return hints
}

function calculateTotalCells(width: number, height: number): number[][] {
	const totalCells: number[][] = []
	for (let r = 0; r < height; r++) {
		totalCells[r] = []
		for (let c = 0; c < width; c++) {
			const minR = Math.max(0, r - 1)
			const maxR = Math.min(height - 1, r + 1)
			const minC = Math.max(0, c - 1)
			const maxC = Math.min(width - 1, c + 1)
			totalCells[r][c] = (maxR - minR + 1) * (maxC - minC + 1)
		}
	}
	return totalCells
}

// DO NOT RENAME THIS EXPORT
export function generateFillPixPuzzle(width: number, height: number): Puzzle {
	const map = generateRandomMap(width, height)
	const hints = calculateHints(map)
	const totalCells = calculateTotalCells(width, height)
	const visibleHints: { row: number; col: number }[] = []

	// Stage 1: add hints that can be filled without thinking aka hint=totalCells
	for (let r = 0; r < height; r++) {
		for (let c = 0; c < width; c++) {
			if (hints[r][c] === totalCells[r][c]) {
				visibleHints.push({ row: r, col: c })
			}
		}
	}

	// Stage 2: every hint added here can be derived from hint===marked
	// For now, interpret as adding hints where hint == number of filled cells in neighborhood
	// But since hint is that, this would add all. Perhaps add cells not in stage 1 with hint > 0
	// To match "derived from hint===marked", perhaps add hints for unfilled cells where hint == number of filled neighbors
	for (let r = 0; r < height; r++) {
		for (let c = 0; c < width; c++) {
			if (!visibleHints.some((h) => h.row === r && h.col === c)) {
				const filledInNeighborhood = getLocalGrid(map, r, c).filter((cell) => cell).length
				if (hints[r][c] === filledInNeighborhood) {
					visibleHints.push({ row: r, col: c })
				}
			}
		}
	}

	// Stage 3: every cell should either have a hint or its neighbour has a hint
	const hasHintOrNeighbor = new Set<string>()
	for (const hint of visibleHints) {
		hasHintOrNeighbor.add(`${hint.row},${hint.col}`)
		for (let dr = -1; dr <= 1; dr++) {
			for (let dc = -1; dc <= 1; dc++) {
				const nr = hint.row + dr
				const nc = hint.col + dc
				if (nr >= 0 && nr < height && nc >= 0 && nc < width) {
					hasHintOrNeighbor.add(`${nr},${nc}`)
				}
			}
		}
	}
	for (let r = 0; r < height; r++) {
		for (let c = 0; c < width; c++) {
			if (!hasHintOrNeighbor.has(`${r},${c}`)) {
				visibleHints.push({ row: r, col: c })
			}
		}
	}

	return map
}
