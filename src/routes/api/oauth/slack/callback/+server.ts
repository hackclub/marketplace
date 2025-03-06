import { PUBLIC_REDIRECT_URL, PUBLIC_SLACK_CLIENT_ID } from "$env/static/public"
import { PRIVATE_AIRTABLE_API_KEY, PRIVATE_AIRTABLE_BASE_ID, PRIVATE_SLACK_CLIENT_SECRET } from "$env/static/private";
import { parseJwt } from "$lib/jwt";
import { json, redirect } from "@sveltejs/kit";
import prisma from "$lib/prisma"
export async function GET(req) {
    if(req.cookies.get("session")) throw redirect(302, "/ships")
    const code = req.url.searchParams.get("code")

    // exchange code 
    console.log(code)

    if (!code) {
        return new Response(JSON.stringify({ message: "Missing code"}), {
            status: 400
        })
    }
    
    const exchangeURL = `https://slack.com/api/openid.connect.token?client_id=${PUBLIC_SLACK_CLIENT_ID}&client_secret=${PRIVATE_SLACK_CLIENT_SECRET}&code=${code}&redirect_uri=${PUBLIC_REDIRECT_URL + "/api/oauth/slack/callback"}&grant_type=authorization_code`
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
    if (rjson.error) {
        return json({ error: rjson.error }, { status: 500 });
    }
      // jwt
    const jwt = parseJwt(rjson.id_token)
    // if (jwt["https://slack.com/team_domain"] !== "hackclub") {
    //     return json({ error: "Not hackclub" }, { status: 401 });
    // }
      console.log(jwt)
    // check if user has a session 
    const userData = await prisma.user.findFirst({
      where: {
        slackId: jwt["https://slack.com/user_id"] || jwt.sub
      }
    })
    if (userData) {
      req.cookies.set("session", userData.token, {  path: "/", httpOnly: false  })
      ok_to_redirect = true;
    }
    else {
      const sessionId = crypto.randomUUID().toString()
      const structuredBody = {
        slack_id: jwt["https://slack.com/user_id"] || jwt.sub,
        session_token: sessionId
          }
          const reqq = await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/users`, {
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
      // create db entry here
      await prisma.user.create({
        data: {
          token: sessionId,
          slackId: jwt["https://slack.com/user_id"] || jwt.sub,
          airtable_id: reqq.records[0].id
        }
      })
      req.cookies.set("session", sessionId, { path: "/", httpOnly: false  })
      ok_to_redirect = true;
    }
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