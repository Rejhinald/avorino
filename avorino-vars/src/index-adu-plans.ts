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
const PAGE_TITLE = 'ADU Floor Plan Samples — Avorino Construction';
const PAGE_DESC = 'Browse ADU floor plan samples. Studio, 1-bed, and 2-bed layouts designed for Orange County properties.';
const HEAD_CODE = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3f8063a/avorino-responsive.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3f8063a/avorino-nav-footer.css">',
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3f8063a/avorino-animations.js"><\/script>',
  CALENDLY_JS,
].join('\n');

document.getElementById('page-name')!.textContent = PAGE_NAME;
const headCodeEl = document.getElementById('head-code');
const footerCodeEl = document.getElementById('footer-code');
if (headCodeEl) headCodeEl.textContent = HEAD_CODE;
if (footerCodeEl) footerCodeEl.textContent = FOOTER_CODE;

const PLANS = [
  { name: 'Studio 400', sqft: '400 sqft', beds: 'Studio', baths: '1 Bath' },
  { name: 'Studio 500', sqft: '500 sqft', beds: 'Studio', baths: '1 Bath' },
  { name: '1-Bed 600', sqft: '600 sqft', beds: '1 Bed', baths: '1 Bath' },
  { name: '1-Bed 750', sqft: '750 sqft', beds: '1 Bed', baths: '1 Bath' },
  { name: '2-Bed 800', sqft: '800 sqft', beds: '2 Bed', baths: '1 Bath' },
  { name: '2-Bed 1000', sqft: '1,000 sqft', beds: '2 Bed', baths: '2 Bath' },
];

