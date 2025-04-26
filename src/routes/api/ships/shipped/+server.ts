import {
    PRIVATE_AIRTABLE_BASE_ID,
    PRIVATE_AIRTABLE_API_KEY,
    PRIVATE_SLACK_BOT_TOKEN
} from '$env/static/private';
import prisma from '$lib/prisma';
export async function POST(req: Request) {
    const session = req.cookies.get('session');
    if (!session) {
        return new Response(JSON.stringify({ message: 'No session' }), {
            status: 401
        });
    }
    const sessionData = await prisma.user.findFirst({
        where: {
            token: session
        }
    });
    if (!sessionData || !sessionData.slackId) {
        return new Response(JSON.stringify({ message: 'No session data' }), {
            status: 401
        });
    }
    const body = await req.request.json();
    // fetch the ship from airtable
    let ship = null;
    try {
        ship = await prisma.ship.update({
            where: {
                id: body.id,
                status: 'UNDER_HQ_REVIEW',
                is_under_some_review_rn: false,
                approved_for_hq: true
            },
            data: {
                status: "SHIPPED",
                // is_under_some_review_rn: true,
            }
        });
    } catch (e) {
        return new Response(JSON.stringify({ message: 'Ship not found or not ready ;p' }), {
            status: 404
        });
    }
    // send to the ysws database
    fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/fake_ysws_db`, {
        headers: {
            Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json; charset=utf-8'
        },
        method: 'POST',
        body: JSON.stringify({
            'records': [
                {
                  'fields': {
                    'code_url': body.code_url,
                    'playable_url': body.playable_url,
                    'first_name': body.first_name,
                    'last_name': body.last_name,
                    'email': body.email,
                    'screenshot': [
                      {
                        'url': body.screenshot
                      }
                    ],
                    'description':  body.description,
                    'github_username': body.github_username,
                    'address_line_1': body.address_line_1,
                    'city': body.city,
                    'state': body.state,
                    'country': body.country,
                    'zipcode': body.zipcode,
                    'bday': body.bday,
                    'ship_id': body.ship_id || body.id
                  }
                }
              ]
        })
    }).then((r) => r.json()).then(console.log).catch((e) => {
        console.log(e);
    })
    //  send noti to slack channel
    await fetch(`https://slack.com/api/chat.postMessage`, {
        headers: {
            Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
            'Content-Type': 'application/json; charset=utf-8'
        },
        method: 'POST',
        body: JSON.stringify({
            text: `User <@${sessionData.slackId}> has promoted a ship (${body.id}) to shipped! (there done! its over! they can sell!) `,
            channel: `C08GZ6QF97Z`
        })
    }).then((r) => r.json());
    await fetch(`https://slack.com/api/chat.postMessage`, {
        headers: {
            Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
            'Content-Type': 'application/json; charset=utf-8'
        },
        method: 'POST',
        body: JSON.stringify({
            text: `Your ship (${ship.Name}) is finally shipped! Congrats! the next step is waiting for someone to buy your pcb and earnfrom that ;p `,
            channel: sessionData.slackId
        })
    })
        .then((r) => r.json())
        .then(console.log);
    return new Response('200 OK');
}
