<script lang="ts">
	import * as Cell from './Cell.svelte'
</script>

<div class="grid w-fit grid-cols-6 gap-2">
	{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as hint (hint)}
		{#each [false, true] as shouldFill (shouldFill)}
			{#each ['unmarked', 'marked', 'blocked'] as const as state (state)}
				{@const cell = new Cell.Entity({
					y: 0,
					x: 0,
					shouldFill,
					state,
				})}
				<Cell.default {cell} />
			{/each}
		{/each}
	{/each}
</div>
