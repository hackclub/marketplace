import { sentrySvelteKit } from "@sentry/sveltekit";
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { readFileSync } from 'fs';
import { defineConfig } from 'vite';
function getGitCommitHash() {
	try {
		return readFileSync('.git/refs/heads/main', 'utf-8').trim();
	} catch {
		return 'unknown';
	}
}
export default defineConfig({
	plugins: [sentrySvelteKit({
        sourceMapsUploadOptions: {
            org: "neon-h1",
            project: "hackermarket-fj"
        }
    }), sveltekit(), tailwindcss()],
	server: {
		allowedHosts: ['.ngrok-free.app', '.loca.lt']
	},
	preview: {
		allowedHosts: ['market.a.selfhosted.hackclub.com']
	},
	define: {
		__GIT_COMMIT_HASH__: JSON.stringify(getGitCommitHash())
	}
});