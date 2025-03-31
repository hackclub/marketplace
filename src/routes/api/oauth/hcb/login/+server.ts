import { PRIVATE_HCB_DOMAIN } from "$env/static/private";
import { PUBLIC_HCB_CLIENT_ID, PUBLIC_HCB_REDIRECT_URI } from "$env/static/public";
import { redirect } from "@sveltejs/kit";

export function GET(req: Request) {
    throw redirect(301, `https://${PRIVATE_HCB_DOMAIN}/api/v4/oauth/authorize?client_id=${PUBLIC_HCB_CLIENT_ID}&redirect_uri=${PUBLIC_HCB_REDIRECT_URI}&response_type=code&scope=read`)
}