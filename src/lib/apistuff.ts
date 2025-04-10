import prisma from './prisma';

export async function reSyncUsersShipTime(shipId: string) {
	const timeDataWithVideos = await prisma.time.findMany({
		where: {
			shipId: shipId,
			total_time_in_seconds: {
				not: null
			},
			video_link: {
				not: null
			}
		}
	});
	let timeDataWithVideos_num = 0;
	for (const td of timeDataWithVideos) {
		timeDataWithVideos_num += td.total_time_in_seconds!;
	}
	// update ship
	await prisma.ship.update({
		where: {
			id: shipId
		},
		data: {
			total_time_in_seconds: timeDataWithVideos_num.toString()
		}
	});
}
