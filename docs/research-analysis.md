# 🔍 Playwright Project Analysis Report

**วันที่วิเคราะห์:** 2026-03-04  
**โปรเจกต์:** IShef Playwright Automation  
**เวอร์ชัน:** 1.0.0  
**วิเคราะห์โดย:** AI Research Team

---

## 📋 สารบัญ

1. [ภาพรวมโปรเจกต์](#1-ภาพรวมโปรเจกต์)
2. [ปัญหาที่พบ](#2-ปัญหาที่พบ)
3. [รายละเอียดปัญหาแยกตามไฟล์](#3-รายละเอียดปัญหาแยกตามไฟล์)
4. [คำแนะนำการแก้ไข](#4-คำแนะนำการแก้ไข)
5. [Checklist สำหรับทีม Dev](#5-checklist-สำหรับทีม-dev)

---

## 1. ภาพรวมโปรเจกต์

### 1.1 โครงสร้างโปรเจกต์

```
playwright/
├── config/                 # ⚠️ ไม่มีไฟล์
├── fixtures/
│   └── test-data.ts        # Test data constants
├── pages/                  # Page Object Model
│   ├── base.page.ts        # Base page class
│   ├── login.page.ts       # Login page actions
│   └── customer-detail.page.ts  # Customer management
├── tests/
│   ├── auth/
│   │   ├── auth.setup.ts   # Global setup
│   │   └── login.spec.ts   # Login tests
│   └── customer/
│       └── customer-detail.spec.ts  # Customer tests
├── utils/                  # ⚠️ ไม่มีไฟล์
├── playwright.config.ts    # Main configuration
├── test-setup.js           # Simple setup test
└── package.json
```

### 1.2 Technology Stack

| Component | Version | Status |
|-----------|---------|--------|
| Playwright | ^1.41.0 | ✅ อัปเดต |
| TypeScript | ^5.3.0 | ✅ อัปเดต |
| Node.js | ^20.x | ✅ Compatible |
| dotenv | ^16.3.1 | ✅ ใช้สำหรับ env vars |

---

## 2. ปัญหาที่พบ

### 📊 สรุปจำนวนปัญหา

| ประเภทปัญหา | จำนวน | ระดับความรุนแรง |
|------------|-------|----------------|
| Hard Delay (waitForTimeout) | 4 จุด | 🔴 High |
| ขาดการ Clear State | 3 จุด | 🔴 High |
| ขาดคอมเม้น/JSDoc | 12+ จุด | 🟡 Medium |
| Inconsistent Code | 2 จุด | 🟡 Medium |
| Potential Bugs | 2 จุด | 🔴 High |

### 🔴 Critical Issues

1. **ใช้ Hard Delay แทน Explicit Waits** - ทำให้ tests ช้าและ unstable
2. **ขาดการ Clear State ระหว่าง Tests** - อาจเกิด test pollution
3. **Broken Test References** - `login.spec.ts` อ้างอิง methods ที่ไม่มีอยู่จริง

---

## 3. รายละเอียดปัญหาแยกตามไฟล์

### 3.1 🔴 `pages/login.page.ts`

#### Issue #1: Hard Delays (Lines 24, 36, 40)

```typescript
// ❌ บรรทัด 24
await this.page.waitForTimeout(3000);

// ❌ บรรทัด 36
await this.page.waitForTimeout(3000);

// ❌ บรรทัด 40
await this.page.waitForTimeout(3000);
```

**ปัญหา:**
- ใช้ fixed wait time แทนที่จะรอ element หรือ state ที่เหมาะสม
- ทำให้ test ช้าโดยไม่จำเป็น
- ไม่ reliable - ถ้า network ช้า อาจ fail

**ควรแก้เป็น:**
```typescript
// ✅ รอ element ที่ต้องการ
await this.page.waitForSelector('.dashboard', { state: 'visible' });
// หรือ
await expect(page).toHaveURL(/.*customer.*/, { timeout: 10000 });
```

#### Issue #2: Missing JSDoc Documentation

**ปัญหา:**
- Class `LoginPage` ไม่มี JSDoc
- Method `loginWith2FA` ไม่มี documentation สำหรับ parameters
- Method `saveAuthState` ไม่มี documentation

**ควรเพิ่ม:**
```typescript
/**
 * Login page actions with 2FA support
 * @class LoginPage
 * @extends BasePage
 */
export class LoginPage extends BasePage {
  /**
   * Perform login with optional 2FA
   * @param {string} username - Login username
   * @param {string} password - Login password
   * @param {string} twoFactorCode - 2FA code (default: '999999')
   * @returns {Promise<void>}
   * @throws {Error} When login fails
   */
  async loginWith2FA(...)
}
```

#### Issue #3: Hardcoded Credentials

**บรรทัด 14-17:**
```typescript
async loginWith2FA(
  username: string = process.env.USERNAME || 'admin_eiji',
  password: string = process.env.PASSWORD || '0897421942@Earth',
  twoFactorCode: string = '999999'
)
```

**ปัญหา:**
- Hardcoded credentials ใน source code
- Security risk
- 2FA code เป็น static value

---

### 3.2 🔴 `pages/customer-detail.page.ts`

#### Issue #1: Hard Delays (Lines 95, 158)

```typescript
// ❌ บรรทัด 95
await this.page.waitForTimeout(1000);

// ❌ บรรทัด 158
await this.page.waitForTimeout(2000);
```

**บริบท:**
- บรรทัด 95: หลัง save modal
- บรรทัด 158: หลัง sync Tiamut product

#### Issue #2: Missing Parameter Documentation

**Method `searchProduct` (Line 178):**
```typescript
async searchProduct(query: string): Promise<void> {
```

**ไม่มี:**
- JSDoc อธิบาย parameter `query`
- ไม่มี documentation ว่าทำอะไร

#### Issue #3: Magic Numbers

```typescript
// บรรทัด 158 - ไม่มีการอธิบายว่าทำไมต้อง 2000ms
await this.page.waitForTimeout(2000);

// บรรทัด 95 - ไม่มีการอธิบายว่าทำไมต้อง 1000ms
await this.page.waitForTimeout(1000);
```

---

### 3.3 🔴 `tests/auth/login.spec.ts`

#### Issue #1: Broken Method References

```typescript
// ❌ บรรทัด 15, 24, 34
await loginPage.login(...);           // Method นี้ไม่มีใน LoginPage class!
await loginPage.twoFactorInput;       // Property นี้ไม่มีใน LoginPage class!
await loginPage.enterTwoFactorCode(); // Method นี้ไม่มีใน LoginPage class!
await loginPage.getErrorMessage();    // Method นี้ไม่มีใน LoginPage class!
```

**ปัญหาร้ายแรง:**
- Test file นี้จะ fail ทันทีเพราะเรียก methods ที่ไม่มีอยู่
- มี method `loginWith2FA` แต่ test เรียก `login`

#### Issue #2: Missing Test Documentation

```typescript
// ❌ ไม่มี JSDoc สำหรับ test suite
test.describe('Authentication', () => {
  
  // ❌ ไม่มี JSDoc สำหรับ individual tests
  test('should login with valid credentials', async () => {
```

#### Issue #3: No State Cleanup

```typescript
// ❌ ไม่มี test.afterEach หรือ test.afterAll
// สำหรับ cleanup state หลัง test
```

---

### 3.4 🔴 `tests/customer/customer-detail.spec.ts`

#### Issue #1: Conditional Test Skipping

```typescript
// บรรทัด 25, 31, 41, 51
test.skip(!(await customerPage.hasProduct('Thai Lotto')), 'Thai Lotto not found');
```

**ปัญหา:**
- ใช้ `test.skip()` ใน beforeEach hook ไม่ได้ผลตามที่คาดหวัง
- Test จะถูก skip ใน runtime ซึ่งอาจทำให้สับสน

**ควรแก้เป็น:**
```typescript
// ✅ ใช้ test.skip() นอก test block
// หรือใช้ test.fail() ถ้าต้องการ mark as expected fail
```

#### Issue #2: Missing State Cleanup

```typescript
// ❌ ไม่มีการ cleanup หลัง test
// เช่น ถ้ามีการแก้ไข configuration ควรจะ revert กลับ
test.afterEach(async () => {
  // Cleanup code here
});
```

---

### 3.5 🟡 `pages/base.page.ts`

#### Issue #1: Incomplete Error Handling

```typescript
// บรรทัด 29-38 - fillWithRetry
async fillWithRetry(locator: Locator, value: string, retries = 3): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      // ...
    } catch (e) {
      if (i === retries - 1) throw e;
      await this.page.waitForTimeout(500); // Hard delay
    }
  }
}
```

**ปัญหา:**
- ใช้ hard delay 500ms ใน retry loop
- ไม่มี exponential backoff

---

### 3.6 🟡 `playwright.config.ts`

#### Issue #1: No Global State Cleanup

```typescript
// ❌ ไม่มี globalSetup หรือ globalTeardown
// สำหรับ cleanup test data ที่สร้างขึ้น
```

#### Issue #2: Sequential Execution Risk

```typescript
fullyParallel: false, // Set to false for sequential execution
```

**ปัญหา:**
- ทำให้ test ช้า
- แต่ถ้า tests มี stateful operations อาจจำเป็น

---

## 4. คำแนะนำการแก้ไข

### 4.1 🔴 High Priority

#### Fix 1: ลบ Hard Delays ทั้งหมด

**ไฟล์ที่ต้องแก้:**
- `pages/login.page.ts` (3 จุด)
- `pages/customer-detail.page.ts` (2 จุด)
- `pages/base.page.ts` (1 จุด)

**วิธีแก้:**
```typescript
// ❌ แบบเดิม
await this.page.waitForTimeout(3000);

// ✅ แบบใหม่ - ใช้ explicit waits
await expect(page).toHaveURL(/.*customer.*/, { timeout: 10000 });
await this.page.waitForSelector('.success-message', { state: 'visible' });
```

#### Fix 2: แก้ Broken Test References

**ไฟล์:** `tests/auth/login.spec.ts`

**แก้โดย:**
1. เพิ่ม missing methods ใน `LoginPage` class
2. หรือแก้ test ให้ใช้ methods ที่มีอยู่

```typescript
// เพิ่มใน login.page.ts
export class LoginPage extends BasePage {
  readonly twoFactorInput: Locator;
  
  constructor(page: Page) {
    super(page);
    this.twoFactorInput = page.locator('input[type="tel"], input[type="number"]').first();
  }
  
  async login(username: string, password: string): Promise<void> {
    await this.goto();
    await this.page.locator('input[type="text"]').first().fill(username);
    await this.page.locator('input[type="password"]').first().fill(password);
    await this.page.locator('button[type="submit"]').first().click();
  }
  
  async enterTwoFactorCode(code: string): Promise<void> {
    await this.twoFactorInput.fill(code);
    await this.page.locator('button').first().click();
  }
  
  async getErrorMessage(): Promise<string | null> {
    const error = this.page.locator('.error-message, .alert-error').first();
    return await error.isVisible() ? await error.textContent() : null;
  }
}
```

#### Fix 3: เพิ่ม State Cleanup

**เพิ่มใน `tests/customer/customer-detail.spec.ts`:**
```typescript
test.describe('Customer Product Configuration', () => {
  let customerPage: CustomerDetailPage;
  let originalConfigs: Map<string, any>;
  
  test.beforeEach(async ({ page }) => {
    customerPage = new CustomerDetailPage(page);
    originalConfigs = new Map();
    await customerPage.gotoCustomer(CUSTOMER_ID);
  });
  
  test.afterEach(async () => {
    // Restore original configurations
    for (const [productName, config] of originalConfigs) {
      await customerPage.configureProduct(productName, config);
    }
  });
});
```

### 4.2 🟡 Medium Priority

#### Fix 4: เพิ่ม JSDoc Documentation

**Template สำหรับทุก class:**
```typescript
/**
 * [Class description]
 * @class [ClassName]
 * @extends [BaseClass]
 * @example
 * const page = new ClassName(browserPage);
 * await page.doSomething();
 */
```

**Template สำหรับทุก method:**
```typescript
/**
 * [Method description]
 * @param {Type} paramName - Description
 * @returns {Promise<Type>} Description
 * @throws {ErrorType} When condition
 * @example
 * await instance.methodName(param);
 */
```

#### Fix 5: สร้าง Utility Functions

**สร้าง `utils/wait-utils.ts`:**
```typescript
/**
 * Wait for API response instead of fixed timeout
 */
export async function waitForApiResponse(page: Page, urlPattern: string | RegExp) {
  return await page.waitForResponse(response => 
    new RegExp(urlPattern).test(response.url()) && response.status() === 200
  );
}

/**
 * Wait for element with polling
 */
export async function waitForElementWithPolling(
  page: Page, 
  selector: string, 
  options: { timeout?: number; interval?: number } = {}
) {
  const { timeout = 10000, interval = 100 } = options;
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const element = await page.$(selector);
    if (element && await element.isVisible()) {
      return element;
    }
    await page.waitForTimeout(interval);
  }
  
  throw new Error(`Element ${selector} not found within ${timeout}ms`);
}
```

#### Fix 6: ใช้ Environment Variables อย่างถูกต้อง

**.env.example:**
```bash
# Required
BASE_URL=https://bo-dev.askmebill.com
USERNAME=your_username
PASSWORD=your_password
TWO_FA_CODE=999999

# Timeouts (milliseconds)
DEFAULT_TIMEOUT=30000
API_TIMEOUT=10000
```

**config/test-config.ts:**
```typescript
export const TEST_CONFIG = {
  timeouts: {
    default: parseInt(process.env.DEFAULT_TIMEOUT || '30000'),
    api: parseInt(process.env.API_TIMEOUT || '10000'),
  },
  credentials: {
    username: process.env.USERNAME || '',
    password: process.env.PASSWORD || '',
    twoFaCode: process.env.TWO_FA_CODE || '',
  }
};

// Validation
if (!TEST_CONFIG.credentials.username) {
  throw new Error('USERNAME environment variable is required');
}
```

---

## 5. Checklist สำหรับทีม Dev

### ✅ Phase 1: Critical Fixes (ทำทันที)

- [ ] แก้ hard delays ใน `pages/login.page.ts` (3 จุด)
  - [ ] บรรทัด 24: หลัง navigate
  - [ ] บรรทัด 36: หลัง 2FA submit
  - [ ] บรรทัด 40: หลัง 2FA complete
  
- [ ] แก้ hard delays ใน `pages/customer-detail.page.ts` (2 จุด)
  - [ ] บรรทัด 95: หลัง save modal
  - [ ] บรรทัด 158: หลัง sync Tiamut

- [ ] แก้ broken test references ใน `tests/auth/login.spec.ts`
  - [ ] เพิ่ม method `login()` ใน LoginPage
  - [ ] เพิ่ม property `twoFactorInput` ใน LoginPage
  - [ ] เพิ่ก method `enterTwoFactorCode()` ใน LoginPage
  - [ ] เพิ่ม method `getErrorMessage()` ใน LoginPage

- [ ] แก้ hard delay ใน `pages/base.page.ts`
  - [ ] บรรทัด 37: ใช้ exponential backoff แทน

### ✅ Phase 2: State Management (ทำภายใน 3 วัน)

- [ ] เพิ่ม `test.afterEach` สำหรับ cleanup ใน `customer-detail.spec.ts`
- [ ] เพิ่ม backup/restore configuration สำหรับ tests ที่ modify data
- [ ] สร้าง `utils/state-manager.ts` สำหรับจัดการ test state
- [ ] แก้ไข conditional `test.skip()` ให้ใช้วิธีที่ถูกต้อง

### ✅ Phase 3: Documentation (ทำภายใน 1 สัปดาห์)

- [ ] เพิ่ม JSDoc ให้ `LoginPage` class
- [ ] เพิ่ม JSDoc ให้ทุก method ใน `LoginPage`
- [ ] เพิ่ม JSDoc ให้ `CustomerDetailPage` class
- [ ] เพิ่ม JSDoc ให้ทุก method ใน `CustomerDetailPage`
- [ ] เพิ่ม JSDoc ให้ test suites ใน `login.spec.ts`
- [ ] เพิ่ม JSDoc ให้ test suites ใน `customer-detail.spec.ts`
- [ ] เพิ่ม inline comments สำหรับ complex logic

### ✅ Phase 4: Code Quality (ทำภายใน 2 สัปดาห์)

- [ ] สร้าง `utils/wait-utils.ts` สำหรับ wait helpers
- [ ] สร้าง `config/test-config.ts` สำหรับ configuration
- [ ] ย้าย hardcoded values ไปที่ constants
- [ ] สร้าง `.env.example` ที่สมบูรณ์
- [ ] เพิ่ม input validation สำหรับ environment variables
- [ ] สร้าง global error handler

### ✅ Phase 5: Testing & Validation (ทำสุดท้าย)

- [ ] รัน tests ทั้งหมดให้ผ่าน
- [ ] ตรวจสอบว่าไม่มี hard delays เหลืออยู่
- [ ] ตรวจสอบว่า tests run parallel ได้
- [ ] ตรวจสอบว่า tests stable (รัน 5 ครั้งติด)
- [ ] สร้าง documentation สำหรับการ run tests

---

## 📊 Metrics Summary

| Metric | Current | Target |
|--------|---------|--------|
| Test Execution Time | ~2-5 min | <1 min |
| Flaky Tests | Unknown | 0% |
| Test Coverage | N/A | >80% |
| Hard Delays | 6 จุด | 0 |
| Missing JSDoc | 15+ | 0 |
| Broken Tests | 1 file | 0 |

---

## 🔗 References

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright Timeouts Guide](https://playwright.dev/docs/test-timeouts)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Test Isolation](https://playwright.dev/docs/test-isolation)

---

**Report Generated:** 2026-03-04  
**Next Review:** 2026-03-18
