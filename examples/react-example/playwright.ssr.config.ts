import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  webServer: {
    command: 'pnpm run serve:ssr',
    port: 16969,
    reuseExistingServer: !process.env.CI,
  },
  testDir: './tests',
};

export default config;
