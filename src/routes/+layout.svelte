<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	let { children } = $props();
</script>
<preconnect href="https://hc-cdn.hel1.your-objectstorage.com/" />
{@render children()}

<style>
	:global(body) {
		background-color: #f4decf;
	}
</style>
