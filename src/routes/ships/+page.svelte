<script lang="ts">
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
</script>

<main>
	{#if data.length > 0}
		{#each data as item}
            <div class="w-80  rounded-lg p-4 relative border-1">
                <img src="{item.coverLink}" alt="Cover " class="h-40 bg-orange-500 rounded-lg" />
                <h1 class="font-bold text-2xl">{item.title}</h1>
                <p>{item.description}</p>
				{#if PUBLIC_DEBUG} 
				<span>ID: {item.id} </span>
				{/if}
			</div>
		{/each}
	{:else}
		<p>Loading...</p>
	{/if}
</main>
