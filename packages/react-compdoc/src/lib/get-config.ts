import * as fs from 'fs';
import {
  NormalizedReactCompdocConfiguration,
  ReactCompdocConfiguration,
} from '../types';
import { paths } from './paths';

const defaultConfig = {
  components: 'src/components/**/*.{js,jsx,ts,tsx}',
  outDir: 'compdoc',
  prerender: false,
};

export const getConfig = (): NormalizedReactCompdocConfiguration => {
  const providedConfig: ReactCompdocConfiguration = fs.existsSync(
    paths.appCompdocConfig
  )
    ? require(paths.appCompdocConfig)
    : {};

  return {
    ...defaultConfig,
    ...providedConfig,
  };
};
