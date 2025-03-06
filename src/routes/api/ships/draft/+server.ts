import { PRIVATE_AIRTABLE_BASE_ID, PRIVATE_AIRTABLE_API_KEY } from "$env/static/private";
import prisma from "$lib/prisma";
import { json } from "@sveltejs/kit";

export async function POST(req: Request) {
    const session = req.cookies.get("session")
    if (!session) {
        return new Response(JSON.stringify({ message: "No session" }), {
            status: 401
        })
    }
    const sessionData = await prisma.user.findFirst({
        where: {
            token: session
        }
    }) 
    if (!sessionData || !sessionData.slackId) { 
        return new Response(JSON.stringify({ message: "No session data" }), {
            status: 401
        })
    }
   const body = await req.request.json()
    console.log(body)
    if (!body) return new Response("no body")
    // query users airtable 
    const user_id = await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/users?filterByFormula=${encodeURIComponent(`slack_id="${sessionData.slackId}"`)}`, {
        headers: {
            Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
        }
    }).then(r => r.json()).then(udata => udata.records[0].id)
    // console.log()
    const structuredBody = {
        "Name": body.name,
        "Status": "draft",
        "users": [user_id],
        description: body.description,
        cover_image: body.image_url,
        slack_user_name: sessionData.slackId,
        slack_user_id: sessionData.slackId
    }
    const reqq = await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/ships`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${PRIVATE_AIRTABLE_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            records: [{
                fields: structuredBody
            }],
            // fields: structuredBody
        })
    }).then(r => r.json())
    console.log(reqq)
    return new Response("what")
}