import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const SCREENSHOTS_DIR = resolve('C:/Users/Admin/Documents/Work Repo/avorino/screenshots');
mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const bugs = [];

function log(msg) {
  console.log(msg);
}

function bug(severity, section, description) {
  const entry = { severity, section, description };
  bugs.push(entry);
  console.log(`[${severity}] ${section}: ${description}`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const filePath = 'file:///' + resolve('C:/Users/Admin/Documents/Work Repo/avorino/avorino-v6-preview.html').replace(/\\/g, '/');
  log(`Loading: ${filePath}`);
  await page.goto(filePath, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {
    log('Warning: networkidle timeout, continuing...');
  });

  // ══════════════════════════════════════════════
  // 1. PRELOADER STATE
  // ══════════════════════════════════════════════
  log('\n=== CHECKING PRELOADER ===');
  const preloaderVisible = await page.isVisible('.preloader');
  log(`Preloader visible on load: ${preloaderVisible}`);

  // Wait for preloader to finish (up to 8s)
  try {
    await page.waitForSelector('.preloader', { state: 'hidden', timeout: 8000 });
    log('Preloader dismissed successfully');
  } catch {
    bug('CRITICAL', 'Preloader', 'Preloader did NOT dismiss within 8 seconds — page is stuck behind black screen');
    // Try to force-hide it so we can test the rest
    await page.evaluate(() => {
      const p = document.querySelector('.preloader');
      if (p) p.style.display = 'none';
    });
  }

  // Screenshot after preloader
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/01-hero-after-preloader.png`, fullPage: false });
  log('Screenshot: hero after preloader');

  // ══════════════════════════════════════════════
  // 2. HERO SECTION CHECKS
  // ══════════════════════════════════════════════
  log('\n=== CHECKING HERO ===');

  // Check hero image loaded
  const heroImageBg = await page.evaluate(() => {
    const el = document.querySelector('.hero-image');
    if (!el) return 'MISSING';
    const style = getComputedStyle(el);
    return style.backgroundImage;
  });
  if (heroImageBg === 'MISSING' || heroImageBg === 'none') {
    bug('CRITICAL', 'Hero', 'Hero image background is missing or not loaded');
  } else {
    log(`Hero image background: ${heroImageBg.substring(0, 80)}...`);
  }

  // Check hero title visibility
  const heroTitleState = await page.evaluate(() => {
    const el = document.querySelector('.hero-title');
    if (!el) return { exists: false };
    const chars = el.querySelectorAll('.char');
    const visibleChars = Array.from(chars).filter(c => {
      const style = getComputedStyle(c);
      return parseFloat(style.opacity) > 0.5;
    });
    return {
      exists: true,
      text: el.textContent.trim(),
      totalChars: chars.length,
      visibleChars: visibleChars.length,
      opacity: getComputedStyle(el).opacity,
    };
  });
  log(`Hero title: "${heroTitleState.text}" — ${heroTitleState.visibleChars}/${heroTitleState.totalChars} chars visible`);
  if (heroTitleState.totalChars > 0 && heroTitleState.visibleChars < heroTitleState.totalChars * 0.5) {
    bug('MAJOR', 'Hero', `Hero title only ${heroTitleState.visibleChars}/${heroTitleState.totalChars} chars visible — animation may not have completed`);
  }

  // Check hero white color violation
  const heroTitleColor = await page.evaluate(() => {
    const el = document.querySelector('.hero-title');
    return el ? getComputedStyle(el).color : 'MISSING';
  });
  log(`Hero title color: ${heroTitleColor}`);
  if (heroTitleColor.includes('255, 255, 255')) {
    bug('MINOR', 'Hero', 'Hero title uses pure #fff instead of spec warm-white #f0ede8');
  }

  // Check hero cream frame
  const heroFrame = await page.evaluate(() => {
    const hero = document.querySelector('.hero');
    if (!hero) return null;
    const style = getComputedStyle(hero);
    return {
      paddingTop: style.paddingTop,
      paddingLeft: style.paddingLeft,
      paddingRight: style.paddingRight,
      paddingBottom: style.paddingBottom,
    };
  });
  log(`Hero padding (cream frame): ${JSON.stringify(heroFrame)}`);
  if (heroFrame && parseFloat(heroFrame.paddingLeft) < 40) {
    bug('MAJOR', 'Hero', `Cream frame too thin: ${heroFrame.paddingLeft} (spec: 48px)`);
  }

  // Check nav visibility
  const navState = await page.evaluate(() => {
    const nav = document.querySelector('.nav');
    if (!nav) return { exists: false };
    return {
      exists: true,
      opacity: getComputedStyle(nav).opacity,
      display: getComputedStyle(nav).display,
    };
  });
  log(`Nav: opacity=${navState.opacity}, display=${navState.display}`);
  if (navState.exists && parseFloat(navState.opacity) < 0.5) {
    bug('MAJOR', 'Nav', `Navigation is nearly invisible (opacity: ${navState.opacity}) — JS animation may have failed`);
  }

  // ══════════════════════════════════════════════
  // 3. SCROLL THROUGH ALL SECTIONS & SCREENSHOT
  // ══════════════════════════════════════════════
  log('\n=== SCROLLING THROUGH SECTIONS ===');

  // Full page screenshot first
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/00-full-page.png`, fullPage: true });
  log('Screenshot: full page');

  const sections = [
    { name: 'about', selector: '.about' },
    { name: 'services', selector: '.services' },
    { name: 'stats', selector: '.stats' },
    { name: 'featured', selector: '.featured' },
    { name: 'process', selector: '.process' },
    { name: 'testimonials', selector: '.testimonials' },
    { name: 'tools', selector: '.tools' },
    { name: 'cta', selector: '.cta-section' },
    { name: 'footer', selector: '.footer' },
  ];

  for (let i = 0; i < sections.length; i++) {
    const { name, selector } = sections[i];
    const exists = await page.$(selector);
    if (!exists) {
      bug('CRITICAL', name, `Section "${selector}" not found in DOM`);
      continue;
    }

    // Scroll to section
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    }, selector);
    await page.waitForTimeout(800);

    // Screenshot
    await page.screenshot({
      path: `${SCREENSHOTS_DIR}/02-${String(i + 1).padStart(2, '0')}-${name}.png`,
      fullPage: false,
    });
    log(`Screenshot: ${name}`);
  }

  // ══════════════════════════════════════════════
  // 4. ABOUT SECTION CHECKS
  // ══════════════════════════════════════════════
  log('\n=== CHECKING ABOUT SECTION ===');

  const aboutHeadingState = await page.evaluate(() => {
    const heading = document.querySelector('.about-heading');
    if (!heading) return null;
    const lines = heading.querySelectorAll('.line');
    return {
      text: heading.textContent.trim(),
      lineCount: lines.length,
      lineClips: Array.from(lines).map(l => getComputedStyle(l).clipPath),
    };
  });
  if (aboutHeadingState) {
    log(`About heading: "${aboutHeadingState.text}" (${aboutHeadingState.lineCount} lines)`);
    log(`  Line clip-paths: ${JSON.stringify(aboutHeadingState.lineClips)}`);
    const allClipped = aboutHeadingState.lineClips.every(cp => cp.includes('100%'));
    if (allClipped) {
      bug('MAJOR', 'About', 'About heading lines still fully clipped (clip-path inset 100%) — line-wipe animation never fired');
    }
  }

  // Check about body text max-width
  const aboutBodyWidth = await page.evaluate(() => {
    const el = document.querySelector('.about-body');
    if (!el) return null;
    return {
      computedWidth: el.getBoundingClientRect().width,
      maxWidth: getComputedStyle(el).maxWidth,
      lineHeight: getComputedStyle(el).lineHeight,
    };
  });
  if (aboutBodyWidth) {
    log(`About body: width=${aboutBodyWidth.computedWidth}px, max-width=${aboutBodyWidth.maxWidth}, line-height=${aboutBodyWidth.lineHeight}`);
    if (aboutBodyWidth.computedWidth > 530) {
      bug('MINOR', 'About', `Body text width ${aboutBodyWidth.computedWidth}px exceeds 520px max`);
    }
  }

  // ══════════════════════════════════════════════
  // 5. SERVICES SECTION CHECKS
  // ══════════════════════════════════════════════
  log('\n=== CHECKING SERVICES SECTION ===');

  const servicesState = await page.evaluate(() => {
    const section = document.querySelector('.services');
    if (!section) return null;

    const images = section.querySelectorAll('.service-img');
    const texts = section.querySelectorAll('.service-text');
    const activeImg = section.querySelector('.service-img.active');
    const activeText = section.querySelector('.service-text.active');

    return {
      sectionHeight: section.getBoundingClientRect().height,
      imageCount: images.length,
      textCount: texts.length,
      hasActiveImage: !!activeImg,
      hasActiveText: !!activeText,
      activeImageIndex: activeImg ? activeImg.dataset.index : null,
      activeTextIndex: activeText ? activeText.dataset.index : null,
      isPinned: section.classList.contains('pin-spacer') || !!section.closest('.pin-spacer'),
      // Check if images have actual content
      imageBackgrounds: Array.from(images).map(img => {
        const placeholder = img.querySelector('.img-placeholder');
        return placeholder ? placeholder.style.background.substring(0, 60) : 'no-placeholder';
      }),
    };
  });

  if (servicesState) {
    log(`Services: ${servicesState.imageCount} images, ${servicesState.textCount} texts`);
    log(`  Active image: ${servicesState.activeImageIndex}, Active text: ${servicesState.activeTextIndex}`);
    log(`  Section height: ${servicesState.sectionHeight}px`);
    log(`  Image backgrounds: ${JSON.stringify(servicesState.imageBackgrounds)}`);

    if (!servicesState.hasActiveImage) {
      bug('CRITICAL', 'Services', 'No active service image — first image should have .active class');
    }
    if (!servicesState.hasActiveText) {
      bug('CRITICAL', 'Services', 'No active service text — first text should have .active class');
    }
  }

  // ══════════════════════════════════════════════
  // 6. STATS / FLIP CLOCK CHECKS
  // ══════════════════════════════════════════════
  log('\n=== CHECKING STATS SECTION ===');

  // Scroll to stats
  await page.evaluate(() => {
    const el = document.querySelector('.stats');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(2000); // Wait for flip animations

  const statsState = await page.evaluate(() => {
    const section = document.querySelector('.stats');
    if (!section) return null;

    const flipCards = section.querySelectorAll('.flip-card');
    const statItems = section.querySelectorAll('.stat-item');

    const cardStates = Array.from(flipCards).map(card => {
      const topSpan = card.querySelector('.flip-card-top span');
      const bottomSpan = card.querySelector('.flip-card-bottom span');
      return {
        targetDigit: card.dataset.digit,
        topValue: topSpan ? topSpan.textContent : 'MISSING',
        bottomValue: bottomSpan ? bottomSpan.textContent : 'MISSING',
      };
    });

    const suffixStates = Array.from(section.querySelectorAll('.stat-suffix')).map(s => ({
      text: s.textContent,
      opacity: getComputedStyle(s).opacity,
    }));

    const labelStates = Array.from(section.querySelectorAll('.stat-label')).map(l => ({
      text: l.textContent,
      letterSpacing: getComputedStyle(l).letterSpacing,
    }));

    return {
      bgColor: getComputedStyle(section).backgroundColor,
      flipCardCount: flipCards.length,
      statItemCount: statItems.length,
      cardStates,
      suffixStates,
      labelStates,
    };
  });

  if (statsState) {
    log(`Stats: ${statsState.statItemCount} items, ${statsState.flipCardCount} flip cards`);
    log(`  Background: ${statsState.bgColor}`);
    log(`  Card values: ${statsState.cardStates.map(c => `${c.topValue}/${c.bottomValue} (target:${c.targetDigit})`).join(', ')}`);
    log(`  Suffixes: ${statsState.suffixStates.map(s => `"${s.text}" opacity:${s.opacity}`).join(', ')}`);

    // Check if flip animation completed
    const allZero = statsState.cardStates.every(c => c.topValue === '0' && c.bottomValue === '0');
    if (allZero) {
      bug('CRITICAL', 'Stats', 'All flip clock digits are still at 0 — flip animation never triggered');
    }

    // Check suffixes visibility
    const hiddenSuffixes = statsState.suffixStates.filter(s => parseFloat(s.opacity) < 0.5);
    if (hiddenSuffixes.length > 0) {
      bug('MAJOR', 'Stats', `${hiddenSuffixes.length} suffix(es) still hidden (opacity < 0.5) — suffix fade-in may not have triggered`);
    }
  }

  await page.screenshot({ path: `${SCREENSHOTS_DIR}/03-stats-after-scroll.png`, fullPage: false });

  // ══════════════════════════════════════════════
  // 7. FEATURED PROJECT CHECKS
  // ══════════════════════════════════════════════
  log('\n=== CHECKING FEATURED PROJECT ===');

  await page.evaluate(() => {
    const el = document.querySelector('.featured');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(1500);

  const featuredState = await page.evaluate(() => {
    const imageWrap = document.querySelector('.featured-image-wrap');
    const panel = document.querySelector('.featured-panel');
    const image = document.querySelector('.featured-image');

    return {
      imageClipPath: imageWrap ? getComputedStyle(imageWrap).clipPath : 'MISSING',
      panelOpacity: panel ? getComputedStyle(panel).opacity : 'MISSING',
      panelTransform: panel ? getComputedStyle(panel).transform : 'MISSING',
      imageHasContent: image ? (image.src || image.style.background || getComputedStyle(image).backgroundImage) : 'MISSING',
      imageBg: image ? getComputedStyle(image).backgroundImage : 'none',
    };
  });

  log(`Featured image clip-path: ${featuredState.imageClipPath}`);
  log(`Featured panel opacity: ${featuredState.panelOpacity}`);
  log(`Featured image bg: ${featuredState.imageBg}`);

  if (featuredState.imageClipPath && featuredState.imageClipPath.includes('100%')) {
    bug('MAJOR', 'Featured', 'Featured image still fully clipped (clip-path inset 100%) — reveal-curtain animation never fired');
  }
  if (featuredState.panelOpacity !== 'MISSING' && parseFloat(featuredState.panelOpacity) < 0.5) {
    bug('MAJOR', 'Featured', `Featured panel still hidden (opacity: ${featuredState.panelOpacity}) — fade-up animation never fired`);
  }
  if (featuredState.imageBg === 'none' || featuredState.imageBg === '') {
    bug('CRITICAL', 'Featured', 'Featured project has NO image — just a gradient placeholder');
  }

  // ══════════════════════════════════════════════
  // 8. TESTIMONIALS CHECKS
  // ══════════════════════════════════════════════
  log('\n=== CHECKING TESTIMONIALS ===');

  await page.evaluate(() => {
    const el = document.querySelector('.testimonials');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(800);

  const testimonialState = await page.evaluate(() => {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    const activeSlide = document.querySelector('.testimonial-slide.active');
    const activeDot = document.querySelector('.testimonial-dot.active');

    return {
      slideCount: slides.length,
      dotCount: dots.length,
      hasActiveSlide: !!activeSlide,
      hasActiveDot: !!activeDot,
      activeSlideIndex: activeSlide ? activeSlide.dataset.slide : null,
      activeQuote: activeSlide ? activeSlide.querySelector('.testimonial-quote')?.textContent.substring(0, 60) : null,
    };
  });

  log(`Testimonials: ${testimonialState.slideCount} slides, ${testimonialState.dotCount} dots`);
  log(`  Active slide: ${testimonialState.activeSlideIndex}, quote: "${testimonialState.activeQuote}..."`);

  if (!testimonialState.hasActiveSlide) {
    bug('CRITICAL', 'Testimonials', 'No active testimonial slide visible');
  }
  if (testimonialState.slideCount !== testimonialState.dotCount) {
    bug('MINOR', 'Testimonials', `Slide count (${testimonialState.slideCount}) doesn't match dot count (${testimonialState.dotCount})`);
  }

  // Test dot navigation
  const dotNavWorks = await page.evaluate(() => {
    const dot1 = document.querySelector('.testimonial-dot[data-goto="1"]');
    if (!dot1) return false;
    dot1.click();
    return true;
  });
  await page.waitForTimeout(1000);

  const afterDotClick = await page.evaluate(() => {
    const activeSlide = document.querySelector('.testimonial-slide.active');
    const activeDot = document.querySelector('.testimonial-dot.active');
    return {
      activeSlideIndex: activeSlide ? activeSlide.dataset.slide : null,
      activeDotIndex: activeDot ? activeDot.dataset.goto : null,
    };
  });
  log(`After clicking dot 1: active slide=${afterDotClick.activeSlideIndex}, active dot=${afterDotClick.activeDotIndex}`);
  if (afterDotClick.activeSlideIndex !== '1') {
    bug('MAJOR', 'Testimonials', 'Dot navigation not working — clicking dot 1 did not switch to slide 1');
  }

  // ══════════════════════════════════════════════
  // 9. TOOLS CARDS CHECKS
  // ══════════════════════════════════════════════
  log('\n=== CHECKING TOOLS SECTION ===');

  const toolsState = await page.evaluate(() => {
    const cards = document.querySelectorAll('.tool-card');
    return Array.from(cards).map((card, i) => {
      const rect = card.getBoundingClientRect();
      const style = getComputedStyle(card);
      return {
        index: i,
        width: rect.width,
        y: rect.y,
        opacity: style.opacity,
        transform: style.transform,
        border: style.border,
      };
    });
  });

  if (toolsState.length > 0) {
    log(`Tools: ${toolsState.length} cards`);
    toolsState.forEach(c => {
      log(`  Card ${c.index}: width=${c.width.toFixed(0)}px, y=${c.y.toFixed(0)}px, opacity=${c.opacity}`);
    });

    // Check stagger — cards should have different Y positions
    if (toolsState.length >= 3) {
      const yValues = toolsState.map(c => c.y);
      const allSameY = yValues.every(y => Math.abs(y - yValues[0]) < 5);
      if (allSameY) {
        bug('MINOR', 'Tools', 'Tool cards are NOT staggered vertically — all at same Y position (spec requires cascading offset)');
      }
    }
  }

  // ══════════════════════════════════════════════
  // 10. CTA SECTION CHECKS
  // ══════════════════════════════════════════════
  log('\n=== CHECKING CTA SECTION ===');

  await page.evaluate(() => {
    const el = document.querySelector('.cta-section');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(800);

  const ctaState = await page.evaluate(() => {
    const container = document.querySelector('.cta-container');
    const bg = document.querySelector('.cta-bg');
    const title = document.querySelector('.cta-title');

    return {
      containerHeight: container ? container.getBoundingClientRect().height : 0,
      bgImage: bg ? getComputedStyle(bg).backgroundImage : 'none',
      titleText: title ? title.textContent.trim() : 'MISSING',
      containerBorderRadius: container ? getComputedStyle(container).borderRadius : 'none',
    };
  });

  log(`CTA: height=${ctaState.containerHeight}px, border-radius=${ctaState.containerBorderRadius}`);
  log(`  BG image: ${ctaState.bgImage.substring(0, 60)}...`);

  if (ctaState.containerHeight < 400) {
    bug('MINOR', 'CTA', `CTA container height ${ctaState.containerHeight}px — should be min-height 56vh (~504px)`);
  }

  // ══════════════════════════════════════════════
  // 11. CSS CONSISTENCY CHECKS
  // ══════════════════════════════════════════════
  log('\n=== CHECKING CSS CONSISTENCY ===');

  const cssChecks = await page.evaluate(() => {
    const results = {};

    // Check all section paddings
    const sectionSelectors = ['.about', '.stats', '.featured', '.process', '.testimonials', '.tools'];
    results.sectionPadding = sectionSelectors.map(sel => {
      const el = document.querySelector(sel);
      if (!el) return { selector: sel, padding: 'NOT_FOUND' };
      const style = getComputedStyle(el);
      return {
        selector: sel,
        paddingTop: style.paddingTop,
        paddingBottom: style.paddingBottom,
        paddingLeft: style.paddingLeft,
        paddingRight: style.paddingRight,
      };
    });

    // Check body text line-heights
    const bodyTexts = document.querySelectorAll('.about-body, .service-desc, .process-intro, .process-step-body, .tools-intro, .testimonial-quote');
    results.bodyLineHeights = Array.from(bodyTexts).map(el => ({
      className: el.className,
      lineHeight: getComputedStyle(el).lineHeight,
      fontSize: getComputedStyle(el).fontSize,
      text: el.textContent.substring(0, 30),
    }));

    // Check label letter-spacing consistency
    const labels = document.querySelectorAll('.about-label, .section-label, .services-label, .featured-label, .press-label, .t-label, .t-nano');
    results.labelSpacing = Array.from(labels).map(el => ({
      className: el.className,
      letterSpacing: getComputedStyle(el).letterSpacing,
    }));

    // Check for overflow issues
    results.overflowX = document.documentElement.scrollWidth > document.documentElement.clientWidth;

    return results;
  });

  log('Section padding consistency:');
  cssChecks.sectionPadding.forEach(s => {
    log(`  ${s.selector}: top=${s.paddingTop} bottom=${s.paddingBottom} left=${s.paddingLeft} right=${s.paddingRight}`);
    if (s.paddingTop !== '128px' && s.paddingTop !== '160px' && s.paddingTop !== 'NOT_FOUND') {
      // Some sections have different top padding by design (about has 160px)
    }
  });

  log('Body text line-heights:');
  cssChecks.bodyLineHeights.forEach(t => {
    const computed = parseFloat(t.lineHeight) / parseFloat(t.fontSize);
    log(`  .${t.className}: line-height=${t.lineHeight} (ratio: ${computed.toFixed(2)}) — "${t.text}..."`);
    if (computed < 1.85) {
      bug('MINOR', 'Typography', `${t.className} line-height ratio ${computed.toFixed(2)} is below spec minimum 1.9`);
    }
  });

  if (cssChecks.overflowX) {
    bug('MAJOR', 'Layout', 'Horizontal overflow detected — page is wider than viewport');
  } else {
    log('No horizontal overflow detected');
  }

  // ══════════════════════════════════════════════
  // 12. RESPONSIVE: CHECK 768px
  // ══════════════════════════════════════════════
  log('\n=== CHECKING MOBILE (768px) ===');

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);

  // Force preloader away on mobile
  await page.evaluate(() => {
    const p = document.querySelector('.preloader');
    if (p) p.style.display = 'none';
  });

  await page.screenshot({ path: `${SCREENSHOTS_DIR}/04-mobile-hero.png`, fullPage: false });

  const mobileChecks = await page.evaluate(() => {
    return {
      cursorRingDisplay: getComputedStyle(document.querySelector('.cursor-ring')).display,
      cursorDotDisplay: getComputedStyle(document.querySelector('.cursor-dot')).display,
      bodyCursor: getComputedStyle(document.body).cursor,
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      heroContentRect: document.querySelector('.hero-content')?.getBoundingClientRect(),
      statsGrid: getComputedStyle(document.querySelector('.stats-grid')).gridTemplateColumns,
    };
  });

  log(`Mobile cursor hidden: ring=${mobileChecks.cursorRingDisplay}, dot=${mobileChecks.cursorDotDisplay}`);
  log(`Mobile body cursor: ${mobileChecks.bodyCursor}`);
  log(`Mobile stats grid: ${mobileChecks.statsGrid}`);

  if (mobileChecks.overflowX) {
    bug('MAJOR', 'Mobile', 'Horizontal overflow on mobile viewport (768px)');
  }

  // Mobile full page screenshot
  await page.evaluate(() => {
    const p = document.querySelector('.preloader');
    if (p) p.style.display = 'none';
  });
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/05-mobile-full.png`, fullPage: true });

  // ══════════════════════════════════════════════
  // 13. CHECK 375px (iPhone)
  // ══════════════════════════════════════════════
  log('\n=== CHECKING MOBILE (375px) ===');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    const p = document.querySelector('.preloader');
    if (p) p.style.display = 'none';
  });

  const mobileSmall = await page.evaluate(() => {
    const flipCards = document.querySelectorAll('.flip-card');
    const flipCardSize = flipCards.length > 0 ? {
      width: flipCards[0].getBoundingClientRect().width,
      height: flipCards[0].getBoundingClientRect().height,
    } : null;

    const heroTitle = document.querySelector('.hero-title');
    const heroTitleSize = heroTitle ? parseFloat(getComputedStyle(heroTitle).fontSize) : 0;

    return {
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      flipCardSize,
      heroTitleFontSize: heroTitleSize,
      viewportWidth: window.innerWidth,
    };
  });

  log(`iPhone (375px): overflow=${mobileSmall.overflowX}, hero font=${mobileSmall.heroTitleFontSize}px`);
  if (mobileSmall.flipCardSize) {
    log(`  Flip card size: ${mobileSmall.flipCardSize.width}x${mobileSmall.flipCardSize.height}px`);
    if (mobileSmall.flipCardSize.width < 40) {
      bug('MAJOR', 'Mobile Stats', `Flip cards too small at 375px: ${mobileSmall.flipCardSize.width}px wide — digits will be unreadable`);
    }
  }

  if (mobileSmall.overflowX) {
    bug('CRITICAL', 'Mobile', 'Horizontal overflow at 375px — content breaks viewport');
  }

  await page.screenshot({ path: `${SCREENSHOTS_DIR}/06-mobile-375-hero.png`, fullPage: false });

  // Scroll to stats on mobile
  await page.evaluate(() => {
    const el = document.querySelector('.stats');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/07-mobile-375-stats.png`, fullPage: false });

  // ══════════════════════════════════════════════
  // 14. ACCESSIBILITY CHECKS
  // ══════════════════════════════════════════════
  log('\n=== CHECKING ACCESSIBILITY ===');

  const a11y = await page.evaluate(() => {
    // Check all images for alt text
    const imgs = document.querySelectorAll('img');
    const noAlt = Array.from(imgs).filter(i => !i.alt && !i.getAttribute('aria-hidden'));

    // Check buttons for labels
    const buttons = document.querySelectorAll('button');
    const noLabel = Array.from(buttons).filter(b => !b.textContent.trim() && !b.getAttribute('aria-label'));

    // Check color contrast (basic: look for very low opacity text)
    const lowOpacity = [];
    document.querySelectorAll('*').forEach(el => {
      const op = parseFloat(getComputedStyle(el).opacity);
      if (op > 0 && op < 0.15 && el.textContent.trim().length > 0 && el.children.length === 0) {
        lowOpacity.push({
          tag: el.tagName,
          class: el.className,
          text: el.textContent.substring(0, 30),
          opacity: op,
        });
      }
    });

    return {
      imagesNoAlt: noAlt.length,
      buttonsNoLabel: noLabel.length,
      lowOpacityTextCount: lowOpacity.length,
      lowOpacityExamples: lowOpacity.slice(0, 5),
    };
  });

  log(`Images without alt: ${a11y.imagesNoAlt}`);
  log(`Buttons without label: ${a11y.buttonsNoLabel}`);
  log(`Very low opacity text elements: ${a11y.lowOpacityTextCount}`);
  if (a11y.lowOpacityExamples.length > 0) {
    a11y.lowOpacityExamples.forEach(e => {
      log(`  <${e.tag} class="${e.class}"> "${e.text}" opacity=${e.opacity}`);
    });
  }

  // ══════════════════════════════════════════════
  // 15. PERFORMANCE CHECKS
  // ══════════════════════════════════════════════
  log('\n=== CHECKING PERFORMANCE ===');

  // Reset to desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  const perfChecks = await page.evaluate(() => {
    const allElements = document.querySelectorAll('*');
    let willChangeCount = 0;
    let fixedCount = 0;

    allElements.forEach(el => {
      const style = getComputedStyle(el);
      if (style.willChange && style.willChange !== 'auto') willChangeCount++;
      if (style.position === 'fixed') fixedCount++;
    });

    // Count total DOM nodes
    const totalNodes = document.querySelectorAll('*').length;

    return {
      totalDOMNodes: totalNodes,
      willChangeElements: willChangeCount,
      fixedElements: fixedCount,
      scriptTags: document.querySelectorAll('script').length,
      styleTags: document.querySelectorAll('style').length,
    };
  });

  log(`DOM nodes: ${perfChecks.totalDOMNodes}`);
  log(`will-change elements: ${perfChecks.willChangeElements}`);
  log(`fixed-position elements: ${perfChecks.fixedElements}`);
  log(`Scripts: ${perfChecks.scriptTags}, Styles: ${perfChecks.styleTags}`);

  // ══════════════════════════════════════════════
  // SUMMARY
  // ══════════════════════════════════════════════
  log('\n\n══════════════════════════════════════════════');
  log('              BUG REPORT SUMMARY');
  log('══════════════════════════════════════════════\n');

  const critical = bugs.filter(b => b.severity === 'CRITICAL');
  const major = bugs.filter(b => b.severity === 'MAJOR');
  const minor = bugs.filter(b => b.severity === 'MINOR');

  log(`CRITICAL: ${critical.length}`);
  critical.forEach(b => log(`  ❌ [${b.section}] ${b.description}`));

  log(`\nMAJOR: ${major.length}`);
  major.forEach(b => log(`  ⚠️  [${b.section}] ${b.description}`));

  log(`\nMINOR: ${minor.length}`);
  minor.forEach(b => log(`  💡 [${b.section}] ${b.description}`));

  log(`\nTotal bugs found: ${bugs.length}`);
  log(`Screenshots saved to: ${SCREENSHOTS_DIR}`);

  await browser.close();
})();
