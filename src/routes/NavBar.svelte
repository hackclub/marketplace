<script>
	import { PUBLIC_REDIRECT_URL, PUBLIC_SLACK_CLIENT_ID } from '$env/static/public';
	let loading = true;
	let loggedIn = false;
	let avatarUrl = null;
	let userName = null;
	import { onMount } from 'svelte';

	onMount(async () => {
		loading = true;
		function getCookie(name) {
			return document.cookie.split('; ').find((row) => row.startsWith(name + '='));
		}

		loggedIn = getCookie('session');
		const ustring = getCookie('user-info')
	if(ustring) {
		const userData = JSON.parse(decodeURIComponent(ustring.split("=")[1]))
		if(userData) {
			avatarUrl = `https://cachet.dunkirk.sh/users/${userData.slack_id}/r`;
			userName = userData.slack_name;
		}
	}
		});
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
					class="text-red-500 font-medium rounded-lg text-2xl px-4 lg:px-5 py-2 mr-2 font-semibold"
					>about</a
				>
				{#if !loggedIn}
					<a
						style="font-family: Phantom Sans;"
						href={`https://hackclub.slack.com/oauth/v2/authorize?scope=&user_scope=identity.basic&redirect_uri=${encodeURIComponent(PUBLIC_REDIRECT_URL + '/api/oauth/slack/callback')}&client_id=${PUBLIC_SLACK_CLIENT_ID}`}
						class="text-white bg-red-500 font-medium rounded-lg text-2xl px-4 lg:px-5 py-2 mr-2 hover:bg-red-600"
						>sign in with slack</a
					>
				{:else}
					<a
						style="font-family: Phantom Sans;"
						href="/ships"
						class="text-white bg-red-400 font-medium rounded-lg text-2xl px-4 lg:px-5 py-2 mr-2 hover:bg-red-600"
						>Go to your ships</a
					>
				{/if}
				<div class="inline-flex text-center flex">
		{#if userName}
		<img src={avatarUrl} class="rounded-full w-15" alt={`${userName}'s avatar`} />
<span class="font-bold text-xl text-center">{userName}</span>
		{/if}
				</div>
			</div>
		</div>
	</nav>
</header>
