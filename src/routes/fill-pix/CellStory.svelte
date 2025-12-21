<script lang="ts">
	import * as Cell from './Cell.svelte'
</script>

<div class="grid w-fit grid-cols-6 gap-2">
	{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as hint (hint)}
		{#each [0, 9] as filledCount (filledCount)}
			{#each ['unmarked', 'marked', 'blocked'] as const as state (state)}
				<Cell.default
					cell={new Cell.Entity({
						row: 0,
						col: 0,
						hint,
						state,
					})}
					{filledCount}
				/>
			{/each}
		{/each}
	{/each}
</div>
