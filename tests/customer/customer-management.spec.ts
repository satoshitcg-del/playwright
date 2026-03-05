import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { CustomerDetailPage } from '../../pages/customer-detail.page';

/**
 * Test Cases: Acc_15 - Acc_21
 * Module: Customer Management
 * Feature: Customer CRUD operations
 */

test.describe('Customer Management', () => {
  let loginPage: LoginPage;
  let customerPage: CustomerDetailPage;
  const createdCustomers: string[] = [];

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    customerPage = new CustomerDetailPage(page);
    
    await loginPage.goto();
    await loginPage.login('admin_eiji', '0897421942@Earth', '999999');
  });

  test.afterEach(async () => {
    // Cleanup: Note actual cleanup would require API or UI deletion
    createdCustomers.length = 0;
  });

  test('Acc_15: สร้างลูกค้าใหม่ - ข้อมูลครบถ้วน', async ({ page }) => {
    const timestamp = Date.now();
    const customerData = {
      customerId: `TEST_${timestamp}`,
      name: `Test Customer ${timestamp}`,
      email: `test${timestamp}@example.com`,
      phone: `081${timestamp.toString().slice(-8)}`
    };

    createdCustomers.push(customerData.customerId);

    await page.goto('https://bo-dev.askmebill.com/customers');
    await page.getByRole('button', { name: /create|สร้าง|new|เพิ่ม/i }).click();
    
    await page.getByLabel(/customer id|รหัสลูกค้า/i).fill(customerData.customerId);
    await page.getByLabel(/name|ชื่อ/i).fill(customerData.name);
    await page.getByLabel(/email|อีเมล/i).fill(customerData.email);
    await page.getByLabel(/phone|เบอร์โทร/i).fill(customerData.phone);
    
    await page.getByRole('button', { name: /save|บันทึก/i }).click();

    // Verify success
    await expect(
      page.locator('text=Customer created successfully').or(
        page.locator('text=สร้างสำเร็จ')
      ).or(
        page.locator('.ant-message-success')
      )
    ).toBeVisible({ timeout: 10000 });

    // Verify customer appears in list
    await page.goto('https://bo-dev.askmebill.com/customers');
    await page.getByPlaceholder(/search|ค้นหา/i).fill(customerData.customerId);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    await expect(page.locator(`text=${customerData.customerId}`)).toBeVisible();
  });

  test('Acc_16: สร้างลูกค้า - ไม่กรอกข้อมูลบังคับ', async ({ page }) => {
    await page.goto('https://bo-dev.askmebill.com/customers');
    await page.getByRole('button', { name: /create|สร้าง|new|เพิ่ม/i }).click();
    
    // Submit without filling required fields
    await page.getByRole('button', { name: /save|บันทึก/i }).click();

    // Verify validation error
    await expect(
      page.locator('text=Please fill out this field').or(
        page.locator('text=กรุณากรอก')
      ).or(
        page.locator('.ant-form-item-explain-error')
      )
    ).toBeVisible({ timeout: 5000 });
  });

  test('Acc_17: สร้างลูกค้า - Customer ID ซ้ำ', async ({ page }) => {
    await page.goto('https://bo-dev.askmebill.com/customers');
    await page.getByRole('button', { name: /create|สร้าง|new|เพิ่ม/i }).click();
    
    // Use existing customer ID
    await page.getByLabel(/customer id|รหัสลูกค้า/i).fill('creator_master_001');
    await page.getByLabel(/name|ชื่อ/i).fill('Duplicate Test');
    await page.getByLabel(/email|อีเมล/i).fill('dup@test.com');
    
    await page.getByRole('button', { name: /save|บันทึก/i }).click();
    await page.waitForTimeout(2000);

    // Verify error message
    const pageContent = await page.locator('body').textContent();
    expect(
      pageContent?.includes('already exists') ||
      pageContent?.includes('ซ้ำ') ||
      pageContent?.includes('exists') ||
      pageContent?.includes('มีอยู่แล้ว')
    ).toBeTruthy();
  });

  test('Acc_18: ค้นหาลูกค้าด้วย Customer ID', async ({ page }) => {
    await page.goto('https://bo-dev.askmebill.com/customers');
    
    await page.getByPlaceholder(/search|ค้นหา/i).fill('creator_master_001');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    // Verify search results
    await expect(page.locator('text=creator_master_001')).toBeVisible();
    
    // Verify result count
    const rows = await page.locator('table tbody tr').count();
    expect(rows).toBeGreaterThan(0);
  });

  test('Acc_19: ค้นหาลูกค้า - ไม่พบข้อมูล', async ({ page }) => {
    await page.goto('https://bo-dev.askmebill.com/customers');
    
    await page.getByPlaceholder(/search|ค้นหา/i).fill('NOTEXIST_999999');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    // Verify no results
    const pageContent = await page.locator('body').textContent();
    expect(
      pageContent?.includes('No data') ||
      pageContent?.includes('ไม่พบ') ||
      pageContent?.includes('No records') ||
      pageContent?.includes('0 results')
    ).toBeTruthy();
  });

  test('Acc_20: แก้ไขข้อมูลลูกค้า', async ({ page }) => {
    // Create customer first
    const timestamp = Date.now();
    const customerId = `EDIT_${timestamp}`;
    
    await page.goto('https://bo-dev.askmebill.com/customers');
    await page.getByRole('button', { name: /create|สร้าง|new|เพิ่ม/i }).click();
    await page.getByLabel(/customer id|รหัสลูกค้า/i).fill(customerId);
    await page.getByLabel(/name|ชื่อ/i).fill('Before Edit');
    await page.getByLabel(/email|อีเมล/i).fill(`before${timestamp}@test.com`);
    await page.getByRole('button', { name: /save|บันทึก/i }).click();
    await page.waitForTimeout(2000);

    // Edit customer
    await page.goto('https://bo-dev.askmebill.com/customers');
    await page.getByPlaceholder(/search|ค้นหา/i).fill(customerId);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
    
    // Click edit
    await page.locator('table tbody tr:first-child .anticon-edit, table tbody tr:first-child [data-testid="edit-btn"]').first().click();
    await page.waitForTimeout(1000);
    
    const newEmail = `updated_${timestamp}@test.com`;
    await page.getByLabel(/email|อีเมล/i).fill(newEmail);
    await page.getByRole('button', { name: /save|บันทึก/i }).click();

    // Verify update
    await expect(
      page.locator('text=updated successfully').or(
        page.locator('text=อัพเดตสำเร็จ')
      ).or(
        page.locator('.ant-message-success')
      )
    ).toBeVisible({ timeout: 10000 });
  });

  test('Acc_21: ลบลูกค้า', async ({ page }) => {
    // Create customer first
    const timestamp = Date.now();
    const customerId = `DEL_${timestamp}`;
    
    await page.goto('https://bo-dev.askmebill.com/customers');
    await page.getByRole('button', { name: /create|สร้าง|new|เพิ่ม/i }).click();
    await page.getByLabel(/customer id|รหัสลูกค้า/i).fill(customerId);
    await page.getByLabel(/name|ชื่อ/i).fill('To Delete');
    await page.getByLabel(/email|อีเมล/i).fill(`del${timestamp}@test.com`);
    await page.getByRole('button', { name: /save|บันทึก/i }).click();
    await page.waitForTimeout(2000);

    // Delete customer
    await page.goto('https://bo-dev.askmebill.com/customers');
    await page.getByPlaceholder(/search|ค้นหา/i).fill(customerId);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
    
    // Click delete
    await page.locator('table tbody tr:first-child .anticon-delete, table tbody tr:first-child [data-testid="delete-btn"]').first().click();
    
    // Confirm delete
    await page.locator('text=Yes').or(page.locator('text=ตกลง')).or(page.locator('text=Confirm')).first().click();

    // Verify deletion
    await expect(
      page.locator('text=deleted successfully').or(
        page.locator('text=ลบสำเร็จ')
      ).or(
        page.locator('.ant-message-success')
      )
    ).toBeVisible({ timeout: 10000 });
  });
});
