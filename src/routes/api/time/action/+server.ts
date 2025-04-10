import { PRIVATE_MASTER_KEY, PRIVATE_SLACK_BOT_TOKEN } from "$env/static/private";
import prisma from "$lib/prisma";

export async function POST(req: Request) {
    console.debug(`#actionf`)
    const headers = Object.fromEntries(req.request.headers.entries());
	// console.log(headers);
	if (headers.authorization !== `Bearer ${PRIVATE_MASTER_KEY}`) {
		return new Response('401 Unauthorized', { status: 401 });
    }
    const body = await req.request.json();
    console.log(body)
  await  prisma.time.update({
        where: {
            id: body.timeId,
        },
        data: {
            status: body.action,
        }
    })
    // get user session

    const session = await prisma.user.findFirst({
        where: {
       token: req.cookies.get('session')
        }
    });
    let nameOfPerson = null;
    if (session) {
        nameOfPerson = session.slack_name;
    } else {
        nameOfPerson = 'Unknown';
    }
    // send a notification in the slack logs
   await  fetch(`https://api.slack.com/api/chat.postMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`
        },
        body: JSON.stringify({
            channel: 'C08GZ6QF97Z',
            text: `Time ${body.timeId} has been set to \`${body.action}\` by ${session?.slackId ? `<@${session.slackId}>` : `@${nameOfPerson}` }`,
        })
    }).then(r=>r.json())

    return new Response(JSON.stringify({ message: 'Time updated' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });

}