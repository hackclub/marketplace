import { PRIVATE_AIRTABLE_API_KEY, PRIVATE_AIRTABLE_BASE_ID } from '$env/static/private';
import prisma from '$lib/prisma';
export async function DELETE(req: Request) {
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
	// const structuredBody = {
	//     // video_link: body.link,
	//     Status: "not_approved",
	//     "user": [sessionData.airtable_id],
	//     ship: [body.ship_id],
	//     isPaused: false,
	//     // pausedAt: null,
	// }
	// const reqq = await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/timerecorder`, {
	//     method: "PATCH",
	//     headers: {
	//         "Authorization": `Bearer ${PRIVATE_AIRTABLE_API_KEY}`,
	//         "Content-Type": "application/json"
	//     },
	//     body: JSON.stringify({
	//         records: [{
	//             fields: structuredBody
	//         }],
	//     })
	// }).then(r => r.text())

	//gotta do this for fraud protection
	const timeData = await prisma.time.findFirst({
		where: {
			userId: sessionData.slackId,
			'AND': {
				video_link: null
			}
		}
	});
	if (!timeData)
		return new Response('No time data found', {
			status: 404
		});

	// await prisma.time.update({
	// 	where: {
	// 		id: body.id
	// 	},
	// 	data: {
	// 		video_link: body.video_link,
	// 		wormhole_link: body.wormhole_link,
	// 		memo: body.memo,
	// 		total_time_in_seconds: Math.round(Date.now() / 1000 - timeData.createdAt.getTime() / 1000)
	// 	}
	// });
    await prisma.time.delete({
        where: {
            id:timeData.id
        }
    })
	
	return new Response('OK BYE BYE', {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
