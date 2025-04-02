<script>
	let data = [];
	let loading = true;
	let loggedIn = false;
	import NavBar from '../NavBar.svelte';
	// Perform the fetch request when the component is mounted
	import { onMount } from 'svelte';

	onMount(async () => {
		function getCookie(name) {
			return document.cookie.split('; ').find((row) => row.startsWith(name + '=')) !== undefined;
		}

		// Check for the specific cookie
		loggedIn = getCookie('session');
		// query for elements
	});
</script>

<NavBar />

<form
	onsubmit={async (e) => {
		e.preventDefault(); // Prevent the default form submission behavior
		const data = new FormData(e.target);
		const dd = Object.fromEntries(data.entries());
		console.log(dd);
		const response = await fetch('/api/ships/draft', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: dd.projectName,
				description: dd.description,
				github_url: dd.gitRepo,
				readme_url: dd.readmeUrl,
				cost: parseInt(dd.cost)
			})
		}).then((d) => d.text());
		if (response.includes('OK')) {
			alert('Ship created!');
			window.location.href = '/ships';
		} else {
			alert('Error creating ship, please try again.');
		}
	}}
	style="font-family: Phantom Sans; padding-top: 10px;"
	class="flex justify-center items-center min-h-screen"
>
	<div class="bg-[#FFECDA] font-phantom p-5 rounded-xl w-fit">
		<div class="grid">
			<span class="text-xl font-bold">Project name</span>
			<input
				style="margin-bottom: 10px;"
				id="project-name"
				name="projectName"
				type="text"
				placeholder="My amazing PCB"
				class="w-3xl p-2 mt-2 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]"
			/> <br />
			<span class="text-xl font-bold">Description</span>
			<input
				style="margin-bottom: 10px;"
				id="project-desc"
				name="description"
				type="text"
				placeholder="Oh yea this will be my amazing pcb for xyz blah blah blah;3"
				class="p-2 mt-2 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]"
			/> <br />
			<span class="text-xl font-bold">Git Repo</span>
			<input
				style="margin-bottom: 10px;"
				id="project-git"
				type="url"
				name="gitRepo"
				placeholder="https://github.com/hackclub/site/"
				class="w-3xl p-2 mt-2 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]"
			/> <br />
			<span class="text-xl font-bold">README URL</span>
			<input
				style="margin-bottom: 5px;"
				id="project-readme"
				type="url"
				name="readmeUrl"
				placeholder="https://raw.githubusercontent.com/hackclub/site/refs/heads/main/README.md"
				class="w-3xl p-2 mt-2 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]"
			/> <br />
			<!-- <span class="text-xl font-bold">Locations you will ship to</span>
	<input 
	  style="margin-bottom: 5px;"
	  id="project-ship-locations" 
	  type="text" 
	  placeholder="" 
	  class="w-3xl p-2 mt-2 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]" 
	/> <br> -->
			<span class="text-xl font-bold">Estimated Cost of Production (USD)</span>
			<input
				style="margin-bottom: 30px;"
				id="project-cost"
				name="cost"
				type="number"
				placeholder="30"
				required
				class="w-3xl p-2 mt-2 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]"
			/>
		</div>

		<div class="flex justify-center items-center mt-5">
			<button
				style="font-family: Phantom Sans; margin-bottom: 50px;"
				class="text-white bg-red-400 rounded-lg text-2xl font-bold px-87 py-2 hover:bg-red-600"
			>
				ship a project
			</button>
		</div>
	</div>
</form>
