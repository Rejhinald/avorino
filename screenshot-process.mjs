import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

page.on('pageerror', err => console.log('PAGE EXCEPTION:', err.message));

// Intercept the CDN request for process3d.js and serve the local file instead
const localProcess3d = readFileSync(resolve('avorino-about-process3d.js'), 'utf-8');
await page.route('**/avorino-about-process3d.js', route => {
  console.log('INTERCEPTED CDN request — serving local process3d.js');
  route.fulfill({ contentType: 'application/javascript', body: localProcess3d });
});

await page.goto('https://avorino.webflow.io/about', { waitUntil: 'networkidle', timeout: 45000 });
await page.waitForTimeout(3000);

// INJECT FIX: Remove perspective from body
await page.evaluate(() => { document.body.style.perspective = 'none'; });
await page.waitForTimeout(500);

// Check how many ScrollTriggers exist and find the process one
const stInfo = await page.evaluate(() => {
  const allST = ScrollTrigger.getAll();
  const processST = allST.find(st => {
    const trigger = st.trigger || st.vars?.trigger;
    return trigger && trigger.hasAttribute && trigger.hasAttribute('data-process-pinned');
  });
  return {
    totalScrollTriggers: allST.length,
    processSTFound: !!processST,
    processSTPin: processST ? processST.pin : null,
    processSTStart: processST ? processST.start : null,
    processSTEnd: processST ? processST.end : null,
    navDots: document.querySelectorAll('.about-process-nav-dot').length,
    hasCanvas: !!document.querySelector('[data-process-visual] canvas'),
  };
});
console.log('ScrollTrigger info:', JSON.stringify(stInfo, null, 2));

// Refresh ScrollTrigger after perspective fix
await page.evaluate(() => { ScrollTrigger.refresh(true); });
await page.waitForTimeout(1000);

// Get the pin start position
const pinStart = await page.evaluate(() => {
  const allST = ScrollTrigger.getAll();
  const processST = allST.find(st => {
    const trigger = st.trigger || st.vars?.trigger;
    return trigger && trigger.hasAttribute && trigger.hasAttribute('data-process-pinned');
  });
  if (!processST) return { error: 'no process ScrollTrigger found' };
  return {
    start: processST.start,
    end: processST.end,
    pinned: processST.pin ? true : false,
    progress: processST.progress,
    isActive: processST.isActive,
  };
});
console.log('Pin positions:', JSON.stringify(pinStart));

if (pinStart.error) {
  console.log('ERROR: No process ScrollTrigger - aborting');
  await browser.close();
  process.exit(1);
}

// Scroll to each of the 6 steps by setting exact scroll positions
const scrollStart = pinStart.start;
const scrollRange = pinStart.end - pinStart.start;
const totalSteps = 6;

for (let step = 0; step < totalSteps; step++) {
  const progress = step / (totalSteps - 1); // 0, 0.2, 0.4, 0.6, 0.8, 1.0
  const targetScroll = scrollStart + progress * scrollRange;

  // Use Lenis.scrollTo for smooth native-like scrolling
  await page.evaluate((scrollPos) => {
    window.scrollTo(0, scrollPos);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
  }, targetScroll);

  await page.waitForTimeout(2000); // Wait for animations

  const state = await page.evaluate(() => {
    const cards = document.querySelectorAll('[data-process-card]');
    const activeDot = document.querySelector('.about-process-nav-dot.is-active');
    const pinned = document.querySelector('[data-process-pinned]');
    const canvas = document.querySelector('[data-process-visual] canvas');
    const fxEl = document.querySelector('[data-process-fx]');
    let activeCard = -1;
    cards.forEach((c, i) => {
      if (parseFloat(getComputedStyle(c).opacity) > 0.5) activeCard = i;
    });
    return {
      activeCard,
      activeDot: activeDot ? activeDot.getAttribute('data-dot') : 'none',
      pinnedPosition: pinned ? getComputedStyle(pinned).position : 'N/A',
      pinnedTop: pinned ? pinned.getBoundingClientRect().top : 'N/A',
      canvasOpacity: canvas ? getComputedStyle(canvas).opacity : 'no canvas',
      fxChildren: fxEl ? fxEl.children.length : 0,
      scrollY: window.scrollY,
    };
  });
  console.log(`Step ${step} (progress=${progress.toFixed(1)}): card=${state.activeCard}, dot=${state.activeDot}, pin=${state.pinnedPosition}, pinTop=${typeof state.pinnedTop === 'number' ? state.pinnedTop.toFixed(0) : state.pinnedTop}, canvas=${state.canvasOpacity}`);

  await page.screenshot({ path: `ss-proc-step${step}.png` });
}

await browser.close();
console.log('Done!');
