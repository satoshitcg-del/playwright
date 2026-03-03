import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Customer Detail Page Object
 * Handles customer product management and configuration
 */
export class CustomerDetailPage extends BasePage {
  readonly customerName: Locator;
  readonly addProductButton: Locator;
  readonly productTable: Locator;
  readonly searchInput: Locator;
  readonly clearButton: Locator;
  readonly searchButton: Locator;
  readonly statusFilter: Locator;

  constructor(page: Page) {
    super(page);
    
    this.customerName = page.locator('h1, .customer-name').first();
    this.addProductButton = page.locator('button:has-text("Add Product"), button:has-text("+ Add Product")').first();
    this.productTable = page.locator('table').first();
    this.searchInput = page.locator('input[placeholder*="Product" i], input[name="productName"]').first();
    this.clearButton = page.locator('button:has-text("Clear")').first();
    this.searchButton = page.locator('button:has-text("Search")').first();
    this.statusFilter = page.locator('select, .ant-select', { hasText: 'Status' }).first();
  }

  /**
   * Navigate to specific customer
   */
  async gotoCustomer(username: string): Promise<void> {
    await this.goto(`/customer/${username}`);
    await this.waitForPageLoad();
  }

  /**
   * Check if specific product exists in customer's product list
   */
  async hasProduct(productName: string): Promise<boolean> {
    const row = await this.findTableRow(this.productTable, productName);
    return row !== null;
  }

  /**
   * Get product row locator
   */
  async getProductRow(productName: string): Promise<Locator | null> {
    return await this.findTableRow(this.productTable, productName);
  }

  /**
   * Click edit button for specific product
   */
  async editProduct(productName: string): Promise<void> {
    const row = await this.getProductRow(productName);
    if (!row) {
      throw new Error(`Product "${productName}" not found`);
    }
    
    // Find edit button in the row (usually last columns)
    const editButton = row.locator('button[title="Edit"], button:has([data-icon="edit"]), button').last();
    await editButton.click();
    
    // Wait for modal to open
    await this.page.locator('.modal, [role="dialog"]').waitFor({ state: 'visible' });
  }

  /**
   * Configure product with prefix and clientName
   */
  async configureProduct(
    productName: string,
    config: { prefix?: string; clientName?: string }
  ): Promise<void> {
    await this.editProduct(productName);
    
    const modal = this.page.locator('.modal, [role="dialog"]').first();
    
    // Fill prefix if provided
    if (config.prefix) {
      const prefixInput = modal.locator('input[name="prefix"], input[placeholder*="prefix" i]').first();
      await prefixInput.fill(config.prefix);
    }
    
    // Fill/select clientName if provided
    if (config.clientName) {
      // Try dropdown first
      const clientDropdown = modal.locator('select[name="clientName"], .ant-select').first();
      if (await clientDropdown.isVisible().catch(() => false)) {
        await clientDropdown.selectOption(config.clientName);
      } else {
        // Try input field
        const clientInput = modal.locator('input[name="clientName"]').first();
        await clientInput.fill(config.clientName);
      }
    }
    
    // Save
    const saveButton = modal.locator('button:has-text("Save"), button[type="submit"]').first();
    await saveButton.click();
    
    // Wait for modal to close
    await modal.waitFor({ state: 'hidden', timeout: 10000 });
    
    // Wait for success message or table refresh
    await this.page.waitForTimeout(1000);
  }

  /**
   * Add new product to customer
   */
  async addProduct(productName: string): Promise<void> {
    await this.addProductButton.click();
    
    const modal = this.page.locator('.modal, [role="dialog"]').first();
    await modal.waitFor({ state: 'visible' });
    
    // Select product from dropdown/list
    const productSelect = modal.locator('select, .ant-select').first();
    await productSelect.selectOption(productName);
    
    // Confirm
    const confirmButton = modal.locator('button:has-text("Add"), button:has-text("Save"), button[type="submit"]').first();
    await confirmButton.click();
    
    // Wait for modal to close
    await modal.waitFor({ state: 'hidden', timeout: 10000 });
  }

  /**
   * Delete product from customer
   */
  async deleteProduct(productName: string): Promise<void> {
    const row = await this.getProductRow(productName);
    if (!row) {
      throw new Error(`Product "${productName}" not found`);
    }
    
    const deleteButton = row.locator('button[title="Delete"], button:has([data-icon="delete"]), button:has-text("Delete")').first();
    await deleteButton.click();
    
    // Confirm deletion
    await this.handleModal('confirm');
    
    // Wait for row to disappear
    await expect(row).not.toBeVisible({ timeout: 10000 });
  }

  /**
   * Get all product names in the table
   */
  async getAllProducts(): Promise<string[]> {
    const rows = this.productTable.locator('tbody tr');
    const count = await rows.count();
    const products: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const nameCell = rows.nth(i).locator('td').nth(1);
      const name = await nameCell.textContent();
      if (name) products.push(name.trim());
    }
    
    return products;
  }

  /**
   * Get product configuration (prefix, clientName)
   */
  async getProductConfig(productName: string): Promise<{ prefix: string; clientName: string } | null> {
    const row = await this.getProductRow(productName);
    if (!row) return null;
    
    const cells = row.locator('td');
    const prefixCell = cells.nth(3); // Prefix/Company column
    const clientCell = cells.nth(4); // Client Name column
    
    return {
      prefix: (await prefixCell.textContent())?.trim() || '-',
      clientName: (await clientCell.textContent())?.trim() || '-'
    };
  }

  /**
   * Search for product in the list
   */
  async searchProduct(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchButton.click();
    await this.waitForTableLoad(this.productTable);
  }

  /**
   * Wait for "Something Went Wrong" error to disappear
   */
  async waitForErrorToClear(): Promise<void> {
    const errorModal = this.page.locator('.modal:has-text("Something Went Wrong")');
    if (await this.elementExists(errorModal)) {
      const okButton = errorModal.locator('button:has-text("OK")');
      await okButton.click();
      await errorModal.waitFor({ state: 'hidden' });
    }
  }

  /**
   * Configure Thai Lotto with superadmin clientName
   */
  async configureThaiLotto(): Promise<void> {
    await this.configureProduct('Thai Lotto', { clientName: 'superadmin' });
  }

  /**
   * Sync Tiamut product (press Sync button)
   */
  async syncTiamutProduct(productName: string): Promise<void> {
    await this.editProduct(productName);
    
    const modal = this.page.locator('.modal, [role="dialog"]').first();
    
    // Find and click Sync button
    const syncButton = modal.locator('button:has-text("Sync")').first();
    if (await syncButton.isVisible().catch(() => false)) {
      await syncButton.click();
      // Wait for sync to complete
      await this.page.waitForTimeout(2000);
    }
    
    // Save
    const saveButton = modal.locator('button:has-text("Save")').first();
    await saveButton.click();
    await modal.waitFor({ state: 'hidden', timeout: 10000 });
  }
}
