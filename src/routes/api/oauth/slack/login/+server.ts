import { PUBLIC_SLACK_CLIENT_ID } from "$env/static/public";
import { redirect } from "@sveltejs/kit";

export function GET(req) {
    if(req.cookies.get("session")) throw redirect("/ships")
    console.log("slack login")

    const url: URL = req.url;

    console.log(url)
    // return new Response(url.origin)
    // redirect to the url w/ scopes
    throw redirect(301, `https://hackclub.slack.com/oauth/v2/authorize?scope=&user_scope=identity.basic&redirect_uri=${encodeURIComponent( url.origin + "/api/oauth/slack/callback")}&client_id=${PUBLIC_SLACK_CLIENT_ID}`)
}
