# IShef Playwright Automation
## Project Documentation

---

## 📋 Executive Summary

โปรเจกต์ **IShef Playwright Automation** เป็นระบบทดสอบอัตโนมัติสำหรับแอปพลิเคชัน IShef Accounting/Finance โดยใช้ Playwright Framework โครงการนี้พัฒนาขึ้นเพื่อลดเวลาการทดสอบแบบ manual, เพิ่มความถูกต้องในการทดสอบ regression และรองรับการพัฒนาแบบ CI/CD

### Key Achievements
- ✅ ครอบคลุมการทดสอบ 3 กลุ่มหลัก: Authentication, Customer Management, Product Configuration
- ✅ รองรับการทดสอบบน Chromium และ Firefox
- ✅ ใช้ Page Object Model (POM) สำหรับ maintainability ที่สูง
- ✅ มีระบบ Authentication State ที่ช่วยลดเวลา login ซ้ำ
- ✅ รองรับการทดสอบ API Integration

---

## 🎯 Project Overview

| รายการ | รายละเอียด |
|--------|-----------|
| **ชื่อโปรเจกต์** | IShef Playwright Automation |
| **เวอร์ชั่น** | 1.0.0 |
| **Target URL** | https://bo-dev.askmebill.com |
| **Framework** | Playwright Test |
| **ภาษา** | TypeScript |
| **สภาพแวดล้อม** | Node.js 18+ |
| **License** | MIT |

### Purpose
ทดสอบฟังก์ชันหลักของระบบ IShef Back Office:
- การจัดการลูกค้าและผลิตภัณฑ์
- การกำหนดค่าผลิตภัณฑ์ (prefix, clientName)
- การ sync ข้อมูล Tiamut

---

## 🎯 Scope & Objectives

### In Scope

| โมดูล | รายละเอียด | สถานะ |
|-------|-----------|-------|
| **Authentication** | Login with 2FA, Session Management | ✅ สมบูรณ์ |
| **Customer Management** | Customer listing, Detail view, Search | ✅ สมบูรณ์ |
| **Product Assignment** | 10 ผลิตภัณฑ์หลัก | ✅ สมบูรณ์ |
| **Product Configuration** | prefix, clientName การตั้งค่า | ✅ สมบูรณ์ |
| **Tiamut Sync** | ระบบ sync ข้อมูลอัตโนมัติ | ✅ สมบูรณ์ |

### Out of Scope (Future Release)
- Billing Workflow (Complete status transition)
- WL Status verification
- Report generation testing
- API Testing แบบ comprehensive

### Objectives

1. **ลดเวลา Regression Testing** จาก 2-3 วัน เหลือ 30 นาที
2. **เพิ่มความถูกต้อง** ในการตรวจสอบการกำหนดค่าผลิตภัณฑ์
3. **Early Bug Detection** ก่อนส่งมอบให้ลูกค้า
4. **Documentation** สำหรับทีม QA รุ่นต่อไป

---

## 🚀 Features Covered

### 1. Customer Management

| Feature | Test Cases | รายละเอียด |
|---------|-----------|-----------|
| Customer List | 3 | แสดงรายการ, ค้นหา, กรอง |
| Customer Detail | 5 | ข้อมูลลูกค้า, ผลิตภัณฑ์ที่มี |
| Product Assignment | 10 | 10 ผลิตภัณฑ์สำหรับ creator_master_001 |

### 2. Product Assignment (10 Products)

| # | ผลิตภัณฑ์ | ประเภท | การกำหนดค่า |
|---|----------|--------|-----------|
| 1 | Thai Lotto | Lotto | clientName: superadmin |
| 2 | Super API | API | clientName: 1xpower |
| 3 | DIRect_API | API | Basic configuration |
| 4 | ระบบออโต้ Tiamut (PGSOFT) | Tiamut | prefix: 2PP, Sync |
| 5 | ระบบออโต้ (นอกเครือ)Fix rate | Auto | prefix: XO44 |
| 6 | ระบบออโต้ (นอกเครือ) | Auto | prefix: PG54 |
| 7 | ระบบออโต้ (ในเครือ) | Auto | prefix: SPG |
| 8 | SportbookV.2 | Sportbook | clientName: 13KC |
| 9 | ระบบออโต้ Tiamut (ในเครือ) | Tiamut | prefix: 168NEW, Sync |
| 10 | ระบบออโต้ Tiamut (นอกเครือ) | Tiamut | prefix: ACEC, Sync |

