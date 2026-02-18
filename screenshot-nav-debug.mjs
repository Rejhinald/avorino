import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto('https://avorino.webflow.io/', { waitUntil: 'domcontentloaded', timeout: 45000 });
await page.waitForTimeout(3000); // let animations settle

// Screenshot the top of the page (hero + nav area)
await page.screenshot({ path: 'ss-nav-debug-top.png', clip: { x: 0, y: 0, width: 1440, height: 200 } });

// Full viewport screenshot
await page.screenshot({ path: 'ss-nav-debug-full.png' });

// Find the nav element — could be .site-nav, nav, or a Webflow class
const navInfo = await page.evaluate(() => {
  // Try multiple selectors
  const selectors = ['.site-nav', 'nav', '[data-el="nav"]', '.navbar', '.nav', '.w-nav'];
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el) {
      const cs = getComputedStyle(el);
      return {
        selector: sel,
        tagName: el.tagName,
        classes: el.className,
        id: el.id,
        background: cs.background,
        backgroundColor: cs.backgroundColor,
        backdropFilter: cs.backdropFilter || cs.webkitBackdropFilter,
        opacity: cs.opacity,
        position: cs.position,
        zIndex: cs.zIndex,
        inlineStyle: el.getAttribute('style'),
        outerHTML: el.outerHTML.substring(0, 500),
      };
    }
  }
  // Fallback: dump the first 3000 chars of body HTML to find nav
  return { error: 'No nav found', bodyStart: document.body.innerHTML.substring(0, 3000) };
});
console.log('=== NAV INFO ===');
console.log(JSON.stringify(navInfo, null, 2));

// Check ALL elements in the top 80px that might have a background
const topBgElements = await page.evaluate(() => {
  const results = [];
  const all = document.querySelectorAll('*');
  for (const el of all) {
    const rect = el.getBoundingClientRect();
    if (rect.top < 80 && rect.height > 0 && rect.width > 100) {
      const cs = getComputedStyle(el);
      const bg = cs.backgroundColor;
      const bgImage = cs.backgroundImage;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        results.push({
          tag: el.tagName,
          class: el.className?.substring?.(0, 100) || '',
          bg,
          bgImage: bgImage?.substring(0, 100),
          rect: { top: Math.round(rect.top), height: Math.round(rect.height), width: Math.round(rect.width) },
        });
      }
    }
  }
  return results;
});
console.log('\n=== ELEMENTS WITH BG IN TOP 80px ===');
topBgElements.forEach(e => console.log(`${e.tag}.${e.class} → bg: ${e.bg}, rect: ${JSON.stringify(e.rect)}`));

// Check all stylesheets for nav-related rules
const navRules = await page.evaluate(() => {
  const results = [];
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        const text = rule.cssText || '';
        if ((text.includes('site-nav') || text.includes('.nav') || text.includes('navbar')) &&
            (text.includes('background') || text.includes('opacity'))) {
          results.push({ href: sheet.href || 'inline', rule: text.substring(0, 400) });
        }
      }
    } catch (e) {
      results.push({ href: sheet.href || 'inline', error: 'CORS blocked' });
    }
  }
  return results;
});
console.log('\n=== CSS RULES WITH NAV + BG/OPACITY ===');
navRules.forEach(r => console.log(r.href?.substring(r.href.length - 60), '→', r.rule || r.error));

await browser.close();
