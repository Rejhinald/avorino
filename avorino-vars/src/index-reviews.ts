// ════════════════════════════════════════════════════════════════
// Avorino Builder — CLIENT REVIEWS PAGE
// Rename this to index.ts to build the Reviews page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog, wait,
  safeCall, getAvorinVars, getOrCreateStyle, freshStyle,
  clearAndSet, createSharedStyles, setSharedStyleProps,
  createAllVariables, createPageWithSlug,
  buildCTASection, applyCTAStyleProps,
} from './shared.js';

// ── Page config ──
const PAGE_NAME = 'Client Reviews';
const PAGE_SLUG = 'clientreviews';
const PAGE_TITLE = 'Client Reviews — Avorino Construction';
const PAGE_DESC = '4.9 average rating from 35+ reviews. See what Orange County homeowners say about working with Avorino.';
const HEAD_CODE = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@COMMIT/pages/shared/shared-page-css.css">';
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
].join('\n');

// ── Update panel UI ──
document.getElementById('page-name')!.textContent = PAGE_NAME;
const headCodeEl = document.getElementById('head-code');
const footerCodeEl = document.getElementById('footer-code');
if (headCodeEl) headCodeEl.textContent = HEAD_CODE;
if (footerCodeEl) footerCodeEl.textContent = FOOTER_CODE;

// ── Reviews data ──
const REVIEWS = [
  { stars: 5, quote: 'Avorino transformed our backyard into a beautiful ADU. Professional from start to finish — permits, design, everything handled.', author: 'Shoroque S.', location: 'Anaheim, CA' },
  { stars: 5, quote: 'Exceptional attention to detail. Our garage conversion looks like it was always part of the house. Could not be happier.', author: 'Pooja M.', location: 'Irvine, CA' },
  { stars: 5, quote: 'They delivered on time and on budget. The weekly updates made the whole process stress-free. Highly recommend.', author: 'Jeremy C.', location: 'Huntington Beach, CA' },
  { stars: 5, quote: 'Our custom home turned out better than we imagined. The team was transparent about every cost and timeline.', author: 'Sonia H.', location: 'Newport Beach, CA' },
  { stars: 5, quote: 'Best construction experience we have had. Clear communication, quality craftsmanship, and fair pricing.', author: 'Michael T.', location: 'Costa Mesa, CA' },
  { stars: 5, quote: 'From the initial consultation to move-in day, Avorino exceeded our expectations. Our ADU is now fully rented.', author: 'David & Lisa R.', location: 'Tustin, CA' },
];

