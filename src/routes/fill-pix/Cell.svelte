<script lang="ts" module>
	import { twMerge } from 'tailwind-merge'

	export class Entity {
		#row: number
		#col: number
		#hint: number
		#totalCells: number
		#state: 'unmarked' | 'marked' | 'blocked'

		constructor(options: {
			row: number
			col: number
			hint: number
			totalCells?: number
			state?: 'unmarked' | 'marked' | 'blocked'
		}) {
			this.#row = options.row
			this.#col = options.col
			this.#hint = options.hint ?? 0
			this.#totalCells = options.totalCells ?? 9
			this.#state = $state(options.state ?? 'unmarked')
		}

		get row() {
			return this.#row
		}
		get col() {
			return this.#col
		}
		get hint() {
			return this.#hint
		}
		get totalCells() {
			return this.#totalCells
		}
		get state() {
			return this.#state
		}
		set state(val) {
			// Update if we are resetting to 'unmarked' OR if the current state is 'unmarked'
			if (val === 'unmarked' || this.#state === 'unmarked') {
				this.#state = val
			}
		}

		toggleState() {
			if (this.#state === 'unmarked') {
				this.#state = 'marked'
			} else if (this.#state === 'marked') {
				this.#state = 'blocked'
			} else {
				this.#state = 'unmarked'
			}
		}
	}
</script>

<script lang="ts">
	type PublicInterface<T> = Pick<T, keyof T>

	interface Props {
		cell: PublicInterface<Entity>
		filledCount: number
		onclick?: VoidFunction
	}

	let { cell, filledCount, onclick }: Props = $props()
</script>

<button
	class={twMerge(
		'relative flex size-10 cursor-pointer items-center justify-center border  text-2xl',
		'border-gray-300 bg-white dark:border-gray-500 dark:bg-gray-800 dark:text-white',
		cell.state === 'marked' && 'bg-black text-white dark:bg-gray-600 ',
		filledCount >= cell.totalCells && 'text-gray-300 dark:text-gray-500',
	)}
	{onclick}
>
	{cell.hint || ''}
	{#if cell.state === 'blocked'}
		<svg class="absolute inset-0 size-full">
			<line
				x1="10%"
				y1="10%"
				x2="90%"
				y2="90%"
				class={['stroke-black dark:stroke-gray-400']}
				stroke-width="1"
			/>
			<line
				x1="90%"
				y1="10%"
				x2="10%"
				y2="90%"
				class={['stroke-black dark:stroke-gray-400']}
				stroke-width="1"
			/>
		</svg>
	{/if}
</button>
