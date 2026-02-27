// ════════════════════════════════════════════════════════════════
// Avorino Builder — ADU PAGE (v3 animated)
// Full-viewport hero + scroll-locked ADU types + SVG timeline process
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
const PAGE_TITLE = 'Custom ADU Builder in Orange County | Avorino';
const PAGE_DESC = 'Build a custom accessory dwelling unit in Orange County. Detached, attached, garage conversion, and above-garage ADUs. Design, permits, and construction by Avorino.';
const CDN = '51ce355';
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
  `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-adu-footer.js"><\/script>`,
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
  logDetail('Starting ADU page build (v3 animated)...', 'info');
  const v = await getAvorinVars();
  logDetail('Loaded Avorino variable collection', 'ok');

  log('Creating shared styles...');
  const s = await createSharedStyles();

  // ── Page-specific styles ──
  log('Creating ADU-specific styles...');
  // Hero (full-viewport + Three.js canvas)
  const aduHero = await getOrCreateStyle('adu-hero');
  const aduHeroCanvas = await getOrCreateStyle('adu-hero-canvas-wrap');
  const aduHeroContent = await getOrCreateStyle('adu-hero-content');
  const aduHeroGoldLine = await getOrCreateStyle('adu-hero-gold-line');
  const aduHeroScrollHint = await getOrCreateStyle('adu-hero-scroll-hint');
  // Types (scroll-locked cards + Three.js canvas)
  const aduTypes = await getOrCreateStyle('adu-types');
  const aduTypesCanvas = await getOrCreateStyle('adu-types-canvas-wrap');
  const aduTypesContent = await getOrCreateStyle('adu-types-content');
  const aduTypesPinned = await getOrCreateStyle('adu-types-pinned');
  const aduTypesHeader = await getOrCreateStyle('adu-types-header');
  const aduTypesInfo = await getOrCreateStyle('adu-types-info');
  const aduTypeCard = await getOrCreateStyle('adu-type-card');
  const aduTypeCardNum = await getOrCreateStyle('adu-type-card-num');
  const aduTypeCardTitle = await getOrCreateStyle('adu-type-card-title');
  const aduTypeCardDesc = await getOrCreateStyle('adu-type-card-desc');
  const aduTypesProgress = await getOrCreateStyle('adu-types-progress');
  // Process (SVG timeline)
  const aduTlContainer = await getOrCreateStyle('adu-timeline');
  const aduTlStep = await getOrCreateStyle('adu-tl-step');
  const aduTlNode = await getOrCreateStyle('adu-tl-node');
  const aduTlNumber = await getOrCreateStyle('adu-tl-number');
  const aduTlTitle = await getOrCreateStyle('adu-tl-title');
  const aduTlTime = await getOrCreateStyle('adu-tl-time');
  const aduTlDesc = await getOrCreateStyle('adu-tl-desc');

  // ── Create page ──
  const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);

  // ── Style properties ──
  async function applyStyleProperties() {
    log('Setting shared style properties...');
    await setSharedStyleProps(s, v);
    await wait(1000);

    log('Setting ADU-specific style properties...');

    // Hero: full-viewport cinematic
    await clearAndSet(await freshStyle('adu-hero'), 'adu-hero', {
      'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
      'min-height': '85vh',
      'display': 'flex', 'align-items': 'flex-end',
      'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'background-color': v['av-dark'], 'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('adu-hero-canvas-wrap'), 'adu-hero-canvas-wrap', {
      'position': 'absolute', 'top': '0px', 'left': '0px',
      'width': '100%', 'height': '100%',
      'z-index': '1', 'pointer-events': 'none',
      'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('adu-hero-content'), 'adu-hero-content', {
      'position': 'relative', 'z-index': '2', 'max-width': '800px',
    });
    await clearAndSet(await freshStyle('adu-hero-gold-line'), 'adu-hero-gold-line', {
      'width': '0px', 'height': '1px',
      'background-color': v['av-gold'], 'margin-bottom': '24px',
    });
    await clearAndSet(await freshStyle('adu-hero-scroll-hint'), 'adu-hero-scroll-hint', {
      'position': 'absolute', 'bottom': '40px', 'left': '50%',
      'z-index': '3', 'display': 'flex', 'flex-direction': 'column',
      'align-items': 'center', 'gap': '8px', 'opacity': '0',
    });
    await wait(500);

    // Types: scroll-locked cards
    await clearAndSet(await freshStyle('adu-types'), 'adu-types', {
      'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
      'background-color': '#ffffff',
    });
    await clearAndSet(await freshStyle('adu-types-canvas-wrap'), 'adu-types-canvas-wrap', {
      'position': 'absolute', 'top': '0px', 'left': '0px',
      'width': '100%', 'height': '100%',
      'z-index': '1', 'pointer-events': 'none',
      'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('adu-types-content'), 'adu-types-content', {
      'position': 'relative', 'z-index': '2',
    });
    await clearAndSet(await freshStyle('adu-types-pinned'), 'adu-types-pinned', {
      'height': '100vh', 'display': 'flex', 'align-items': 'center',
      'position': 'relative',
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
    });
    await clearAndSet(await freshStyle('adu-types-header'), 'adu-types-header', {
      'position': 'absolute', 'top': '48px',
      'left': v['av-section-pad-x'], 'right': v['av-section-pad-x'],
    });
    await clearAndSet(await freshStyle('adu-types-info'), 'adu-types-info', {
      'margin-left': 'auto', 'position': 'relative',
      'width': '480px', 'max-width': '100%', 'min-height': '300px',
    });
    await clearAndSet(await freshStyle('adu-type-card'), 'adu-type-card', {
      'background-color': '#ffffff', 'color': v['av-dark'],
      'border-radius': v['av-radius'],
      'padding-top': '56px', 'padding-bottom': '56px',
      'padding-left': '48px', 'padding-right': '48px',
      'border-top-width': '2px', 'border-top-style': 'solid',
      'border-top-color': 'rgba(201,169,110,0.3)',
      'position': 'absolute', 'top': '50%',
      'width': '100%', 'opacity': '0',
    });
    await clearAndSet(await freshStyle('adu-type-card-num'), 'adu-type-card-num', {
      'font-family': 'DM Sans', 'font-size': v['av-text-xs'],
      'letter-spacing': '0.2em', 'text-transform': 'uppercase',
      'margin-bottom': '16px', 'color': v['av-gold'],
    });
    await clearAndSet(await freshStyle('adu-type-card-title'), 'adu-type-card-title', {
      'font-family': 'DM Serif Display', 'font-size': '28px',
      'line-height': '1.2', 'font-weight': '400',
      'margin-bottom': '14px', 'color': v['av-dark'],
    });
    await clearAndSet(await freshStyle('adu-type-card-desc'), 'adu-type-card-desc', {
      'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
      'line-height': '1.7', 'opacity': '0.55', 'color': v['av-dark'],
    });
    await clearAndSet(await freshStyle('adu-types-progress'), 'adu-types-progress', {
      'position': 'absolute', 'bottom': '40px', 'left': '50%',
      'z-index': '3', 'display': 'flex', 'align-items': 'center', 'gap': '32px',
    });
    await wait(500);

    // Process: SVG timeline
    await clearAndSet(await freshStyle('adu-timeline'), 'adu-timeline', {
      'position': 'relative', 'max-width': '700px',
      'margin-left': 'auto', 'margin-right': 'auto',
      'padding-left': '60px',
    });
    await clearAndSet(await freshStyle('adu-tl-step'), 'adu-tl-step', {
      'position': 'relative', 'padding-bottom': '80px',
    });
    await clearAndSet(await freshStyle('adu-tl-node'), 'adu-tl-node', {
      'position': 'absolute', 'left': '-50px', 'top': '8px',
      'width': '18px', 'height': '18px', 'border-radius': '50%',
      'border-width': '2px', 'border-style': 'solid',
      'border-color': 'rgba(17,17,17,0.15)',
      'background-color': v['av-warm'],
    });
    await clearAndSet(await freshStyle('adu-tl-number'), 'adu-tl-number', {
      'font-family': 'DM Serif Display', 'font-size': '80px',
      'line-height': '1', 'opacity': '0.15',
      'display': 'block', 'margin-bottom': '-16px',
    });
    await clearAndSet(await freshStyle('adu-tl-title'), 'adu-tl-title', {
      'font-family': 'DM Serif Display', 'font-size': '32px',
      'line-height': '1.2', 'margin-bottom': '8px',
    });
    await clearAndSet(await freshStyle('adu-tl-time'), 'adu-tl-time', {
      'font-size': '14px', 'color': v['av-red'],
      'display': 'block', 'margin-bottom': '12px', 'opacity': '0',
    });
    await clearAndSet(await freshStyle('adu-tl-desc'), 'adu-tl-desc', {
      'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
      'line-height': '1.7', 'opacity': '0', 'max-width': '480px',
    });
    await wait(500);

    await applyCTAStyleProps(v);
  }

  // ═══════════════ BUILD ELEMENTS ═══════════════

  // SECTION 1: HERO — Full-viewport cinematic (Three.js canvas backdrop)
  log('Building Section 1: Hero...');
  const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
  hero.setTag('section');
  hero.setStyles([aduHero]);
  hero.setAttribute('id', 'adu-hero');

  // Canvas wrap (Three.js renders here)
  const heroCanvasWrap = hero.append(webflow.elementPresets.DOM);
  heroCanvasWrap.setTag('div');
  heroCanvasWrap.setStyles([aduHeroCanvas]);
  heroCanvasWrap.setAttribute('id', 'hero-canvas');

  // Content over canvas
  const heroC = hero.append(webflow.elementPresets.DOM);
  heroC.setTag('div');
  heroC.setStyles([aduHeroContent]);

  const heroLabel = heroC.append(webflow.elementPresets.DOM);
  heroLabel.setTag('div');
  heroLabel.setTextContent('// Avorino ADU');
  heroLabel.setAttribute('data-animate', 'fade-up');

  const heroH = heroC.append(webflow.elementPresets.DOM);
  heroH.setTag('h1');
  heroH.setStyles([s.headingXL]);
  heroH.setTextContent('Accessory Dwelling Units');
  heroH.setAttribute('data-animate', 'char-cascade');

  const heroGoldLine = heroC.append(webflow.elementPresets.DOM);
  heroGoldLine.setTag('div');
  heroGoldLine.setStyles([aduHeroGoldLine]);

  const heroSub = heroC.append(webflow.elementPresets.DOM);
  heroSub.setTag('p');
  heroSub.setTextContent('Custom-designed ADUs for Orange County homeowners. Maximize your property value with a premium backyard home.');
  heroSub.setAttribute('data-animate', 'fade-up');

  // Scroll hint at bottom
  const heroScrollHint = hero.append(webflow.elementPresets.DOM);
  heroScrollHint.setTag('div');
  heroScrollHint.setStyles([aduHeroScrollHint]);
  heroScrollHint.setAttribute('data-animate', 'fade-up');

  const scrollText = heroScrollHint.append(webflow.elementPresets.DOM);
  scrollText.setTag('span');
  scrollText.setTextContent('Scroll');

  const scrollLine = heroScrollHint.append(webflow.elementPresets.DOM);
  scrollLine.setTag('div');

  await safeCall('append:hero', () => body.append(hero));
  logDetail('Section 1: Hero appended', 'ok');

  // SECTION 2: ADU TYPES — scroll-locked cards + Three.js backdrop (white bg)
  log('Building Section 2: ADU Types...');
  const typesSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  typesSection.setTag('section');
  typesSection.setStyles([aduTypes]);
  typesSection.setAttribute('id', 'adu-types');

  // Canvas wrap (Three.js renders here)
  const typesCanvasWrap = typesSection.append(webflow.elementPresets.DOM);
  typesCanvasWrap.setTag('div');
  typesCanvasWrap.setStyles([aduTypesCanvas]);
  typesCanvasWrap.setAttribute('id', 'types-canvas');

  // Content (over canvas)
  const typesContent = typesSection.append(webflow.elementPresets.DOM);
  typesContent.setTag('div');
  typesContent.setStyles([aduTypesContent]);

  // Pinned container
  const typesPinned = typesContent.append(webflow.elementPresets.DOM);
  typesPinned.setTag('div');
  typesPinned.setStyles([aduTypesPinned]);
  typesPinned.setAttribute('data-types-pinned', '');

  // Header (absolute positioned at top)
  const typesHeaderDiv = typesPinned.append(webflow.elementPresets.DOM);
  typesHeaderDiv.setTag('div');
  typesHeaderDiv.setStyles([aduTypesHeader]);

  const typesLabel = typesHeaderDiv.append(webflow.elementPresets.DOM);
  typesLabel.setTag('div');
  typesLabel.setStyles([s.label]);
  const typesLabelTxt = typesLabel.append(webflow.elementPresets.DOM);
  typesLabelTxt.setTag('div');
  typesLabelTxt.setTextContent('ADU Types');

  // Info container (holds stacked cards, pushed right)
  const typesInfo = typesPinned.append(webflow.elementPresets.DOM);
  typesInfo.setTag('div');
  typesInfo.setStyles([aduTypesInfo]);

  // 4 stacked cards
  ADU_TYPES.forEach((type, i) => {
    const card = typesInfo.append(webflow.elementPresets.DOM);
    card.setTag('div');
    card.setStyles([aduTypeCard]);
    card.setAttribute('data-step', String(i));

    const cardNum = card.append(webflow.elementPresets.DOM);
    cardNum.setTag('div');
    cardNum.setStyles([aduTypeCardNum]);
    cardNum.setTextContent(`${type.number} / 04`);

    const cardTitle = card.append(webflow.elementPresets.DOM);
    cardTitle.setTag('h3');
    cardTitle.setStyles([aduTypeCardTitle]);
    cardTitle.setTextContent(type.title);

    const cardDesc = card.append(webflow.elementPresets.DOM);
    cardDesc.setTag('p');
    cardDesc.setStyles([aduTypeCardDesc]);
    cardDesc.setTextContent(type.desc);
  });

  // Progress bar at bottom
  const typesProgressDiv = typesPinned.append(webflow.elementPresets.DOM);
  typesProgressDiv.setTag('div');
  typesProgressDiv.setStyles([aduTypesProgress]);

  // Track + fill
  const typesTrack = typesProgressDiv.append(webflow.elementPresets.DOM);
  typesTrack.setTag('div');
  const typesFill = typesTrack.append(webflow.elementPresets.DOM);
  typesFill.setTag('div');

  // Dots container
  const typesDots = typesProgressDiv.append(webflow.elementPresets.DOM);
  typesDots.setTag('div');

  ['01', '02', '03', '04'].forEach((num, i) => {
    const dot = typesDots.append(webflow.elementPresets.DOM);
    dot.setTag('span');
    dot.setTextContent(num);
  });

  await safeCall('append:types', () => body.append(typesSection));
  logDetail('Section 2: ADU Types appended', 'ok');

  // SECTION 3: PROCESS — vertical SVG timeline (warm bg)
  log('Building Section 3: Process...');
  const processSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  processSection.setTag('section');
  processSection.setStyles([s.section, s.sectionWarm]);
  processSection.setAttribute('id', 'adu-process');

  // Centered header
  const procHeader = processSection.append(webflow.elementPresets.DOM);
  procHeader.setTag('div');

  const procLabel = procHeader.append(webflow.elementPresets.DOM);
  procLabel.setTag('div');
  procLabel.setStyles([s.label]);
  procLabel.setAttribute('data-animate', 'fade-up');
  const procLabelTxt = procLabel.append(webflow.elementPresets.DOM);
  procLabelTxt.setTag('div');
  procLabelTxt.setTextContent('Our Process');

  const procH = procHeader.append(webflow.elementPresets.DOM);
  procH.setTag('h2');
  procH.setStyles([s.headingLG]);
  procH.setTextContent('How We Build Your ADU');
  procH.setAttribute('data-animate', 'line-wipe');

  // Timeline container
  const tlContainer = processSection.append(webflow.elementPresets.DOM);
  tlContainer.setTag('div');
  tlContainer.setStyles([aduTlContainer]);
  tlContainer.setAttribute('id', 'adu-timeline');

  // SVG element with track + draw lines
  const tlSvg = tlContainer.append(webflow.elementPresets.DOM);
  tlSvg.setTag('svg');
  tlSvg.setAttribute('preserveAspectRatio', 'none');

  const tlTrackLine = tlSvg.append(webflow.elementPresets.DOM);
  tlTrackLine.setTag('line');
  tlTrackLine.setAttribute('x1', '1');
  tlTrackLine.setAttribute('y1', '0');
  tlTrackLine.setAttribute('x2', '1');
  tlTrackLine.setAttribute('y2', '100%');

  const tlDrawLine = tlSvg.append(webflow.elementPresets.DOM);
  tlDrawLine.setTag('line');
  tlDrawLine.setAttribute('x1', '1');
  tlDrawLine.setAttribute('y1', '0');
  tlDrawLine.setAttribute('x2', '1');
  tlDrawLine.setAttribute('y2', '100%');

  // 3 timeline steps
  PROCESS_STEPS.forEach((step, i) => {
    const stepDiv = tlContainer.append(webflow.elementPresets.DOM);
    stepDiv.setTag('div');
    stepDiv.setStyles([aduTlStep]);
    stepDiv.setAttribute('data-step', String(i));

    // Node circle on the line
    const node = stepDiv.append(webflow.elementPresets.DOM);
    node.setTag('div');
    node.setStyles([aduTlNode]);

    // Content wrapper
    const contentDiv = stepDiv.append(webflow.elementPresets.DOM);
    contentDiv.setTag('div');

    // Large step number
    const num = contentDiv.append(webflow.elementPresets.DOM);
    num.setTag('span');
    num.setStyles([aduTlNumber]);
    num.setTextContent(step.number);

    // Title with word spans for split-text animation
    const title = contentDiv.append(webflow.elementPresets.DOM);
    title.setTag('h3');
    title.setStyles([aduTlTitle]);
    // Wrap each word in a .word span
    const words = step.title.split(/\s+/);
    words.forEach(word => {
      const wordSpan = title.append(webflow.elementPresets.DOM);
      wordSpan.setTag('span');
      wordSpan.setTextContent(word);
    });

    // Time
    const time = contentDiv.append(webflow.elementPresets.DOM);
    time.setTag('span');
    time.setStyles([aduTlTime]);
    time.setTextContent(step.time);

    // Description
    const desc = contentDiv.append(webflow.elementPresets.DOM);
    desc.setTag('p');
    desc.setStyles([aduTlDesc]);
    desc.setTextContent(step.desc);
  });

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
