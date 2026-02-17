import { chromium } from 'playwright';

const url = 'https://avorino.webflow.io/about';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(5000);

// Extract actual CSS rules for our classes
const cssRules = await page.evaluate(() => {
  const targetClasses = [
    'av-section-warm', 'av-section-dark', 'av-body-muted', 'av-heading-xl',
    'av-heading-lg', 'av-heading-md', 'av-label', 'av-grid-2col', 'av-grid-3col',
    'av-card-dark', 'av-card-light', 'about-hero', 'about-hero-overlay',
    'about-cta-btns', 'about-cta-btn', 'about-stat-number',
  ];

  const results = {};
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (rule.selectorText) {
          for (const cls of targetClasses) {
            if (rule.selectorText.includes('.' + cls)) {
              if (!results[cls]) results[cls] = [];
              results[cls].push({
                selector: rule.selectorText,
                cssText: rule.cssText.slice(0, 500),
              });
            }
          }
        }
      }
    } catch (e) {
      // Cross-origin stylesheet, skip
    }
  }
  return results;
});

for (const [cls, rules] of Object.entries(cssRules)) {
  console.log(`\n=== .${cls} ===`);
  for (const r of rules) {
    console.log(r.cssText);
  }
}

if (Object.keys(cssRules).length === 0) {
  console.log('\nNo rules found! Checking available stylesheets...');
  const sheets = await page.evaluate(() =>
    Array.from(document.styleSheets).map(s => ({
      href: s.href?.slice(0, 100),
      rules: (() => { try { return s.cssRules.length; } catch { return 'cross-origin'; } })(),
    }))
  );
  console.log(JSON.stringify(sheets, null, 2));
}

await browser.close();
