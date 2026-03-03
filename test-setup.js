// Simple test to verify Playwright setup
const { chromium } = require('playwright');

(async () => {
  console.log('Testing Playwright setup...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://bo-dev.askmebill.com');
  console.log('✅ Page loaded:', await page.title());
  
  await page.screenshot({ path: 'test-results/setup-test.png' });
  console.log('✅ Screenshot saved');
  
  await browser.close();
  console.log('✅ Playwright is working!');
})();
