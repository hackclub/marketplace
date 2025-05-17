import { dev } from '$app/environment';
import { type RequestEvent } from '@sveltejs/kit';
import {
	PRIVATE_AIRTABLE_API_KEY,
	PRIVATE_AIRTABLE_BASE_ID,
	PRIVATE_SLACK_BOT_TOKEN
} from '$env/static/private';
import { reSyncUsersShipTime } from '$lib/apistuff';
import prisma from '$lib/prisma';
import { z } from 'zod';

interface PausePeriod {
	start: number;
	end: number | null;
}

function parseSlackMessageUrl(url: string) {
	const match = url.match(/archives\/(.*?)\/p(\d{16})/);
	if (!match) throw new Error('Invalid Slack message URL format');
	const channel = match[1];
	const rawTs = match[2];
	const ts = `${rawTs.slice(0, 10)}.${rawTs.slice(10)}`;
	return { channel, ts };
}

const ztime = z.object({
	video_link: z.string().url().startsWith('https'),
	memo: z.string().min(2).max(500),
	wormhole_link: z
		.string()
		.url()
		.startsWith("https")
		.regex(/https:\/\/hackclub\.slack\.com\/archives\/[A-Za-z0-9]+\/p[0-9]+/i)
		.optional()
		.nullable(),
	pauseHistory: z.array(z.object({
		start: z.number(),
		end: z.number().nullable()
	})).optional()
});

export async function POST({ request, cookies }: RequestEvent) {
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
	const body = await request.json();
	console.log(body);
	if (!body) return new Response('no body');
	const parsedBody = ztime.safeParse(body);
	if (!parsedBody.success) {
		console.log(parsedBody.error, 'a');
		return new Response(`Body errors:\n`+parsedBody.error.errors.map((e) => e.message).join('\n'), {
			status: 400
		});
	}
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
			AND: {
				video_link: null
			}
		}
	});
	if (!timeData)
		return new Response('No time data found', {
			status: 404
		});
	// validate wormhole msg
if(body.wormhole_link) {
	const msgId = parseSlackMessageUrl(body.wormhole_link);
	if (msgId.channel !== 'C08MC7PQ40G' && !dev) {
		return new Response('Invalid wormhole link (WRONG CHANNEL)', {
			status: 400
		});
	}

	try {
		// check if msg exists
		await fetch('https://slack.com/api/conversations.history', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				channel: msgId.channel,
				latest: msgId.ts,
				inclusive: true,
				limit: 1
			})
		})
			.then((r) => r.json())
			.then(async (data) => {
				console.log(data.messages);
				if (!data.ok) {
					throw new Error(data.error);
				}
				if (data.messages.length === 0) {
					throw new Error('Message not found');
				}
				if (!data.messages[0].text.includes(sessionData.slackId)) {
					throw new Error('Message does not contain user ID');
				}
				// check if the userId is equal to xyz
				if (data.messages[0].user !== 'U08L96NQPCN') {
					throw new Error('Message author is invalid');
				}
				// send msg to threaded msg
				await fetch(`https://slack.com/api/chat.postMessage`, {
					method: 'POST',
					body: JSON.stringify({
						channel: msgId.channel,
						text: `${dev ? '[DEV]' : ''} :done: Your wormhole link is being used for hackermarket - <@${sessionData.slackId}>`,
						thread_ts: msgId.ts
					}),
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`
					}
				})
					.then((r) => r.json())
					.then((data) => {
						if (!data.ok) {
							throw new Error(data.error);
						}
					});
			});
	} catch (e: any) {
		console.log(e);
		return new Response('Invalid wormhole link:\n' + e.message, {
			status: 400
		});
	}
}
	await prisma.time.update({
		where: {
			id: timeData.id
		},
		data: {
			video_link: body.video_link,
			wormhole_link: body.wormhole_link,
			memo: body.memo,
			pauseHistory: body.pauseHistory || [],
			total_time_in_seconds: (() => {
				const totalTime = Math.round(Date.now() / 1000 - timeData.createdAt.getTime() / 1000);
				const pauseHistory = (body.pauseHistory || []) as PausePeriod[];
				const totalPausedTime = pauseHistory.reduce((total: number, pause: PausePeriod) => {
					if (pause.end) {
						return total + (pause.end - pause.start) / 1000;
					}
					return total + (Date.now() - pause.start) / 1000;
				}, 0);
				return Math.round(totalTime - totalPausedTime);
			})()
		}
	});

	reSyncUsersShipTime(timeData.shipId);
	await fetch(`https://slack.com/api/chat.postMessage`, {
		headers: {
			Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
			'Content-Type': 'application/json; charset=utf-8'
		},

		method: 'POST',
		body: JSON.stringify({
			text: `${dev ? '[DEV]' : ''} user <@${sessionData.slackId}> ended timer on ship ${timeData.shipId}`,
			channel: 'C08GZ6QF97Z'
		})
	}).then((r) => r.json());
	return new Response('OK BYE BYE', {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
