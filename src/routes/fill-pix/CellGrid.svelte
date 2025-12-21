<script lang="ts">
	import * as Cell from './Cell.svelte'
</script>

<div class="grid w-fit grid-cols-3 gap-2">
	{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as value}
		{#each ['unmarked', 'marked', 'blocked'] as const as state}
			{@const cell = new Cell.Entity({
				row: 0,
				col: 0,
				value,
				state,
				getMarkedCount: () => 0,
			})}
			<Cell.default {cell} />
		{/each}
	{/each}
</div>
