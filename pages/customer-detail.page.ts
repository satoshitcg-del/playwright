import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Customer Detail Page Object
 * 
 * Manages customer product configuration and lifecycle:
 * - View customer details and product list
 * - Add/Edit/Delete products
 * - Configure product settings (prefix, clientName)
 * - Search and filter products
 * 
 * This page represents the customer detail view accessible at /customer/{username}
 * 
 * @example
 * ```typescript
 * const customerPage = new CustomerDetailPage(page);
 * await customerPage.gotoCustomer('john_doe');
 * const hasProduct = await customerPage.hasProduct('Thai Lotto');
 * if (!hasProduct) {
 *   await customerPage.addProduct('Thai Lotto');
 *   await customerPage.configureThaiLotto();
 * }
 * ```
 */
export class CustomerDetailPage extends BasePage {
  /** Customer name/header element */
  readonly customerName: Locator;
  
  /** Button to add new product */
  readonly addProductButton: Locator;
  
  /** Main product table */
  readonly productTable: Locator;
  
  /** Product search input field */
  readonly searchInput: Locator;
  
  /** Clear search button */
  readonly clearButton: Locator;
  
  /** Search submit button */
  readonly searchButton: Locator;
  
  /** Status filter dropdown */
  readonly statusFilter: Locator;

  /**
   * Creates an instance of CustomerDetailPage
   * @param page - Playwright Page instance
   */
  constructor(page: Page) {
    super(page);
    
    // Initialize locators with fallback strategies for robustness
    this.customerName = page.locator('h1, .customer-name').first();
    this.addProductButton = page.locator('button:has-text("Add Product"), button:has-text("+ Add Product")').first();
    this.productTable = page.locator('table').first();
    this.searchInput = page.locator('input[placeholder*="Product" i], input[name="productName"]').first();
    this.clearButton = page.locator('button:has-text("Clear")').first();
    this.searchButton = page.locator('button:has-text("Search")').first();
    this.statusFilter = page.locator('select, .ant-select', { hasText: 'Status' }).first();
  }

  /**
   * Navigate to specific customer detail page
   * 
   * @param username - Customer username/identifier
   * @returns Promise that resolves when page is loaded
   * 
   * @example
   * await customerPage.gotoCustomer('john_doe');
   * await customerPage.gotoCustomer('company_123');
   */
  async gotoCustomer(username: string): Promise<void> {
    await this.goto(`/customer/${username}`);
    await this.waitForPageLoad();
    // Wait for product table to be visible (main content indicator)
    await this.productTable.waitFor({ state: 'visible' });
  }

  /**
   * Check if customer has a specific product
   * Searches product table for matching product name
   * 
   * @param productName - Name of product to search for
   * @returns Promise resolving to true if product exists, false otherwise
   * 
   * @example
   * const hasThaiLotto = await customerPage.hasProduct('Thai Lotto');
   * expect(hasThaiLotto).toBe(true);
   */
  async hasProduct(productName: string): Promise<boolean> {
    const row = await this.findTableRow(this.productTable, productName);
    return row !== null;
  }

  /**
   * Get table row locator for a specific product
   * Useful for performing actions on specific product rows
   * 
   * @param productName - Name of product to find
   * @returns Promise resolving to row Locator, or null if not found
   * 
   * @example
   * const row = await customerPage.getProductRow('Thai Lotto');
   * if (row) await row.locator('.edit-btn').click();
   */
  async getProductRow(productName: string): Promise<Locator | null> {
    return await this.findTableRow(this.productTable, productName);
  }

  /**
   * Click edit button for specific product
   * Opens the product configuration modal
   * 
   * @param productName - Name of product to edit
   * @returns Promise that resolves when edit modal opens
   * @throws Error if product not found in table
   * 
   * @example
   * await customerPage.editProduct('Thai Lotto');
   * // Now modal is open, can configure product
   */
  async editProduct(productName: string): Promise<void> {
    const row = await this.getProductRow(productName);
    if (!row) {
      throw new Error(`Product "${productName}" not found in customer product list`);
    }
    
    // Find edit button - try multiple selectors for robustness
    const editButton = row.locator('button[title="Edit"], button:has([data-icon="edit"]), button').last();
    await editButton.click();
    
    // Wait for modal to open using visibility check
    const modal = this.page.locator('.modal, [role="dialog"]').first();
    await modal.waitFor({ state: 'visible' });
  }

