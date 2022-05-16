import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  webServer: {
    command: 'pnpm run preview',
    port: 17969,
    reuseExistingServer: !process.env.CI,
  },
  testDir: './tests',
  use: {
    video: process.env.CI ? 'retain-on-failure' : 'off',
  },
};

export default config;
