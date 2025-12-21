<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf'
	import Component from './Cell.svelte'
	import { Cell, FillPixGame } from './fillpix.svelte.ts'

	// Create a sample game and get a cell
	const game = new FillPixGame(3, 3)
	const sampleCell = game.grid.cells[1][1] // Center cell

	const { Story } = defineMeta({
		title: 'FillPix/Cell',
		component: Component,
		tags: ['autodocs'],
		args: {
			cell: sampleCell,
		},
	})
</script>

<Story name="Unmarked" args={{ cell: new Cell({ row: 0, col: 0, value: 1, grid: game.grid }) }} />
