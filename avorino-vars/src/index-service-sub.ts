// ════════════════════════════════════════════════════════════════
// Avorino Builder — SERVICE SUB-PAGE TEMPLATE
// Rename this to index.ts to build a service sub-page.
// Change SERVICE_INDEX below to select which service to build:
//   0 = Custom Home (/buildcustomhome)
//   1 = New Construction (/newconstruction)
//   2 = Property Additions (/addition)
//   3 = Garage Conversion (/garageconversion)
//   4 = Commercial (/commercial)
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog, wait,
  safeCall, getAvorinVars, getOrCreateStyle, freshStyle,
  clearAndSet, createSharedStyles, setSharedStyleProps,
  createAllVariables, createPageWithSlug,
  buildCTASection, applyCTAStyleProps,
} from './shared.js';

// ═══ CHANGE THIS INDEX TO BUILD A DIFFERENT SERVICE PAGE ═══
const SERVICE_INDEX = 0;

// ── Service data ──
const SERVICES = [
  {
    slug: 'buildcustomhome', name: 'Custom Home Building',
    subtitle: 'Ground-up custom residences in Orange County.',
    desc: 'Build a home designed around your life — from floor plan to finishes. We handle architecture, engineering, permitting, and construction.',
    cost: '$350–$550/sqft', timeline: '12–18 months',
    title: 'Custom Home Building — Avorino Construction',
    seoDesc: 'Custom home construction in Orange County. Full design-to-build service by Avorino.',
  },
  {
    slug: 'newconstruction', name: 'New Construction',
    subtitle: 'New builds for landowners in Orange County.',
    desc: 'Turn your vacant lot into a finished home. Full build from site prep through final inspection — engineering, permits, and all finishes.',
    cost: '$350–$550/sqft', timeline: '6–10 months',
    title: 'New Construction — Avorino Construction',
    seoDesc: 'New construction for landowners in Orange County. Engineering, permits, and full-service building.',
  },
  {
    slug: 'addition', name: 'Property Additions',
    subtitle: 'Expand your living space without moving.',
    desc: 'Room additions, second stories, and extensions. Maximize your square footage and property value without relocating.',
    cost: '$300–$500/sqft', timeline: '4–8 months',
    title: 'Property Additions — Avorino Construction',
    seoDesc: 'Room additions and second-story extensions in Orange County. Licensed and fully permitted.',
  },
  {
    slug: 'garageconversion', name: 'Garage Conversion',
    subtitle: 'The most affordable ADU option.',
    desc: 'Convert your garage into a functional living space. Uses existing structure and utilities, keeping costs lower than new construction.',
    cost: '$75K–$150K', timeline: '3–5 months',
    title: 'Garage Conversion — Avorino Construction',
    seoDesc: 'Garage conversions in Orange County starting at $75K. Fully permitted by Avorino.',
  },
  {
    slug: 'commercial', name: 'Commercial Construction',
    subtitle: 'Tenant improvements and renovations.',
    desc: 'Office buildouts, retail renovations, and tenant improvements. Functional, visually compelling commercial spaces delivered on time.',
    cost: 'Varies', timeline: 'Varies',
    title: 'Commercial Construction — Avorino Construction',
    seoDesc: 'Tenant improvements and commercial renovations in Orange County by Avorino.',
  },
];

const SVC = SERVICES[SERVICE_INDEX];

const PROCESS = [
  { number: '01', title: 'Design', desc: 'Custom plans tailored to your goals. Full architectural and engineering support.' },
  { number: '02', title: 'Permits', desc: 'We handle all city submissions, plan checks, and approvals.' },
  { number: '03', title: 'Build', desc: 'Licensed crew, transparent timeline, on-budget delivery.' },
];

const HEAD_CODE = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@COMMIT/pages/shared/shared-page-css.css">';
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
].join('\n');

// ── Update panel UI ──
document.getElementById('page-name')!.textContent = SVC.name;
const headCodeEl = document.getElementById('head-code');
const footerCodeEl = document.getElementById('footer-code');
if (headCodeEl) headCodeEl.textContent = HEAD_CODE;
if (footerCodeEl) footerCodeEl.textContent = FOOTER_CODE;

