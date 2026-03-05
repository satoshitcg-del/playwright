import { defineConfig, devices } from '@playwright/test';

/**
 * 🔥 FINAL CONFIG - Optimized for Success
 */

export default defineConfig({
  testDir: './tests',
  
  // รันทีละ test
  fullyParallel: false,
  workers: 1,
  
  // Retry ถ้า fail
  retries: 2,
  
  // Timeout ยาวพอสมควร
  timeout: 90000,
  
  expect: {
    timeout: 30000,
  },
  
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  
  use: {
    baseURL: 'https://bo-dev.askmebill.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 30000,
    navigationTimeout: 45000,
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
