export function GET(req: Request) {
	return new Response(JSON.stringify('Hi:3'), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
