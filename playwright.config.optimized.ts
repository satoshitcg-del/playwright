import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * 🔥 OPTIMIZED CONFIG - ใช้ได้จริง 100%
 * 
 * Features:
 * - Auth Setup: Login ครั้งเดียว ใช้ทุก test
 * - Correct Selectors: จาก Codegen
 * - Project Dependencies: รอ setup เสร็จก่อนรัน tests
 */
export default defineConfig({
  testDir: './tests',
  
  // รัน parallel ได้เพราะใช้ storageState
  fullyParallel: true,
  
  // Retry ถ้า fail
  retries: process.env.CI ? 2 : 1,
  
  // Workers
  workers: process.env.CI ? 1 : undefined,
  
  // Timeout
  timeout: 60000,
  
  expect: {
    timeout: 10000,
  },
  
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/test-results.json' }]
  ],
  
  use: {
    baseURL: 'https://bo-dev.askmebill.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    headless: true,
    viewport: { width: 1920, height: 1080 },
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  
  projects: [
    // 🔥 Setup project - รันครั้งแรกเพื่อ login และ save state
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    
    // 🔥 Chromium - ใช้ auth state จาก setup
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',  // ⬅️ ใช้ auth ที่บันทึกไว้
      },
      dependencies: ['setup'],  // ⬅️ รอ setup เสร็จก่อน
    },
    
    // Firefox
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
  
  outputDir: 'test-results/',
});
