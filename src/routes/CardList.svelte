<script>
	import Icon from 'mdi-svelte';
	import Timer from '../components/Timer.svelte';
	import { mdiPencil, mdiRocket, mdiTimer,mdiExport  } from '@mdi/js';
	import { Modal, Content, Trigger } from 'sv-popup';
	import EditPopup from '../components/EditPopup.svelte';
	import PromoteToXyz from '../components/PromoteToXYZ.svelte';
	export function getColor(status) {
		return status === 'SHIPPED' ? 'green' : status === 'in progress' ? 'yellow' : 'red';
	}
	function formatName(name) {
		return name
			.replace(/_/g, ' ')
			.toLowerCase()
			.replace(/\b\w/g, (char) => char.toUpperCase());
	}
	// import Popup from '$lib/Popup.svelte';
	/**
	 * @type {any[]}
	 */
	export let items = [];
	export let isAllMine = false;
	export let timerShipId = null;
	// shorten desc and add ...
	const shortenDesc = (text, maxChars = 75) => {
		return text.length > maxChars ? text.slice(0, maxChars) + '...' : text;
	};
</script>

<div class="flex flex-wrap" style="font-family: Phantom Sans;">
	{#if items.length == 0}
		<div class="flex justify-center items-center w-full h-20">
			<h1 class="text-base sm:text-lg md:text-2xl font-semibold text-gray-700 text-center">
				no items found, could you be the first?
			</h1>
		</div>
	{/if}
	{#each items as item}
		<div class="w-full sm:w-80 rounded-lg p-4 relative mb-4">
			{#if isAllMine}
				<div class="bg-orange-100 rounded-xl p-4">
					<img
						class="h-40 bg-orange-500 rounded-lg"
						src={item.coverLink ||
							'https://hc-cdn.hel1.your-objectstorage.com/s/v3/113006acabca1ebbaadb96594f5905aa250dccca_9b1f3503271d6474.png'}
						alt="Cover"
					/>
					<!-- <img src={item.avatar} alt="Avatar" class="w-12 h-12 rounded-full absolute top-30 right-62 border-2 border-white"> -->
					<div class="mt-6">
						<h2 class="text-black font-bold text-lg" style="margin-top: -15px;">{item.title}</h2>
						<p class="text-gray-700">{item.total_time}</p>
						<!-- <p class="text-gray-700">@{item.author}</p> -->

						{#if item.status !== 'SHIPPED'}
							<Modal basic>
								<Content>
									<Timer shipId={item.id} />
								</Content>
								<Trigger>
									<button
										disabled={timerShipId && timerShipId !== item.id}
										class="text-white bg-red-400 font-medium rounded-lg text-xs px-2 py-2 mr-2 hover:bg-red-600 disabled:bg-gray-400"
										><Icon path={mdiTimer} /></button
									>
								</Trigger>
							</Modal>
							<Modal>
								<Content>
									<EditPopup data={item} />
								</Content>
								<Trigger>
									<button
										class="text-white bg-red-400 font-medium rounded-lg text-xs px-2 py-2 mr-2 hover:bg-red-600"
										><Icon path={mdiPencil} /></button
									>
								</Trigger>
							</Modal>

							<Modal basic>
								<Content>
									<PromoteToXyz status={item.status} shipId={item.id} ship={item} />
								</Content>
								<Trigger>
									<button
										class="text-white bg-red-400 font-medium rounded-lg text-xs px-2 py-2 mr-2 hover:bg-red-600"
										><Icon path={mdiRocket} /></button
									>
								</Trigger>
							</Modal>

						{/if}
						<Modal basic>
							<Content class="text-wrap">
								<h1>Here is a markdown version for highway!</h1>
								{#await fetch(`/api/time/export?id=${item.id}`).then(r => r.text()) then text}
<pre   class="text-sm sm:text-base inline-flex text-left items-center space-x-4 bg-gray-800 text-white rounded-lg p-4 pl-6 text-wrap m-5">
	{text}
</pre>
								{/await}
							</Content>
							<Trigger>
								<button
									class="text-white bg-blue-400 font-medium rounded-lg text-xs px-2 py-2 mr-2 hover:bg-red-600 disabled:bg-gray-400"
									><Icon path={mdiExport} /></button>
							</Trigger>
						</Modal>
						<p class="text-orange-700">{shortenDesc(item.description)}</p>
						<div id="attributes">
							<!-- is there a better way to do this? yes, did it work? no. -->
							{#if item.status === 'SHIPPED'}
								<span
									class={`my-2 inline-block rounded-full px-6 pb-2 pt-2.5 font-medium shadow-md transition duration-150 ease-in-out hover:bg-green-500 hover:shadow-lg bg-green-400 text-white`}
									>{formatName(item.status)}</span
								>
							{:else if item.status !== 'SHIPPED' && item.status !== 'draft'}
								<span
									class={`my-2 inline-block rounded-full px-6 pb-2 pt-2.5 font-medium shadow-md transition duration-150 ease-in-out hover:bg-yellow-500 hover:shadow-lg bg-yellow-400 text-yellow-700`}
									>{formatName(item.status)}</span
								>
							{/if}
							{#if item.status === 'draft'}
								<span
									class={`my-2 inline-block rounded-full px-6 pb-2 pt-2.5 font-medium shadow-md transition duration-150 ease-in-out hover:bg-red-500 hover:shadow-lg bg-red-400 text-white`}
									>{formatName(item.status)}</span
								>
							{/if}
						</div>
					</div>
				</div>
			{:else}
				{#if item.status == 'SHIPPED'}
					<a href="/buy?id={item.id}">
						<div class="bg-orange-100 rounded-xl p-4">
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
								<h2 class="text-black font-bold text-lg" style="margin-top: -15px;">
									{item.title}
								</h2>
								<p class="text-gray-700">@{item.author}</p>
								<p class="text-orange-700">{shortenDesc(item.description)}</p>
							</div>
						</div>
					</a>
				{/if}
				{#if item.status !== 'SHIPPED'}
					<a href="/preview?id={item.id}">
						<div class="bg-orange-100 rounded-xl p-4">
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
								<h2 class="text-black font-bold text-lg" style="margin-top: -15px;">
									{item.title}
								</h2>
								<p class="text-gray-700">@{item.author}</p>
								<p class="text-orange-700">{shortenDesc(item.description)}</p>
							</div>
						</div>
					</a>
				{/if}
			{/if}
		</div>
	{/each}
</div>
