// ════════════════════════════════════════════════════════════════
// Avorino Builder — ADU PLAN SAMPLES PAGE
// Rename this to index.ts to build the ADU Plans page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog, wait,
  safeCall, getAvorinVars, getOrCreateStyle, freshStyle,
  clearAndSet, createSharedStyles, setSharedStyleProps,
  createAllVariables, createPageWithSlug,
  buildCTASection, applyCTAStyleProps,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

const PAGE_NAME = 'ADU Plan Samples';
const PAGE_SLUG = 'adu-plan-samples';
const PAGE_TITLE = 'ADU Floor Plans & Designs | Avorino Orange County';
const PAGE_DESC = 'Browse ADU floor plans from studio to 1,200 sqft. Pre-approved and custom designs for Orange County. Detached, attached, and garage conversion layouts by Avorino.';
const CDN = '3cf6b06';
const HEAD_CODE = [
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-responsive.css">`,
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-nav-footer.css">`,
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-adu.css">`,
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>',
  `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-animations.js"><\/script>`,
  `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-adu-plans-footer.js"><\/script>`,
  CALENDLY_JS,
].join('\n');

document.getElementById('page-name')!.textContent = PAGE_NAME;
const headCodeEl = document.getElementById('head-code');
const footerCodeEl = document.getElementById('footer-code');
if (headCodeEl) headCodeEl.textContent = HEAD_CODE;
if (footerCodeEl) footerCodeEl.textContent = FOOTER_CODE;

const PLANS = [
  { name: 'Studio 400', sqft: '400 sqft', beds: 'Studio', baths: '1 Bath', tag: 'Studio' },
  { name: 'Studio 500', sqft: '500 sqft', beds: 'Studio', baths: '1 Bath', tag: 'Studio' },
  { name: '1-Bed 600', sqft: '600 sqft', beds: '1 Bed', baths: '1 Bath', tag: '1-Bed' },
  { name: '1-Bed 750', sqft: '750 sqft', beds: '1 Bed', baths: '1 Bath', tag: '1-Bed' },
  { name: '2-Bed 800', sqft: '800 sqft', beds: '2 Bed', baths: '1 Bath', tag: '2-Bed' },
  { name: '2-Bed 1000', sqft: '1,000 sqft', beds: '2 Bed', baths: '2 Bath', tag: '2-Bed' },
];

const CUSTOM_FEATURES = [
  'Custom lot-fit analysis',
  'Architectural design included',
  'Title 24 energy calculations',
  'Full permit management',
];

