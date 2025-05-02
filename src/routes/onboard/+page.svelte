<script lang="ts">
	import NavBar from '../NavBar.svelte';

	// --- State ---
	// Define a type for the ship data if known, otherwise use `any[]` or `unknown[]`
	interface ShipData {
		// Define structure, e.g., id: string; name: string; etc.
		[key: string]: any; // Placeholder
	}
	let shipData = $state<ShipData[]>([]); // Renamed from `data` for clarity
	let loading = $state(true);
	let loggedIn = $state(false);
	let displayWarningMessage = $state(false);
	let isSubmitting = $state(false); // Track form submission state

	// --- Constants ---
	const API_SETTINGS_UPDATE = '/api/settings/update';
	const API_SHIPS_HOMEPAGE = '/api/ships/homepage';
	const REDIRECT_ON_SUCCESS = '/ships';
	const REDIRECT_ON_LOGOUT = '/';

	// --- Utility Functions ---
	function getCookie(name: string): boolean {
		// More robust check
		const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
		return !!match;
	}

	// --- Effects ---
	$effect(() => {
		// This effect runs once after the component mounts
		const checkAuthAndFetchData = async () => {
			// Check login status first
			const sessionExists = getCookie('session');
			loggedIn = sessionExists;

			if (!sessionExists) {
				console.log('No session cookie found. Redirecting to login.');
				location.pathname = REDIRECT_ON_LOGOUT;
				return; // Stop execution if not logged in
			}

			// Check for warning message param
			try {
				const urlParams = new URLSearchParams(window.location.search);
				displayWarningMessage = urlParams.get('a') === '1';
			} catch (e) {
				console.error('Could not parse URL parameters:', e);
				displayWarningMessage = false; // Default to false if URL parsing fails
			}

			// Fetch initial data (optional, as it's not used in the template)
			try {
				const res = await fetch(API_SHIPS_HOMEPAGE);
				if (res.ok) {
					shipData = await res.json();
					console.log('Homepage ship data loaded:', shipData);
				} else {
					console.error('Failed to fetch homepage ship data:', res.status, res.statusText);
					// Optionally handle this error, e.g., show a message to the user
				}
			} catch (error) {
				console.error('Error fetching homepage ship data:', error);
				// Optionally handle this error
			} finally {
				loading = false; // Data fetching attempt finished
			}
		};

		checkAuthAndFetchData();

		// No cleanup needed for this effect
		// return () => { /* cleanup logic if needed */ }
	});

	// --- Form Handling ---
	interface FormDataShape {
		'hcb-email': string;
		address_line_1: string;
		address_line_2: string;
		address_city: string;
		address_state: string;
		address_postal_code: string;
		address_country: string;
		country: string; // This is the 'Places you ship to' field
	}

	interface SettingsUpdatePayload {
		hcb_email: string;
		address_line_1: string;
		address_line_2: string;
		address_city: string;
		address_state: string;
		address_postal_code: string;
		address_country: string;
		region_for_shipping_and_receiving: string[]; // Expecting an array
	}

	async function handleSubmit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
		event.preventDefault();
		if (isSubmitting) return; // Prevent double submission
		isSubmitting = true;

		const formData = new FormData(event.currentTarget);
		// Use type assertion carefully, ensure form names match FormDataShape keys
		const formValues = Object.fromEntries(formData.entries()) as unknown as FormDataShape;

		console.log('Form Data Submitted:', formValues);

		const payload: SettingsUpdatePayload = {
			hcb_email: formValues['hcb-email'],
			address_line_1: formValues.address_line_1,
			address_line_2: formValues.address_line_2 || '', // Handle potentially empty optional field
			address_city: formValues.address_city,
			address_state: formValues.address_state,
			address_postal_code: formValues.address_postal_code,
			address_country: formValues.address_country,
			region_for_shipping_and_receiving: [formValues.country] // Wrap 'country' value in an array
		};

		try {
			const response = await fetch(API_SETTINGS_UPDATE, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			if (response.ok) {
				console.log('Settings updated successfully.');
				// Consider parsing response if API sends useful data back: await response.json();
				location.pathname = REDIRECT_ON_SUCCESS;
			} else {
				console.error('Failed to update settings:', response.status, response.statusText);
				const errorBody = await response.text(); // Or response.json() if API sends JSON errors
				console.error('Error details:', errorBody);
				alert(`Failed to update settings: ${response.statusText}. ${errorBody}`); // Simple user feedback
			}
		} catch (error) {
			console.error('Error submitting form:', error);
			alert(
				`An error occurred while submitting the form: ${error instanceof Error ? error.message : String(error)}`
			); // Simple user feedback
		} finally {
			isSubmitting = false;
		}
	}

	// --- Styling Helpers ---
	// Define common input classes to avoid repetition
	const baseInputClasses =
		'p-2 mt-2 mb-2 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]';
	const fullWidthInputClasses = `${baseInputClasses} w-full`;
	const limitedWidthInputClasses = `${baseInputClasses} max-w-3xl`; // Assuming this was intentional

	// Custom font class (ensure 'Phantom Sans' is configured or available)
	const phantomFontClass = "font-['Phantom_Sans']";
