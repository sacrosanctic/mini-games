// Assumes rectangular grid
export function getLocalGrid<T>(grid: T[][], x: number, y: number): T[] {
	const height = grid.length
	const width = grid[0]?.length ?? 0
	const cells: T[] = []
	for (let dr = -1; dr <= 1; dr++) {
		for (let dc = -1; dc <= 1; dc++) {
			const nr = x + dr
			const nc = y + dc
			if (nr >= 0 && nr < height && nc >= 0 && nc < width) {
				cells.push(grid[nr][nc])
			}
		}
	}
	return cells
}

export class DragHandler {
	isDragging = $state(false)
	startState = $state('')

	handleMouseDown(cell: { toggleState: () => void; state: string }) {
		this.isDragging = true
		cell.toggleState()
		this.startState = cell.state
	}

	handleMouseEnter(cell: { toggleState: () => void; state: string }) {
		if (this.isDragging) {
			cell.state = this.startState
		}
	}

	handleMouseUp() {
		this.isDragging = false
	}
}
