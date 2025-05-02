<script lang="ts">
	interface ShipData {
		coverLink: string;
		title: string;
		avatar: string;
		author: string;
		author_slack_id: string;
		description: string;
		ships_to: string;
	}
	let data = [];
	let loading = true;
	let loggedIn = false;
	let id = null;
	let shipData: ShipData | null = null;
	import NavBar from '../NavBar.svelte';
	import { onMount } from 'svelte';

	onMount(async () => {
		const params = new URLSearchParams(window.location.search);
		id = params.get('id');
		console.log('URL ID:', id);

		try {
			const res = await fetch('/api/ships/get-product?shipId=' + id);
			if (res.ok) {
				data = await res.json();
				console.log('Fetched Data:', data);
				shipData = data;
			} else {
				console.error('Failed to fetch data');
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			loading = false;
		}

		function getCookie(name: string) {
			return document.cookie.split('; ').find((row) => row.startsWith(name + '=')) !== undefined;
		}

		loggedIn = getCookie('session');
	});
</script>

<NavBar />

{#if loading}
	<p class="text-center mt-10">Loading...</p>
{:else if shipData}
	<div class="flex flex-col lg:flex-row items-center lg:items-start gap-6 p-4 max-w-7xl mx-auto">
		<!-- Cover Image -->
		<img
			src={shipData.coverLink}
			alt={shipData.title}
			class="rounded-xl w-full max-w-xl lg:w-[750px] lg:h-[580px] object-cover"
		/>

		<!-- Info Section -->
		<div class="w-full lg:max-w-xl">
			<h1 class="text-3xl sm:text-4xl font-semibold text-red-500 font-sans mt-4 lg:mt-0">
				{shipData.title}
			</h1>

			<div class="flex items-center gap-4 mt-2">
				<img src={shipData.avatar} alt="Avatar" class="rounded-full w-12 h-12" />
				<div>
					<p class="text-lg font-semibold text-red-500 font-sans">by @{shipData.author}</p>
					<a
						href={`https://slack.com/app_redirect?channel=${shipData.author_slack_id}`}
						class="text-white bg-red-400 font-medium rounded-lg text-xs px-2 py-2 mr-2 hover:bg-red-600"
						>message me on slack</a
					>
				</div>
			</div>

			<p class="text-base text-black font-sans mt-4">{shipData.description}</p>

			<!-- Buy Button -->
			<div class="mt-6">
				{#if loggedIn}
					<button
						on:click={() => {
							const confirmation = confirm('Are you sure you want to buy this?');
							if (confirmation) {
								// create POST to /api/purchases/create
							}
						}}
						class="text-white bg-red-400 rounded-lg text-2xl font-bold px-55 py-2 mr-2 hover:bg-red-600 btn button"
						>buy now!!!</button
					>
				{:else}
					<button
						on:click={() => {
							window.location.href = '/api/oauth/slack/login';
						}}
						class="text-white bg-red-400 rounded-lg text-2xl font-bold px-55 py-2 mr-2 hover:bg-red-600 btn button"
						>buy now!!!</button
					>
				{/if}
			</div>

			<p
				class="text-lg text-black font-light"
				style="margin-top: 5px; margin-bottom:20px; margin-right: 5px;"
			>
				(ships to {shipData.can_ship_to})
			</p>
		</div>
	</div>
{:else}
	<p class="text-center mt-10">No ship found with the given ID.</p>
{/if}
