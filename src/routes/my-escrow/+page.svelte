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
			const res = await fetch('/api/escrow/get-mine');

			if (!res.ok) {
				throw new Error(`Failed to fetch data: ${res.status}`);
			}
			data = await res.json();
			console.log(data);
		} catch (error) {
			console.error(error);
		}
	});

	// shorten desc and add ...
	const shortenDesc = (text: string, maxChars = 75) => {
		return text.length > maxChars ? text.slice(0, maxChars) + '...' : text;
	};
</script>

<NavBar />
<div class="flex justify-center items-center mt-5">
	<span style="font-family: Phantom Sans;" class="text-4xl font-semibold text-red-500"
		>your escrow:</span
	>
</div>
<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
    <!-- TODO: stuff here -->
</div>
<!-- 
<div class="flex justify-center items-center mt-5">
	<a
		href="/create-ship"
		style="font-family: Phantom Sans; margin-bottom: 50px;"
		class="text-white bg-red-400 rounded-lg text-2xl font-bold px-140 py-2 mr-2 hover:bg-red-600"
	>
		ship a project
	</a>
</div> -->
