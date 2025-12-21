<script lang="ts">
	import Cell from './Cell.svelte'
	import { FillPixGame } from './fillpix.svelte.ts'

	const game = new FillPixGame(100, 100)
</script>

<div class="flex h-screen flex-col items-center dark:bg-gray-900">
	<h1 class="my-4 text-2xl font-bold dark:text-white">Fill-Pix Puzzle</h1>
	<div class="mb-4 flex gap-2">
		<button
			class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
			onclick={() => game.toggleAutoFillMode()}
		>
			3x3 mode: {game.autoFillMode}
		</button>
		<button
			class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
			onclick={(e) => (e.currentTarget.innerText = String(game.check()))}
		>
			check answer
		</button>
	</div>
	<div class="scrollable-grid w-full flex-1 overflow-auto">
		<div
			class="grid select-none"
			style:grid-template-columns="repeat({game.width}, calc(var(--spacing) * 10))"
			style:min-width="{game.width * 40}px"
			style:min-height="{game.height * 40}px"
		>
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
</div>

<style>
	.scrollable-grid {
		scrollbar-width: thin;
		scrollbar-color: #6b7280 transparent;

		&::-webkit-scrollbar {
			width: 6px;
		}

		&::-webkit-scrollbar-track {
			background: transparent;
		}

		&::-webkit-scrollbar-thumb {
			background: #6b7280;
			border-radius: 3px;

			&:hover {
				background: #9ca3af;
			}
		}
	}
</style>
