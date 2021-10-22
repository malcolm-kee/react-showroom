require('source-map-support').install();
// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

import { Ssr } from '@showroomjs/core';
import {
  NormalizedReactShowroomConfiguration,
  ReactShowroomConfiguration,
} from '@showroomjs/core/react';
import * as fs from 'fs-extra';
import webpack from 'webpack';
import { createWebpackConfig } from '../config/create-webpack-config';
import { createSSrBundle } from '../lib/create-ssr-bundle';
import { getConfig } from '../lib/get-config';
import { cyan, logToStdout, yellow } from '../lib/log-to-stdout';
import { resolveApp, resolveShowroom } from '../lib/paths';

async function buildStaticSite(config: NormalizedReactShowroomConfiguration) {
  const webpackConfig = createWebpackConfig('production', config, {
    outDir: config.outDir,
  });

  const compiler = webpack(webpackConfig);

  try {
    await new Promise<void>((fulfill, reject) => {
      compiler.run((err, stats) => {
        if (err || stats?.hasErrors()) {
          if (err) {
            console.error(err);
          }
          compiler.close(() => {
            console.error('Fix the error and try again.');
          });
          reject(err);
        }

        compiler.close(() => {
          fulfill();
        });
      });
    });
  } catch (err) {
    console.error(err);
  }
}

async function prerenderSite(
  config: NormalizedReactShowroomConfiguration,
  tmpDir: string
) {
  const prerenderCodePath = `${tmpDir}/server/prerender.js`;
  const htmlPath = resolveApp(`${config.outDir}/index.html`);

  const { ssr } = require(prerenderCodePath) as { ssr: Ssr };

  const template = await fs.readFile(htmlPath, 'utf-8');

  const routes = await ssr.getRoutes();

  if (config.basePath !== '') {
    logToStdout(`Prerender with basePath: ${config.basePath}`);
  }

  logToStdout(cyan('Prerendering...'));

  for (const route of routes) {
    if (route !== '') {
      logToStdout(cyan(` - /${route}`));

      await fs.outputFile(
        resolveApp(`${config.outDir}/${route}/index.html`),
        await getHtml(`/${route}`)
      );
    }
  }

  logToStdout(cyan(` - /`));

  await fs.outputFile(htmlPath, await getHtml('/'));

  async function getHtml(pathname: string) {
    const prerenderResult = await ssr.render({ pathname });
    const helmet = ssr.getHelmet();
    const finalHtml = template
      .replace(
        '<!--SSR-style-->',
        `<style id="stitches">${ssr.getCssText()}</style>`
      )
      .replace(
        '<!--SSR-helmet-->',
        `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}`
      )
      .replace('<!--SSR-target-->', prerenderResult.result);

    prerenderResult.cleanup();

    return finalHtml;
  }
}

async function prerenderPreview(
  config: NormalizedReactShowroomConfiguration,
  tmpDir: string
) {
  const prerenderCodePath = `${tmpDir}/server/previewPrerender.js`;
  const htmlPath = resolveApp(`${config.outDir}/_preview.html`);

  const { ssr } = require(prerenderCodePath) as { ssr: Ssr };

  const template = await fs.readFile(htmlPath, 'utf-8');

  const routes = await ssr.getRoutes();

  logToStdout(yellow('Prerendering preview...'));

  for (const route of routes) {
    if (route !== '') {
      logToStdout(yellow(` - /_preview/${route}`));

      await fs.outputFile(
        resolveApp(`${config.outDir}/_preview/${route}/index.html`),
        await getHtml(`/${route}`)
      );
    }
  }

  async function getHtml(pathname: string) {
    const prerenderResult = await ssr.render({ pathname });
    const helmet = ssr.getHelmet();
    const finalHtml = template
      .replace(
        '<!--SSR-style-->',
        `<style id="stitches">${ssr.getCssText()}</style>`
      )
      .replace(
        '<!--SSR-helmet-->',
        `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}`
      )
      .replace('<!--SSR-target-->', prerenderResult.result);

    prerenderResult.cleanup();

    return finalHtml;
  }
}

export async function buildShowroom(
  userConfig?: ReactShowroomConfiguration,
  configFile?: string
) {
  const config = getConfig('production', configFile, userConfig);

  const ssrDir = resolveShowroom('ssr-result');

  await Promise.all([
    buildStaticSite(config),
    config.prerender ? createSSrBundle(config, ssrDir) : Promise.resolve(),
  ]);

  if (config.prerender) {
    try {
      await Promise.all([
        prerenderSite(config, ssrDir),
        prerenderPreview(config, ssrDir),
      ]);
    } finally {
      await fs.remove(ssrDir);
    }
  }
}
