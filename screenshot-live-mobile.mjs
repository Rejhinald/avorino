import { chromium } from 'playwright';

const browser = await chromium.launch();

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile',  width: 375,  height: 812 },
];

for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();

  await page.goto('https://avorino.webflow.io/about', { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(4000);

  const info = await page.evaluate(() => {
    const pinned = document.querySelector('[data-process-pinned]');
    const cards = document.querySelectorAll('[data-process-card]');
    const pinSpacer = document.querySelector('.pin-spacer');
    const cardsWrap = document.querySelector('[data-process-cards]');

    let processSTPinned = false;
    try {
      const allST = window.ScrollTrigger?.getAll() || [];
      allST.forEach(st => {
        const trigger = st.trigger || st.vars?.trigger;
        if (trigger && trigger.hasAttribute && trigger.hasAttribute('data-process-pinned')) {
          processSTPinned = true;
        }
      });
    } catch (e) {}

    return {
      width: window.innerWidth,
      isMobile: window.innerWidth < 992,
      processSTPinned,
      hasPinSpacer: !!pinSpacer,
      pinnedHeight: pinned ? getComputedStyle(pinned).height : null,
      pinnedDisplay: pinned ? getComputedStyle(pinned).display : null,
      cardsWrapDisplay: cardsWrap ? getComputedStyle(cardsWrap).display : null,
      cardsWrapGap: cardsWrap ? getComputedStyle(cardsWrap).gap : null,
      cardCount: cards.length,
      cardsAllVisible: Array.from(cards).every(c => parseFloat(getComputedStyle(c).opacity) > 0.5),
      firstCardPos: cards[0] ? getComputedStyle(cards[0]).position : null,
    };
  });

  console.log(`\n=== ${vp.name.toUpperCase()} (${vp.width}px) ===`);
  console.log(`  isMobile: ${info.isMobile}`);
  console.log(`  ScrollTrigger pinned: ${info.processSTPinned}`);
  console.log(`  .pin-spacer exists: ${info.hasPinSpacer}`);
  console.log(`  pinned height: ${info.pinnedHeight}`);
  console.log(`  pinned display: ${info.pinnedDisplay}`);
  console.log(`  cards wrap display: ${info.cardsWrapDisplay}`);
  console.log(`  cards wrap gap: ${info.cardsWrapGap}`);
  console.log(`  all cards visible: ${info.cardsAllVisible}`);
  console.log(`  first card position: ${info.firstCardPos}`);

  // Screenshot process section
  const proc = await page.$('#about-process');
  if (proc) {
    await proc.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `ss-live-${vp.name}-process.png` });
    console.log(`  Saved: ss-live-${vp.name}-process.png`);
  }

  await ctx.close();
}

await browser.close();
console.log('\nDone!');