// ── Build function ──
async function buildReviewsPage() {
  clearErrorLog();
  logDetail('Starting Reviews page build...', 'info');
  const v = await getAvorinVars();

  log('Creating shared styles...');
  const s = await createSharedStyles();

  // ── Page-specific styles ──
  log('Creating page-specific styles...');
  const rvHero = await getOrCreateStyle('rv-hero');
  const rvHeroContent = await getOrCreateStyle('rv-hero-content');
  const rvHeroSub = await getOrCreateStyle('rv-hero-subtitle');
  const rvGrid = await getOrCreateStyle('rv-grid');
  const rvCard = await getOrCreateStyle('rv-card');
  const rvStars = await getOrCreateStyle('rv-stars');
  const rvQuote = await getOrCreateStyle('rv-quote');
  const rvAuthor = await getOrCreateStyle('rv-author');
  const rvLocation = await getOrCreateStyle('rv-location');

  const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);

  async function applyStyleProperties() {
    log('Setting shared style properties...');
    await setSharedStyleProps(s, v);
    await wait(1000);

    log('Setting page-specific style properties...');

    await clearAndSet(await freshStyle('rv-hero'), 'rv-hero', {
      'min-height': '50vh', 'display': 'flex', 'align-items': 'flex-end',
      'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('rv-hero-content'), 'rv-hero-content', {
      'position': 'relative', 'z-index': '2', 'max-width': '700px',
    });
    await clearAndSet(await freshStyle('rv-hero-subtitle'), 'rv-hero-subtitle', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.9', 'opacity': '0.6', 'margin-top': '24px', 'color': v['av-cream'],
    });
    await wait(500);

    // Review grid (3-col masonry-feel)
    await clearAndSet(await freshStyle('rv-grid'), 'rv-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr',
      'grid-column-gap': '24px', 'grid-row-gap': '24px',
    });
    await clearAndSet(await freshStyle('rv-card'), 'rv-card', {
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
      'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
      'padding-top': '48px', 'padding-bottom': '48px',
      'padding-left': '40px', 'padding-right': '40px',
      'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '24px',
    });
    await clearAndSet(await freshStyle('rv-stars'), 'rv-stars', {
      'font-size': '20px', 'letter-spacing': '4px', 'color': '#f5c518',
    });
    await clearAndSet(await freshStyle('rv-quote'), 'rv-quote', {
      'font-family': 'DM Serif Display', 'font-size': '20px',
      'line-height': '1.5', 'font-weight': '400', 'font-style': 'italic',
      'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('rv-author'), 'rv-author', {
      'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
      'font-weight': '500', 'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('rv-location'), 'rv-location', {
      'font-family': 'DM Sans', 'font-size': v['av-text-xs'],
      'opacity': '0.5', 'color': v['av-cream'],
    });
    await wait(500);

    await applyCTAStyleProps(v);
  }

  // ═══════════════ BUILD ELEMENTS ═══════════════

  // SECTION 1: HERO
  log('Building Section 1: Hero...');
  const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
  hero.setTag('section');
  hero.setStyles([rvHero]);
  hero.setAttribute('id', 'rv-hero');

  const heroC = hero.append(webflow.elementPresets.DOM);
  heroC.setTag('div');
  heroC.setStyles([rvHeroContent]);

  const heroLabel = heroC.append(webflow.elementPresets.DOM);
  heroLabel.setTag('div');
  heroLabel.setStyles([s.label]);
  heroLabel.setAttribute('data-animate', 'fade-up');
  const heroLabelTxt = heroLabel.append(webflow.elementPresets.DOM);
  heroLabelTxt.setTag('div');
  heroLabelTxt.setTextContent('// Client Reviews');

  const heroH = heroC.append(webflow.elementPresets.DOM);
  heroH.setTag('h1');
  heroH.setStyles([s.headingXL]);
  heroH.setTextContent('What Our Clients Say');
  heroH.setAttribute('data-animate', 'opacity-sweep');

  const heroSub = heroC.append(webflow.elementPresets.DOM);
  heroSub.setTag('p');
  heroSub.setStyles([rvHeroSub]);
  heroSub.setTextContent('4.9 average from 35+ reviews.');
  heroSub.setAttribute('data-animate', 'fade-up');

  await safeCall('append:hero', () => body.append(hero));

  // SECTION 2: REVIEWS GRID (warm bg)
  log('Building Section 2: Reviews Grid...');
  const reviewsSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  reviewsSection.setTag('section');
  reviewsSection.setStyles([s.section, s.sectionWarm]);
  reviewsSection.setAttribute('id', 'rv-reviews');

  const grid = reviewsSection.append(webflow.elementPresets.DOM);
  grid.setTag('div');
  grid.setStyles([rvGrid]);
  grid.setAttribute('data-animate', 'fade-up-stagger');

  REVIEWS.forEach(review => {
    const card = grid.append(webflow.elementPresets.DOM);
    card.setTag('div');
    card.setStyles([rvCard]);
    card.setAttribute('data-animate', 'fade-up');

    const stars = card.append(webflow.elementPresets.DOM);
    stars.setTag('div');
    stars.setStyles([rvStars]);
    stars.setTextContent('\u2605'.repeat(review.stars));

    const quote = card.append(webflow.elementPresets.DOM);
    quote.setTag('p');
    quote.setStyles([rvQuote]);
    quote.setTextContent(`\u201C${review.quote}\u201D`);

    const author = card.append(webflow.elementPresets.DOM);
    author.setTag('div');
    author.setStyles([rvAuthor]);
    author.setTextContent(review.author);

    const loc = card.append(webflow.elementPresets.DOM);
    loc.setTag('div');
    loc.setStyles([rvLocation]);
    loc.setTextContent(review.location);
  });

  await safeCall('append:reviews', () => body.append(reviewsSection));

  // SECTION 3: CTA
  log('Building Section 3: CTA...');
  await buildCTASection(
    body, v,
    'Start your project',
    'Get a Free Estimate', '/free-estimate',
    'View Our Work', '/adu',
  );

  await applyStyleProperties();

  log('Reviews page built!', 'success');
  await webflow.notify({ type: 'Success', message: 'Reviews page created!' });
}

// ── Event listeners ──
document.getElementById('inject-btn')?.addEventListener('click', async () => {
  const btn = document.getElementById('inject-btn') as HTMLButtonElement;
  btn.disabled = true;
  try { await createAllVariables(); } catch (err: any) { log(`Error: ${err.message || err}`, 'error'); } finally { btn.disabled = false; }
});

document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const type = (btn as HTMLElement).dataset.copy;
    let text = type === 'head' ? HEAD_CODE : type === 'footer' ? FOOTER_CODE : '';
    navigator.clipboard.writeText(text).then(() => {
      (btn as HTMLElement).textContent = 'Copied!';
      setTimeout(() => { (btn as HTMLElement).textContent = 'Copy'; }, 2000);
    });
  });
});

document.getElementById('build-page')?.addEventListener('click', async () => {
  const btn = document.getElementById('build-page') as HTMLButtonElement;
  btn.disabled = true;
  try { await buildReviewsPage(); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
