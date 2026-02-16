// ════════════════════════════════════════════════════════════════
// Avorino Builder — FINANCING PAGE
// Rename this to index.ts to build the Financing page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog, wait,
  safeCall, getAvorinVars, getOrCreateStyle, freshStyle,
  clearAndSet, createSharedStyles, setSharedStyleProps,
  createAllVariables, createPageWithSlug,
  buildCTASection, applyCTAStyleProps,
} from './shared.js';

// ── Page config ──
const PAGE_NAME = 'Financing';
const PAGE_SLUG = 'financing';
const PAGE_TITLE = '100% Financing Available — Avorino Construction';
const PAGE_DESC = 'Build now, pay over time. ADU and construction financing options in Orange County.';
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

// ── Content data ──
const BENEFITS = [
  { title: 'Up to 100% financing', desc: 'Cover your entire project cost without a large down payment.' },
  { title: 'Property equity leverage', desc: 'Use your home equity plus credit to qualify for favorable terms.' },
  { title: 'Positive cash flow', desc: 'ADU rental income can exceed your monthly loan payment from day one.' },
];

const STEPS = [
  { number: '01', title: 'Apply', desc: 'Submit your application through our lending partners. Takes 15 minutes.' },
  { number: '02', title: 'Get approved', desc: 'Approval based on property equity and credit. Most homeowners qualify.' },
  { number: '03', title: 'Build', desc: 'Construction begins. Funds are released in stages as your project progresses.' },
];

