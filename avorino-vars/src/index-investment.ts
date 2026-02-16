// ════════════════════════════════════════════════════════════════
// Avorino Builder — INVESTMENT PAGE TEMPLATE
// Rename this to index.ts to build an investment page.
// Change PAGE_INDEX below:
//   0 = Investment Opportunity (/investment)
//   1 = Flipping Opportunity (/flippingopportunity)
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog, wait,
  safeCall, getAvorinVars, getOrCreateStyle, freshStyle,
  clearAndSet, createSharedStyles, setSharedStyleProps,
  createAllVariables, createPageWithSlug,
  buildCTASection, applyCTAStyleProps,
} from './shared.js';

// ═══ CHANGE THIS INDEX ═══
const PAGE_INDEX = 0;

const PAGES = [
  {
    slug: 'investment', name: 'Investment Opportunity',
    subtitle: 'Build equity and generate rental income with an ADU.',
    desc: 'Adding an ADU to your property is one of the highest-ROI home improvements in California. Generate monthly rental income while increasing your property value.',
    title: 'Investment Opportunity — Avorino', seoDesc: 'ADU investment opportunities in Orange County. 5–12% annual ROI with rental income.',
  },
  {
    slug: 'flippingopportunity', name: 'Flipping Opportunity',
    subtitle: 'Increase property value with a permitted ADU.',
    desc: 'Properties with permitted ADUs sell for significantly more. Build an ADU to increase resale value, then sell the package for a premium.',
    title: 'Flipping Opportunity — Avorino', seoDesc: 'ADU flipping opportunities in Orange County. Increase property value with a permitted ADU.',
  },
];

const PAGE = PAGES[PAGE_INDEX];

const STATS = [
  { number: '+30%', label: 'Property Value Increase' },
  { number: '5–12%', label: 'Annual ROI' },
  { number: '$2K–$4.5K+', label: 'Monthly Rental' },
];

const STEPS = [
  { number: '01', title: 'Find property', desc: 'Identify a property with ADU potential — lot size, zoning, and market demand.' },
  { number: '02', title: 'Design & permit', desc: 'We handle all architecture, engineering, and city approvals.' },
  { number: '03', title: 'Build & profit', desc: 'Rent for cash flow or sell the property with a permitted ADU for a premium.' },
];

const HEAD_CODE = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@COMMIT/pages/shared/shared-page-css.css">';
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
].join('\n');

document.getElementById('page-name')!.textContent = PAGE.name;
const headCodeEl = document.getElementById('head-code');
const footerCodeEl = document.getElementById('footer-code');
if (headCodeEl) headCodeEl.textContent = HEAD_CODE;
if (footerCodeEl) footerCodeEl.textContent = FOOTER_CODE;

