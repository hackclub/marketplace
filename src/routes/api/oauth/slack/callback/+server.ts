import { PRIVATE_AIRTABLE_API_KEY, PRIVATE_AIRTABLE_BASE_ID } from '$env/static/private';
import prisma from '$lib/prisma';
function formatAddress(address) {
	const parts = [
		address.address_line_1,
		address.address_line_2,
		[address.address_city, address.address_state, address.address_postal_code]
			.filter(Boolean)
			.join(', '),
		address.address_country
	].filter(Boolean); // removes undefined/null/empty strings

	return parts.join('\n'); // or ', ' or whatever separator you want
}
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
	const body = await req.request.json();
	console.log(body);

	await prisma.user.update({
		where: {
			slackId: sessionData.slackId
		},
		data: {
			hcb_email: body.hcb_email,
			reigions_for_shipping: body.region_for_shipping_and_receiving[0],
			address: formatAddress({
				address_line_1: body.address_line_1,
				address_line_2: body.address_line_2,
				address_city: body.address_city,
				address_state: body.address_state,
				address_postal_code: body.address_postal_code,
				address_country: body.address_country
			}),
			address_line_1: body.address_line_1,
			address_line_2: body.address_line_2,
			address_city: body.address_city,
			address_state: body.address_state,
			address_postal_code: body.address_postal_code,
			address_country: body.address_country
		}
	});
	return new Response('Settings updated!');
}
