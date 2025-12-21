<script lang="ts">
	import Cell from './Cell.svelte'
	import { FillPixGame } from './fillpix.svelte.ts'

	const game = new FillPixGame(10, 10)
</script>

<div class="flex h-screen flex-col items-center dark:bg-gray-900">
	<h1 class="my-4 hidden text-2xl font-bold sm:block dark:text-white">Fill-Pix Puzzle</h1>
	<div class="mb-4 flex gap-4 text-white">
		<button class=" flex" onclick={() => game.toggleAutoFillMode()} aria-label="undo">
			<span class="icon-[mdi--undo] size-8"></span>
			<span class="hidden sm:inline">undo</span>
		</button>
		<button class="" onclick={() => game.toggleAutoFillMode()} aria-label="redo">
			<span class="icon-[mdi--redo] size-8"></span>
			<span class="hidden sm:inline">redo</span>
		</button>

		<button class="" onclick={() => game.toggleAutoFillMode()} aria-label="grid">
			<span class="icon-[mdi--grid] size-8"></span>
			<span class="hidden sm:inline">grid</span>
		</button>
		<button
			class=""
			onclick={(e) => (e.currentTarget.innerText = String(game.check()))}
			aria-label="check"
		>
			<span class="icon-[mdi--check] size-8"></span>
			<span class="hidden sm:inline">check</span>
		</button>
	</div>
	<div class="scrollable-grid w-full flex-1 overflow-auto">
		<div
			class="grid justify-center select-none"
			style:grid-template-columns="repeat({game.width}, calc(var(--spacing) * 10))"
			style:min-width="{game.width * 40}px"
			style:min-height="{game.height * 40}px"
		>
			{#each game.grid as row (row)}
				{#each row as cell (cell)}
					<Cell {cell} onclick={() => game.handleCellClick(cell)} />
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
