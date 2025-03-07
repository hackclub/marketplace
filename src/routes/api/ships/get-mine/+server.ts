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
        console.log(dd.records[0])
        return dd.records.map((d) => ({
            name: d.fields.Name,
            status: d.fields.Status,
            id: d.id,
            assignee: d.Assignee ? d.Assignee.name : null,
            reviewer_feedback: d.reviewer_feedback,
            featured: d.featured || false,
            notes_for_reviewer: d.notes_for_reviewer,
            description: d.description,
        })).filter(d => d.name)
    })
    return new Response(JSON.stringify(data), {
        headers: {
            "Content-Type": "application/json"
        }
    })
}