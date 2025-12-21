<script lang="ts">
	import Cell from './Cell.svelte'
	import { FillPixGame } from './fillpix.svelte.ts'

	const game = new FillPixGame()
</script>

<div class="flex h-screen flex-col items-center p-4 dark:bg-gray-900">
	<h1 class="mb-4 text-2xl font-bold dark:text-white">Fill-Pix Puzzle</h1>
	<div class="grid" style="grid-template-columns: repeat({game.grid.width}, minmax(0, 1fr))">
		{#each game.grid.cells as row, _r (_r)}
			{#each row as cell, _c (cell.row + '-' + cell.col)}
				<Cell {cell} filledCount={game.grid.getFilled(cell)} />
			{/each}
		{/each}
	</div>
</div>
