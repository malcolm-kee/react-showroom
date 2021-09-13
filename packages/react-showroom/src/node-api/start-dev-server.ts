// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

import { ReactShowroomConfiguration } from '@showroomjs/core/react';
import chalk from 'chalk';
import * as path from 'path';
import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import { argv } from 'yargs';
import { createWebpackConfig } from '../config/create-webpack-config';
import { getConfig } from '../lib/get-config';
import { logToStdout } from '../lib/log-to-stdout';
import { prepareUrls } from '../lib/prepare-url';

const { openBrowser } = require(path.resolve(
  __dirname,
  '..',
  '..',
  'open-browser',
  'open-browser.js'
));

export async function startDevServer(userConfig?: ReactShowroomConfiguration) {
  const config = getConfig(userConfig);
  const { assetDirs, devServerPort } = config;

  const PORT = Number((argv as any).port ?? process.env.PORT ?? devServerPort);
  const HOST = '0.0.0.0';

  const webpackConfig = createWebpackConfig('development', config);

  const devServerOptions: webpackDevServer.Configuration = {
    port: PORT,
    host: HOST,
    client: {
      logging: 'none',
    },
    hot: true, // hot reload replacement not supported for module federation
    historyApiFallback: true,
    static: assetDirs.map((dir) => ({
      directory: dir,
      watch: true,
    })),
  };

  const compiler = webpack(webpackConfig);

  const server = new webpackDevServer(devServerOptions, compiler);

  await server.start();

  const urls = prepareUrls('http', HOST, PORT);
  logToStdout(
    `Starting the development server on ${chalk.greenBright(
      urls.localUrlForBrowser
    )}...`
  );

  openBrowser(urls.localUrlForBrowser);
}
