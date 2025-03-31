<script context="module">
	import Device from 'svelte-device-info';
</script>

<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	let { children } = $props();
	function isMobile() {
		return Device.isPhone || navigator.maxTouchPoints > 1 || window.visualViewport.width <= 576;
	}

	onMount(() => {
		if (
			isMobile() &&
			window.location.pathname !== '/no-mobile' &&
			!localStorage.getItem('im_not_on_mobile_i_promise') // uhh this doesn't work i tried lmao but ok ig -mart
		) {
			window.location.href = '/no-mobile'; // no mobile smh
		}
	});
</script>

<header>
	<Navbar />
</header>

{@render children()}

<style>
	:global(body) {
		background-color: #f4decf;
	}
</style>
