import { test, expect, Page } from '@playwright/test';

/**
 * 🔍 LOGIN DEBUG DIAGNOSTIC TESTS
 * 
 * ภารกิจ: ตรวจสอบสาเหตุที่ login ไม่ผ่าน
 * แต่ละ test จะมี screenshot ก่อนและหลัง action + console log รายละเอียด
 * ไม่มี assertions ที่ fail - แค่เก็บข้อมูลเพื่อวิเคราะห์
 */

test.describe('🔍 Login Debug Diagnostics', () => {
  const BASE_URL = 'https://bo-dev.askmebill.com';
  const USERNAME = process.env.USERNAME || 'admin_eiji';
  const PASSWORD = process.env.PASSWORD || '0897421942@Earth';
  
  // สร้าง directory สำหรับเก็บ screenshots
  const SCREENSHOT_DIR = 'test-results/debug';

  // ============================================
  // TEST 1: ตรวจสอบว่า page โหลดได้ + ถ่าย screenshot
  // ============================================
  test('TEST-01: Page Load Verification', async ({ page }) => {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🧪 TEST-01: Page Load Verification');
    console.log('═══════════════════════════════════════════════════════════');
    
    console.log(`\n📍 Target URL: ${BASE_URL}`);
    console.log('⏳ Navigating to login page...');
    
    // เริ่มจับเวลา
    const startTime = Date.now();
    
    try {
      const response = await page.goto(BASE_URL, { 
        timeout: 30000,
        waitUntil: 'domcontentloaded'
      });
      
      const loadTime = Date.now() - startTime;
      
      console.log(`\n✅ Page navigation completed in ${loadTime}ms`);
      console.log(`📊 Response status: ${response?.status() || 'N/A'}`);
      console.log(`📊 Response URL: ${response?.url() || 'N/A'}`);
      console.log(`📍 Current URL: ${page.url()}`);
      console.log(`📍 Page title: ${await page.title()}`);
      
    } catch (error) {
      console.log(`\n❌ Navigation failed: ${error}`);
    }
    
    // รอให้ page โหลดเสร็จ
    await page.waitForLoadState('networkidle').catch(() => {
      console.log('⚠️ Network idle timeout - page may still be loading');
    });
    
    // 📸 Screenshot หลัง page โหลด
    console.log('\n📸 Taking screenshot: test-results/debug/01-page-loaded.png');
    await page.screenshot({ 
      path: `${SCREENSHOT_DIR}/01-page-loaded.png`,
      fullPage: true 
    });
    
    // เก็บข้อมูล page state
    const pageInfo = {
      url: page.url(),
      title: await page.title(),
      viewport: page.viewportSize(),
      timestamp: new Date().toISOString()
    };
    
    console.log('\n📋 Page Info Summary:');
    console.log(JSON.stringify(pageInfo, null, 2));
    
    // ไม่มี assertion - แค่เก็บข้อมูล
    expect(true).toBe(true);
  });

  // ============================================
  // TEST 2: ตรวจสอบว่า selectors ถูกต้อง (หา input fields)
  // ============================================
  test('TEST-02: Selector Verification', async ({ page }) => {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🧪 TEST-02: Selector Verification');
    console.log('═══════════════════════════════════════════════════════════');
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    
    // 📸 Screenshot ก่อนเริ่ม
    await page.screenshot({ path: `${SCREENSHOT_DIR}/02-before-selector-check.png` });
    
    console.log('\n🔍 Checking selectors...\n');
    
    // รายการ selectors ที่ต้องตรวจสอบ
    const selectorsToCheck = [
      { name: 'Username Input (type=text)', selector: 'input[type="text"]' },
      { name: 'Password Input (type=password)', selector: 'input[type="password"]' },
      { name: 'Submit Button (type=submit)', selector: 'button[type="submit"]' },
      { name: 'Any Button', selector: 'button' },
      { name: 'Any Input', selector: 'input' },
      { name: 'Form Element', selector: 'form' },
      { name: 'Label Elements', selector: 'label' },
      { name: 'Error Alert', selector: '.error, .alert, [role="alert"]' },
    ];
    
    const results: Array<{name: string, selector: string, count: number, visible: boolean, attributes?: any}> = [];
    
    for (const item of selectorsToCheck) {
      try {
        const elements = page.locator(item.selector);
        const count = await elements.count();
        
        // เช็คว่า element แรก visible ไหม
        let isVisible = false;
        let attributes = null;
        
        if (count > 0) {
          const firstElement = elements.first();
          isVisible = await firstElement.isVisible().catch(() => false);
          
          // ดึง attributes ถ้าเป็น input
          if (item.selector.includes('input') && isVisible) {
            attributes = await firstElement.evaluate((el: Element) => {
              const input = el as HTMLInputElement;
              return {
                type: input.type,
                name: input.name,
                id: input.id,
                placeholder: input.placeholder,
                required: input.required,
                disabled: input.disabled
              };
            }).catch(() => null);
          }
        }
        
        results.push({
          name: item.name,
          selector: item.selector,
          count,
          visible: isVisible,
          attributes
        });
        
        console.log(`  ${count > 0 && isVisible ? '✅' : '❌'} ${item.name}`);
        console.log(`     Selector: ${item.selector}`);
        console.log(`     Count: ${count}, Visible: ${isVisible}`);
        if (attributes) {
          console.log(`     Attributes: ${JSON.stringify(attributes)}`);
        }
        console.log('');
        
      } catch (error) {
        console.log(`  ❌ ${item.name}: ERROR - ${error}`);
        results.push({
          name: item.name,
          selector: item.selector,
          count: 0,
          visible: false
        });
      }
    }
    
    // 📸 Screenshot หลังตรวจสอบ
    await page.screenshot({ path: `${SCREENSHOT_DIR}/02-after-selector-check.png` });
    
    console.log('\n📋 Selector Summary:');
    console.table(results.map(r => ({
      Name: r.name,
      Selector: r.selector,
      Found: r.count,
      Visible: r.visible ? 'Yes' : 'No'
    })));
    
    expect(true).toBe(true);
  });

  // ============================================
  // TEST 3: ลอง fill form แล้วดูว่าค่าติดหรือไม่
  // ============================================
  test('TEST-03: Form Fill Verification', async ({ page }) => {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🧪 TEST-03: Form Fill Verification');
    console.log('═══════════════════════════════════════════════════════════');
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    
    // 📸 Screenshot ก่อนกรอก
    await page.screenshot({ path: `${SCREENSHOT_DIR}/03-before-fill.png` });
    
    console.log('\n📝 Attempting to fill form...');
    console.log(`   Username: ${USERNAME}`);
    console.log(`   Password: ${'*'.repeat(PASSWORD.length)}`);
    
    // หา input fields
    const usernameInput = page.locator('input[type="text"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    // ตรวจสอบก่อนว่า input พร้อมใช้งานไหม
    const usernameReady = await usernameInput.isEnabled().catch(() => false);
    const passwordReady = await passwordInput.isEnabled().catch(() => false);
    
    console.log(`\n📊 Input States:`);
    console.log(`   Username input enabled: ${usernameReady}`);
    console.log(`   Password input enabled: ${passwordReady}`);
    
    // พยายามกรอกข้อมูล
    try {
      if (usernameReady) {
        console.log('\n⏳ Filling username...');
        await usernameInput.fill(USERNAME);
        
        // ตรวจสอบว่าค่าติดไหม
        const usernameValue = await usernameInput.inputValue();
        console.log(`   Value after fill: "${usernameValue}"`);
        console.log(`   Match: ${usernameValue === USERNAME ? '✅ YES' : '❌ NO'}`);
      }
      
      // 📸 Screenshot หลังกรอก username
      await page.screenshot({ path: `${SCREENSHOT_DIR}/03-after-username.png` });
      
      if (passwordReady) {
        console.log('\n⏳ Filling password...');
        await passwordInput.fill(PASSWORD);
        
        // ตรวจสอบว่าค่าติดไหม (อาจไม่ได้ค่าจริงเพราะ type=password)
        const passwordValue = await passwordInput.inputValue();
        console.log(`   Value after fill: "${'*'.repeat(passwordValue.length)}" (length: ${passwordValue.length})`);
        console.log(`   Match length: ${passwordValue.length === PASSWORD.length ? '✅ YES' : '❌ NO'}`);
      }
      
      // 📸 Screenshot หลังกรอกครบ
      await page.screenshot({ path: `${SCREENSHOT_DIR}/03-after-fill.png` });
      
      // ตรวจสอบ form state
      const formState = await page.evaluate(() => {
        const inputs = document.querySelectorAll('input');
        return Array.from(inputs).map(input => ({
          type: input.type,
          name: input.name,
          id: input.id,
          value: input.type === 'password' ? '*'.repeat(input.value.length) : input.value,
          hasValue: input.value.length > 0
        }));
      });
      
      console.log('\n📋 Form State (from DOM):');
      console.table(formState);
      
    } catch (error) {
      console.log(`\n❌ Error during fill: ${error}`);
    }
    
    console.log('\n✅ Fill test completed');
    expect(true).toBe(true);
  });

  // ============================================
  // TEST 4: ลอง click submit แล้วรอ 10 วิ ดูว่าเกิดอะไรขึ้น
  // ============================================
  test('TEST-04: Submit Click & Wait 10s', async ({ page }) => {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🧪 TEST-04: Submit Click & Wait 10s');
    console.log('═══════════════════════════════════════════════════════════');
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    
    // กรอกข้อมูลก่อน
    await page.locator('input[type="text"]').first().fill(USERNAME);
    await page.locator('input[type="password"]').first().fill(PASSWORD);
    
    // 📸 Screenshot ก่อน click submit
    await page.screenshot({ path: `${SCREENSHOT_DIR}/04-before-submit.png` });
    
    const urlBefore = page.url();
    console.log(`\n📍 URL before submit: ${urlBefore}`);
    
    // จับเวลาการ click
    console.log('\n🖱️  Clicking submit button...');
    const clickStart = Date.now();
    
    try {
      await page.locator('button[type="submit"]').first().click();
      console.log(`   Click executed in ${Date.now() - clickStart}ms`);
    } catch (error) {
      console.log(`   ❌ Click failed: ${error}`);
    }
    
    // รอ 10 วินาที
    console.log('\n⏳ Waiting 10 seconds...');
    for (let i = 0; i < 10; i++) {
      await page.waitForTimeout(1000);
      const currentUrl = page.url();
      console.log(`   [${i + 1}s] URL: ${currentUrl}`);
      
      // ถ้า URL เปลี่ยน ให้บันทึก
      if (currentUrl !== urlBefore) {
        console.log(`   🔄 URL changed at ${i + 1}s!`);
      }
    }
    
    // 📸 Screenshot หลังรอ 10 วิ
    await page.screenshot({ path: `${SCREENSHOT_DIR}/04-after-wait-10s.png`, fullPage: true });
    
    const urlAfter = page.url();
    console.log(`\n📊 Results:`);
    console.log(`   URL before: ${urlBefore}`);
    console.log(`   URL after:  ${urlAfter}`);
    console.log(`   Changed:    ${urlBefore !== urlAfter ? '✅ YES' : '❌ NO'}`);
    
    // ตรวจสอบ loading indicators
    const loadingElements = await page.locator('.loading, .spinner, [class*="loading"]').count();
    console.log(`   Loading indicators visible: ${loadingElements}`);
    
    expect(true).toBe(true);
  });

  // ============================================
  // TEST 5: ตรวจสอบ network requests
  // ============================================
  test('TEST-05: Network Request Monitoring', async ({ page }) => {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🧪 TEST-05: Network Request Monitoring');
    console.log('═══════════════════════════════════════════════════════════');
    
    // เก็บ log ของทุก request
    const networkLogs: Array<{
      method: string;
      url: string;
      status?: number;
      timestamp: string;
      type: string;
    }> = [];
    
    // Intercept ทุก request
    await page.route('**/*', (route, request) => {
      const logEntry = {
        method: request.method(),
        url: request.url(),
        timestamp: new Date().toISOString(),
        type: request.resourceType()
      };
      
      // แสดงเฉพาะ API calls ที่น่าสนใจ
      if (request.resourceType() === 'xhr' || request.resourceType() === 'fetch') {
        console.log(`\n📡 ${request.method()} ${request.url()}`);
      }
      
      networkLogs.push(logEntry);
      route.continue();
    });
    
    // เก็บ responses
    page.on('response', async (response) => {
      const request = response.request();
      if (request.resourceType() === 'xhr' || request.resourceType() === 'fetch') {
        const status = response.status();
        const url = response.url();
        
        // หา log entry ที่ตรงกันแล้วอัปเดต status
        const logEntry = networkLogs.find(log => log.url === url && !log.status);
        if (logEntry) {
          logEntry.status = status;
        }
        
        // แสดงสถานะ
        const statusEmoji = status >= 200 && status < 300 ? '✅' : 
                           status >= 400 ? '❌' : '⚠️';
        console.log(`   ${statusEmoji} Response: ${status} ${url.substring(0, 80)}...`);
      }
    });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    
    // 📸 Screenshot เริ่มต้น
    await page.screenshot({ path: `${SCREENSHOT_DIR}/05-network-start.png` });
    
    // กรอกข้อมูลและ submit
    console.log('\n📝 Filling form and submitting...');
    await page.locator('input[type="text"]').first().fill(USERNAME);
    await page.locator('input[type="password"]').first().fill(PASSWORD);
    
    // กด submit
    await page.locator('button[type="submit"]').first().click();
    
    // รอ response สำคัญ
    console.log('\n⏳ Waiting for login API response...');
    
    try {
      // รอ response ที่อาจเป็น login API
      const response = await page.waitForResponse(
        response => {
          const url = response.url();
          return url.includes('/api/') || url.includes('/auth/') || url.includes('/login');
        },
        { timeout: 10000 }
      );
      
      console.log('\n📡 Login API Response detected:');
      console.log(`   URL: ${response.url()}`);
      console.log(`   Status: ${response.status()}`);
      console.log(`   Headers: ${JSON.stringify(response.headers(), null, 2)}`);
      
      // พยายามอ่าน body
      try {
        const body = await response.json();
        console.log(`   Body: ${JSON.stringify(body, null, 2)}`);
      } catch {
        const text = await response.text();
        console.log(`   Body (text): ${text.substring(0, 500)}`);
      }
      
    } catch (error) {
      console.log('\n⚠️ No login API response detected within 10s');
      console.log(`   Error: ${error}`);
    }
    
    // รอเพิ่มอีก 5 วิ
    await page.waitForTimeout(5000);
    
    // 📸 Screenshot หลัง submit
    await page.screenshot({ path: `${SCREENSHOT_DIR}/05-network-end.png`, fullPage: true });
    
    // สรุป network logs
    console.log('\n📋 Network Summary:');
    const apiCalls = networkLogs.filter(log => 
      log.type === 'xhr' || log.type === 'fetch' || log.url.includes('/api/')
    );
    
    console.log(`   Total requests: ${networkLogs.length}`);
    console.log(`   API/XHR calls: ${apiCalls.length}`);
    
    if (apiCalls.length > 0) {
      console.log('\n   API Calls Detail:');
      apiCalls.forEach((call, i) => {
        const statusStr = call.status ? `[${call.status}]` : '[pending]';
        console.log(`   ${i + 1}. ${call.method} ${statusStr} ${call.url.substring(0, 60)}...`);
      });
    }
    
    expect(true).toBe(true);
  });

  // ============================================
  // TEST 6: ดูว่ามี error message อะไรบนหน้าจอ
  // ============================================
  test('TEST-06: Error Message Detection', async ({ page }) => {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🧪 TEST-06: Error Message Detection');
    console.log('═══════════════════════════════════════════════════════════');
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    
    // 📸 Screenshot เริ่มต้น
    await page.screenshot({ path: `${SCREENSHOT_DIR}/06-errors-start.png` });
    
    console.log('\n🔍 Scanning for error messages on initial load...');
    
    // ตรวจสอบ error ต่างๆ บนหน้า
    const errorSelectors = [
      { type: 'Alert', selector: '[role="alert"]' },
      { type: 'Error Message', selector: '.error, .error-message, .alert-error' },
      { type: 'Toast', selector: '.toast, .toast-error, .notification-error' },
      { type: 'Form Error', selector: '.form-error, .field-error, .invalid-feedback' },
      { type: 'Console Error', selector: '.console-error' }
    ];
    
    const initialErrors: Array<{type: string, text: string, visible: boolean}> = [];
    
    for (const item of errorSelectors) {
      const elements = page.locator(item.selector);
      const count = await elements.count();
      
      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const element = elements.nth(i);
          const isVisible = await element.isVisible().catch(() => false);
          const text = await element.textContent().catch(() => 'N/A');
          
          if (isVisible && text) {
            initialErrors.push({ type: item.type, text: text.trim(), visible: isVisible });
            console.log(`\n⚠️  Found ${item.type}: "${text.trim()}"`);
          }
        }
      }
    }
    
    if (initialErrors.length === 0) {
      console.log('   ✅ No visible errors on initial load');
    }
    
    // กรอกข้อมูลผิด (เพื่อ trigger error)
    console.log('\n📝 Testing with INVALID credentials to trigger error...');
    await page.locator('input[type="text"]').first().fill('wrong_user_12345');
    await page.locator('input[type="password"]').first().fill('wrong_pass_67890');
    
    // 📸 Screenshot ก่อน submit
    await page.screenshot({ path: `${SCREENSHOT_DIR}/06-before-submit-error.png` });
    
    // Click submit
    await page.locator('button[type="submit"]').first().click();
    
    // รอ 5 วิ
    await page.waitForTimeout(5000);
    
    // 📸 Screenshot หลัง submit
    await page.screenshot({ path: `${SCREENSHOT_DIR}/06-after-submit-error.png`, fullPage: true });
    
    // ตรวจสอบ error อีกครั้ง
    console.log('\n🔍 Scanning for error messages after invalid login...');
    
    const afterErrors: Array<{type: string, text: string, visible: boolean}> = [];
    
    for (const item of errorSelectors) {
      const elements = page.locator(item.selector);
      const count = await elements.count();
      
      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const element = elements.nth(i);
          const isVisible = await element.isVisible().catch(() => false);
          const text = await element.textContent().catch(() => 'N/A');
          
          if (isVisible && text) {
            afterErrors.push({ type: item.type, text: text.trim(), visible: isVisible });
            console.log(`\n🚨 Found ${item.type}: "${text.trim()}"`);
          }
        }
      }
    }
    
    // ตรวจสอบ console errors
    console.log('\n📋 Checking browser console for errors...');
    
    // ดึง console messages ถ้ามี
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.log(`   Console Error: ${msg.text()}`);
      }
    });
    
    page.on('pageerror', error => {
      console.log(`   Page Error: ${error.message}`);
    });
    
    // รอเพิ่มอีกนิดให้ console events ทำงาน
    await page.waitForTimeout(2000);
    
    // ตรวจสอบ valid credentials ด้วย
    console.log('\n📝 Testing with VALID credentials...');
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    
    await page.locator('input[type="text"]').first().fill(USERNAME);
    await page.locator('input[type="password"]').first().fill(PASSWORD);
    await page.locator('button[type="submit"]').first().click();
    
    await page.waitForTimeout(5000);
    
    // 📸 Screenshot หลัง valid login
    await page.screenshot({ path: `${SCREENSHOT_DIR}/06-after-valid-login.png`, fullPage: true });
    
    console.log(`\n📍 URL after valid login: ${page.url()}`);
    
    // สรุป errors
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📋 ERROR DETECTION SUMMARY');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`\nInitial load errors: ${initialErrors.length}`);
    initialErrors.forEach((err, i) => console.log(`  ${i + 1}. [${err.type}] ${err.text}`));
    
    console.log(`\nAfter invalid login errors: ${afterErrors.length}`);
    afterErrors.forEach((err, i) => console.log(`  ${i + 1}. [${err.type}] ${err.text}`));
    
    console.log(`\nConsole errors captured: ${consoleErrors.length}`);
    
    expect(true).toBe(true);
  });

  // ============================================
  // BONUS TEST: Full Debug Report
  // ============================================
  test('TEST-BONUS: Generate Complete Debug Report', async ({ page }) => {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🧪 TEST-BONUS: Complete Debug Report');
    console.log('═══════════════════════════════════════════════════════════');
    
    const report: any = {
      timestamp: new Date().toISOString(),
      url: BASE_URL,
      tests: []
    };
    
    // 1. Page Load
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    report.pageLoad = {
      url: page.url(),
      title: await page.title(),
      success: true
    };
    
    // 2. DOM Structure
    const domInfo = await page.evaluate(() => {
      return {
        inputs: document.querySelectorAll('input').length,
        buttons: document.querySelectorAll('button').length,
        forms: document.querySelectorAll('form').length,
        scripts: document.querySelectorAll('script').length,
        hasLoginForm: !!document.querySelector('input[type="password"]')
      };
    });
    report.domStructure = domInfo;
    
    // 3. Fill and Submit
    await page.locator('input[type="text"]').first().fill(USERNAME);
    await page.locator('input[type="password"]').first().fill(PASSWORD);
    
    const urlBeforeSubmit = page.url();
    await page.locator('button[type="submit"]').first().click();
    
    await page.waitForTimeout(5000);
    
    const urlAfterSubmit = page.url();
    
    // 4. Final State
    report.finalState = {
      urlBefore: urlBeforeSubmit,
      urlAfter: urlAfterSubmit,
      urlChanged: urlBeforeSubmit !== urlAfterSubmit,
      onCustomerPage: urlAfterSubmit.includes('/customer'),
      onLoginPage: urlAfterSubmit.includes('/login')
    };
    
    // 📸 Final screenshot
    await page.screenshot({ path: `${SCREENSHOT_DIR}/bonus-final-state.png`, fullPage: true });
    
    console.log('\n📋 COMPLETE DEBUG REPORT:');
    console.log(JSON.stringify(report, null, 2));
    
    expect(true).toBe(true);
  });
});
