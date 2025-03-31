import { PRIVATE_AIRTABLE_API_KEY, PRIVATE_AIRTABLE_BASE_ID, PRIVATE_CRON_SECRET, PRIVATE_HCB_AUTH_BODY_TOKEN, PRIVATE_HCB_COOKIE, PRIVATE_HCB_CSRF_TOKEN, PRIVATE_SLACK_BOT_TOKEN } from "$env/static/private";
import prisma from "./prisma";

export async function sendHCBGrants() {
    
    const data = await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/ships?filterByFormula=${encodeURIComponent(`AND({HCB grant approve} = TRUE(), {_automation_grant_sent} = FALSE())`)}`, {
        headers: {
            Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
        }
    }).then(r => r.json())
    const recordsToUpdate = []
    // console.log(data.records, `records :3`)
    // loop thru allat records
    for(const record of data.records) {
        // so we send hcb record hypothetically 
        // console.log(record)
        fetch('https://hcb.hackclub.com/market-ysws/card-grants', {
            method: 'POST',
            headers: {
              'accept': 'text/vnd.turbo-stream.html, text/html, application/xhtml+xml',
              'accept-language': 'en-US,en;q=0.9',
              'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
              'origin': 'https://hcb.hackclub.com',
              'referer': 'https://hcb.hackclub.com/market-ysws/transfers',
              'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
              'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
                'x-csrf-token': PRIVATE_HCB_CSRF_TOKEN,
              // if this is supposed to be private well fu-
            //   'x-turbo-request-id': '08058ecb-79c3-4d17-8439-2c5e2c779889',
              'cookie': PRIVATE_HCB_COOKIE
            },
            body: new URLSearchParams({
              'authenticity_token': PRIVATE_HCB_AUTH_BODY_TOKEN,
              'card_grant[email]': 'neon@saahild.com',
              'card_grant[amount_cents]': dev?'0.01':record.fields.grant_amount,
              'card_grant[purpose]': 'ummmmmmmmmmmm MUSTARDDDD',
              'commit': 'Send grant'
            })
          }).then(async d=> {
            console.log(d.status)
              const text = (await d.text())
            //   console.log(text)
              if (text.includes("Sign In") || text.includes("Log In")|| text.includes(`<meta property="og:description" content="Sign in to HCB.">`)) {
                await fetch(`https://slack.com/api/chat.postMessage`, {
                    headers: {
                       Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
                       "Content-Type": "application/json; charset=utf-8"
                    },
                    method: "POST",
                   body: JSON.stringify({
                        text: `${dev?`[DEV]`:""}  umm the grant failed to send -- bad cookies or smthing...`,
                        channel: `C08GZ6QF97Z`
                    })
                }).then(r => r.json())
                  // then throw so we dont say it was good
                  return;
            }
          });
        await fetch(`https://slack.com/api/chat.postMessage`, {
            headers: {
               Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
               "Content-Type": "application/json; charset=utf-8"
            },
            method: "POST",
           body: JSON.stringify({
                text: `${dev?`[DEV]`:""}  <@${record.fields.slack_user_id}> has been sent there grant for there ship ${record.fields.Name} (${record.id})`,
                channel: `C08GZ6QF97Z`
            })
        }).then(r => r.json())

        recordsToUpdate.push({
            id: record.id,
            fields: {
                _automation_grant_sent: true
            }
        })
    }
    // update airtable
    await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/ships`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",       
            Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
        },
        body: JSON.stringify({
            records: recordsToUpdate
        })
    })
}
export async function draftAllRejectedShips() {
    // query airtable with formula
    const data = await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/ships?filterByFormula=${encodeURIComponent(`AND({rejected} = 1, {Status} != "Draft")`)}`, {
        headers: {
            Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
        }
    }).then(r => r.json())
    // console.log(data)
    const recordsToUpdate = []
    // send msg to oauth2 with hcb if no email on file
    for (const d of data.records) {
        // yipee u have made it or smthing now send a message
        fetch(`https://slack.com/api/chat.postMessage`, {
            headers: {
                Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
                "Content-Type": "application/json; charset=utf-8"
            },
            method: "POST",
            body: JSON.stringify({
                text: `${dev?`[DEV]`:""} <@${d.fields.slack_user_id}> your ship (${d.fields.Name}) was rejected!\n> ${d.fields.rejection_reason}`,
                channel: d.fields.slack_user_id
            })
        }).then(r => r.json())       
        fetch(`https://slack.com/api/chat.postMessage`, {
            headers: {
                Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
                "Content-Type": "application/json; charset=utf-8"
            },
            method: "POST",
            body: JSON.stringify({
                text: `${dev?`[DEV]`:""} <@${d.fields.slack_user_id}>  ship (${d.fields.Name}) was rejected!\n> ${d.fields.rejection_reason}`,
                channel: "C08GZ6QF97Z"
            })
        }).then(r => r.json())   
        recordsToUpdate.push({
            id: d.id,
            fields: {
                Status: "draft",
                rejected: false,
            }
        })
    }
    // update airtable
    fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/ships`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
        },
        body: JSON.stringify({
            records: recordsToUpdate
        })
    })

}
export async function promoteUsersFromDigitalReview() {
    // query airtable with formula
    const data = await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/ships?filterByFormula=${encodeURIComponent(`AND({Digital review approve} = TRUE(), {_automation_digital_sent} = FALSE())`)}`, {
        headers: {
            Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
        }
    }).then(r => r.json())
    const recordsToUpdate = []
    // send msg to oauth2 with hcb if no email on file
    for (const d of data.records) {
        // yipee u have made it or smthing now send a message
        fetch(`https://slack.com/api/chat.postMessage`, {
            headers: {
                Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
                "Content-Type": "application/json; charset=utf-8"
            },
            method: "POST",
            body: JSON.stringify({
                text: `${dev?`[DEV]`:""} <@${d.fields.slack_user_id}> has been promoted from digital review to HQ Digital Review!`,
                channel: `C08GZ6QF97Z`
            })
        }).then(r => r.json())
        fetch(`https://slack.com/api/chat.postMessage`, {
            headers: {
                Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
                "Content-Type": "application/json; charset=utf-8"
            },
            method: "POST",
            body: JSON.stringify({
                text: `${dev?`[DEV]`:""}  <@${d.fields.slack_user_id}> has been promoted from digital review to HQ Digital Review!`,
                channel: d.fields.slack_user_id
            })
        }).then(r => r.json())       
        recordsToUpdate.push({
            id: d.id,
            fields: {
                _automation_digital_sent: true,
                Status:"under grant review"
            }
        })
    }
    // otherwise promote and mark as done
fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/ships`, {
    method: "PATCH",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
    },
    body: JSON.stringify({
        records: recordsToUpdate
    })
})
}

export async function deleteExpiredCache() {
    const cacheObjects = await prisma.cacheObject.findMany({})
    for (const cacheObject of cacheObjects) {
        if (cacheObject.ttl.getTime() < Date.now()) {
            console.log(`Deleting cache object ${cacheObject.key} (${cacheObject.id})`)
            await prisma.cacheObject.delete({
                where: {
                    id: cacheObject.id
                }
            })
        }
    }
}