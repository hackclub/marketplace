import { PRIVATE_AIRTABLE_BASE_ID, PRIVATE_AIRTABLE_API_KEY } from "$env/static/private";

export async function GET(req: Request) {
    // check for session here -- TODO

    // query stuff
    const data = await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/ships`, {
        headers: {
            Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
        }
    }).then(r=>r.json()).then(dd => dd.records.map((d) => ({
        name: d.fields.Name,
        status: d.fields.Status
    })).filter(d => d.name))
    return new Response(JSON.stringify(data), {
        headers: {
            "Content-Type": "application/json"
        }
    })
}