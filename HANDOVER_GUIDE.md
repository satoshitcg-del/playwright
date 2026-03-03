# IShef Playwright Automation
## Handover Guide

---

## 📌 คำอธิบายสำหรับทีมที่รับต่อ

เอกสารนี้จัดทำขึ้นสำหรับทีมที่จะรับช่วงต่อการดูแลและพัฒนาโปรเจกต์ **IShef Playwright Automation** โปรเจกต์นี้เป็นระบบทดสอบอัตโนมัติสำหรับแอปพลิเคชัน IShef Accounting/Finance โดยใช้ Playwright Framework

### สิ่งที่ต้องรู้ก่อนเริ่ม

1. **Playwright** เป็น framework สำหรับ browser automation ที่รองรับหลาย browser
2. **Page Object Model (POM)** คือรูปแบบการจัดโครงสร้างโค้ดที่แยก UI logic ออกจาก test logic
3. **Test ทุกตัวขึ้นกับข้อมูลเฉพาะ** (เช่น customer ID: creator_master_001)
4. **Authentication State** ถูกบันทึกไว้เพื่อลดเวลา login ซ้ำ

---

## 🔧 วิธี Maintenance

### รายการตรวจสอบประจำสัปดาห์

```
□ รัน tests ทั้งหมดและตรวจสอบผลลัพธ์
□ ตรวจสอบ test results ล่าสุด
□ อัปเดต dependencies ถ้ามี security patches
□ ตรวจสอบว่า authentication state ยังใช้งานได้
□ ตรวจสอบ test data ว่ายังตรงกับระบบจริง
```

### รายการตรวจสอบประจำเดือน

```
□ รีวิว test coverage
□ อัปเดต test cases ตาม feature ใหม่
□ ตรวจสอบ environment variables
□ สำรอง test-results สำคัญ
□ อัปเดตเอกสารถ้ามีการเปลี่ยนแปลง
```

### การ Fix Failed Tests

#### 1. ตรวจสอบสาเหตุ
```bash
# รัน test ที่ fail พร้อม headed mode
npx playwright test <test-file> --headed

# ดู report ล่าสุด
npx playwright show-report
```

#### 2. สาเหตุที่พบบ่อย

| อาการ | สาเหตุ | วิธีแก้ |
|-------|--------|---------|
| Test timeout | UI เปลี่ยนช้า | เพิ่ม timeout ใน config |
| Element not found | Selector เปลี่ยน | อัปเดต selector |
| Authentication fail | Session หมดอายุ | รัน auth setup ใหม่ |
| Data mismatch | ข้อมูล test เปลี่ยน | อัปเดต test-data.ts |

#### 3. การ Debug

```bash
# Run with UI mode
npx playwright test --ui

# Run with debug mode
npx playwright test --debug

# Run with specific browser
npx playwright test --headed --project=chromium
```

---

## ➕ วิธีเพิ่ม Test Cases ใหม่

### Step 1: วิเคราะห์ Feature

ก่อนเขียน test ให้ถามตัวเอง:
- Feature นี้ทำอะไร?
- มีขั้นตอนอะไรบ้าง?
- ข้อมูลอะไรที่จำเป็นต้องใช้?
- ผลลัพธ์ที่คาดหวังคืออะไร?

### Step 2: สร้าง Page Object (ถ้าจำเป็น)

```typescript
// pages/new-feature.page.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class NewFeaturePage extends BasePage {
  readonly featureButton: Locator;
  readonly featureInput: Locator;

  constructor(page: Page) {
    super(page);
    this.featureButton = page.locator('button[data-testid="feature-btn"]');
    this.featureInput = page.locator('input[name="feature-input"]');
  }

  async performAction(data: string): Promise<void> {
    await this.featureButton.click();
    await this.featureInput.fill(data);
    // ... more actions
  }
}
```

### Step 3: สร้าง Test File

```typescript
// tests/feature/new-feature.spec.ts
import { test, expect } from '@playwright/test';
import { NewFeaturePage } from '../../pages/new-feature.page';

test.describe('New Feature', () => {
  let featurePage: NewFeaturePage;

  test.beforeEach(async ({ page }) => {
    featurePage = new NewFeaturePage(page);
    await featurePage.goto('/new-feature');
  });

  test('should perform action successfully', async () => {
    await featurePage.performAction('test data');
    // assertions
    await expect(featurePage.page).toHaveURL(/.*success.*/);
  });
});
```

### Step 4: เพิ่ม Test Data (ถ้าจำเป็น)

```typescript
// fixtures/test-data.ts
export const NEW_FEATURE_DATA = {
  validInput: 'valid data',
  invalidInput: 'invalid data',
  expectedResult: 'expected result'
};
```

### Template สำหรับ Test Case ใหม่

```typescript
import { test, expect } from '@playwright/test';
import { YourPage } from '../../pages/your.page';

test.describe('[Feature Name]', () => {
  let pageObject: YourPage;

  test.beforeEach(async ({ page }) => {
    pageObject = new YourPage(page);
    await pageObject.goto('/path');
  });

  test('should [expected behavior]', async () => {
    // Arrange
    const input = 'test data';
    
    // Act
    await pageObject.doSomething(input);
    
    // Assert
    await expect(pageObject.page).toHaveURL(/.*pattern.*/);
    await expect(pageObject.someElement).toBeVisible();
  });
});
```

---

## 🐛 Troubleshooting Guide

