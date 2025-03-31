import { PRIVATE_AIRTABLE_BASE_ID, PRIVATE_AIRTABLE_API_KEY } from "$env/static/private";
import prisma from "$lib/prisma";

export async function POST(req: Request) {
    // validate session moment 
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
        // const user = await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/users?filterByFormula=${encodeURIComponent(`slack_id="${sessionData.slackId}"`)}`, {
        //     headers: {
        //         Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
        //     }
        // }).then(r => r.json()).then(udata => udata.records[0])
    // grab user data moment
    const structuredBody = {
        // video_link: body.link,
        Status: "not_approved",
        "user": [sessionData.airtable_id],
        ship: [body.ship_id],
        isPaused: false,
        // pausedAt: null,
    }
    const reqq = await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/timerecorder`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${PRIVATE_AIRTABLE_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            records: [{
                fields: structuredBody
            }],
        })
    }).then(r => r.text())
    return new Response(reqq, {
        headers: {
            "Content-Type": "application/json"
        }
    })
}