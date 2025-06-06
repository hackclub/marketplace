import { PRIVATE_AIRTABLE_BASE_ID, PRIVATE_AIRTABLE_API_KEY, PRIVATE_SLACK_BOT_TOKEN } from '$env/static/private';
import prisma from '$lib/prisma';
import { z } from 'zod';
import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';
const zShip = z.object({
	name: z.string().min(2).max(50),
	description: z.string().min(2).max(500),
	cost: z.number().min(0).max(1000),
	github_url: z.string().url().startsWith('https'),
	readme_url: z.string().url().startsWith('https')
});
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
	console.log(body);
	if (!body) return new Response('no body');
	// validate da body
	const parsedBody = zShip.safeParse(body);
	if (!parsedBody.success) {
		console.log(parsedBody.error, 'a');
		return new Response(parsedBody.error.errors.map((e) => e.message).join('\n'), {
			status: 400
		});
	}
	// query users airtable
	// const user = await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/users?filterByFormula=${encodeURIComponent(`slack_id="${sessionData.slackId}"`)}`, {
	//     headers: {
	//         Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
	//     }
	// }).then(r => r.json()).then(udata => udata.records[0])

	// console.log()

	//todo: ummmmkmmm
	// const ships_to_in_correct_format = body.ships_to.filter((s:string)=>["US", "EU", "AU", "CA", "TESTCODE"].includes(s))
	// const structuredBody = {
	//     "Name": body.name,
	//     "Status": "draft",
	//     "users": [user.id],
	//     description: body.description,
	//     // cover_image: body.image_url,
	//     // slack_user_name: user.fields.slack_name,
	//     // slack_user_id: sessionData.slackId,
	//     github_url: body.github_url,
	//     readme_url: body.readme_url,
	//     // ships_to: ships_to_in_correct_format,
	//     requested_grant_amount: body.cost
	// }
	// for (const key in structuredBody) {
	//     //@ts-expect-error
	//     if (!structuredBody[key]) {
	//         return new Response(JSON.stringify({ message: `Missing field ${key}` }), {
	//             status: 400
	//         })
	//     }
	// }

	//     const reqq = await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/ships`, {
	//         method: "POST",
	//         headers: {
	//             "Authorization": `Bearer ${PRIVATE_AIRTABLE_API_KEY}`,
	//             "Content-Type": "application/json"
	//         },
	//         body: JSON.stringify({
	//             records: [{
	//                 fields: structuredBody
	//             }],
	//         })
	//     }).then(r => r.json())
	console.log(body);
	const ship = await prisma.ship.create({
		data: {
			Name: body.name,
			Description: body.description,
			Reviewer: null,
			requested_grant_amount: body.cost,
			status: 'DRAFT',
			approved_for_grant: false,
			approved_for_hq: false,
			approved_for_digital: false,
			github_url: body.github_url,
			demo_url: body.demo_url,
			cover_image_url: body.image_url,
			readme_url: body.readme_url,
			userId: sessionData.slackId,
			slack_user_name: sessionData.slack_name,
			bill_of_materials: body.bill_of_materials
		}
	});
	console.log(ship, `meow`);
	await fetch(`https://slack.com/api/chat.postMessage`, {
		headers: {
			Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
			'Content-Type': 'application/json; charset=utf-8'
		},

		method: 'POST',
		body: JSON.stringify({
			text: `${dev ? '[DEV]' : ''} user <@${sessionData.slackId}> drafted a new ship with the id of ${ship.id}`,
			channel: 'C08GZ6QF97Z'
		})
	}).then((r) => r.json());
	return new Response('OK CREATED', { status: 201 });
}
