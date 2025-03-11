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
     const timerecorder = await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/timerecorder?filterByFormula=${encodeURIComponent(`AND(slack_id="${sessionData.slackId}",NOT(isDone))`)}`, {
            headers: {
                Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
         }
         // PLEASE DONT HAVE MORE THEN ONE RECORD :nooo:
     }).then(r => r.json()).then(udata => udata.records[0])
    console.log(timerecorder)
    // // grab user data moment
    const structuredBody = {
        image_url: body.image_url,
        user: [sessionData.airtable_id],
        ship: [body.ship_id],
        timerecorder: [timerecorder.id]
        // pausedAt: null,
    }
    const reqq = await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/heartbeats`, {
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
    }).then(r => r.json())
    // nowww we get to update the airtable!!
    const reqqq = await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/timerecorder/${timerecorder.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",       
            Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
        },
        body: JSON.stringify({
            fields: {
                "heartbeats": [...(Array.isArray(timerecorder.fields.heartbeats)? timerecorder.fields.heartbeats : []), reqq.records[0].id]
            }
        })
    })
    return new Response("shush", {
        headers: {
            "Content-Type": "application/json"
        }
    })
}