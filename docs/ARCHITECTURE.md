# Playwright Test Automation Architecture

## Overview

This project is a professional-grade Playwright test automation framework for the IShef/AskMeBill backoffice application. It follows the Page Object Model (POM) pattern with modern Playwright best practices.

## Project Structure

```
playwright/
├── docs/                          # Documentation
│   └── ARCHITECTURE.md           # This file
│
├── pages/                         # Page Object Models
│   ├── base.page.ts              # Base class with common utilities
│   ├── login.page.ts             # Authentication page
│   └── customer-detail.page.ts   # Customer management page
│
├── tests/                         # Test files
│   ├── auth/                     # Authentication tests
│   ├── billing/                  # Billing feature tests
│   ├── customer/                 # Customer management tests
│   └── product/                  # Product management tests
│
├── fixtures/                      # Test fixtures and data
│
├── config/                        # Configuration files
│
├── utils/                         # Utility functions
│
├── playwright/                    # Playwright runtime files
│   └── .auth/                    # Authentication state storage
│       └── user.json             # Saved login session
│
├── playwright.config.ts          # Main Playwright configuration
├── package.json                  # NPM dependencies
├── tsconfig.json                 # TypeScript configuration
├── .env                          # Environment variables (gitignored)
├── .env.example                  # Environment variable template
└── test-results/                 # Test artifacts (screenshots, videos)
```

## Architecture Principles

### 1. Page Object Model (POM)

Each page in the application has a corresponding Page Object class:

- **Encapsulation**: Page structure and selectors are hidden from tests
- **Reusability**: Common actions are defined once and reused
- **Maintainability**: Changes to UI only require updates in one place

```typescript
// Example: Using Page Object in tests
test('customer can add product', async ({ page }) => {
  const customerPage = new CustomerDetailPage(page);
  await customerPage.gotoCustomer('john_doe');
  await customerPage.addProduct('Thai Lotto');
});
```

### 2. Base Page Pattern

All page objects extend `BasePage` which provides:

- Common navigation methods (`goto`, `waitForPageLoad`)
- Element interaction utilities (`clickWhenVisible`, `fillWithRetry`)
- Table handling (`findTableRow`, `getTableRowCount`)
- State management (`clearState`, `clearAllStorage`)
- API waiting (`waitForApiResponse`, `waitForNetworkIdle`)

### 3. Auto-Waiting Strategy

**No Hard Delays**: The framework avoids `waitForTimeout()` and uses:

- **Element State Waiting**: `waitFor({ state: 'visible' })`
- **Navigation Waiting**: `waitForNavigation({ waitUntil: 'networkidle' })`
- **API Response Waiting**: `waitForResponse()` for async operations
- **Assertion Polling**: `expect.poll()` for dynamic conditions

### 4. Test Isolation

Each test runs in isolation:

- Fresh browser context for each test
- Authentication state can be reused via `storageState`
- State cleanup methods available (`clearState`, `clearAllStorage`)

### 5. Error Handling

Comprehensive error handling with:

- Detailed error messages
- Automatic screenshots on failure
- Graceful handling of optional flows (e.g., 2FA)

## Key Components

### BasePage (`pages/base.page.ts`)

Core functionality for all pages:

| Method | Purpose |
|--------|---------|
| `goto(path)` | Navigate to relative path |
| `waitForPageLoad()` | Wait for network idle |
| `clickWhenVisible(locator)` | Safe click with visibility check |
| `fillWithRetry(locator, value)` | Fill input with verification |
| `handleModal(action)` | Handle confirm/cancel/ok modals |
| `waitForSuccess(message?)` | Wait for success notification |
| `waitForError(message?)` | Wait for error notification |
| `findTableRow(table, text)` | Find row by text content |
| `clearState()` | Clear cookies and storage |
| `clearAllStorage()` | Clear including IndexedDB |
| `waitForApiResponse(pattern)` | Wait for specific API call |

### LoginPage (`pages/login.page.ts`)

Handles authentication flows:

```typescript
// Login with 2FA
await loginPage.loginWith2FA('username', 'password', '2fa-code');

// Save session for reuse
await loginPage.saveAuthState('playwright/.auth/user.json');
```

**Key Features:**
- Auto-detection of 2FA requirement
- Navigation-based waiting (no hard delays)
- Session persistence support

### CustomerDetailPage (`pages/customer-detail.page.ts`)

Manages customer product configuration:

