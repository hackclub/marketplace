import { dev } from '$app/environment';
import { PRIVATE_CRON_SECRET } from '$env/static/private';
import prisma from '$lib/prisma';
export async function DELETE(req: Request) {
	const headers = Object.fromEntries(req.request.headers.entries());
	console.log(headers);
	if (headers.Authorization !== `Bearer ${PRIVATE_CRON_SECRET}` && !dev) {
		return new Response('401 Unauthorized', { status: 401 });
	}
	console.debug(`Bye bye cache!!`);
	console.debug(`I hope you know what you are doing!`);
	prisma.cacheObject.findMany({}).then(async (cacheObjects) => {
		for (const cacheObject of cacheObjects) {
			console.log(`Deleting cache object ${cacheObject.id}`);
			await prisma.cacheObject.delete({
				where: {
					id: cacheObject.id
				}
			});
		}
	});
	return new Response('Cache deleted', { status: 200 });
}
