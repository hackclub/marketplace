<script lang="ts">
	import CardList from './CardList.svelte';
	import NavBar from './NavBar.svelte';
	let data: any[] = [];
	let loading = true;
	let loggedIn = false;
	import { onMount } from 'svelte';
	let featured: any[] = [];
	let inProgress: any[] = [];
	let shipped: any[] = [];
	onMount(async () => {
		try {
			const res = await fetch('/api/ships/homepage');
			if (res.ok) {
				data = await res.json();
				featured = data.filter((d: any) => d.featured).slice(0, 6);
				inProgress = data
					.filter((d: any) => !d.featured && d.status !== 'SHIPPED')
					.reverse()
					.slice(0, 12);
				shipped = data.filter((d: any) => !d.featured && d.status == 'SHIPPED').slice(0, 9);
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

<div
	class="rounded-xl flex justify-center items-center px-2 sm:px-10 md:px-20 lg:px-32 xl:px-40 my-4"
>
	<img
		src="center.png"
		alt="Hack Club Market main visual"
		class="w-full max-w-4xl h-auto rounded-xl object-contain"
	/>
</div>

<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl px-4">
	<span class="text-2xl sm:text-3xl md:text-4xl font-semibold text-red-500">featured projects:</span
	>
</div>
<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl px-4">
	<CardList items={featured} />
</div>

<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl px-4">
	<span class="text-2xl sm:text-3xl md:text-4xl font-semibold text-red-500"
		>projects that are out rn:</span
	>
</div>
<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl px-4">
	<CardList items={shipped} />
</div>

<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl px-4">
	<span class="text-2xl sm:text-3xl md:text-4xl font-semibold text-red-500"
		>projects in progress:</span
	>
</div>
<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl px-4">
	<CardList items={inProgress} />
</div>

<div class="flex justify-center items-center mt-8 mb-8">
	<a
		href="/allships"
		class="text-white bg-red-400 rounded-lg text-lg sm:text-2xl font-bold px-8 sm:px-20 py-2 hover:bg-red-600 mx-auto max-w-xs sm:max-w-md w-full sm:w-auto text-center"
	>
		see all projects
	</a>
</div>
