export type {
  ReactCompdocConfiguration,
  ItemConfiguration,
} from '@compdoc/core';
import { ReactCompdocConfiguration } from '@compdoc/core';

export const defineConfig = (
  config: ReactCompdocConfiguration | (() => ReactCompdocConfiguration)
) => config;
