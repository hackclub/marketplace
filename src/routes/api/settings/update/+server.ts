import { PRIVATE_AIRTABLE_API_KEY, PRIVATE_AIRTABLE_BASE_ID } from "$env/static/private"
import prisma from "$lib/prisma"

export async function PATCH(req: Request) {
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
    const body = await req.request.json()
    console.log(body)
    // to be done
    return await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/users/${sessionData.airtable_id}`, {
        headers: {
            Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({
            fields: {
                address: body.address,
                region_for_shipping_and_receiving: body.region_for_shipping_and_receiving,
            }
        })
    }).then(r => r.json()).then(dd => {
        console.log(dd)
        return new Response(JSON.stringify({message:"OK"}), {
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
    )
}