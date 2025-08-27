import { defineConfig, devices } from '@playwright/test';

const BASE_URL =
  process.env.PLAYWRITE_BASE_URL
  || 'http://localhost:5173';

export default defineConfig({
  testDir: './tests',
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  timeout: 30_000,
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 800 },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ]
});
