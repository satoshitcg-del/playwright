import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';

/**
 * Authentication Tests
 * 
 * Tests for login flow including:
 * - Valid credentials login
 * - 2FA flow completion
 * - Invalid credentials handling
 * - Session persistence
 */
test.describe('Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  /**
   * Test: Complete login flow with 2FA
   * 
   * Verifies that user can:
   * 1. Enter valid credentials
   * 2. Complete 2FA step if required
   * 3. Successfully reach customer dashboard
   */
  test('should login with valid credentials and 2FA', async () => {
    // Perform complete login flow
    await loginPage.loginWith2FA(
      process.env.USERNAME || 'admin_eiji',
      process.env.PASSWORD || '0897421942@Earth',
      '999999'
    );
    
    // Verify successful login - should be on customer page
    await expect(loginPage.page).toHaveURL(/.*customer.*/);
    
    // Verify logged in state
    const isLoggedIn = await loginPage.isLoggedIn();
    expect(isLoggedIn).toBe(true);
  });

  /**
   * Test: Show error for invalid credentials
   * 
   * Verifies that system shows appropriate error
   * when incorrect username/password is provided
   */
  test('should show error for invalid credentials', async () => {
    await loginPage.goto();
    
    // Fill invalid credentials using the locators
    await loginPage.usernameInput.fill('invalid_user');
    await loginPage.passwordInput.fill('wrong_password');
    await loginPage.submitButton.click();
    
    // Wait for error to appear
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  /**
   * Test: Maintain session after login
   * 
   * Verifies that authenticated session persists
   * across page navigations using saved auth state
   */
  test('should maintain session after login', async ({ page }) => {
    // This test uses the saved auth state from setup
    await page.goto('/customer');
    
    // Should not redirect to login
    await expect(page).not.toHaveURL(/.*login.*/);
    await expect(page).toHaveURL(/.*customer.*/);
  });

  /**
   * Test: Logout functionality
   * 
   * Verifies that logout clears session and
   * redirects to login page
   */
  test('should logout successfully', async () => {
    // First login
    await loginPage.loginWith2FA();
    
    // Then logout
    await loginPage.logout();
    
    // Verify redirected to login page
    await expect(loginPage.page).toHaveURL(/.*login.*/);
  });
});