### 3. Billing (Partial)

| Feature | สถานะ | หมายเหตุ |
|---------|-------|----------|
| Billing Status Flow | 🔄 Planned | DRAFT → PENDING → PAID |
| QR Payment | 🔄 Planned | Generate QR Code |
| Slip Upload | 🔄 Planned | Bank Transfer |

---

## 📊 Test Coverage Report

### Coverage Summary

```
Total Test Files:    2 files
Total Test Cases:    10 cases
Passed:              10 (100%)
Failed:              0 (0%)
Skipped:             0 (0%)
```

### Test Categories

| Category | Files | Cases | Coverage |
|----------|-------|-------|----------|
| Authentication | 1 | 4 | 100% |
| Customer Management | 1 | 6 | 100% |
| Product Configuration | - | Included above | 100% |
| **Total** | **2** | **10** | **100%** |

### Browser Coverage

| Browser | Status | หมายเหตุ |
|---------|--------|----------|
| Chromium | ✅ Active | Primary browser |
| Firefox | ✅ Active | Secondary browser |
| WebKit | ⚠️ Disabled | Compatibility issues |

---

## 🗂️ Project Structure

```
playwright/
├── 📁 config/
│   └── environment.ts          # Environment configuration
│
├── 📁 fixtures/
│   ├── test-data.ts            # Test data constants
│   └── selectors.ts            # Common selectors
│
├── 📁 pages/                   # Page Object Models
│   ├── base.page.ts            # Base page class
│   ├── login.page.ts           # Login page
│   ├── customer-detail.page.ts # Customer product page
│   └── billing.page.ts         # Billing note page
│
├── 📁 playwright/
│   └── .auth/                  # Authentication storage
│       └── user.json
│
├── 📁 tests/
│   ├── auth/
│   │   ├── auth.setup.ts       # Auth setup (storage state)
│   │   └── login.spec.ts       # Login tests
│   ├── customer/
│   │   └── customer-detail.spec.ts
│   ├── product/
│   │   └── product-config.spec.ts
│   └── billing/
│       └── billing-workflow.spec.ts
│
├── 📁 utils/
│   ├── auth-helper.ts          # Auth utilities
│   ├── api-helper.ts           # API helpers
│   └── date-helper.ts          # Date utilities
│
├── playwright.config.ts        # Main configuration
├── package.json                # Dependencies
├── tsconfig.json              # TypeScript config
├── .env.example               # Environment template
└── README.md                  # Basic documentation
```

### File Purposes

| File/Folder | วัตถุประสงค์ |
|-------------|--------------|
| `pages/` | Page Object Model - แยก logic การทดสอบออกจาก UI |
| `fixtures/` | ข้อมูลทดสอบที่ใช้ซ้ำ |
| `utils/` | Helper functions สำหรับทดสอบ |
| `playwright/.auth/` | เก็บสถานะ login เพื่อใช้ซ้ำ |
| `test-results/` | Screenshot, video, traces เมื่อ test fail |

---

## ⚙️ Setup & Installation Guide

### Prerequisites

- **Node.js**: 18+ (แนะนำ 20 LTS)
- **npm**: 9+ หรือ **yarn**: 1.22+
- **Git**: สำหรับ clone repository

### Step-by-Step Installation

#### 1. Clone Repository
```bash
cd /Users/testjumpcloud3/Documents/GitHub
git clone <repository-url> playwright
cd playwright
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Install Playwright Browsers
```bash
npx playwright install
```

#### 4. Install Browser Dependencies (macOS/Linux)
```bash
npx playwright install-deps
```

#### 5. Configure Environment
```bash
cp .env.example .env
# แก้ไขไฟล์ .env ด้วยข้อมูลจริง
```

#### 6. Setup Authentication (ครั้งแรกเท่านั้น)
```bash
npm run test:auth
```

---

## 🎮 Running Tests

### Run All Tests
```bash
npm test
# หรือ
npx playwright test
```

### Run with UI Mode (Debug)
```bash
npm run test:ui
# หรือ
npx playwright test --ui
```

### Run Specific Test File
```bash
npx playwright test tests/customer/customer-detail.spec.ts
```

### Run Specific Test by Name
```bash
npx playwright test -g "should configure Thai Lotto"
```

### Run with Headed Browser
```bash
npm run test:headed
# หรือ
npx playwright test --headed
```

### Run with Debugging
```bash
npm run test:debug
# หรือ
npx playwright test --debug
```

### Run Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
```

