<script>
	import { onMount } from 'svelte';

	export let data = {};
	console.log(data);
	export let isUnderSomeReview = data.status !== 'SHIPPED' && data.status !== 'DRAFT';
	function submitForm(e) {
		e.preventDefault();
		const formData = new FormData(e.target);
		const formObject = Object.fromEntries(formData.entries());
		console.log(formObject, data);
		fetch('/api/ships/update', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: data.id,
				...formObject
			})
		})
			.then((r) => r.text())
			.then((json) => {
				console.log(json);
				alert(json);
			});
	}
	// for isUnderSomeReview please check if its being activly reviwed in its status..
</script>

<form class="bg-secondary rounded-xl" on:submit={submitForm}>
	<div class="bg-secondary p-5 rounded-xl w-full my-10">
		{#if isUnderSomeReview}
			<div class="bg-red-300 p-5 m-2 rounded-lg">
				<h2 class="font-bold font-2xl text-red-700">
					Your ship is under review rn, if you need to change something in it dm @Neon or @Charmunk
				</h2>
			</div>
		{/if}
		<div class="grid">
			<span class="text-xl font-bold">Project name</span>
			<input
				style="margin-bottom: 10px;"
				id="project-name"
				name="projectName"
				value={data.title}
				disabled={isUnderSomeReview}
				type="text"
				placeholder="My amazing PCB"
				class="p-2 mt-2 border rounded-lg bg-input border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7] disabled:bg-[#EADAC7]"
			/> <br />
			<span class="text-xl font-bold">Description</span>
			<input
				style="margin-bottom: 10px;"
				id="project-desc"
				name="description"
				disabled={isUnderSomeReview}
				value={data.description}
				type="text"
				minlength="10"
				placeholder="Oh yea this will be my amazing pcb for xyz blah blah blah;3"
				class="p-2 mt-2 border rounded-lg bg-input border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7] disabled:bg-[#EADAC7]"
			/> <br />
			<span class="text-xl font-bold">Git Repo</span>
			<input
				style="margin-bottom: 10px;"
				id="project-git"
				value={data.github_url}
				disabled={isUnderSomeReview}
				type="url"
				name="gitRepo"
				placeholder="https://github.com/hackclub/site/"
				class="w-3xl p-2 mt-2 border rounded-lg bg-input border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7] disabled:bg-[#EADAC7]"
			/> <br />
			<span class="text-xl font-bold">README URL</span>
			<input
				style="margin-bottom: 5px;"
				id="project-readme"
				type="url"
				value={data.readme_url}
				disabled={isUnderSomeReview}
				name="readmeUrl"
				placeholder="https://raw.githubusercontent.com/hackclub/site/refs/heads/main/README.md"
				class="w-3xl p-2 mt-2 border rounded-lg bg-input border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7] disabled:bg-[#EADAC7]"
			/> <br />
			<span class="text-xl font-bold">Demo URL</span>
			<input
				style="margin-bottom: 5px;"
				id="project-readme"
				type="url"
				value={data.demo_url}
				disabled={isUnderSomeReview}
				name="demo_url"
				placeholder="https://raw.githubusercontent.com/hackclub/site/refs/heads/main/README.md"
				class="w-3xl p-2 mt-2 border rounded-lg bg-input border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7] disabled:bg-[#EADAC7]"
			/> <br />
			<span class="text-xl font-bold">Cover link</span>
			<input
				style="margin-bottom: 5px;"
				id="project-coverlink"
				name="image_url"
				type="url"
				value={data.coverLink}
				disabled={isUnderSomeReview}
				placeholder="https://raw.githubusercontent.com/hackclub/site/refs/heads/main/README.md"
				class="w-3xl p-2 mt-2 border rounded-lg bg-input border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7] disabled:bg-[#EADAC7]"
			/> <br />
			<!-- <span class="text-xl font-bold">Locations you will ship to</span>
        <input 
          style="margin-bottom: 5px;"
          id="project-ship-locations" 
          type="text" 
          placeholder="" 
          class="w-3xl p-2 mt-2 border rounded-lg bg-input border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7]" 
        /> <br> -->
			<span class="text-xl font-bold">Estimated Cost of Production (USD)</span>
			<input
				style="margin-bottom: 30px;"
				id="project-cost"
				name="cost"
				disabled={isUnderSomeReview}
				type="number"
				value={data.cost}
				placeholder="30"
				required
				class="w-3xl p-2 mt-2 border rounded-lg bg-input border-[#EADAC7] focus:outline-none focus:ring-2 focus:ring-[#EADAC7] disabled:bg-[#EADAC7]"
			/>
		</div>

		<div class="flex justify-center items-center mt-5">
			<button
				type="submit"
				style="margin-bottom: 50px;"
				class="text-white bg-red-400 rounded-lg text-2xl font-bold px-20 py-2 hover:bg-red-600 disabled:bg-[#EADAC7]"
			>
				Update
			</button>
		</div>
	</div>
</form>