</script>

<NavBar />

<div class="ml-[150px] text-left pb-10">
	<h1 class="text-4xl font-bold {phantomFontClass}">Hi, welcome to Hack Club Market!</h1>
	<p class="py-7 text-wrap w-1/2">
		Welcome to the market! We will need to collect some information before you can proceed.
	</p>

	{#if loading}
		<p>Loading...</p>
	{:else if !loggedIn}
		<p>Redirecting...</p>
	{:else}
		<form
			class="bg-[#FFECDA] {phantomFontClass} p-8 mb-[50px] rounded-xl w-1/2 px-10"
			onsubmit={handleSubmit}
		>
			{#if displayWarningMessage}
				<div
					class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 w-full"
				>
					<strong class="font-bold">Hey!</strong>
					<span class="block sm:inline"> You need to onboard first before you can continue.</span>
				</div>
			{/if}

			<div class="mb-4">
				<label for="hcb-email" class="text-xl font-bold">HCB email</label>
				<input
					id="hcb-email"
					name="hcb-email"
					type="email"
					placeholder="hcb@hackclub.com"
					required
					class={fullWidthInputClasses}
				/>
			</div>

			<fieldset class="space-y-4">
				<legend class="text-xl font-bold mb-2">Shipping Address</legend>
				<div>
					<label for="address_line_1" class="block text-lg font-medium">Address Line 1</label>
					<input
						id="address_line_1"
						name="address_line_1"
						type="text"
						placeholder="15 Falls Rd"
						required
						class={fullWidthInputClasses}
					/>
				</div>

				<div>
					<label for="address_line_2" class="block text-lg font-medium"
						>Address Line 2 (Optional)</label
					>
					<input
						id="address_line_2"
						name="address_line_2"
						type="text"
						placeholder="Apt 202"
						class={fullWidthInputClasses}
					/>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label for="address_city" class="block text-lg font-medium">City</label>
						<input
							id="address_city"
							name="address_city"
							type="text"
							placeholder="Shelburne"
							required
							class="{baseInputClasses} w-full"
						/>
					</div>
					<div>
						<label for="address_state" class="block text-lg font-medium">State / Province</label>
						<input
							id="address_state"
							name="address_state"
							type="text"
							placeholder="VT"
							required
							class="{baseInputClasses} w-full"
						/>
					</div>
					<div>
						<label for="address_postal_code" class="block text-lg font-medium"
							>Postal / Zip Code</label
						>
						<input
							id="address_postal_code"
							name="address_postal_code"
							type="text"
							placeholder="05482"
							required
							class="{baseInputClasses} w-full"
						/>
					</div>
					<div>
						<label for="address_country" class="block text-lg font-medium">Country</label>
						<input
							id="address_country"
							name="address_country"
							type="text"
							placeholder="USA"
							required
							class="{baseInputClasses} w-full"
						/>
					</div>
				</div>
			</fieldset>

			<div class="mt-6 mb-4">
				<label for="country" class="text-xl font-bold">Places you ship to</label>
				<select class="{limitedWidthInputClasses} block" id="country" name="country" required>
					<option value="US" selected>USA</option>
					<option value="CA">Canada</option>
					<option value="UK">United Kingdom</option>
					<option value="AU">Australia</option>
					<option value="EU">Europe</option>
					<option value="IN">India</option>
					<option value="Everywhere">Anywhere! (note this may include having to pay customs)</option
					>
				</select>
			</div>

			<div class="flex justify-center items-center mt-8 mb-10">
				<button
					type="submit"
					class="text-white bg-red-400 rounded-lg text-2xl font-bold px-10 py-2 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed {phantomFontClass}"
					disabled={isSubmitting}
				>
					{#if isSubmitting}
						Submitting...
					{:else}
						Next step!
					{/if}
				</button>
			</div>
		</form>
	{/if}
</div>
