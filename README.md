# IShef Playwright Automation

Playwright automation project for IShef Accounting/Finance web application (https://bo-dev.askmebill.com/)

## Project Structure

```
playwright/
├── tests/
│   ├── auth/
│   │   └── login.spec.ts          # Authentication tests
│   ├── customer/
│   │   ├── customer-list.spec.ts  # Customer listing tests
│   │   └── customer-detail.spec.ts # Customer product management
│   ├── product/
│   │   └── product-config.spec.ts # Product configuration tests
│   └── billing/
│       └── billing-workflow.spec.ts # Billing status transitions
├── pages/
│   ├── base.page.ts               # Base page class
│   ├── login.page.ts              # Login page
│   ├── customer-list.page.ts      # Customer list page
│   ├── customer-detail.page.ts    # Customer detail/product page
│   ├── product-list.page.ts       # Product list page
│   └── billing.page.ts            # Billing note page
├── fixtures/
│   ├── test-data.ts               # Test data
│   └── selectors.ts               # Common selectors
├── utils/
│   ├── auth-helper.ts             # Authentication utilities
│   ├── api-helper.ts              # API helpers
│   └── date-helper.ts             # Date utilities
├── config/
│   └── environment.ts             # Environment configuration
├── playwright.config.ts           # Playwright configuration
└── README.md
```

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

```bash
# Initialize Playwright
npm init playwright@latest

# Install additional dependencies
npm install @playwright/test dotenv
```

## Configuration

Create `.env` file:
```env
BASE_URL=https://bo-dev.askmebill.com
USERNAME=admin_eiji
PASSWORD=0897421942@Earth
ADMIN_USERNAME=admin_eiji
ADMIN_PASSWORD=your_admin_password
```

## Running Tests

```bash
# Run all tests
npx playwright test

# Run with UI mode
npx playwright test --ui

# Run specific test file
npx playwright test tests/customer/customer-detail.spec.ts

# Run with headed browser
npx playwright test --headed

# Run with specific project (chromium/firefox/webkit)
npx playwright test --project=chromium
```

## Key Features

1. **Page Object Model**: Organized page classes for maintainability
2. **Authentication State**: Reuse login state across tests
3. **API Helpers**: Direct API calls for setup/teardown
4. **Test Data**: Centralized test data management
5. **Screenshots**: Automatic screenshots on failure

## Critical Workflows Covered

- ✅ Login with 2FA
- ✅ Customer creation and management
- ✅ Product assignment (all 10 target products)
- ✅ Product configuration (prefix/clientName)
- ✅ Billing status transitions (DRAFT → PENDING → PAID)
- ✅ WL status confirmation
