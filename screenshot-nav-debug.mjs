import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto('https://avorino.webflow.io/', { waitUntil: 'domcontentloaded', timeout: 45000 });
await page.waitForTimeout(4000); // let animations + CDN settle

// === BEFORE SCROLL ===
console.log('=== BEFORE SCROLL ===');
await page.screenshot({ path: 'ss-nav-top.png', clip: { x: 0, y: 0, width: 1440, height: 200 } });

const navBefore = await page.evaluate(() => {
  const nav = document.querySelector('.site-nav') || document.querySelector('nav');
  if (!nav) return { error: 'no nav found' };
  const cs = getComputedStyle(nav);
  return {
    classes: nav.className,
    backgroundColor: cs.backgroundColor,
    backdropFilter: cs.backdropFilter || cs.webkitBackdropFilter,
    boxShadow: cs.boxShadow,
    inlineStyle: nav.getAttribute('style'),
  };
});
console.log('Nav before scroll:', JSON.stringify(navBefore, null, 2));

// Check which CDN hash is loaded
const cdnHash = await page.evaluate(() => {
  const links = [...document.querySelectorAll('link[rel="stylesheet"]')];
  const scripts = [...document.querySelectorAll('script[src]')];
  return {
    stylesheets: links.map(l => l.href).filter(h => h.includes('avorino')),
    scripts: scripts.map(s => s.src).filter(s => s.includes('avorino')),
  };
});
console.log('\nCDN files loaded:', JSON.stringify(cdnHash, null, 2));

// === SCROLL DOWN 200px ===
await page.evaluate(() => window.scrollTo(0, 200));
await page.waitForTimeout(1000);

console.log('\n=== AFTER SCROLL (200px) ===');
await page.screenshot({ path: 'ss-nav-scrolled.png', clip: { x: 0, y: 0, width: 1440, height: 100 } });

const navAfter = await page.evaluate(() => {
  const nav = document.querySelector('.site-nav') || document.querySelector('nav');
  if (!nav) return { error: 'no nav found' };
  const cs = getComputedStyle(nav);
  return {
    classes: nav.className,
    backgroundColor: cs.backgroundColor,
    backdropFilter: cs.backdropFilter || cs.webkitBackdropFilter,
    boxShadow: cs.boxShadow,
    padding: cs.padding,
    inlineStyle: nav.getAttribute('style'),
  };
});
console.log('Nav after scroll:', JSON.stringify(navAfter, null, 2));

// Check CTA colors in scrolled state
const ctaAfter = await page.evaluate(() => {
  const cta = document.querySelector('.nav-cta');
  if (!cta) return { error: 'no cta' };
  const cs = getComputedStyle(cta);
  return { color: cs.color, backgroundColor: cs.backgroundColor };
});
console.log('CTA after scroll:', JSON.stringify(ctaAfter, null, 2));

// Check for stale inline style overrides
const inlineOverrides = await page.evaluate(() => {
  const results = [];
  for (const sheet of document.styleSheets) {
    try {
      if (sheet.href) continue; // skip external — only check inline <style> blocks
      for (const rule of sheet.cssRules) {
        const text = rule.cssText || '';
        if (text.includes('nav') && (text.includes('background') || text.includes('color'))) {
          results.push(text.substring(0, 300));
        }
      }
    } catch (e) { /* CORS */ }
  }
  return results;
});
console.log('\n=== INLINE <style> NAV RULES ===');
inlineOverrides.forEach(r => console.log(r));

await browser.close();
