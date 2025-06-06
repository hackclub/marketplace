import {
	PRIVATE_AIRTABLE_BASE_ID,
	PRIVATE_AIRTABLE_API_KEY,
	PRIVATE_SLACK_BOT_TOKEN
} from '$env/static/private';
import prisma from '$lib/prisma';
export async function POST(req: Request) {
	const session = req.cookies.get('session');
	if (!session) {
		return new Response(JSON.stringify({ message: 'No session' }), {
			status: 401
		});
	}
	const sessionData = await prisma.user.findFirst({
		where: {
			token: session
		}
	});
	if (!sessionData || !sessionData.slackId) {
		return new Response(JSON.stringify({ message: 'No session data' }), {
			status: 401
		});
	}
	const body = await req.request.json();
	// fetch the ship from airtable
	let ship = null;
	try {
		ship = await prisma.ship.update({
			where: {
				id: body.id,
				status: 'UNDER_HQ_GRANT_REVIEW',
				is_under_some_review_rn: false,
				approved_for_hq: false
			},
			data: {
				status: 'UNDER_HQ_REVIEW',
				is_under_some_review_rn: true
			}
		});
	} catch (e) {
		return new Response(JSON.stringify({ message: 'Ship not found or not ready ;p' }), {
			status: 404
		});
	}
	//  send noti to slack channel
	await fetch(`https://slack.com/api/chat.postMessage`, {
		headers: {
			Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
			'Content-Type': 'application/json; charset=utf-8'
		},
		method: 'POST',
		body: JSON.stringify({
			text: `User <@${sessionData.slackId}> has promoted a ship (${body.id}) to hq  review (${ship.github_url}, ${ship.demo_url}) -- cc acon to review once it arrives (this means the user has marked it as mailed to hq)`,
			channel: `C08GZ6QF97Z`
		})
	}).then((r) => r.json());
	await fetch(`https://slack.com/api/chat.postMessage`, {
		headers: {
			Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
			'Content-Type': 'application/json; charset=utf-8'
		},
		method: 'POST',
		body: JSON.stringify({
			text: `Your ship (${ship.Name}) is in the pending hq review! once someone at hq reviews it you will be able to move to the last step and...... ship it out to people! `,
			channel: sessionData.slackId
		})
	})
		.then((r) => r.json())
		.then(console.log);
	return new Response('Ship promoted to HQ review!');
}
