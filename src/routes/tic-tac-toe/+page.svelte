<script lang="ts">
	let board: ('X' | 'O' | '')[] = $state(Array(9).fill(''))

	const winPatterns: [number, number, number][] = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	]

	const isFull = $derived(board.every((cell) => cell !== ''))
	const winningPattern = $derived(
		winPatterns.find(([a, b, c]) => {
			return board[a] && board[a] === board[b] && board[a] === board[c]
		}),
	)
	const winner = $derived.by(() => (winningPattern ? board[winningPattern[0]] : isFull && 'draw'))

	const currentPlayer = $derived.by(() => {
		const totalMoves = board.filter((cell) => cell).length
		return totalMoves % 2 === 0 ? 'X' : 'O'
	})

	const handleClick = (index: number) => {
		if (!board[index]) board[index] = currentPlayer
	}

	const resetGame = () => {
		board = Array(9).fill('')
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-100">
	<h1 class="mb-8 text-4xl font-bold">Tic Tac Toe</h1>
	<div class="mb-4 grid grid-cols-3 gap-2">
		{#each board as cell, index (index)}
			<button
				class="h-20 w-20 border-2 border-gray-300 bg-white text-3xl font-bold hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
				disabled={board[index] !== '' || !!winner}
				onclick={() => handleClick(index)}
			>
				{cell}
			</button>
		{/each}
	</div>
	<p class="mb-4 min-w-45 text-center text-2xl">
		{#if winner === 'draw'}
			It's a draw!
		{:else if winner}
			{winner} wins!
		{:else}
			Current player: {currentPlayer}
		{/if}
	</p>
	<button class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600" onclick={resetGame}>
		Reset Game
	</button>
</div>
