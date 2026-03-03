import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';

/**
 * Authentication Tests
 */
test.describe('Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  test('should login with valid credentials', async () => {
    await loginPage.goto();
    await loginPage.login(
      process.env.USERNAME || 'admin_eiji',
      process.env.PASSWORD || '0897421942@Earth'
    );
    
    // Should redirect to 2FA or dashboard
    await expect(loginPage.page).toHaveURL(/.*(verify|otp|customer|dashboard).*/);
  });

  test('should complete 2FA flow', async () => {
    await loginPage.goto();
    await loginPage.login(
      process.env.USERNAME || 'admin_eiji',
      process.env.PASSWORD || '0897421942@Earth'
    );
    
    // Check if 2FA is required
    const needs2FA = await loginPage.twoFactorInput.isVisible().catch(() => false);
    
    if (needs2FA) {
      await loginPage.enterTwoFactorCode('999999');
      await expect(loginPage.page).toHaveURL(/.*customer.*/);
    }
  });

  test('should show error for invalid credentials', async () => {
    await loginPage.goto();
    await loginPage.login('invalid_user', 'wrong_password');
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('should maintain session after login', async ({ page }) => {
    // This test uses the saved auth state from setup
    await page.goto('/customer');
    
    // Should not redirect to login
    await expect(page).not.toHaveURL(/.*login.*/);
    await expect(page).toHaveURL(/.*customer.*/);
  });
});
