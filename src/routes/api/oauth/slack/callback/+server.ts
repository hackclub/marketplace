import { PUBLIC_SLACK_CLIENT_ID } from "$env/static/public"
import { PRIVATE_SLACK_CLIENT_SECRET } from "$env/static/private";
import { parseJwt } from "$lib/jwt";
import { redirect } from "@sveltejs/kit";
import prisma from "$lib/prisma"
export async function GET(req) {
    if(req.cookies.get("session")) throw redirect("/ships")
    const code = req.url.searchParams.get("code")

    // exchange code 
    console.log(code)

    if (!code) {
        return new Response(JSON.stringify({ message: "Missing code"}), {
            status: 400
        })
    }
    
    const exchangeURL = `https://slack.com/api/openid.connect.token?client_id=${PUBLIC_SLACK_CLIENT_ID}&client_secret=${PRIVATE_SLACK_CLIENT_SECRET}&code=${code}`
    const exchangeResponse = await fetch(exchangeURL, { method: "POST"})
    if(exchangeResponse.status !== 200) {
        return new Response(JSON.stringify({ message: "Bad Oauth2 Response"}), {
            status: 400
        })
    }
let ok_to_redirect = false
  try {
    const rjson = await exchangeResponse.json()
    console.log(rjson)
    // jwt
    const jwt = parseJwt(rjson.id_token)
    if (jwt["https://slack.com/team_domain"] !== "hackclub") {
        return json({ error: "Not hackclub" }, { status: 401 });
    }
    console.log(jwt)
    const sessionId = crypto.randomUUID().toString()
    // create db entry here
    prisma.user.create({
        token: sessionId,
        slackId: jwt["https://slack.com/user_id"]
    })
    req.cookies.set("session", sessionId, { path: "/"})
    ok_to_redirect = true;
} catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ message: `Oops. ${e.message}`}))
  }
  finally {
    if(ok_to_redirect) {
        throw redirect(301, "/ships")
    }
  }
}