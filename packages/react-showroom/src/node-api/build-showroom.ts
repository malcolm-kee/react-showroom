// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

import { Ssr } from '@showroomjs/core';
import {
  NormalizedReactShowroomConfiguration,
  ReactShowroomConfiguration,
} from '@showroomjs/core/react';
import * as fs from 'fs-extra';
import { build, Manifest } from 'vite';
import { createViteConfig } from '../config/create-vite-config';
import { getConfig } from '../lib/get-config';
import { logToStdout } from '../lib/log-to-stdout';
import { resolveApp, resolveShowroom } from '../lib/paths';
import { generateHtml } from '../lib/write-index-html';

export interface StartServerOptions extends ReactShowroomConfiguration {
  configFile?: string;
}

export async function buildShowroom(
  userConfig?: ReactShowroomConfiguration,
  configFile?: string
) {
  logToStdout('Generating bundle...');

  const config = getConfig('production', configFile, userConfig);

  const { prerender } = config;
  const ssrDir = resolveShowroom('ssr-result');

  await Promise.all([
    build({
      ...(await createViteConfig('production', config)),
      configFile: false,
    }),
    build({
      ...(await createViteConfig('production', config, {
        ssr: {
          outDir: ssrDir,
        },
      })),
      configFile: false,
    }),
  ]);

  try {
    // we always write our HTML manually because vite will ignore HTML in node_modules folder
    // see https://github.com/vitejs/vite/issues/5042
    await outputHtml(config, ssrDir, prerender);
  } finally {
    fs.remove(ssrDir);
  }
}

async function outputHtml(
  config: NormalizedReactShowroomConfiguration,
  ssrDir: string,
  ssg: boolean
) {
  logToStdout('Generating HTML...');
  const serverEntry: Ssr = require(`${ssrDir}/server-entry.js`);
  const manifestPath = resolveApp(`${config.outDir}/manifest.json`);

  const manifest: Manifest = await fs.readJson(manifestPath);

  const htmlPath = resolveApp(`${config.outDir}/index.html`);

  const { render, getCssText, getHelmet, getRoutes } = serverEntry;

  const clientEntryManifest = manifest['client/ssr-client-entry.tsx'];

  const cssToPreload = new Set<string>();

  if (config.preloadAllCss) {
    Object.values(manifest).forEach((chunk) => {
      if (chunk.css) {
        chunk.css.forEach((css) => cssToPreload.add(css));
      }
    });
  }

  const scriptsToPrefetch = config.prefetchAll
    ? Object.entries(manifest)
        .filter(
          ([key, chunk]) =>
            key !== 'client/ssr-client-entry.tsx' && chunk.file.endsWith('.js')
        )
        .map(([, chunk]) => chunk.file)
    : [];

  const template = generateHtml(
    `<script type="module" src="${`${config.basePath}/${clientEntryManifest.file}`}"></script>`,
    clientEntryManifest.css
      ? clientEntryManifest.css
          .map(
            (css) =>
              `<link rel="stylesheet" href="${`${config.basePath}/${css}`}" />`
          )
          .join('')
      : '',
    [...cssToPreload]
      .map(
        (link) =>
          `<link rel="preload stylesheet" href="${config.basePath}/${link}" as="style" />`
      )
      .concat(
        scriptsToPrefetch.map(
          (link) =>
            `<link rel="prefetch" as="script" href="${config.basePath}/${link}" />`
        )
      )
      .join(''),
    config.theme
  );

  const routes = await getRoutes();

  if (config.basePath !== '') {
    logToStdout(`Prerender with basePath: ${config.basePath}`);
  }

  if (ssg) {
    logToStdout('Prerendering...');

    for (const route of routes) {
      if (route !== '') {
        logToStdout(` - /${route}`);

        await fs.outputFile(
          resolveApp(`${config.outDir}/${route}/index.html`),
          await getHtml(`/${route}`)
        );
      }
    }

    logToStdout(` - /`);
  }

  await fs.outputFile(htmlPath, await getHtml('/'));

  async function getHtml(pathname: string) {
    const { result: renderResult, cleanup } = await render({ pathname });
    const helmet = getHelmet();
    const finalHtml = template
      .replace(
        '<!--SSR-style-->',
        `<style id="stitches">${getCssText()}</style>`
      )
      .replace(
        '<!--SSR-helmet-->',
        `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}`
      )
      .replace('<!--SSR-target-->', ssg ? renderResult : '');

    cleanup();

    return finalHtml;
  }
}
