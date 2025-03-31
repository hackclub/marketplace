import { PRIVATE_CRON_SECRET } from "$env/static/private";
import { dev } from '$app/environment';
import { deleteExpiredCache, draftAllRejectedShips, promoteUsersFromDigitalReview, sendHCBGrants } from "$lib/cron";

export async function GET(req: Request) {
    const headers = Object.fromEntries(req.request.headers.entries());
    console.log(headers)
    if(headers.Authorization !== `Bearer ${PRIVATE_CRON_SECRET}` && !dev) {
        return new Response("401 Unauthorized", { status: 401 })
    }
    console.debug(`CRON RAAAA (*/15)`)
    // await draftAllRejectedShips()
    await Promise.all([
        sendHCBGrants(),
        promoteUsersFromDigitalReview(),
        draftAllRejectedShips(),
        deleteExpiredCache()
    ])
    return new Response("200 OK")
}