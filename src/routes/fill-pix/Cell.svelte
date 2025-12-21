<script lang="ts" module>
	export class Entity {
		#row: number
		#col: number
		#value: number
		#state: 'unmarked' | 'marked' | 'blocked'
		#getMarkedCount: (cell: Entity) => number

		constructor(options: {
			row: number
			col: number
			value?: number
			state?: 'unmarked' | 'marked' | 'blocked'
			getMarkedCount?: (cell: Entity) => number
		}) {
			this.#row = options.row
			this.#col = options.col
			this.#value = options.value ?? 0
			this.#state = $state(options.state ?? 'unmarked')
			this.#getMarkedCount = options.getMarkedCount ?? (() => 0)
		}

		get isFilled(): boolean {
			return this.#getMarkedCount(this) >= this.#value
		}

		get row() {
			return this.#row
		}
		get col() {
			return this.#col
		}
		get value() {
			return this.#value
		}
		get state() {
			return this.#state
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
	import { twMerge } from 'tailwind-merge'
	type PublicInterface<T> = Pick<T, keyof T>

	interface Props {
		cell: PublicInterface<Entity>
	}

	let { cell }: Props = $props()
</script>

<button
	class={twMerge(
		'relative flex size-10 cursor-pointer items-center justify-center border  text-2xl',
		'border-gray-300 bg-white dark:border-gray-500 dark:bg-gray-800 dark:text-white',
		cell.state === 'marked' && 'bg-black text-white dark:bg-gray-600 ',
		cell.isFilled && 'text-gray-300 dark:text-gray-500',
	)}
	onclick={() => cell.toggleState()}
>
	{cell.value > 0 ? cell.value : ''}
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
