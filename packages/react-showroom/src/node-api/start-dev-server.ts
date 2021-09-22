// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

import { ReactShowroomConfiguration } from '@showroomjs/core/react';
import { createServer } from 'vite';
import { argv } from 'yargs';
import { createViteConfig } from '../config/create-vite-config';
import { getConfig } from '../lib/get-config';
import { prepareUrls } from '../lib/prepare-url';

import path from 'path';

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

export async function startDevServer(
  userConfig?: ReactShowroomConfiguration,
  configFile?: string
) {
  const config = getConfig('development', configFile, userConfig);

  const { devServerPort } = config;

  const PORT = Number((argv as any).port ?? process.env.PORT ?? devServerPort);

  const server = await createServer({
    ...(await createViteConfig('development', config)),
    server: {
      port: PORT,
    },
    configFile: false,
  });

  await server.listen();

  const urls = prepareUrls('http', '0.0.0.0', PORT);

  openBrowser(urls.localUrlForBrowser);

  return server;
}
