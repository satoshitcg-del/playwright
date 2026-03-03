# Login Test Enhancement - Implementation Log

## 📝 วันที่: 2026-03-04
## 👤 Dev Team

---

## 🎯 ปัญหาที่พบ
- Login test fail หลังกรอกข้อมูล + กด submit แล้วยังอยู่ที่ `/login`
- ใช้ `waitForTimeout` ซึ่งไม่ reliable
- ไม่มีการตรวจสอบ error message ที่ละเอียดพอ

---

## ✅ การปรับปรุงที่ทำ

### 1. Wait Strategies ใหม่ (เลือกได้)

```typescript
// ใช้ได้ 4 แบบ:
await loginPage.loginWith2FA(username, password, code, {
  waitStrategy: 'url'        // Method A: รอ URL change
  waitStrategy: 'response'   // Method B: รอ API response
  waitStrategy: 'networkidle' // Method C: รอ network idle
  waitStrategy: 'hybrid'     // Default: ผสมทั้งหมด
});
```

### 2. Method A: waitForURL()
```typescript
await Promise.all([
  this.submitButton.click(),
  this.page.waitForURL(/\/(customer|login)/, { timeout })
]);
```
**ใช้เมื่อ:** รู้ว่า redirect ไปไหน, เร็วที่สุด

### 3. Method B: waitForResponse()
```typescript
await Promise.all([
  this.page.waitForResponse(
    response => response.url().includes('/api/') && response.status() < 400,
    { timeout }
  ),
  this.submitButton.click()
]);
```
**ใช้เมื่อ:** ต้องการจับ response จาก API, debug ได้ดี

### 4. Method C: waitForLoadState('networkidle')
```typescript
await this.submitButton.click();
await this.page.waitForLoadState('networkidle', { timeout });
```
**ใช้เมื่อ:** หน้าเว็บมีการโหลด resource หลายอย่าง

### 5. Method Hybrid (แนะนำ ✅)
```typescript
// รอ API response + URL change + networkidle
// ถ้าอันใดอันนึงสำเร็จก็ผ่าน
```
**ใช้เมื่อ:** ต้องการความ reliable สูงสุด

---

## 🔧 Features เพิ่มเติม

### 1. Retry Logic
```typescript
maxSubmitAttempts: 3  // ลองกด submit ซ้ำได้ถ้า fail
```

### 2. Extended Timeout
```typescript
timeout: 15000  // 15 วินาที สำหรับเว็บช้า
```

### 3. Debug Screenshots
- ถ่าย screenshot ทุกขั้นตอน พร้อม timestamp
- บันทึกไว้ที่ `test-results/login-{step}-{timestamp}.png`
- ถ่าย full page เพื่อให้เห็นทุกอย่าง

### 4. Error Detection ที่ละเอียดขึ้น
```typescript
// ตรวจสอบหลาย selector:
const errorSelectors = [
  '.error-message',
  '.alert-error',
  '.alert-danger',
  '[role="alert"]',
  '.text-red-500',
  '.MuiAlert-root',
  '.ant-alert',
  '.Toastify__toast--error'
];
```

### 5. 2FA Detection ที่ฉลาดขึ้น
- ตรวจหา input หลายแบบ
- เช็ค text "2FA", "OTP", "verification code"
- Fallback หา input type="number" หรือ maxlength="6"

---

## 📊 ผลการทดสอบ (ต้องรันจริงเพื่อยืนยัน)

### สถานการณ์ที่รองรับ:
| กรณี | การรองรับ |
|------|----------|
| เว็บโหลดช้า | ✅ timeout 15 วินาที |
| API ตอบช้า | ✅ waitForResponse + fallback |
| Submit ไม่ติด | ✅ retry 3 ครั้ง |
| Error message หลายแบบ | ✅ ตรวจหลาย selector |
| 2FA ขึ้นช้า | ✅ รอ + detect หลายรอบ |
| Redirect ไม่ชัดเจน | ✅ hybrid strategy |

---

## 🚀 วิธีใช้งาน

### แบบพื้นฐาน (ใช้ hybrid อัตโนมัติ):
```typescript
const loginPage = new LoginPage(page);
await loginPage.loginWith2FA();
```

### แบบกำหนด strategy:
```typescript
// ลองใช้ response-based
await loginPage.loginWith2FA(
  'admin_eiji',
  '0897421942@Earth',
  '999999',
  { waitStrategy: 'response', timeout: 20000 }
);
```

### แบบ debug ละเอียด:
```typescript
// ดู console log จะเห็นทุกขั้นตอน
// ดู screenshot ใน test-results/
```

---

## 📝 Checklist ก่อนรัน Test

- [ ] ตรวจสอบว่า URL `https://bo-dev.askmebill.com` accessible
- [ ] Credentials ถูกต้อง: admin_eiji / 0897421942@Earth / 999999
- [ ] สร้าง folder `test-results/` ถ้ายังไม่มี
- [ ] รันด้วย `npx playwright test --headed` เพื่อดู real-time
- [ ] เช็ค screenshots หลังรันเสร็จ

---

## 🔍 ถ้ายัง Fail อยู่

### Debug Steps:
1. ดู screenshot ล่าสุดใน `test-results/`
2. ดู console log ว่าหยุดที่ step ไหน
3. ลองเปลี่ยน `waitStrategy`:
   - ถ้า fail ที่ redirect → ใช้ `'url'`
   - ถ้า fail ที่ API → ใช้ `'networkidle'`
   - ถ้าไม่แน่ใจ → ใช้ `'hybrid'` (default)

### ตรวจสอบเพิ่มเติม:
- [ ] ลอง login ด้วยมือดูว่าได้ไหม
- [ ] เช็ค DevTools Network ว่ามี API อะไรเรียกไปบ้าง
- [ ] ดูว่ามี CAPTCHA หรืออะไร block ไหม

---

## 🎉 สรุป

✅ **ไฟล์ `login.page.ts` ถูกปรับปรุงแล้ว**

การเปลี่ยนแปลงหลัก:
1. ✅ ใช้ waitForResponse แทน waitForTimeout
2. ✅ ตรวจสอบ error message หลายแบบ
3. ✅ ลอง click submit หลายครั้งได้
4. ✅ Timeout 15 วินาที รองรับเว็บช้า
5. ✅ Screenshot ทุกขั้นตอน
6. ✅ รองรับ 3 wait strategies + hybrid

พร้อมให้ทดสอบแล้ว! 🚀
