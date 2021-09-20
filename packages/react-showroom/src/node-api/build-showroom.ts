// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

import { Ssr } from '@showroomjs/core';
import {
  NormalizedReactShowroomConfiguration,
  ReactShowroomConfiguration,
} from '@showroomjs/core/react';
import * as fs from 'fs-extra';
import * as temp from 'temp';
import webpack from 'webpack';
import { createWebpackConfig } from '../config/create-webpack-config';
import { createPrerenderBundle } from '../lib/create-prerender-bundle';
import { getConfig } from '../lib/get-config';
import { logToStdout } from '../lib/log-to-stdout';
import { resolveApp } from '../lib/paths';

temp.track();

async function buildStaticSite(config: NormalizedReactShowroomConfiguration) {
  const webpackConfig = createWebpackConfig('production', config, {
    outDir: config.outDir,
    prerender: config.prerender,
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

  const { render, getCssText, getHelmet, getRoutes } =
    require(prerenderCodePath) as Ssr;

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

export async function buildShowroom(userConfig?: ReactShowroomConfiguration) {
  const tmpDir = await temp.mkdir('react-showroom-ssr');
  const config = getConfig('production', userConfig);

  await Promise.all([
    buildStaticSite(config),
    config.prerender
      ? createPrerenderBundle(config, tmpDir)
      : Promise.resolve(),
  ]);

  if (config.prerender) {
    await prerenderSite(config, tmpDir);
  }
}
