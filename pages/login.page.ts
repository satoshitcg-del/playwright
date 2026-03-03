import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Login Page Object - แก้ไขตาม Codegen ที่ record จากจริง
 * 
 * Selectors มาจากการใช้ `npx playwright codegen`
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
  
  /** Locator for 2FA submit button */
  readonly twoFactorSubmitButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Selectors จาก Codegen (ถูกต้องตามจริง)
    this.usernameInput = page.getByRole('textbox', { name: 'อีเมลล์หรือชื่อผู้ใช้งาน' });
    this.passwordInput = page.getByRole('textbox', { name: 'รหัสผ่าน' });
    this.submitButton = page.getByTestId('login-loginform-submit-button');
    this.twoFactorInput = page.getByRole('textbox', { name: 'รหัสยืนยัน' });
    this.twoFactorSubmitButton = page.getByRole('button', { name: 'ยืนยัน' });
  }

  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    await this.page.goto(`${this.baseUrl}/login`);
    // รอให้ form โหลด
    await this.usernameInput.waitFor({ state: 'visible' });
  }

  /**
   * Perform login with 2FA - ใช้ selectors จาก Codegen
   */
  async loginWith2FA(
    username: string = process.env.USERNAME || 'admin_eiji',
    password: string = process.env.PASSWORD || '0897421942@Earth',
    twoFactorCode: string = process.env.TWO_FA_CODE || '9999999'
  ): Promise<void> {
    // Step 1: ไปหน้า login
    await this.goto();
    
    // Step 2: กรอก username (click ก่อนแล้วค่อย fill ตาม Codegen)
    await this.usernameInput.click();
    await this.usernameInput.fill(username);
    
    // Step 3: กรอก password
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
    
    // Step 4: กด submit
    await this.submitButton.click();
    
    // Step 5: รอ 2FA modal (รอสักครู่ให้แสดง)
    await this.page.waitForTimeout(2000);
    
    // Step 6: กรอก 2FA code
    await this.twoFactorInput.click();
    await this.twoFactorInput.fill(twoFactorCode);
    
    // Step 7: กดยืนยัน 2FA
    await this.twoFactorSubmitButton.click();
    
    // Step 8: รอ redirect ไปหน้า customer
    await this.page.waitForTimeout(3000);
    
    // Step 9: Verify ว่าอยู่หน้า customer
    const currentUrl = this.page.url();
    if (!currentUrl.includes('/customer')) {
      await this.page.screenshot({ path: 'test-results/login-failed.png', fullPage: true });
      throw new Error(`Login failed. Current URL: ${currentUrl}`);
    }
    
    console.log('✅ Login successful! URL:', currentUrl);
  }

  /**
   * Save authentication state
   */
  async saveAuthState(path: string = 'playwright/.auth/user.json'): Promise<void> {
    await this.page.context().storageState({ path });
    console.log(`Auth state saved to: ${path}`);
  }

  /**
   * Check if logged in
   */
  async isLoggedIn(): Promise<boolean> {
    const url = this.page.url();
    return !url.includes('/login') && url.includes('/customer');
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    await this.clearState();
    await this.goto();
  }

  /**
   * Get error message if any
   */
  async getErrorMessage(): Promise<string | null> {
    const errorLocator = this.page.locator('.error-message, .ant-message-error, [role="alert"]').first();
    const hasError = await errorLocator.isVisible().catch(() => false);
    if (hasError) {
      return await errorLocator.textContent();
    }
    return null;
  }
}
