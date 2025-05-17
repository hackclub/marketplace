import { dev } from '$app/environment';
import { type RequestEvent } from '@sveltejs/kit';
import {
	PRIVATE_AIRTABLE_API_KEY,
	PRIVATE_AIRTABLE_BASE_ID,
	PRIVATE_SLACK_BOT_TOKEN
} from '$env/static/private';
import prisma from '$lib/prisma';


export async function GET({ request, cookies, url  }: RequestEvent) {
	// validate session moment
	const session = cookies.get('session');
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
    const id = url.searchParams.get('id');
	// const body = await request.json();
	// console.log(body);
	// if (!body) return new Response('no body');
	// const parsedBody = ztime.safeParse(body);
	// if (!parsedBody.success) {
	// 	console.log(parsedBody.error, 'a');
	// 	return new Response(`Body errors:\n`+parsedBody.error.errors.map((e) => e.message).join('\n'), {
	// 		status: 400
	// 	});
	// }
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
	const timeData = await prisma.time.findMany({
		where: {
			userId: sessionData.slackId,
			AND: {
				video_link: {
                    not: null
                },
                status: {
                    not: "REJECTED"
                },
                shipId: id
			}
		}
	});
    console.log(timeData)
	if (!timeData && timeData.length !== 0)
		return new Response('No time data found', {
			status: 404
		});
let str = ``
for(const td of timeData) {
    str += `## ${td.createdAt.toString()} to ${td.updatedAt.toString()} - ${(td.total_time_in_seconds! / 60 / 60).toFixed(2)} hours (total of ${td.total_time_in_seconds} seconds) ${td.wormhole_link? `[Wormhole Link](${td.wormhole_link})` : ""}
    <video src="${td.video_link}" controls></video>
    ${td.memo ?? "No memo??"}\n`
}

	return new Response(str || "No ship data :3", {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
