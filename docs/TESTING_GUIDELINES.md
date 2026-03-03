# Testing Guidelines & Best Practices

## Table of Contents
1. [Getting Started](#getting-started)
2. [Page Object Model](#page-object-model)
3. [Writing Good Tests](#writing-good-tests)
4. [Handling Flaky Tests](#handling-flaky-tests)
5. [Test Data Management](#test-data-management)
6. [Debugging Tips](#debugging-tips)
7. [CI/CD Integration](#cicd-integration)

---

## Getting Started

### Prerequisites
```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Copy environment variables
cp .env.example .env
# Edit .env with your credentials
```

### Running Tests
```bash
# Run all tests
npx playwright test

# Run with UI mode (recommended for development)
npx playwright test --ui

# Run specific test file
npx playwright test tests/customer/customer-detail.spec.ts

# Run with headed browser (see the browser)
npx playwright test --headed

# Run specific project
npx playwright test --project=chromium

# Run with retry
npx playwright test --retries=2

# Run in debug mode
npx playwright test --debug
```

---

## Page Object Model

### Why POM?

```
Without POM:                    With POM:
─────────────                   ─────────
page.locator('#user').fill()    loginPage.enterUsername()
page.locator('#pass').fill()    loginPage.enterPassword()
page.click('#submit')           loginPage.clickSubmit()
                                
Problems:                       Benefits:
- Duplicated selectors          - Reusable components
- Hard to maintain              - Single source of truth
- Brittle tests                 - Readable tests
```

### Base Page Pattern

```typescript
// pages/base.page.ts
import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = process.env.BASE_URL || 'https://bo-dev.askmebill.com';
  }

  // Common navigation
  async goto(path: string): Promise<void> {
    await this.page.goto(`${this.baseUrl}${path}`);
  }

  // Wait for page load
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  // Safe click with visibility check
  async clickWhenVisible(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }
}
```

### Page Object Example

```typescript
// pages/login.page.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  // Selectors
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    
    // Define selectors in constructor
    this.usernameInput = page.locator('input[type="text"]').first();
    this.passwordInput = page.locator('input[type="password"]').first();
    this.submitButton = page.locator('button[type="submit"]').first();
    this.errorMessage = page.locator('.error-message, .ant-form-item-explain');
  }

  // Actions
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  // Verification
  async getErrorMessage(): Promise<string | null> {
    if (await this.errorMessage.isVisible().catch(() => false)) {
      return await this.errorMessage.textContent();
    }
    return null;
  }
}
```

### Using Page Objects in Tests

```typescript
// tests/auth/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';

test.describe('Authentication', () => {
  test('should login with valid credentials', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    
    // Act
    await loginPage.goto();
    await loginPage.login('admin_eiji', 'password123');
    
    // Assert
    await expect(page).toHaveURL(/.*customer.*/);
  });
});
```

### Best Practices for POM

✅ **DO:**
- Keep selectors in page objects only
- Use meaningful method names (verbs)
- Return promises for async operations
- Handle waits within page objects
- Group related actions into methods

❌ **DON'T:**
- Expose raw locators to tests
- Put assertions in page objects
- Use hardcoded timeouts
- Mix business logic with UI logic

---

## Writing Good Tests

### Test Structure (AAA Pattern)

```typescript
test('should configure Thai Lotto product', async ({ page }) => {
  // Arrange - Setup
  const customerPage = new CustomerDetailPage(page);
  await customerPage.gotoCustomer('creator_master_001');
  
  // Act - Execute
  await customerPage.configureProduct('Thai Lotto', {
    clientName: 'superadmin'
  });
  
  // Assert - Verify
  const config = await customerPage.getProductConfig('Thai Lotto');
  expect(config?.clientName).toBe('superadmin');
});
```

### Test Naming

```typescript
// ❌ Bad
-test('test1', async () => { });
-test('login works', async () => { });

// ✅ Good
-test('should login with valid credentials', async () => { });
-test('should display error for invalid password', async () => { });
-test('should redirect to dashboard after successful 2FA', async () => { });
```

### Test Independence

```typescript
// ❌ Bad - Tests depend on each other
test('create customer', async () => { /* creates customer */ });
test('edit customer', async () => { /* assumes customer exists */ });

// ✅ Good - Each test is independent
test('should create new customer', async ({ page }) => {
  await createCustomer(page, uniqueData);
  // verify
});

test('should edit existing customer', async ({ page }) => {
  const customerId = await createCustomer(page, uniqueData);
  await editCustomer(page, customerId);
  // verify
});
```

### Using test.beforeEach

```typescript
test.describe('Customer Product Configuration', () => {
  let customerPage: CustomerDetailPage;
  const CUSTOMER_ID = 'creator_master_001';

  test.beforeEach(async ({ page }) => {
    customerPage = new CustomerDetailPage(page);
    await customerPage.gotoCustomer(CUSTOMER_ID);
    
    // Handle any error modals
    await customerPage.waitForErrorToClear().catch(() => {});
  });

  test('should have Thai Lotto product', async () => {
    // Page is already navigated
    const hasProduct = await customerPage.hasProduct('Thai Lotto');
    expect(hasProduct).toBe(true);
  });
});
```

### Conditional Test Skipping

```typescript
test('should configure product', async () => {
  // Skip if product doesn't exist
  test.skip(!(await customerPage.hasProduct('Thai Lotto')), 
    'Thai Lotto not found');
  
  // Test continues only if product exists
  await customerPage.configureProduct('Thai Lotto', config);
});
```

---

## Handling Flaky Tests

### Common Causes of Flakiness

| Cause | Solution |
|-------|----------|
| Timing issues | Use explicit waits |
| Dynamic content | Wait for network idle |
| Race conditions | Sequential execution |
| Test data conflicts | Use unique data per test |
| Element not ready | Wait for visibility |
| Network latency | Increase timeouts |

### Retry Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Global timeout
  timeout: 30000,
  
  // Action timeout
  use: {
    actionTimeout: 30000,
    navigationTimeout: 30000,
  }
});
```

### Explicit Waits

```typescript
// ❌ Bad - Fixed wait
await page.waitForTimeout(3000);

// ✅ Good - Wait for condition
await page.waitForLoadState('networkidle');
await page.locator('.loading').waitFor({ state: 'hidden' });
await expect(page.locator('.success')).toBeVisible();
```

### Custom Wait Helpers

```typescript
// pages/base.page.ts
async function waitForElementToBeReady(
  locator: Locator, 
  timeout = 10000
): Promise<void> {
  await locator.waitFor({ state: 'visible', timeout });
  await locator.waitFor({ state: 'enabled', timeout });
}

async function waitForNetworkIdle(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
}
```

### Retry Logic in Page Objects

```typescript
async fillWithRetry(
  locator: Locator, 
  value: string, 
  retries = 3
): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      await locator.clear();
      await locator.fill(value);
      const actualValue = await locator.inputValue();
      if (actualValue === value) return;
    } catch (e) {
      if (i === retries - 1) throw e;
      await this.page.waitForTimeout(500);
    }
  }
}
```

### Handling "Something Went Wrong" Error

```typescript
async waitForErrorToClear(): Promise<void> {
  const errorModal = this.page.locator('.modal:has-text("Something Went Wrong")');
  if (await this.elementExists(errorModal)) {
    const okButton = errorModal.locator('button:has-text("OK")');
    await okButton.click();
    await errorModal.waitFor({ state: 'hidden' });
  }
}
```

### Parallel vs Sequential

```typescript
// playwright.config.ts
export default defineConfig({
  // ❌ Can cause flakiness with shared state
  fullyParallel: true,
  
  // ✅ Safer for stateful tests
  fullyParallel: false,
  
  // Workers configuration
  workers: process.env.CI ? 1 : undefined,
});
```

---

## Test Data Management

### Using Fixtures

```typescript
// fixtures/test-data.ts
export const CUSTOMERS = {
  creator_master_001: {
    username: 'creator_master_001',
    products: [
      { name: 'Thai Lotto', clientName: 'superadmin' },
      { name: 'Super API', clientName: '1xpower' }
    ]
  }
};

export const INVALID_DATA = {
  emptyUsername: '',
  longUsername: 'a'.repeat(100),
  specialChars: '!@#$%^&*()',
  sqlInjection: "'; DROP TABLE users; --"
};
```

### Unique Test Data

```typescript
import { faker } from '@faker-js/faker';

function generateUniqueCustomer() {
  return {
    username: `test_${faker.string.alphanumeric(8)}`,
    email: faker.internet.email(),
    phone: faker.phone.number()
  };
}

test('should create customer', async ({ page }) => {
  const customer = generateUniqueCustomer();
  await createCustomer(page, customer);
});
```

### Environment-Specific Data

```typescript
const TEST_DATA = {
  development: {
    customer: 'creator_master_001',
    admin: 'admin_eiji'
  },
  staging: {
    customer: 'staging_customer_001',
    admin: 'staging_admin'
  }
};

const env = process.env.NODE_ENV || 'development';
const data = TEST_DATA[env];
```

---

## Debugging Tips

### Using Trace Viewer

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Collect trace on first retry
    trace: 'on-first-retry',
    
    // Or always
    trace: 'on',
  }
});
```

View traces:
```bash
npx playwright show-trace test-results/trace.zip
```

### Screenshots on Failure

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    screenshot: 'only-on-failure',
  }
});

