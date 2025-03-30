import { PRIVATE_AIRTABLE_API_KEY, PRIVATE_AIRTABLE_BASE_ID } from "$env/static/private"
import prisma from "$lib/prisma"

export async function GET(req: Request) { 
     // check for session here
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

    // now fetch the users settings from the airtable
    const data = await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/users/${sessionData.airtable_id}`, {
        headers: {
            Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
        }
    }).then(r => r.json())
    return new Response(JSON.stringify({
        id: data.id,
        slackId: data.fields.slack_id,
        has_authed_with_hcb: data.fields.has_authed_with_hcb,
        hcb_email: data.fields.hcb_email,
        slack_name: data.fields.slack_name,
        address: data.fields.address,
        reigons: data.fields.region_for_shipping_and_receiving
    }), {
        headers: {
            "Content-Type": "application/json"
        }
    })
}