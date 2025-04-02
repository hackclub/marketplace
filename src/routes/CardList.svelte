<script>
	import Icon from 'mdi-svelte';
	import { mdiTimer } from '@mdi/js';
	export function getColor(status) {
		return status === 'shipped!' ? 'green' : status === 'in progress' ? 'yellow' : 'red';
	}
	// import Popup from '$lib/Popup.svelte';
	export let items = [];
	export let isAllMine = false;
	// shorten desc and add ...
	const shortenDesc = (text, maxChars = 75) => {
		return text.length > maxChars ? text.slice(0, maxChars) + '...' : text;
	};
</script>

<div class="flex flex-wrap gap-4" style="font-family: Phantom Sans;">
	{#each items as item}
		<div class="w-80 rounded-lg p-4 relative">
			{#if isAllMine}
				<script>
					export let showPopup = false;
				</script>
				<div>
					<img
						class="h-40 bg-orange-500 rounded-lg"
						src={item.coverLink ||
							'https://hc-cdn.hel1.your-objectstorage.com/s/v3/113006acabca1ebbaadb96594f5905aa250dccca_9b1f3503271d6474.png'}
						alt="Cover"
					/>
					<!-- <img src={item.avatar} alt="Avatar" class="w-12 h-12 rounded-full absolute top-30 right-62 border-2 border-white"> -->
					<div class="mt-6">
						<h2 class="text-black font-bold text-lg" style="margin-top: -15px;">{item.title}</h2>
						<!-- <p class="text-gray-700">@{item.author}</p> -->
						{#if item.status !== 'shipped!'}
							<button
								class="text-white bg-red-400 font-medium rounded-lg text-xs px-2 py-2 mr-2 hover:bg-red-600"
								><Icon path={mdiTimer} /></button
							>
						{/if}
						<p class="text-orange-700">{shortenDesc(item.description)}</p>
						<div id="attributes">
							<!-- is there a better way to do this? yes, did it work? no. -->
							{#if item.status === 'shipped!'}
								<span
									class={`my-2 inline-block rounded-full px-6 pb-2 pt-2.5 font-medium shadow-md transition duration-150 ease-in-out hover:bg-green-500 hover:shadow-lg bg-green-400 text-white`}
									>{item.status}</span
								>
							{:else if item.status !== 'shipped!' && item.status !== 'draft'}
								<span
									class={`my-2 inline-block rounded-full px-6 pb-2 pt-2.5 font-medium shadow-md transition duration-150 ease-in-out hover:bg-yellow-500 hover:shadow-lg bg-yellow-400 text-yellow-700`}
									>{item.status}</span
								>
							{/if}
							{#if item.status === 'draft'}
								<span
									class={`my-2 inline-block rounded-full px-6 pb-2 pt-2.5 font-medium shadow-md transition duration-150 ease-in-out hover:bg-red-500 hover:shadow-lg bg-red-400 text-white`}
									>{item.status}</span
								>
							{/if}
						</div>
					</div>
				</div>
			{:else}
				{#if item.status == 'shipped!'}
					<a href="/buy?id={item.id}">
						<img
							class="h-40 bg-orange-500 rounded-lg"
							src={item.coverLink ||
								'https://hc-cdn.hel1.your-objectstorage.com/s/v3/113006acabca1ebbaadb96594f5905aa250dccca_9b1f3503271d6474.png'}
							alt="Cover"
						/>
						<img
							src={item.avatar}
							alt="Avatar"
							class="w-12 h-12 rounded-full absolute top-30 right-62 border-2 border-white"
						/>
						<div class="mt-6">
							<h2 class="text-black font-bold text-lg" style="margin-top: -15px;">{item.title}</h2>
							<p class="text-gray-700">@{item.author}</p>
							<p class="text-orange-700">{shortenDesc(item.description)}</p>
						</div>
					</a>
				{/if}
				{#if item.status !== 'shipped!'}
					<a href="#">
						<img
							class="h-40 bg-orange-500 rounded-lg"
							src={item.coverLink ||
								'https://hc-cdn.hel1.your-objectstorage.com/s/v3/113006acabca1ebbaadb96594f5905aa250dccca_9b1f3503271d6474.png'}
							alt="Cover"
						/>
						<img
							src={item.avatar}
							alt="Avatar"
							class="w-12 h-12 rounded-full absolute top-30 right-62 border-2 border-white"
						/>
						<div class="mt-6">
							<h2 class="text-black font-bold text-lg" style="margin-top: -15px;">{item.title}</h2>
							<p class="text-gray-700">@{item.author}</p>
							<p class="text-orange-700">{shortenDesc(item.description)}</p>
						</div>
					</a>
				{/if}
			{/if}
		</div>
	{/each}
</div>
