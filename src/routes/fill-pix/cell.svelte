<script lang="ts">
	import { twMerge } from 'tailwind-merge'

	interface Props {
		hint: number | null
		state: 'unmarked' | 'marked' | 'blocked'
		isComplete?: boolean
		onclick?: VoidFunction
	}

	let { hint, state, isComplete = false, onclick }: Props = $props()
</script>

<button
	class={twMerge(
		'relative flex size-10 cursor-pointer items-center justify-center border  text-3xl',
		'border-gray-300 bg-white dark:border-gray-500 dark:bg-gray-800 dark:text-white',
		state === 'marked' && 'bg-black text-white dark:bg-gray-600 ',
		isComplete && 'text-gray-300 dark:text-gray-500',
	)}
	{onclick}
>
	{hint || ''}
	{#if state === 'blocked'}
		<svg class="absolute inset-0 size-full">
			<line
				x1="10%"
				y1="10%"
				x2="90%"
				y2="90%"
				class="stroke-black dark:stroke-gray-400"
				stroke-width="3"
			/>
			<line
				x1="90%"
				y1="10%"
				x2="10%"
				y2="90%"
				class="stroke-black dark:stroke-gray-400"
				stroke-width="3"
			/>
		</svg>
	{/if}
</button>
