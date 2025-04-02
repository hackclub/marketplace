import { PRIVATE_AIRTABLE_BASE_ID, PRIVATE_AIRTABLE_API_KEY,PRIVATE_SLACK_BOT_TOKEN  } from "$env/static/private";
import prisma from "$lib/prisma";
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
    // fetch the ship from airtable
    const ship = await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/ships/${body.id}`, {
        headers: {
            Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
        }
    }).then(r => r.json())
    // console.log(ship)
    if (!ship.fields) return new Response("404 Not Found")
    if (ship.fields.Status !== "draft") return new Response("400 Bad Request")
    // return;
    await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/ships/${body.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",       
            Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
        },
        body: JSON.stringify({
            fields: {
                "Status": "under grant review"
            }
        })
    })
    //  send noti to slack channel
       await fetch(`https://slack.com/api/chat.postMessage`, {
            headers: {
               Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
               "Content-Type": "application/json; charset=utf-8"
            },
            method: "POST",
           body: JSON.stringify({
                text: `User <@${sessionData.slackId}> has promoted a ship (${body.id}) to Grant review??! (please adjust there grant amount) -- please review it or something`,
                channel: `C08GZ6QF97Z`
            })
       }).then(r => r.json())
       await fetch(`https://slack.com/api/chat.postMessage`, {
        headers: {
           Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
           "Content-Type": "application/json; charset=utf-8"
        },
        method: "POST",
       body: JSON.stringify({
            text: `Your ship (${ship.fields.Name}) is in the pending grant review!`,
            channel: sessionData.slackId
        })
      }).then(r => r.json()).then(console.log)
    return new Response("200 OK")
}