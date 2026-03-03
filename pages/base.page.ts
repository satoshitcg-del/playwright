import { Page, Locator, expect, Response } from '@playwright/test';

/**
 * Base Page Object Model Class
 * 
 * Provides common utilities and wrappers for Playwright interactions.
 * All page objects should extend this class to inherit base functionality.
 * 
 * @example
 * ```typescript
 * class CustomerPage extends BasePage {
 *   async navigateToCustomer(id: string) {
 *     await this.goto(`/customer/${id}`);
 *     await this.waitForPageLoad();
 *   }
 * }
 * ```
 */
export class BasePage {
  /** Playwright Page instance for browser interactions */
  readonly page: Page;
  
  /** Base URL for the application under test */
  readonly baseUrl: string;

  /**
   * Creates an instance of BasePage
   * @param page - Playwright Page instance
   */
  constructor(page: Page) {
    this.page = page;
    this.baseUrl = process.env.BASE_URL || 'https://bo-dev.askmebill.com';
  }

  /**
   * Navigate to a specific path relative to baseUrl
   * 
   * @param path - URL path (e.g., '/customer/123')
   * @returns Promise that resolves when navigation completes
   * 
   * @example
   * await page.goto('/customer/list');
   * await page.goto('/settings/profile');
   */
  async goto(path: string): Promise<void> {
    await this.page.goto(`${this.baseUrl}${path}`);
  }

