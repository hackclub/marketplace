import { sequence } from "@sveltejs/kit/hooks";
import { handleErrorWithSentry, sentryHandle } from "@sentry/sveltekit";
import * as Sentry from '@sentry/sveltekit';
import prisma from "$lib/prisma";

Sentry.init({
  dsn: 'https://77f6aed8c8164ba7e7c3aa47b7e839f6@o4508373315026944.ingest.us.sentry.io/4509129843671040',

  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: import.meta.env.DEV,
});

// If you have custom handlers, make sure to place them after `sentryHandle()` in the `sequence` function.
export const handle = sequence(sentryHandle(),async function ({ event, resolve }) {
  console.log(event.url.pathname)
  const cookie = event.cookies.get('session')
  if (cookie && !event.cookies.get('onboarded') && event.url.pathname !== "/onboard" && event.url.pathname !== "/api/settings/update") {
    const userData = await prisma.user.findFirst({
      where: {
        token: cookie
      }
    })
    if (userData) {
      if (!(userData.address && userData.hcb_email && userData.reigions_for_shipping)) {
        // console.log(`DAWG LEMME IN `)
        return new Response('You are NOT skipping onboarding', {
          status: 302,
          headers: {
            location: '/onboard?a=1'
          }
        });
      } 
    }
    
  } 

	const response = await resolve(event);
	return response;
})

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
