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

		get markedCount(): number {
			return this.#getMarkedCount(this)
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
	type PublicInterface<T> = Pick<T, keyof T>

	interface Props {
		cell: PublicInterface<Entity>
	}

	let { cell }: Props = $props()
</script>

<button
	class={[
		'relative flex size-10 cursor-pointer items-center justify-center border border-gray-300 text-2xl  dark:border-gray-600 dark:text-white',
		cell.state === 'unmarked' && 'bg-white dark:bg-gray-800',
		cell.state === 'marked' && 'bg-black text-white dark:bg-gray-700 dark:text-black',
		cell.value >= cell.markedCount && 'text-gray-300 dark:text-gray-500',
	]}
	onclick={() => cell.toggleState()}
>
	{cell.value > 0 ? cell.value : ''}
	{#if cell.state === 'blocked'}
		<svg class="absolute inset-0 size-full">
			<line x1="10%" y1="10%" x2="90%" y2="90%" stroke="black" stroke-width="1" />
			<line x1="90%" y1="10%" x2="10%" y2="90%" stroke="black" stroke-width="1" />
		</svg>
	{/if}
</button>
