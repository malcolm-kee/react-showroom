import { PlaywrightTestConfig } from '@playwright/test';
import ssrConfig from './playwright.ssr.config';

const config: PlaywrightTestConfig = {
  ...ssrConfig,
  webServer: {
    command: 'pnpm run serve:spa',
    port: 16968,
    reuseExistingServer: !process.env.CI,
  },
};

export default config;
