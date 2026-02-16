// ════════════════════════════════════════════════════════════════
// Avorino Builder — ADU PAGE
// Rename this to index.ts to build the ADU page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog, wait,
  safeCall, getAvorinVars, getOrCreateStyle, freshStyle,
  clearAndSet, createSharedStyles, setSharedStyleProps,
  createAllVariables, createPageWithSlug,
  buildCTASection, applyCTAStyleProps,
} from './shared.js';

// ── Page config ──
const PAGE_NAME = 'ADU';
const PAGE_SLUG = 'adu';
const PAGE_TITLE = 'ADU Construction in Orange County — Avorino';
const PAGE_DESC = 'Detached, attached, and garage conversion ADUs in Orange County. Fully permitted, designed, and built by Avorino.';
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
const ADU_TYPES = [
  { number: '01', title: 'Detached ADU', desc: 'Standalone unit in your backyard. Maximum privacy and design flexibility.' },
  { number: '02', title: 'Attached ADU', desc: 'Extension connected to your home with its own private entrance.' },
  { number: '03', title: 'Garage Conversion', desc: 'Convert your existing garage. Most affordable option, starting at $75K.' },
  { number: '04', title: 'Above-Garage ADU', desc: 'Second story above your garage. Keeps parking, adds living space.' },
];

const COST_STATS = [
  { number: '$250K–$400K', label: 'Project Cost' },
  { number: '$2K–$4.5K+', label: 'Monthly Rental' },
  { number: '5–12%', label: 'Annual ROI' },
  { number: '8–15 yr', label: 'Break-Even' },
];

const PROCESS_STEPS = [
  { number: 'Step 01', title: 'Design', time: '4–6 months', desc: 'Custom architectural plans, engineering, and structural calculations.' },
  { number: 'Step 02', title: 'Permits', time: '(included)', desc: 'We submit to your city and manage all approvals.' },
  { number: 'Step 03', title: 'Build', time: '6–8 months', desc: 'Licensed crew, weekly updates, on-budget delivery.' },
];

