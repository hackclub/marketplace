<script>
import { page } from '$app/state';
console.log(page.error)
</script>
<div class="min-h-screen flex flex-col items-center justify-center">
	{#if page.error.message == "Not Found"}
	<h1 class="text-4xl text-center text-red-500 font-semibold" style="font-family: Phantom Sans;">
		yikes! 404 error
	</h1>
	<p style="font-family: Phantom Sans;">strange, orpheus surely isn't told about this page...</p>
	<div class="mt-4">
		<a
			style="font-family: Phantom Sans;"
			class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl"
			href="/"
		>
			go back home
		</a>
	</div>
	{:else}
	<h1 class="text-4xl text-center text-red-500 font-semibold" style="font-family: Phantom Sans;">
		yikes! Site broke!
	</h1>
	<p style="font-family: Phantom Sans;">strange, orpheus surely didnt do this right?? (report has been sent to neon)</p>
	<div class="mt-4">
	</div>
	{/if}
</div>
