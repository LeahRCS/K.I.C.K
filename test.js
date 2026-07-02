import puppeteer from 'puppeteer-core';

(async () => {
  console.log('Starting Puppeteer DOM test...');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Test 1: Landing Page
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  const title = await page.title();
  console.log(`Page Title: ${title}`);
  
  const heading = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    return h1 ? h1.innerText : 'No H1 found';
  });
  console.log(`Main Heading: ${heading}`);

  if (heading.includes('K.I.C.K')) {
    console.log('✅ Landing Page loaded successfully!');
  } else {
    console.log('❌ Landing Page failed to load properly.');
  }

  // Test 2: Navigate to Signup
  console.log('Navigating to Signup page...');
  await page.goto('http://localhost:3000/signup', { waitUntil: 'networkidle0' });
  
  const formExists = await page.evaluate(() => {
    return !!document.querySelector('form');
  });
  
  if (formExists) {
    console.log('✅ Signup form loaded successfully!');
  } else {
    console.log('❌ Signup form failed to load.');
  }

  await browser.close();
  console.log('Test completed.');
})();
