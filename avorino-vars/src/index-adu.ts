// ════════════════════════════════════════════════════════════════
// Avorino Builder — ADU PAGE (v2 redesign)
// Split hero + alternating image/text rows + stacked process
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog, wait,
  safeCall, getAvorinVars, getOrCreateStyle, freshStyle,
  clearAndSet, createSharedStyles, setSharedStyleProps,
  createAllVariables, createPageWithSlug,
  buildCTASection, applyCTAStyleProps,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

// ── Page config ──
const PAGE_NAME = 'ADU';
const PAGE_SLUG = 'adu';
const PAGE_TITLE = 'ADU Construction in Orange County — Avorino';
const PAGE_DESC = 'Detached, attached, and garage conversion ADUs in Orange County. Fully permitted, designed, and built by Avorino.';
const HEAD_CODE = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@403b53d/avorino-responsive.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@403b53d/avorino-nav-footer.css">',
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@403b53d/avorino-animations.js"><\/script>',
  CALENDLY_JS,
].join('\n');

// ── Update panel UI ──
document.getElementById('page-name')!.textContent = PAGE_NAME;
const headCodeEl = document.getElementById('head-code');
const footerCodeEl = document.getElementById('footer-code');
if (headCodeEl) headCodeEl.textContent = HEAD_CODE;
if (footerCodeEl) footerCodeEl.textContent = FOOTER_CODE;

// ── Content data ──
const ADU_TYPES = [
  { number: '01', title: 'Detached ADU', desc: 'Standalone unit in your backyard — maximum privacy and design flexibility. Popular for rental income or multigenerational living.' },
  { number: '02', title: 'Attached ADU', desc: 'Extension connected to your home with its own private entrance. Shares a wall for cost savings while maintaining complete independence.' },
  { number: '03', title: 'Garage Conversion', desc: 'Convert your existing garage into a fully permitted living space. The most affordable option — starting at $75K with the fastest turnaround.' },
  { number: '04', title: 'Above-Garage ADU', desc: 'Second story above your garage. Keeps parking, adds living space, and maximizes your lot without sacrificing yard area.' },
];

const PROCESS_STEPS = [
  { number: '01', title: 'Design', time: '4–6 months', desc: 'Custom architectural plans, structural engineering, and Title 24 energy calculations — all included.' },
  { number: '02', title: 'Permits', time: 'Included in design', desc: 'We submit to your city and manage all plan-check corrections and approvals.' },
  { number: '03', title: 'Build', time: '6–8 months', desc: 'Licensed crew, weekly progress updates, and on-budget delivery from foundation to final inspection.' },
];

