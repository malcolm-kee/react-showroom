/// <reference lib="es2020" />
/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from 'workbox-precaching';
import { warmStrategyCache } from 'workbox-recipes';
import { setCatchHandler, setDefaultHandler } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { basename } from '../lib/config';

const FALLBACK_HTML_URL = `${basename}/_offline.html`;
const FALLBACK_STRATEGY = new CacheFirst();

warmStrategyCache({
  urls: [FALLBACK_HTML_URL],
  strategy: FALLBACK_STRATEGY,
});

const sw = self as unknown as ServiceWorkerGlobalScope;

// eslint-disable-next-line no-restricted-globals
const assets: Array<{
  revision: string;
  url: string;
  // @ts-expect-error
}> = self.__WB_MANIFEST;

precacheAndRoute(assets);

// Use a stale-while-revalidate strategy to handle requests by default.
setDefaultHandler(new StaleWhileRevalidate());

// This "catch" handler is triggered when any of the other routes fail to
// generate a response.
setCatchHandler(async ({ event }) => {
  // The warmStrategyCache recipe is used to add the fallback assets ahead of
  // time to the runtime cache, and are served in the event of an error below.
  // Use `event`, `request`, and `url` to figure out how to respond, or
  // use request.destination to match requests for specific resource types.

  switch ((event as any).request.destination) {
    case 'document':
      return FALLBACK_STRATEGY.handle({ event, request: FALLBACK_HTML_URL });

    default:
      // If we don't have a fallback, return an error response.
      return Response.error();
  }
});