async function buildInvestmentPage() {
  clearErrorLog();
  logDetail(`Starting ${PAGE.name} page build...`, 'info');
  const v = await getAvorinVars();

  log('Creating shared styles...');
  const s = await createSharedStyles();

  log('Creating page-specific styles...');
  const invHero = await getOrCreateStyle('inv-hero');
  const invHeroContent = await getOrCreateStyle('inv-hero-content');
  const invHeroSub = await getOrCreateStyle('inv-hero-subtitle');
  const invStatsGrid = await getOrCreateStyle('inv-stats-grid');
  const invStatItem = await getOrCreateStyle('inv-stat-item');
  const invStatNum = await getOrCreateStyle('inv-stat-num');
  const invStatLabel = await getOrCreateStyle('inv-stat-label');
  const invStepGrid = await getOrCreateStyle('inv-step-grid');
  const invStep = await getOrCreateStyle('inv-step');
  const invStepNum = await getOrCreateStyle('inv-step-num');
  const invStepTitle = await getOrCreateStyle('inv-step-title');
  const invStepDesc = await getOrCreateStyle('inv-step-desc');
  const invMb32 = await getOrCreateStyle('inv-mb-32');
  const invMb64 = await getOrCreateStyle('inv-mb-64');
  const invLabelLine = await getOrCreateStyle('inv-label-line');

  const { body } = await createPageWithSlug(PAGE.name, PAGE.slug, PAGE.title, PAGE.seoDesc);

  async function applyStyleProperties() {
    log('Setting shared style properties...');
    await setSharedStyleProps(s, v);
    await wait(1000);

    log('Setting page-specific style properties...');

    await clearAndSet(await freshStyle('inv-hero'), 'inv-hero', {
      'min-height': '50vh', 'display': 'flex', 'align-items': 'flex-end',
      'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('inv-hero-content'), 'inv-hero-content', {
      'position': 'relative', 'z-index': '2', 'max-width': '700px',
    });
    await clearAndSet(await freshStyle('inv-hero-subtitle'), 'inv-hero-subtitle', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.9', 'opacity': '0.6', 'margin-top': '24px', 'color': v['av-cream'],
    });
    await wait(500);

    // Stats
    await clearAndSet(await freshStyle('inv-stats-grid'), 'inv-stats-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr',
      'grid-column-gap': '64px', 'grid-row-gap': '64px', 'text-align': 'center',
    });
    await clearAndSet(await freshStyle('inv-stat-item'), 'inv-stat-item', {
      'display': 'flex', 'flex-direction': 'column', 'align-items': 'center', 'grid-row-gap': '24px',
    });
    await clearAndSet(await freshStyle('inv-stat-num'), 'inv-stat-num', {
      'font-family': 'DM Serif Display',
      'font-size': 'clamp(40px, 5vw, 72px)',
      'line-height': '1', 'letter-spacing': '-0.03em', 'font-weight': '400',
      'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('inv-stat-label'), 'inv-stat-label', {
      'font-family': 'DM Sans', 'font-size': v['av-text-label'],
      'letter-spacing': '0.25em', 'text-transform': 'uppercase',
      'opacity': '0.4', 'color': v['av-cream'],
    });
    await wait(500);

    // Steps
    await clearAndSet(await freshStyle('inv-step-grid'), 'inv-step-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr',
      'grid-column-gap': '32px', 'grid-row-gap': '32px',
    });
    await clearAndSet(await freshStyle('inv-step'), 'inv-step', {
      'display': 'flex', 'flex-direction': 'column',
    });
    await clearAndSet(await freshStyle('inv-step-num'), 'inv-step-num', {
      'font-family': 'DM Sans', 'font-size': v['av-text-label'],
      'letter-spacing': '0.3em', 'text-transform': 'uppercase',
      'opacity': '0.3', 'margin-bottom': '24px',
    });
    await clearAndSet(await freshStyle('inv-step-title'), 'inv-step-title', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
      'line-height': '1.12', 'font-weight': '400', 'margin-bottom': '16px',
    });
    await clearAndSet(await freshStyle('inv-step-desc'), 'inv-step-desc', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.9', 'opacity': '0.6',
    });
    await wait(500);

    await clearAndSet(await freshStyle('inv-mb-32'), 'inv-mb-32', { 'margin-bottom': v['av-gap-sm'] });
    await clearAndSet(await freshStyle('inv-mb-64'), 'inv-mb-64', { 'margin-bottom': v['av-gap-md'] });
    await clearAndSet(await freshStyle('inv-label-line'), 'inv-label-line', { 'flex-grow': '1', 'height': '1px', 'background-color': v['av-dark-15'] });

    await applyCTAStyleProps(v);
  }

  // ═══════════════ BUILD ELEMENTS ═══════════════

  // SECTION 1: HERO
  log('Building Section 1: Hero...');
  const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
  hero.setTag('section');
  hero.setStyles([invHero]);
  hero.setAttribute('id', 'inv-hero');

  const heroC = hero.append(webflow.elementPresets.DOM);
  heroC.setTag('div');
  heroC.setStyles([invHeroContent]);

  const heroLabel = heroC.append(webflow.elementPresets.DOM);
  heroLabel.setTag('div');
  heroLabel.setStyles([s.label]);
  heroLabel.setAttribute('data-animate', 'fade-up');
  const heroLabelTxt = heroLabel.append(webflow.elementPresets.DOM);
  heroLabelTxt.setTag('div');
  heroLabelTxt.setTextContent(`// ${PAGE.name}`);

  const heroH = heroC.append(webflow.elementPresets.DOM);
  heroH.setTag('h1');
  heroH.setStyles([s.headingXL]);
  heroH.setTextContent(PAGE.name);
  heroH.setAttribute('data-animate', 'opacity-sweep');

  const heroSub = heroC.append(webflow.elementPresets.DOM);
  heroSub.setTag('p');
  heroSub.setStyles([invHeroSub]);
  heroSub.setTextContent(PAGE.subtitle);
  heroSub.setAttribute('data-animate', 'fade-up');

  await safeCall('append:hero', () => body.append(hero));

  // SECTION 2: OVERVIEW + DESCRIPTION (warm, centered)
  log('Building Section 2: Overview...');
  const overSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  overSection.setTag('section');
  overSection.setStyles([s.section, s.sectionWarm]);
  overSection.setAttribute('id', 'inv-overview');

  const overP = overSection.append(webflow.elementPresets.DOM);
  overP.setTag('p');
  overP.setStyles([s.body, s.bodyMuted]);
  overP.setTextContent(PAGE.desc);
  overP.setAttribute('data-animate', 'fade-up');

  await safeCall('append:overview', () => body.append(overSection));

  // SECTION 3: RETURNS (dark, stats)
  log('Building Section 3: Returns...');
  const statsSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  statsSection.setTag('section');
  statsSection.setStyles([s.section, s.sectionDark]);
  statsSection.setAttribute('id', 'inv-returns');

  const statsG = statsSection.append(webflow.elementPresets.DOM);
  statsG.setTag('div');
  statsG.setStyles([invStatsGrid]);

  STATS.forEach(stat => {
    const item = statsG.append(webflow.elementPresets.DOM);
    item.setTag('div');
    item.setStyles([invStatItem]);
    item.setAttribute('data-animate', 'fade-up');

    const num = item.append(webflow.elementPresets.DOM);
    num.setTag('div');
    num.setStyles([invStatNum]);
    num.setTextContent(stat.number);

    const lbl = item.append(webflow.elementPresets.DOM);
    lbl.setTag('div');
    lbl.setStyles([invStatLabel]);
    lbl.setTextContent(stat.label);
  });

  await safeCall('append:returns', () => body.append(statsSection));

  // SECTION 4: PROCESS (cream, 3-step)
  log('Building Section 4: Process...');
  const procSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  procSection.setTag('section');
  procSection.setStyles([s.section, s.sectionCream]);
  procSection.setAttribute('id', 'inv-process');

  const procHeader = procSection.append(webflow.elementPresets.DOM);
  procHeader.setTag('div');
  procHeader.setStyles([invMb64]);

  const procLabel = procHeader.append(webflow.elementPresets.DOM);
  procLabel.setTag('div');
  procLabel.setStyles([s.label, invMb32]);
  procLabel.setAttribute('data-animate', 'fade-up');
  const procLabelTxt = procLabel.append(webflow.elementPresets.DOM);
  procLabelTxt.setTag('div');
  procLabelTxt.setTextContent('How It Works');
  const procLabelLine = procLabel.append(webflow.elementPresets.DOM);
  procLabelLine.setTag('div');
  procLabelLine.setStyles([invLabelLine]);

  const stepGrid = procSection.append(webflow.elementPresets.DOM);
  stepGrid.setTag('div');
  stepGrid.setStyles([invStepGrid]);
  stepGrid.setAttribute('data-animate', 'fade-up-stagger');

  STEPS.forEach(step => {
    const el = stepGrid.append(webflow.elementPresets.DOM);
    el.setTag('div');
    el.setStyles([invStep]);
    el.setAttribute('data-animate', 'fade-up');

    const num = el.append(webflow.elementPresets.DOM);
    num.setTag('div');
    num.setStyles([invStepNum]);
    num.setTextContent(step.number);

    const title = el.append(webflow.elementPresets.DOM);
    title.setTag('h3');
    title.setStyles([invStepTitle]);
    title.setTextContent(step.title);

    const desc = el.append(webflow.elementPresets.DOM);
    desc.setTag('p');
    desc.setStyles([invStepDesc]);
    desc.setTextContent(step.desc);
  });

  await safeCall('append:process', () => body.append(procSection));

  // SECTION 5: CTA
  log('Building Section 5: CTA...');
  await buildCTASection(body, v, 'Get started', 'Get a Free Estimate', '/free-estimate', 'ROI Calculator', '/roi-calculator');

  await applyStyleProperties();

  log(`${PAGE.name} page built!`, 'success');
  await webflow.notify({ type: 'Success', message: `${PAGE.name} page created!` });
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
  try { await buildInvestmentPage(); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
