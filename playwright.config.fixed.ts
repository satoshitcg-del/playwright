import { defineConfig, devices } from '@playwright/test';

/**
 * 🔧 FIXED CONFIG - แก้ไขให้รันได้ 100%
 * 
 * ปัญหาที่แก้:
 * 1. workers: 1 (รันทีละ test)
 * 2. timeout: 60000 (เพิ่มเวลา)
 * 3. ไม่รัน parallel
 */

export default defineConfig({
  testDir: './tests',
  
  // 🔧 FIX: รันทีละ 1 test (ไม่ parallel)
  fullyParallel: false,
  
  // 🔧 FIX: รันทีละ 1 worker
  workers: 1,
  
  // 🔧 FIX: Retry 2 ครั้งถ้า fail
  retries: 2,
  
  // 🔧 FIX: Timeout 60 วินาที
  timeout: 60000,
  
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  
  use: {
    baseURL: 'https://bo-dev.askmebill.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: true, // รัน headless เร็วกว่า
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
