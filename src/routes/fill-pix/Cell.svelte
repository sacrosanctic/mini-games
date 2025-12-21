<script lang="ts">
	import type { Cell } from './fillpix.svelte.ts'

	interface Props {
		cell: Cell
	}

	let { cell }: Props = $props()
</script>

<button
	class={[
		'relative flex size-10 cursor-pointer items-center justify-center border border-gray-300 text-2xl dark:border-gray-600',
		cell.state === 'unmarked' && 'bg-white dark:bg-gray-800',
		cell.state === 'marked' && 'bg-black text-white dark:bg-gray-700 dark:text-black',
		cell.state === 'blocked' && 'bg-gray-200  dark:bg-gray-700 ',
		cell.markedCount >= cell.value && 'text-gray-300 dark:text-gray-500',
	]}
	onclick={() => cell.toggleState()}
>
	{cell.value > 0 ? cell.value : ''}
	{#if cell.state === 'blocked'}{@render xmark()}{/if}
</button>

{#snippet xmark()}
	<svg class="absolute inset-0 h-full w-full">
		<line x1="10%" y1="10%" x2="90%" y2="90%" stroke="black" stroke-width="1" />
		<line x1="90%" y1="10%" x2="10%" y2="90%" stroke="black" stroke-width="1" />
	</svg>
{/snippet}
