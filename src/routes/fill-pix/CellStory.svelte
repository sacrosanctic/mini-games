<script lang="ts">
	import Cell from './Cell.svelte'
</script>

<div class="grid w-fit grid-cols-6 gap-2">
	{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as hint (hint)}
		{#each [false, true] as isComplete (isComplete)}
			{#each ['unmarked', 'marked', 'blocked'] as const as state (state)}
				<Cell {hint} {state} {isComplete} />
			{/each}
		{/each}
	{/each}
</div>