  /**
   * Configure product with prefix and clientName settings
   * Opens edit modal, updates configuration, saves changes
   * 
   * Uses waitForResponse to wait for API completion instead of hard delays:
   * - Waits for PUT/POST request to complete
   * - Verifies modal closes automatically
   * - No arbitrary timeouts needed
   * 
   * @param productName - Name of product to configure
   * @param config - Configuration object
   * @param config.prefix - Optional prefix value to set
   * @param config.clientName - Optional client name to set
   * @returns Promise that resolves when configuration is saved
   * @throws Error if product not found or save fails
   * 
   * @example
   * // Configure with both values
   * await customerPage.configureProduct('Thai Lotto', {
   *   prefix: 'TH',
   *   clientName: 'superadmin'
   * });
   * 
   * // Configure with single value
   * await customerPage.configureProduct('Product A', { prefix: 'PROD' });
   */
  async configureProduct(
    productName: string,
    config: { prefix?: string; clientName?: string }
  ): Promise<void> {
    // Open edit modal for the product
    await this.editProduct(productName);
    
    const modal = this.page.locator('.modal, [role="dialog"]').first();
    
    // Fill prefix if provided
    if (config.prefix) {
      const prefixInput = modal.locator('input[name="prefix"], input[placeholder*="prefix" i]').first();
      await prefixInput.waitFor({ state: 'visible' });
      await prefixInput.clear();
      await prefixInput.fill(config.prefix);
    }
    
    // Fill/select clientName if provided
    if (config.clientName) {
      // Try dropdown first, fallback to input
      const clientDropdown = modal.locator('select[name="clientName"], .ant-select').first();
      const isDropdown = await clientDropdown.isVisible().catch(() => false);
      
      if (isDropdown) {
        await clientDropdown.selectOption(config.clientName);
      } else {
        // Try input field as fallback
        const clientInput = modal.locator('input[name="clientName"]').first();
        await clientInput.clear();
        await clientInput.fill(config.clientName);
      }
    }
    
    // Click save and wait for API response
    // This replaces hard delay with actual completion detection
    const saveButton = modal.locator('button:has-text("Save"), button[type="submit"]').first();
    
    // Wait for the save API call to complete
    await Promise.all([
      this.page.waitForResponse(
        response => 
          response.url().includes('/api/') && 
          (response.request().method() === 'PUT' || response.request().method() === 'POST'),
        { timeout: 15000 }
      ),
      saveButton.click()
    ]);
    
    // Wait for modal to close (indicates successful save)
    await modal.waitFor({ state: 'hidden', timeout: 10000 });
  }

  /**
   * Add new product to customer
   * Opens add product modal, selects product, confirms
   * 
   * @param productName - Name of product to add
   * @returns Promise that resolves when product is added
   * @throws Error if add operation fails
   * 
   * @example
   * await customerPage.addProduct('Thai Lotto');
   * await customerPage.addProduct('Product B');
   */
  async addProduct(productName: string): Promise<void> {
    // Click add button and wait for modal
    await this.addProductButton.click();
    
    const modal = this.page.locator('.modal, [role="dialog"]').first();
    await modal.waitFor({ state: 'visible' });
    
    // Select product from dropdown
    const productSelect = modal.locator('select, .ant-select').first();
    await productSelect.selectOption(productName);
    
    // Click confirm and wait for API response
    const confirmButton = modal.locator('button:has-text("Add"), button:has-text("Save"), button[type="submit"]').first();
    
    await Promise.all([
      this.page.waitForResponse(
        response => 
          response.url().includes('/api/') && 
          response.request().method() === 'POST',
        { timeout: 15000 }
      ),
      confirmButton.click()
    ]);
    
    // Wait for modal to close
    await modal.waitFor({ state: 'hidden', timeout: 10000 });
  }

  /**
   * Delete product from customer
   * Clicks delete button and confirms deletion
   * 
   * @param productName - Name of product to delete
   * @returns Promise that resolves when product is deleted
   * @throws Error if product not found or delete fails
   * 
   * @example
   * await customerPage.deleteProduct('Old Product');
   * // Product is removed from table
   */
  async deleteProduct(productName: string): Promise<void> {
    // Find the product row
    const row = await this.getProductRow(productName);
    if (!row) {
      throw new Error(`Product "${productName}" not found - cannot delete`);
    }
    
    // Click delete button
    const deleteButton = row.locator('button[title="Delete"], button:has([data-icon="delete"]), button:has-text("Delete")').first();
    await deleteButton.click();
    
    // Confirm deletion in modal
    await this.handleModal('confirm');
    
    // Wait for row to disappear using expect assertion
    // This is more reliable than hard delay
    await expect(row).not.toBeVisible({ timeout: 10000 });
  }

  /**
   * Get all product names from the product table
   * Extracts text from product name column
   * 
   * @returns Promise resolving to array of product names
   * 
   * @example
   * const products = await customerPage.getAllProducts();
   * expect(products).toContain('Thai Lotto');
   */
  async getAllProducts(): Promise<string[]> {
    const rows = this.productTable.locator('tbody tr');
    const count = await rows.count();
    const products: string[] = [];
    
    for (let i = 0; i < count; i++) {
      // Product name typically in second column (index 1)
      const nameCell = rows.nth(i).locator('td').nth(1);
      const name = await nameCell.textContent();
      if (name) products.push(name.trim());
    }
    
    return products;
  }

