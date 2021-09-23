// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

import { Ssr } from '@showroomjs/core';
import {
  NormalizedReactShowroomConfiguration,
  ReactShowroomConfiguration,
} from '@showroomjs/core/react';
import * as fs from 'fs-extra';
import { build } from 'vite';
import { createViteConfig } from '../config/create-vite-config';
import { getConfig } from '../lib/get-config';
import { logToStdout } from '../lib/log-to-stdout';
import { resolveApp, resolveShowroom } from '../lib/paths';
import { writeIndexHtml } from '../lib/write-index-html';

export interface StartServerOptions extends ReactShowroomConfiguration {
  configFile?: string;
}

export async function buildShowroom(
  userConfig?: ReactShowroomConfiguration,
  configFile?: string
) {
  logToStdout('Generating client bundle...');

  const config = getConfig('production', configFile, userConfig);

  writeIndexHtml(config.theme);

  const { prerender } = config;

  await build({
    ...(await createViteConfig('production', config)),
    configFile: false,
  });

  if (prerender) {
    logToStdout('Generating prerender bundle...');

    const ssrDir = resolveShowroom('ssr-result');

    await build({
      ...(await createViteConfig('production', config, {
        ssr: {
          outDir: ssrDir,
        },
      })),
      configFile: false,
    });

    try {
      prerenderSite(config, ssrDir);
    } finally {
      fs.remove(ssrDir);
    }
  }
}

async function prerenderSite(
  config: NormalizedReactShowroomConfiguration,
  ssrDir: string
) {
  const serverEntry: Ssr = require(`${ssrDir}/server-entry.js`);
  const htmlPath = resolveApp(`${config.outDir}/index.html`);

  const { render, getCssText, getHelmet, getRoutes } = serverEntry;

  const template = await fs.readFile(htmlPath, 'utf-8');

  const routes = getRoutes();

  if (config.basePath !== '') {
    logToStdout(`Prerender with basePath: ${config.basePath}`);
  }

  logToStdout('Prerendering...');

  for (const route of routes) {
    if (route !== '') {
      logToStdout(` - /${route}`);

      await fs.outputFile(
        resolveApp(`${config.outDir}/${route}/index.html`),
        getHtml(`/${route}`)
      );
    }
  }

  logToStdout(` - /`);

  await fs.outputFile(htmlPath, getHtml('/'));

  function getHtml(pathname: string) {
    const prerenderContent = render({ pathname });
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
      .replace('<!--SSR-target-->', prerenderContent);

    return finalHtml;
  }
}
