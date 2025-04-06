import { PRIVATE_AIRTABLE_BASE_ID, PRIVATE_AIRTABLE_API_KEY } from '$env/static/private';
import prisma from '$lib/prisma';
import { json } from '@sveltejs/kit';

export async function GET(req: Request) {
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
	// const body = await req.request.json();
	// console.log(body);
	// if (!body) return new Response('no body');
	// const user = await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/users?filterByFormula=${encodeURIComponent(`slack_id="${sessionData.slackId}"`)}`, {
	//     headers: {
	//         Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
	//     }
	// }).then(r => r.json()).then(udata => udata.records[0])
	// grab user data moment
const statusData = await prisma.time.findFirst({
    where: {
        userId: sessionData.slackId,
        'AND': {
            video_link: null
        }
    }
});
// json
if(!statusData) return json({ message: `no json data`, session: false });
return json({
    ...statusData,
    session: true
});
	// return new Response('OK CREATED', {
	// 	status: 201,
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 	}
	// });
}
