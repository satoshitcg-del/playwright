import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Login Page Object
 * 
 * Handles authentication flows including:
 * - Standard username/password login
 * - Two-factor authentication (2FA)
 * - Session state persistence
 * 
 * @example
 * ```typescript
 * const loginPage = new LoginPage(page);
 * await loginPage.loginWith2FA('username', 'password', '123456');
 * await loginPage.saveAuthState(); // Save for reuse
 * ```
 */
export class LoginPage extends BasePage {
  /** Locator for username input field */
  readonly usernameInput: Locator;
  
  /** Locator for password input field */
  readonly passwordInput: Locator;
  
  /** Locator for submit/login button */
  readonly submitButton: Locator;
  
  /** Locator for 2FA code input */
  readonly twoFactorInput: Locator;

  /**
   * Creates an instance of LoginPage
   * @param page - Playwright Page instance
   */
  constructor(page: Page) {
    super(page);
    
    // Define locators for better maintainability
    this.usernameInput = page.locator('input[type="text"]').first();
    this.passwordInput = page.locator('input[type="password"]').first();
    this.submitButton = page.locator('button[type="submit"]').first();
    this.twoFactorInput = page.locator('input:not([type="text"]):not([type="password"])').first();
  }

  /**
   * Navigate to login page and wait for it to load
   * 
   * @returns Promise that resolves when page is loaded
   * @throws Error if navigation fails
   * 
   * @example
   * await loginPage.goto();
   */
  async goto(): Promise<void> {
    await this.page.goto(this.baseUrl);
    // Wait for login form to be ready instead of arbitrary delay
    await Promise.all([
      this.usernameInput.waitFor({ state: 'visible' }),
      this.passwordInput.waitFor({ state: 'visible' }),
      this.submitButton.waitFor({ state: 'visible' })
    ]);
  }

  /**
   * Perform login with 2FA support
   * 
   * Handles both flows:
   * 1. Direct login (no 2FA required) → redirects to dashboard
   * 2. Login with 2FA → shows 2FA page after credentials
   * 
   * Uses auto-waiting strategies instead of hard delays:
   * - waitForNavigation: Waits for actual page transition
   * - waitForSelector: Waits for specific elements
   * - expect assertions: Verifies final state
   * 
   * @param username - Username for login (defaults to env.USERNAME)
   * @param password - Password for login (defaults to env.PASSWORD)
   * @param twoFactorCode - 2FA code (defaults to '999999' for test environment)
   * @returns Promise that resolves when login is complete
   * @throws Error if login fails or unexpected redirect occurs
   * 
   * @example
   * // Login with defaults from environment
   * await loginPage.loginWith2FA();
   * 
   * // Login with specific credentials
   * await loginPage.loginWith2FA('admin', 'password123', '123456');
   */
  async loginWith2FA(
    username: string = process.env.USERNAME || 'admin_eiji',
    password: string = process.env.PASSWORD || '0897421942@Earth',
    twoFactorCode: string = '999999'
  ): Promise<void> {
    // Step 1: Navigate to login page
    await this.goto();
    
    // Step 2: Fill credentials using retry for reliability
    await this.fillWithRetry(this.usernameInput, username);
    await this.fillWithRetry(this.passwordInput, password);
    
    // Step 3: Click submit and wait for navigation
    // waitForNavigation waits for the actual page transition
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'networkidle' }),
      this.submitButton.click()
    ]);
    
    // Step 4: Check if we're on 2FA page or already logged in
    // Uses auto-waiting: element will be waited for up to timeout
    const currentUrl = this.page.url();
    const is2FAPage = await this.twoFactorInput.isVisible().catch(() => false);
    
    if (is2FAPage) {
      // Handle 2FA flow
      try {
        // Wait for 2FA input to be visible and ready
        await this.twoFactorInput.waitFor({ state: 'visible', timeout: 5000 });
        
        // Fill 2FA code
        await this.twoFactorInput.fill(twoFactorCode);
        
        // Submit 2FA and wait for navigation to dashboard
        const confirmButton = this.page.locator('button').first();
        await Promise.all([
          this.page.waitForNavigation({ waitUntil: 'networkidle' }),
          confirmButton.click()
        ]);
        
      } catch (error) {
        // 2FA step failed - provide detailed error message
        const screenshotPath = 'test-results/2fa-error.png';
        await this.page.screenshot({ path: screenshotPath });
        throw new Error(
          `2FA step failed. Current URL: ${this.page.url()}. ` +
          `Screenshot saved to: ${screenshotPath}. ` +
          `Error: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
    
    // Step 5: Verify successful login by checking URL
    // Use expect with retry instead of hard delay
    await expect.poll(
      () => this.page.url(),
      {
        message: 'Expected to be redirected to /customer page after login',
        timeout: 10000,
        intervals: [500, 1000, 2000]  // Retry intervals in ms
      }
    ).toContain('/customer');
    
    console.log('Login successful! URL:', this.page.url());
  }

  /**
   * Save current authentication state to file
   * Allows tests to reuse the same session without re-logging in
   * 
   * @param path - File path to save auth state (default: 'playwright/.auth/user.json')
   * @returns Promise that resolves when state is saved
   * @throws Error if save operation fails
   * 
   * @example
   * // Save with default path
   * await loginPage.saveAuthState();
   * 
   * // Save with custom path
   * await loginPage.saveAuthState('playwright/.auth/admin.json');
   */
  async saveAuthState(path: string = 'playwright/.auth/user.json'): Promise<void> {
    try {
      await this.page.context().storageState({ path });
      console.log(`Auth state saved to: ${path}`);
    } catch (error) {
      throw new Error(
        `Failed to save auth state to ${path}. ` +
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Check if user is currently logged in
   * Verifies by checking for login form elements
   * 
   * @returns Promise resolving to true if logged in, false if on login page
   * 
   * @example
   * if (!await loginPage.isLoggedIn()) {
   *   await loginPage.loginWith2FA();
   * }
   */
  async isLoggedIn(): Promise<boolean> {
    const url = this.page.url();
    return !url.includes('/login') && url.includes('/customer');
  }

  /**
   * Logout current user
   * Clears session and navigates to login page
   * 
   * @returns Promise that resolves when logout is complete
   * 
   * @example
   * await loginPage.logout();
   */
  async logout(): Promise<void> {
    await this.clearState();
    await this.goto();
  }

  /**
   * Get current login error message if present
   * 
   * @returns Promise resolving to error message string, or null if no error
   * 
   * @example
   * const error = await loginPage.getErrorMessage();
   * if (error) console.log('Login failed:', error);
   */
  async getErrorMessage(): Promise<string | null> {
    const errorLocator = this.page.locator('.error-message, .alert-error, [role="alert"]').first();
    const hasError = await errorLocator.isVisible().catch(() => false);
    
    if (hasError) {
      return await errorLocator.textContent();
    }
    return null;
  }
}
