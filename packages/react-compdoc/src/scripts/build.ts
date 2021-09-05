// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

import webpack from 'webpack';
import * as fs from 'fs';
import {
  createPrerenderWebpackConfig,
  createWebpackConfig,
} from '../config/create-webpack-config';
import { getConfig } from '../lib/get-config';
import { resolveApp } from '../lib/paths';
import * as rimraf from 'rimraf';

const { prerender, outDir } = getConfig();

async function buildStaticSite() {
  const webpackConfig = await createWebpackConfig('production', { outDir });

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

async function prerenderSite() {
  const webpackConfig = await createPrerenderWebpackConfig('production', {
    outDir,
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

  const prerenderCodePath = resolveApp(`${outDir}/server/prerender.js`);
  const htmlPath = resolveApp(`${outDir}/index.html`);

  const { render, getCssText } = require(prerenderCodePath);

  const prerenderContent = render();

  const template = await fs.promises.readFile(htmlPath, 'utf-8');

  const finalHtml = template
    .replace('<!--SSR-target-->', prerenderContent)
    .replace('/* SSR-style */', getCssText());

  await fs.promises.writeFile(htmlPath, finalHtml);

  rimraf.sync(`${outDir}/server`);
}

(async function build() {
  await buildStaticSite();

  if (prerender) {
    await prerenderSite();
  }
})();
