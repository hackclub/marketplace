<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	let { children } = $props();
	function isMobile() {
        return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || navigator.maxTouchPoints > 1;
    }

    onMount(() => {
        if (isMobile() && window.location.pathname !== "/no-mobile") {
            window.location.href = "/no-mobile"; // no mobile smh
        }
    });
</script>

<style>
	:global(body) {
		background-color: #F4DECF;
	}
</style>

{@render children()}
