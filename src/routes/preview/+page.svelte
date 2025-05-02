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
		// Get the id from the url
		const params = new URLSearchParams(window.location.search);
		id = params.get('id');
		console.log('URL ID:', id);

		try {
			const res = await fetch('/api/ships/get-draft?shipId=' + id);
			if (res.ok) {
				data = await res.json();
				console.log('Fetched Data:', data);

				// find correct ship with id
				shipData = data;
				console.log('Filtered Ship:', shipData);
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
	<p>Loading...</p>
{:else if shipData}
	<div>
		<img
			src={shipData.coverLink}
			alt={shipData.title}
			style="margin-left: 80px; width: 750px; height:580px; margin-bottom: 20px;"
			class="rounded-xl"
		/>
		<p
			class="text-4xl font-semibold text-red-500"
			style="margin-left: 870px; margin-right: 5px; margin-bottom: 10px; margin-top: -580px; font-family: Phantom Sans;"
		>
			{shipData.title}
		</p>
		<img
			src={shipData.avatar}
			style="width: 55px; margin-left: 870px;"
			class="rounded-full"
			alt="Avatar"
		/>
		<p
			class="text-xl font-semibold text-red-500"
			style="margin-left: 940px; margin-top: -55px; font-family: Phantom Sans;"
		>
			by @{shipData.author}
		</p>
		<a
			style="font-family: Phantom Sans; margin-left: 938px;"
			href={`https://slack.com/app_redirect?channel=${shipData.author_slack_id}`}
			class="text-white bg-red-400 font-medium rounded-lg text-xs px-2 py-2 mr-2 hover:bg-red-600"
			>message me on slack</a
		>
		<p
			class="text-xl text-black"
			style="margin-left: 870px; margin-top: 20px; margin-bottom:20px; margin-right: 5px; font-family: Phantom Sans;"
		>
			{shipData.description}
		</p>

	
	</div>

{:else}
	<p>No ship found with the given ID.</p>
{/if}
