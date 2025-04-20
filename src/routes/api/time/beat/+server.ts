import prisma from "$lib/prisma";

export async function GET(req: Request) {
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
    const timeData = await prisma.time.findFirst({
		where: {
			userId: sessionData.slackId,
			'AND': {
				video_link: null
			}
		}
	});
    if (!timeData) {
        return new Response(JSON.stringify({ message: 'No time data' }), {
            status: 401
        });
    }
    await prisma.time.update({
        where: {
            id: timeData.id
        },
        data: {
            updatedAt: new Date().toISOString()
        }
    });
    return new Response(JSON.stringify({ message: 'Time updated' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}