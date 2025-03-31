<script>
	import { getCookie } from '../../utils/getCookie';
	let loggedIn = false;
	import { onMount } from 'svelte';

	onMount(async () => {
		loggedIn = getCookie('session');
	});
</script>

<nav class="border-gray-200 px-4 lg:px-6 py-5">
	<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
		<a href="#" class="flex items-center">
			<span style="font-family: Phantom Sans;" class="text-5xl font-semibold text-red-500"
				>hack club market</span
			>
		</a>

		<div class="flex items-center lg:order-2">
			<a
				style="font-family: Phantom Sans;"
				href="/about"
				class="text-red-500 hover:bg-red-100 font-medium rounded-lg text-2xl px-4 lg:px-5 py-2 mr-2 font-semibold"
				>about</a
			>
			{#if !loggedIn}
				<a
					style="font-family: Phantom Sans;"
					href="/api/oauth/slack/login"
					class="text-white bg-red-400 font-medium rounded-lg text-2xl px-4 lg:px-5 py-2 mr-2 hover:bg-red-600"
					>sign in with slack</a
				>
			{:else}
				<a
					style="font-family: Phantom Sans;"
					href="/ships"
					class="text-white bg-red-400 font-medium rounded-lg text-2xl px-4 lg:px-5 py-2 mr-2 hover:bg-red-600"
					>Go to your ships</a
				>
			{/if}
		</div>
	</div>
</nav>
