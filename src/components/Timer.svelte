<script lang="ts">
	// This is a Svelte component for a timer that tracks the time spent on a task.
	// It allows starting, stopping, and sending data related to the timer session.
	// The component uses Svelte's reactivity and lifecycle methods to manage state and fetch data from an API.
	import { onMount } from 'svelte';

	export let timeString = '00:00:00';
	export let startedAt = Date.now();
	export let timeData: { session?: boolean; video_link?: string; createdAt?: string } | null = null;
	export let shipId: string | null = null;
	setInterval(() => {
		timeString = new Date(Date.now() - startedAt).toISOString().substr(11, 8);
	}, 1000);
	export async function startSession() {
		const timerData = await fetch('/api/time/start', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				shipId: shipId
			})
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
			body: JSON.stringify({
				shipId: shipId
			})
		});
		timeData = null;
		startedAt = Date.now();
		alert('Session stopped!');
	}
	export async function sendOutTheData(e) {
		e.preventDefault();
		const form = e.target;
		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries());
		console.log(data);
		await fetch('/api/time/end', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		alert('Session ended!');
		timeData = null;
	}
	onMount(async () => {
		const timerData = await fetch('/api/time/status');
		const timer = await timerData.json();
		console.log(timer);
		timeData = timer;
		if (timer.session) {
			startedAt = new Date(timer.createdAt).getTime();
		}
	});
</script>

<h2 class="font-bold text-lg">Timer</h2>
<p class="italic">
	Once u start the timer, if no heartbeats are recived from a tab in 15 mins it will delete ur
	session and dm u
</p>
<br />
<!-- <p>{timeString}</p> -->
{#if timeData}
	{#if timeData.session}
		<!-- if there is a session show active time string -->
		<!-- show input for "video url" -->
		<form on:submit={sendOutTheData}>
			<div>
				<label for="video_link"
					>Video URL (cant be ur wormhole video, please record a video at the end showing progress)</label
				>
				<input
					id="video_link"
					name="video_link"
					type="url"
					required
					minlength="2"
					class="border-2 border-gray-400 rounded-lg"
					placeholder="https://longasscdnuserplshere.com"
					bind:value={timeData.video_link}
				/>
			</div>
			<div>
				<label for="wormhole_link">Wormhole URL</label>
				<input
					id="wormhole_link"
					name="wormhole_link"
					type="url"
					required
					minlength="60"
					class="border-2 border-gray-400 rounded-lg"
					placeholder="https://hackclub.slack.com/archives/C08MC7PQ40G/p1744073240800789"
				/>
			</div>
			<div>
				<label for="memo">Memo (what did you do??)</label>
				<br />
				<textarea id="memo" name="memo" required minlength="5" rows="2" class=""></textarea>
			</div>
			<button type="submit" class="bg-red-400 text-white rounded-lg px-4 py-2 font-bold"
				>End!</button
			>
		</form>
		<p>Current time: {timeString}</p>
		<button class="bg-red-400 text-white rounded-lg px-4 py-2 font-bold" on:click={stopSession}
			>Stop!</button
		>
	{:else}
		<button class="bg-red-400 text-white rounded-lg px-4 py-2 font-bold" on:click={startSession}
			>Start!</button
		>
	{/if}
{/if}
