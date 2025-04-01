import { PRIVATE_AIRTABLE_BASE_ID, PRIVATE_AIRTABLE_API_KEY } from "$env/static/private";
import prisma from "$lib/prisma";

export async function GET(req: Request) {
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
    
    // query stuff
    const data = await fetch(`https://api.airtable.com/v0/${PRIVATE_AIRTABLE_BASE_ID}/ships?filterByFormula=${encodeURIComponent(`FIND("${sessionData.slackId}", ARRAYJOIN(users, ","))`)}`, {
        headers: {
            Authorization: `Bearer ${PRIVATE_AIRTABLE_API_KEY}`
        }
    }).then(r => r.json()).then(dd => {
        // console.log(dd.records[0])
        return dd.records.map((d) => ({
            title: d.fields.Name,
            status: d.fields.Status,
            coverLink: d.fields.cover_image,
            id: d.id,
            assignee: d.fields.Assignee ? d.fields.Assignee.name : null,
            reviewer_feedback: d.fields.reviewer_feedback,
            featured: d.fields.featured || false,
            notes_for_reviewer: d.fields.notes_for_reviewer,
            description: d.fields.description,
            avatar: `https://cachet.dunkirk.sh/users/${d.fields.slack_user_id}/r`,
            author: d.fields.slack_user_name,
            author_slack_id: d.fields.slack_user_id,
        })).filter(d => d.title)
    })
    return new Response(JSON.stringify(data), {
        headers: {
            "Content-Type": "application/json"
        }
    })
}