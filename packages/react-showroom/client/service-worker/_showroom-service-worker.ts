/// <reference lib="es2020" />
/// <reference lib="webworker" />

import { ExpirationPlugin } from 'workbox-expiration';
import { offlineFallback } from 'workbox-recipes';
import { registerRoute, Route, setDefaultHandler } from 'workbox-routing';
import { CacheFirst, NetworkOnly } from 'workbox-strategies';
import { basename } from '../lib/config';

const assets: Array<{
  revision: string;
  url: string;
  // @ts-expect-error
}> = self.__WB_MANIFEST;

setDefaultHandler(new NetworkOnly());

offlineFallback({
  pageFallback: `${basename}/_offline`,
});

// cache styles so offline page look right
registerRoute(
  new Route(
    ({ sameOrigin, request, url }) => {
      if (
        !sameOrigin ||
        (request.destination !== 'style' && request.destination !== 'font')
      ) {
        return false;
      }

      const matchAsset = assets.find(
        (asset) => !asset.revision && url.pathname === asset.url
      );

      return !!matchAsset;
    },
    new CacheFirst({
      cacheName: 'styles',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 50,
        }),
      ],
    })
  )
);

registerRoute(
  new Route(
    ({ request, sameOrigin }) => sameOrigin && request.url.endsWith('.wasm'),
    new CacheFirst({
      cacheName: 'wasmCache',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 3,
        }),
      ],
    })
  )
);

/*
registerRoute(
  new Route(
    ({ sameOrigin, request }) =>
      sameOrigin &&
      (request.destination === 'document' || request.destination === 'iframe'),

    new NetworkFirst({
      cacheName: 'page',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 10,
        }),
      ],
    })
  )
);
 */
