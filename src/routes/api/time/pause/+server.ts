import { type RequestEvent } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function POST({ request, cookies }: RequestEvent) {
	const session = cookies.get('session');
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

	const body = await request.json();
	const { isPaused, pauseHistory } = body;

	const timeData = await prisma.time.findFirst({
		where: {
			userId: sessionData.slackId,
			AND: {
				video_link: null
			}
		}
	});

	if (!timeData) {
		return new Response('No time data found', {
			status: 404
		});
	}

	await prisma.time.update({
		where: {
			id: timeData.id
		},
		data: {
			updatedAt: new Date().toISOString(),
			pausedAt: isPaused ? new Date().toISOString() : null,
			pauseHistory: pauseHistory || []
		}
	});

	return new Response(JSON.stringify({ message: isPaused ? 'Timer paused' : 'Timer resumed' }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
} 