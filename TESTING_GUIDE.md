# Playwright Testing Guide
## คู่มือการรันเทสอย่างละเอียด

---

## 📋 สารบัญ

1. [การเตรียมตัวก่อนรันเทส](#1-การเตรียมตัวก่อนรันเทส)
2. [คำสั่งรันเทสทั้งหมด](#2-คำสั่งรันเทสทั้งหมด)
3. [การอ่านผลลัพธ์](#3-การอ่านผลลัพธ์)
4. [การแก้ไขปัญหา](#4-การแก้ไขปัญหา)
5. [ตัวอย่างการใช้งาน](#5-ตัวอย่างการใช้งาน)

---

## 1. การเตรียมตัวก่อนรันเทส

### 1.1 ตรวจสอบสภาพแวดล้อม

```bash
# ตรวจสอบว่าอยู่ในโฟลเดอร์ถูกต้อง
cd /Users/testjumpcloud3/Documents/GitHub/playwright
pwd

# ตรวจสอบว่ามีไฟล์ .env
ls -la .env

# ตรวจสอบ dependencies
npm list @playwright/test
```

### 1.2 ตรวจสอบไฟล์ .env

```env
BASE_URL=https://bo-dev.askmebill.com
USERNAME=admin_eiji
PASSWORD=0897421942@Earth
TWO_FA_CODE=999999
```

**⚠️ สำคัญ:** ต้องมีไฟล์ .env ก่อนรันเทส

### 1.3 ตรวจสอบ Playwright Browsers

```bash
# ตรวจสอบว่าติดตั้ง browsers ครบหรือไม่
npx playwright install chromium
npx playwright install firefox
```

---

## 2. คำสั่งรันเทสทั้งหมด

### 2.1 รันเทสพื้นฐาน

```bash
# 🔹 รันทุก test (แนะนำสำหรับ CI/CD)
npx playwright test

# 🔹 รันด้วย npm script
npm test
```

### 2.2 รันเฉพาะไฟล์

```bash
# รันเฉพาะ authentication tests
npx playwright test tests/auth/login.spec.ts

# รันเฉพาะ customer tests
npx playwright test tests/customer/customer-detail.spec.ts

# รันหลายไฟล์
npx playwright test tests/auth/login.spec.ts tests/customer/customer-detail.spec.ts
```

### 2.3 รันด้วยชื่อ test (grep)

```bash
# รัน test ที่มีคำว่า "login"
npx playwright test -g "login"

# รัน test ที่มีคำว่า "Thai Lotto"
npx playwright test -g "Thai Lotto"

# รัน test ที่มีคำว่า "should login"
npx playwright test -g "should login"
```

### 2.4 โหมดการแสดงผล

```bash
# 🔹 Headless mode (default) - รันเร็ว ไม่แสดง browser
npx playwright test

# 🔹 Headed mode - เห็น browser วิ่ง (เหมาะกับการดูผล)
npx playwright test --headed

# 🔹 UI Mode - มีหน้าต่างควบคุม (แนะนำสำหรับ debug)
npx playwright test --ui

# 🔹 Debug mode - หยุด breakpoint ได้
npx playwright test --debug
```

### 2.5 เลือก Browser

```bash
# รันเฉพาะ Chromium (default)
npx playwright test --project=chromium

# รันเฉพาะ Firefox
npx playwright test --project=firefox

# รันทุก browser
npx playwright test --project=chromium --project=firefox
```

### 2.6 ตัวเลือกเพิ่มเติม

```bash
# รันด้วย workers จำนวนมาก (เร็วขึ้น)
npx playwright test --workers=4

# รันด้วย timeout ที่กำหนด (มิลลิวินาที)
npx playwright test --timeout=60000

# รันแบบไม่ retry (fail fast)
npx playwright test --retries=0

# รันพร้อมบันทึก video (ช่วย debug)
npx playwright test --video=on
```

---

## 3. การอ่านผลลัพธ์

### 3.1 ผลลัพธ์บน Terminal

```
Running 10 tests using 1 worker

  ✓  [chromium] › auth/login.spec.ts:23:7 › Authentication › should login with valid credentials (5.2s)
  ✓  [chromium] › auth/login.spec.ts:45:7 › Authentication › should show error for invalid credentials (2.1s)
  ✓  [chromium] › customer/customer-detail.spec.ts:25:7 › Customer Product Configuration › should have Thai Lotto product assigned (3.4s)
  ✓  [chromium] › customer/customer-detail.spec.ts:35:7 › Customer Product Configuration › should configure Thai Lotto with superadmin clientName (4.8s)
  ...

  10 passed (15.3s)
```

| สัญลักษณ์ | ความหมาย |
|-----------|---------|
| ✅ | Test ผ่าน |
| ❌ | Test ไม่ผ่าน |
| ⏭️ | Test ถูก skip |
| 🔄 | Test กำลัง retry |

### 3.2 ดู HTML Report

```bash
# เปิด report หลังจากรันเทส
npx playwright show-report

# หรือเปิดโดยตรง
open playwright-report/index.html
```

### 3.3 ดู Screenshot/Videos (ถ้า test ไม่ผ่าน)

```bash
# ดูไฟล์ที่บันทึกไว้
ls -la test-results/

# เปิด screenshot
open test-results/screenshots/

# เปิด video
open test-results/videos/
```

---

## 4. การแก้ไขปัญหา

### 4.1 Test ไม่ผ่าน (Failed)

**อาการ:** Test รันไม่ผ่าน

**วิธีแก้:**
```bash
# 1. รันเฉพาะ test ที่ fail
npx playwright test --last-failed

# 2. รันด้วย headed mode เพื่อดูว่าอะไรผิด
npx playwright test -g "test-name" --headed

# 3. รันด้วย UI mode เพื่อ debug
npx playwright test -g "test-name" --ui
```

### 4.2 Test Timeout

**อาการ:** Test รันช้าแล้ว timeout

**วิธีแก้:**
```bash
# เพิ่ม timeout
npx playwright test --timeout=120000

# หรือแก้ใน playwright.config.ts
timeout: 120000,
```

### 4.3 Browser ไม่เจอ

**อาการ:** Error "Executable doesn't exist"

**วิธีแก้:**
```bash
# ติดตั้ง browsers ใหม่
npx playwright install
```

### 4.4 Authentication ไม่ผ่าน

**อาการ:** Login ไม่ได้

**วิธีแก้:**
```bash
# 1. ตรวจสอบ .env
# 2. รัน auth setup ใหม่
npm run test:auth
```

---

## 5. ตัวอย่างการใช้งาน

### ตัวอย่างที่ 1: รันเทสทั้งหมดแบบเร็ว (สำหรับ CI)

```bash
cd /Users/testjumpcloud3/Documents/GitHub/playwright
npx playwright test
```

### ตัวอย่างที่ 2: รันเทสดูผล (สำหรับพัฒนา)

```bash
cd /Users/testjumpcloud3/Documents/GitHub/playwright
npx playwright test --headed
```

### ตัวอย่างที่ 3: Debug test ที่ fail

```bash
# รันเฉพาะ test ที่ fail พร้อม UI
npx playwright test -g "test-name" --ui
```

### ตัวอย่างที่ 4: รันเทสเฉพาะส่วน

```bash
# รันเฉพาะ authentication
npx playwright test tests/auth/ --headed

# รันเฉพาะ customer
npx playwright test tests/customer/ --headed
```

### ตัวอย่างที่ 5: รันเทสพร้อมเก็บ evidence

```bash
# รันพร้อมบันทึก video และ screenshot
npx playwright test --video=on --screenshot=on
```

---

## 📊 Test Summary (จากโปรเจกต์นี้)

| Test Suite | จำนวน Test | ไฟล์ |
|------------|-----------|------|
| Authentication | 4 tests | `tests/auth/login.spec.ts` |
| Customer Product | 6 tests | `tests/customer/customer-detail.spec.ts` |
| **รวม** | **10 tests** | |

---

## 🔗 Quick Reference

| ต้องการ | คำสั่ง |
|---------|--------|
| รันทุก test | `npx playwright test` |
| รันดู browser | `npx playwright test --headed` |
| รัน UI mode | `npx playwright test --ui` |
| รันเฉพาะไฟล์ | `npx playwright test tests/auth/login.spec.ts` |
| รันด้วยชื่อ | `npx playwright test -g "login"` |
| ดู report | `npx playwright show-report` |

---

*เอกสารนี้จัดทำเมื่อ: 2026-03-04*
*สำหรับโปรเจกต์: IShef Playwright Automation*
