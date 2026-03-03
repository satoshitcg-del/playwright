import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto(this.baseUrl);
    await this.page.waitForLoadState('networkidle');
  }

  async loginWith2FA(
    username: string = process.env.USERNAME || 'admin_eiji',
    password: string = process.env.PASSWORD || '0897421942@Earth',
    twoFactorCode: string = '999999'
  ): Promise<void> {
    // Step 1: Go to login page
    await this.goto();
    
    // Step 2: Fill username/password
    await this.page.locator('input[type="text"]').first().fill(username);
    await this.page.locator('input[type="password"]').first().fill(password);
    await this.page.locator('button[type="submit"]').first().click();
    
    // Step 3: Wait for page to load (could be 2FA or dashboard)
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(3000);
    
    // Step 4: Try to fill 2FA (if on 2FA page)
    try {
      // Look for any input that's not username/password
      const codeInput = this.page.locator('input:not([type="text"]):not([type="password"])').first();
      await codeInput.waitFor({ state: 'visible', timeout: 5000 });
      await codeInput.fill(twoFactorCode);
      
      // Click the submit/confirm button
      await this.page.locator('button').first().click();
      
      // Wait for navigation
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(3000);
    } catch (e) {
      // 2FA not needed or already on dashboard
      console.log('2FA step skipped or not needed');
    }
    
    // Step 5: Verify we're on customer page
    const url = this.page.url();
    if (!url.includes('/customer')) {
      await this.page.screenshot({ path: 'test-results/login-failed.png' });
      throw new Error(`Login failed. Current URL: ${url}`);
    }
    
    console.log('Login successful! URL:', url);
  }

  async saveAuthState(path: string = 'playwright/.auth/user.json'): Promise<void> {
    await this.page.context().storageState({ path });
  }
}
