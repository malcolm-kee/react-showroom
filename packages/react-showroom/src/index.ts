export type {
  ReactShowroomConfiguration,
  ItemConfiguration,
} from '@showroomjs/core';
import { ReactShowroomConfiguration } from '@showroomjs/core';

export const defineConfig = (
  config: ReactShowroomConfiguration | (() => ReactShowroomConfiguration)
) => config;
