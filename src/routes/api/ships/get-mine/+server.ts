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
    const data = await prisma.ship.findMany({ 
        where: {
            userId: sessionData.slackId
        }
    }).then(dd => {
        // console.log(dd.records[0])
        return dd.map((d) => ({
            title: d.Name,
            status: d.status,
            coverLink: d.cover_image_url,
            id: d.id,
            assignee: d.Reviewer,
            reviewer_feedback: d.reviewer_feedback,
            featured: d.featured || false,
            // notes_for_reviewer: d.notes_for_reviewer,
            description: d.Description,
            avatar: `https://cachet.dunkirk.sh/users/${d.userId}/r`,
            author: d.slack_user_name,
            author_slack_id: d.userId,
        })).filter(d => d.title)
    })
    return new Response(JSON.stringify(data), {
        headers: {
            "Content-Type": "application/json"
        }
    })
}