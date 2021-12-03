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
import { performance } from 'perf_hooks';
import webpack from 'webpack';
import { createWebpackConfig } from '../config/create-webpack-config';
import { createSSrBundle } from '../lib/create-ssr-bundle';
import { generateDts } from '../lib/generate-dts';
import { getConfig } from '../lib/get-config';
import { green, logToStdout } from '../lib/log-to-stdout';
import { resolveApp, resolveShowroom } from '../lib/paths';

async function buildStaticSite(
  config: NormalizedReactShowroomConfiguration,
  profile = false
) {
  const webpackConfig = createWebpackConfig('production', config, {
    outDir: config.outDir,
    profileWebpack: profile,
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

  let pageCount = 0;

  for (const route of routes) {
    if (route !== '') {
      pageCount++;

      await fs.outputFile(
        resolveApp(`${config.outDir}/${route}/index.html`),
        await getHtml(`/${route}`)
      );
    }
  }

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

  return pageCount + 1;
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

  let pageCount = 0;

  for (const route of routes) {
    if (route !== '') {
      pageCount++;

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

  return pageCount;
}

export async function buildShowroom(
  userConfig?: ReactShowroomConfiguration,
  configFile?: string,
  profile?: boolean
) {
  const config = getConfig('production', configFile, userConfig);

  await generateDts(config, false);

  const ssrDir = resolveShowroom(
    `ssr-result-${Date.now() + performance.now()}`
  );

  try {
    if (profile) {
      await buildStaticSite(config, profile);
      await createSSrBundle(config, ssrDir, profile);
    } else {
      await Promise.all([
        buildStaticSite(config, profile),
        createSSrBundle(config, ssrDir, profile),
      ]);
      logToStdout('Prerendering...');
      const [sitePageCount, previewPageCount] = await Promise.all([
        prerenderSite(config, ssrDir),
        prerenderPreview(config, ssrDir),
      ]);
      logToStdout(
        green(`Prerendered ${sitePageCount + previewPageCount} pages.`)
      );
      logToStdout(`Generated showroom at`);
      logToStdout(`  -  ${green(resolveApp(config.outDir))}`);
    }
  } finally {
    await fs.remove(ssrDir);
  }
}
