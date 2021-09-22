// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

import { ReactShowroomConfiguration } from '@showroomjs/core/react';
import { createServer } from 'vite';
import { argv } from 'yargs';
import { createViteConfig } from '../config/create-vite-config';
import { getConfig } from '../lib/get-config';

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

  // console.log(server.config);

  return server;
}
