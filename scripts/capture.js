import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Capturing Light Mode Dashboard...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'screenshots/dashboard-light.png', fullPage: true });

  console.log('Switching to Dark Mode...');
  // Find the theme toggle button (moon icon)
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const themeBtn = buttons.find(b => b.classList.contains('theme-toggle'));
    if (themeBtn) themeBtn.click();
  });
  await new Promise(r => setTimeout(r, 500)); // give it time to transition
  await page.screenshot({ path: 'screenshots/dashboard-dark.png', fullPage: true });

  console.log('Capturing Transactions View in Dark Mode...');
  // Click on transactions
  await page.evaluate(() => {
    const navItems = Array.from(document.querySelectorAll('.sidebar-nav-item'));
    const txBtn = navItems.find(n => n.textContent.includes('Transactions'));
    if (txBtn) txBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'screenshots/transactions-dark.png', fullPage: true });

  console.log('Capturing Insights View in Light Mode...');
  // Switch back to light
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const themeBtn = buttons.find(b => b.classList.contains('theme-toggle'));
    if (themeBtn) themeBtn.click();
  });
  // Navigate to insights
  await page.evaluate(() => {
    const navItems = Array.from(document.querySelectorAll('.sidebar-nav-item'));
    const insightsBtn = navItems.find(n => n.textContent.includes('Insights'));
    if (insightsBtn) insightsBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'screenshots/insights-light.png', fullPage: true });

  await browser.close();
  console.log('Screenshots captured successfully!');
})();