// ── Build function ──
async function buildServiceSubPage() {
  clearErrorLog();
  logDetail(`Starting ${SVC.name} page build...`, 'info');
  const v = await getAvorinVars();

  log('Creating shared styles...');
  const s = await createSharedStyles();

  // ── Page-specific styles ──
  log('Creating page-specific styles...');
  const svHero = await getOrCreateStyle('svsub-hero');
  const svHeroContent = await getOrCreateStyle('svsub-hero-content');
  const svHeroSub = await getOrCreateStyle('svsub-hero-subtitle');
  const svImgPlaceholder = await getOrCreateStyle('svsub-img-placeholder');
  const svStepGrid = await getOrCreateStyle('svsub-step-grid');
  const svStep = await getOrCreateStyle('svsub-step');
  const svStepNum = await getOrCreateStyle('svsub-step-num');
  const svStepTitle = await getOrCreateStyle('svsub-step-title');
  const svStepDesc = await getOrCreateStyle('svsub-step-desc');
  const svStatsGrid = await getOrCreateStyle('svsub-stats-grid');
  const svStatItem = await getOrCreateStyle('svsub-stat-item');
  const svStatNum = await getOrCreateStyle('svsub-stat-num');
  const svStatLabel = await getOrCreateStyle('svsub-stat-label');
  const svMb32 = await getOrCreateStyle('svsub-mb-32');
  const svMb64 = await getOrCreateStyle('svsub-mb-64');
  const svLabelLine = await getOrCreateStyle('svsub-label-line');

  const { body } = await createPageWithSlug(SVC.name, SVC.slug, SVC.title, SVC.seoDesc);

  async function applyStyleProperties() {
    log('Setting shared style properties...');
    await setSharedStyleProps(s, v);
    await wait(1000);

    log('Setting page-specific style properties...');

    // Hero
    await clearAndSet(await freshStyle('svsub-hero'), 'svsub-hero', {
      'min-height': '50vh', 'display': 'flex', 'align-items': 'flex-end',
      'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('svsub-hero-content'), 'svsub-hero-content', {
      'position': 'relative', 'z-index': '2', 'max-width': '700px',
    });
    await clearAndSet(await freshStyle('svsub-hero-subtitle'), 'svsub-hero-subtitle', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.9', 'opacity': '0.6', 'margin-top': '24px', 'color': v['av-cream'],
    });
    await wait(500);

    // Image placeholder
    await clearAndSet(await freshStyle('svsub-img-placeholder'), 'svsub-img-placeholder', {
      'background-color': 'rgba(240,237,232,0.06)',
      'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
      'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
      'min-height': '400px',
    });
    await wait(500);

    // Process steps
    await clearAndSet(await freshStyle('svsub-step-grid'), 'svsub-step-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr',
      'grid-column-gap': '32px', 'grid-row-gap': '32px',
    });
    await clearAndSet(await freshStyle('svsub-step'), 'svsub-step', {
      'display': 'flex', 'flex-direction': 'column',
    });
    await clearAndSet(await freshStyle('svsub-step-num'), 'svsub-step-num', {
      'font-family': 'DM Sans', 'font-size': v['av-text-label'],
      'letter-spacing': '0.3em', 'text-transform': 'uppercase',
      'opacity': '0.3', 'margin-bottom': '24px',
    });
    await clearAndSet(await freshStyle('svsub-step-title'), 'svsub-step-title', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
      'line-height': '1.12', 'font-weight': '400', 'margin-bottom': '16px',
    });
    await clearAndSet(await freshStyle('svsub-step-desc'), 'svsub-step-desc', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.9', 'opacity': '0.6',
    });
    await wait(500);

    // Stats (cost + timeline)
    await clearAndSet(await freshStyle('svsub-stats-grid'), 'svsub-stats-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr',
      'grid-column-gap': '64px', 'grid-row-gap': '64px', 'text-align': 'center',
    });
    await clearAndSet(await freshStyle('svsub-stat-item'), 'svsub-stat-item', {
      'display': 'flex', 'flex-direction': 'column', 'align-items': 'center', 'grid-row-gap': '24px',
    });
    await clearAndSet(await freshStyle('svsub-stat-num'), 'svsub-stat-num', {
      'font-family': 'DM Serif Display',
      'font-size': 'clamp(36px, 5vw, 64px)',
      'line-height': '1', 'letter-spacing': '-0.03em', 'font-weight': '400',
      'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('svsub-stat-label'), 'svsub-stat-label', {
      'font-family': 'DM Sans', 'font-size': v['av-text-label'],
      'letter-spacing': '0.25em', 'text-transform': 'uppercase',
      'opacity': '0.4', 'color': v['av-cream'],
    });
    await wait(500);

    // Utility
    await clearAndSet(await freshStyle('svsub-mb-32'), 'svsub-mb-32', { 'margin-bottom': v['av-gap-sm'] });
    await clearAndSet(await freshStyle('svsub-mb-64'), 'svsub-mb-64', { 'margin-bottom': v['av-gap-md'] });
    await clearAndSet(await freshStyle('svsub-label-line'), 'svsub-label-line', { 'flex-grow': '1', 'height': '1px', 'background-color': v['av-dark-15'] });

    await applyCTAStyleProps(v);
  }

  // ═══════════════ BUILD ELEMENTS ═══════════════

  // SECTION 1: HERO
  log('Building Section 1: Hero...');
  const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
  hero.setTag('section');
  hero.setStyles([svHero]);
  hero.setAttribute('id', 'svsub-hero');

  const heroC = hero.append(webflow.elementPresets.DOM);
  heroC.setTag('div');
  heroC.setStyles([svHeroContent]);

  const heroLabel = heroC.append(webflow.elementPresets.DOM);
  heroLabel.setTag('div');
  heroLabel.setStyles([s.label]);
  heroLabel.setAttribute('data-animate', 'fade-up');
  const heroLabelTxt = heroLabel.append(webflow.elementPresets.DOM);
  heroLabelTxt.setTag('div');
  heroLabelTxt.setTextContent(`// ${SVC.name}`);

  const heroH = heroC.append(webflow.elementPresets.DOM);
  heroH.setTag('h1');
  heroH.setStyles([s.headingXL]);
  heroH.setTextContent(SVC.name);
  heroH.setAttribute('data-animate', 'opacity-sweep');

  const heroSub = heroC.append(webflow.elementPresets.DOM);
  heroSub.setTag('p');
  heroSub.setStyles([svHeroSub]);
  heroSub.setTextContent(SVC.subtitle);
  heroSub.setAttribute('data-animate', 'fade-up');

  await safeCall('append:hero', () => body.append(hero));

  // SECTION 2: OVERVIEW (warm, 2-col: image + text)
  log('Building Section 2: Overview...');
  const overSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  overSection.setTag('section');
  overSection.setStyles([s.section, s.sectionWarm]);
  overSection.setAttribute('id', 'svsub-overview');

  const overGrid = overSection.append(webflow.elementPresets.DOM);
  overGrid.setTag('div');
  overGrid.setStyles([s.grid2]);

  const overImg = overGrid.append(webflow.elementPresets.DOM);
  overImg.setTag('div');
  overImg.setStyles([svImgPlaceholder]);
  overImg.setAttribute('data-animate', 'parallax-depth');

  const overText = overGrid.append(webflow.elementPresets.DOM);
  overText.setTag('div');

  const overLabel = overText.append(webflow.elementPresets.DOM);
  overLabel.setTag('div');
  overLabel.setStyles([s.label, svMb32]);
  overLabel.setAttribute('data-animate', 'fade-up');
  const overLabelTxt = overLabel.append(webflow.elementPresets.DOM);
  overLabelTxt.setTag('div');
  overLabelTxt.setTextContent('Overview');

  const overH = overText.append(webflow.elementPresets.DOM);
  overH.setTag('h2');
  overH.setStyles([s.headingXL, svMb32]);
  overH.setTextContent(SVC.name);
  overH.setAttribute('data-animate', 'blur-focus');

  const overP = overText.append(webflow.elementPresets.DOM);
  overP.setTag('p');
  overP.setStyles([s.body, s.bodyMuted]);
  overP.setTextContent(SVC.desc);
  overP.setAttribute('data-animate', 'fade-up');

  await safeCall('append:overview', () => body.append(overSection));

  // SECTION 3: PROCESS (cream, 3-step)
  log('Building Section 3: Process...');
  const procSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  procSection.setTag('section');
  procSection.setStyles([s.section, s.sectionCream]);
  procSection.setAttribute('id', 'svsub-process');

  const procHeader = procSection.append(webflow.elementPresets.DOM);
  procHeader.setTag('div');
  procHeader.setStyles([svMb64]);

  const procLabel = procHeader.append(webflow.elementPresets.DOM);
  procLabel.setTag('div');
  procLabel.setStyles([s.label, svMb32]);
  procLabel.setAttribute('data-animate', 'fade-up');
  const procLabelTxt = procLabel.append(webflow.elementPresets.DOM);
  procLabelTxt.setTag('div');
  procLabelTxt.setTextContent('Our Process');
  const procLabelLine = procLabel.append(webflow.elementPresets.DOM);
  procLabelLine.setTag('div');
  procLabelLine.setStyles([svLabelLine]);

  const stepGrid = procSection.append(webflow.elementPresets.DOM);
  stepGrid.setTag('div');
  stepGrid.setStyles([svStepGrid]);
  stepGrid.setAttribute('data-animate', 'fade-up-stagger');

  PROCESS.forEach(step => {
    const el = stepGrid.append(webflow.elementPresets.DOM);
    el.setTag('div');
    el.setStyles([svStep]);
    el.setAttribute('data-animate', 'fade-up');

    const num = el.append(webflow.elementPresets.DOM);
    num.setTag('div');
    num.setStyles([svStepNum]);
    num.setTextContent(step.number);

    const title = el.append(webflow.elementPresets.DOM);
    title.setTag('h3');
    title.setStyles([svStepTitle]);
    title.setTextContent(step.title);

    const desc = el.append(webflow.elementPresets.DOM);
    desc.setTag('p');
    desc.setStyles([svStepDesc]);
    desc.setTextContent(step.desc);
  });

  await safeCall('append:process', () => body.append(procSection));

  // SECTION 4: COST & TIMELINE (dark, 2-col stats)
  log('Building Section 4: Cost & Timeline...');
  const costSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  costSection.setTag('section');
  costSection.setStyles([s.section, s.sectionDark]);
  costSection.setAttribute('id', 'svsub-cost');

  const statsGrid = costSection.append(webflow.elementPresets.DOM);
  statsGrid.setTag('div');
  statsGrid.setStyles([svStatsGrid]);

  const costItem = statsGrid.append(webflow.elementPresets.DOM);
  costItem.setTag('div');
  costItem.setStyles([svStatItem]);
  costItem.setAttribute('data-animate', 'fade-up');
  const costNum = costItem.append(webflow.elementPresets.DOM);
  costNum.setTag('div');
  costNum.setStyles([svStatNum]);
  costNum.setTextContent(SVC.cost);
  const costLabel = costItem.append(webflow.elementPresets.DOM);
  costLabel.setTag('div');
  costLabel.setStyles([svStatLabel]);
  costLabel.setTextContent('Cost Range');

  const timeItem = statsGrid.append(webflow.elementPresets.DOM);
  timeItem.setTag('div');
  timeItem.setStyles([svStatItem]);
  timeItem.setAttribute('data-animate', 'fade-up');
  const timeNum = timeItem.append(webflow.elementPresets.DOM);
  timeNum.setTag('div');
  timeNum.setStyles([svStatNum]);
  timeNum.setTextContent(SVC.timeline);
  const timeLabel = timeItem.append(webflow.elementPresets.DOM);
  timeLabel.setTag('div');
  timeLabel.setStyles([svStatLabel]);
  timeLabel.setTextContent('Typical Timeline');

  await safeCall('append:cost', () => body.append(costSection));

  // SECTION 5: CTA
  log('Building Section 5: CTA...');
  await buildCTASection(
    body, v,
    'Get a free estimate',
    'Get a Free Estimate', '/free-estimate',
    'Call Us', 'tel:7149003676',
  );

  await applyStyleProperties();

  log(`${SVC.name} page built!`, 'success');
  await webflow.notify({ type: 'Success', message: `${SVC.name} page created!` });
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
  try { await buildServiceSubPage(); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
