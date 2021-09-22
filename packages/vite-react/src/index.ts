import { ReactShowroomConfiguration } from '@showroomjs/core/react-vite';

export const defineConfig = (
  config:
    | ReactShowroomConfiguration
    | ((command: 'dev' | 'build') => ReactShowroomConfiguration)
) => config;
