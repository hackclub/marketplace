<script lang="ts">
	let data = [];
	let loading = true;
	let loggedIn = false;
	let displayWarningMessage = false;
	import NavBar from '../NavBar.svelte';
	import { onMount } from 'svelte';
	onMount(async () => {
		displayWarningMessage = new URL(window.location.href).searchParams.get('a') == '1'
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
			// bye bye!!!
			location.pathname = '/';
		}
	});
</script>

<NavBar />
<div style="margin-left: 150px;" class="text-left">
	<h1 class="text-4xl font-bold" style="font-family: Phantom Sans;margin-left: 0px">
		Hi, welcome to Hack Club Market!
	</h1>
	<p class="py-7 text-wrap w-1/2">
		Welcome to the market! We will need to collect some information before you can proceed.
	</p>
	{#if displayWarningMessage}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 m py-3 rounded relative w-1/2">
			<strong class="font-bold">Hey!</strong>
			<span class="block sm:inline">
			You are tryna do stuff without being fully onboarded, 
			</span>
		</div>
	{/if}
	<form
		style="background-color: #FFECDA; font-family: Phantom Sans; padding-top: 10px; margin-bottom: 50px;"
		class="rounded-xl w-1/2"
		onsubmit={(e) => {
			e.preventDefault();
			const formData = new FormData(e.target);
			const data = Object.fromEntries(formData.entries());
			console.log(data); // Log the form data to the console (for debugging)
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
				});
		}}
	>
	
		<div>
			<label for="hcb-email" class="text-xl font-bold ml-10">HCB email</label>
			<br />
			<input
				id="hcb-email"
				name="hcb-email"
				type="email"
				placeholder="hcb@hackclub.com"
				required
				class="max-w-3xl p-2 mt-2 mb-2 ml-10 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]"
			/>
		</div>
		<div>
			<div class="ml-10">
				<label for="address" class="text-xl font-bold">Address Line 1</label>
			</div>

			<input
				id="address_line_1"
				name="address_line_1"
				type="text"
				placeholder="15 Falls Rd"
				class="max-w-3xl w-xl p-2 mb-2 mt-2 ml-10 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]"
			/>
		</div>
	
		<div>
			<div class="ml-10">
				<label for="address" class="text-xl font-bold">Address Line 2</label>
			</div>

			<input
				id="address_line_2"
				name="address_line_2"
				type="text"
				placeholder="Apt 202"
				class="max-w-3xl w-xl p-2 mt-2 mb-2 ml-10 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]"
			/>
		</div>

		
		<div>
			<div class="ml-10">
				<label for="address" class="text-xl font-bold">City</label>
			</div>

			<input
				id="address_city"
				name="address_city"
				type="text"
				placeholder="Shelburne"
				class="max-w-3xl p-2 mt-2 mb-2 ml-10 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]"
			/>
		</div>
		<div>
			
		<div>
			<div class="ml-10">
				<label for="address" class="text-xl font-bold">State</label>
			</div>

			<input
				id="address_state"
				name="address_state"
				type="text"
				placeholder="VT"
				class="max-w-3xl p-2 mt-2 mb-2 ml-10 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]"
			/>
		</div>
		<div>
			<div>
				<div class="ml-10">
					<label for="address" class="text-xl font-bold">Postal/Zip Code</label>
				</div>
	
				<input
					id="address_postal_code"
					name="address_postal_code"
					type="text"
					placeholder="05482"
					class="max-w-3xl p-2 mt-2 mb-2 ml-10 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]"
				/>
			</div>


			<div>
				<div class="ml-10">
					<label for="address" class="text-xl font-bold">Your Country</label>
				</div>
	
				<input
					id="address_country"
					name="address_country"
					type="text"
					placeholder="USA"
					class="max-w-3xl p-2 mt-2 mb-2 ml-10 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]"
				/>
			</div>
			<div>
			<label for="country" class="text-xl font-bold ml-10">Places you ship to</label>
			<br />
			<select
				class="max-w-3xl p-2 mb-2 mt-2 ml-10 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]"
				id="country"
				name="country"
			>
				<option value="US" selected>USA</option>
				<option value="CA">Canada</option>
				<option value="UK">United Kingdom</option>
				<option value="AU">Australia</option>
				<option value="EU">Europe</option>
				<option value="IN">India</option>
				<option value="Everywhere">Anywhere! (note this may include having to pay customs)</option>
			</select>
		</div>
		<div class="flex justify-center items-center mt-5">
			<button
				style="font-family: Phantom Sans; margin-bottom: 40px;"
				class="text-white bg-red-400 rounded-lg text-2xl font-bold px-10 pt-2 pb-2 hover:bg-red-600"
			>
				Next step!
			</button>
		</div>
	</form>
</div>