```typescript
// Navigate to customer
await customerPage.gotoCustomer('username');

// Product management
await customerPage.addProduct('Product Name');
await customerPage.configureProduct('Product', { prefix: 'PR', clientName: 'admin' });
await customerPage.deleteProduct('Product Name');

// Search and filter
await customerPage.searchProduct('query');
const products = await customerPage.getAllProducts();
```

**Key Features:**
- API response waiting for async operations
- Table row operations
- Configuration management
- Error modal handling

## Configuration

### Playwright Config (`playwright.config.ts`)

| Setting | Value | Description |
|---------|-------|-------------|
| `fullyParallel` | `true` | Run tests in parallel |
| `workers` | `CI ? 1 : undefined` | Sequential in CI, parallel locally |
| `retries` | `CI ? 2 : 0` | Retry flaky tests in CI |
| `screenshot` | `only-on-failure` | Capture on failure |
| `video` | `on-first-retry` | Record video on retry |
| `trace` | `on-first-retry` | Record trace on retry |

### Environment Variables (`.env`)

```bash
# Required
BASE_URL=https://bo-dev.askmebill.com
USERNAME=admin_user
PASSWORD=secure_password

# Optional
CI=true  # Enable CI-specific settings
```

## Test Execution

### Run All Tests

```bash
npx playwright test
```

### Run Specific Test File

```bash
npx playwright test tests/customer/customer.spec.ts
```

### Run with Specific Browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
```

### Debug Mode

```bash
npx playwright test --debug
```

### View Report

```bash
npx playwright show-report
```

## CI/CD Integration

The configuration is optimized for CI/CD environments:

1. **Workers**: Set to 1 in CI for sequential execution
2. **Retries**: 2 retries for flaky test resilience
3. **Headless**: Automatic headless mode in CI
4. **Artifacts**: Screenshots, videos, and traces on failure
5. **JSON Report**: Machine-readable for CI integration

### GitHub Actions Example

```yaml
- name: Run Playwright tests
  run: npx playwright test
  env:
    CI: true
    BASE_URL: ${{ secrets.BASE_URL }}
    USERNAME: ${{ secrets.USERNAME }}
    PASSWORD: ${{ secrets.PASSWORD }}

- name: Upload test results
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: test-results
    path: test-results/
```

## Best Practices

### 1. Writing Tests

```typescript
import { test, expect } from '@playwright/test';
import { CustomerDetailPage } from '../pages/customer-detail.page';

test('should add product to customer', async ({ page }) => {
  // Arrange
  const customerPage = new CustomerDetailPage(page);
  
  // Act
  await customerPage.gotoCustomer('test_user');
  await customerPage.addProduct('Thai Lotto');
  
  // Assert
  const hasProduct = await customerPage.hasProduct('Thai Lotto');
  expect(hasProduct).toBe(true);
});
```

### 2. Adding New Pages

1. Create new file in `pages/` directory
2. Extend `BasePage`
3. Define locators as readonly properties
4. Implement page-specific methods
5. Add JSDoc comments for all public methods

### 3. Selector Strategy

- Prefer user-facing attributes: `data-testid`, `aria-label`
- Use text content for buttons: `button:has-text("Submit")`
- Fallback to CSS selectors with clear naming
- Avoid brittle selectors (auto-generated classes)

### 4. Handling Async Operations

```typescript
// ✅ Good: Wait for API response
await Promise.all([
  page.waitForResponse(response => response.url().includes('/api/save')),
  saveButton.click()
]);

// ❌ Bad: Hard delay
await page.waitForTimeout(2000);
```

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Flaky tests | Increase timeouts, add retries, check for race conditions |
| Login failures | Verify credentials, check 2FA flow, view screenshots |
| Element not found | Check selector, add waitFor, verify page state |
| API timeouts | Increase waitForResponse timeout, check API health |

### Debug Tools

1. **Traces**: Review `test-results/` for detailed execution logs
2. **Screenshots**: Automatic on failure, located in `test-results/screenshots/`
3. **Videos**: Recorded on retry, viewable in HTML report
4. **Playwright Inspector**: Run with `--debug` flag

## Contributing

1. Follow existing code patterns
2. Add JSDoc comments for all public methods
3. Use auto-waiting instead of hard delays
4. Update this documentation for architectural changes
5. Run tests locally before committing

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Page Object Model Guide](https://playwright.dev/docs/pom)
- [Best Practices](https://playwright.dev/docs/best-practices)
