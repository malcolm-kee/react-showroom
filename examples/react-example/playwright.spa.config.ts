import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  webServer: {
    command: 'pnpm run serve:spa',
    port: 16968,
    reuseExistingServer: !process.env.CI,
  },
};

export default config;
