<script lang="ts">
	import { PUBLIC_REDIRECT_URL, PUBLIC_SLACK_CLIENT_ID } from '$env/static/public';
	let loading: boolean = true;
	let loggedIn: boolean = false;
	let avatarUrl: string | null = null;
	let userName: string | null = null;
	let showDropdown: boolean = false;
	import { onMount } from 'svelte';

	onMount(async () => {
		loading = true;
		function getCookie(name: string): string | undefined {
			return document.cookie.split('; ').find((row) => row.startsWith(name + '='));
		}

		loggedIn = !!getCookie('session');
		const ustring = getCookie('user-info');
		if (ustring) {
			const userData = JSON.parse(decodeURIComponent(ustring.split('=')[1]));
			if (userData) {
				avatarUrl = `https://cachet.dunkirk.sh/users/${userData.slack_id}/r`;
				userName = userData.slack_name;
			}
		}
	});

	function logout() {
		document.cookie = 'session=; Max-Age=0; path=/';
		window.location.href = '/';
	}
</script>

<header>
	<nav class="border-gray-200 px-2 sm:px-4 py-3">
		<div
			class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center mx-auto max-w-screen-xl gap-2 sm:gap-0"
		>
			<a href="/" class="flex items-center justify-center">
				<span
					style="font-family: Phantom Sans;"
					class="text-3xl sm:text-5xl font-semibold text-red-500 block text-center sm:text-left"
				>
					hack club market
				</span>
			</a>

			<div
				class="flex flex-col sm:flex-row items-center gap-2 sm:gap-0 sm:order-2 w-full sm:w-auto"
			>
				<a
					style="font-family: Phantom Sans;"
					href="/about"
					class="text-red-500 font-medium rounded-lg text-lg sm:text-2xl px-4 py-2 font-semibold text-center"
					>about</a
				>
				{#if !loggedIn}
					<a
						style="font-family: Phantom Sans;"
						href={`https://hackclub.slack.com/oauth/v2/authorize?scope=&user_scope=identity.basic&redirect_uri=${encodeURIComponent(PUBLIC_REDIRECT_URL + '/api/oauth/slack/callback')}&client_id=${PUBLIC_SLACK_CLIENT_ID}`}
						class="text-white bg-red-500 font-medium rounded-lg text-lg sm:text-2xl px-4 py-2 hover:bg-red-600 text-center"
						>sign in with slack</a
					>
				{:else}
					<a
						style="font-family: Phantom Sans;"
						href="/ships"
						class="text-white bg-red-400 font-medium rounded-lg text-lg sm:text-2xl px-4 py-2 hover:bg-red-600 text-center"
						>go to your ships</a
					>
				{/if}
				{#if userName}
					<div class="relative ml-2">
						<img
							src={avatarUrl}
							class="rounded-full w-10 h-10 sm:w-12 sm:h-12 cursor-pointer border-2 border-[#F4DECF]"
							alt={`${userName}'s avatar`}
							on:click={() => (showDropdown = !showDropdown)}
						/>
						{#if showDropdown}
							<div
								class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-50 border border-[#EADAC7]"
								style="font-family: Phantom Sans;"
							>
								<a
									href="/settings"
									class="block px-4 py-2 text-gray-700 hover:bg-[#FFECDA] rounded-t-lg">Settings</a
								>
								<button
									on:click={logout}
									class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-[#FFECDA] rounded-b-lg"
									>Logout</button
								>
							</div>
							<div class="fixed inset-0 z-40" on:click={() => (showDropdown = false)}></div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</nav>
</header>
