import { dev } from '$app/environment';
import { PRIVATE_AIRTABLE_BASE_ID, PRIVATE_AIRTABLE_API_KEY, PRIVATE_PURCHASES_LOCKED } from '$env/static/private';
import prisma from '$lib/prisma';
export async function POST(req: Request) {
	// AMAZING PEAK CODE BELOW :fire:
	//TODO: turn this into a var lmao
	if(true) return new Response('purchases are locked', { status: 403 });
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
			sellerId: shipOwner.slackId,
			shipId: ship.id,
			buyerId: sessionData.slackId,
			// status: "PENDING"
		}
	});
	// notify ship owner AND log to my amazing channel
	await fetch(`https://slack.com/api/chat.postMessage`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
		},
		body: JSON.stringify({
			channel: `C08GZ6QF97Z`,
			text: `${dev?'[DEV]':""} A new purchase has been made by ${sessionData.slack_name} (<@${sessionData.slackId}>) for *${ship.Name}*`
		})
	});
	await fetch(`https://slack.com/api/chat.postMessage`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
		},
		body: JSON.stringify({
			channel: shipOwner.slackId,
			text: `${dev?'[DEV]':""} A new purchase has been made by <@${sessionData.slackId}> for *${ship.Name}*, you will have to approve this here: <link to approve>`
		})
	});
	// after that subtract user balance and put it in escrow
	await prisma.user.update({
		where: {
			slackId: sessionData.slackId
		},
		data: {
			currency: sessionData.currency - Math.floor(parseInt(ship.total_time_in_seconds!) / 60 / 60)
		}
	});
	// create the heide escrow stuff
	const escrow = await prisma.heidiEscrow.create({
		data: {
			buyerId: sessionData.slackId,
			purchaseId: purchase.id,
			userSlackId: shipOwner.slackId,
			shipId: ship.id,
			balance: Math.floor(parseInt(ship.total_time_in_seconds!) / 60 / 60)
		}
	});
	return new Response(JSON.stringify({ message: 'success' }), {
		status: 200
	});
}
