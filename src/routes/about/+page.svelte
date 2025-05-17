<script>
	import { PUBLIC_REDIRECT_URL, PUBLIC_SLACK_CLIENT_ID } from '$env/static/public';

	// let data = [];
	let loading = true;
	let loggedIn = false;
	// Perform the fetch request when the component is mounted
	import { onMount } from 'svelte';
	import NavBar from '../NavBar.svelte';

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

		// Check for the specific cookie
		loggedIn = getCookie('session');
	});
</script>

<NavBar />
<div style="font-family: Phantom Sans;" class="text-red-500 text-center mt-20">
	<h1 class="text-red-500 font-bold text-5xl" style="margin-bottom: 20px; margin-top: -50px">
		Welcome to Hack Club Market!
	</h1>
	<div style="margin-bottom: 20px;">
		<span class="text-red-500 font-bold text-4xl">What is this?</span>
		<br style="margin-bottom: 12px;" />
		<span class="text-stone-800 font-medium text-xl">
			Hack Club Market is a marketplace for you to sell PCBs and hardware you design to other teens! <br
			/>
			You can submit a PCB you've designed, and you will receive a grant based on the cost to produce
			and its quality. <br /> You'll use that grant to produce multiple copies of your project, then
			it will go live on the site for people to order!
		</span> <br style="margin-bottom: 12px;" />
	</div>
	<div style="margin-bottom: 20px;">
		<span class="text-red-500 font-bold text-4xl">How do I list a project?</span>
		<br style="margin-bottom: 12px;" />
		<span class="text-stone-800 font-medium text-xl">
			Create your project while tracking time using Hackatime v2, then go to the Ships page and list
			your project. <br />
			You’ll need a Git repository, demo images, a demo video, and a description of the project and how
			it was made. <br />
			Once you list a project, it will be reviewed by our team, and you'll be given a grant to spend
			on production. <br />
		</span>
	</div>
	<div style="margin-bottom: 20px;">
		<span class="text-red-500 font-bold text-4xl">How do I get currency?</span>
		<br style="margin-bottom: 12px;" />
		<span class="text-stone-800 font-medium text-xl">
			You earn currency by working on your hardware projects and shipping them to the marketplace! <br
			/>
			Once your project is approved, you'll receive 5 coins for every hour you spent working on it.
			<br />
			When someone buys your project and you ship it out, you'll also receive the coins from that sale.
		</span>
	</div>
</div>
