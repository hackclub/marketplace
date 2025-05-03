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
	export async function onAction(action) {
		fetch('/api/ship/action', {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('_secret_watchword')}`
			},
			method: 'POST',
			body: JSON.stringify({
				action,
				id: properData.id
			})
		}).then(() => {
			alert('Time ' + action.toLowerCase());
		});
	}
</script>

<div>
	<details>
		<summary
			><div>
				<img
					src="https://cachet.dunkirk.sh/users/{properData.userId}/r"
					alt="user avatar"
					class="w-12 h-12 rounded-full border-2 border-white"
				/>
				<h2>ID: {properData?.id} - Status: {properData.status}</h2>
			</div></summary
		>
		<div class="rounded m-2 p-2 shadow-lg">
			{#if !properData}
				<img alt="loading img" src={loadingGif} />
			{:else}
				<h1 class="font-bold text-2xl">{properData.Name}</h1>
				<p class="text-gray-700">
					by @{properData.slack_user_name}
				</p>
				<br />
				<p>
					Ship is currently at {properData.status}, please review it and then click one of the
					following buttons below:
				</p>
				<br />
				<img src={properData.cover_image_url} alt="cover image" class="rounded-lg" />
				<br />
				<a target="_blank" href={properData.github_url}>Github URL</a>
				<a target="_blank" href={properData.demo_url}> Demo URL</a>
				<!-- make me a button group for 2 buttons-->
				<div class="flex justify-between">
					<button
						class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
						disabled={properData.approved_for_hq}
						on:click={() => onAction('APPROVED_HQ')}>Approve to hq review</button
					>
					<button
						class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
						disabled={properData.approved_for_grant}
						on:click={() => onAction('APPROVED_GRANT_REVIEW')}>Approve to grant review</button
					>
					<button
						class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
						disabled={properData.approved_for_grant}
						on:click={() => onAction('APPROVED_HQ_DIGITAL_REVIEW')}>Approve to hq digital</button
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