<script lang="ts">
	import { resolve } from '$app/paths'
	import { SlitherlinkGame } from './slitherlink.svelte'

	const game = new SlitherlinkGame()
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
	<h1 class="mb-8 text-4xl font-bold dark:text-white">Slitherlink</h1>
	<p class="mb-4 text-lg dark:text-white">
		Draw lines to form a loop. Numbers show how many lines surround each cell.
	</p>

	<!-- Slitherlink Grid -->
	<div class="inline-block border-2 border-gray-600 bg-white p-4 dark:bg-gray-800">
		<div
			class="grid gap-0"
			style="grid-template-columns: 16px 32px 16px 32px 16px 32px 16px ; grid-template-rows: 16px 32px 16px 32px 16px 32px 16px;"
		>
			{#each game.grid as row, rowIndex (rowIndex)}
				{#each row as element, colIndex (colIndex)}
					<div class="flex items-center justify-center" data-type={element.type}>
						{#if element.type === 'dot'}
							<div class="h-2 w-2 rounded-full bg-gray-800 dark:bg-gray-200"></div>
						{:else if element.type === 'cell'}
							{#if element.actual !== null}
								<span
									class={[
										'text-lg font-bold',
										element.current === element.actual
											? 'text-gray-600 dark:text-gray-400'
											: element.current > element.actual
												? 'text-red-600 dark:text-red-400'
												: 'text-blue-600 dark:text-blue-400',
									]}
								>
									{element.actual}
								</span>
							{/if}
						{:else if element.type === 'hline'}
							<button
								class={[
									'h-2 w-full cursor-pointer',
									element.state === 'include' && 'bg-black',
									element.state === 'exclude' && 'bg-gray-700',
									element.state === 'unknown' && 'hover:bg-gray-300',
								]}
								aria-label="Toggle horizontal line"
								onclick={() => game.toggleLine(rowIndex, colIndex, element.type)}
							></button>
						{:else if element.type === 'vline'}
							<button
								class={[
									'h-full w-2 cursor-pointer',
									element.state === 'include' && 'bg-black',
									element.state === 'exclude' && 'bg-gray-700',
									element.state === 'unknown' && 'hover:bg-gray-300',
								]}
								aria-label="Toggle vertical line"
								onclick={() => game.toggleLine(rowIndex, colIndex, element.type)}
							></button>
						{/if}
					</div>
				{/each}
			{/each}
		</div>
	</div>

	<div class="mt-4 flex gap-4">
		<button
			class="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
			onclick={() => game.checkSolution()}
		>
			Check Solution
		</button>
		<button
			class="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
			onclick={() => game.resetGame()}
		>
			Reset
		</button>
	</div>

	<p class="mt-4 text-lg dark:text-white">{game.status}</p>
	<a href={resolve('/')} class="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
		>Back to Games</a
	>
</div>
