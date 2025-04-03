import { PUBLIC_REDIRECT_URL, PUBLIC_SLACK_CLIENT_ID } from '$env/static/public';
import {
	PRIVATE_AIRTABLE_API_KEY,
	PRIVATE_AIRTABLE_BASE_ID,
	PRIVATE_SLACK_BOT_TOKEN,
	PRIVATE_SLACK_CLIENT_SECRET
} from '$env/static/private';
import { parseJwt } from '$lib/jwt';
import { json, redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { dev } from '$app/environment';
export async function GET(req) {
	if (req.cookies.get('session')) throw redirect(302, '/ships');
	const code = req.url.searchParams.get('code');

	// exchange code
	console.log(code);

	if (!code) {
		return new Response(JSON.stringify({ message: 'Missing code' }), {
			status: 400
		});
	}

	const exchangeURL = `https://slack.com/api/openid.connect.token?client_id=${PUBLIC_SLACK_CLIENT_ID}&client_secret=${PRIVATE_SLACK_CLIENT_SECRET}&code=${code}&redirect_uri=${PUBLIC_REDIRECT_URL + '/api/oauth/slack/callback'}&grant_type=authorization_code`;
	const exchangeResponse = await fetch(exchangeURL, { method: 'POST' });
	if (exchangeResponse.status !== 200) {
		return new Response(JSON.stringify({ message: 'Bad Oauth2 Response' }), {
			status: 400
		});
	}
	let ok_to_redirect: boolean | string = false;
	try {
		const rjson = await exchangeResponse.json();
		console.log(rjson);
		if (rjson.error) {
			return json({ error: rjson.error }, { status: 500 });
		}
		// jwt
		const jwt = parseJwt(rjson.id_token);
		// if (jwt["https://slack.com/team_domain"] !== "hackclub") {
		//     return json({ error: "Not hackclub" }, { status: 401 });
		// }
		console.log(jwt);
		// check if user has a session
		const userData = await prisma.user.findFirst({
			where: {
				slackId: jwt['https://slack.com/user_id'] || jwt.sub
			}
		});
		if (userData) {
			req.cookies.set('session', userData.token, { path: '/', httpOnly: false });
			// throw redirect(301, "/ships")
			ok_to_redirect = '/ships';
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
			// throw redirect(301, "/onboard")
			req.cookies.set('on-board', 'true', { path: '/', httpOnly: false });
			ok_to_redirect = '/onboard';
		}
	} catch (e) {
		console.error(e);
		return new Response(JSON.stringify({ message: `Oops. ${e.message}` }));
	} finally {
		if (ok_to_redirect) {
			throw redirect(302, ok_to_redirect);
		}
	}
}
