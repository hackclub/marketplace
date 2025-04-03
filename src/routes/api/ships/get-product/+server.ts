import { PRIVATE_AIRTABLE_API_KEY, PRIVATE_AIRTABLE_BASE_ID } from '$env/static/private';
import prisma from '$lib/prisma';

export async function GET(req: Request) {
	// fetch DIRECT from airtable
	const id = req.url.searchParams.get('shipId');
	if (!id) {
		return new Response(JSON.stringify({ message: 'No ship ID provided' }), {
			status: 400
		});
	}
	// query stuff
	return await prisma.ship
		.findFirst({
			where: {
				status: {
					equals: 'SHIPPED'
				},
				id: {
					equals: id
				}
			}
		})
		.then((d) => {
			if (!d)
				return new Response(JSON.stringify({ message: 'No ship found' }), {
					status: 404
				});
			// console.log(dd.records[0])
			return new Response(
				JSON.stringify({
					title: d.Name,
					id: d.id,
					status: d.status,
					featured: d.featured || false,
					description: d.Description,
					coverLink: d.cover_image_url,
					avatar: `https://cachet.dunkirk.sh/users/${d.userId}/r`,
					author: d.slack_user_name,
					author_slack_id: d.userId
				}),
				{
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
		});
}
