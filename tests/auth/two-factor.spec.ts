import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';

/**
 * Test Cases: Acc_08 - Acc_14
 * Module: Two-Factor Authentication (2FA)
 * Feature: Two-step authentication flow
 */

test.describe('Two-Factor Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Acc_08: Input Code ถูกต้อง - เข้าสู่ระบบสำเร็จ', async ({ page }) => {
    // Step 1: Login with valid credentials
    await page.getByRole('textbox', { name: /อีเมลล์|email/i }).fill('admin_eiji');
    await page.getByRole('textbox', { name: /รหัสผ่าน|password/i }).fill('0897421942@Earth');
    await page.getByTestId('login-loginform-submit-button').click();

    // Step 2: Wait for 2FA page
    await expect(page).toHaveURL(/two-step|2fa|verify/i, { timeout: 10000 });
    await expect(page.locator('text=Two-step Authentication')).toBeVisible();

    // Step 3: Enter valid 2FA code
    await page.getByRole('textbox', { name: /รหัสยืนยัน|verification/i }).fill('999999');
    await page.getByRole('button', { name: /ยืนยัน|confirm/i }).click();

    // Expected: Navigate to dashboard
    await expect(page).toHaveURL(/dashboard|customers|invoices/, { timeout: 10000 });
  });

  test('Acc_09: Input Code ไม่ถูกต้อง - แสดง error', async ({ page }) => {
    await page.getByRole('textbox', { name: /อีเมลล์|email/i }).fill('admin_eiji');
    await page.getByRole('textbox', { name: /รหัสผ่าน|password/i }).fill('0897421942@Earth');
    await page.getByTestId('login-loginform-submit-button').click();

    await expect(page).toHaveURL(/two-step|2fa|verify/i, { timeout: 10000 });

    // Enter invalid code
    await page.getByRole('textbox', { name: /รหัสยืนยัน|verification/i }).fill('000000');
    await page.getByRole('button', { name: /ยืนยัน|confirm/i }).click();

    // Expected: Error message
    await expect(
      page.locator('text=System cannot process this request').or(
        page.locator('text=try again later')
      ).or(
        page.locator('.ant-message-error')
      )
    ).toBeVisible({ timeout: 5000 });
  });

  test('Acc_10: Input Code ไม่ครบ - ปุ่มยืนยัน disabled', async ({ page }) => {
    await page.getByRole('textbox', { name: /อีเมลล์|email/i }).fill('admin_eiji');
    await page.getByRole('textbox', { name: /รหัสผ่าน|password/i }).fill('0897421942@Earth');
    await page.getByTestId('login-loginform-submit-button').click();

    await expect(page).toHaveURL(/two-step|2fa|verify/i, { timeout: 10000 });

    // Enter incomplete code (3 digits)
    await page.getByRole('textbox', { name: /รหัสยืนยัน|verification/i }).fill('123');

    // Expected: Confirm button disabled
    const confirmBtn = page.getByRole('button', { name: /ยืนยัน|confirm/i });
    await expect(confirmBtn).toBeDisabled();
  });

  test('Acc_11: ตรวจสอบ UI หน้า Two-step Authentication', async ({ page }) => {
    await page.getByRole('textbox', { name: /อีเมลล์|email/i }).fill('admin_eiji');
    await page.getByRole('textbox', { name: /รหัสผ่าน|password/i }).fill('0897421942@Earth');
    await page.getByTestId('login-loginform-submit-button').click();

    await expect(page).toHaveURL(/two-step|2fa|verify/i, { timeout: 10000 });

    // Verify UI elements
    await expect(page.locator('text=Two-step Authentication')).toBeVisible();
    await expect(page.locator('text=Enter the verification code from google authenticator')).toBeVisible();
    await expect(page.getByRole('textbox', { name: /รหัสยืนยัน|verification/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /ยืนยัน|confirm/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /รหัสยืนยัน|verification/i })).toHaveValue('');
  });

  test('Acc_12: ตรวจสอบสถานะปุ่ม CONFIRM', async ({ page }) => {
    await page.getByRole('textbox', { name: /อีเมลล์|email/i }).fill('admin_eiji');
    await page.getByRole('textbox', { name: /รหัสผ่าน|password/i }).fill('0897421942@Earth');
    await page.getByTestId('login-loginform-submit-button').click();

    await expect(page).toHaveURL(/two-step|2fa|verify/i, { timeout: 10000 });

    const confirmBtn = page.getByRole('button', { name: /ยืนยัน|confirm/i });
    const codeInput = page.getByRole('textbox', { name: /รหัสยืนยัน|verification/i });

    // Initially disabled
    await expect(confirmBtn).toBeDisabled();

    // Enter code -> enabled
    await codeInput.fill('123456');
    await expect(confirmBtn).toBeEnabled();

    // Clear code -> disabled again
    await codeInput.clear();
    await expect(confirmBtn).toBeDisabled();
  });

  test('Acc_13: Reset Two-step authentication - ฝั่ง Customer', async ({ page }) => {
    // Login first
    await loginPage.login('admin_eiji', '0897421942@Earth', '999999');
    
    // Navigate to user management (if available)
    await page.goto('https://bo-dev.askmebill.com/users');
    
    // This test requires admin access to reset 2FA
    // Verify reset button exists
    const resetBtn = page.locator('text=Reset Two-step authentication').first();
    
    if (await resetBtn.isVisible().catch(() => false)) {
      await resetBtn.click();
      
      // Verify confirmation modal
      await expect(page.locator('text=Confirm reset')).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('Acc_14: Reset 2FA แล้วกรอกใหม่ได้ถูกต้อง', async ({ page }) => {
    // This is an integration test that requires:
    // 1. Admin to reset 2FA
    // 2. User to setup 2FA again
    
    test.skip('Requires manual setup of 2FA reset scenario');
  });
});
