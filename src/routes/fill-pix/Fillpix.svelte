<script lang="ts">
	import Cell from './Cell.svelte'
	import { FillPixGame } from './fillpix.svelte.ts'

	const game = new FillPixGame()

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

	const dragHandler = new DragHandler()
</script>

<svelte:body onmouseup={() => dragHandler.handleMouseUp()} />

<div class="flex h-screen flex-col items-center p-4 dark:bg-gray-900">
	<h1 class="mb-4 text-2xl font-bold dark:text-white">Fill-Pix Puzzle</h1>
	<div
		class="grid select-none"
		style:grid-template-columns="repeat({game.grid.width}, minmax(0, 1fr))"
	>
		{#each game.grid.cells as row, _r (_r)}
			{#each row as cell, _c (cell.row + '-' + cell.col)}
				<Cell
					{cell}
					filledCount={game.grid.getFilled(cell)}
					onMouseDown={() => dragHandler.handleMouseDown(cell)}
					onMouseEnter={() => dragHandler.handleMouseEnter(cell)}
				/>
			{/each}
		{/each}
	</div>
</div>
