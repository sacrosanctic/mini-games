<script lang="ts">
	import { FillPixGame } from './fillpix.svelte'

	const game = new FillPixGame()
</script>

<div class="fillpix-game">
	<h1>Fill-Pix Puzzle</h1>
	<div class="grid" style:--grid-cols={game.grid.width}>
		{#each game.grid.cells as row (row)}
			{#each row as cell (cell)}
				<button class={['cell', cell.isFilled && 'filled']} onclick={() => cell.toggleFill()}>
					{cell.value > 0 ? cell.value : ''}
				</button>
			{/each}
		{/each}
	</div>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(var(--grid-cols), 1fr);
		gap: 1px;
	}

	.cell {
		width: 40px;
		height: 40px;
		border: 1px solid #ccc;
		background: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		cursor: pointer;
	}

	.cell.filled {
		background: black;
		color: white;
	}

	.cell.clue {
		font-weight: bold;
	}
</style>
