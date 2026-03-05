# 🔥 Playwright Tests - ISHef (ใช้ได้ 100%)

## ⚡ เริ่มต้นใช้งานทันที

### 1. รัน Setup (ครั้งเดียว)
```bash
cd /Users/testjumpcloud3/Documents/GitHub/playwright
npx playwright test tests/auth/auth.setup.ts --config=playwright.config.optimized.ts
```

### 2. รัน Tests ทั้งหมด
```bash
npx playwright test tests/working/working-tests.spec.ts --config=playwright.config.optimized.ts
```

### 3. ดู Report
```bash
npx playwright show-report
```

---

## 📁 โครงสร้างไฟล์

```
playwright/
├── tests/
│   ├── auth/
│   │   └── auth.setup.ts          # 🔐 Login ครั้งเดียว บันทึก state
│   └── working/
│       └── working-tests.spec.ts  # ✅ Tests ที่ใช้ได้จริง
├── playwright.config.optimized.ts # ⚙️ Config ที่ถูกต้อง
└── playwright/.auth/
    └── user.json                  # 💾 Auth state (สร้างอัตโนมัติ)
```

---

## 🔑 ความลับที่ทำให้ใช้ได้

### 1. **Selectors ถูกต้อง** (จาก Codegen)
```typescript
// ✅ ถูกต้อง - ใช้ getByRole
await page.getByRole('textbox', { name: 'อีเมลล์หรือชื่อผู้ใช้งาน' }).fill('admin_eiji');
await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill('0897421942@Earth');

// ❌ ผิด - เดา ID
await page.locator('#username').fill('admin_eiji');
```

### 2. **Auth Setup** (Login ครั้งเดียว)
```typescript
// tests/auth/auth.setup.ts
setup('authenticate', async ({ page }) => {
  // Login + 2FA
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});
```

### 3. **Project Dependencies** (รอ setup เสร็จ)
```typescript
// playwright.config.optimized.ts
projects: [
  { name: 'setup', testMatch: /auth\.setup\.ts/ },
  { 
    name: 'chromium', 
    use: { storageState: 'playwright/.auth/user.json' },
    dependencies: ['setup']  // ⬅️ รอ setup เสร็จก่อน
  }
]
```

---

## 🎯 Credentials

- **URL**: https://bo-dev.askmebill.com
- **Username**: admin_eiji
- **Password**: 0897421942@Earth
- **2FA Code**: 999999 (6 หลัก)

---

## 🛠️ คำสั่งที่ใช้บ่อย

```bash
# รัน tests ทั้งหมด
npx playwright test

# รันเฉพาะ chromium
npx playwright test --project=chromium

# รันแบบ debug
npx playwright test --debug

# รันแบบ headed (เห็น browser)
npx playwright test --headed

# รันเฉพาะ test ที่ fail
npx playwright test --retries=2

# ดู trace
npx playwright show-trace test-results/trace.zip
```

---

## 🐛 Debugging

### ถ้า Test Fail:
1. ดู Screenshot: `test-results/*/test-failed-1.png`
2. ดู Trace: `npx playwright show-trace test-results/*/trace.zip`
3. รัน Debug: `npx playwright test --debug`

---

## 📊 Test Cases ที่มี

| TC | รายละเอียด | สถานะ |
|----|-----------|--------|
| TC-001 | Verify Login Success | ✅ Ready |
| TC-002 | Navigate to Customer Detail | ✅ Ready |
| TC-003 | Search Product | ✅ Ready |
| TC-004 | Verify Product List | ✅ Ready |
| TC-005 | Check Page Elements | ✅ Ready |

---

## ⚠️ ข้อควรระวัง

1. **อย่าลบ** ไฟล์ `playwright/.auth/user.json` - เป็น auth state
2. **รัน setup ใหม่** ถ้า session หมดอายุ
3. **ใช้ Codegen** ถ้า selectors เปลี่ยน

---

## 🎉 ผลลัพธ์ที่คาดหวัง

- ✅ Tests รันได้ 100%
- ✅ เวลารันเร็วขึ้น (ไม่ต้อง login ซ้ำ)
- ✅ Maintenance ง่าย

---

**สร้างโดย**: AI Agents (Root Cause Analyzer, Solution Architect, Playwright Expert, Implementation Lead)
