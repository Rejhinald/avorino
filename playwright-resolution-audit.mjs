import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { resolve } from 'path';

const SCREENSHOTS_DIR = resolve('C:/Users/Admin/Documents/Work Repo/avorino/screenshots/resolution-audit');
mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const RESOLUTIONS = [
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'laptop-1024', width: 1024, height: 768 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'fullhd-1920', width: 1920, height: 1080 },
  { name: 'ultrawide-2560', width: 2560, height: 1440 },
];

const SECTIONS = [
  { name: 'hero', selector: '.hero' },
  { name: 'about', selector: '.about' },
  { name: 'services', selector: '.services' },
  { name: 'stats', selector: '.stats' },
  { name: 'featured', selector: '.featured' },
  { name: 'process', selector: '.process' },
  { name: 'testimonials', selector: '.testimonials' },
  { name: 'tools', selector: '.tools' },
  { name: 'cta', selector: '.cta-section' },
  { name: 'footer', selector: '.footer' },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const filePath = 'file:///' + resolve('C:/Users/Admin/Documents/Work Repo/avorino/avorino-v6-preview.html').replace(/\\/g, '/');

  for (const res of RESOLUTIONS) {
    console.log(`\n=== ${res.name} (${res.width}x${res.height}) ===`);
    const page = await browser.newPage({ viewport: { width: res.width, height: res.height } });
    await page.goto(filePath, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {
      console.log('Warning: networkidle timeout, continuing...');
    });

    // Wait for preloader to finish
    try {
      await page.waitForSelector('.preloader', { state: 'hidden', timeout: 8000 });
    } catch { /* preloader may already be hidden */ }
    await page.waitForTimeout(1000);

    // Full page screenshot
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/${res.name}-fullpage.png`, fullPage: true });
    console.log(`  Full page screenshot captured`);

    // Section screenshots
    for (const section of SECTIONS) {
      try {
        const el = await page.$(section.selector);
        if (el) {
          await el.screenshot({ path: `${SCREENSHOTS_DIR}/${res.name}-${section.name}.png` });

          // Get computed dimensions
          const box = await el.boundingBox();
          if (box) {
            console.log(`  ${section.name}: ${Math.round(box.width)}x${Math.round(box.height)}`);
          }
        } else {
          console.log(`  ${section.name}: NOT FOUND`);
        }
      } catch (e) {
        console.log(`  ${section.name}: ERROR - ${e.message.substring(0, 60)}`);
      }
    }

    // Services-specific analysis
    const serviceCards = await page.$$('.service-card');
    if (serviceCards.length > 0) {
      for (let i = 0; i < serviceCards.length; i++) {
        const box = await serviceCards[i].boundingBox();
        if (box) {
          console.log(`  service-card-${i+1}: ${Math.round(box.width)}x${Math.round(box.height)} at (${Math.round(box.x)}, ${Math.round(box.y)})`);
        }
      }

      // Check services track width vs viewport
      const trackWidth = await page.$eval('.services-track', el => el.scrollWidth);
      console.log(`  services-track scrollWidth: ${trackWidth} (viewport: ${res.width})`);
      console.log(`  scroll ratio: ${(trackWidth / res.width).toFixed(2)}x`);
    }

    await page.close();
  }

  await browser.close();
  console.log('\n=== AUDIT COMPLETE ===');
})();
