<script lang="ts">
	import { resolve } from '$app/paths'

	// 4x4 Slitherlink grid
	let grid = $state([
		[1, null, 2, null],
		[null, 3, null, 1],
		[2, null, null, 3],
		[null, 1, 2, null],
	])

	// Horizontal lines: 4 rows, 5 columns (between cells)
	let horizontalLines = $state(
		Array(4)
			.fill(null)
			.map(() => Array(5).fill(false)),
	)

	// Vertical lines: 5 rows, 4 columns (between cells)
	let verticalLines = $state(
		Array(5)
			.fill(null)
			.map(() => Array(4).fill(false)),
	)

	const toggleHorizontal = (row: number, col: number) => {
		horizontalLines[row][col] = !horizontalLines[row][col]
	}

	const toggleVertical = (row: number, col: number) => {
		verticalLines[row][col] = !verticalLines[row][col]
	}

	const checkNumbers = () => {
		let valid = true
		for (let r = 0; r < 4; r++) {
			for (let c = 0; c < 4; c++) {
				const num = grid[r][c]
				if (num !== null) {
					let count = 0
					if (r > 0 && horizontalLines[r - 1][c]) count++ // top
					if (r < 3 && horizontalLines[r][c]) count++ // bottom
					if (c > 0 && verticalLines[r][c - 1]) count++ // left
					if (c < 3 && verticalLines[r][c]) count++ // right
					if (count !== num) valid = false
				}
			}
		}
		return valid
	}

	const checkLoop = () => {
		// Build adjacency list for 5x5 grid of dots
		const adj: number[][][] = Array(5)
			.fill(null)
			.map(() =>
				Array(5)
					.fill(null)
					.map(() => [] as number[]),
			)

		// Add horizontal edges
		for (let r = 0; r < 4; r++) {
			for (let c = 0; c < 5; c++) {
				if (horizontalLines[r][c]) {
					adj[r][c].push(r * 5 + (c + 1))
					adj[r][c + 1].push(r * 5 + c)
				}
			}
		}

		// Add vertical edges
		for (let r = 0; r < 5; r++) {
			for (let c = 0; c < 4; c++) {
				if (verticalLines[r][c]) {
					adj[r][c].push((r + 1) * 5 + c)
					adj[r + 1][c].push(r * 5 + c)
				}
			}
		}

		// Find connected components and check degrees
		const visited = Array(25).fill(false)
		let components = 0
		let hasCycle = true

		const dfs = (node: number) => {
			visited[node] = true
			const [r, c] = [Math.floor(node / 5), node % 5]
			if (adj[r][c].length !== 2) hasCycle = false
			for (const neighbor of adj[r][c]) {
				if (!visited[neighbor]) dfs(neighbor)
			}
		}

		for (let i = 0; i < 25; i++) {
			if (adj[Math.floor(i / 5)][i % 5].length > 0 && !visited[i]) {
				components++
				dfs(i)
			}
		}

		// Check for isolated lines (nodes with degree 1)
		for (let r = 0; r < 5; r++) {
			for (let c = 0; c < 5; c++) {
				if (adj[r][c].length === 1) hasCycle = false
			}
		}

		return components === 1 && hasCycle
	}

	let status = $state('')
	const checkSolution = () => {
		const numbersValid = checkNumbers()
		const loopValid = checkLoop()
		if (numbersValid && loopValid) {
			status = 'Congratulations! You solved the puzzle!'
		} else if (numbersValid) {
			status = 'Numbers are correct, but the loop is not valid.'
		} else if (loopValid) {
			status = 'Loop is valid, but some numbers are incorrect.'
		} else {
			status = 'Both numbers and loop are incorrect.'
		}
	}

	const reset = () => {
		horizontalLines = Array(4)
			.fill(null)
			.map(() => Array(5).fill(false))
		verticalLines = Array(5)
			.fill(null)
			.map(() => Array(4).fill(false))
		status = ''
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
	<h1 class="mb-8 text-4xl font-bold dark:text-white">Slitherlink</h1>
	<p class="mb-4 text-lg dark:text-white">
		Draw lines to form a loop. Numbers show how many lines surround each cell.
	</p>

	<!-- Grid with lines -->
	<div class="inline-block border-2 border-gray-600 bg-white p-2 dark:bg-gray-800">
		{#each Array(5), row}
			<div class="flex">
				{#each Array(5), col}
					<!-- Dot -->
					<div class="h-2 w-2 rounded-full bg-black"></div>
					<!-- Horizontal line if not last col -->
					{#if col < 4}
						<button
							class="h-2 w-12 bg-gray-200 hover:bg-gray-300 {horizontalLines[row][col]
								? 'bg-black'
								: ''}"
							onclick={() => toggleHorizontal(row, col)}
						></button>
					{/if}
				{/each}
			</div>
			<!-- Vertical lines and cells if not last row -->
			{#if row < 4}
				<div class="flex">
					{#each Array(5), col}
						<!-- Vertical line if not last col -->
						{#if col < 4}
							<button
								class="h-12 w-2 bg-gray-200 hover:bg-gray-300 {verticalLines[row][col]
									? 'bg-black'
									: ''}"
								onclick={() => toggleVertical(row, col)}
							></button>
						{/if}
						<!-- Cell -->
						{#if col < 4}
							<div
								class="flex h-12 w-12 items-center justify-center border border-gray-400 text-lg font-bold"
							>
								{grid[row][col] ?? ''}
							</div>
						{/if}
					{/each}
				</div>
			{/if}
		{/each}
	</div>

	<p class="mt-4 text-lg dark:text-white">{status}</p>
	<div class="mt-4 flex gap-4">
		<button
			onclick={checkSolution}
			class="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">Check Solution</button
		>
		<button onclick={reset} class="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
			>Reset</button
		>
	</div>
	<a href={resolve('/')} class="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
		>Back to Games</a
	>
</div>
