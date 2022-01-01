export type {
  ItemConfiguration,
  ReactShowroomConfiguration,
} from '@showroomjs/core/react';
export type { PlayScenario } from '@showroomjs/interaction';
import { ReactShowroomConfiguration } from '@showroomjs/core/react';
import type { buildShowroom as BuildShowRoomDef } from './node-api/build-showroom';
import type { startDevServer as StartDevServerDef } from './node-api/start-dev-server';

export const defineConfig = (
  config:
    | ReactShowroomConfiguration
    | ((command: 'dev' | 'build') => ReactShowroomConfiguration)
) => config;

export const buildShowroom: typeof BuildShowRoomDef = (userConfig) =>
  require('./node-api/build-showroom').buildShowroom(userConfig);

export const startDevServer: typeof StartDevServerDef = (userConfig) =>
  require('./node-api/start-dev-server').startDevServer(userConfig);
