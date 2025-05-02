<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	let { children } = $props();
</script>

{@render children()}

<style>
	:global(body) {
		background-color: #f4decf;
	}
</style>
