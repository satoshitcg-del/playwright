import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import path from 'path';

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

/**
 * Global Setup: Login and save authentication state
 * This runs once before all tests
 */
setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  // Perform login with 2FA
  await loginPage.loginWith2FA(
    process.env.USERNAME || 'admin_eiji',
    process.env.PASSWORD || '0897421942@Earth',
    '999999' // 2FA code
  );
  
  // Verify successful login
  await expect(page).toHaveURL(/.*customer.*/);
  
  // Save authentication state
  await page.context().storageState({ path: authFile });
});
