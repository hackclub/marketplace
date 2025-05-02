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
				status: 'UNDER_HQ_DIGITAL_REVIEW',
				approved_for_digital: true,
				is_under_some_review_rn: false
			},
			data: {
				status: 'UNDER_HQ_GRANT_REVIEW',
				is_under_some_review_rn: true
			}
		});
	} catch (e) {
		return new Response(
			JSON.stringify({ message: 'Ship not found or not ready to be promoted yet.' }),
			{
				status: 404
			}
		);
	}
	//  send noti to slack channel
	await fetch(`https://slack.com/api/chat.postMessage`, {
		headers: {
			Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
			'Content-Type': 'application/json; charset=utf-8'
		},
		method: 'POST',
		body: JSON.stringify({
			text: `User <@${sessionData.slackId}> has promoted a ship (${body.id}) to Grant review??! (please adjust there grant amount) -- please review it or something`,
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
			text: `Your ship (${ship.Name}) is in the pending grant review!`,
			channel: sessionData.slackId
		})
	})
		.then((r) => r.json())
		.then(console.log);
	return new Response('Ship promoted to grant review!');
}
