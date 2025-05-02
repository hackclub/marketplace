import { dev } from '$app/environment';
import { PRIVATE_MASTER_KEY } from '$env/static/private';
import prisma from '$lib/prisma';

export async function GET(req: Request) {
	// if()
	const headers = Object.fromEntries(req.request.headers.entries());
	console.log(headers);
	if (headers.authorization !== `Bearer ${PRIVATE_MASTER_KEY}`) {
		return new Response('401 Unauthorized', { status: 401 });
	}
	// pull all time which is 'PENDING'
	const time = await prisma.ship.findMany({
        where: {
            status: {
                not: {
                    in: ["DRAFT", "SHIPPED"]
                }
            }
		}
	});
	// js send it all...
	return new Response(JSON.stringify(time), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
