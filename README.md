# 🎭 IShef Playwright Automation

<p align="center">
  <a href="https://playwright.dev">
    <img src="https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright">
  </a>
  <a href="https://www.typescriptlang.org">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  </a>
  <a href="https://nodejs.org">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/tests-10%20passed-brightgreen" alt="Tests">
  <img src="https://img.shields.io/badge/coverage-100%25-brightgreen" alt="Coverage">
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-yellow" alt="License">
</p>

---

## 📋 Table of Contents

- [🚀 Quick Start](#-quick-start)
- [📖 Documentation](#-documentation)
- [✨ Features](#-features)
- [🗂️ Project Structure](#️-project-structure)
- [🎮 Running Tests](#-running-tests)
- [🔧 Configuration](#-configuration)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+ หรือ yarn 1.22+

### Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd playwright

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install

# 4. Setup environment
cp .env.example .env
# แก้ไข .env ด้วย credentials จริง

# 5. Setup authentication (ครั้งแรกเท่านั้น)
npm run test:auth

# 6. Run tests!
npm test
```

---

## 📖 Documentation

| เอกสาร | รายละเอียด |
|--------|-----------|
| 📘 **[Project Documentation](./PROJECT_DOCUMENTATION.md)** | เอกสารหลักสำหรับส่งหัวหน้า |
| 📗 **[Handover Guide](./HANDOVER_GUIDE.md)** | คู่มือสำหรับทีมรับต่อ |
| 📙 **[Quick Start](./QUICKSTART.md)** | เริ่มต้นใช้งานอย่างรวดเร็ว |
| 📕 **[Changelog](./CHANGELOG.md)** | บันทึกการเปลี่ยนแปลง |
| 📑 **[Docs Index](./docs/INDEX.md)** | สารบัญเอกสารทั้งหมด |

---

## ✨ Features

### ✅ ครอบคลุมการทดสอบ

| โมดูล | รายละเอียด | สถานะ |
|-------|-----------|-------|
| 🔐 **Authentication** | Login with 2FA, Session Management | ✅ สมบูรณ์ |
| 👥 **Customer Management** | Customer listing, Detail view | ✅ สมบูรณ์ |
| 📦 **Product Assignment** | 10 ผลิตภัณฑ์หลัก | ✅ สมบูรณ์ |
| ⚙️ **Product Configuration** | prefix, clientName การตั้งค่า | ✅ สมบูรณ์ |
| 🔄 **Tiamut Sync** | ระบบ sync ข้อมูลอัตโนมัติ | ✅ สมบูรณ์ |

### 🎯 10 ผลิตภัณฑ์ที่ทดสอบ

1. ✅ Thai Lotto - Lotto system
2. ✅ Super API - API integration
3. ✅ DIRect_API - Test API
4. ✅ ระบบออโต้ Tiamut (PGSOFT) - Auto sync
5. ✅ ระบบออโต้ (นอกเครือ)Fix rate - Fixed rate
6. ✅ ระบบออโต้ (นอกเครือ) - External auto
7. ✅ ระบบออโต้ (ในเครือ) - Internal auto
8. ✅ SportbookV.2 - Sports betting
9. ✅ ระบบออโต้ Tiamut (ในเครือ) - Internal Tiamut
10. ✅ ระบบออโต้ Tiamut (นอกเครือ) - External Tiamut

---

## 🗂️ Project Structure

```
playwright/
├── 📁 config/              # Environment configuration
├── 📁 fixtures/            # Test data & selectors
├── 📁 pages/               # Page Object Models
│   ├── base.page.ts        # Base page class
│   ├── login.page.ts       # Login page
│   ├── customer-detail.page.ts
│   └── billing.page.ts
├── 📁 playwright/
│   └── .auth/              # Authentication storage
├── 📁 tests/
│   ├── auth/               # Authentication tests
│   ├── customer/           # Customer management
│   ├── product/            # Product configuration
│   └── billing/            # Billing workflow
├── 📁 utils/               # Helper utilities
├── playwright.config.ts    # Main configuration
└── package.json
```

---

## 🎮 Running Tests

### Run All Tests
```bash
npm test
```

### Run with UI Mode (Debug)
```bash
npm run test:ui
```

### Run Specific Test
```bash
# ตามไฟล์
npx playwright test tests/customer/customer-detail.spec.ts

# ตามชื่อ
npx playwright test -g "configure Thai Lotto"
```

### Run with Headed Browser
```bash
npm run test:headed
```

### View Report
```bash
npm run test:report
```

### Available Scripts

| Script | คำสั่ง | รายละเอียด |
|--------|--------|-----------|
| `test` | `playwright test` | รัน tests ทั้งหมด |
| `test:ui` | `playwright test --ui` | UI mode |
| `test:headed` | `playwright test --headed` | เห็น browser |
| `test:debug` | `playwright test --debug` | Debug mode |
| `test:report` | `playwright show-report` | ดู report |
| `test:auth` | `playwright test tests/auth/auth.setup.ts` | Setup auth |

---

## 🔧 Configuration

### Environment Variables (.env)

```env
BASE_URL=https://bo-dev.askmebill.com
USERNAME=admin_eiji
PASSWORD=your_password
ADMIN_USERNAME=admin_eiji
ADMIN_PASSWORD=your_admin_password
TWO_FA_CODE=999999
```

### Browsers Supported

| Browser | Status |
|---------|--------|
| Chromium | ✅ Active |
| Firefox | ✅ Active |
| WebKit | ⚠️ Disabled |

### Key Configurations

```typescript
// playwright.config.ts
{
  fullyParallel: false,      // Sequential execution
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    viewport: { width: 1920, height: 1080 },
  }
}
```

---

## 🤝 Contributing

1. Fork repository
2. สร้าง feature branch (`git checkout -b feature/amazing-feature`)
3. Commit การเปลี่ยนแปลง (`git commit -m 'Add amazing feature'`)
4. Push ไปยัง branch (`git push origin feature/amazing-feature`)
5. สร้าง Pull Request

### Coding Standards

- ใช้ TypeScript ทั้งหมด
- ปฏิบัติตาม Page Object Model
- เขียน test ที่อ่านง่ายและ maintain ได้
- เพิ่ม comments สำหรับ logic ที่ซับซ้อน

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Playwright](https://playwright.dev) - สำหรับ automation framework ที่ยอดเยี่ยม
- [Microsoft](https://www.microsoft.com) - สำหรับการพัฒนาและดูแล Playwright

---

<p align="center">
  สร้างด้วย ❤️ โดย QA Team
</p>
