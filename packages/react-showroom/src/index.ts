import { ReactShowroomConfiguration } from '@showroomjs/core/react';

export const defineConfig = (
  config:
    | ReactShowroomConfiguration
    | ((command: 'dev' | 'build') => ReactShowroomConfiguration)
) => config;
