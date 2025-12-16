<script lang="ts">
	import { resolve } from '$app/paths'

	type GridElement =
		| { type: 'dot' }
		| { type: 'cell'; number: number | null }
		| { type: 'hline'; state: 'none' | 'gray' | 'black' }
		| { type: 'vline'; state: 'none' | 'gray' | 'black' }

	// 7x7 unified grid for 3x3 Slitherlink
	let grid = $state<GridElement[][]>([
		// Row 0: dots and horizontal lines
		[
			{ type: 'dot' },
			{ type: 'hline', state: 'none' },
			{ type: 'dot' },
			{ type: 'hline', state: 'none' },
			{ type: 'dot' },
			{ type: 'hline', state: 'none' },
			{ type: 'dot' },
		],
		// Row 1: vertical lines and cells
		[
			{ type: 'vline', state: 'none' },
			{ type: 'cell', number: 1 },
			{ type: 'vline', state: 'none' },
			{ type: 'cell', number: null },
			{ type: 'vline', state: 'none' },
			{ type: 'cell', number: 2 },
			{ type: 'vline', state: 'none' },
		],
		// Row 2: dots and horizontal lines
		[
			{ type: 'dot' },
			{ type: 'hline', state: 'none' },
			{ type: 'dot' },
			{ type: 'hline', state: 'none' },
			{ type: 'dot' },
			{ type: 'hline', state: 'none' },
			{ type: 'dot' },
		],
		// Row 3: vertical lines and cells
		[
			{ type: 'vline', state: 'none' },
			{ type: 'cell', number: null },
			{ type: 'vline', state: 'none' },
			{ type: 'cell', number: 3 },
			{ type: 'vline', state: 'none' },
			{ type: 'cell', number: null },
			{ type: 'vline', state: 'none' },
		],
		// Row 4: dots and horizontal lines
		[
			{ type: 'dot' },
			{ type: 'hline', state: 'none' },
			{ type: 'dot' },
			{ type: 'hline', state: 'none' },
			{ type: 'dot' },
			{ type: 'hline', state: 'none' },
			{ type: 'dot' },
		],
		// Row 5: vertical lines and cells
		[
			{ type: 'vline', state: 'none' },
			{ type: 'cell', number: 2 },
			{ type: 'vline', state: 'none' },
			{ type: 'cell', number: null },
			{ type: 'vline', state: 'none' },
			{ type: 'cell', number: 1 },
			{ type: 'vline', state: 'none' },
		],
		// Row 6: dots and horizontal lines
		[
			{ type: 'dot' },
			{ type: 'hline', state: 'none' },
			{ type: 'dot' },
			{ type: 'hline', state: 'none' },
			{ type: 'dot' },
			{ type: 'hline', state: 'none' },
			{ type: 'dot' },
		],
	])

	let status = $state('Grid loaded - ready to add line drawing functionality')

	function toggleHorizontalLine(row: number, col: number) {
		const element = grid[row][col]
		if (element.type === 'hline') {
			element.state =
				element.state === 'none' ? 'gray' : element.state === 'gray' ? 'black' : 'none'
		}
	}

	function toggleVerticalLine(row: number, col: number) {
		const element = grid[row][col]
		if (element.type === 'vline') {
			element.state =
				element.state === 'none' ? 'gray' : element.state === 'gray' ? 'black' : 'none'
		}
	}

	function validateNumbers(): boolean {
		// Check all cells at odd positions: (1,1), (1,3), (1,5), (3,1), (3,3), (3,5), (5,1), (5,3), (5,5)
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
			const cell = grid[row][col]
			if (cell.type !== 'cell' || cell.number === null) continue

			let adjacentLines = 0

			// Check all four sides
			const top = grid[row - 1][col]
			if (top.type === 'hline' && top.state === 'black') adjacentLines++

			const bottom = grid[row + 1][col]
			if (bottom.type === 'hline' && bottom.state === 'black') adjacentLines++

			const left = grid[row][col - 1]
			if (left.type === 'vline' && left.state === 'black') adjacentLines++

			const right = grid[row][col + 1]
			if (right.type === 'vline' && right.state === 'black') adjacentLines++

			if (adjacentLines !== cell.number) return false
		}
		return true
	}

	function validateLoop(): boolean {
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
				const element = grid[gridRow][gridCol]

				if (element.type === 'hline' && element.state === 'black') {
					// Connects dots to the left and right
					const dotRow = gridToDot(gridRow)
					const leftDotCol = gridToDot(gridCol - 1)
					const rightDotCol = gridToDot(gridCol + 1)

					dots[dotRow][leftDotCol].push([dotRow, rightDotCol, 'h'])
					dots[dotRow][rightDotCol].push([dotRow, leftDotCol, 'h'])
				}

				if (element.type === 'vline' && element.state === 'black') {
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

	function checkSolution() {
		const numbersValid = validateNumbers()
		const loopValid = validateLoop()

		if (numbersValid && loopValid) {
			status = '🎉 Correct! You solved the puzzle!'
		} else if (!numbersValid) {
			status = '❌ Numbers are not satisfied. Check the line counts around numbered cells.'
		} else if (!loopValid) {
			status = '❌ Lines do not form a single continuous loop.'
		}
	}

	function resetGame() {
		// Reset all line states to 'none'
		for (let row = 0; row < 7; row++) {
			for (let col = 0; col < 7; col++) {
				const element = grid[row][col]
				if (element.type === 'hline' || element.type === 'vline') {
					element.state = 'none'
				}
			}
		}
		status = 'Game reset - start drawing lines!'
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
	<h1 class="mb-8 text-4xl font-bold dark:text-white">Slitherlink</h1>
	<p class="mb-4 text-lg dark:text-white">
		Draw lines to form a loop. Numbers show how many lines surround each cell.
	</p>

	<!-- Slitherlink Grid -->
	<div class="inline-block border-2 border-gray-600 bg-white p-4 dark:bg-gray-800">
		<div
			class="grid gap-0"
			style="grid-template-columns: 16px 32px 16px 32px 16px 32px 16px ; grid-template-rows: 16px 32px 16px 32px 16px 32px 16px;"
		>
			{#each grid as row, rowIndex (rowIndex)}
				{#each row as element, colIndex (colIndex)}
					<div class="flex items-center justify-center">
						{#if element.type === 'dot'}
							<div class="h-2 w-2 rounded-full bg-gray-800 dark:bg-gray-200"></div>
						{:else if element.type === 'cell'}
							{#if element.number !== null}
								<span class="text-lg font-bold text-blue-600 dark:text-blue-400">
									{element.number}
								</span>
							{/if}
						{:else if element.type === 'hline'}
							<div
								class={[
									'h-2 w-full cursor-pointer',
									element.state === 'black' && 'bg-black',
									element.state === 'gray' && 'bg-gray-400',
									element.state === 'none' && 'hover:bg-gray-300',
								]}
								onclick={() => toggleHorizontalLine(rowIndex, colIndex)}
								onkeydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										toggleHorizontalLine(rowIndex, colIndex)
										e.preventDefault()
									}
								}}
								role="button"
								tabindex="0"
							></div>
						{:else if element.type === 'vline'}
							<div
								class={[
									'h-full w-2 cursor-pointer',
									element.state === 'black' && 'bg-black',
									element.state === 'gray' && 'bg-gray-400',
									element.state === 'none' && 'hover:bg-gray-300',
								]}
								onclick={() => toggleVerticalLine(rowIndex, colIndex)}
								onkeydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										toggleVerticalLine(rowIndex, colIndex)
										e.preventDefault()
									}
								}}
								role="button"
								tabindex="0"
							></div>
						{/if}
					</div>
				{/each}
			{/each}
		</div>
	</div>

	<div class="mt-4 flex gap-4">
		<button
			class="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
			onclick={checkSolution}
		>
			Check Solution
		</button>
		<button class="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600" onclick={resetGame}>
			Reset
		</button>
	</div>

	<p class="mt-4 text-lg dark:text-white">{status}</p>
	<a href={resolve('/')} class="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
		>Back to Games</a
	>
</div>
