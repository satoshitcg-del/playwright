import { Page, Locator, expect } from '@playwright/test';

/**
 * Base Page class with common utilities
 * All page objects should extend this class
 */
export class BasePage {
  readonly page: Page;
  readonly baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = process.env.BASE_URL || 'https://bo-dev.askmebill.com';
  }

  /**
   * Navigate to a specific path
   */
  async goto(path: string): Promise<void> {
    await this.page.goto(`${this.baseUrl}${path}`);
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for element to be visible and click
   */
  async clickWhenVisible(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  /**
   * Fill input with retry logic
   */
  async fillWithRetry(locator: Locator, value: string, retries = 3): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        await locator.clear();
        await locator.fill(value);
        const actualValue = await locator.inputValue();
        if (actualValue === value) return;
      } catch (e) {
        if (i === retries - 1) throw e;
        await this.page.waitForTimeout(500);
      }
    }
  }

  /**
   * Handle modal dialog
   */
  async handleModal(action: 'confirm' | 'cancel' | 'ok'): Promise<void> {
    const modal = this.page.locator('.modal, [role="dialog"]').first();
    await modal.waitFor({ state: 'visible' });
    
    const buttonText = action === 'confirm' ? /yes|confirm|save/i : 
                       action === 'cancel' ? /cancel|no/i : /ok/i;
    
    await modal.locator('button', { hasText: buttonText }).click();
    await modal.waitFor({ state: 'hidden' });
  }

  /**
   * Wait for success toast/message
   */
  async waitForSuccess(message?: string): Promise<void> {
    const toast = this.page.locator('.toast-success, .ant-message-success, [class*="success"]').first();
    await toast.waitFor({ state: 'visible', timeout: 10000 });
    if (message) {
      await expect(toast).toContainText(message);
    }
  }

  /**
   * Wait for error message
   */
  async waitForError(message?: string): Promise<void> {
    const error = this.page.locator('.toast-error, .ant-message-error, [class*="error"]').first();
    await error.waitFor({ state: 'visible', timeout: 10000 });
    if (message) {
      await expect(error).toContainText(message);
    }
  }

  /**
   * Take screenshot with timestamp
   */
  async takeScreenshot(name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${timestamp}.png`,
      fullPage: true 
    });
  }

  /**
   * Check if element exists
   */
  async elementExists(locator: Locator): Promise<boolean> {
    return await locator.count() > 0;
  }

  /**
   * Wait for table to load
   */
  async waitForTableLoad(tableLocator: Locator): Promise<void> {
    await tableLocator.waitFor({ state: 'visible' });
    // Wait for loading spinner to disappear
    const spinner = this.page.locator('.loading, .spinner, [class*="loading"]').first();
    if (await this.elementExists(spinner)) {
      await spinner.waitFor({ state: 'hidden' });
    }
  }

  /**
   * Get table row count
   */
  async getTableRowCount(tableLocator: Locator): Promise<number> {
    return await tableLocator.locator('tbody tr').count();
  }

  /**
   * Find row in table by text
   */
  async findTableRow(tableLocator: Locator, searchText: string): Promise<Locator | null> {
    const rows = tableLocator.locator('tbody tr');
    const count = await rows.count();
    
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const text = await row.textContent();
      if (text?.includes(searchText)) {
        return row;
      }
    }
    return null;
  }
}
