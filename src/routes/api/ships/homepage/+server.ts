import { PRIVATE_AIRTABLE_BASE_ID, PRIVATE_AIRTABLE_API_KEY } from "$env/static/private";
import type { HomepageShip } from "../../../../lib/types";

export async function GET(req: Request) {

    // query stuff
    const data = await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/ships?filterByFormula=${encodeURIComponent(`Status="shipped!"`)}&expand=users`, {
        headers: {
            Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
        }
    }).then(r => r.json()).then(dd => {
        console.log(dd.records[0])
        return dd.records.map((d) => ({
            title: d.fields.Name,
            id: d.id,
            featured: d.fields.Featured || false,
            description: d.fields.description,
            coverLink: d.fields.cover_image,
            avatar: `https://cachet.dunkirk.sh/users/${d.fields.slack_user_id}/r`,
            author: d.fields.slack_user_name
        } satisfies HomepageShip) ).filter(d => d.title)
    })
    return new Response(JSON.stringify(data), {
        headers: {
            "Content-Type": "application/json"
        }
    })
}