async function buildPlansPage() {
  clearErrorLog();
  logDetail('Starting ADU Plans page build...', 'info');
  const v = await getAvorinVars();

  log('Creating shared styles...');
  const s = await createSharedStyles();

  log('Creating page-specific styles...');
  const plHero = await getOrCreateStyle('pl-hero');
  const plHeroContent = await getOrCreateStyle('pl-hero-content');
  const plGrid = await getOrCreateStyle('pl-grid');
  const plCard = await getOrCreateStyle('pl-card');
  const plCardImg = await getOrCreateStyle('pl-card-img');
  const plCardName = await getOrCreateStyle('pl-card-name');
  const plCardSpecs = await getOrCreateStyle('pl-card-specs');
  const plCustomCard = await getOrCreateStyle('pl-custom-card');
  const plMb32 = await getOrCreateStyle('pl-mb-32');
  const plMb64 = await getOrCreateStyle('pl-mb-64');

  const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);

  async function applyStyleProperties() {
    log('Setting shared style properties...');
    await setSharedStyleProps(s, v);
    await wait(1000);

    log('Setting page-specific style properties...');

    await clearAndSet(await freshStyle('pl-hero'), 'pl-hero', {
      'min-height': '40vh', 'display': 'flex', 'align-items': 'flex-end',
      'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('pl-hero-content'), 'pl-hero-content', {
      'position': 'relative', 'z-index': '2', 'max-width': '600px',
    });
    await wait(500);

    // Plans grid (3-col)
    await clearAndSet(await freshStyle('pl-grid'), 'pl-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr',
      'grid-column-gap': '24px', 'grid-row-gap': '24px',
    });
    await clearAndSet(await freshStyle('pl-card'), 'pl-card', {
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
      'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
      'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('pl-card-img'), 'pl-card-img', {
      'background-color': '#1a1a1a', 'min-height': '240px',
    });
    await clearAndSet(await freshStyle('pl-card-name'), 'pl-card-name', {
      'font-family': 'DM Serif Display', 'font-size': '24px',
      'line-height': '1.2', 'font-weight': '400',
      'padding-top': '24px', 'padding-left': '28px', 'padding-right': '28px',
      'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('pl-card-specs'), 'pl-card-specs', {
      'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
      'opacity': '0.5', 'padding-top': '8px', 'padding-bottom': '28px',
      'padding-left': '28px', 'padding-right': '28px', 'color': v['av-cream'],
    });
    await wait(500);

    // Custom plans card
    await clearAndSet(await freshStyle('pl-custom-card'), 'pl-custom-card', {
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
      'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
      'padding-top': v['av-gap-md'], 'padding-bottom': v['av-gap-md'],
      'padding-left': '48px', 'padding-right': '48px',
      'text-align': 'center',
    });
    await wait(500);

    await clearAndSet(await freshStyle('pl-mb-32'), 'pl-mb-32', { 'margin-bottom': v['av-gap-sm'] });
    await clearAndSet(await freshStyle('pl-mb-64'), 'pl-mb-64', { 'margin-bottom': v['av-gap-md'] });

    await applyCTAStyleProps(v);
  }

  // ═══════════════ BUILD ELEMENTS ═══════════════

  // SECTION 1: HERO
  log('Building Section 1: Hero...');
  const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
  hero.setTag('section');
  hero.setStyles([plHero]);
  hero.setAttribute('id', 'pl-hero');

  const heroC = hero.append(webflow.elementPresets.DOM);
  heroC.setTag('div');
  heroC.setStyles([plHeroContent]);

  const heroLabel = heroC.append(webflow.elementPresets.DOM);
  heroLabel.setTag('div');
  heroLabel.setStyles([s.label]);
  heroLabel.setAttribute('data-animate', 'fade-up');
  const heroLabelTxt = heroLabel.append(webflow.elementPresets.DOM);
  heroLabelTxt.setTag('div');
  heroLabelTxt.setTextContent('// Floor Plans');

  const heroH = heroC.append(webflow.elementPresets.DOM);
  heroH.setTag('h1');
  heroH.setStyles([s.headingXL]);
  heroH.setTextContent('ADU Floor Plan Samples');
  heroH.setAttribute('data-animate', 'opacity-sweep');

  await safeCall('append:hero', () => body.append(hero));

  // SECTION 2: PLANS GALLERY (warm bg)
  log('Building Section 2: Plans Gallery...');
  const gallerySection = webflow.elementBuilder(webflow.elementPresets.DOM);
  gallerySection.setTag('section');
  gallerySection.setStyles([s.section, s.sectionWarm]);
  gallerySection.setAttribute('id', 'pl-gallery');

  const grid = gallerySection.append(webflow.elementPresets.DOM);
  grid.setTag('div');
  grid.setStyles([plGrid]);
  grid.setAttribute('data-animate', 'fade-up-stagger');

  PLANS.forEach(plan => {
    const card = grid.append(webflow.elementPresets.DOM);
    card.setTag('div');
    card.setStyles([plCard]);
    card.setAttribute('data-animate', 'fade-up');

    const img = card.append(webflow.elementPresets.DOM);
    img.setTag('div');
    img.setStyles([plCardImg]);

    const name = card.append(webflow.elementPresets.DOM);
    name.setTag('h3');
    name.setStyles([plCardName]);
    name.setTextContent(plan.name);

    const specs = card.append(webflow.elementPresets.DOM);
    specs.setTag('p');
    specs.setStyles([plCardSpecs]);
    specs.setTextContent(`${plan.sqft} · ${plan.beds} · ${plan.baths}`);
  });

  await safeCall('append:gallery', () => body.append(gallerySection));

  // SECTION 3: CUSTOM PLANS (cream bg, single card)
  log('Building Section 3: Custom Plans...');
  const customSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  customSection.setTag('section');
  customSection.setStyles([s.section, s.sectionCream]);
  customSection.setAttribute('id', 'pl-custom');

  const customCard = customSection.append(webflow.elementPresets.DOM);
  customCard.setTag('div');
  customCard.setStyles([plCustomCard]);
  customCard.setAttribute('data-animate', 'fade-up');

  const customH = customCard.append(webflow.elementPresets.DOM);
  customH.setTag('h2');
  customH.setStyles([s.headingLG, plMb32]);
  customH.setTextContent('Need a custom plan?');

  const customP = customCard.append(webflow.elementPresets.DOM);
  customP.setTag('p');
  customP.setStyles([s.body, s.bodyMuted]);
  customP.setTextContent('Our architects design to your exact specifications — lot size, layout, and style.');

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
