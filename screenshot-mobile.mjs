import { chromium, devices } from 'playwright';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Intercept CDN to serve local files
const localProcess3d = readFileSync(resolve('avorino-about-process3d.js'), 'utf-8');
const localHeadCSS = readFileSync(resolve('avorino-about-head.css'), 'utf-8');

const viewports = [
  { name: 'desktop',  width: 1440, height: 900 },
  { name: 'tablet',   width: 768,  height: 1024 },
  { name: 'mobile-l', width: 430,  height: 932 },   // iPhone 15 Pro Max
  { name: 'mobile-p', width: 375,  height: 812 },   // iPhone SE / small
];

const browser = await chromium.launch();

for (const vp of viewports) {
  console.log(`\n=== ${vp.name} (${vp.width}x${vp.height}) ===`);
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();

  page.on('pageerror', err => console.log(`[${vp.name}] PAGE ERROR:`, err.message));

  // Intercept CDN requests to serve local files
  await page.route('**/avorino-about-process3d.js', route => {
    route.fulfill({ contentType: 'application/javascript', body: localProcess3d });
  });

  await page.goto('https://avorino.webflow.io/about', { waitUntil: 'networkidle', timeout: 45000 });

  // Inject local head CSS to override any cached version
  await page.addStyleTag({ content: localHeadCSS });
  await page.waitForTimeout(3000);

  // Gather layout info
  const info = await page.evaluate(() => {
    const sections = ['about-hero', 'about-story', 'about-stats', 'about-mission-vision',
                       'about-values', 'about-process', 'about-communication', 'about-adu'];
    const results = {};
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        results[id] = {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          paddingL: cs.paddingLeft,
          paddingR: cs.paddingRight,
          overflow: rect.width > window.innerWidth ? 'OVERFLOW!' : 'ok',
        };
      }
    });

    // Process section specific checks
    const pinned = document.querySelector('[data-process-pinned]');
    const processCards = document.querySelectorAll('[data-process-card]');
    const processInfo = {
      pinnedHeight: pinned ? getComputedStyle(pinned).height : 'N/A',
      pinnedPosition: pinned ? getComputedStyle(pinned).position : 'N/A',
      cardCount: processCards.length,
      cardsVisible: 0,
      cardsPosition: [],
    };
    processCards.forEach((c, i) => {
      const cs = getComputedStyle(c);
      if (parseFloat(cs.opacity) > 0.5) processInfo.cardsVisible++;
      processInfo.cardsPosition.push({
        idx: i,
        position: cs.position,
        opacity: cs.opacity,
        top: cs.top,
        left: cs.left,
      });
    });

    // Check for horizontal overflow
    const bodyWidth = document.body.scrollWidth;
    const viewportWidth = window.innerWidth;

    return {
      viewportWidth,
      bodyScrollWidth: bodyWidth,
      horizontalOverflow: bodyWidth > viewportWidth ? `YES (${bodyWidth - viewportWidth}px)` : 'none',
      sections: results,
      process: processInfo,
    };
  });

  console.log(`Viewport: ${info.viewportWidth}px, Body scroll: ${info.bodyScrollWidth}px, Overflow: ${info.horizontalOverflow}`);
  console.log('Process:', JSON.stringify(info.process, null, 2));

  // Check each section for overflow
  for (const [id, data] of Object.entries(info.sections)) {
    if (data.overflow !== 'ok') console.log(`  WARNING: ${id} — ${data.overflow} (width: ${data.width})`);
  }

  // Full page screenshot
  await page.screenshot({ path: `ss-mobile-${vp.name}-full.png`, fullPage: true });
  console.log(`Saved: ss-mobile-${vp.name}-full.png`);

  // Process section screenshot
  const procEl = await page.$('#about-process');
  if (procEl) {
    await procEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `ss-mobile-${vp.name}-process.png` });
    console.log(`Saved: ss-mobile-${vp.name}-process.png`);
  }

  await ctx.close();
}

await browser.close();
console.log('\nDone!');
