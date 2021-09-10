// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

import { Ssr } from '@compdoc/core';
import * as fs from 'fs-extra';
import * as temp from 'temp';
import webpack from 'webpack';
import { createWebpackConfig } from '../config/create-webpack-config';
import { createPrerenderBundle } from '../lib/create-prerender-bundle';
import { logToStdout } from '../lib/log-to-stdout';
import { getConfig } from '../lib/get-config';
import { resolveApp } from '../lib/paths';

temp.track();

const { prerender, outDir, basePath } = getConfig();

async function buildStaticSite() {
  const webpackConfig = createWebpackConfig('production', {
    outDir,
    prerender,
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

async function prerenderSite(tmpDir: string) {
  const prerenderCodePath = `${tmpDir}/server/prerender.js`;
  const htmlPath = resolveApp(`${outDir}/index.html`);

  const { render, getCssText, getHelmet, getRoutes } =
    require(prerenderCodePath) as Ssr;

  const template = await fs.readFile(htmlPath, 'utf-8');

  const routes = getRoutes();

  if (basePath !== '/') {
    logToStdout(`Prerender with basePath: ${basePath}`);
  }

  logToStdout('Prerendering...');

  for (const route of routes) {
    if (route !== '') {
      logToStdout(` - /${route}`);

      await fs.outputFile(
        resolveApp(`${outDir}/${route}/index.html`),
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

(async function build() {
  const tmpDir = await temp.mkdir('react-compdoc-ssr');

  await Promise.all([
    buildStaticSite(),
    prerender ? createPrerenderBundle(tmpDir) : Promise.resolve(),
  ]);

  if (prerender) {
    await prerenderSite(tmpDir);
  }

  logToStdout('Done');
})();
