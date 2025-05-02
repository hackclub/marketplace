import { PRIVATE_AIRTABLE_API_KEY, PRIVATE_AIRTABLE_BASE_ID } from '$env/static/private';
import prisma from '$lib/prisma';

export async function GET(req: Request) {
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

	// now fetch the users settings from the airtable
	const data = sessionData;
	return new Response(
		JSON.stringify({
			slackId: data.slack_id,
			hcb_email: data.hcb_email,
			slack_name: data.slack_name,
			address: data.address,
			reigons: data.reigions_for_shipping,
			address_line_1: data.address_line_1,
			address_line_2: data.address_line_2,
			address_city: data.address_city,
			address_state: data.address_state,
			address_postal_code: data.address_postal_code,
			address_country: data.address_country
		}),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
}
