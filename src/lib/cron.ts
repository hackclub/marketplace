import { dev } from '$app/environment';
import {
	PRIVATE_AIRTABLE_API_KEY,
	PRIVATE_AIRTABLE_BASE_ID,
	PRIVATE_CRON_SECRET,
	PRIVATE_HCB_AUTH_BODY_TOKEN,
	PRIVATE_HCB_COOKIE,
	PRIVATE_HCB_CSRF_TOKEN,
	PRIVATE_SLACK_BOT_TOKEN,
	PRIVATE_MASTER_KEY
} from '$env/static/private';
import prisma from './prisma';
export type HcbGrantResponse = HcbGrantResponse0 & HcbErrorResponse;
interface HcbErrorResponse {
	error: string;
}
export interface HcbGrantResponse0 {
	id: string;
	user: User;
	organization: Organization;
	amount_cents: number;
	merchant_lock: any[];
	category_lock: string[];
	keyword_lock: string;
	allowed_merchants: string[];
	allowed_categories: string[];
	status: string;
	disbursements: Disbursement[];
	card_id?: any;
  }
  
  export interface Disbursement {
	id: string;
	memo: string;
	status: string;
	transaction_id: string;
	amount_cents: number;
	from: Organization;
	to: Organization;
	sender: User;
  }
  
  export interface Organization {
	created_at: string;
	id: string;
	name: string;
	country: string;
	slug: string;
	icon?: any;
	playground_mode: boolean;
	playground_mode_meeting_requested: boolean;
	transparent: boolean;
	fee_percentage: number;
	background_image?: any;
  }
  
  export interface User {
	id: string;
	name: string;
	email: string;
	avatar: string;
	admin: boolean;
	auditor: boolean;
  }
