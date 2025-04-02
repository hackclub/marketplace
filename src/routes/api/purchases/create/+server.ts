import { PRIVATE_AIRTABLE_BASE_ID, PRIVATE_AIRTABLE_API_KEY } from "$env/static/private";
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
    console.log(body)
    if (!body) return new Response("no body")
    // check for seller product ID (ship id??)
    const productInfo = await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/ships/${body.shipId}`, {
        headers: {
            Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
        }
    }).then(r => r.json())
    // update seller and buyer in the airtable
    const purchaseInfo = await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/purchases`, {
        headers: {
            Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            fields: {
                Status: "Todo",
                buyer: [sessionData.airtable_id],
                seller: [productInfo.fields.users[0]],
                product: [body.shipId],
            }
        })
    }).then(r => r.json())
    // todo: add it to heidis balance then deduct user balance.
    await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/users/`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            records: [
                {
                    id: sessionData.airtable_id,
                    fields: {
                        purchases: [purchaseInfo.id]
                    }
                }
            ]
        })
    })
}
