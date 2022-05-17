import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  webServer: {
    command: 'pnpm run preview',
    port: 17969,
    reuseExistingServer: !process.env.CI,
  },
  testDir: './tests',
  retries: 1,
  use: {
    video: process.env.CI ? 'retain-on-failure' : 'off',
    trace: 'on-first-retry',
  },
};

export default config;
