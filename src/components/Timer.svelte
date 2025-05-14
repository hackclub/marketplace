<script lang="ts">
	// This is a Svelte component for a timer that tracks the time spent on a task.
	// It allows starting, stopping, and sending data related to the timer session.
	// The component uses Svelte's reactivity and lifecycle methods to manage state and fetch data from an API.
	import { onMount, onDestroy } from 'svelte';

	export let timeString = '00:00:00';
	export let startedAt = Date.now();
	export let timeData: { session?: boolean; video_link?: string; createdAt?: string } | null = null;
	export let shipId: string | null = null;

	let isPaused = false;
	let pausedAt: number | null = null;
	let totalPausedTime = 0;
	let timerInterval: NodeJS.Timeout;

	function updateTimer() {
		if (!isPaused) {
			const currentTime = Date.now();
			const elapsedTime = currentTime - startedAt - totalPausedTime;
			timeString = new Date(elapsedTime).toISOString().substr(11, 8);
		}
	}

	timerInterval = setInterval(updateTimer, 1000);

	async function togglePause() {
		try {
			await fetch('/api/time/pause', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ isPaused: !isPaused })
			});

			if (isPaused) {
				const pauseDuration = Date.now() - (pausedAt || 0);
				totalPausedTime += pauseDuration;
				pausedAt = null;
			} else {
				pausedAt = Date.now();
			}
			isPaused = !isPaused;
		} catch (error) {
			console.error('Failed to toggle pause state:', error);
			alert('Failed to toggle pause state. Please try again.');
		}
	}

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
		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries());
		console.log(data);
		if(!data.wormhole_link) data.wormhole_link = undefined;
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
			if (!isPaused) {
				fetch('/api/time/beat');
			}
		}, 60 * 1000);
	});

	onDestroy(() => {
		clearInterval(timerInterval);
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
				End! (adds to ur time)
			</button>
		</form>
		<p class="mt-4 text-gray-700">Current time: {timeString}</p>
		<div class="flex space-x-2">
			<button
				class="mt-2 bg-yellow-500 text-white rounded-lg px-4 py-2 font-bold hover:bg-yellow-600"
				on:click={togglePause}
			>
				{isPaused ? 'Resume' : 'Pause'}
			</button>
			<button
				class="mt-2 bg-red-500 text-white rounded-lg px-4 py-2 font-bold hover:bg-red-600"
				on:click={stopSession}
			>
				Stop! (deletes this session)
			</button>
		</div>
	{:else}
		<button
			class="bg-green-500 text-white rounded-lg px-4 py-2 font-bold hover:bg-green-600"
			on:click={startSession}
		>
			Start!
		</button>
	{/if}
{/if}
