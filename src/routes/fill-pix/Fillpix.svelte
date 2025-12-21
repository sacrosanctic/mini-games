<script lang="ts">
	import Cell from './Cell.svelte'
	import { FillPixGame } from './fillpix.svelte.ts'

	const game = new FillPixGame(10, 10)
	game

	class DragHandler {
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
</script>

<div class="flex h-screen flex-col items-center p-4 dark:bg-gray-900">
	<h1 class="mb-4 text-2xl font-bold dark:text-white">Fill-Pix Puzzle</h1>
	<div class="mb-4 flex gap-2">
		<button
			class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
			onclick={() => game.toggleAutoFillMode()}
		>
			3x3 mode: {game.autoFillMode}
		</button>
	</div>
	<div class="grid select-none" style:grid-template-columns="repeat({game.width}, minmax(0, 1fr))">
		{#each game.grid as row (row)}
			{#each row as cell (cell)}
				<Cell
					{cell}
					filledCount={game.getFilled(cell)}
					onclick={() => game.handleCellClick(cell)}
				/>
			{/each}
		{/each}
	</div>
</div>
