import { PRIVATE_CRON_SECRET, PRIVATE_SLACK_BOT_TOKEN } from '$env/static/private';
import { dev } from '$app/environment';
import {
	cleanUpOldTimers,
	draftAllRejectedShips,
	promoteUsersFromDigitalReview,
	sendHCBGrants
} from '$lib/cron';

export async function GET(req: Request) {
	const headers = Object.fromEntries(req.request.headers.entries());
	console.log(headers);
	if (headers.authorization !== PRIVATE_CRON_SECRET && !dev) {
		return new Response('401 Unauthorized', { status: 401 });
	}
	console.debug(`CRON RAAAA (*/15)`);
	await fetch(`https://slack.com/api/chat.postMessage`, {
		headers: {
			Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
			'Content-Type': 'application/json; charset=utf-8'
		},

		method: 'POST',
		body: JSON.stringify({
			text: `${dev ? '[DEV]' : ''} CRON RAAAA (*/15) (every 15 mins)`,
			channel: 'C08GZ6QF97Z'
		})
	}).then((r) => r.json());
	// await draftAllRejectedShips()
	await Promise.all([
		sendHCBGrants(),
		promoteUsersFromDigitalReview(),
		draftAllRejectedShips(),
		cleanUpOldTimers()
	]);
	return new Response('200 OK - cron ran :3');
}
