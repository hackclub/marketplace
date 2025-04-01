import { PUBLIC_SLACK_CLIENT_ID, PUBLIC_REDIRECT_URL } from "$env/static/public";
export function getCallbackURL() {
    return `https://hackclub.slack.com/oauth/v2/authorize?scope=&user_scope=identity.basic&redirect_uri=${encodeURIComponent(PUBLIC_REDIRECT_URL + "/api/oauth/slack/callback")}&client_id=${PUBLIC_SLACK_CLIENT_ID}`
}