// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

import { ReactShowroomConfiguration } from '@showroomjs/core/react';
import path from 'path';
import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import { argv } from 'yargs';
import { createClientWebpackConfig } from '../config/create-webpack-config';
import { generateDts } from '../lib/generate-dts';
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

export interface StartServerOptions extends ReactShowroomConfiguration {
  configFile?: string;
}

type DevServerConfig = webpackDevServer.Configuration;

export async function startDevServer(
  userConfig?: ReactShowroomConfiguration,
  configFile?: string
) {
  logToStdout('Starting dev server...');

  const config = getConfig('development', configFile, userConfig);

  const { devServerPort, assetDir, example } = config;

  if (example.enableAdvancedEditor) {
    await generateDts(config, true);
  }

  const HOST = '0.0.0.0';
  const PORT = Number((argv as any).port ?? process.env.PORT ?? devServerPort);

  const webpackConfig = createClientWebpackConfig('development', config);
  const devServerOptions = Object.assign<DevServerConfig, DevServerConfig>(
    {
      port: PORT,
      host: HOST,
      client: {
        logging: 'none',
      },
      hot: true,
      historyApiFallback: {
        rewrites: [
          { from: /^\/_preview/, to: '/_preview.html' },
          { from: /^\/_interaction/, to: '/_interaction.html' },
          { from: /./, to: '/index.html' },
        ],
      },
    },
    assetDir
      ? {
          static: {
            directory: assetDir,
            watch: true,
          },
        }
      : {}
  );

  const compiler = webpack(webpackConfig);

  const server = new webpackDevServer(devServerOptions, compiler);

  await server.start();

  const urls = prepareUrls('http', HOST, PORT);

  openBrowser(urls.localUrlForBrowser);

  logToStdout(`Dev server available at ${urls.localUrlForTerminal}`);

  return server;
}
