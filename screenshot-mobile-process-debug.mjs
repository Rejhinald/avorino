import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const localProcess3d = readFileSync(resolve('avorino-about-process3d.js'), 'utf-8');
const localHeadCSS = readFileSync(resolve('avorino-about-head.css'), 'utf-8');

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
const page = await ctx.newPage();

page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
page.on('console', msg => {
  if (msg.text().includes('process') || msg.text().includes('mobile') || msg.text().includes('isMobile'))
    console.log('CONSOLE:', msg.text());
});

// Intercept CDN
await page.route('**/avorino-about-process3d.js', route => {
  route.fulfill({ contentType: 'application/javascript', body: localProcess3d });
});

await page.goto('https://avorino.webflow.io/about', { waitUntil: 'networkidle', timeout: 45000 });
await page.addStyleTag({ content: localHeadCSS });
await page.waitForTimeout(3000);

// Detailed process section analysis
const debug = await page.evaluate(() => {
  const section = document.getElementById('about-process');
  const pinned = document.querySelector('[data-process-pinned]');
  const visual = document.querySelector('[data-process-visual]');
  const cardsWrap = document.querySelector('[data-process-cards]');
  const cards = document.querySelectorAll('[data-process-card]');
  const nav = document.querySelector('[data-process-nav]');

  function cs(el) {
    if (!el) return null;
    const s = getComputedStyle(el);
    return {
      display: s.display,
      position: s.position,
      width: s.width,
      height: s.height,
      overflow: s.overflow,
      flexDirection: s.flexDirection,
      gap: s.gap,
      paddingL: s.paddingLeft,
      paddingR: s.paddingRight,
      paddingT: s.paddingTop,
      paddingB: s.paddingBottom,
      marginL: s.marginLeft,
      marginR: s.marginRight,
      top: s.top,
      left: s.left,
      opacity: s.opacity,
      transform: s.transform,
      zIndex: s.zIndex,
      pointerEvents: s.pointerEvents,
    };
  }

  // Check for ScrollTrigger pins
  let stCount = 0;
  let processSTPinned = false;
  try {
    const allST = window.ScrollTrigger?.getAll() || [];
    stCount = allST.length;
    allST.forEach(st => {
      const trigger = st.trigger || st.vars?.trigger;
      if (trigger && trigger.hasAttribute && trigger.hasAttribute('data-process-pinned')) {
        processSTPinned = true;
      }
    });
  } catch(e) {}

  // Check if pin-spacer exists (ScrollTrigger creates this when pinning)
  const pinSpacer = document.querySelector('.pin-spacer');

  // Check body scroll height vs viewport
  const scrollInfo = {
    bodyScrollHeight: document.body.scrollHeight,
    viewportHeight: window.innerHeight,
    scrollable: document.body.scrollHeight > window.innerHeight,
  };

  return {
    viewportWidth: window.innerWidth,
    section: section ? { ...cs(section), id: section.id, rect: section.getBoundingClientRect() } : null,
    pinned: pinned ? { ...cs(pinned), rect: pinned.getBoundingClientRect() } : null,
    visual: visual ? { ...cs(visual) } : null,
    cardsWrap: cardsWrap ? { ...cs(cardsWrap), childCount: cardsWrap.children.length } : null,
    cards: Array.from(cards).map((c, i) => ({
      idx: i,
      ...cs(c),
      rect: { top: c.getBoundingClientRect().top, height: c.getBoundingClientRect().height },
      textContent: c.querySelector('h3')?.textContent || '',
    })),
    nav: nav ? { ...cs(nav) } : null,
    scrollTriggerCount: stCount,
    processScrollTriggerPinned: processSTPinned,
    hasPinSpacer: !!pinSpacer,
    pinSpacerHeight: pinSpacer ? getComputedStyle(pinSpacer).height : null,
    scrollInfo,
  };
});

console.log('\n=== VIEWPORT ===');
console.log('Width:', debug.viewportWidth);

console.log('\n=== SECTION #about-process ===');
console.log(JSON.stringify(debug.section, null, 2));

console.log('\n=== PINNED CONTAINER ===');
console.log(JSON.stringify(debug.pinned, null, 2));

console.log('\n=== VISUAL ===');
console.log(JSON.stringify(debug.visual, null, 2));

console.log('\n=== CARDS WRAPPER ===');
console.log(JSON.stringify(debug.cardsWrap, null, 2));

console.log('\n=== CARDS ===');
debug.cards.forEach(c => {
  console.log(`  Card ${c.idx} "${c.textContent}": pos=${c.position}, opacity=${c.opacity}, top=${c.top}, left=${c.left}, display=${c.display}, rect.top=${c.rect.top.toFixed(0)}, rect.h=${c.rect.height.toFixed(0)}`);
});

console.log('\n=== NAV ===');
console.log(JSON.stringify(debug.nav, null, 2));

console.log('\n=== SCROLL TRIGGER ===');
console.log('ST count:', debug.scrollTriggerCount);
console.log('Process ST pinned:', debug.processScrollTriggerPinned);
console.log('Has .pin-spacer:', debug.hasPinSpacer);
console.log('Pin spacer height:', debug.pinSpacerHeight);

console.log('\n=== SCROLL INFO ===');
console.log(JSON.stringify(debug.scrollInfo, null, 2));

// Scroll to process section and take screenshot
const procEl = await page.$('#about-process');
if (procEl) {
  await procEl.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'ss-debug-process-mobile-view.png' });
  console.log('\nSaved: ss-debug-process-mobile-view.png');

  // Scroll down a bit to check if it locks
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'ss-debug-process-mobile-scroll1.png' });
  console.log('Saved: ss-debug-process-mobile-scroll1.png');

  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'ss-debug-process-mobile-scroll2.png' });
  console.log('Saved: ss-debug-process-mobile-scroll2.png');
}

await browser.close();
console.log('\nDone!');
