import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Login Page Object
 * Handles authentication flow including 2FA
 */
export class LoginPage extends BasePage {
  // Selectors
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly twoFactorInput: Locator;
  readonly verifyButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    
    // Login form selectors
    this.usernameInput = page.locator('input[name="username"], input[placeholder*="Username" i], #username').first();
    this.passwordInput = page.locator('input[name="password"], input[type="password"], #password').first();
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign in")').first();
    
    // 2FA selectors
    this.twoFactorInput = page.locator('input[name="otp"], input[name="code"], input[placeholder*="code" i], input[placeholder*="OTP" i]').first();
    this.verifyButton = page.locator('button:has-text("Verify"), button:has-text("Confirm"), button[type="submit"]').nth(1);
    
    // Error message
    this.errorMessage = page.locator('.error-message, .ant-form-item-explain-error, [role="alert"]').first();
  }

  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    await this.page.goto(this.baseUrl);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Perform login
   */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    
    // Wait for either 2FA page or dashboard
    await this.page.waitForURL(/.*(verify|otp|dashboard|customer).*/, { timeout: 10000 });
  }

  /**
   * Enter 2FA code
   */
  async enterTwoFactorCode(code: string = '999999'): Promise<void> {
    // Wait for 2FA input to appear
    await this.twoFactorInput.waitFor({ state: 'visible', timeout: 10000 });
    
    await this.twoFactorInput.fill(code);
    await this.verifyButton.click();
    
    // Wait for navigation to complete
    await this.page.waitForURL(/.*(customer|dashboard).*/, { timeout: 10000 });
    await this.waitForPageLoad();
  }

  /**
   * Complete full login flow with 2FA
   */
  async loginWith2FA(
    username: string = process.env.USERNAME || 'admin_eiji',
    password: string = process.env.PASSWORD || '0897421942@Earth',
    twoFactorCode: string = '999999'
  ): Promise<void> {
    await this.goto();
    await this.login(username, password);
    
    // Check if we're on 2FA page
    if (await this.twoFactorInput.isVisible().catch(() => false)) {
      await this.enterTwoFactorCode(twoFactorCode);
    }
    
    // Verify we're logged in
    await expect(this.page).toHaveURL(/.*customer.*/);
  }

  /**
   * Check if user is already logged in
   */
  async isLoggedIn(): Promise<boolean> {
    const currentUrl = this.page.url();
    return currentUrl.includes('/customer') || currentUrl.includes('/dashboard');
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string | null> {
    if (await this.errorMessage.isVisible().catch(() => false)) {
      return await this.errorMessage.textContent();
    }
    return null;
  }

  /**
   * Save authentication state to file
   */
  async saveAuthState(path: string = 'playwright/.auth/user.json'): Promise<void> {
    await this.page.context().storageState({ path });
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    // Look for logout button/link
    const logoutButton = this.page.locator('button:has-text("Logout"), a:has-text("Logout"), [data-testid="logout"]').first();
    
    if (await logoutButton.isVisible().catch(() => false)) {
      await logoutButton.click();
      await this.page.waitForURL(this.baseUrl);
    }
  }
}
