# 🚀 Quick Start Guide

## 1. Initial Setup

```bash
cd /Users/testjumpcloud3/Documents/GitHub/playwright

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Install browser dependencies (macOS/Linux only)
npx playwright install-deps
```

## 2. Configuration

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your credentials
nano .env  # or use your preferred editor
```

Your `.env` should look like:
```env
BASE_URL=https://bo-dev.askmebill.com
USERNAME=admin_eiji
PASSWORD=0897421942@Earth
TWO_FA_CODE=999999
```

## 3. First Run

```bash
# Run authentication setup (saves login state)
npm run test:auth

# Run all tests
npm test

# Run with UI mode (for debugging)
npm run test:ui
```

## 4. Project Structure

```
playwright/
├── tests/
│   ├── auth/           # Login/authentication tests
│   ├── customer/       # Customer management tests
│   ├── product/        # Product configuration tests
│   └── billing/        # Billing workflow tests
├── pages/              # Page Object Models
│   ├── base.page.ts
│   ├── login.page.ts
│   └── customer-detail.page.ts
├── fixtures/           # Test data
├── utils/              # Helper utilities
└── playwright.config.ts
```

## 5. Writing Tests

Example test:
```typescript
import { test, expect } from '@playwright/test';
import { CustomerDetailPage } from '../pages/customer-detail.page';

test('configure Thai Lotto', async ({ page }) => {
  const customerPage = new CustomerDetailPage(page);
  await customerPage.gotoCustomer('creator_master_001');
  await customerPage.configureProduct('Thai Lotto', {
    clientName: 'superadmin'
  });
});
```

## 6. Running Specific Tests

```bash
# Run specific test file
npx playwright test tests/customer/customer-detail.spec.ts

# Run specific test by name
npx playwright test -g "configure Thai Lotto"

# Run with headed browser (see browser)
npx playwright test --headed

# Run with debugging
npx playwright test --debug
```

## 7. Viewing Results

```bash
# Open HTML report
npm run test:report

# View screenshots/videos
cd test-results/
ls -la
```

## ⚠️ Important Notes

1. **Authentication**: First run requires `npm run test:auth` to save login state
2. **Error Handling**: Tests include retry logic for unstable elements
3. **Screenshots**: Auto-captured on failure in `test-results/`
4. **Videos**: Recorded on first retry

## 🔧 Troubleshooting

### Browser not found
```bash
npx playwright install chromium
```

### Tests failing due to timeouts
Increase timeout in `playwright.config.ts`:
```typescript
timeout: 60000, // 60 seconds
```

### Authentication expired
```bash
# Re-run auth setup
npm run test:auth
```

### "Something Went Wrong" errors
These are backend errors - tests include `waitForErrorToClear()` to handle them.
