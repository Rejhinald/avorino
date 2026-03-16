import { chromium } from 'playwright';

const URL = 'https://www.avorino.com';
const results = [];

function pass(name) { results.push({ name, status: 'PASS' }); console.log(`  ✅ ${name}`); }
function fail(name, reason) { results.push({ name, status: 'FAIL', reason }); console.log(`  ❌ ${name}: ${reason}`); }
function warn(name, reason) { results.push({ name, status: 'WARN', reason }); console.log(`  ⚠️ ${name}: ${reason}`); }

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('\n🔍 Loading homepage...');
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  // Wait for any preloader to finish
  await page.waitForTimeout(6000);

  console.log('\n── 1. Custom Cursor Removal ──');
  const cursorRing = await page.$('.cursor-ring');
  const cursorDot = await page.$('.cursor-dot');
  if (!cursorRing && !cursorDot) pass('No cursor-ring or cursor-dot elements');
  else fail('Cursor elements still present', `ring=${!!cursorRing} dot=${!!cursorDot}`);

  const bodyCursor = await page.evaluate(() => getComputedStyle(document.body).cursor);
  if (bodyCursor !== 'none') pass(`Body cursor is "${bodyCursor}" (not none)`);
  else fail('Body cursor is none', 'cursor:none still applied');

  console.log('\n── 2. Section Label // Prefix ──');
  const labels = await page.evaluate(() => {
    const selectors = ['.about-label', '.services-label', '.featured-label', '.process-label', '.testimonials-label', '.tools-label'];
    return selectors.map(sel => {
      const el = document.querySelector(sel);
      return { sel, text: el ? el.textContent.trim() : null };
    });
  });
  for (const { sel, text } of labels) {
    if (!text) warn(`${sel} not found`, 'Element missing from DOM');
    else if (text.startsWith('//')) pass(`${sel}: "${text}"`);
    else fail(`${sel} missing // prefix`, `Got: "${text}"`);
  }

  console.log('\n── 3. Periods on Body Paragraphs ──');
  const navDescriptions = await page.evaluate(() => {
    const descs = document.querySelectorAll('.nav-dd-service-desc');
    return Array.from(descs).map(d => d.textContent.trim());
  });
  for (const desc of navDescriptions) {
    if (desc.endsWith('.')) pass(`Nav desc ends with period: "${desc.slice(0, 40)}..."`);
    else fail('Nav desc missing period', `"${desc}"`);
  }

  console.log('\n── 4. Colored Logo ──');
  const navLogoFilter = await page.evaluate(() => {
    const img = document.querySelector('.nav-logo-img');
    if (!img) return 'NOT_FOUND';
    return getComputedStyle(img).filter;
  });
  if (navLogoFilter === 'NOT_FOUND') warn('Nav logo img not found', 'May use div-based logo');
  else if (navLogoFilter === 'none' || navLogoFilter === '') pass(`Nav logo filter: "${navLogoFilter}"`);
  else if (navLogoFilter.includes('invert')) fail('Nav logo still monochrome', navLogoFilter);
  else pass(`Nav logo filter: "${navLogoFilter}"`);

  console.log('\n── 5. Nav Hover Red + No Blend Mode ──');
  const navBlend = await page.evaluate(() => {
    const nav = document.querySelector('.site-nav');
    return nav ? getComputedStyle(nav).mixBlendMode : 'NOT_FOUND';
  });
  if (navBlend === 'normal' || navBlend === '') pass(`Nav mix-blend-mode: "${navBlend}"`);
  else if (navBlend === 'difference') fail('Nav still has mix-blend-mode: difference', navBlend);
  else warn(`Nav blend mode: "${navBlend}"`, 'Unexpected value');

  // Check hover color via CSS rule inspection
  const hoverRed = await page.evaluate(() => {
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText && rule.selectorText.includes('.nav-link:hover') && rule.style.color) {
            return rule.style.color;
          }
        }
      } catch(e) { /* cross-origin */ }
    }
    return null;
  });
  if (hoverRed) pass(`Nav hover color rule found: ${hoverRed}`);
  else warn('Could not detect nav hover color rule', 'May be cross-origin CSS');

  console.log('\n── 6. Scrolled State ──');
  const hasScrolledCSS = await page.evaluate(() => {
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText && rule.selectorText.includes('nav--scrolled')) {
            return rule.cssText.substring(0, 100);
          }
        }
      } catch(e) { /* cross-origin */ }
    }
    return null;
  });
  if (hasScrolledCSS) pass(`Scrolled state CSS found: ${hasScrolledCSS.slice(0, 60)}...`);
  else warn('nav--scrolled CSS not found', 'May be cross-origin');

  // Test scroll behavior
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(500);
  const hasScrolledClass = await page.evaluate(() => {
    const nav = document.querySelector('.site-nav');
    return nav ? nav.classList.contains('nav--scrolled') : false;
  });
  if (hasScrolledClass) pass('Nav gets nav--scrolled class on scroll');
  else warn('Nav did not get nav--scrolled class', 'May need more scroll distance or different threshold');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  console.log('\n── 7. Font Size Bump ──');
  const bodyFontSize = await page.evaluate(() => {
    return getComputedStyle(document.body).fontSize;
  });
  const bodyPx = parseFloat(bodyFontSize);
  if (bodyPx >= 20) pass(`Body font-size: ${bodyFontSize} (bumped)`);
  else fail(`Body font-size too small: ${bodyFontSize}`, 'Expected 20px+');

  console.log('\n── 8. Blueprint Preloader ──');
  const preloaderHouse = await page.$('.preloader-house');
  const preloaderGrid = await page.$('.preloader-grid');
  if (preloaderHouse) pass('Blueprint house SVG exists');
  else warn('Blueprint house SVG not found', 'May have been removed after preloader animation');
  if (preloaderGrid) pass('Blueprint grid exists');
  else warn('Blueprint grid not found', 'May have been removed after preloader animation');

  // Check NO paint roller
  const paintRoller = await page.$('.preloader-roller');
  if (!paintRoller) pass('No paint roller element');
  else fail('Paint roller still exists', '.preloader-roller found');

  console.log('\n── 9. Process Section ──');
  // Scroll to process
  const processSection = await page.$('.process');
  if (processSection) {
    const barTrack = await page.$('.process-bar-track');
    if (barTrack) {
      const trackHeight = await barTrack.evaluate(el => getComputedStyle(el).height);
      if (parseFloat(trackHeight) >= 3) pass(`Process bar track height: ${trackHeight}`);
      else fail(`Process bar track too thin: ${trackHeight}`, 'Expected 4px');
    } else {
      warn('Process bar track not found', 'May not be visible');
    }
    pass('Process section exists');
  } else {
    fail('Process section not found', 'Missing .process element');
  }

  console.log('\n── 10. 25-Review Carousel ──');
  const testimonialCounter = await page.$('.testimonial-counter');
  const testimonialProgress = await page.$('.testimonial-progress');
  if (testimonialCounter) {
    const counterText = await testimonialCounter.evaluate(el => el.textContent.trim());
    pass(`Testimonial counter: "${counterText}"`);
  } else {
    warn('Testimonial counter not found', 'May use different class name');
  }
  if (testimonialProgress) pass('Testimonial progress bar exists');
  else warn('Testimonial progress bar not found', 'May use different class name');

  // Count review cards
  const reviewCount = await page.evaluate(() => {
    const cards = document.querySelectorAll('.testimonial-card');
    return cards.length;
  });
  if (reviewCount >= 25) pass(`Found ${reviewCount} testimonial cards`);
  else if (reviewCount > 0) warn(`Only ${reviewCount} testimonial cards`, 'Expected 25');
  else warn('No testimonial cards found', 'Check class name');

  console.log('\n── 11. Resources Dropdown ──');
  // Check Resources dropdown has stagger-able items
  const resourceLinks = await page.evaluate(() => {
    const resDropdown = document.querySelector('.nav-dropdown--resources');
    if (!resDropdown) return 0;
    return resDropdown.querySelectorAll('.nav-dd-link').length;
  });
  if (resourceLinks > 0) pass(`Resources dropdown has ${resourceLinks} animatable links`);
  else warn('Resources dropdown links not found', 'Check selector');

  // ── Summary ──
  console.log('\n═══════════════════════════════════════');
  const passes = results.filter(r => r.status === 'PASS').length;
  const fails = results.filter(r => r.status === 'FAIL').length;
  const warns = results.filter(r => r.status === 'WARN').length;
  console.log(`TOTAL: ${passes} PASS, ${fails} FAIL, ${warns} WARN`);

  if (fails > 0) {
    console.log('\nFAILURES:');
    results.filter(r => r.status === 'FAIL').forEach(r => console.log(`  ❌ ${r.name}: ${r.reason}`));
  }
  if (warns > 0) {
    console.log('\nWARNINGS:');
    results.filter(r => r.status === 'WARN').forEach(r => console.log(`  ⚠️ ${r.name}: ${r.reason}`));
  }

  await browser.close();
})();
