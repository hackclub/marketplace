<script lang="ts">
	import CardList from '../CardList.svelte';
	import NavBar from '../NavBar.svelte';
	let data: any[] = [];
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
		function getCookie(name: string) {
			return document.cookie.split('; ').find((row) => row.startsWith(name + '=')) !== undefined;
		}

		loggedIn = getCookie('session');
	});
</script>

<NavBar />

<div class="flex flex-wrap justify-between mx-auto max-w-screen-xl">
	<CardList items={data} />
</div>