// ── Build function ──
async function buildFinancingPage() {
  clearErrorLog();
  logDetail('Starting Financing page build...', 'info');
  const v = await getAvorinVars();

  log('Creating shared styles...');
  const s = await createSharedStyles();

  // ── Page-specific styles ──
  log('Creating page-specific styles...');
  const finHero = await getOrCreateStyle('fin-hero');
  const finHeroContent = await getOrCreateStyle('fin-hero-content');
  const finHeroSub = await getOrCreateStyle('fin-hero-subtitle');
  const finGrid3 = await getOrCreateStyle('fin-grid-3');
  const finBenefitCard = await getOrCreateStyle('fin-benefit-card');
  const finBenefitTitle = await getOrCreateStyle('fin-benefit-title');
  const finBenefitDesc = await getOrCreateStyle('fin-benefit-desc');
  const finStep = await getOrCreateStyle('fin-step');
  const finStepNum = await getOrCreateStyle('fin-step-num');
  const finStepTitle = await getOrCreateStyle('fin-step-title');
  const finStepDesc = await getOrCreateStyle('fin-step-desc');
  const finMb32 = await getOrCreateStyle('fin-mb-32');
  const finMb64 = await getOrCreateStyle('fin-mb-64');
  const finLabelLine = await getOrCreateStyle('fin-label-line');

  const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);

  async function applyStyleProperties() {
    log('Setting shared style properties...');
    await setSharedStyleProps(s, v);
    await wait(1000);

    log('Setting page-specific style properties...');

    await clearAndSet(await freshStyle('fin-hero'), 'fin-hero', {
      'min-height': '50vh', 'display': 'flex', 'align-items': 'flex-end',
      'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('fin-hero-content'), 'fin-hero-content', {
      'position': 'relative', 'z-index': '2', 'max-width': '700px',
    });
    await clearAndSet(await freshStyle('fin-hero-subtitle'), 'fin-hero-subtitle', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.9', 'opacity': '0.6', 'margin-top': '24px', 'color': v['av-cream'],
    });
    await wait(500);

    // Benefits (3-col cards)
    await clearAndSet(await freshStyle('fin-grid-3'), 'fin-grid-3', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr',
      'grid-column-gap': '24px', 'grid-row-gap': '24px',
    });
    await clearAndSet(await freshStyle('fin-benefit-card'), 'fin-benefit-card', {
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
      'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
      'padding-top': v['av-gap-md'], 'padding-bottom': v['av-gap-md'],
      'padding-left': '40px', 'padding-right': '40px',
    });
    await clearAndSet(await freshStyle('fin-benefit-title'), 'fin-benefit-title', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
      'line-height': '1.12', 'font-weight': '400',
      'margin-bottom': '16px', 'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('fin-benefit-desc'), 'fin-benefit-desc', {
      'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
      'line-height': '1.7', 'opacity': '0.6', 'color': v['av-cream'],
    });
    await wait(500);

    // Steps (3-col)
    await clearAndSet(await freshStyle('fin-step'), 'fin-step', {
      'display': 'flex', 'flex-direction': 'column',
    });
    await clearAndSet(await freshStyle('fin-step-num'), 'fin-step-num', {
      'font-family': 'DM Sans', 'font-size': v['av-text-label'],
      'letter-spacing': '0.3em', 'text-transform': 'uppercase',
      'opacity': '0.3', 'margin-bottom': '24px',
    });
    await clearAndSet(await freshStyle('fin-step-title'), 'fin-step-title', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
      'line-height': '1.12', 'font-weight': '400', 'margin-bottom': '16px',
    });
    await clearAndSet(await freshStyle('fin-step-desc'), 'fin-step-desc', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.9', 'opacity': '0.6',
    });
    await wait(500);

    // Utility
    await clearAndSet(await freshStyle('fin-mb-32'), 'fin-mb-32', { 'margin-bottom': v['av-gap-sm'] });
    await clearAndSet(await freshStyle('fin-mb-64'), 'fin-mb-64', { 'margin-bottom': v['av-gap-md'] });
    await clearAndSet(await freshStyle('fin-label-line'), 'fin-label-line', { 'flex-grow': '1', 'height': '1px', 'background-color': v['av-dark-15'] });

    await applyCTAStyleProps(v);
  }

  // ═══════════════ BUILD ELEMENTS ═══════════════

  // SECTION 1: HERO
  log('Building Section 1: Hero...');
  const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
  hero.setTag('section');
  hero.setStyles([finHero]);
  hero.setAttribute('id', 'fin-hero');

  const heroC = hero.append(webflow.elementPresets.DOM);
  heroC.setTag('div');
  heroC.setStyles([finHeroContent]);

  const heroLabel = heroC.append(webflow.elementPresets.DOM);
  heroLabel.setTag('div');
  heroLabel.setStyles([s.label]);
  heroLabel.setAttribute('data-animate', 'fade-up');
  const heroLabelTxt = heroLabel.append(webflow.elementPresets.DOM);
  heroLabelTxt.setTag('div');
  heroLabelTxt.setTextContent('// Financing');

  const heroH = heroC.append(webflow.elementPresets.DOM);
  heroH.setTag('h1');
  heroH.setStyles([s.headingXL]);
  heroH.setTextContent('100% Financing Available');
  heroH.setAttribute('data-animate', 'opacity-sweep');

  const heroSub = heroC.append(webflow.elementPresets.DOM);
  heroSub.setTag('p');
  heroSub.setStyles([finHeroSub]);
  heroSub.setTextContent('Build now, pay over time.');
  heroSub.setAttribute('data-animate', 'fade-up');

  await safeCall('append:hero', () => body.append(hero));

  // SECTION 2: BENEFITS (warm bg, 3 cards)
  log('Building Section 2: Benefits...');
  const benefitsSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  benefitsSection.setTag('section');
  benefitsSection.setStyles([s.section, s.sectionWarm]);
  benefitsSection.setAttribute('id', 'fin-benefits');

  const grid = benefitsSection.append(webflow.elementPresets.DOM);
  grid.setTag('div');
  grid.setStyles([finGrid3]);
  grid.setAttribute('data-animate', 'fade-up-stagger');

  BENEFITS.forEach(b => {
    const card = grid.append(webflow.elementPresets.DOM);
    card.setTag('div');
    card.setStyles([finBenefitCard]);
    card.setAttribute('data-animate', 'fade-up');

    const title = card.append(webflow.elementPresets.DOM);
    title.setTag('h3');
    title.setStyles([finBenefitTitle]);
    title.setTextContent(b.title);

    const desc = card.append(webflow.elementPresets.DOM);
    desc.setTag('p');
    desc.setStyles([finBenefitDesc]);
    desc.setTextContent(b.desc);
  });

  await safeCall('append:benefits', () => body.append(benefitsSection));

  // SECTION 3: HOW IT WORKS (cream bg, 3 steps)
  log('Building Section 3: How It Works...');
  const stepsSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  stepsSection.setTag('section');
  stepsSection.setStyles([s.section, s.sectionCream]);
  stepsSection.setAttribute('id', 'fin-steps');

  const stepsHeader = stepsSection.append(webflow.elementPresets.DOM);
  stepsHeader.setTag('div');
  stepsHeader.setStyles([finMb64]);

  const stepsLabel = stepsHeader.append(webflow.elementPresets.DOM);
  stepsLabel.setTag('div');
  stepsLabel.setStyles([s.label, finMb32]);
  stepsLabel.setAttribute('data-animate', 'fade-up');
  const stepsLabelTxt = stepsLabel.append(webflow.elementPresets.DOM);
  stepsLabelTxt.setTag('div');
  stepsLabelTxt.setTextContent('How It Works');
  const stepsLabelLine = stepsLabel.append(webflow.elementPresets.DOM);
  stepsLabelLine.setTag('div');
  stepsLabelLine.setStyles([finLabelLine]);

  const stepsGrid = stepsSection.append(webflow.elementPresets.DOM);
  stepsGrid.setTag('div');
  stepsGrid.setStyles([finGrid3]);
  stepsGrid.setAttribute('data-animate', 'fade-up-stagger');

  STEPS.forEach(step => {
    const el = stepsGrid.append(webflow.elementPresets.DOM);
    el.setTag('div');
    el.setStyles([finStep]);
    el.setAttribute('data-animate', 'fade-up');

    const num = el.append(webflow.elementPresets.DOM);
    num.setTag('div');
    num.setStyles([finStepNum]);
    num.setTextContent(step.number);

    const title = el.append(webflow.elementPresets.DOM);
    title.setTag('h3');
    title.setStyles([finStepTitle]);
    title.setTextContent(step.title);

    const desc = el.append(webflow.elementPresets.DOM);
    desc.setTag('p');
    desc.setStyles([finStepDesc]);
    desc.setTextContent(step.desc);
  });

  await safeCall('append:steps', () => body.append(stepsSection));

  // SECTION 4: CTA
  log('Building Section 4: CTA...');
  await buildCTASection(
    body, v,
    'Get pre-qualified',
    'Apply Now', '/free-estimate',
    'Call Us', 'tel:7149003676',
  );

  await applyStyleProperties();

  log('Financing page built!', 'success');
  await webflow.notify({ type: 'Success', message: 'Financing page created!' });
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
  try { await buildFinancingPage(); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
