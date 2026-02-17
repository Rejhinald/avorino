import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

// NO interception — use exactly what the live site serves
await page.goto('https://avorino.webflow.io/about', { waitUntil: 'networkidle', timeout: 45000 });
await page.waitForTimeout(4000);

const debug = await page.evaluate(() => {
  const pinned = document.querySelector('[data-process-pinned]');
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

  return {
    viewportWidth: window.innerWidth,
    isMobileFlag: window.innerWidth < 992,
    stCount,
    processSTPinned,
    hasPinSpacer: !!pinSpacer,
    pinSpacerHeight: pinSpacer ? getComputedStyle(pinSpacer).height : null,
    pinnedDisplay: pinned ? getComputedStyle(pinned).display : null,
    pinnedHeight: pinned ? getComputedStyle(pinned).height : null,
    pinnedPosition: pinned ? getComputedStyle(pinned).position : null,
    cardCount: cards.length,
    firstCardOpacity: cards[0] ? getComputedStyle(cards[0]).opacity : null,
  };
});

console.log('=== LIVE SITE — DESKTOP ===');
console.log(JSON.stringify(debug, null, 2));

// Scroll to process section
const procEl = await page.$('#about-process');
if (procEl) {
  await procEl.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'ss-live-desktop-0.png' });
  console.log('Saved: ss-live-desktop-0.png');

  for (let i = 1; i <= 4; i++) {
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `ss-live-desktop-${i}.png` });
    console.log(`Saved: ss-live-desktop-${i}.png`);
  }
}

await browser.close();
console.log('\nDone!');