// Or manual
await page.screenshot({ path: `debug-${Date.now()}.png` });
```

### Console Logging

```typescript
test('debug test', async ({ page }) => {
  // Listen to console
  page.on('console', msg => console.log(msg.text()));
  
  // Listen to errors
  page.on('pageerror', error => console.error(error.message));
  
  // Listen to requests
  page.on('request', request => console.log(request.url()));
});
```

### Using Playwright Inspector

```bash
# Run with debugger
npx playwright test --debug

# Step-by-step debugging
npx playwright test --headed --debug
```

### Debug Helper Methods

```typescript
// Add to base.page.ts
async debugElement(locator: Locator, name: string): Promise<void> {
  const count = await locator.count();
  const visible = await locator.isVisible().catch(() => false);
  const text = await locator.textContent().catch(() => 'N/A');
  
  console.log(`🔍 ${name}:`, {
    count,
    visible,
    text: text?.substring(0, 50)
  });
}
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/playwright.yml
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
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
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
      
      - name: Upload results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
```

### Docker Configuration

```dockerfile
# Dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npx", "playwright", "test"]
```

### Environment Variables

```bash
# .env.example
BASE_URL=https://bo-dev.askmebill.com
USERNAME=admin_eiji
PASSWORD=your_password
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin_pass
CI=false
```

---

## Quick Reference

### Selector Strategies

```typescript
// By text
page.getByText('Submit')
page.getByRole('button', { name: 'Submit' })

// By test ID (recommended)
page.getByTestId('submit-button')

// By label
page.getByLabel('Username')

// By placeholder
page.getByPlaceholder('Enter username')

// CSS selectors (use sparingly)
page.locator('.btn-primary')
page.locator('#submit-button')
```

### Common Assertions

```typescript
// URL
await expect(page).toHaveURL(/.*customer.*/);
await expect(page).toHaveURL('https://example.com/customer');

// Visibility
await expect(locator).toBeVisible();
await expect(locator).toBeHidden();

// Text
await expect(locator).toHaveText('Success');
await expect(locator).toContainText('partial');

// Value
await expect(input).toHaveValue('test');

// Count
await expect(listItems).toHaveCount(5);
```

### Useful Commands

```bash
# Generate test code
npx playwright codegen https://bo-dev.askmebill.com

# View report
npx playwright show-report

# List tests
npx playwright test --list

# Run with tags
npx playwright test --grep "@smoke"

# Run with project
npx playwright test --project=chromium
```

---

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Test Generator](https://playwright.dev/docs/codegen)
