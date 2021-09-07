// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

import { Ssr } from '@compdoc/core';
import * as fs from 'fs';
import * as temp from 'temp';
import webpack from 'webpack';
import { createWebpackConfig } from '../config/create-webpack-config';
import { createPrerenderBundle } from '../lib/create-prerender-bundle';
import { getConfig } from '../lib/get-config';
import { resolveApp } from '../lib/paths';

temp.track();

const { prerender, outDir } = getConfig();

async function buildStaticSite() {
  const webpackConfig = createWebpackConfig('production', {
    outDir,
    prerender,
  });

  const compiler = webpack(webpackConfig);

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
}

async function prerenderSite(tmpDir: string) {
  const prerenderCodePath = `${tmpDir}/server/prerender.js`;
  const htmlPath = resolveApp(`${outDir}/index.html`);

  const { render, getCssText, getHelmet } = require(prerenderCodePath) as Ssr;

  const prerenderContent = render();

  const template = await fs.promises.readFile(htmlPath, 'utf-8');

  const helmet = getHelmet();

  const finalHtml = template
    .replace('/* SSR-style */', getCssText())
    .replace(
      '<!--SSR-helmet-->',
      `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}`
    )
    .replace('<!--SSR-target-->', prerenderContent);

  await fs.promises.writeFile(htmlPath, finalHtml);
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
})();
