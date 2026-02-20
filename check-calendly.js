const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://avorino.com/schedule-a-meeting', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'schedule-full.png', fullPage: true });
  console.log('Full page screenshot saved');

  // Check for calendly iframe
  const frames = page.frames();
  console.log('Frames found:', frames.length);
  for (const f of frames) {
    console.log('Frame:', f.url().substring(0, 100));
  }

  // Check the calendly container dimensions
  const dims = await page.evaluate(() => {
    const calendlyEl = document.querySelector('.calendly-inline-widget')
      || document.querySelector('[class*="calendly"]')
      || document.querySelector('iframe[src*="calendly"]');
    if (!calendlyEl) return 'No calendly element found';
    const rect = calendlyEl.getBoundingClientRect();
    const style = getComputedStyle(calendlyEl);
    const parent = calendlyEl.parentElement;
    const parentStyle = parent ? getComputedStyle(parent) : null;
    const grandparent = parent ? parent.parentElement : null;
    const gpStyle = grandparent ? getComputedStyle(grandparent) : null;
    return {
      tag: calendlyEl.tagName,
      class: calendlyEl.className,
      width: rect.width,
      height: rect.height,
      overflow: style.overflow,
      maxHeight: style.maxHeight,
      minHeight: style.minHeight,
      parentTag: parent ? parent.tagName : 'N/A',
      parentClass: parent ? parent.className : 'N/A',
      parentOverflow: parentStyle ? parentStyle.overflow : 'N/A',
      parentHeight: parent ? parent.getBoundingClientRect().height : 'N/A',
      gpTag: grandparent ? grandparent.tagName : 'N/A',
      gpClass: grandparent ? grandparent.className : 'N/A',
      gpOverflow: gpStyle ? gpStyle.overflow : 'N/A',
      gpHeight: grandparent ? grandparent.getBoundingClientRect().height : 'N/A',
    };
  });
  console.log('Calendly element:', JSON.stringify(dims, null, 2));

  // Also check all ancestors for overflow:hidden
  const overflowChain = await page.evaluate(() => {
    const calendlyEl = document.querySelector('.calendly-inline-widget')
      || document.querySelector('[class*="calendly"]')
      || document.querySelector('iframe[src*="calendly"]');
    if (!calendlyEl) return 'No calendly element';
    const chain = [];
    let el = calendlyEl;
    while (el) {
      const s = getComputedStyle(el);
      if (s.overflow !== 'visible' || s.maxHeight !== 'none') {
        chain.push({
          tag: el.tagName,
          class: (el.className || '').substring(0, 60),
          overflow: s.overflow,
          maxHeight: s.maxHeight,
          height: el.getBoundingClientRect().height,
        });
      }
      el = el.parentElement;
    }
    return chain;
  });
  console.log('Overflow chain:', JSON.stringify(overflowChain, null, 2));

  await browser.close();
})();
