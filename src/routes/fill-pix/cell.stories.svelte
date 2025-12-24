<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf'
	import Cell from './cell.svelte'
	import { fn } from 'storybook/test'

	const { Story } = defineMeta({
		title: 'FillPix/Cell',
		component: Cell,
		args: {
			onclick: fn(),
			state: {
				control: { type: 'select' },
				options: ['unmarked', 'marked', 'blocked'],
			},
		},
	})
</script>

<Story name="Cell">
	{#snippet template(args)}
		<div class="grid w-fit grid-cols-6 gap-2">
			<!-- https://github.com/theetrain/svelte-cartesian/tree/main?tab=readme-ov-file#before-using-svelte-cartesian -->
			<!-- reduce loops -->
			{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as hint (hint)}
				{#each [false, true] as isComplete (isComplete)}
					{#each ['unmarked', 'marked', 'blocked'] as const as state (state)}
						<Cell {...args} {hint} {state} {isComplete} />
					{/each}
				{/each}
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="Cell2" />
