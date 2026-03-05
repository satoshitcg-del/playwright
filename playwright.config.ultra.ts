import { defineConfig, devices } from '@playwright/test';

/**
 * 🔥 ULTRA ROBUST CONFIG - ทำซ้ำๆ จนกว่าจะผ่าน
 */

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  
  // 🔥 สำคัญ: Retry 3 ครั้งถ้า fail
  retries: 3,
  
  // 🔥 สำคัญ: Timeout นานขึ้น
  timeout: 120000,
  
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
    video: 'on-first-retry',
    headless: false,
    viewport: { width: 1280, height: 720 },
    
    // 🔥 สำคัญ: Action timeout นานขึ้น
    actionTimeout: 45000,
    navigationTimeout: 60000,
    
    // 🔥 สำคัญ: Launch options
    launchOptions: {
      slowMo: 100, // ชะลอการกระทำเล็กน้อย
    },
  },
  
  projects: [
    {
      name: 'setup',
      testMatch: '**/*.setup.ts',
    },
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // 🔥 สำคัญ: ใช้ storage state จาก setup
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
