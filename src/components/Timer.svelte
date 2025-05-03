<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		timeString: string;
		startedAt: number;
		timeData: { session?: boolean; video_link?: string; createdAt?: string } | null;
		shipId: string | null;
	}

	let { timeString, startedAt, timeData, shipId }: Props = $props();

	setInterval(() => {
		timeString = new Date(Date.now() - startedAt).toISOString().substr(11, 8);
	}, 1000);

	export async function startSession() {
		const timerData = await fetch('/api/time/start', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ shipId })
		}).then((r) => r.text());
		startedAt = Date.now();
		console.log(timerData);
		timeData = await fetch('/api/time/status').then((r) => r.json());
	}

	export async function stopSession() {
		await fetch('/api/time/stop', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ shipId })
		});
		timeData = null;
		startedAt = Date.now();
		alert('Session stopped!');
	}

	export async function sendOutTheData(e: Event) {
		e.preventDefault();
		const form = e.target;
		const formData = new FormData(form! as HTMLFormElement);
		const data = Object.fromEntries(formData.entries());
		console.log(data);
		await fetch('/api/time/end', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}).then((r) => {
			if (r.ok) {
				alert('Session ended!');
				timeData = null;
			} else {
				r.text().then(alert);
			}
		});
	}

	onMount(async () => {
		const timerData = await fetch('/api/time/status');
		const timer = await timerData.json();
		console.log(timer);
		timeData = timer;
		if (timer.session) {
			startedAt = new Date(timer.createdAt).getTime();
		}
		setInterval(() => {
			fetch('/api/time/beat');
		}, 60 * 1000);
	});
</script>

<h2 class="font-bold text-lg">Timer</h2>
<p class="italic text-gray-600">
	Once you start the timer, if no heartbeats are received from a tab in 15 minutes, it will delete
	your session and DM you.
</p>
<br />

{#if timeData}
	{#if timeData.session}
		<form on:submit={sendOutTheData} class="space-y-4">
			<div>
				<label for="video_link" class="block font-medium text-gray-700">
					Video URL (cannot be your wormhole video, please record a video at the end showing
					progress)
				</label>
				<input
					id="video_link"
					name="video_link"
					type="url"
					required
					minlength="2"
					class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="https://longasscdnuserplshere.com"
					bind:value={timeData.video_link}
				/>
			</div>
			<div>
				<label for="wormhole_link" class="block font-medium text-gray-700"
					>Wormhole URL (optional but recommended)</label
				>
				<input
					id="wormhole_link"
					name="wormhole_link"
					type="url"
					minlength="60"
					class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="https://hackclub.slack.com/archives/C08MC7PQ40G/p1744073240800789"
				/>
			</div>
			<div>
				<label for="memo" class="block font-medium text-gray-700">Memo (what did you do?)</label>
				<textarea
					id="memo"
					name="memo"
					required
					minlength="5"
					rows="2"
					class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
				></textarea>
			</div>
			<button
				type="submit"
				class="bg-red-500 text-white rounded-lg px-4 py-2 font-bold hover:bg-red-600"
			>
				End!
			</button>
		</form>
		<p class="mt-4 text-gray-700">Current time: {timeString}</p>
		<button
			class="mt-2 bg-red-500 text-white rounded-lg px-4 py-2 font-bold hover:bg-red-600"
			on:click={stopSession}
		>
			Stop!
		</button>
	{:else}
		<button
			class="bg-green-500 text-white rounded-lg px-4 py-2 font-bold hover:bg-green-600"
			on:click={startSession}
		>
			Start!
		</button>
	{/if}
{/if}