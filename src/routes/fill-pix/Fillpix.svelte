<script lang="ts">
	import { FillPixGame } from './fillpix.svelte.ts'

	const game = new FillPixGame()
</script>

<div class="flex h-screen flex-col items-center p-4 dark:bg-gray-900 dark:text-white">
	<h1 class="mb-4 text-2xl font-bold">Fill-Pix Puzzle</h1>
	<div class="grid gap-1" style="grid-template-columns: repeat({game.grid.width}, minmax(0, 1fr))">
		{#each game.grid.cells as row, _r (_r)}
			{#each row as cell, _c (cell.row + '-' + cell.col)}
				<button
					class={[
						'flex size-10 cursor-pointer items-center justify-center border border-gray-300 text-sm dark:border-gray-600',
						cell.state === 'unmarked' && 'bg-white dark:bg-gray-800',
						cell.state === 'marked' && 'bg-black text-white dark:bg-white dark:text-black',
						cell.state === 'blocked' &&
							'bg-gray-200 text-red-500 dark:bg-gray-700 dark:text-red-400',
						cell.value > 0 && 'font-bold',
					]}
					onclick={() => cell.toggleState()}
				>
					{cell.value > 0 ? cell.value : cell.state === 'blocked' ? 'X' : ''}
				</button>
			{/each}
		{/each}
	</div>
</div>
