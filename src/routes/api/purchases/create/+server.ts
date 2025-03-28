export function POST(req: Request) { 
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
    const body = await req.request.json()
    console.log(body)
    if (!body) return new Response("no body")
    // check for seller product ID (ship id??)
    
}