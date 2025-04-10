import { PRIVATE_AIRTABLE_BASE_ID, PRIVATE_AIRTABLE_API_KEY } from '$env/static/private';
import prisma from '$lib/prisma';
import type { HomepageShip } from '../../../../lib/types';

export async function GET(req: Request) {
	// query stuff
	const data = await prisma.ship
		.findMany({
			where: {
				status: {
					not: 'DRAFT'
				}
			}
		})
		.then((dd) => {
			// console.log(dd.records[0])
			return dd
				.map(
					(d) =>
						({
							title: d.Name,
							id: d.id,
							status: d.status,
							featured: d.featured || false,
							description: d.Description,
							coverLink: d.cover_image_url,
							avatar: `https://cachet.dunkirk.sh/users/${d.userId}/r`,
							author: d.slack_user_name,
							author_slack_id: d.userId
						}) satisfies HomepageShip
				)
				.filter((d) => d.title);
		});

	return new Response(JSON.stringify(data), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
