<script lang="ts">
	import ShipReview from '../../components/ShipReview.svelte';
	import NavBar from '../NavBar.svelte';
	//	import "../utils/check-if-logged-in"
	import { onMount } from 'svelte';
	// import { PUBLIC_DEBUG } from '$env/static/public';
	// Initialize data as an empty array (ensures reactivity)
	let data: any[] = [];
	// Fetch data once component mounts
	onMount(async () => {
		// umm very secure
		//		window.prisma = prisma;
		if (!localStorage.getItem('_secret_watchword')) {
			location.href = '/';
		}
		try {
			const res = await fetch('/api/ships/to-review', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('_secret_watchword')}`,
					'Content-Type': 'application/json'
				}
			});

			if (!res.ok) {
				throw new Error(`Failed to fetch data: ${res.status}`);
			}
			data = await res.json();
			console.log(data);
		} catch (error) {
			console.error(error);
		}
	});
</script>

<NavBar />

<span
	class="text-4xl font-semibold text-red-500 ml-[80px]">Ships to review:</span
>

<div class="flex flex-col items-center mx-auto space-y-4">
	{#each data as item}
		<ShipReview properData={item} />
	{/each}
</div>
