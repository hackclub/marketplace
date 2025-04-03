import { PRIVATE_AIRTABLE_BASE_ID, PRIVATE_AIRTABLE_API_KEY } from '$env/static/private';
import prisma from '$lib/prisma';

export async function GET(req: Request) {
	// so we query for transactions where buyer = sessionData.slackId
	// and return them

	// check for session here
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

	// query stuff

	return await fetch(
		`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/heidi_money?filterByFormula=${encodeURIComponent(`{buyer} = "${sessionData.slackId}"`)}`,
		{
			headers: {
				Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
			}
		}
	)
		.then((r) => r.json())
		.then((dd) => {
			console.log(dd.records[0]);
			return new Response(
				JSON.stringify(
					dd.records.map((r) => ({
						id: r.id,
						name: r.fields.TransactionName,
						seller: {
							id: r.fields.seller[0],
							slack_id: r.fields['sellers_slack_id'][0],
							slack_name: r.fields['sellers_slack_name'][0]
						},
						item: {
							id: r.fields.item[0],
							name: r.fields['item_name'][0],
							image: r.fields['item_image'][0]
						}
					}))
				),
				{
					headers: {
						'content-type': 'application/json'
					}
				}
			);
		});
	// return new Response("200")
}
