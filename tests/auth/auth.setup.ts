import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

/**
 * Global Setup: Login และบันทึก authentication state
 * รันครั้งเดียวก่อน tests ทั้งหมด
 */
setup('authenticate', async ({ page }) => {
  console.log('🔐 Starting authentication setup...');
  
  // 1. ไปที่หน้า Login
  await page.goto('https://bo-dev.askmebill.com/login');
  console.log('✅ Opened login page');
  
  // 2. กรอก Username (ใช้ getByRole ตาม Codegen)
  await page.getByRole('textbox', { name: 'อีเมลล์หรือชื่อผู้ใช้งาน' }).click();
  await page.getByRole('textbox', { name: 'อีเมลล์หรือชื่อผู้ใช้งาน' }).fill('admin_eiji');
  console.log('✅ Filled username');
  
  // 3. กรอก Password
  await page.getByRole('textbox', { name: 'รหัสผ่าน' }).click();
  await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill('0897421942@Earth');
  console.log('✅ Filled password');
  
  // 4. กด Login
  await page.getByTestId('login-loginform-submit-button').click();
  console.log('✅ Clicked login button');
  
  // 5. รอ 2FA modal
  await page.waitForTimeout(2000);
  
  // 6. กรอก 2FA Code (6 หลัก)
  await page.getByRole('textbox', { name: 'รหัสยืนยัน' }).click();
  await page.getByRole('textbox', { name: 'รหัสยืนยัน' }).fill('999999');
  console.log('✅ Filled 2FA code');
  
  // 7. กดยืนยัน
  await page.getByRole('button', { name: 'ยืนยัน' }).click();
  console.log('✅ Clicked confirm button');
  
  // 8. รอเข้าสู่ระบบ
  await page.waitForTimeout(3000);
  
  // 9. Verify ว่า login สำเร็จ
  await expect(page).toHaveURL(/.*customer.*/);
  console.log('✅ Login successful!');
  
  // 10. บันทึก authentication state
  await page.context().storageState({ path: authFile });
  console.log(`💾 Auth state saved to: ${authFile}`);
});
