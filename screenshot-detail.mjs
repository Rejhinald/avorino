import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

// ── Landing page sections ──
const lp = await ctx.newPage();
await lp.goto('https://avorino.webflow.io', { waitUntil: 'networkidle', timeout: 30000 });
await lp.waitForTimeout(2000);

// Scroll through landing page taking viewport screenshots
for (let i = 0; i < 8; i++) {
  await lp.screenshot({ path: `ss-landing-${i}.png` });
  await lp.evaluate(() => window.scrollBy(0, window.innerHeight));
  await lp.waitForTimeout(500);
}
console.log('Landing page sections done');

// ── About page sections ──
const ap = await ctx.newPage();
await ap.goto('https://avorino.webflow.io/about', { waitUntil: 'networkidle', timeout: 30000 });
await ap.waitForTimeout(2000);

// Scroll through about page taking viewport screenshots
for (let i = 0; i < 10; i++) {
  await ap.screenshot({ path: `ss-about-${i}.png` });
  await ap.evaluate(() => window.scrollBy(0, window.innerHeight));
  await ap.waitForTimeout(500);
}
console.log('About page sections done');

await browser.close();
console.log('All done!');
