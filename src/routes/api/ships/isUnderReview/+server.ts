import prisma from '$lib/prisma';

export async function GET(req: Request) {
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
	// query param shipId
	const url = new URL(req.url);
	const shipId = url.searchParams.get('shipId');

	if (!shipId) {
		return new Response(JSON.stringify({ message: 'No shipId' }), {
			status: 404
		});
	}
	const ship = await prisma.ship.findFirst({
		where: {
			id: shipId,
			is_under_some_review_rn: true
		}
	});
	if (!ship) {
		return new Response(JSON.stringify({ message: 'Ship not found or not under review' }), {
			status: 400
		});
	}
	return new Response(JSON.stringify({ message: 'Ship is under review' }));
	// 	})
}
