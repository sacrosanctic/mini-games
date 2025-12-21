<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf'
	import component from './CellGrid.svelte'

	const { Story } = defineMeta({
		title: 'FillPix/Cell',
		component,
	})
</script>

<Story name="Cell" />
