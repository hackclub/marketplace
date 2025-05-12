<script lang="ts">
	let data = [];
	let loading = true;
	let loggedIn = false;
	let displayWarningMessage = false;
	import NavBar from '../NavBar.svelte';
	import { onMount } from 'svelte';

	onMount(async () => {
		displayWarningMessage = new URL(window.location.href).searchParams.get('a') == '1';
		try {
			const res = await fetch('/api/ships/homepage');
			if (res.ok) {
				data = await res.json();
			} else {
				console.error('Failed to fetch data');
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			loading = false;
		}

		function getCookie(name: string) {
			return document.cookie.split('; ').find((row) => row.startsWith(name + '=')) !== undefined;
		}

		loggedIn = getCookie('session');
		if (!loggedIn) {
			location.pathname = '/';
		}
	});
</script>

<NavBar />

<div class="flex justify-center px-4 sm:px-6 lg:px-8">
	<div class="max-w-3xl w-full">
		<h1 class="text-4xl font-bold font-sans text-center">
			Hi, welcome to Hack Club Market!
		</h1>

		<p class="py-7 text-center w-full max-w-2xl mx-auto">
			Welcome to the market! We will need to collect some information before you can proceed.
		</p>

		{#if displayWarningMessage}
			<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-full max-w-2xl mx-auto mb-4">
				<strong class="font-bold">Hey!</strong>
				<span class="block sm:inline"> You are tryna do stuff without being fully onboarded, </span>
			</div>
		{/if}

		<form
			class="bg-[#FFECDA] font-sans p-6 mb-12 rounded-xl w-full max-w-2xl mx-auto"
			onsubmit={(e) => {
				e.preventDefault();
				const formData = new FormData(e.target);
				const data = Object.fromEntries(formData.entries());
				fetch('/api/settings/update', {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json'
					},
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
				})
					.then((r) => r.text())
					.then(() => {
						location.pathname = '/ships';
						setTimeout(() => {
						window.location.href = "https://market.hackclub.com/ships"
						}, 250)
					});
			}}
		>
			<div class="mb-4">
				<label for="hcb-email" class="text-xl font-bold block mb-1">HCB email</label>
				<input
					id="hcb-email"
					name="hcb-email"
					type="email"
					placeholder="hcb@hackclub.com"
					required
					class="w-full p-2 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]"
				/>
			</div>

			<div class="mb-4">
				<label for="address_line_1" class="text-xl font-bold block mb-1">Address Line 1</label>
				<input
					id="address_line_1"
					name="address_line_1"
					type="text"
					placeholder="15 Falls Rd"
					class="w-full p-2 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]"
				/>
			</div>

			<div class="mb-4">
				<label for="address_line_2" class="text-xl font-bold block mb-1">Address Line 2</label>
				<input
					id="address_line_2"
					name="address_line_2"
					type="text"
					placeholder="Apt 202"
					class="w-full p-2 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]"
				/>
			</div>

			<div class="mb-4">
				<label for="address_city" class="text-xl font-bold block mb-1">City</label>
				<input
					id="address_city"
					name="address_city"
					type="text"
					placeholder="Shelburne"
					class="w-full p-2 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]"
				/>
			</div>

			<div class="mb-4">
				<label for="address_state" class="text-xl font-bold block mb-1">State</label>
				<input
					id="address_state"
					name="address_state"
					type="text"
					placeholder="VT"
					class="w-full p-2 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]"
				/>
			</div>

			<div class="mb-4">
				<label for="address_postal_code" class="text-xl font-bold block mb-1">Postal/Zip Code</label>
				<input
					id="address_postal_code"
					name="address_postal_code"
					type="text"
					placeholder="05482"
					class="w-full p-2 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]"
				/>
			</div>

			<div class="mb-4">
				<label for="address_country" class="text-xl font-bold block mb-1">Your Country</label>
				<input
					id="address_country"
					name="address_country"
					type="text"
					placeholder="USA"
					class="w-full p-2 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]"
				/>
			</div>

			<div class="mb-4">
				<label for="country" class="text-xl font-bold block mb-1">Places you ship to</label>
				<select
					id="country"
					name="country"
					class="w-full p-2 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]"
				>
					<option value="US" selected>USA</option>
					<option value="CA">Canada</option>
					<option value="UK">United Kingdom</option>
					<option value="AU">Australia</option>
					<option value="EU">Europe</option>
					<option value="IN">India</option>
					<option value="ASIA">Asia</option>
					<option value="Everywhere">Anywhere! (note this may include having to pay customs)</option>
				</select>
			</div>

			<div class="flex justify-center mt-6">
				<button
					class="text-white bg-red-400 rounded-lg text-2xl font-bold px-10 py-2 hover:bg-red-600"
				>
					Next step!
				</button>
			</div>
		</form>
	</div>
</div>
