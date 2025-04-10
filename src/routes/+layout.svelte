<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	let { children } = $props();
	function isMobile() {
		return (
			/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
			navigator.maxTouchPoints > 1 ||
			window.visualViewport.width <= 576
		);
	}
	onMount(() => {
		console.log('Git version: ', window.__GIT_COMMIT_HASH__);
		if (
			isMobile() &&
			window.location.pathname !== '/no-mobile' &&
			!localStorage.getItem('im_not_on_mobile_i_promise')
		) {
			window.location.href = '/no-mobile'; // no mobile smh
		}
	});
</script>

{@render children()}

<style>
	:global(body) {
		background-color: #f4decf;
	}
</style>
