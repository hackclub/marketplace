import { PRIVATE_AIRTABLE_API_KEY, PRIVATE_AIRTABLE_BASE_ID } from "$env/static/private"

export async function GET(req: Request) {
    // fetch DIRECT from airtable
    const id = req.url.searchParams.get("shipId")
    if (!id) {
        return new Response(JSON.stringify({ message: "No ship ID provided" }), {
            status: 400
        })
    }
    const data = await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/ships/${id}`, {
        headers: {
            Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
        }
    }).then(r => r.json())
    console.log(data)
    if (data.error == "NOT_FOUND") {
        return new Response(JSON.stringify({ message: "Ship not found", status:404 }), {
            status: 404
        })
    }
    if (data.error) {
        return new Response(JSON.stringify({ message: "Error fetching ship", error: data.error,  status:500 }), {
            status: 500
        })
    }
    const d = data
    return new Response(JSON.stringify({
        title: data.fields.Name,
        id: data.id,
        featured: d.fields.Featured || false,
        description: d.fields.description,
        coverLink: d.fields.cover_image,
        avatar: `https://cachet.dunkirk.sh/users/${d.fields.slack_user_id}/r`,
        author: d.fields.slack_user_name
    }), {
        headers: {
            "Content-Type": "application/json"
        }
    })
}