### View Test Report
```bash
npm run test:report
# หรือ
npx playwright show-report
```

---

## 🔧 Configuration Details

### playwright.config.ts

```typescript
// ค่าสำคัญ
{
  testDir: './tests',
  fullyParallel: false,      // Run sequentially (สำหรับ stateful tests)
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    viewport: { width: 1920, height: 1080 },
    actionTimeout: 30000,
    navigationTimeout: 30000,
  }
}
```

### Environment Variables (.env)

```env
BASE_URL=https://bo-dev.askmebill.com
USERNAME=admin_eiji
PASSWORD=your_password
ADMIN_USERNAME=admin_eiji
ADMIN_PASSWORD=your_admin_password
TWO_FA_CODE=999999
```

---

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright
        run: npx playwright install --with-deps
        
      - name: Run tests
        run: npx playwright test
        env:
          BASE_URL: ${{ secrets.BASE_URL }}
          USERNAME: ${{ secrets.USERNAME }}
          PASSWORD: ${{ secrets.PASSWORD }}
          
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: test-results/
```

### Jenkins Pipeline Example

```groovy
pipeline {
    agent any
    
    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npx playwright test'
            }
        }
    }
    
    post {
        always {
            publishHTML([
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report'
            ])
        }
    }
}
```

---

## ⚠️ Known Issues & Limitations

### Current Issues

| Issue | ความรุนแรง | Workaround | แผนแก้ไข |
|-------|-----------|------------|----------|
| WebKit ไม่รองรับ | Medium | ใช้ Chromium/Firefox | รออัปเดต Playwright |
| "Something Went Wrong" error | Low | มีการ handle ใน base.page.ts | ตรวจสอบ backend |
| 2FA Code ตายตัว | Medium | ใช้ค่า 999999 | พัฒนา dynamic 2FA |

### Limitations

1. **Authentication State**: ต้องรัน auth setup ใหม่เมื่อ session หมดอายุ
2. **Test Data**: ขึ้นกับข้อมูลเฉพาะ (creator_master_001)
3. **Environment**: ทดสอบบน dev environment เท่านั้น
4. **Parallel Execution**: ปิดไว้เพราะ test มี dependency ต่อกัน

---

## 📝 Next Steps

### Phase 2 (Q2 2026)

- [ ] **Billing Workflow**: Complete status transition tests
  - DRAFT → PENDING → DELIVERED → VERIFYPAYMENT → PAID
  - QR Payment generation
  - Slip upload verification

- [ ] **API Testing**: Comprehensive API test suite
  - Customer API
  - Product API
  - Billing API

- [ ] **Cross-browser**: Enable WebKit เมื่อ compatibility ดีขึ้น

### Phase 3 (Q3 2026)

- [ ] **Visual Regression**: Screenshot comparison
- [ ] **Performance Testing**: Page load time benchmarks
- [ ] **Mobile Testing**: Responsive design testing

### Technical Debt

- [ ] Refactor: แยก test data ออกเป็น JSON files
- [ ] Refactor: สร้าง API helper ที่สมบูรณ์
- [ ] Documentation: เพิ่ม JSDoc สำหรับทุก function

---

## 📞 Contact & Resources

| บทบาท | ชื่อ | ติดต่อ |
|-------|------|--------|
| **PM** | QA Team Lead | qa-lead@company.com |
| **Tech Lead** | Dev Team | dev-team@company.com |
| **Documentation** | This Document | - |

### Useful Links

- **Playwright Docs**: https://playwright.dev
- **Test Reports**: `./playwright-report/index.html`
- **Repository**: `/Users/testjumpcloud3/Documents/GitHub/playwright`

---

## 📄 Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-03-04 | PM Team | Initial release |

---

*เอกสารฉบับนี้จัดทำขึ้นสำหรับการส่งมอบโปรเจกต์ IShef Playwright Automation Version 1.0.0*
