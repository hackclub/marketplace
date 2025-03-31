import { PRIVATE_AIRTABLE_BASE_ID, PRIVATE_AIRTABLE_API_KEY } from "$env/static/private";
import prisma from "$lib/prisma";
import type { HomepageShip } from "../../../../lib/types";

export async function GET(req: Request) {
    const doesCacheVersionExist = await prisma.cacheObject.findFirst({
        where: {
            key: "homepage-ships"
        }
    })
    if (!doesCacheVersionExist || doesCacheVersionExist.ttl.getTime() < Date.now()) {
        if (doesCacheVersionExist && doesCacheVersionExist.ttl.getTime() < Date.now()) {
            console.log("Cache expired, deleting")
            await prisma.cacheObject.delete({
                where: {
                    id: "homepage-ships"
                }
            })
        }
        // query stuff
        const data = await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/ships?filterByFormula=${encodeURIComponent(`Status!="draft"`)}&expand=users`, {
            headers: {
                Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
            }
        }).then(r => r.json()).then(dd => {
            // console.log(dd.records[0])
            return dd.records.map((d) => ({
                title: d.fields.Name,
                id: d.id,
                status: d.fields.Status,
                featured: d.fields.featured || false,
                description: d.fields.description,
                coverLink: d.fields.cover_image,
                avatar: `https://cachet.dunkirk.sh/users/${d.fields.slack_user_id}/r`,
                author: d.fields.slack_user_name,
                author_slack_id: d.fields.slack_user_id,
            } satisfies HomepageShip)).filter(d => d.title)
        })
        await prisma.cacheObject.create({
            data: {
                key: "homepage-ships",
                data: data,
                // id: "homepage-ships",
            }
        })
        return new Response(JSON.stringify(data), {
            headers: {
                "Content-Type": "application/json",
                "X-Cache": "MISS"
            }
        })
    } else {
        const data = await prisma.cacheObject.findFirst({
            where: {
                key: "homepage-ships"
            }
        })
        if (data) {
            return new Response(JSON.stringify(data.data), {
                headers: {
                    "Content-Type": "application/json",
                    "X-Cache": "HIT"
                }
            })
        }
    }
}