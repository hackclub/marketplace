import { PRIVATE_SLACK_BOT_TOKEN } from '$env/static/private';
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
	let ship = null;
	const body = await req.request.json();
	try {
		ship = await prisma.ship.update({
			where: {
				id: body.id,
				is_under_some_review_rn: false
			},
			data: {
				Name: body.name,
				Description: body.description,
				requested_grant_amount: body.cost ? parseInt(body.cost) : undefined,
				github_url: body.github_url,
				demo_url: body.demo_url,
				cover_image_url: body.image_url,
				readme_url: body.readme_url
			}
		});
	} catch (e) {
		console.error(e);
		return new Response(JSON.stringify({ message: 'Ship not found or not ready to be updated' }), {
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
			text: `User <@${sessionData.slackId}> has just changed data in there ship (an update) dont ask why im even logging this`,
			channel: `C08GZ6QF97Z`
		})
	}).then((r) => r.json());
	return new Response('Ship updated!');
}
