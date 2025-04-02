<script>
	import CardList from './CardList.svelte';
	import NavBar from './NavBar.svelte';
	let data = [];
	let loading = true;
	let loggedIn = false;
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
			return document.cookie.split('; ').find((row) => row.startsWith(name + '=')) !== undefined;
		}

		loggedIn = getCookie('session');
	});
</script>

<NavBar />

<div
	class="rounded-xl flex justify-center items-center"
	style="margin-left: 80px; margin-right: 80px; margin-bottom: -25px;"
>
	<img src="center.png" style="height: 600px; width: 1340px" />
</div>

<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
	<span style="font-family: Phantom Sans;" class="text-4xl font-semibold text-red-500"
		>featured projects:</span
	>
</div>
<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
	<CardList items={data.filter((d) => d.featured).slice(0, 6)} />
</div>

<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
	<span style="font-family: Phantom Sans;" class="text-4xl font-semibold text-red-500"
		>projects that are out rn:</span
	>
</div>
<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
	<CardList items={data.filter((d) => !d.featured && d.status == 'shipped!').slice(0, 9)} />
</div>

<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
	<span style="font-family: Phantom Sans;" class="text-4xl font-semibold text-red-500"
		>projects in progress:</span
	>
</div>
<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
	<CardList
		items={data
			.filter((d) => !d.featured && d.status !== 'shipped!')
			.reverse()
			.slice(0, 12)}
	/>
</div>

<div class="flex justify-center items-center mt-16">
	<a
		href="/allships"
		style="font-family: Phantom Sans; margin-bottom: 50px;"
		class="text-white bg-red-400 rounded-lg text-2xl font-bold px-140 py-2 mr-2 hover:bg-red-600"
	>
		see all projects
	</a>
</div>
