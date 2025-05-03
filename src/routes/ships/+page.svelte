<script lang="ts">
	import CardList from '../CardList.svelte';
	import NavBar from '../NavBar.svelte';

	//	import "../utils/check-if-logged-in"
	import { onMount } from 'svelte';
	// import { PUBLIC_DEBUG } from '$env/static/public';
	// Initialize data as an empty array (ensures reactivity)
	let data: any[] = [];
	let isInASessionRn = false;
	// Fetch data once component mounts
	onMount(async () => {
		try {
			const res = await fetch('/api/ships/get-mine');

			if (!res.ok) {
				throw new Error(`Failed to fetch data: ${res.status}`);
			}
			data = await res.json();
			console.log(data);
		} catch (error) {
			console.error(error);
		}
		isInASessionRn = await fetch('/api/time/status')
			.then((r) => r.json())
			.then((r) => r.shipId);
	});

	// shorten desc and add ...
	const shortenDesc = (text: string, maxChars = 75) => {
		return text.length > maxChars ? text.slice(0, maxChars) + '...' : text;
	};
</script>

<NavBar />
{#if isInASessionRn}
	<div class="bg-red-300 p-5 m-2 rounded-lg">
		<h2 class="font-bold font-2xl text-red-700">
			You have an active session! please open the timer for that ship before it gets deleted!
		</h2>
	</div>
{/if}
<div class="flex justify-center items-center mt-5">
	<span class="text-4xl font-semibold text-red-500">your ships</span>
</div>
<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
	<CardList items={data} isAllMine={true} timerShipId={isInASessionRn} />
</div>

<div class="flex justify-center items-center mt-5">
	<a
		href="/create-ship"
		style="margin-bottom: 50px;"
		class="text-white bg-red-400 rounded-lg text-2xl font-bold px-140 py-2 mr-2 hover:bg-red-600"
	>
		ship a project
	</a>
</div>