// ── Build function ──
async function buildADUPage() {
  clearErrorLog();
  logDetail('Starting ADU page build (v2)...', 'info');
  const v = await getAvorinVars();
  logDetail('Loaded Avorino variable collection', 'ok');

  log('Creating shared styles...');
  const s = await createSharedStyles();

  // ── Page-specific styles ──
  log('Creating ADU-specific styles...');
  // Hero
  const aduHero = await getOrCreateStyle('adu-hero');
  const aduHeroContent = await getOrCreateStyle('adu-hero-content');
  // Types rows
  const aduTypeRow = await getOrCreateStyle('adu-type-row');
  const aduTypeText = await getOrCreateStyle('adu-type-text');
  const aduTypeNum = await getOrCreateStyle('adu-type-num');
  const aduTypeTitle = await getOrCreateStyle('adu-type-title');
  const aduTypeDesc = await getOrCreateStyle('adu-type-desc');
  const aduCostNote = await getOrCreateStyle('adu-cost-note');
  // Process
  const aduStepRow = await getOrCreateStyle('adu-step-row');
  const aduStepNumCol = await getOrCreateStyle('adu-step-num-col');
  const aduStepNum = await getOrCreateStyle('adu-step-num');
  const aduStepContent = await getOrCreateStyle('adu-step-content');
  const aduStepTitle = await getOrCreateStyle('adu-step-title');
  const aduStepTime = await getOrCreateStyle('adu-step-time');
  const aduStepDesc = await getOrCreateStyle('adu-step-desc');
  const aduTimeline = await getOrCreateStyle('adu-timeline');

  // ── Create page ──
  const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);

  // ── Style properties ──
  async function applyStyleProperties() {
    log('Setting shared style properties...');
    await setSharedStyleProps(s, v);
    await wait(1000);

    log('Setting ADU-specific style properties...');

    // Hero: dark, split layout
    await clearAndSet(await freshStyle('adu-hero'), 'adu-hero', {
      'display': 'grid', 'grid-template-columns': '1.5fr 1fr',
      'grid-column-gap': '96px', 'grid-row-gap': '64px', 'align-items': 'center',
      'min-height': '70vh',
      'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'background-color': v['av-dark'], 'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('adu-hero-content'), 'adu-hero-content', {
      'max-width': '640px',
    });
    await wait(500);

    // Alternating type rows
    await clearAndSet(await freshStyle('adu-type-row'), 'adu-type-row', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr',
      'grid-column-gap': '96px', 'grid-row-gap': '48px', 'align-items': 'center',
    });
    await clearAndSet(await freshStyle('adu-type-text'), 'adu-type-text', {
      'display': 'flex', 'flex-direction': 'column',
    });
    await clearAndSet(await freshStyle('adu-type-num'), 'adu-type-num', {
      'font-family': 'DM Sans', 'font-size': v['av-text-label'],
      'letter-spacing': '0.3em', 'text-transform': 'uppercase',
      'opacity': '0.3', 'margin-bottom': '16px',
    });
    await clearAndSet(await freshStyle('adu-type-title'), 'adu-type-title', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
      'line-height': '1.12', 'font-weight': '400', 'margin-bottom': '16px',
    });
    await clearAndSet(await freshStyle('adu-type-desc'), 'adu-type-desc', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.9', 'opacity': '0.6',
    });
    await clearAndSet(await freshStyle('adu-cost-note'), 'adu-cost-note', {
      'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
      'opacity': '0.4', 'text-align': 'center', 'margin-top': '24px',
    });
    await wait(500);

    // Process — stacked rows (number left, content right)
    await clearAndSet(await freshStyle('adu-step-row'), 'adu-step-row', {
      'display': 'grid', 'grid-template-columns': '80px 1fr',
      'grid-column-gap': '48px', 'align-items': 'start',
    });
    await clearAndSet(await freshStyle('adu-step-num-col'), 'adu-step-num-col', {
      'padding-top': '4px',
    });
    await clearAndSet(await freshStyle('adu-step-num'), 'adu-step-num', {
      'font-family': 'DM Serif Display',
      'font-size': 'clamp(36px, 4vw, 56px)',
      'line-height': '1', 'font-weight': '400', 'opacity': '0.15',
    });
    await clearAndSet(await freshStyle('adu-step-content'), 'adu-step-content', {
      'display': 'flex', 'flex-direction': 'column',
    });
    await clearAndSet(await freshStyle('adu-step-title'), 'adu-step-title', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
      'line-height': '1.12', 'font-weight': '400', 'margin-bottom': '8px',
    });
    await clearAndSet(await freshStyle('adu-step-time'), 'adu-step-time', {
      'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
      'opacity': '0.4', 'margin-bottom': '16px',
    });
    await clearAndSet(await freshStyle('adu-step-desc'), 'adu-step-desc', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.9', 'opacity': '0.6',
    });
    await clearAndSet(await freshStyle('adu-timeline'), 'adu-timeline', {
      'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
      'opacity': '0.4', 'text-align': 'center', 'margin-top': '24px',
    });
    await wait(500);

    await applyCTAStyleProps(v);
  }

  // ═══════════════ BUILD ELEMENTS ═══════════════

  // SECTION 1: SPLIT HERO (dark, text left + image right)
  log('Building Section 1: Split Hero...');
  const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
  hero.setTag('section');
  hero.setStyles([aduHero]);
  hero.setAttribute('id', 'adu-hero');

  // Left: text content
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
  heroH.setTextContent('A second home on your property');
  heroH.setAttribute('data-animate', 'word-stagger-elastic');

  const heroSub = heroC.append(webflow.elementPresets.DOM);
  heroSub.setTag('p');
  heroSub.setStyles([s.body, s.bodyMuted]);
  heroSub.setTextContent('An accessory dwelling unit is an independent residential unit on the same lot as your home. Detached, attached, or converted — Avorino designs, permits, and builds it all.');
  heroSub.setAttribute('data-animate', 'fade-up');

  // Right: tall image placeholder
  const heroImg = hero.append(webflow.elementPresets.DOM);
  heroImg.setTag('div');
  heroImg.setStyles([s.imgTall]);
  heroImg.setAttribute('data-animate', 'parallax-depth');

  await safeCall('append:hero', () => body.append(hero));
  logDetail('Section 1: Split Hero appended', 'ok');

  // SECTION 2: ADU TYPES — alternating image+text rows (cream bg)
  log('Building Section 2: ADU Types...');
  const typesSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  typesSection.setTag('section');
  typesSection.setStyles([s.section, s.sectionCream]);
  typesSection.setAttribute('id', 'adu-types');

  // Section heading
  const typesH = typesSection.append(webflow.elementPresets.DOM);
  typesH.setTag('h2');
  typesH.setStyles([s.headingLG]);
  typesH.setTextContent('Four ways to build');
  typesH.setAttribute('data-animate', 'blur-focus');

  // Alternating rows
  ADU_TYPES.forEach((type, i) => {
    // Divider between rows
    if (i > 0) {
      const div = typesSection.append(webflow.elementPresets.DOM);
      div.setTag('div');
      div.setStyles([s.divider]);
    }

    const row = typesSection.append(webflow.elementPresets.DOM);
    row.setTag('div');
    row.setStyles([aduTypeRow]);
    row.setAttribute('data-animate', 'fade-up');

    // Even rows: image left, text right. Odd rows: text left, image right.
    if (i % 2 === 0) {
      // Image first
      const img = row.append(webflow.elementPresets.DOM);
      img.setTag('div');
      img.setStyles([s.imgLandscape]);

      // Text second
      const text = row.append(webflow.elementPresets.DOM);
      text.setTag('div');
      text.setStyles([aduTypeText]);
      _buildTypeText(text, type);
    } else {
      // Text first
      const text = row.append(webflow.elementPresets.DOM);
      text.setTag('div');
      text.setStyles([aduTypeText]);
      _buildTypeText(text, type);

      // Image second
      const img = row.append(webflow.elementPresets.DOM);
      img.setTag('div');
      img.setStyles([s.imgLandscape]);
    }
  });

  // Inline cost note
  const costNote = typesSection.append(webflow.elementPresets.DOM);
  costNote.setTag('p');
  costNote.setStyles([aduCostNote]);
  costNote.setTextContent('Starting at $75K for conversions, $250K+ for new builds');
  costNote.setAttribute('data-animate', 'fade-up');

  await safeCall('append:types', () => body.append(typesSection));
  logDetail('Section 2: ADU Types appended', 'ok');

  function _buildTypeText(parent: any, type: typeof ADU_TYPES[0]) {
    const num = parent.append(webflow.elementPresets.DOM);
    num.setTag('div');
    num.setStyles([aduTypeNum]);
    num.setTextContent(type.number);

    const title = parent.append(webflow.elementPresets.DOM);
    title.setTag('h3');
    title.setStyles([aduTypeTitle]);
    title.setTextContent(type.title);

    const desc = parent.append(webflow.elementPresets.DOM);
    desc.setTag('p');
    desc.setStyles([aduTypeDesc]);
    desc.setTextContent(type.desc);
  }

  // SECTION 3: PROCESS — stacked rows (warm bg)
  log('Building Section 3: Process...');
  const processSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  processSection.setTag('section');
  processSection.setStyles([s.section, s.sectionWarm]);
  processSection.setAttribute('id', 'adu-process');

  const procH = processSection.append(webflow.elementPresets.DOM);
  procH.setTag('h2');
  procH.setStyles([s.headingLG]);
  procH.setTextContent('Three steps to your ADU');
  procH.setAttribute('data-animate', 'blur-focus');

  PROCESS_STEPS.forEach((step, i) => {
    // Divider between steps
    if (i > 0) {
      const div = processSection.append(webflow.elementPresets.DOM);
      div.setTag('div');
      div.setStyles([s.divider]);
    }

    const row = processSection.append(webflow.elementPresets.DOM);
    row.setTag('div');
    row.setStyles([aduStepRow]);
    row.setAttribute('data-animate', 'fade-up');

    // Left: large step number
    const numCol = row.append(webflow.elementPresets.DOM);
    numCol.setTag('div');
    numCol.setStyles([aduStepNumCol]);
    const num = numCol.append(webflow.elementPresets.DOM);
    num.setTag('div');
    num.setStyles([aduStepNum]);
    num.setTextContent(step.number);

    // Right: title + time + description
    const content = row.append(webflow.elementPresets.DOM);
    content.setTag('div');
    content.setStyles([aduStepContent]);

    const title = content.append(webflow.elementPresets.DOM);
    title.setTag('h3');
    title.setStyles([aduStepTitle]);
    title.setTextContent(step.title);

    const time = content.append(webflow.elementPresets.DOM);
    time.setTag('div');
    time.setStyles([aduStepTime]);
    time.setTextContent(step.time);

    const desc = content.append(webflow.elementPresets.DOM);
    desc.setTag('p');
    desc.setStyles([aduStepDesc]);
    desc.setTextContent(step.desc);
  });

  // Inline timeline note
  const timeline = processSection.append(webflow.elementPresets.DOM);
  timeline.setTag('p');
  timeline.setStyles([aduTimeline]);
  timeline.setTextContent('Total timeline: 10–14 months from design to move-in');
  timeline.setAttribute('data-animate', 'fade-up');

  await safeCall('append:process', () => body.append(processSection));
  logDetail('Section 3: Process appended', 'ok');

  // SECTION 4: CTA
  log('Building Section 4: CTA...');
  await buildCTASection(
    body, v,
    'Get your ADU estimate',
    'ADU Cost Calculator', '/adu-cost-estimator',
    'Schedule a Meeting', '/schedule-a-meeting',
  );

  // ═══════════════ APPLY STYLES ═══════════════
  await applyStyleProperties();

  log('ADU page built!', 'success');
  await webflow.notify({ type: 'Success', message: 'ADU page created!' });
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
