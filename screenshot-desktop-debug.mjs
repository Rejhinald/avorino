import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const localProcess3d = readFileSync(resolve('avorino-about-process3d.js'), 'utf-8');
const localHeadCSS = readFileSync(resolve('avorino-about-head.css'), 'utf-8');

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
page.on('console', msg => {
  if (msg.text().includes('process') || msg.text().includes('isMobile') || msg.text().includes('ScrollTrigger'))
    console.log('CONSOLE:', msg.text());
});

await page.route('**/avorino-about-process3d.js', route => {
  route.fulfill({ contentType: 'application/javascript', body: localProcess3d });
});

await page.goto('https://avorino.webflow.io/about', { waitUntil: 'networkidle', timeout: 45000 });
await page.addStyleTag({ content: localHeadCSS });
await page.waitForTimeout(3000);

const debug = await page.evaluate(() => {
  const pinned = document.querySelector('[data-process-pinned]');
  const visual = document.querySelector('[data-process-visual]');
  const cardsWrap = document.querySelector('[data-process-cards]');
  const cards = document.querySelectorAll('[data-process-card]');
  const pinSpacer = document.querySelector('.pin-spacer');

  let stCount = 0, processSTPinned = false;
  try {
    const allST = window.ScrollTrigger?.getAll() || [];
    stCount = allST.length;
    allST.forEach(st => {
      const trigger = st.trigger || st.vars?.trigger;
      if (trigger && trigger.hasAttribute && trigger.hasAttribute('data-process-pinned')) {
        processSTPinned = true;
      }
    });
  } catch (e) {}

  function cs(el) {
    if (!el) return null;
    const s = getComputedStyle(el);
    return {
      display: s.display, position: s.position, width: s.width, height: s.height,
      overflow: s.overflow, overflowX: s.overflowX, overflowY: s.overflowY,
      flexDirection: s.flexDirection, gap: s.gap,
    };
  }

  return {
    isMobileFlag: window.innerWidth < 992,
    viewportWidth: window.innerWidth,
    pinned: pinned ? { ...cs(pinned), rect: pinned.getBoundingClientRect() } : null,
    visual: visual ? cs(visual) : null,
    cardsWrap: cardsWrap ? cs(cardsWrap) : null,
    cardCount: cards.length,
    cards: Array.from(cards).map((c, i) => ({
      idx: i,
      opacity: getComputedStyle(c).opacity,
      position: getComputedStyle(c).position,
      display: getComputedStyle(c).display,
      top: getComputedStyle(c).top,
      left: getComputedStyle(c).left,
      title: c.querySelector('h3')?.textContent || '',
    })),
    stCount,
    processSTPinned,
    hasPinSpacer: !!pinSpacer,
    pinSpacerHeight: pinSpacer ? getComputedStyle(pinSpacer).height : null,
    bodyScrollHeight: document.body.scrollHeight,
  };
});

console.log('\n=== DESKTOP DEBUG (1440x900) ===');
console.log('isMobile flag:', debug.isMobileFlag);
console.log('ScrollTrigger count:', debug.stCount);
console.log('Process ST pinned:', debug.processSTPinned);
console.log('Has .pin-spacer:', debug.hasPinSpacer);
console.log('Pin spacer height:', debug.pinSpacerHeight);
console.log('\nPINNED:', JSON.stringify(debug.pinned, null, 2));
console.log('\nVISUAL:', JSON.stringify(debug.visual, null, 2));
console.log('\nCARDS WRAP:', JSON.stringify(debug.cardsWrap, null, 2));
console.log('\nCARDS:');
debug.cards.forEach(c => {
  console.log(`  [${c.idx}] "${c.title}" — pos=${c.position}, opacity=${c.opacity}, display=${c.display}, top=${c.top}, left=${c.left}`);
});

// Scroll to process section
const procEl = await page.$('#about-process');
if (procEl) {
  await procEl.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'ss-debug-desktop-process.png' });
  console.log('\nSaved: ss-debug-desktop-process.png');

  // Scroll down to check if it locks
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'ss-debug-desktop-scroll1.png' });
  console.log('Saved: ss-debug-desktop-scroll1.png');

  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'ss-debug-desktop-scroll2.png' });
  console.log('Saved: ss-debug-desktop-scroll2.png');

  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'ss-debug-desktop-scroll3.png' });
  console.log('Saved: ss-debug-desktop-scroll3.png');
}

await browser.close();
console.log('\nDone!');
