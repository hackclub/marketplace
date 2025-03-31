import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	server: {
		allowedHosts: ['.ngrok-free.app']
	},
	preview: {
		allowedHosts: ['h4ko0os0w4ccckgsk8gcw0wo.a.selfhosted.hackclub.com']
	}
});
