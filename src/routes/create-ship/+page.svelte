<script>

	let data = [];
	let loading = true;
	let loggedIn = false;
	// Perform the fetch request when the component is mounted
	import { onMount } from 'svelte';

	onMount(async () => {
		function getCookie(name) {
            return document.cookie.split('; ').find(row => row.startsWith(name + '=')) !== undefined;
        }

        // Check for the specific cookie
        loggedIn = getCookie("session");
		// query for elements
	const button = document.querySelector('button')
	button?.addEventListener('click', async () => {
		const projectName = document.querySelector('#project-name').value;
		const description = document.querySelector('#description').value;
		const gitRepo = document.querySelector('#git-repo').value;
		const readmeUrl = document.querySelector('#readme-url').value;
		const locations = document.querySelector('#locations').value;
		const cost = document.querySelector('#cost').value;

		const response = await fetch('/api/ships/draft', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				projectName,
				description,
				gitRepo,
				readmeUrl,
				locations,
				cost
			})
		});

		if (response.ok) {
			alert('Ship created successfully!');
			window.location.href = '/ships';
		} else {
			alert('Failed to create ship. Please try again.');
		}
	})
	});

</script>

<header>
	<nav class="border-gray-200 px-4 lg:px-6 py-5">
		<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
			<a href="#" class="flex items-center">
				<span style="font-family: Phantom Sans;" class="text-5xl font-semibold text-red-500"
					>hack club market</span
				>
			</a>
			
			<div class="flex items-center lg:order-2">
				<a
					style="font-family: Phantom Sans;"
					href="/about"
					class="text-red-500 font-medium rounded-lg text-2xl px-4 lg:px-5 py-2 mr-2 font-semibold"
					>about</a
				>
				{#if !loggedIn}
				<a
					style="font-family: Phantom Sans;"
					href="/api/oauth/slack/login"	
					class="text-white bg-red-500 font-medium rounded-lg text-2xl px-4 lg:px-5 py-2 mr-2 hover:bg-red-600"
					>sign in with slack</a
				>
			{:else}
			<a
					style="font-family: Phantom Sans;"
					href="/ships"
					class="text-white bg-red-400 font-medium rounded-lg text-2xl px-4 lg:px-5 py-2 mr-2 hover:bg-red-600"
					>Go to your ships</a
				>
			{/if}

			</div>
		</div>
	</nav>

</header>


<div style="background-color: #FFECDA; font-family: Phantom Sans; margin-left: 300px; margin-right: 300px; padding-top: 10px;" class="rounded-xl">
<span style="margin-left: 30px;" class="text-xl font-bold">Project name</span>
<input 
	  style="margin-left: 30px; margin-bottom: 30px;"
	  id="project-name" 
	  type="text" 
	  placeholder="" 
	  class="w-3xl p-2 mt-2 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]" 
	/>
	<span style="margin-left: 30px;" class="text-xl font-bold">Description</span>
	<input 
	  style="margin-left: 30px; margin-bottom: 30px;"
	  id="project-name" 
	  type="text" 
	  placeholder="" 
	  class="w-3xl p-2 h-50 mt-2 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]" 
	/>
	<span style="margin-left: 30px;" class="text-xl font-bold">Git Repo</span>
	<input 
	  style="margin-left: 30px; margin-bottom: 30px;"
	  id="project-name" 
	  type="text" 
	  placeholder="" 
	  class="w-3xl p-2 mt-2 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]" 
	/>
	<span style="margin-left: 30px;" class="text-xl font-bold">README URL</span>
	<input 
	  style="margin-left: 30px; margin-bottom: 30px;"
	  id="project-name" 
	  type="text" 
	  placeholder="" 
	  class="w-3xl p-2 mt-2 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]" 
	/>
	<span style="margin-left: 30px;" class="text-xl font-bold">Locations you will ship to</span>
	<input 
	  style="margin-left: 30px; margin-bottom: 30px;"
	  id="project-name" 
	  type="text" 
	  placeholder="" 
	  class="w-3xl p-2 mt-2 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]" 
	/>
	<span style="margin-left: 30px;" class="text-xl font-bold">Estimated Cost of Production</span>
	<input 
	  style="margin-left: 30px; margin-bottom: 30px;"
	  id="project-name" 
	  type="text" 
	  placeholder="" 
	  class="w-3xl p-2 mt-2 border rounded-lg bg-[#F4DECF] border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]" 
	/>
  </div>

  <div class="flex justify-center items-center mt-5">
  <button  style="font-family: Phantom Sans; margin-bottom: 50px;" class="text-white bg-red-400 rounded-lg text-2xl font-bold px-87 py-2 hover:bg-red-600">
	  ship a project
  </button>
</div>