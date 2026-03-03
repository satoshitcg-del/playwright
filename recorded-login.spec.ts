import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://bo-dev.askmebill.com/login');
  await page.getByRole('textbox', { name: 'อีเมลล์หรือชื่อผู้ใช้งาน' }).click();
  await page.getByRole('textbox', { name: 'อีเมลล์หรือชื่อผู้ใช้งาน' }).fill('admin_eiji');
  await page.getByRole('textbox', { name: 'รหัสผ่าน' }).click();
  await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill('0897421942@Earth');
  await page.getByTestId('login-loginform-submit-button').click();
  await page.getByRole('textbox', { name: 'รหัสยืนยัน' }).click();
  await page.getByRole('textbox', { name: 'รหัสยืนยัน' }).fill('9999999');
  await page.getByRole('button', { name: 'ยืนยัน' }).click();
});