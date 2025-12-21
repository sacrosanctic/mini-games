<script lang="ts">
	import * as Cell from './Cell.svelte'
</script>

<div class="grid w-fit grid-cols-6 gap-2">
	{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as value}
		{#each ['unmarked', 'marked', 'blocked'] as const as state}
			{#each [0, 9] as markedCount}
				<Cell.default cell={{ row: 0, col: 0, value, state, markedCount, toggleState: () => {} }} />
			{/each}
		{/each}
	{/each}
</div>
