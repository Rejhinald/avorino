import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

await page.goto('https://avorino.webflow.io/contact', { waitUntil: 'networkidle', timeout: 45000 });
await page.waitForTimeout(3000);

// Full page screenshot
await page.screenshot({ path: 'ss-contact-full.png', fullPage: true });
console.log('Saved: ss-contact-full.png (full page)');

// Section screenshots
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);
await page.screenshot({ path: 'ss-contact-0.png' });
console.log('Saved: ss-contact-0.png (hero)');

await page.evaluate(() => window.scrollBy(0, 800));
await page.waitForTimeout(500);
await page.screenshot({ path: 'ss-contact-1.png' });

await page.evaluate(() => window.scrollBy(0, 800));
await page.waitForTimeout(500);
await page.screenshot({ path: 'ss-contact-2.png' });

await page.evaluate(() => window.scrollBy(0, 800));
await page.waitForTimeout(500);
await page.screenshot({ path: 'ss-contact-3.png' });

// Deep debug: walk the entire DOM tree
const debug = await page.evaluate(() => {
  const results = {};

  // 1. All sections on the page
  const allSections = document.querySelectorAll('section');
  results.sectionCount = allSections.length;
  results.sections = Array.from(allSections).map(s => ({
    id: s.id,
    classes: s.className,
    bg: getComputedStyle(s).backgroundColor,
    color: getComputedStyle(s).color,
    minHeight: getComputedStyle(s).minHeight,
  }));

  // 2. All headings
  const allHeadings = document.querySelectorAll('h1, h2, h3');
  results.headings = Array.from(allHeadings).map(h => ({
    tag: h.tagName, text: h.textContent?.trim(), classes: h.className,
  }));

  // 3. All form-related elements (form, input, textarea, select, button)
  const allForm = document.querySelectorAll('form, input, textarea, select, button[type="submit"]');
  results.formElements = Array.from(allForm).map(el => ({
    tag: el.tagName, type: el.getAttribute('type'), name: el.getAttribute('name'),
    placeholder: el.getAttribute('placeholder'), classes: el.className,
    text: el.tagName === 'BUTTON' ? el.textContent?.trim() : undefined,
  }));

  // 4. Count all divs and check for 1px-height elements (dividers)
  const allDivs = document.querySelectorAll('div');
  let dividerLike = [];
  allDivs.forEach(d => {
    const h = getComputedStyle(d).height;
    if (h === '1px' || h === '2px') {
      dividerLike.push({
        classes: d.className,
        height: h,
        bg: getComputedStyle(d).backgroundColor,
        margin: getComputedStyle(d).marginTop + ' / ' + getComputedStyle(d).marginBottom,
      });
    }
  });
  results.dividerLikeElements = dividerLike;
  results.totalDivs = allDivs.length;

  // 5. Check the ct-main grid children
  const mainSection = document.getElementById('ct-main');
  if (mainSection) {
    const gridEl = mainSection.querySelector('div');
    if (gridEl) {
      results.gridDisplay = getComputedStyle(gridEl).display;
      results.gridTemplateColumns = getComputedStyle(gridEl).gridTemplateColumns;
      results.gridChildren = gridEl.children.length;
      results.gridChildDetails = Array.from(gridEl.children).map(c => ({
        tag: c.tagName, classes: c.className,
        childCount: c.children.length,
        firstChildText: c.children[0]?.textContent?.trim()?.substring(0, 50),
      }));
    }
  }

  // 6. Check ct-hero
  const heroEl = document.getElementById('ct-hero');
  if (heroEl) {
    results.heroDetail = {
      tag: heroEl.tagName,
      classes: heroEl.className,
      bg: getComputedStyle(heroEl).backgroundColor,
      color: getComputedStyle(heroEl).color,
      textAlign: getComputedStyle(heroEl).textAlign,
      childCount: heroEl.children.length,
      allText: heroEl.textContent?.trim()?.substring(0, 200),
    };
  } else {
    results.heroDetail = 'NO #ct-hero FOUND';
  }

  return results;
});

console.log('\n=== CONTACT PAGE DEEP DEBUG ===');
console.log(JSON.stringify(debug, null, 2));

await browser.close();
console.log('\nDone!');
