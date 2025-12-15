<script lang="ts">
	import { resolve } from '$app/paths'
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
	<h1 class="mb-8 text-4xl font-bold dark:text-white">Game Picker</h1>
	<div class="space-y-4">
		<a
			href={resolve('/tic-tac-toe')}
			class="block rounded bg-blue-500 px-4 py-2 text-center text-white hover:bg-blue-600 dark:hover:bg-blue-800"
		>
			Play Tic Tac Toe
		</a>
		<a
			href={resolve('/slitherlink')}
			class="block rounded bg-green-500 px-4 py-2 text-center text-white hover:bg-green-600 dark:hover:bg-green-800"
		>
			Play Slitherlink
		</a>
		<!-- Add more game links here as needed -->
	</div>
</div>
