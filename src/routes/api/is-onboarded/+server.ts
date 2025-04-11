import prisma from "$lib/prisma";

export async function GET(req: Request) {
    if(!req.cookies.get('session')) return new Response('not onboarded', {
        status: 401
    });
    const user = await prisma.user.findFirst({
        where: {
            token: req.cookies.get('session')
        }
    });
    if(!user) return new Response('not onboarded', {
        status: 401
    });
    const onboarded = user.address && user.hcb_email && user.reigions_for_shipping
    if(!onboarded) return new Response('not onboarded', {
        status: 401
    });
    return new Response('onboarded', {
        status: 200
    });
}