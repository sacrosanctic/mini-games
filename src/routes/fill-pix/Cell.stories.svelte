<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf'
	import Component from './Cell.svelte'
	import { Cell } from './fillpix.svelte.ts'

	const { Story } = defineMeta({
		title: 'FillPix/Cell',
		component: Component,
		args: {},
	})
</script>

<Story name="Unmarked" args={{ cell: new Cell({ row: 0, col: 0, value: 1 }) }} />

<Story
	name="Unmarked-light"
	args={{ cell: new Cell({ row: 0, col: 0, value: 1 }) }}
	globals={{ theme: 'light' }}
/>

<Story
	name="Unmarked-dark"
	args={{ cell: new Cell({ row: 0, col: 0, value: 1 }) }}
	globals={{ theme: 'dark' }}
/>
