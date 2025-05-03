<script lang="ts">
	import NavBar from '../NavBar.svelte';
	import { onMount } from 'svelte';

	interface Settings {
		hcb_email: string;
		slack_name: string;
		address: string;
		reigons: string;
		address_line_1?: string;
		address_line_2?: string;
		address_city?: string;
		address_state?: string;
		address_postal_code?: string;
		address_country?: string;
	}

	let loading = false;
	let saving = false;
	let success = false;
	let error = '';
	let settings: Settings | null = null;

	onMount(async () => {
		await loadSettings();
	});

	async function loadSettings() {
		loading = true;
		error = '';
		try {
			const response = await fetch('/api/settings/get');
			if (!response.ok) {
				throw new Error('Failed to load settings');
			}
			settings = await response.json();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load settings';
		} finally {
			loading = false;
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const data = Object.fromEntries(formData.entries());
		saving = true;
		success = false;
		error = '';

		try {
			const response = await fetch('/api/settings/update', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					hcb_email: data['hcb-email'],
					address_line_1: data['address_line_1'],
					address_line_2: data['address_line_2'],
					address_city: data['address_city'],
					address_state: data['address_state'],
					address_postal_code: data['address_postal_code'],
					address_country: data['address_country'],
					region_for_shipping_and_receiving: [data['country']]
				})
			});

			if (!response.ok) {
				throw new Error('Failed to update settings');
			}

			success = true;
			await loadSettings();
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			saving = false;
		}
	}
</script>

<NavBar />
<div class="max-w-2xl mx-auto px-4 py-8">
	<h1 class="text-3xl sm:text-4xl font-bold text-red-500 mb-2">Settings</h1>
	<p class="mb-6 text-gray-700">Update your shipping and contact information below.</p>

	{#if loading}
		<div class="flex justify-center items-center py-8">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
		</div>
	{:else if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
	{:else if success}
		<div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
			Settings saved successfully!
		</div>
	{:else if settings}
		<form class="bg-secondary rounded-xl p-6" on:submit={handleSubmit}>
			<div class="mb-4">
				<label for="hcb-email" class="text-lg font-bold block mb-1">HCB email</label>
				<input
					id="hcb-email"
					name="hcb-email"
					type="email"
					placeholder="hcb@hackclub.com"
					value={settings.hcb_email || ''}
					required
					class="w-full p-2 border rounded-lg bg-input border-input-border focus:outline-none focus:ring-2 focus:ring-input-border"
				/>
			</div>
			<div class="mb-4">
				<label for="address_line_1" class="text-lg font-bold block mb-1">Address Line 1</label>
				<input
					id="address_line_1"
					name="address_line_1"
					type="text"
					placeholder="15 Falls Rd"
					value={settings.address_line_1 || ''}
					class="w-full p-2 border rounded-lg bg-input border-input-border focus:outline-none focus:ring-2 focus:ring-input-border"
				/>
			</div>
			<div class="mb-4">
				<label for="address_line_2" class="text-lg font-bold block mb-1">Address Line 2</label>
				<input
					id="address_line_2"
					name="address_line_2"
					type="text"
					placeholder="Apt 202"
					value={settings.address_line_2 || ''}
					class="w-full p-2 border rounded-lg bg-input border-input-border focus:outline-none focus:ring-2 focus:ring-input-border"
				/>
			</div>
			<div class="mb-4">
				<label for="address_city" class="text-lg font-bold block mb-1">City</label>
				<input
					id="address_city"
					name="address_city"
					type="text"
					placeholder="Shelburne"
					value={settings.address_city || ''}
					class="w-full p-2 border rounded-lg bg-input border-input-border focus:outline-none focus:ring-2 focus:ring-input-border"
				/>
			</div>
			<div class="mb-4">
				<label for="address_state" class="text-lg font-bold block mb-1">State</label>
				<input
					id="address_state"
					name="address_state"
					type="text"
					placeholder="VT"
					value={settings.address_state || ''}
					class="w-full p-2 border rounded-lg bg-input border-input-border focus:outline-none focus:ring-2 focus:ring-input-border"
				/>
			</div>
			<div class="mb-4">
				<label for="address_postal_code" class="text-lg font-bold block mb-1">Postal/Zip Code</label
				>
				<input
					id="address_postal_code"
					name="address_postal_code"
					type="text"
					placeholder="05482"
					value={settings.address_postal_code || ''}
					class="w-full p-2 border rounded-lg bg-input border-input-border focus:outline-none focus:ring-2 focus:ring-input-border"
				/>
			</div>
			<div class="mb-4">
				<label for="address_country" class="text-lg font-bold block mb-1">Your Country</label>
				<input
					id="address_country"
					name="address_country"
					type="text"
					placeholder="USA"
					value={settings.address_country || ''}
					class="w-full p-2 border rounded-lg bg-input border-input-border focus:outline-none focus:ring-2 focus:ring-input-border"
				/>
			</div>
			<div class="mb-4">
				<label for="country" class="text-lg font-bold block mb-1">Places you ship to</label>
				<select
					id="country"
					name="country"
					class="w-full p-2 border rounded-lg bg-input border-input-border focus:outline-none focus:ring-2 focus:ring-input-border"
					value={settings.reigons || 'US'}
				>
					<option value="US">USA</option>
					<option value="CA">Canada</option>
					<option value="UK">United Kingdom</option>
					<option value="AU">Australia</option>
					<option value="EU">Europe</option>
					<option value="IN">India</option>
					<option value="Everywhere">Anywhere! (note this may include having to pay customs)</option
					>
				</select>
			</div>
			<div class="flex justify-center items-center mt-5">
				<button
					type="submit"
					class="text-white bg-red-400 rounded-lg text-lg sm:text-2xl font-bold px-10 py-2 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={saving}
				>
					{saving ? 'Saving...' : 'Save changes'}
				</button>
			</div>
		</form>
	{/if}
</div>
