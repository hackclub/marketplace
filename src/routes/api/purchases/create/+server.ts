import { PRIVATE_AIRTABLE_BASE_ID, PRIVATE_AIRTABLE_API_KEY } from '$env/static/private';
import prisma from '$lib/prisma';
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
	// check for seller product ID (ship id??)
	const { shipId } = body;
	// get ship
	const ship = await prisma.ship.findFirst({
		where: {
			id: shipId
		}
	});
	if (!ship) return new Response('no ship');
	// get ships owners user id
	const shipOwner = await prisma.user.findFirst({
		where: {
			slackId: ship.userId
		}
	});

	if (!shipOwner) return new Response('no ship owner');
	// create a purchase record in the prisma
	const purchase = await prisma.purchase.create({
		data: {
			userId: sessionData.id,
			shipId: ship.id,
			buyerId: shipOwner.id,
			status: 'pending'
		}
	});
}
