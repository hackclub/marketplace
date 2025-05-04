import { dev } from '$app/environment';
import { PRIVATE_AIRTABLE_BASE_ID, PRIVATE_AIRTABLE_API_KEY, PRIVATE_SLACK_BOT_TOKEN } from '$env/static/private';
import prisma from '$lib/prisma';

export async function POST(req: Request) {
	// validate session moment
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
	console.log(body);
	if (!body) return new Response('no body');
	// const user = await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/users?filterByFormula=${encodeURIComponent(`slack_id="${sessionData.slackId}"`)}`, {
	//     headers: {
	//         Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
	//     }
	// }).then(r => r.json()).then(udata => udata.records[0])
	// grab user data moment
	await prisma.time.create({
		data: {
			shipId: body.shipId,
			userId: sessionData.slackId
		}
	});
	await fetch(`https://slack.com/api/chat.postMessage`, {
		headers: {
			Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
			'Content-Type': 'application/json; charset=utf-8'
		},

		method: 'POST',
		body: JSON.stringify({
			text: `${dev ? '[DEV]' : ''} user <@${sessionData.slackId}> started timer on ship ${body.shipId}`,
			channel: 'C08GZ6QF97Z'
		})
	}).then((r) => r.json());
	return new Response('OK CREATED', {
		status: 201,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
