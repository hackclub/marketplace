<script>
	import CardList from '$lib/components/CardList.svelte';
	let data = [];
	let loading = true;
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
	});
</script>

<div class="flex flex-wrap justify-between mx-auto max-w-screen-xl">
	<CardList items={data} />
</div>
