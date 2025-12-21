<script lang="ts" module>
	import { twMerge } from 'tailwind-merge'

	// DO NOT MOVE THIS CLASS - it must stay in this file
	export class Entity {
		#x: number
		#y: number
		#state: 'unmarked' | 'marked' | 'blocked'
		#shouldFill: boolean
		#hint: number
		localCells: Entity[]
		#filledCount: number

		constructor(options: {
			x: number
			y: number
			state?: 'unmarked' | 'marked' | 'blocked'
			shouldFill: boolean
			getLocalCells?: () => Entity[]
		}) {
			this.#y = options.y
			this.#x = options.x
			this.#state = $state(options.state ?? 'unmarked')
			this.#shouldFill = options.shouldFill

			this.localCells = $derived(options.getLocalCells?.() ?? [this])
			this.#hint = $derived(this.localCells.filter((cell) => cell.shouldFill).length)
			this.#filledCount = $derived(
				this.localCells.filter((cell) => cell.state !== 'unmarked').length,
			)
		}

		get x() {
			return this.#x
		}
		get y() {
			return this.#y
		}
		get hint() {
			return this.#hint
		}
		get state() {
			return this.#state
		}
		get shouldFill() {
			return this.#shouldFill
		}
		get filledCount() {
			return this.#filledCount
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
	interface Props {
		cell: Entity
		onclick?: VoidFunction
	}

	let { cell, onclick }: Props = $props()
</script>

<button
	class={twMerge(
		'relative flex size-10 cursor-pointer items-center justify-center border  text-2xl',
		'border-gray-300 bg-white dark:border-gray-500 dark:bg-gray-800 dark:text-white',
		cell.state === 'marked' && 'bg-black text-white dark:bg-gray-600 ',
		cell.filledCount >= cell.localCells.length && 'text-gray-300 dark:text-gray-500',
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
				class="stroke-black dark:stroke-gray-400"
				stroke-width="1"
			/>
			<line
				x1="90%"
				y1="10%"
				x2="10%"
				y2="90%"
				class="stroke-black dark:stroke-gray-400"
				stroke-width="1"
			/>
		</svg>
	{/if}
</button>
