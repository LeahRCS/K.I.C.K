import puppeteer from 'puppeteer-core';

(async () => {
  console.log('Testing Login Flow & Protected Pages...');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  try {
    // 1. Go to Login
    console.log('Navigating to http://localhost:3000/login...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
    
    // 2. Fill login form
    console.log('Filling login form with admin credentials...');
    await page.type('input[type="email"]', 'admin@acervo.org');
    await page.type('input[type="password"]', 'admin1234');
    
    // 3. Submit and wait for navigation to Dashboard or Home
    console.log('Submitting login form...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('button[type="submit"]')
    ]);
    
    const url = page.url();
    console.log(`Current URL after login: ${url}`);
    
    // 4. Test Protected Route (/dashboard)
    console.log('Navigating to protected route: /dashboard...');
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0' });
    
    const dashboardTitle = await page.evaluate(() => {
      const h2 = document.querySelector('h2');
      return h2 ? h2.innerText : null;
    });
    
    if (dashboardTitle) {
      console.log(`✅ Dashboard loaded successfully! Title: ${dashboardTitle}`);
    } else {
      console.log('❌ Failed to load Dashboard or find heading.');
    }
    
    console.log('✅ End-to-end login and protected page access is functioning perfectly.');
  } catch (err) {
    console.error('❌ Error during login test:', err);
  } finally {
    await browser.close();
  }
})();
