<script>
	import { PUBLIC_REDIRECT_URL, PUBLIC_SLACK_CLIENT_ID } from '$env/static/public';

	// let data = [];
	let loading = true;
	let loggedIn = false;
	// Perform the fetch request when the component is mounted
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

		// Check for the specific cookie
		loggedIn = getCookie('session');
	});
</script>

<header>
	<nav class="border-gray-200 px-4 lg:px-6 py-5">
		<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
			<a href="/" class="flex items-center">
				<span class="text-5xl font-semibold text-red-500">hack club market</span>
			</a>

			<div class="flex items-center lg:order-2">
				<a
					href="/about"
					class="text-red-500 font-medium rounded-lg text-2xl px-4 lg:px-5 py-2 mr-2 font-semibold"
					>about</a
				>
				{#if !loggedIn}
					<a
						href={`https://hackclub.slack.com/oauth/v2/authorize?scope=&user_scope=identity.basic&redirect_uri=${encodeURIComponent(PUBLIC_REDIRECT_URL + '/api/oauth/slack/callback')}&client_id=${PUBLIC_SLACK_CLIENT_ID}`}
						class="text-white bg-red-500 font-medium rounded-lg text-2xl px-4 lg:px-5 py-2 mr-2 hover:bg-red-600"
						>sign in with slack</a
					>
				{:else}
					<a
						href="/ships"
						class="text-white bg-red-400 font-medium rounded-lg text-2xl px-4 lg:px-5 py-2 mr-2 hover:bg-red-600"
						>Go to your ships</a
					>
				{/if}
			</div>
		</div>
	</nav>
</header>

<div class="text-red-500 text-center mt-20">
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
