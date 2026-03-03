import { test, expect } from '@playwright/test';

/**
 * Diagnostic Test - ตรวจสอบว่า Login ได้จริงหรือไม่
 * ใช้สำหรับ debug ปัญหา authentication
 */
test.describe('🔍 Login Diagnostic', () => {
  
  test('check login page loads', async ({ page }) => {
    console.log('⏳ Loading login page...');
    
    // ไปที่หน้า login
    await page.goto('https://bo-dev.askmebill.com');
    
    // รอให้ page โหลด
    await page.waitForLoadState('domcontentloaded');
    
    // ถ่าย screenshot ดูว่าหน้าเป็นอย่างไร
    await page.screenshot({ path: 'test-results/diagnostic-01-login-page.png' });
    
    console.log('✅ Page loaded');
    console.log('📍 Current URL:', page.url());
    
    // ตรวจสอบว่ามี input fields หรือไม่
    const usernameInput = page.locator('input[type="text"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    const hasUsername = await usernameInput.isVisible().catch(() => false);
    const hasPassword = await passwordInput.isVisible().catch(() => false);
    const hasSubmit = await submitButton.isVisible().catch(() => false);
    
    console.log('👁️  Username field visible:', hasUsername);
    console.log('👁️  Password field visible:', hasPassword);
    console.log('👁️  Submit button visible:', hasSubmit);
    
    expect(hasUsername).toBe(true);
    expect(hasPassword).toBe(true);
    expect(hasSubmit).toBe(true);
  });

  test('try simple login flow', async ({ page }) => {
    console.log('⏳ Trying simple login...');
    
    await page.goto('https://bo-dev.askmebill.com');
    await page.waitForLoadState('domcontentloaded');
    
    // กรอกข้อมูลแบบง่าย
    const username = process.env.USERNAME || 'admin_eiji';
    const password = process.env.PASSWORD || '0897421942@Earth';
    
    console.log('📝 Filling username:', username);
    await page.locator('input[type="text"]').first().fill(username);
    
    console.log('📝 Filling password...');
    await page.locator('input[type="password"]').first().fill(password);
    
    // ถ่าย screenshot ก่อนกด submit
    await page.screenshot({ path: 'test-results/diagnostic-02-filled-form.png' });
    
    console.log('🖱️  Clicking submit...');
    await page.locator('button[type="submit"]').first().click();
    
    // รอแบบไม่ใช้ waitForNavigation (อาจมีปัญหา)
    console.log('⏳ Waiting for response...');
    await page.waitForTimeout(5000); // รอ 5 วิให้เว็บตอบสนอง
    
    // ถ่าย screenshot ดูผลลัพธ์
    await page.screenshot({ path: 'test-results/diagnostic-03-after-submit.png', fullPage: true });
    
    console.log('📍 Current URL after submit:', page.url());
    
    // ตรวจสอบว่าเป็นหน้าไหน
    const url = page.url();
    if (url.includes('/customer')) {
      console.log('✅ Login successful - on customer page');
    } else if (url.includes('/login')) {
      console.log('❌ Still on login page - check credentials');
      
      // ดูว่ามี error message ไหม
      const errorText = await page.locator('.error, .alert, [role="alert"]').first().textContent().catch(() => 'No error found');
      console.log('🚨 Error message:', errorText);
    } else {
      console.log('⚠️  Unknown page state');
    }
    
    // ไม่ assert ผลลัพธ์ - แค่เก็บข้อมูล
    expect(true).toBe(true);
  });

  test('check if already logged in', async ({ page }) => {
    console.log('⏳ Checking if already logged in...');
    
    // ลองไปที่หน้า customer โดยตรง
    await page.goto('https://bo-dev.askmebill.com/customer');
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: 'test-results/diagnostic-04-direct-customer.png', fullPage: true });
    
    console.log('📍 URL after direct navigation:', page.url());
    
    if (page.url().includes('/customer')) {
      console.log('✅ Already logged in or no auth required');
    } else if (page.url().includes('/login')) {
      console.log('❌ Redirected to login - need authentication');
    }
    
    expect(true).toBe(true);
  });
});
