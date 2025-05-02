<script>
	import { onMount } from 'svelte';
	import { DatePicker } from '@svelte-plugins/datepicker';
	import { format } from 'date-fns';

	let startDate = new Date();
	let dateFormat = 'MM/dd/yy';
	let isOpen = false;

	const toggleDatePicker = () => (isOpen = !isOpen);

	const formatDate = (dateString) => {
		if (isNaN(new Date(dateString))) {
			return '';
		}

		return (dateString && format(new Date(dateString), dateFormat)) || '';
	};
	let formattedStartDate = formatDate(startDate);

	const onChange = () => {
		startDate = new Date(formattedStartDate);
	};
	$: formattedStartDate = formatDate(startDate);

	// super good page right here
	export let status = 'man idk';
	export let shipId = null;
	// yea we need it all ;p
	export let ship = null;
	function getCookie(name) {
		return document.cookie.split('; ').find((row) => row.startsWith(name + '='));
	}
	let userData = JSON.parse(decodeURIComponent(getCookie('user-info').split('=')[1]));
	console.log(ship);
	let form = {
		code_url: ship.github_url,
		playable_url: ship.demo_url,
		first_name: '',
		last_name: '',
		email: userData.hcb_email,
		screenshot: ship.coverLink,
		description: ship.Description || ship.description,
		github_username: '',
		address_line_1: '',
		address_line_2: '',
		country: '',
		city: '',
		state: '',
		zipcode: '',
		bday: formattedStartDate,
		ship_id: shipId,
		id: shipId
	};
	console.log(form);
	let newPromotion = 'null';
	const statuses = `DRAFT
    UNDER_HQ_DIGITAL_REVIEW
    UNDER_HQ_GRANT_REVIEW
    UNDER_HQ_REVIEW
    SHIPPED`
		.trim()
		.split('\n')
		.map((e) => e.trim());
	newPromotion = statuses[statuses.indexOf(status) + 1] || 'null';
	let underReview = true;

	function formatName(name) {
		return name
			.replace(/_/g, ' ')
			.toLowerCase()
			.replace(/\b\w/g, (char) => char.toUpperCase());
	}
	function getRoute(name) {
		console.log(name);
		switch (name) {
			case 'DRAFT':
				return 'draft';
			case 'UNDER_HQ_DIGITAL_REVIEW':
				return 'promote-to-hq-digital-review';
			case 'UNDER_HQ_GRANT_REVIEW':
				return 'promote-to-grant-review';
			case 'UNDER_HQ_REVIEW':
				return 'promote-to-hq-review';
			case 'SHIPPED':
				return 'shipped';
		}
		//        return name;
	}
	async function submitToNextReviewProcess() {
		// gulp idk
		let route = getRoute(newPromotion);
		console.log(route);
		fetch('/api/ships/' + route, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: shipId
			})
		})
			.then((r) => r.text())
			.then((r) => {
				alert(r);
				window.location.reload();
			});
	}
	async function handleSubmit() {
		return fetch('/api/ships/shipped', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(form)
		})
			.then((r) => r.text())
			.then((t) => {
				alert(t);
				console.log(t);
				debugger;
				location.reload();
			});
	}
	onMount(() => {
		fetch('/api/ships/isUnderReview?shipId=' + shipId)
			.then((r) => {
				if (r.status == 400) {
					underReview = false;
				}
			})
			.catch((e) => {});
	});
</script>

<div class="rounded-xl">
	{#if newPromotion !== 'SHIPPED'}
		<p class="font-semibold">
			Would you like to promote your ship from {formatName(status)} -> {formatName(newPromotion)}?
		</p>
		<button
			class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
			disabled={underReview}
			on:click={submitToNextReviewProcess}>Yes</button
		>
	{:else}
		<form
			class="max-w-md mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-4"
			on:submit|preventDefault={handleSubmit}
		>
			<h2 class="text-2xl font-semibold text-center">Shipping Form</h2>
			<p class="text-md font-italic text-center">
				<em>For the final ship, we need some info for the ysws db!</em>
			</p>

			<div>
				<label class="block text-sm font-medium text-gray-700">First name</label>
				<input
					type="text"
					bind:value={form.first_name}
					class="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700">Last name</label>
				<input
					type="text"
					bind:value={form.last_name}
					class="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
				/>
			</div>
			<div>
				<div>
					<label class="block text-sm font-medium text-gray-700">Description</label>
					<input
						type="text"
						bind:value={form.description}
						class="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700">Birthday</label>
					<div class="w-full">
						<DatePicker bind:isOpen bind:startDate>
							<input
								type="text"
								placeholder="Select date"
								bind:value={formattedStartDate}
								on:click={toggleDatePicker}
							/>
						</DatePicker>
					</div>
				</div>
				<label class="block text-sm font-medium text-gray-700">Street Address</label>
				<input
					type="text"
					bind:value={form.address_line_1}
					class="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700">Address 2</label>
				<input
					type="text"
					bind:value={form.address_line_2}
					class="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
				/>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label class="block text-sm font-medium text-gray-700">City</label>
					<input
						type="text"
						bind:value={form.city}
						class="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700">State</label>
					<input
						type="text"
						bind:value={form.state}
						class="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700">ZIP Code</label>
				<input
					type="text"
					bind:value={form.zipcode}
					class="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700">Country</label>
				<input
					type="text"
					bind:value={form.country}
					class="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700">Code url</label>
				<input
					type="url"
					bind:value={form.code_url}
					class="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 hover:cursor-disabled disabled:bg-gray-100"
					disabled
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700">Demo/playable url</label>
				<input
					type="url"
					bind:value={form.playable_url}
					class="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 hover:cursor-disabled disabled:bg-gray-100"
					disabled
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700">Email </label>
				<input
					type="text"
					bind:value={form.email}
					class="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 hover:cursor-disabled disabled:bg-gray-100"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700">Github username</label>
				<input
					type="text"
					bind:value={form.github_username}
					class="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700">Cover image</label>
				<input
					type="url"
					bind:value={form.screenshot}
					class="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 hover:cursor-disabled disabled:bg-gray-100"
					disabled
				/>
				<img src={form.screenshot} alt="cover" class="w-32 h-32 mt-2 rounded-lg" />
			</div>
			<button
				type="submit"
				class="w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition"
				on:click={handleSubmit}>Submit</button
			>
		</form>
	{/if}
</div>