  /**
   * Wait for page to be fully loaded
   * Waits for network to be idle (no network connections for 500ms)
   * 
   * @returns Promise that resolves when page is loaded
   * 
   * @example
   * await page.goto('/dashboard');
   * await page.waitForPageLoad();
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for element to be visible, then click it
   * Combines visibility check with click action for reliability
   * 
   * @param locator - Playwright Locator for the element to click
   * @returns Promise that resolves after click
   * 
   * @example
   * await page.clickWhenVisible(page.locator('button.submit'));
   */
  async clickWhenVisible(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  /**
   * Fill input field with automatic retry and verification
   * 
   * Retries up to specified times if the value doesn't stick
   * (useful for flaky inputs or race conditions with React/Vue state)
   * 
   * @param locator - Playwright Locator for the input field
   * @param value - Value to fill into the input
   * @param retries - Number of retry attempts (default: 3)
   * @returns Promise that resolves when value is confirmed
   * @throws Error if value cannot be set after all retries
   * 
   * @example
   * await page.fillWithRetry(nameInput, 'John Doe');
   * await page.fillWithRetry(emailInput, 'john@example.com', 5);
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
        // Wait for UI to stabilize before retry
        // Uses Playwright's built-in waiting instead of hard delays
        await locator.waitFor({ state: 'visible' });
      }
    }
  }

  /**
   * Handle modal dialog by clicking specified action button
   * 
   * @param action - Action to perform on the modal
   *   - 'confirm': Click Yes/Confirm/Save button
   *   - 'cancel': Click Cancel/No button
   *   - 'ok': Click OK button
   * @returns Promise that resolves after modal is closed
   * 
   * @example
   * await page.handleModal('confirm'); // Click Confirm
   * await page.handleModal('cancel');  // Click Cancel
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
   * Wait for success toast/notification to appear
   * 
   * @param message - Optional text to verify in the success message
   * @returns Promise that resolves when success message appears
   * @throws Error if success message doesn't appear within timeout
   * 
   * @example
   * await page.waitForSuccess();
   * await page.waitForSuccess('Customer created successfully');
   */
  async waitForSuccess(message?: string): Promise<void> {
    const toast = this.page.locator('.toast-success, .ant-message-success, [class*="success"]').first();
    await toast.waitFor({ state: 'visible', timeout: 10000 });
    if (message) {
      await expect(toast).toContainText(message);
    }
  }

  /**
   * Wait for error toast/notification to appear
   * 
   * @param message - Optional text to verify in the error message
   * @returns Promise that resolves when error message appears
   * @throws Error if error message doesn't appear within timeout
   * 
   * @example
   * await page.waitForError();
   * await page.waitForError('Invalid credentials');
   */
  async waitForError(message?: string): Promise<void> {
    const error = this.page.locator('.toast-error, .ant-message-error, [class*="error"]').first();
    await error.waitFor({ state: 'visible', timeout: 10000 });
    if (message) {
      await expect(error).toContainText(message);
    }
  }

  /**
   * Take screenshot with automatic timestamp
   * Useful for debugging and test evidence
   * 
   * @param name - Base name for the screenshot file
   * @returns Promise that resolves when screenshot is saved
   * 
   * @example
   * await page.takeScreenshot('customer-list');
   * // Creates: test-results/screenshots/customer-list-2024-03-04T10-30-00-000Z.png
   */
  async takeScreenshot(name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${timestamp}.png`,
      fullPage: true 
    });
  }

  /**
   * Check if an element exists in the DOM
   * Non-throwing check - returns boolean instead of throwing
   * 
   * @param locator - Playwright Locator to check
   * @returns Promise resolving to true if element exists, false otherwise
   * 
   * @example
   * if (await page.elementExists(page.locator('.notification'))) {
   *   await page.locator('.notification').click();
   * }
   */
  async elementExists(locator: Locator): Promise<boolean> {
    return await locator.count() > 0;
  }

  /**
   * Wait for table to fully load
   * Waits for table visibility and loading spinner to disappear
   * 
   * @param tableLocator - Playwright Locator for the table element
   * @returns Promise that resolves when table is loaded
   * 
   * @example
   * const table = page.locator('table.customers');
   * await page.waitForTableLoad(table);
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
   * Get the number of data rows in a table
   * 
   * @param tableLocator - Playwright Locator for the table element
   * @returns Promise resolving to the number of tbody rows
   * 
   * @example
   * const count = await page.getTableRowCount(customerTable);
   * expect(count).toBeGreaterThan(0);
   */
  async getTableRowCount(tableLocator: Locator): Promise<number> {
    return await tableLocator.locator('tbody tr').count();
  }

  /**
   * Find a table row containing specific text
   * Iterates through table rows to find matching text
   * 
   * @param tableLocator - Playwright Locator for the table element
   * @param searchText - Text to search for in table rows
   * @returns Promise resolving to the matching row Locator, or null if not found
   * 
   * @example
   * const row = await page.findTableRow(table, 'John Doe');
   * if (row) await row.locator('.edit-btn').click();
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

  /**
   * Clear browser state between tests
   * Removes cookies, localStorage, and sessionStorage
   * Use in beforeEach or afterEach for test isolation
   * 
   * @returns Promise that resolves when state is cleared
   * 
   * @example
   * test.afterEach(async ({ page }) => {
   *   const basePage = new BasePage(page);
   *   await basePage.clearState();
   * });
   */
  async clearState(): Promise<void> {
    // Clear all cookies
    await this.page.context().clearCookies();
    
    // Clear localStorage and sessionStorage
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  /**
   * Clear all browser storage including IndexedDB
   * More thorough than clearState() - use when complete cleanup is needed
   * 
   * @returns Promise that resolves when all storage is cleared
   * 
   * @example
   * test.beforeEach(async ({ page }) => {
   *   const basePage = new BasePage(page);
   *   await basePage.clearAllStorage();
   * });
   */
  async clearAllStorage(): Promise<void> {
    // Clear cookies
    await this.page.context().clearCookies();
    
    // Clear all storage types
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear all IndexedDB databases
      const databases = indexedDB.databases?.() || Promise.resolve([]);
      return databases.then((dbs) => {
        dbs.forEach((db) => {
          if (db.name) {
            indexedDB.deleteDatabase(db.name);
          }
        });
      });
    });
  }

  /**
   * Wait for API response matching URL pattern
   * Useful for waiting after actions that trigger API calls
   * 
   * @param urlPattern - URL pattern to match (string or RegExp)
   * @param options - Optional configuration
   * @param options.method - HTTP method to match (GET, POST, etc.)
   * @param options.timeout - Maximum wait time in milliseconds
   * @returns Promise resolving to the Response object
   * 
   * @example
   * // Wait for customer list API
   * await page.waitForResponse('/api/customers');
   * 
   * // Wait for POST request with timeout
   * await page.waitForResponse('/api/customers', { method: 'POST', timeout: 10000 });
   */
  async waitForApiResponse(
    urlPattern: string | RegExp, 
    options?: { method?: string; timeout?: number }
  ): Promise<Response> {
    const timeout = options?.timeout || 10000;
    
    return await this.page.waitForResponse(
      (response) => {
        const urlMatch = typeof urlPattern === 'string' 
          ? response.url().includes(urlPattern)
          : urlPattern.test(response.url());
        
        const methodMatch = options?.method 
          ? response.request().method() === options.method
          : true;
        
        return urlMatch && methodMatch;
      },
      { timeout }
    );
  }

  /**
   * Wait for network to be idle after an action
   * Waits until there are no network connections for 500ms
   * 
   * @param timeout - Maximum wait time in milliseconds (default: 30000)
   * @returns Promise that resolves when network is idle
   * 
   * @example
   * await page.clickSubmitButton();
   * await page.waitForNetworkIdle();
   */
  async waitForNetworkIdle(timeout = 30000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }
}
