import { dev } from "$app/environment";
import { PRIVATE_AIRTABLE_API_KEY, PRIVATE_AIRTABLE_BASE_ID, PRIVATE_HCB_CLIENT_SECRET, PRIVATE_HCB_DOMAIN, PRIVATE_SLACK_BOT_TOKEN } from "$env/static/private";
import { PUBLIC_HCB_CLIENT_ID, PUBLIC_HCB_REDIRECT_URI } from "$env/static/public";
import prisma from "$lib/prisma";
import { json } from "@sveltejs/kit";

export async function GET(req: Request) {
    // console.log(req.url)
    if (!req.url.searchParams.get("code")) { 
        return new Response(JSON.stringify({ message: "Missing code" }), {
            status: 400
        })
    }
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
    console.log(decodeURIComponent(PUBLIC_HCB_REDIRECT_URI))
    const yummyAuthData = await fetch(`https://` + PRIVATE_HCB_DOMAIN + "/api/v4/oauth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body:JSON.stringify({
            "client_id": PUBLIC_HCB_CLIENT_ID,
            "client_secret": PRIVATE_HCB_CLIENT_SECRET,
            "code": req.url.searchParams.get("code"),
            "grant_type": "authorization_code",
            "redirect_uri": decodeURIComponent(PUBLIC_HCB_REDIRECT_URI).trim(),
        })
    }).then(r => r.json())
    // console.log(yummyAuthData)
    if (yummyAuthData.error) {
        return json({ error: yummyAuthData.error_description, code: yummyAuthData.error }, { status: 500 })
    }
    const userData = await fetch(`https://` + PRIVATE_HCB_DOMAIN + "/api/v4/user", {
        headers: {
            "Authorization": `Bearer ${yummyAuthData.access_token}`
        }
    }).then(r => r.json())
    // console.log(userData, yummyAuthData)

    if (userData.error) {
        return json({ error: userData.error }, { status: 500 })
    }
  
    // create PUT to users airtable to update
    await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/users`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",       
            Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
        },
        body: JSON.stringify({
            records: [{
                id: sessionData.airtable_id!,
                fields: {
                    has_authed_with_hcb: true,
                    hcb_email: userData.email,
                }
            }]
        })
    })
    // fetch()
    await fetch(`https://slack.com/api/chat.postMessage`, {
        headers: {
           Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
           "Content-Type": "application/json; charset=utf-8"
        },
        method: "POST",
       body: JSON.stringify({
            text: `${dev?`[DEV]`:""}  <@${sessionData.slackId}> Your hcb account: <https://hcbscan.3kh0.net/app/usr/${userData.id}|${userData.name}> is linked! (all grants for *this ysws* will be sent there)`,
            channel: sessionData.slackId
        })
    }).then(r => r.json())
    if (userData.admin) {
        await fetch(`https://slack.com/api/chat.postMessage`, {
            headers: {
               Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
               "Content-Type": "application/json; charset=utf-8"
            },
            method: "POST",
           body: JSON.stringify({
                text: `${dev?`[DEV]`:""}  <@${sessionData.slackId}> HCB  admin: <https://hcbscan.3kh0.net/app/usr/${userData.id}|${userData.name}> :eyes:`,
                channel: `C08GZ6QF97Z`
            })
        }).then(r => r.json())
    }
    // console.log(sessionData)
    return new Response(
        "200 OK"
    )
}