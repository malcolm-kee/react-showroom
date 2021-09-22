// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

import { ReactShowroomConfiguration } from '@showroomjs/core/react';
import { build } from 'vite';
import { argv } from 'yargs';
import { createViteConfig } from '../config/create-vite-config';
import { getConfig } from '../lib/get-config';

export interface StartServerOptions extends ReactShowroomConfiguration {
  configFile?: string;
}

export async function buildShowroom(
  userConfig?: ReactShowroomConfiguration,
  configFile?: string
) {
  const config = getConfig('production', configFile, userConfig);

  const { devServerPort } = config;

  const PORT = Number((argv as any).port ?? process.env.PORT ?? devServerPort);

  await build({
    ...(await createViteConfig('production', config)),
    server: {
      port: PORT,
    },
    configFile: false,
  });
}
