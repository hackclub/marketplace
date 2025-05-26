import prisma from "$lib/prisma";

export async function load() {
  return {
    countOfUsers: await prisma.user.count(),
    onboardedUsersCount: await prisma.user.count({
        where: {
            address: {
                not: null
            }
        }
    }),
    shipsCount: await prisma.ship.count(),
    allTimeSessionsCount: await prisma.time.count(),
    approvedTimeCount: await prisma.time.count({
        where: {
            status: "APPROVED"
        }
    }),
    totalTimeRecordedWithAllShips: (await prisma.ship.findMany({
        where: {
            total_time_in_seconds: {
                not: null
            }
        }
    })).map(e=>parseInt(e.total_time_in_seconds!)).reduce((a,b) => a+b, 0)
  };
}