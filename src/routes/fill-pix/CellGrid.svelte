<script lang="ts">
	import Cell from './Cell.svelte'
	import { Cell as CellClass } from './fillpix.svelte.ts'
</script>

<div class="grid grid-cols-3 gap-2">
	{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as value}
		{@const unmarked = new CellClass({
			row: 0,
			col: 0,
			value,
			state: 'unmarked',
			getMarkedCount: (cell) => 0,
		})}
		{@const marked = new CellClass({
			row: 0,
			col: 0,
			value,
			state: 'marked',
			getMarkedCount: (cell) => 0,
		})}
		{@const blocked = new CellClass({
			row: 0,
			col: 0,
			value,
			state: 'blocked',
			getMarkedCount: (cell) => 0,
		})}

		<Cell cell={unmarked} />
		<Cell cell={marked} />
		<Cell cell={blocked} />
	{/each}
</div>
