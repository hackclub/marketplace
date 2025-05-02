import { PUBLIC_REDIRECT_URL, PUBLIC_SLACK_CLIENT_ID } from '$env/static/public';
import { PRIVATE_SLACK_BOT_TOKEN, PRIVATE_SLACK_CLIENT_SECRET } from '$env/static/private';
import { parseJwt } from '$lib/jwt';
import { json, redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function GET(req) {
	if (req.cookies.get('session')) throw redirect(302, '/ships');
	const code = req.url.searchParams.get('code');
	if (!code) {
		return new Response(JSON.stringify({ message: 'Missing code' }), {
			status: 400
		});
	}

	// Exchange w/ Slack
	const exchangeURL = `https://slack.com/api/openid.connect.token?client_id=${PUBLIC_SLACK_CLIENT_ID}&client_secret=${PRIVATE_SLACK_CLIENT_SECRET}&code=${code}&redirect_uri=${PUBLIC_REDIRECT_URL + '/api/oauth/slack/callback'}&grant_type=authorization_code`;
	const exchangeResponse = await fetch(exchangeURL, { method: 'POST' });
	if (exchangeResponse.status !== 200) {
		return new Response(JSON.stringify({ message: 'Bad OAuth2 Response' }), {
			status: 401
		});
	}

	try {
		const rjson = await exchangeResponse.json();
		if (rjson.error) {
			return json({ error: rjson.error }, { status: 500 });
		}
		const jwt = parseJwt(rjson.id_token);
		if (jwt['https://slack.com/team_domain'] !== 'hackclub') {
			return json({ error: 'Sign in with the Hack Club Slack workspace!' }, { status: 401 });
		}

		// check if user has a session
		const userData = await prisma.user.findFirst({
			where: {
				slackId: jwt['https://slack.com/user_id'] || jwt.sub
			}
		});
		if (userData) {
			req.cookies.set('session', userData.token, { path: '/', httpOnly: false });
			throw redirect(302, '/ships');
		} else {
			const sessionId = crypto.randomUUID().toString();
			// get slack user name
			const data = await fetch(
				`https://slack.com/api/users.info?user=${jwt['https://slack.com/user_id'] || jwt.sub}`,
				{
					headers: {
						Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`
					}
				}
			).then((r) => r.json());
			console.log(data);
			// create db entry here
			await prisma.user.create({
				data: {
					token: sessionId,
					slackId: jwt['https://slack.com/user_id'] || jwt.sub,
					slack_id: jwt['https://slack.com/user_id'] || jwt.sub,
					slack_name: data.user.real_name
				}
			});
			req.cookies.set('session', sessionId, { path: '/', httpOnly: false });
			req.cookies.set('on-board', 'true', { path: '/', httpOnly: false });
			throw redirect(302, '/onboard');
		}
	} catch (e) {
		console.error(e);
		return new Response(JSON.stringify({ message: `Oops. ${e}` }));
	}
}
