import { test, expect } from '@playwright/test';
import { CustomerDetailPage } from '../../pages/customer-detail.page';

/**
 * Test suite for Customer Product Configuration
 * Based on IShef requirements for creator_master_001
 */
test.describe('Customer Product Configuration', () => {
  let customerPage: CustomerDetailPage;
  const CUSTOMER_ID = 'creator_master_001';

  test.beforeEach(async ({ page }) => {
    customerPage = new CustomerDetailPage(page);
    await customerPage.gotoCustomer(CUSTOMER_ID);
    
    // Handle any error modals
    await customerPage.waitForErrorToClear().catch(() => {});
  });

  test('should have Thai Lotto product assigned', async () => {
    const hasProduct = await customerPage.hasProduct('Thai Lotto');
    expect(hasProduct).toBe(true);
  });

  test('should configure Thai Lotto with superadmin clientName', async () => {
    // Skip if product not found
    test.skip(!(await customerPage.hasProduct('Thai Lotto')), 'Thai Lotto not found');
    
    // Configure product
    await customerPage.configureProduct('Thai Lotto', {
      clientName: 'superadmin'
    });
    
    // Verify configuration
    const config = await customerPage.getProductConfig('Thai Lotto');
    expect(config?.clientName).toBe('superadmin');
  });

  test('should configure Super API with clientName', async () => {
    test.skip(!(await customerPage.hasProduct('Super API')), 'Super API not found');
    
    await customerPage.configureProduct('Super API', {
      clientName: '1xpower' // or any valid clientName
    });
    
    const config = await customerPage.getProductConfig('Super API');
    expect(config?.clientName).not.toBe('-');
  });

  test('should sync Tiamut PGSOFT product', async () => {
    test.skip(!(await customerPage.hasProduct('ระบบออโต้ Tiamut (PGSOFT)')), 'Tiamut PGSOFT not found');
    
    await customerPage.syncTiamutProduct('ระบบออโต้ Tiamut (PGSOFT)');
    
    // Verify product is still active after sync
    const config = await customerPage.getProductConfig('ระบบออโต้ Tiamut (PGSOFT)');
    expect(config).not.toBeNull();
  });

  test('should list all assigned products', async () => {
    const products = await customerPage.getAllProducts();
    console.log('Assigned products:', products);
    
    // Expected products for creator_master_001
    const expectedProducts = [
      'Thai Lotto',
      'Super API',
      'DIRect_API( สำหรับทดสอบเท่านั้น )',
      'ระบบออโต้ Tiamut (PGSOFT)',
      'ระบบออโต้ (นอกเครือ)Fix rate',
      'ระบบออโต้ (นอกเครือ)',
      'ระบบออโต้ (ในเครือ)',
      'SportbookV.2',
      'ระบบออโต้ Tiamut (ในเครือ)',
      'ระบบออโต้ Tiamut (นอกเครือ)'
    ];
    
    // Check that at least some expected products exist
    const hasExpectedProducts = expectedProducts.some(ep => 
      products.some(p => p.includes(ep) || ep.includes(p))
    );
    
    expect(hasExpectedProducts).toBe(true);
  });

  test('should search for specific product', async () => {
    await customerPage.searchProduct('Thai Lotto');
    
    const products = await customerPage.getAllProducts();
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toContain('Thai Lotto');
  });
});
