# 🔍 Login Debug Diagnostic Report

**วันที่สร้าง:** 2026-03-04  
**เป้าหมาย:** ตรวจสอบสาเหตุที่ login ไม่ผ่านบน https://bo-dev.askmebill.com  
**Test File:** `/Users/testjumpcloud3/Documents/GitHub/playwright/tests/auth/login-debug.spec.ts`

---

## 📋 สรุปผลการวิเคราะห์

### 1️⃣ TEST-01: Page Load Verification
**เป้าหมาย:** ตรวจสอบว่าหน้า login โหลดได้ปกติหรือไม่

**การทำงาน:**
- Navigate ไปยัง URL: `https://bo-dev.askmebill.com`
- วัดเวลา loading
- บันทึก response status และ page title
- ถ่าย screenshot: `test-results/debug/01-page-loaded.png`

**ข้อมูลที่เก็บ:**
- Page load time
- Response status code
- Current URL
- Page title
- Viewport size

---

### 2️⃣ TEST-02: Selector Verification
**เป้าหมาย:** ตรวจสอบว่า selectors ถูกต้องและ elements มีอยู่จริง

**Selectors ที่ตรวจสอบ:**
| Selector | ประเภท | คาดหวัง |
|----------|--------|---------|
| `input[type="text"]` | Username field | ✅ ต้องพบและ visible |
| `input[type="password"]` | Password field | ✅ ต้องพบและ visible |
| `button[type="submit"]` | Submit button | ✅ ต้องพบและ visible |
| `button` | Any button | ✅ Backup selector |
| `input` | Any input | ✅ Backup selector |
| `form` | Form element | ✅ ต้องมี |
| `label` | Label elements | ✅ ควรมี |
| `.error, .alert, [role="alert"]` | Error messages | ⚠️ อาจมีถ้ามี error |

**ข้อมูลที่เก็บ:**
- จำนวน elements ที่พบ (count)
- สถานะ visible/invisible
- Attributes ของ input fields (type, name, id, placeholder, required, disabled)
- Screenshot ก่อนและหลัง: `02-before-selector-check.png`, `02-after-selector-check.png`

---

### 3️⃣ TEST-03: Form Fill Verification
**เป้าหมาย:** ตรวจสอบว่าค่าที่กรอกลง form ติดจริงหรือไม่

**ขั้นตอน:**
1. กรอก username: `admin_eiji`
2. ตรวจสอบว่าค่าติด (compare input value)
3. Screenshot หลังกรอก username
4. กรอก password: `0897421942@Earth`
5. ตรวจสอบว่าค่าติด (compare length)
6. Screenshot หลังกรอกครบ

**ข้อมูลที่เก็บ:**
- Input enabled/disabled status
- Value หลัง fill username
- Password length หลัง fill
- DOM state ของทุก input fields
- Screenshots: `03-before-fill.png`, `03-after-username.png`, `03-after-fill.png`

---

### 4️⃣ TEST-04: Submit Click & Wait 10s
**เป้าหมาย:** ตรวจสอบว่าเกิดอะไรขึ้นหลัง click submit

**ขั้นตอน:**
1. กรอกข้อมูลครบถ้วน
2. Screenshot ก่อน submit
3. Click submit button
4. บันทึก URL ก่อนและหลัง
5. รอ 10 วินาที พร้อม log URL ทุก 1 วินาที
6. ตรวจสอบ loading indicators
7. Screenshot หลังรอ 10 วิ: `04-after-wait-10s.png`

**ข้อมูลที่เก็บ:**
- URL ก่อน submit
- URL เปลี่ยนตอนวินาทีที่เท่าไร
- URL หลัง 10 วิ
- Loading indicators ที่พบ
- Screenshots: `04-before-submit.png`, `04-after-wait-10s.png`

---

### 5️⃣ TEST-05: Network Request Monitoring
**เป้าหมาย:** ตรวจสอบ network requests ระหว่าง login

**การทำงาน:**
- Intercept ทุก request ด้วย `page.route('**/*')`
- เก็บ log ของ API calls (XHR/Fetch)
- รอ response จาก `/api/`, `/auth/`, หรือ `/login`
- บันทึก status code, headers, body

**ข้อมูลที่เก็บ:**
- รายการทุก API call (method, URL, status, type)
- Request/Response details
- API response body (ถ้าเป็น JSON)
- Screenshots: `05-network-start.png`, `05-network-end.png`

