<script>
	import loadingGif from '@/assets/loading.gif';

	export let data = {
		shipId: undefined,
		id: undefined,
		userId: undefined,
		video_link: undefined,
		total_time_in_seconds: undefined,
		wormhole_link: undefined
	};
	export let properData = null;
	export async function onOpen() {
		if (properData) return;
		properData = await fetch('/api/ships/get-product?shipId=' + data.shipId, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('_secret_watchword')}`
			}
		}).then((r) => r.json());
		console.log(properData);
	}
	export async function onAction(action) {
		fetch('/api/time/action', {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('_secret_watchword')}`
			},
			method: 'POST',
			body: JSON.stringify({
				action,
				shipId: data.shipId,
				timeId: data.id
			})
		}).then(() => {
			alert('Time ' + action.toLowerCase());
		});
	}
</script>

<div>
	<details on:toggle={onOpen}>
		<summary
			><div>
				<img
					src="https://cachet.dunkirk.sh/users/{data?.userId}/r"
					alt="user avatar"
					class="w-12 h-12 rounded-full border-2 border-white"
				/>
				<h2>ID: {data?.id}</h2>
			</div></summary
		>
		<div class="rounded m-2 p-2 shadow-lg">
			{#if !properData}
				<img alt="loading img" src={loadingGif} />
			{:else}
				<h1 class="font-bold text-2xl">{properData.title}</h1>
				<p class="text-gray-700">
					@{properData.author} -- session lasted for {(
						(data.total_time_in_seconds ?? 0) / 60
					).toFixed(2)} minutes --
					{#if data.wormhole_link}
						<a
							href={data.wormhole_link}
							class="text-blue-500 hover:underline"
							target="_blank"
							rel="noopener noreferrer">Wormhole link</a
						>
					{/if}
				</p>
				<br />
				<video muted class="w-full h-64 rounded-lg" autoplay loop controls src={data.video_link}>
				</video>
				<br />
				<!-- make me a button group for 2 buttons-->
				<div class="flex justify-between">
					<button
						class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
						on:click={() => onAction('APPROVED')}>Approve</button
					>
					<button
						class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
						on:click={() => onAction('REJECTED')}>Reject</button
					>
				</div>
			{/if}
		</div>
	</details>
</div>
