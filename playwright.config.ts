import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Load environment variables from .env file
 * This allows different configurations for different environments
 * without changing the code
 */
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Playwright Test Configuration
 * 
 * This configuration follows Playwright best practices for professional test automation:
 * - Parallel execution with proper isolation
 * - CI/CD optimized settings
 * - Comprehensive reporting
 * - Cross-browser testing support
 * 
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  /**
   * Directory containing all test files
   * Playwright will look for *.spec.ts or *.test.ts files in this directory
   */
  testDir: './tests',

  /**
   * Run tests in parallel for faster execution
   * - true: Run all tests in parallel across all files
   * - false: Run tests sequentially (safer for tests with shared state)
   * 
   * Recommendation: Set to true with proper test isolation
   */
  fullyParallel: true,

  /**
   * Fail the build on CI if test.only() is accidentally left in the source code
   * This prevents tests from being skipped in CI environments
   */
  forbidOnly: !!process.env.CI,

  /**
   * Retry failed tests
   * - CI environment: 2 retries (helps with flaky tests in CI)
   * - Local development: 0 retries (fail fast for quick feedback)
   */
  retries: process.env.CI ? 2 : 0,

  /**
   * Number of parallel workers
   * - CI environment: 1 worker (sequential for stability)
   * - Local development: 50% of CPU cores (optimal for local machines)
   * - Override with: npx playwright test --workers=4
   * 
   * For parallel execution safety:
   * - Each test gets isolated browser context
   * - Use storageState for shared authentication
   * - Avoid shared mutable state between tests
   */
  workers: process.env.CI ? 1 : undefined,

  /**
   * Test reporters configuration
   * - HTML: Visual report with screenshots and traces
   * - List: Console output with test progress
   * - JSON: Machine-readable output for CI integration
   * 
   * Additional reporters available:
   * - ['junit', { outputFile: 'test-results/junit.xml' }]
   * - ['allure-playwright']
   * - ['blob', { outputFile: 'test-results/blob.zip' }]
   */
  reporter: [
    ['html', { open: 'never' }],      // HTML report, don't auto-open
    ['list'],                          // Console list reporter
    ['json', { outputFile: 'test-results/test-results.json' }]  // JSON for CI
  ],

  /**
   * Shared settings for all test projects
   * These settings apply to all browsers unless overridden
   */
  use: {
    /**
     * Base URL for all navigation actions
     * Use relative paths in tests: await page.goto('/customer/123')
     * Override with: BASE_URL=https://staging.example.com npx playwright test
     */
    baseURL: process.env.BASE_URL || 'https://bo-dev.askmebill.com',

    /**
     * Trace recording configuration
     * - 'on-first-retry': Record trace only on first retry (recommended)
     * - 'on': Always record (useful for debugging)
     * - 'off': Never record (faster execution)
     * 
     * Traces include: DOM snapshots, console logs, network requests
     */
    trace: 'on-first-retry',

    /**
     * Screenshot capture on test failure
     * - 'only-on-failure': Capture when test fails (recommended)
     * - 'on': Always capture
     * - 'off': Never capture
     */
    screenshot: 'only-on-failure',

    /**
     * Video recording configuration
     * - 'on-first-retry': Record video only on retry
     * - 'on': Always record
     * - 'off': Never record
     * - 'retain-on-failure': Keep video only on failure
     */
    video: 'on-first-retry',

    /**
     * Default viewport size
     * Desktop HD resolution for consistent UI testing
     */
    viewport: { width: 1920, height: 1080 },

    /**
     * Action timeout for all actions (click, fill, etc.)
     * Playwright waits up to this time for elements to be actionable
     */
    actionTimeout: 30000,

    /**
     * Navigation timeout for page.goto() and similar
     * Separate from action timeout for page loads
     */
    navigationTimeout: 30000,

    /**
     * Test timeout - maximum time for a single test
     * Override per-test: test('slow test', async () => {}, { timeout: 60000 })
     */
    // timeout: 60000,

    /**
     * Context options for test isolation
     * Each test gets a fresh browser context with these settings
     */
    contextOptions: {
      /**
       * Record all network requests for debugging
       * Access via: await page.route()
       */
      // recordHar: { path: 'test-results/network.har' }
    },

    /**
     * Launch options for the browser
     */
    launchOptions: {
      /**
       * Slow down actions by N milliseconds (useful for debugging)
       * Set to 100-1000ms to watch tests execute
       */
      // slowMo: 0,

      /**
       * Run browser in headless mode
       * - CI: true (headless)
       * - Local: false (headed for debugging)
       */
      headless: !!process.env.CI,
    },
  },

  /**
   * Project configurations for cross-browser testing
   * Each project represents a browser/environment combination
   * 
   * Dependencies:
   * - 'setup': Runs authentication setup before main tests
   * - 'teardown': Cleanup after all tests complete
   */
  projects: [
    // Setup project - runs authentication setup
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,  // Matches files ending with .setup.ts
      teardown: 'teardown',          // Run teardown after setup completes
    },
    
    // Teardown project - cleanup resources
    {
      name: 'teardown',
      testMatch: /.*\.teardown\.ts/,  // Matches files ending with .teardown.ts
    },
    
    // Chromium project - primary browser for testing
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],  // Use predefined Chrome settings
        /**
         * Load authenticated state from setup
         * This allows tests to skip login and start already authenticated
         */
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],  // Wait for setup to complete
    },
    
    // Firefox project - secondary browser compatibility
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    
    // WebKit (Safari) project - disabled due to compatibility issues
    // Uncomment when Safari support is needed
    // {
    //   name: 'webkit',
    //   use: { 
    //     ...devices['Desktop Safari'],
    //     storageState: 'playwright/.auth/user.json',
    //   },
    //   dependencies: ['setup'],
    // },
    
    // Mobile Chrome project - responsive testing
    // {
    //   name: 'Mobile Chrome',
    //   use: { 
    //     ...devices['Pixel 5'],
    //     storageState: 'playwright/.auth/user.json',
    //   },
    //   dependencies: ['setup'],
    // },
  ],

  /**
   * Output directory for test artifacts
   * Includes: screenshots, videos, traces, JSON reports
   */
  outputDir: 'test-results/',

  /**
   * Web server configuration
   * Uncomment to start local dev server before running tests
   * Useful for testing against local development builds
   */
  // webServer: {
  //   command: 'npm run start',           // Command to start dev server
  //   url: 'http://127.0.0.1:3000',       // URL to wait for
  //   reuseExistingServer: !process.env.CI, // Reuse server if already running (local only)
  //   timeout: 120 * 1000,                // Wait up to 2 minutes for server to start
  // },

  /**
   * Global setup and teardown
   * Run once before/after all tests (not per-worker)
   */
  // globalSetup: './global-setup.ts',
  // globalTeardown: './global-teardown.ts',

  /**
   * Expect (assertions) configuration
   */
  expect: {
    /**
     * Timeout for expect() assertions
     * Playwright waits up to this time for condition to be met
     */
    timeout: 5000,

    /**
     * Screenshot comparison options for visual regression
     */
    toHaveScreenshot: {
      maxDiffPixels: 100,  // Allow 100 pixels difference
    },
  },
});
