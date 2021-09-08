// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import { argv } from 'yargs';
import { createWebpackConfig } from '../config/create-webpack-config';
import { prepareUrls } from '../lib/prepare-url';
import * as path from 'path';

const { openBrowser } = require(path.resolve(
  __dirname,
  '..',
  '..',
  'open-browser',
  'open-browser.js'
));

(async function startDevServer() {
  const PORT = Number((argv as any).port ?? process.env.PORT ?? 6969);
  const HOST = '0.0.0.0';

  const webpackConfig = createWebpackConfig('development');

  const devServerOptions: webpackDevServer.Configuration = {
    port: PORT,
    host: HOST,
    client: {
      logging: 'none',
    },
    hot: true, // hot reload replacement not supported for module federation
    historyApiFallback: true,
  };

  const compiler = webpack(webpackConfig);

  const server = new webpackDevServer(devServerOptions, compiler);

  await server.start();

  const urls = prepareUrls('http', HOST, PORT);
  console.log(
    `Starting the development server on ${urls.localUrlForBrowser}...`
  );

  openBrowser(urls.localUrlForBrowser);
})();
