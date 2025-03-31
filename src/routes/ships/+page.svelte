<script lang="ts">
		import CardList from '../CardList.svelte';

//	import "../utils/check-if-logged-in"
	import { onMount } from 'svelte';
	import { PUBLIC_DEBUG } from '$env/static/public';
	// Initialize data as an empty array (ensures reactivity)
	let data: any[] = [];

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
	});

	
  // shorten desc and add ...
  const shortenDesc = (text, maxChars = 75) => {
      return text.length > maxChars ? text.slice(0, maxChars) + '...' : text;
  };
</script>

<header>
	<nav class="border-gray-200 px-4 lg:px-6 py-5">
		<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
			<a href="/" class="flex items-center">
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
			
			<a
					style="font-family: Phantom Sans;"
					href="/ships"
					class="text-white bg-red-400 font-medium rounded-lg text-2xl px-4 lg:px-5 py-2 mr-2 hover:bg-red-600"
					>Go to your ships</a
				>

			</div>
		</div>
	</nav>
</header>


<span style="font-family: Phantom Sans; margin-left: 80px; " class="text-4xl font-semibold text-red-500"
>your ships:</span
>

<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
	<CardList items={data} isAllMine={true} />
</div>

<div class="flex justify-center items-center mt-5">
	<a href="/create-ship" style="font-family: Phantom Sans; margin-bottom: 50px;" class="text-white bg-red-400 rounded-lg text-2xl font-bold px-140 py-2 mr-2 hover:bg-red-600">
		ship a project
	</a>
</div>