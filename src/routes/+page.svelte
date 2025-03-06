<script>
	import CardList from './CardList.svelte';
	let data = [];
	let loading = true;
	let loggedIn = false;
	// Perform the fetch request when the component is mounted
	import { onMount } from 'svelte';

	onMount(async () => {
		try {
			const res = await fetch('/api/ships/homepage');
			if (res.ok) {
				data = await res.json();
			} else {
				console.error('Failed to fetch data');
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			loading = false;
		}
		function getCookie(name) {
            return document.cookie.split('; ').find(row => row.startsWith(name + '=')) !== undefined;
        }

        // Check for the specific cookie
        loggedIn = getCookie("session");
	});
</script>

<header>
	<nav class="border-gray-200 px-4 lg:px-6 py-5">
		<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
			<a href="https://flowbite.com" class="flex items-center">
				<span style="font-family: Phantom Sans;" class="text-4xl font-semibold text-red-500"
					>hack club market</span
				>
			</a>
			
			<div class="flex items-center lg:order-2">
				<a
					style="font-family: Phantom Sans;"
					href="#"
					class="text-red-500 hover:bg-red-100 font-medium rounded-lg text-lg px-4 lg:px-5 py-2 mr-2 font-semibold"
					>about</a
				>
				{#if !loggedIn}
				<a
					style="font-family: Phantom Sans;"
					href="/api/oauth/slack/login"
					class="text-white bg-red-400 font-medium rounded-lg text-lg px-4 lg:px-5 py-2 mr-2 hover:bg-red-600"
					>sign in with slack</a
				>
			{:else}
			<a
					style="font-family: Phantom Sans;"
					href="/ships"
					class="text-white bg-red-400 font-medium rounded-lg text-lg px-4 lg:px-5 py-2 mr-2 hover:bg-red-600"
					>Go to your ships</a
				>
			{/if}

			</div>
		</div>
	</nav>
</header>
<div
	class="rounded-xl"
	style="background-color: #348EDA; height: 400px; width: 1340; margin-left: 80px; margin-right: 80px; margin-bottom: 30px;"
>
	<!-- blue box thingie -->
	<p class="boxtext" style="margin-bottom: 39px"></p>
	<p class="boxtext" style="margin-left: 200px">create cool projects.</p>
	<p class="boxtext" style="margin-left: 320px">get funding to make the real.</p>
	<p class="boxtext" style="margin-left: 540px">share them with other teens!</p>
</div>

<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
	<!-- featured projects -->
	<span style="font-family: Phantom Sans;" class="text-4xl font-semibold text-red-500"
		>featured projects:</span
	>
</div>
<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
	<CardList items={data} />
</div>