**ตัวอย่าง API ที่คาดหวัง:**
```
POST /api/auth/login
หรือ
POST /api/v1/login
หรือ
POST /auth/login
```

---

### 6️⃣ TEST-06: Error Message Detection
**เป้าหมาย:** ตรวจสอบ error messages ทุกรูปแบบ

**ขั้นตอน:**
1. สแกนหา error messages ตอนโหลดหน้า
2. ลอง login ด้วย credentials ผิด (trigger error)
3. รอ 5 วิ
4. สแกนหา error messages อีกครั้ง
5. ลอง login ด้วย credentials ถูกต้อง
6. บันทึก console errors

**Selectors ที่ตรวจสอบ:**
- `[role="alert"]` - ARIA alert
- `.error, .error-message, .alert-error` - Error classes
- `.toast, .toast-error, .notification-error` - Toast notifications
- `.form-error, .field-error, .invalid-feedback` - Form errors

**ข้อมูลที่เก็บ:**
- Error messages ที่พบตอนโหลดหน้า
- Error messages หลัง login ผิด
- Error messages หลัง login ถูก
- Browser console errors
- Page errors (JavaScript)
- Screenshots: `06-errors-start.png`, `06-before-submit-error.png`, `06-after-submit-error.png`, `06-after-valid-login.png`

---

### 🎁 BONUS: Complete Debug Report
รวมข้อมูลทั้งหมดใน JSON format พร้อม screenshot สุดท้าย

---

## 🚀 วิธีใช้งาน

### รันเฉพาะ test ที่ต้องการ:
```bash
# รันทุก debug tests
cd /Users/testjumpcloud3/Documents/GitHub/playwright
npx playwright test tests/auth/login-debug.spec.ts --project=chromium

# รันเฉพาะ test เดียว
npx playwright test tests/auth/login-debug.spec.ts --grep "TEST-01"
npx playwright test tests/auth/login-debug.spec.ts --grep "TEST-02"
```

### ดูผลลัพธ์แบบ headed (เห็นหน้าจอ):
```bash
npx playwright test tests/auth/login-debug.spec.ts --headed
```

### ดู screenshots ที่บันทึก:
```bash
ls -la test-results/debug/
open test-results/debug/01-page-loaded.png
```

---

## 📊 การตีความผลลัพธ์

### สถานการณ์ที่เป็นไปได้:

#### ✅ Login Success
- URL เปลี่ยนจาก `/login` → `/customer`
- API response status 200
- ไม่มี error messages
- Screenshot แสดงหน้า customer dashboard

#### ❌ Login Failed - Wrong Credentials
- URL ยังอยู่ที่ `/login`
- มี error message "Invalid username or password"
- API response status 401 Unauthorized

#### ❌ Login Failed - Network Error
- URL ไม่เปลี่ยน
- API request timeout หรือ status 5xx
- อาจมี error message เกี่ยวกับ connection

#### ❌ Login Failed - Form Issue
- Input fields ไม่รับค่า (TEST-03 แสดง value ไม่ติด)
- Submit button ไม่ทำงาน (TEST-04 URL ไม่เปลี่ยน)
- JavaScript errors ใน console (TEST-06)

#### ❌ Login Failed - 2FA Required
- URL ยังอยู่ที่หน้า login
- ปรากฏ input field ใหม่สำหรับ 2FA code
- API response บ่งบอกว่าต้องการ 2FA

---

## 🔧 Troubleshooting Checklist

- [ ] รัน TEST-01: Page โหลดได้ไหม?
- [ ] รัน TEST-02: Selectors ถูกต้องไหม?
- [ ] รัน TEST-03: ค่าติดใน form ไหม?
- [ ] รัน TEST-04: URL เปลี่ยนไหมหลัง submit?
- [ ] รัน TEST-05: มี API calls ไหม? Status อะไร?
- [ ] รัน TEST-06: มี error messages อะไรบ้าง?

---

## 📝 Notes

- ทุก test ไม่มี assertions ที่ทำให้ fail
- ทุก test บันทึก screenshots อย่างน้อย 2 รูป
- Console logs แสดงรายละเอียดครบถ้วน
- ใช้สำหรับ diagnostic เท่านั้น ไม่ใช่สำหรับ CI/CD

---

**สร้างโดย:** QA Team  
**ไฟล์:** `tests/auth/login-debug.spec.ts`