### Common Errors

#### 1. Error: `browserType.launch: Executable doesn't exist`

**สาเหตุ**: Playwright browsers ยังไม่ได้ติดตั้ง

**แก้ไข**:
```bash
npx playwright install
```

---

#### 2. Error: `Error: expect(received).toHaveURL()`

**สาเหตุ**: การ redirect ไม่เป็นไปตามที่คาดไว้

**แก้ไข**:
```typescript
// รอให้ navigation เสร็จก่อน
await page.waitForLoadState('networkidle');

// หรือใช้ timeout ที่ยาวขึ้น
await expect(page).toHaveURL(/.*expected.*/, { timeout: 10000 });
```

---

#### 3. Error: `locator.click: Target closed`

**สาเหตุ**: Page ถูกปิดก่อนที่จะ click เสร็จ

**แก้ไข**:
```typescript
// รอให้ element พร้อมก่อน click
await locator.waitFor({ state: 'visible' });
await locator.click();

// หรือใช้ retry
await expect(locator).toBeVisible({ timeout: 10000 });
await locator.click();
```

---

#### 4. Error: `Authentication required`

**สาเหตุ**: Authentication state หมดอายุหรือไม่มี

**แก้ไข**:
```bash
# รัน auth setup ใหม่
npm run test:auth
```

---

#### 5. Error: Test ผ่านบ้าง ไม่ผ่านบ้าง (Flaky)

**สาเหตุ**: Race condition หรือ UI ไม่ stable

**แก้ไข**:
```typescript
// เพิ่ม waiting
await page.waitForLoadState('networkidle');

// หรือใช้ auto-retry
test('flaky test', async ({ page }) => {
  await expect(async () => {
    // test logic
  }).toPass({ timeout: 10000 });
});
```

---

### Debug Techniques

#### 1. ใช้ Trace Viewer

```bash
# เปิด trace ล่าสุด
npx playwright show-trace test-results/<test-name>/trace.zip
```

#### 2. ดู Screenshot

```bash
# Screenshot จะอยู่ใน test-results/
ls test-results/
```

#### 3. ใช้ Console Logs

```typescript
test('debug test', async ({ page }) => {
  page.on('console', msg => console.log(msg.text()));
  page.on('pageerror', error => console.log(error.message));
  // ... test code
});
```

#### 4. Slow Motion

```typescript
// playwright.config.ts
use: {
  launchOptions: {
    slowMo: 1000, // ช้าลง 1 วินาทีต่อ action
  },
}
```

---

## 📚 Contact & Resources

### ทีมพัฒนา

| บทบาท | ชื่อ | ติดต่อ |
|-------|------|--------|
| **QA Lead** | [ชื่อ] | [email] |
| **Dev Lead** | [ชื่อ] | [email] |
| **PM** | [ชื่อ] | [email] |

### เอกสารอ้างอิง

| เอกสาร | ตำแหน่ง | รายละเอียด |
|--------|---------|-----------|
| **Project Documentation** | `./PROJECT_DOCUMENTATION.md` | เอกสารหลักส่งหัวหน้า |
| **README** | `./README.md` | คู่มือเริ่มต้นใช้งาน |
| **Quick Start** | `./QUICKSTART.md` | เริ่มต้นอย่างรวดเร็ว |
| **Changelog** | `./CHANGELOG.md` | บันทึกการเปลี่ยนแปลง |
| **API Docs** | - | ติดต่อ Dev Team |

### External Resources

- **Playwright Documentation**: https://playwright.dev/docs/intro
- **Playwright API Reference**: https://playwright.dev/docs/api/class-playwright
- **Best Practices**: https://playwright.dev/docs/best-practices
- **Discord Community**: https://aka.ms/playwright/discord

### Repository

```bash
# Local path
/Users/testjumpcloud3/Documents/GitHub/playwright

# Git repository
[ใส่ URL ของ repository]
```

---

## 🎯 Quick Commands Reference

```bash
# ติดตั้ง
npm install
npx playwright install

# รัน tests
npm test                              # รันทั้งหมด
npm run test:ui                       # UI mode
npm run test:headed                   # เห็น browser
npm run test:debug                    # debug mode

# รันเฉพาะบาง test
npx playwright test tests/customer/customer-detail.spec.ts
npx playwright test -g "Thai Lotto"   # ตามชื่อ

# Auth
npm run test:auth                     # setup auth

# Reports
npm run test:report                   # ดู report
npx playwright show-report            # ดู report (อีกวิธี)
```

---

## 📝 Notes

### สิ่งที่ต้องระวัง

1. **อย่า commit credentials** ลงใน repository (ใช้ .env)
2. **อย่าแก้ไข test-results/** โดยตรง (สร้างอัตโนมัติ)
3. **อย่าลบ playwright/.auth/** ถ้าไม่จำเป็น (ต้อง setup ใหม่)
4. **ระวังเรื่อง parallel execution** - test มี dependency ต่อกัน

### คำแนะนำ

1. **รัน test ก่อน commit** ทุกครั้ง
2. **ใช้ UI mode สำหรับ debug**
3. **อัปเดตเอกสาร** เมื่อเพิ่ม feature ใหม่
4. **สื่อสารกับทีม** ถ้ามีการเปลี่ยนแปลงสำคัญ

---

*เอกสารฉบับนี้จัดทำเมื่อวันที่ 2026-03-04*
*Version 1.0.0*
