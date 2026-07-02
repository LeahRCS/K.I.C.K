import puppeteer from 'puppeteer-core';
import { execSync } from 'child_process';

(async () => {
  console.log('Starting Admin Setup...');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // 1. Navigate to Signup
  console.log('Navigating to http://localhost:3000/signup...');
  await page.goto('http://localhost:3000/signup', { waitUntil: 'networkidle0' });
  
  // 2. Fill out form
  console.log('Filling out admin registration form...');
  await page.type('input[type="text"]', 'admin_acervo');
  await page.type('input[type="email"]', 'admin@acervo.org');
  await page.type('input[type="password"]', 'admin1234');
  
  // 3. Submit
  console.log('Submitting...');
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForFunction(() => document.body.innerText.includes('Registro Criado') || document.body.innerText.includes('já está em uso') || document.body.innerText.includes('Falha'), { timeout: 10000 })
  ]).catch(() => console.log('Timeout waiting for signup response. Checking DB anyway.'));
  
  await browser.close();

  // 4. Update Database
  console.log('Updating Database to verify email and set ADMIN role...');
  try {
    const dbPath = '.wasp/out/db/dev.db';
    
    // Set email as verified
    execSync(`sqlite3 ${dbPath} "UPDATE AuthIdentity SET providerData = json_set(providerData, '$.isEmailVerified', true) WHERE providerName = 'email' AND providerUserId = 'admin@acervo.org';"`);
    
    // Find the user ID for this email
    const authIdRaw = execSync(`sqlite3 ${dbPath} "SELECT authId FROM AuthIdentity WHERE providerName = 'email' AND providerUserId = 'admin@acervo.org';"`);
    const authId = authIdRaw.toString().trim();
    
    if (authId) {
      const userIdRaw = execSync(`sqlite3 ${dbPath} "SELECT userId FROM Auth WHERE id = '${authId}';"`);
      const userId = userIdRaw.toString().trim();
      
      if (userId) {
        // Update user role
        execSync(`sqlite3 ${dbPath} "UPDATE User SET role = 'ADMIN' WHERE id = '${userId}';"`);
        console.log('✅ Admin user successfully pre-established!');
        console.log('Credentials: admin@acervo.org / admin1234');
      }
    }
  } catch (error) {
    console.error('Error updating database:', error);
  }
})();