export async function sendHCBGrants() {
	// const data = await fetch(
	// 	`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/ships?filterByFormula=${encodeURIComponent(`AND({HCB grant approve} = TRUE(), {_automation_grant_sent} = FALSE())`)}`,
	// 	{
	// 		headers: {
	// 			Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
	// 		}
	// 	}
	// ).then((r) => r.json());
	const data = await prisma.ship.findMany({
		where: {
			approved_for_grant: true,
			automation_approved_for_grant: false,
			is_under_some_review_rn: true,
		}
	})
	const recordsToUpdate:string[] = [];
	// loop thru allat records
	for (const record of data) {
		// so we send hcb record hypothetically
		// console.log(record)
		fetch('https://api.saahild.com/api/hcb_revers/grant', {
			method: 'POST',
			headers: {
			Authorization: PRIVATE_MASTER_KEY
			},
			body: new URLSearchParams({
				org: "market-ysws",
				email: await prisma.user.findUnique({
					where: {
						slackId: record.userId!
					},
					select: {
						hcb_email: true
					}
				}).then((d) => d?.hcb_email || ''),
				amount: (dev ? 0.01 : record.grant_amount).toString(),
				// 30 char limit so whats the __ point
				purpose: "Your grant" ,
			})
		}).then(async (d) => {
			console.log(d.status);
			const text = await d.json().then(d=> d as HcbGrantResponse);
			console.log(text)
			if (
				text.error
 			) {
				await fetch(`https://slack.com/api/chat.postMessage`, {
					headers: {
						Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
						'Content-Type': 'application/json; charset=utf-8'
					},
					method: 'POST',
					body: JSON.stringify({
						text: `${dev ? `[DEV]` : ''}  umm the grant failed to send -- bad cookies or smthing... \n> ${text.error}`,
						channel: `C08GZ6QF97Z`
					})
				}).then((r) => r.json());
				// then throw so we dont say it was good
				await fetch(`https://slack.com/api/chat.postMessage`, {
					headers: {
						Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
						'Content-Type': 'application/json; charset=utf-8'
					},
					method: 'POST',
					body: JSON.stringify({
						text: `${dev ? `[DEV]` : ''}  <@${record.userId}> your ship (${record.Name}) grant failed to send -- will be fixed soon ;-; \n> ${text.error}`,
						channel: record.userId
					})
				}).then((r) => r.json());
				return;
			}
		});
		await fetch(`https://slack.com/api/chat.postMessage`, {
			headers: {
				Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
				'Content-Type': 'application/json; charset=utf-8'
			},
			method: 'POST',
			body: JSON.stringify({
				text: `${dev ? `[DEV]` : ''}  <@${record.userId}> has been sent there grant for there ship ${record.Name} (${record.id})`,
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
				text: `${dev ? `[DEV]` : ''}  <@${record.userId}> your ship (${record.Name}) grant has been sent to you!, once you have bought all the materials and assembled everything and have sent the package out to hq then *Mark it under HQ review* (the rocket button) where it will let our team know that you have sent it for manual review!`,
				channel: record.userId
			})
		}).then((r) => r.json());
	recordsToUpdate.push(record.id);
	}
	await prisma.ship.updateMany({
		where: {
			id: {
			in: recordsToUpdate
			},
		},
		data: {
			automation_approved_for_grant: true,
			is_under_some_review_rn: false,
			// user must push it to hq review once they ship it.
		}
	});

	// update airtable
	// await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/ships`, {
	// 	method: 'PATCH',
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 		Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
	// 	},
	// 	body: JSON.stringify({
	// 		records: recordsToUpdate
	// 	})
	// });
}
export async function draftAllRejectedShips() {
	// query airtable with formula
	const data = await prisma.ship.findMany({
		where: {
			rejected_for_something: {
				not: null
			},
			is_under_some_review_rn: true
		}
	});

	// console.log(data)
	const recordsToUpdate = [];
	// send msg to oauth2 with hcb if no email on file
	for (const d of data) {
		// yipee u have made it or smthing now send a message
		fetch(`https://slack.com/api/chat.postMessage`, {
			headers: {
				Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
				'Content-Type': 'application/json; charset=utf-8'
			},
			method: 'POST',
			body: JSON.stringify({
				text: `${dev ? `[DEV]` : ''} <@${d.userId}> your ship (${d.Name}) was rejected!\n> ${d.rejected_for_something}`,
				channel: d.userId
			})
		}).then((r) => r.json());
		fetch(`https://slack.com/api/chat.postMessage`, {
			headers: {
				Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
				'Content-Type': 'application/json; charset=utf-8'
			},
			method: 'POST',
			body: JSON.stringify({
				text: `${dev ? `[DEV]` : ''} <@${d.userId}>  ship (${d.Name}) was rejected!\n> ${d.rejected_for_something}`,
				channel: 'C08GZ6QF97Z'
			})
		}).then((r) => r.json());
		recordsToUpdate.push(d.id);
	}
	await prisma.ship.updateMany({
		where: {
			id: {
				in: recordsToUpdate
			}
		},
		data: {
			is_under_some_review_rn: false,
			status: 'DRAFT',
			rejected_for_something: null
		}
	});
}
export async function promoteUsersFromDigitalReview() {
	// query airtable with formula
	const data = await prisma.ship.findMany({
		where: {
			approved_for_digital: true,
			automation_approved_for_digital: false,
			is_under_some_review_rn: true,
		}
	})
	const recordsToUpdate = [];
	// send msg to oauth2 with hcb if no email on file
	for (const d of data) {
		// yipee u have made it or smthing now send a message
		fetch(`https://slack.com/api/chat.postMessage`, {
			headers: {
				Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
				'Content-Type': 'application/json; charset=utf-8'
			},
			method: 'POST',
			body: JSON.stringify({
				text: `${dev ? `[DEV]` : ''}  <@${d.userId}> has been approved from digital review and now has to submit there grant request!`,
				channel: `C08GZ6QF97Z`
			})
		}).then((r) => r.json());
		fetch(`https://slack.com/api/chat.postMessage`, {
			headers: {
				Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
				'Content-Type': 'application/json; charset=utf-8'
			},
			method: 'POST',
			body: JSON.stringify({
				text: `${dev ? `[DEV]` : ''} Hey your ship ${d.Name} (${d.id}) has been approved from digital review (aka someone looked at it and saids ok), now make sure you have a *hcb account* linked to what you submited as your *hcb email* and then open your ship and click the rocket, and promote it to grant review!`,
				channel: d.userId
			})
		}).then((r) => r.json());
		recordsToUpdate.push(d.id);
	}
	// otherwise promote and mark as done
	await prisma.ship.updateMany({
		where: {
			id: {
				in: recordsToUpdate
			}
		},
		data: {
			is_under_some_review_rn: false,
			status: 'UNDER_HQ_DIGITAL_REVIEW',
			automation_approved_for_digital: true
		}
	});
}
export async function cleanUpOldTimers() {
	const data = await prisma.time.findMany({
		where: {
			// how can i check if updatedAt is older than 15 mins?
			updatedAt: {
				lt: new Date(Date.now() - 15 * 60 * 1000)
			},
			video_link: null
		}
	});
	for (const d of data) {
		// dm the user about it
		await fetch(`https://slack.com/api/chat.postMessage`, {
			headers: {
				Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
				'Content-Type': 'application/json; charset=utf-8'
			},
			method: 'POST',
			body: JSON.stringify({
				text: `${dev ? `[DEV]` : ''} <@${d.userId}> your timer has expired and ur time session with (ship ${d.shipId}) has been deleted`,
				channel: d.userId
			})
		});
		// also to the other channel
		await fetch(`https://slack.com/api/chat.postMessage`, {
			headers: {
				Authorization: `Bearer ${PRIVATE_SLACK_BOT_TOKEN}`,
				'Content-Type': 'application/json; charset=utf-8'
			},
			method: 'POST',
			body: JSON.stringify({
				text: `${dev ? `[DEV]` : ''} <@${d.userId}>  timer  expired and  has been deleted`,
				channel: 'C08GZ6QF97Z'
			})
		});
		await prisma.time.delete({
			where: {
				id: d.id,
				userId: d.userId
			}
		});
	}

	// console.log(data)
}
