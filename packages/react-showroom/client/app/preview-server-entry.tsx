import { QueryClientProvider } from '@showroomjs/bundles/query';
import {
  encodeDisplayName,
  flattenArray,
  isDefined,
  NestedArray,
  Ssr,
} from '@showroomjs/core';
import { ReactShowroomSection } from '@showroomjs/core/react';
import { getCssText } from '@showroomjs/ui';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { Helmet } from 'react-helmet';
import sections from 'react-showroom-sections';
import { createQueryClient } from '../lib/create-query-client';
import { factoryMap } from '../lib/lazy';
import { StaticRouter } from '../lib/routing';
import { PreviewApp } from './preview-app';

export const ssr: Ssr = {
  render: async ({ pathname }) => {
    for (const [fn] of factoryMap) {
      const result = await fn();
      factoryMap.set(fn, result.default);
    }

    const queryClient = createQueryClient();

    const result = ReactDOMServer.renderToString(
      <StaticRouter
        location={{ pathname }}
        basename={`${process.env.BASE_PATH}/_preview`}
      >
        <QueryClientProvider client={queryClient}>
          <PreviewApp />
        </QueryClientProvider>
      </StaticRouter>
    );

    return {
      result,
      cleanup: () => queryClient.clear(),
    };
  },
  getCssText,
  getHelmet: () => Helmet.renderStatic(),
  getRoutes: async () => {
    const result: NestedArray<string> = [];

    async function getRoute(section: ReactShowroomSection): Promise<void> {
      if (section.type === 'group') {
        await Promise.all(section.items.map(getRoute));
      }

      if (section.type === 'component') {
        const { codeblocks } = await section.data.load();

        const codeHashes = Object.values(codeblocks)
          .map((block) => block?.initialCodeHash)
          .filter(isDefined);

        if (codeHashes.length > 0) {
          result.push(
            codeHashes.map(
              (hash) =>
                `${hash}/${encodeDisplayName(section.metadata.displayName)}`
            )
          );
        }
      }

      if (section.type === 'markdown') {
        const { codeblocks } = await section.load();

        const codeHashes = Object.values(codeblocks)
          .map((block) => block?.initialCodeHash)
          .filter(isDefined);

        if (codeHashes.length > 0) {
          result.push(codeHashes);
        }
      }
    }

    for (const section of sections) {
      await getRoute(section);
    }

    return flattenArray(result);
  },
};