async function buildPlansPage() {
  clearErrorLog();
  logDetail('Starting ADU Plans page build...', 'info');
  const v = await getAvorinVars();

  log('Creating shared styles...');
  const s = await createSharedStyles();

  log('Creating page-specific styles...');
  // Hero
  const plHero = await getOrCreateStyle('plans-hero');
  const plCanvasWrap = await getOrCreateStyle('pl-canvas-wrap');
  const plContentOverlay = await getOrCreateStyle('pl-content-overlay');
  const plHeroContent = await getOrCreateStyle('plans-hero-content');
  const plHeroLabel = await getOrCreateStyle('plans-hero-label');
  const plHeroGoldLine = await getOrCreateStyle('plans-hero-gold-line');
  const plHeroSubtitle = await getOrCreateStyle('plans-hero-subtitle');
  const plHeroScrollHint = await getOrCreateStyle('plans-hero-scroll-hint');
  const plHeroScrollLine = await getOrCreateStyle('plans-hero-scroll-line');
  // Gallery
  const plGalleryHeader = await getOrCreateStyle('plans-gallery-header');
  const plGrid = await getOrCreateStyle('plans-grid');
  const plCard = await getOrCreateStyle('plan-card');
  const plCardImg = await getOrCreateStyle('plan-card-img');
  const plCardBody = await getOrCreateStyle('plan-card-body');
  const plCardName = await getOrCreateStyle('plan-card-name');
  const plCardSpecs = await getOrCreateStyle('plan-card-specs');
  const plCardTag = await getOrCreateStyle('plan-card-tag');
  // Custom
  const plCustom = await getOrCreateStyle('plans-custom');
  const plGlassCard = await getOrCreateStyle('pl-glass-card');
  const plCustomInner = await getOrCreateStyle('pl-custom-inner');
  const plCustomFeatures = await getOrCreateStyle('pl-custom-features');
  const plCustomFeature = await getOrCreateStyle('pl-custom-feature');
  const plCustomFeatureDot = await getOrCreateStyle('pl-custom-feature-dot');
  // Utility
  const plLabelLine = await getOrCreateStyle('pl-label-line');
  const plMb48 = await getOrCreateStyle('pl-mb-48');
  const plMb64 = await getOrCreateStyle('pl-mb-64');

  const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);

  async function applyStyleProperties() {
    log('Setting shared style properties...');
    await setSharedStyleProps(s, v);
    await wait(1000);

    log('Setting page-specific style properties...');

    // ── Hero ──
    await clearAndSet(await freshStyle('plans-hero'), 'plans-hero', {
      'min-height': '85vh', 'display': 'flex', 'align-items': 'flex-end',
      'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('pl-canvas-wrap'), 'pl-canvas-wrap', {
      'position': 'absolute', 'top': '0px', 'left': '0px',
      'width': '100%', 'height': '100%', 'z-index': '1',
      'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('pl-content-overlay'), 'pl-content-overlay', {
      'position': 'relative', 'z-index': '2',
    });
    await clearAndSet(await freshStyle('plans-hero-content'), 'plans-hero-content', {
      'max-width': '800px',
    });
    await clearAndSet(await freshStyle('plans-hero-label'), 'plans-hero-label', {
      'font-family': 'DM Sans', 'font-size': v['av-text-label'],
      'letter-spacing': '0.3em', 'text-transform': 'uppercase',
      'opacity': '0', 'margin-bottom': '32px', 'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('plans-hero-gold-line'), 'plans-hero-gold-line', {
      'width': '0px', 'height': '1px', 'background-color': '#c9a96e',
      'margin-bottom': '24px',
    });
    await clearAndSet(await freshStyle('plans-hero-subtitle'), 'plans-hero-subtitle', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.9', 'opacity': '0', 'margin-top': '24px',
      'color': v['av-cream'], 'max-width': '520px',
    });
    await clearAndSet(await freshStyle('plans-hero-scroll-hint'), 'plans-hero-scroll-hint', {
      'position': 'absolute', 'bottom': '40px', 'left': '50%',
      'z-index': '3', 'display': 'flex', 'flex-direction': 'column',
      'align-items': 'center', 'opacity': '0',
    });
    await clearAndSet(await freshStyle('plans-hero-scroll-line'), 'plans-hero-scroll-line', {
      'width': '1px', 'height': '40px', 'background-color': '#c9a96e',
    });
    await wait(500);

    // ── Gallery ──
    await clearAndSet(await freshStyle('plans-gallery-header'), 'plans-gallery-header', {
      'text-align': 'center', 'margin-bottom': '80px',
    });
    await clearAndSet(await freshStyle('plans-grid'), 'plans-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr',
      'grid-column-gap': '24px', 'grid-row-gap': '24px',
      'max-width': '1200px', 'margin-left': 'auto', 'margin-right': 'auto',
    });
    await clearAndSet(await freshStyle('plan-card'), 'plan-card', {
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
      'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
      'overflow-x': 'hidden', 'overflow-y': 'hidden',
      'border-top-width': '2px', 'border-top-style': 'solid', 'border-top-color': 'rgba(201,169,110,0.25)',
    });
    await clearAndSet(await freshStyle('plan-card-img'), 'plan-card-img', {
      'background-color': '#1a1a1a', 'min-height': '200px',
      'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('plan-card-body'), 'plan-card-body', {
      'padding-top': '24px', 'padding-bottom': '24px',
      'padding-left': '28px', 'padding-right': '28px',
    });
    await clearAndSet(await freshStyle('plan-card-name'), 'plan-card-name', {
      'font-family': 'DM Serif Display', 'font-size': '24px',
      'line-height': '1.2', 'font-weight': '400', 'margin-bottom': '8px',
    });
    await clearAndSet(await freshStyle('plan-card-specs'), 'plan-card-specs', {
      'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
      'opacity': '0.5', 'line-height': '1.6', 'margin-bottom': '12px',
    });
    await clearAndSet(await freshStyle('plan-card-tag'), 'plan-card-tag', {
      'display': 'inline-block', 'font-family': 'DM Sans', 'font-size': v['av-text-label'],
      'text-transform': 'uppercase', 'letter-spacing': '0.06em',
      'padding-top': '4px', 'padding-bottom': '4px',
      'padding-left': '12px', 'padding-right': '12px',
      'border-top-left-radius': '20px', 'border-top-right-radius': '20px',
      'border-bottom-left-radius': '20px', 'border-bottom-right-radius': '20px',
      'background-color': 'rgba(201,169,110,0.12)', 'color': '#c9a96e',
    });
    await wait(500);

    // ── Custom Plans ──
    await clearAndSet(await freshStyle('plans-custom'), 'plans-custom', {
      'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'padding-top': v['av-section-pad-y'], 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
    });
    await clearAndSet(await freshStyle('pl-glass-card'), 'pl-glass-card', {
      'background-color': 'rgba(17,17,17,0.88)', 'color': v['av-cream'],
      'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
      'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
      'padding-top': '48px', 'padding-bottom': '48px',
      'padding-left': '40px', 'padding-right': '40px',
      'border-top-width': '2px', 'border-top-style': 'solid', 'border-top-color': 'rgba(201,169,110,0.25)',
    });
    await clearAndSet(await freshStyle('pl-custom-inner'), 'pl-custom-inner', {
      'max-width': '700px', 'margin-left': 'auto', 'margin-right': 'auto',
      'text-align': 'center',
    });
    await clearAndSet(await freshStyle('pl-custom-features'), 'pl-custom-features', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr',
      'grid-column-gap': '16px', 'grid-row-gap': '16px',
      'text-align': 'left', 'margin-top': '32px',
    });
    await clearAndSet(await freshStyle('pl-custom-feature'), 'pl-custom-feature', {
      'display': 'flex', 'align-items': 'flex-start',
      'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
      'opacity': '0.5', 'line-height': '1.5',
    });
    await clearAndSet(await freshStyle('pl-custom-feature-dot'), 'pl-custom-feature-dot', {
      'width': '6px', 'height': '6px',
      'border-top-left-radius': '50%', 'border-top-right-radius': '50%',
      'border-bottom-left-radius': '50%', 'border-bottom-right-radius': '50%',
      'background-color': '#c9a96e', 'margin-top': '7px', 'margin-right': '12px',
      'flex-shrink': '0',
    });
    await wait(500);

    // ── Utility ──
    await clearAndSet(await freshStyle('pl-label-line'), 'pl-label-line', {
      'flex-grow': '1', 'height': '1px', 'background-color': 'rgba(17,17,17,0.15)',
    });
    await clearAndSet(await freshStyle('pl-mb-48'), 'pl-mb-48', { 'margin-bottom': '48px' });
    await clearAndSet(await freshStyle('pl-mb-64'), 'pl-mb-64', { 'margin-bottom': '64px' });

    await applyCTAStyleProps(v);
  }

  // ═══════════════ BUILD ELEMENTS ═══════════════

  // SECTION 1: HERO — full-viewport cinematic with Three.js canvas
  log('Building Section 1: Hero...');
  const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
  hero.setTag('section');
  hero.setStyles([plHero]);
  hero.setAttribute('id', 'plans-hero');
  hero.setAttribute('class', 'plans-hero');

  // Canvas wrap (Three.js exploded floor plan — populated at runtime)
  const heroCanvasWrap = hero.append(webflow.elementPresets.DOM);
  heroCanvasWrap.setTag('div');
  heroCanvasWrap.setStyles([plCanvasWrap]);
  heroCanvasWrap.setAttribute('id', 'hero-canvas');
  heroCanvasWrap.setAttribute('class', 'canvas-wrap');

  // Content overlay
  const heroOverlay = hero.append(webflow.elementPresets.DOM);
  heroOverlay.setTag('div');
  heroOverlay.setStyles([plContentOverlay]);
  heroOverlay.setAttribute('class', 'content-overlay plans-hero-content');

  const heroLabel = heroOverlay.append(webflow.elementPresets.DOM);
  heroLabel.setTag('div');
  heroLabel.setStyles([plHeroLabel]);
  heroLabel.setAttribute('class', 'plans-hero-label');
  heroLabel.setAttribute('data-animate', 'fade-up');
  heroLabel.setTextContent('// Floor Plans');

  const heroH = heroOverlay.append(webflow.elementPresets.DOM);
  heroH.setTag('h1');
  heroH.setStyles([s.headingXL]);
  heroH.setTextContent('ADU Floor Plans');
  heroH.setAttribute('data-animate', 'char-cascade');

  const heroGoldLine = heroOverlay.append(webflow.elementPresets.DOM);
  heroGoldLine.setTag('div');
  heroGoldLine.setStyles([plHeroGoldLine]);
  heroGoldLine.setAttribute('class', 'plans-hero-gold-line');

  const heroSub = heroOverlay.append(webflow.elementPresets.DOM);
  heroSub.setTag('p');
  heroSub.setStyles([plHeroSubtitle]);
  heroSub.setAttribute('class', 'plans-hero-subtitle');
  heroSub.setAttribute('data-animate', 'fade-up');
  heroSub.setTextContent('Browse studio, 1-bed, and 2-bed ADU layouts designed for Orange County properties.');

  // Scroll hint
  const scrollHint = hero.append(webflow.elementPresets.DOM);
  scrollHint.setTag('div');
  scrollHint.setStyles([plHeroScrollHint]);
  scrollHint.setAttribute('class', 'plans-hero-scroll-hint');
  scrollHint.setAttribute('data-animate', 'fade-up');

  const scrollHintText = scrollHint.append(webflow.elementPresets.DOM);
  scrollHintText.setTag('span');
  scrollHintText.setTextContent('Scroll');

  const scrollHintLine = scrollHint.append(webflow.elementPresets.DOM);
  scrollHintLine.setTag('div');
  scrollHintLine.setStyles([plHeroScrollLine]);
  scrollHintLine.setAttribute('class', 'plans-hero-scroll-line');

  await safeCall('append:hero', () => body.append(hero));

  // SECTION 2: PLANS GALLERY (warm bg with header)
  log('Building Section 2: Plans Gallery...');
  const gallerySection = webflow.elementBuilder(webflow.elementPresets.DOM);
  gallerySection.setTag('section');
  gallerySection.setStyles([s.section, s.sectionWarm]);
  gallerySection.setAttribute('id', 'plans-gallery');

  // Gallery header
  const galleryHeader = gallerySection.append(webflow.elementPresets.DOM);
  galleryHeader.setTag('div');
  galleryHeader.setStyles([plGalleryHeader]);
  galleryHeader.setAttribute('class', 'plans-gallery-header');

  const galleryLabel = galleryHeader.append(webflow.elementPresets.DOM);
  galleryLabel.setTag('div');
  galleryLabel.setStyles([s.label, plMb64]);
  galleryLabel.setAttribute('data-animate', 'fade-up');
  const galleryLabelTxt = galleryLabel.append(webflow.elementPresets.DOM);
  galleryLabelTxt.setTag('div');
  galleryLabelTxt.setTextContent('Browse Plans');
  const galleryLabelLine = galleryLabel.append(webflow.elementPresets.DOM);
  galleryLabelLine.setTag('div');
  galleryLabelLine.setStyles([plLabelLine]);
  galleryLabelLine.setAttribute('class', 'av-label-line');

  const galleryH = galleryHeader.append(webflow.elementPresets.DOM);
  galleryH.setTag('h2');
  galleryH.setStyles([s.headingLG]);
  galleryH.setTextContent('Sample Floor Plans');
  galleryH.setAttribute('data-animate', 'line-wipe');

  // Plans grid
  const grid = gallerySection.append(webflow.elementPresets.DOM);
  grid.setTag('div');
  grid.setStyles([plGrid]);
  grid.setAttribute('class', 'plans-grid');

  PLANS.forEach(plan => {
    const card = grid.append(webflow.elementPresets.DOM);
    card.setTag('div');
    card.setStyles([plCard]);
    card.setAttribute('class', 'plan-card');
    card.setAttribute('data-animate', 'fade-up');

    const img = card.append(webflow.elementPresets.DOM);
    img.setTag('div');
    img.setStyles([plCardImg]);
    img.setAttribute('class', 'plan-card-img');

    const cardBody = card.append(webflow.elementPresets.DOM);
    cardBody.setTag('div');
    cardBody.setStyles([plCardBody]);
    cardBody.setAttribute('class', 'plan-card-body');

    const name = cardBody.append(webflow.elementPresets.DOM);
    name.setTag('h3');
    name.setStyles([plCardName]);
    name.setAttribute('class', 'plan-card-name');
    name.setTextContent(plan.name);

    const specs = cardBody.append(webflow.elementPresets.DOM);
    specs.setTag('p');
    specs.setStyles([plCardSpecs]);
    specs.setAttribute('class', 'plan-card-specs');
    specs.setTextContent(`${plan.sqft} \u00b7 ${plan.beds} \u00b7 ${plan.baths}`);

    const tag = cardBody.append(webflow.elementPresets.DOM);
    tag.setTag('span');
    tag.setStyles([plCardTag]);
    tag.setAttribute('class', 'plan-card-tag');
    tag.setTextContent(plan.tag);
  });

  await safeCall('append:gallery', () => body.append(gallerySection));

  // SECTION 3: CUSTOM PLANS — dark with Three.js backdrop + glass card
  log('Building Section 3: Custom Plans...');
  const customSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  customSection.setTag('section');
  customSection.setStyles([plCustom]);
  customSection.setAttribute('id', 'plans-custom');
  customSection.setAttribute('class', 'av-section-dark plans-custom');

  // Canvas wrap (Three.js multi-layout blueprints — populated at runtime)
  const customCanvasWrap = customSection.append(webflow.elementPresets.DOM);
  customCanvasWrap.setTag('div');
  customCanvasWrap.setStyles([plCanvasWrap]);
  customCanvasWrap.setAttribute('id', 'custom-canvas');
  customCanvasWrap.setAttribute('class', 'canvas-wrap');

  // Content overlay
  const customOverlay = customSection.append(webflow.elementPresets.DOM);
  customOverlay.setTag('div');
  customOverlay.setStyles([plContentOverlay]);
  customOverlay.setAttribute('class', 'content-overlay');

  // Section label
  const customLabel = customOverlay.append(webflow.elementPresets.DOM);
  customLabel.setTag('div');
  customLabel.setStyles([s.label, plMb64]);
  customLabel.setAttribute('data-animate', 'fade-up');
  const customLabelTxt = customLabel.append(webflow.elementPresets.DOM);
  customLabelTxt.setTag('div');
  customLabelTxt.setTextContent('Custom Design');
  const customLabelLine = customLabel.append(webflow.elementPresets.DOM);
  customLabelLine.setTag('div');
  customLabelLine.setStyles([plLabelLine]);
  customLabelLine.setAttribute('class', 'av-label-line');

  // Glass card inner wrapper
  const customInner = customOverlay.append(webflow.elementPresets.DOM);
  customInner.setTag('div');
  customInner.setStyles([plCustomInner]);
  customInner.setAttribute('class', 'custom-inner');

  const glassCard = customInner.append(webflow.elementPresets.DOM);
  glassCard.setTag('div');
  glassCard.setStyles([plGlassCard]);
  glassCard.setAttribute('class', 'glass-card');
  glassCard.setAttribute('data-animate', 'fade-up');

  const customH = glassCard.append(webflow.elementPresets.DOM);
  customH.setTag('h2');
  customH.setStyles([s.headingMD]);
  customH.setTextContent('Custom Plan Design');

  const customP = glassCard.append(webflow.elementPresets.DOM);
  customP.setTag('p');
  customP.setStyles([s.body, s.bodyMuted]);
  customP.setTextContent('Our architects design to your exact specifications \u2014 lot size, layout, and style. Every detail tailored to your Orange County property.');

  // Features grid
  const featuresGrid = glassCard.append(webflow.elementPresets.DOM);
  featuresGrid.setTag('div');
  featuresGrid.setStyles([plCustomFeatures]);
  featuresGrid.setAttribute('class', 'custom-features');

  CUSTOM_FEATURES.forEach(feat => {
    const featureRow = featuresGrid.append(webflow.elementPresets.DOM);
    featureRow.setTag('div');
    featureRow.setStyles([plCustomFeature]);
    featureRow.setAttribute('class', 'custom-feature');
    featureRow.setAttribute('data-animate', 'fade-up');

    const dot = featureRow.append(webflow.elementPresets.DOM);
    dot.setTag('div');
    dot.setStyles([plCustomFeatureDot]);
    dot.setAttribute('class', 'custom-feature-dot');

    const text = featureRow.append(webflow.elementPresets.DOM);
    text.setTag('span');
    text.setTextContent(feat);
  });

  await safeCall('append:custom', () => body.append(customSection));

  // SECTION 4: CTA
  log('Building Section 4: CTA...');
  await buildCTASection(body, v, 'Get started', 'Schedule a Meeting', '/schedule-a-meeting', 'ADU Cost Calculator', '/adu-cost-estimator');

  await applyStyleProperties();

  log('ADU Plans page built!', 'success');
  await webflow.notify({ type: 'Success', message: 'ADU Plans page created!' });
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
  try { await buildPlansPage(); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
