export type {
  ItemConfiguration,
  ReactShowroomConfiguration,
} from '@showroomjs/core/react';
import { ReactShowroomConfiguration } from '@showroomjs/core/react';

export const defineConfig = (
  config: ReactShowroomConfiguration | (() => ReactShowroomConfiguration)
) => config;
