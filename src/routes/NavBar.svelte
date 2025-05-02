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
		const ustring = getCookie('user-info');
		if (ustring) {
			const userData = JSON.parse(decodeURIComponent(ustring.split('=')[1]));
			if (userData) {
				avatarUrl = `https://cachet.dunkirk.sh/users/${userData.slack_id}/r`;
				userName = userData.slack_name;
			}
		}
	});
</script>

<header>
	<nav class="border-gray-200 px-2 sm:px-4 py-3">
		<div
			class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center mx-auto max-w-screen-xl gap-2 sm:gap-0"
		>
			<a href="/" class="flex items-center justify-center">
				<span
					class="text-3xl sm:text-5xl font-semibold text-red-500 block text-center sm:text-left"
				>
					hack club market
				</span>
			</a>

			<div
				class="flex flex-col sm:flex-row items-center gap-2 sm:gap-0 sm:order-2 w-full sm:w-auto"
			>
				<a
					href="/about"
					class="text-red-500 font-medium rounded-lg text-lg sm:text-2xl px-4 py-2 font-semibold text-center"
					>about</a
				>
				{#if !loggedIn}
					<a
						href={`https://hackclub.slack.com/oauth/v2/authorize?scope=&user_scope=identity.basic&redirect_uri=${encodeURIComponent(PUBLIC_REDIRECT_URL + '/api/oauth/slack/callback')}&client_id=${PUBLIC_SLACK_CLIENT_ID}`}
						class="text-white bg-red-500 font-medium rounded-lg text-lg sm:text-2xl px-4 py-2 hover:bg-red-600 text-center"
						>sign in with slack</a
					>
				{:else}
					<a
						href="/ships"
						class="text-white bg-red-400 font-medium rounded-lg text-lg sm:text-2xl px-4 py-2 hover:bg-red-600 text-center"
						>go to your ships</a
					>
				{/if}
				{#if userName}
					<img
						src={avatarUrl}
						class="rounded-full w-10 sm:w-15 mt-2 sm:mt-0"
						alt={`${userName}'s avatar`}
					/>
				{/if}
			</div>
		</div>
	</nav>
</header>
