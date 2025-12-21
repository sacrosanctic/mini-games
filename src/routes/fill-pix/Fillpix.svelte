<script lang="ts">
	import Cell from './Cell.svelte'
	import { FillPixGame } from './fillpix.svelte.ts'

	const game = new FillPixGame(10, 10)
</script>

<div class="flex h-screen flex-col-reverse items-center sm:flex-col dark:bg-gray-900">
	<h1 class="my-4 hidden text-2xl font-bold sm:block dark:text-white">Fill-Pix Puzzle</h1>
	<div class="mb-4 flex gap-8 text-white sm:gap-4">
		<button
			class="flex cursor-pointer items-center gap-1"
			disabled={!game.canUndo}
			onclick={() => game.undo()}
			aria-label="undo"
		>
			<span class="icon-[mdi--undo] size-8"></span>
			<span class="hidden sm:inline">undo</span>
		</button>
		<button
			class="flex cursor-pointer items-center gap-1"
			disabled={!game.canRedo}
			onclick={() => game.redo()}
			aria-label="redo"
		>
			<span class="icon-[mdi--redo] size-8"></span>
			<span class="hidden sm:inline">redo</span>
		</button>

		<button
			class={[
				'flex cursor-pointer items-center gap-1 dark:text-gray-400',
				game.autoFillMode && 'rounded-xs outline-1 outline-offset-4 outline-white dark:text-white',
			]}
			onclick={() => game.toggleAutoFillMode()}
			aria-label="grid"
			data-active={game.autoFillMode}
		>
			<span class="icon-[mdi--grid] size-8"></span>
			<span class="hidden sm:inline">grid</span>
		</button>
		<button
			class="flex cursor-pointer items-center gap-1"
			onclick={(e) => (e.currentTarget.innerText = String(game.check()))}
			aria-label="check"
		>
			<span class="icon-[mdi--check] size-8"></span>
			<span class="hidden sm:inline">check</span>
		</button>
	</div>
	<div
		class={[
			'scrollable-grid w-full flex-1  overflow-auto ',
			'grid place-items-center',
			'sm:block sm:[place-items:normal]',
		]}
	>
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
