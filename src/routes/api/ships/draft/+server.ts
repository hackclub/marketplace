import { PRIVATE_AIRTABLE_BASE_ID, PRIVATE_AIRTABLE_API_KEY } from '$env/static/private';
import prisma from '$lib/prisma';
import { json } from '@sveltejs/kit';

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
			slack_user_name: sessionData.slack_name
		}
	});
	console.log(ship, `meow`);

	return new Response('OK CREATED', { status: 201 });
}