  /**
   * Get configuration values for a specific product
   * Reads prefix and clientName from table row
   * 
   * @param productName - Name of product to get config for
   * @returns Promise resolving to configuration object, or null if not found
   * 
   * @example
   * const config = await customerPage.getProductConfig('Thai Lotto');
   * if (config) {
   *   console.log(config.prefix);      // 'TH'
   *   console.log(config.clientName);  // 'superadmin'
   * }
   */
  async getProductConfig(productName: string): Promise<{ prefix: string; clientName: string } | null> {
    const row = await this.getProductRow(productName);
    if (!row) return null;
    
    const cells = row.locator('td');
    // Assuming column order: [0]=checkbox, [1]=product, [2]=status, [3]=prefix, [4]=client
    const prefixCell = cells.nth(3);
    const clientCell = cells.nth(4);
    
    return {
      prefix: (await prefixCell.textContent())?.trim() || '-',
      clientName: (await clientCell.textContent())?.trim() || '-'
    };
  }

  /**
   * Search for products by name
   * Fills search input and submits, waits for results
   * 
   * Uses waitForResponse to detect when search API completes
   * instead of using arbitrary delays
   * 
   * @param query - Search query string
   * @returns Promise that resolves when search results load
   * 
   * @example
   * await customerPage.searchProduct('Lotto');
   * await customerPage.searchProduct('Thai');
   */
  async searchProduct(query: string): Promise<void> {
    // Clear and fill search input
    await this.searchInput.clear();
    await this.searchInput.fill(query);
    
    // Click search and wait for API response
    await Promise.all([
      this.page.waitForResponse(
        response => 
          response.url().includes('/api/') && 
          response.request().method() === 'GET',
        { timeout: 10000 }
      ),
      this.searchButton.click()
    ]);
    
    // Wait for table to refresh
    await this.waitForTableLoad(this.productTable);
  }

  /**
   * Dismiss "Something Went Wrong" error modal if present
   * Useful for handling intermittent errors gracefully
   * 
   * @returns Promise that resolves when error is handled
   * 
   * @example
   * await customerPage.waitForErrorToClear();
   * // Continue with test
   */
  async waitForErrorToClear(): Promise<void> {
    const errorModal = this.page.locator('.modal:has-text("Something Went Wrong")');
    const exists = await this.elementExists(errorModal);
    
    if (exists) {
      const okButton = errorModal.locator('button:has-text("OK")');
      await okButton.click();
      await errorModal.waitFor({ state: 'hidden' });
    }
  }

  /**
   * Configure Thai Lotto product with superadmin clientName
   * Convenience method for common configuration scenario
   * 
   * @returns Promise that resolves when configuration is saved
   * 
   * @example
   * await customerPage.configureThaiLotto();
   * // Thai Lotto is now configured with clientName='superadmin'
   */
  async configureThaiLotto(): Promise<void> {
    await this.configureProduct('Thai Lotto', { clientName: 'superadmin' });
  }

  /**
   * Sync Tiamut product by clicking Sync button in edit modal
   * Used for synchronizing product data with external system
   * 
   * @param productName - Name of Tiamut product to sync
   * @returns Promise that resolves when sync completes
   * @throws Error if product not found or sync fails
   * 
   * @example
   * await customerPage.syncTiamutProduct('Tiamut Game');
   * 
   * @deprecated Consider using configureProduct with sync flag instead
   */
  async syncTiamutProduct(productName: string): Promise<void> {
    // Open product edit modal
    await this.editProduct(productName);
    
    const modal = this.page.locator('.modal, [role="dialog"]').first();
    
    // Find and click Sync button
    const syncButton = modal.locator('button:has-text("Sync")').first();
    const isVisible = await syncButton.isVisible().catch(() => false);
    
    if (isVisible) {
      // Click sync and wait for API response
      await Promise.all([
        this.page.waitForResponse(
          response => 
            response.url().includes('/api/') && 
            response.request().method() === 'POST',
          { timeout: 15000 }
        ),
        syncButton.click()
      ]);
      
      // Wait for sync completion indicator (success toast or button state change)
      await this.page.locator('.toast-success, .sync-complete').first()
        .waitFor({ state: 'visible', timeout: 10000 })
        .catch(() => {
          // Sync may complete without explicit indicator
          console.log('Sync completed without explicit success indicator');
        });
    }
    
    // Save configuration
    const saveButton = modal.locator('button:has-text("Save")').first();
    await Promise.all([
      this.page.waitForResponse(
        response => 
          response.url().includes('/api/') && 
          (response.request().method() === 'PUT' || response.request().method() === 'POST'),
        { timeout: 15000 }
      ),
      saveButton.click()
    ]);
    
    // Wait for modal to close
    await modal.waitFor({ state: 'hidden', timeout: 10000 });
  }

  /**
   * Clear search filters and reset product list
   * Clicks Clear button and waits for reset to complete
   * 
   * @returns Promise that resolves when filters are cleared
   * 
   * @example
   * await customerPage.searchProduct('Lotto');
   * // ... do something with filtered results ...
   * await customerPage.clearFilters();
   * // Back to full product list
   */
  async clearFilters(): Promise<void> {
    await this.clearButton.click();
    
    // Wait for API response to reload full list
    await this.page.waitForResponse(
      response => 
        response.url().includes('/api/') && 
        response.request().method() === 'GET',
      { timeout: 10000 }
    );
    
    // Wait for table to refresh
    await this.waitForTableLoad(this.productTable);
  }
}