// ── Build function ──
async function buildADUPage() {
  clearErrorLog();
  logDetail('Starting ADU page build...', 'info');
  const v = await getAvorinVars();
  logDetail('Loaded Avorino variable collection', 'ok');

  log('Creating shared styles...');
  const s = await createSharedStyles();
  logDetail('Shared styles done', 'ok');

  // ── Page-specific styles ──
  log('Creating page-specific styles...');
  // Hero
  const aduHero = await getOrCreateStyle('adu-hero');
  const aduHeroContent = await getOrCreateStyle('adu-hero-content');
  const aduHeroSub = await getOrCreateStyle('adu-hero-subtitle');
  // Overview 2-col
  const aduImgPlaceholder = await getOrCreateStyle('adu-img-placeholder');
  // Type cards
  const aduGrid4 = await getOrCreateStyle('adu-grid-4');
  const aduTypeCard = await getOrCreateStyle('adu-type-card');
  const aduTypeNum = await getOrCreateStyle('adu-type-num');
  const aduTypeTitle = await getOrCreateStyle('adu-type-title');
  const aduTypeDesc = await getOrCreateStyle('adu-type-desc');
  // Stats
  const aduStatsGrid = await getOrCreateStyle('adu-stats-grid');
  const aduStatItem = await getOrCreateStyle('adu-stat-item');
  const aduStatNum = await getOrCreateStyle('adu-stat-num');
  const aduStatLabel = await getOrCreateStyle('adu-stat-label');
  // Process steps
  const aduStepsGrid = await getOrCreateStyle('adu-steps-grid');
  const aduStep = await getOrCreateStyle('adu-step');
  const aduStepNum = await getOrCreateStyle('adu-step-num');
  const aduStepTitle = await getOrCreateStyle('adu-step-title');
  const aduStepTime = await getOrCreateStyle('adu-step-time');
  const aduStepDesc = await getOrCreateStyle('adu-step-desc');
  // Utility
  const aduMb64 = await getOrCreateStyle('adu-mb-64');
  const aduLabelLine = await getOrCreateStyle('adu-label-line');
  const aduMb32 = await getOrCreateStyle('adu-mb-32');

  // ── Create page ──
  const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);

  // ── Style property setter ──
  async function applyStyleProperties() {
    log('Setting shared style properties...');
    await setSharedStyleProps(s, v);
    await wait(1000);

    log('Setting page-specific style properties...');

    // Hero
    logDetail('Setting hero props...', 'info');
    await clearAndSet(await freshStyle('adu-hero'), 'adu-hero', {
      'min-height': '60vh', 'display': 'flex', 'align-items': 'flex-end',
      'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('adu-hero-content'), 'adu-hero-content', {
      'position': 'relative', 'z-index': '2', 'max-width': '800px',
    });
    await clearAndSet(await freshStyle('adu-hero-subtitle'), 'adu-hero-subtitle', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.9', 'opacity': '0.6', 'margin-top': '24px', 'color': v['av-cream'],
    });
    await wait(500);

    // Image placeholder
    await clearAndSet(await freshStyle('adu-img-placeholder'), 'adu-img-placeholder', {
      'background-color': 'rgba(240,237,232,0.06)',
      'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
      'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
      'min-height': '400px',
    });
    await wait(500);

    // Type cards (4-col grid)
    logDetail('Setting type card props...', 'info');
    await clearAndSet(await freshStyle('adu-grid-4'), 'adu-grid-4', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr 1fr',
      'grid-column-gap': '24px', 'grid-row-gap': '24px',
    });
    await clearAndSet(await freshStyle('adu-type-card'), 'adu-type-card', {
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
      'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
      'padding-top': v['av-gap-md'], 'padding-bottom': v['av-gap-md'],
      'padding-left': '40px', 'padding-right': '40px',
    });
    await clearAndSet(await freshStyle('adu-type-num'), 'adu-type-num', {
      'font-family': 'DM Sans', 'font-size': v['av-text-label'],
      'letter-spacing': '0.3em', 'text-transform': 'uppercase',
      'opacity': '0.3', 'margin-bottom': '24px',
    });
    await clearAndSet(await freshStyle('adu-type-title'), 'adu-type-title', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
      'line-height': '1.12', 'font-weight': '400',
      'margin-bottom': '16px', 'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('adu-type-desc'), 'adu-type-desc', {
      'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
      'line-height': '1.7', 'opacity': '0.6', 'color': v['av-cream'],
    });
    await wait(500);

    // Stats
    logDetail('Setting stats props...', 'info');
    await clearAndSet(await freshStyle('adu-stats-grid'), 'adu-stats-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr 1fr',
      'grid-column-gap': '64px', 'grid-row-gap': '64px', 'text-align': 'center',
    });
    await clearAndSet(await freshStyle('adu-stat-item'), 'adu-stat-item', {
      'display': 'flex', 'flex-direction': 'column', 'align-items': 'center', 'grid-row-gap': '24px',
    });
    await clearAndSet(await freshStyle('adu-stat-num'), 'adu-stat-num', {
      'font-family': 'DM Serif Display',
      'font-size': 'clamp(36px, 5vw, 64px)',
      'line-height': '1', 'letter-spacing': '-0.03em', 'font-weight': '400',
      'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('adu-stat-label'), 'adu-stat-label', {
      'font-family': 'DM Sans', 'font-size': v['av-text-label'],
      'letter-spacing': '0.25em', 'text-transform': 'uppercase',
      'opacity': '0.4', 'color': v['av-cream'],
    });
    await wait(500);

    // Process steps (3-col)
    logDetail('Setting process step props...', 'info');
    await clearAndSet(await freshStyle('adu-steps-grid'), 'adu-steps-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr',
      'grid-column-gap': '32px', 'grid-row-gap': '32px',
    });
    await clearAndSet(await freshStyle('adu-step'), 'adu-step', {
      'display': 'flex', 'flex-direction': 'column',
    });
    await clearAndSet(await freshStyle('adu-step-num'), 'adu-step-num', {
      'font-family': 'DM Sans', 'font-size': v['av-text-label'],
      'letter-spacing': '0.3em', 'text-transform': 'uppercase',
      'opacity': '0.3', 'margin-bottom': '24px',
    });
    await clearAndSet(await freshStyle('adu-step-title'), 'adu-step-title', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
      'line-height': '1.12', 'font-weight': '400', 'margin-bottom': '8px',
    });
    await clearAndSet(await freshStyle('adu-step-time'), 'adu-step-time', {
      'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
      'opacity': '0.5', 'margin-bottom': '16px',
    });
    await clearAndSet(await freshStyle('adu-step-desc'), 'adu-step-desc', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.9', 'opacity': '0.6',
    });
    await wait(500);

    // Utility
    await clearAndSet(await freshStyle('adu-mb-64'), 'adu-mb-64', { 'margin-bottom': v['av-gap-md'] });
    await clearAndSet(await freshStyle('adu-mb-32'), 'adu-mb-32', { 'margin-bottom': v['av-gap-sm'] });
    await clearAndSet(await freshStyle('adu-label-line'), 'adu-label-line', { 'flex-grow': '1', 'height': '1px', 'background-color': v['av-dark-15'] });

    // CTA
    await applyCTAStyleProps(v);
  }

  // ═══════════════ BUILD ELEMENTS ═══════════════

  // SECTION 1: HERO
  log('Building Section 1: Hero...');
  const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
  hero.setTag('section');
  hero.setStyles([aduHero]);
  hero.setAttribute('id', 'adu-hero');

  const heroC = hero.append(webflow.elementPresets.DOM);
  heroC.setTag('div');
  heroC.setStyles([aduHeroContent]);

  const heroLabel = heroC.append(webflow.elementPresets.DOM);
  heroLabel.setTag('div');
  heroLabel.setStyles([s.label]);
  heroLabel.setAttribute('data-animate', 'fade-up');
  const heroLabelTxt = heroLabel.append(webflow.elementPresets.DOM);
  heroLabelTxt.setTag('div');
  heroLabelTxt.setTextContent('// ADU Construction');

  const heroH = heroC.append(webflow.elementPresets.DOM);
  heroH.setTag('h1');
  heroH.setStyles([s.headingXL]);
  heroH.setTextContent('ADU Construction in Orange County');
  heroH.setAttribute('data-animate', 'opacity-sweep');

  const heroSub = heroC.append(webflow.elementPresets.DOM);
  heroSub.setTag('p');
  heroSub.setStyles([aduHeroSub]);
  heroSub.setTextContent('Fully permitted accessory dwelling units — designed, engineered, and built by Avorino.');
  heroSub.setAttribute('data-animate', 'fade-up');

  await safeCall('append:hero', () => body.append(hero));
  logDetail('Section 1: Hero appended', 'ok');

  // SECTION 2: WHAT IS AN ADU (warm, 2-col: image + text)
  log('Building Section 2: Overview...');
  const overviewSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  overviewSection.setTag('section');
  overviewSection.setStyles([s.section, s.sectionWarm]);
  overviewSection.setAttribute('id', 'adu-overview');

  const overGrid = overviewSection.append(webflow.elementPresets.DOM);
  overGrid.setTag('div');
  overGrid.setStyles([s.grid2]);

  // Left: image placeholder
  const overImg = overGrid.append(webflow.elementPresets.DOM);
  overImg.setTag('div');
  overImg.setStyles([aduImgPlaceholder]);
  overImg.setAttribute('data-animate', 'parallax-depth');

  // Right: text
  const overText = overGrid.append(webflow.elementPresets.DOM);
  overText.setTag('div');

  const overLabel = overText.append(webflow.elementPresets.DOM);
  overLabel.setTag('div');
  overLabel.setStyles([s.label, aduMb32]);
  overLabel.setAttribute('data-animate', 'fade-up');
  const overLabelTxt = overLabel.append(webflow.elementPresets.DOM);
  overLabelTxt.setTag('div');
  overLabelTxt.setTextContent('What Is an ADU');

  const overH = overText.append(webflow.elementPresets.DOM);
  overH.setTag('h2');
  overH.setStyles([s.headingXL, aduMb32]);
  overH.setTextContent('A second home on your property');
  overH.setAttribute('data-animate', 'blur-focus');

  const overP = overText.append(webflow.elementPresets.DOM);
  overP.setTag('p');
  overP.setStyles([s.body, s.bodyMuted]);
  overP.setTextContent('An accessory dwelling unit is an independent residential unit on the same lot as a single-family home. It can be a detached backyard structure, an attached extension, or a converted garage.');
  overP.setAttribute('data-animate', 'fade-up');

  await safeCall('append:overview', () => body.append(overviewSection));
  logDetail('Section 2: Overview appended', 'ok');

  // SECTION 3: ADU TYPES (cream bg, 4-card grid)
  log('Building Section 3: ADU Types...');
  const typesSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  typesSection.setTag('section');
  typesSection.setStyles([s.section, s.sectionCream]);
  typesSection.setAttribute('id', 'adu-types');

  const typesHeader = typesSection.append(webflow.elementPresets.DOM);
  typesHeader.setTag('div');
  typesHeader.setStyles([aduMb64]);

  const typesLabel = typesHeader.append(webflow.elementPresets.DOM);
  typesLabel.setTag('div');
  typesLabel.setStyles([s.label, aduMb32]);
  typesLabel.setAttribute('data-animate', 'fade-up');
  const typesLabelTxt = typesLabel.append(webflow.elementPresets.DOM);
  typesLabelTxt.setTag('div');
  typesLabelTxt.setTextContent('ADU Types');
  const typesLabelLine = typesLabel.append(webflow.elementPresets.DOM);
  typesLabelLine.setTag('div');
  typesLabelLine.setStyles([aduLabelLine]);

  const typesH = typesHeader.append(webflow.elementPresets.DOM);
  typesH.setTag('h2');
  typesH.setStyles([s.headingXL]);
  typesH.setTextContent('Four ways to build');
  typesH.setAttribute('data-animate', 'blur-focus');

  const typesGrid = typesSection.append(webflow.elementPresets.DOM);
  typesGrid.setTag('div');
  typesGrid.setStyles([aduGrid4]);
  typesGrid.setAttribute('data-animate', 'fade-up-stagger');

  ADU_TYPES.forEach(type => {
    const card = typesGrid.append(webflow.elementPresets.DOM);
    card.setTag('div');
    card.setStyles([aduTypeCard]);
    card.setAttribute('data-animate', 'fade-up');

    const num = card.append(webflow.elementPresets.DOM);
    num.setTag('div');
    num.setStyles([aduTypeNum]);
    num.setTextContent(type.number);

    const title = card.append(webflow.elementPresets.DOM);
    title.setTag('h3');
    title.setStyles([aduTypeTitle]);
    title.setTextContent(type.title);

    const desc = card.append(webflow.elementPresets.DOM);
    desc.setTag('p');
    desc.setStyles([aduTypeDesc]);
    desc.setTextContent(type.desc);
  });

  await safeCall('append:types', () => body.append(typesSection));
  logDetail('Section 3: ADU Types appended', 'ok');

  // SECTION 4: COST & ROI (dark bg, stats row)
  log('Building Section 4: Cost & ROI...');
  const costSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  costSection.setTag('section');
  costSection.setStyles([s.section, s.sectionDark]);
  costSection.setAttribute('id', 'adu-cost');

  const costHeader = costSection.append(webflow.elementPresets.DOM);
  costHeader.setTag('div');
  costHeader.setStyles([aduMb64]);

  const costLabel = costHeader.append(webflow.elementPresets.DOM);
  costLabel.setTag('div');
  costLabel.setStyles([s.label, aduMb32]);
  costLabel.setAttribute('data-animate', 'fade-up');
  const costLabelTxt = costLabel.append(webflow.elementPresets.DOM);
  costLabelTxt.setTag('div');
  costLabelTxt.setTextContent('Cost & ROI');

  const costH = costHeader.append(webflow.elementPresets.DOM);
  costH.setTag('h2');
  costH.setStyles([s.headingXL]);
  costH.setTextContent('The numbers');
  costH.setAttribute('data-animate', 'blur-focus');

  const statsG = costSection.append(webflow.elementPresets.DOM);
  statsG.setTag('div');
  statsG.setStyles([aduStatsGrid]);

  COST_STATS.forEach(stat => {
    const item = statsG.append(webflow.elementPresets.DOM);
    item.setTag('div');
    item.setStyles([aduStatItem]);
    item.setAttribute('data-animate', 'fade-up');

    const num = item.append(webflow.elementPresets.DOM);
    num.setTag('div');
    num.setStyles([aduStatNum]);
    num.setTextContent(stat.number);

    const lbl = item.append(webflow.elementPresets.DOM);
    lbl.setTag('div');
    lbl.setStyles([aduStatLabel]);
    lbl.setTextContent(stat.label);
  });

  await safeCall('append:cost', () => body.append(costSection));
  logDetail('Section 4: Cost & ROI appended', 'ok');

  // SECTION 5: HOW IT WORKS (warm bg, 3 steps with timeframes — merged Timeline + Process)
  log('Building Section 5: How It Works...');
  const processSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  processSection.setTag('section');
  processSection.setStyles([s.section, s.sectionWarm]);
  processSection.setAttribute('id', 'adu-process');

  const procHeader = processSection.append(webflow.elementPresets.DOM);
  procHeader.setTag('div');
  procHeader.setStyles([aduMb64]);

  const procLabel = procHeader.append(webflow.elementPresets.DOM);
  procLabel.setTag('div');
  procLabel.setStyles([s.label, aduMb32]);
  procLabel.setAttribute('data-animate', 'fade-up');
  const procLabelTxt = procLabel.append(webflow.elementPresets.DOM);
  procLabelTxt.setTag('div');
  procLabelTxt.setTextContent('How It Works');
  const procLabelLine = procLabel.append(webflow.elementPresets.DOM);
  procLabelLine.setTag('div');
  procLabelLine.setStyles([aduLabelLine]);

  const procH = procHeader.append(webflow.elementPresets.DOM);
  procH.setTag('h2');
  procH.setStyles([s.headingXL]);
  procH.setTextContent('Three steps to your ADU');
  procH.setAttribute('data-animate', 'blur-focus');

  const stepsGrid = processSection.append(webflow.elementPresets.DOM);
  stepsGrid.setTag('div');
  stepsGrid.setStyles([aduStepsGrid]);
  stepsGrid.setAttribute('data-animate', 'fade-up-stagger');

  PROCESS_STEPS.forEach(step => {
    const el = stepsGrid.append(webflow.elementPresets.DOM);
    el.setTag('div');
    el.setStyles([aduStep]);
    el.setAttribute('data-animate', 'fade-up');

    const num = el.append(webflow.elementPresets.DOM);
    num.setTag('div');
    num.setStyles([aduStepNum]);
    num.setTextContent(step.number);

    const title = el.append(webflow.elementPresets.DOM);
    title.setTag('h3');
    title.setStyles([aduStepTitle]);
    title.setTextContent(step.title);

    const time = el.append(webflow.elementPresets.DOM);
    time.setTag('div');
    time.setStyles([aduStepTime]);
    time.setTextContent(step.time);

    const desc = el.append(webflow.elementPresets.DOM);
    desc.setTag('p');
    desc.setStyles([aduStepDesc]);
    desc.setTextContent(step.desc);
  });

  await safeCall('append:process', () => body.append(processSection));
  logDetail('Section 5: How It Works appended', 'ok');

  // SECTION 6: CTA
  log('Building Section 6: CTA...');
  await buildCTASection(
    body, v,
    'Get your ADU estimate',
    'ADU Cost Calculator', '/adu-cost-estimator',
    'Get a Free Estimate', '/free-estimate',
  );

  // ═══════════════ APPLY STYLES ═══════════════
  await applyStyleProperties();

  log('ADU page built! Add custom code manually (see instructions below).', 'success');
  await webflow.notify({ type: 'Success', message: 'ADU page created! Now add custom code manually.' });
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
  try { await buildADUPage(); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
