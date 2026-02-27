// ════════════════════════════════════════════════════════════════
// Avorino Builder — ADU CONSTRUCTION PAGE
// Full-viewport hero + scroll-locked types + ROI stats + horizontal timeline + CTA
// Three.js canvas backdrops, char-cascade, scramble values, progress bar
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog, wait,
  safeCall, getAvorinVars, getOrCreateStyle, freshStyle,
  clearAndSet, createSharedStyles, setSharedStyleProps,
  createAllVariables, createPageWithSlug,
  buildCTASection, applyCTAStyleProps,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

const PAGE_NAME = 'ADU Construction';
const PAGE_SLUG = 'adu-construction';
const PAGE_TITLE = 'ADU Construction in Orange County — Avorino';
const PAGE_DESC = 'Detached, attached, and garage conversion ADUs in Orange County. Fully permitted, designed, and built by Avorino.';
const CDN = '6f6b42d';
const HEAD_CODE = [
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-responsive.css">`,
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-adu.css">`,
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>',
  `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-animations.js"><\/script>`,
  `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-adu-construction-footer.js"><\/script>`,
  CALENDLY_JS,
].join('\n');

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

// ── Panel UI ──
document.getElementById('page-name')!.textContent = PAGE_NAME;
const headCodeEl = document.getElementById('head-code');
const footerCodeEl = document.getElementById('footer-code');
if (headCodeEl) headCodeEl.textContent = HEAD_CODE;
if (footerCodeEl) footerCodeEl.textContent = FOOTER_CODE;

async function buildADUConstructionPage() {
  clearErrorLog();
  logDetail('Starting ADU Construction page build...', 'info');
  const v = await getAvorinVars();

  log('Creating shared styles...');
  const s = await createSharedStyles();

  log('Creating page-specific styles...');
  // Hero
  const aducHero = await getOrCreateStyle('aduc-hero');
  const aducHeroCanvasWrap = await getOrCreateStyle('aduc-hero-canvas-wrap');
  const aducHeroContent = await getOrCreateStyle('aduc-hero-content');
  const aducHeroLabel = await getOrCreateStyle('aduc-hero-label');
  const aducHeroGoldLine = await getOrCreateStyle('aduc-hero-gold-line');
  const aducHeroSubtitle = await getOrCreateStyle('aduc-hero-subtitle');
  const aducHeroScrollHint = await getOrCreateStyle('aduc-hero-scroll-hint');
  const aducHeroScrollLine = await getOrCreateStyle('aduc-hero-scroll-line');
  // Types (scroll-lock)
  const aducTypes = await getOrCreateStyle('aduc-types');
  const aducTypesCanvasWrap = await getOrCreateStyle('aduc-types-canvas-wrap');
  const aducTypesContent = await getOrCreateStyle('aduc-types-content');
  const aducTypesPinned = await getOrCreateStyle('aduc-types-pinned');
  const aducTypesHeader = await getOrCreateStyle('aduc-types-header');
  const aducTypesInfo = await getOrCreateStyle('aduc-types-info');
  const aducTypeCard = await getOrCreateStyle('aduc-type-card');
  const aducTypeCardNum = await getOrCreateStyle('aduc-type-card-num');
  const aducTypeCardTitle = await getOrCreateStyle('aduc-type-card-title');
  const aducTypeCardDesc = await getOrCreateStyle('aduc-type-card-desc');
  const aducTypesProgress = await getOrCreateStyle('aduc-types-progress');
  const aducTypesTrack = await getOrCreateStyle('aduc-types-track');
  const aducTypesFill = await getOrCreateStyle('aduc-types-fill');
  const aducTypesDots = await getOrCreateStyle('aduc-types-dots');
  const aducTdot = await getOrCreateStyle('aduc-tdot');
  // ROI
  const aducRoi = await getOrCreateStyle('aduc-roi');
  const aducRoiHeader = await getOrCreateStyle('aduc-roi-header');
  const aducRoiGrid = await getOrCreateStyle('aduc-roi-grid');
  const aducRoiCard = await getOrCreateStyle('aduc-roi-card');
  const aducRoiValue = await getOrCreateStyle('aduc-roi-value');
  const aducRoiLabel = await getOrCreateStyle('aduc-roi-label');
  // Process (horizontal timeline)
  const aducProcess = await getOrCreateStyle('aduc-process');
  const aducProcessHeader = await getOrCreateStyle('aduc-process-header');
  const aducHtlWrap = await getOrCreateStyle('aduc-htl-wrap');
  const aducHtlTrackWrap = await getOrCreateStyle('aduc-htl-track-wrap');
  const aducHtlTrackBg = await getOrCreateStyle('aduc-htl-track-bg');
  const aducHtlTrackFill = await getOrCreateStyle('aduc-htl-track-fill');
  const aducHtlSteps = await getOrCreateStyle('aduc-htl-steps');
  const aducHtlStep = await getOrCreateStyle('aduc-htl-step');
  const aducHtlNode = await getOrCreateStyle('aduc-htl-node');
  const aducHtlNumber = await getOrCreateStyle('aduc-htl-number');
  const aducHtlTitle = await getOrCreateStyle('aduc-htl-title');
  const aducHtlTime = await getOrCreateStyle('aduc-htl-time');
  const aducHtlDesc = await getOrCreateStyle('aduc-htl-desc');
  const aducHtlNote = await getOrCreateStyle('aduc-htl-note');
  // Utility
  const mb48 = await getOrCreateStyle('av-mb-48');
  const mb64 = await getOrCreateStyle('av-mb-64');
  const aducLabelLine = await getOrCreateStyle('aduc-label-line');

  const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);

  async function applyStyleProperties() {
    log('Setting shared style properties...');
    await setSharedStyleProps(s, v);
    await wait(1000);

    log('Setting page-specific style properties...');

    // ── Hero ──
    await clearAndSet(await freshStyle('aduc-hero'), 'aduc-hero', {
      'min-height': '80vh',
      'display': 'flex', 'align-items': 'flex-end',
      'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'position': 'relative', 'overflow': 'hidden',
    });
    await clearAndSet(await freshStyle('aduc-hero-canvas-wrap'), 'aduc-hero-canvas-wrap', {
      'position': 'absolute', 'top': '0px', 'left': '0px',
      'width': '100%', 'height': '100%',
      'z-index': '1', 'pointer-events': 'none', 'overflow': 'hidden',
    });
    await clearAndSet(await freshStyle('aduc-hero-content'), 'aduc-hero-content', {
      'position': 'relative', 'z-index': '2', 'max-width': '800px',
    });
    await clearAndSet(await freshStyle('aduc-hero-label'), 'aduc-hero-label', {
      'font-family': 'DM Sans', 'font-size': v['av-text-xs'],
      'letter-spacing': '0.3em', 'text-transform': 'uppercase',
      'opacity': '0', 'margin-bottom': '32px', 'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('aduc-hero-gold-line'), 'aduc-hero-gold-line', {
      'width': '0px', 'height': '1px', 'background-color': '#c9a96e',
      'margin-bottom': '24px',
    });
    await clearAndSet(await freshStyle('aduc-hero-subtitle'), 'aduc-hero-subtitle', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.9', 'opacity': '0', 'margin-top': '24px',
      'color': v['av-cream'], 'max-width': '520px',
    });
    await clearAndSet(await freshStyle('aduc-hero-scroll-hint'), 'aduc-hero-scroll-hint', {
      'position': 'absolute', 'bottom': '40px', 'left': '50%',
      'z-index': '3', 'display': 'flex', 'flex-direction': 'column',
      'align-items': 'center', 'opacity': '0',
    });
    await clearAndSet(await freshStyle('aduc-hero-scroll-line'), 'aduc-hero-scroll-line', {
      'width': '1px', 'height': '40px', 'background-color': '#c9a96e',
    });
    await wait(500);

    // ── Types (scroll-lock) ──
    await clearAndSet(await freshStyle('aduc-types'), 'aduc-types', {
      'position': 'relative', 'overflow': 'hidden', 'background-color': '#ffffff',
    });
    await clearAndSet(await freshStyle('aduc-types-canvas-wrap'), 'aduc-types-canvas-wrap', {
      'position': 'absolute', 'top': '0px', 'left': '0px',
      'width': '100%', 'height': '100%',
      'z-index': '1', 'pointer-events': 'none', 'overflow': 'hidden',
    });
    await clearAndSet(await freshStyle('aduc-types-content'), 'aduc-types-content', {
      'position': 'relative', 'z-index': '2',
    });
    await clearAndSet(await freshStyle('aduc-types-pinned'), 'aduc-types-pinned', {
      'height': '100vh', 'display': 'flex', 'align-items': 'center',
      'position': 'relative',
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
    });
    await clearAndSet(await freshStyle('aduc-types-header'), 'aduc-types-header', {
      'position': 'absolute', 'top': '48px',
      'left': v['av-section-pad-x'], 'right': v['av-section-pad-x'],
    });
    await clearAndSet(await freshStyle('aduc-types-info'), 'aduc-types-info', {
      'margin-left': 'auto', 'position': 'relative',
      'width': '480px', 'max-width': '100%', 'min-height': '300px',
    });
    await clearAndSet(await freshStyle('aduc-type-card'), 'aduc-type-card', {
      'background-color': '#ffffff', 'color': v['av-dark'],
      'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
      'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
      'padding-top': '56px', 'padding-bottom': '56px',
      'padding-left': '48px', 'padding-right': '48px',
      'position': 'absolute', 'top': '50%', 'width': '100%',
      'opacity': '0',
    });
    await clearAndSet(await freshStyle('aduc-type-card-num'), 'aduc-type-card-num', {
      'font-family': 'DM Sans', 'font-size': v['av-text-xs'],
      'letter-spacing': '0.2em', 'text-transform': 'uppercase',
      'color': '#c9a96e', 'margin-bottom': '16px',
    });
    await clearAndSet(await freshStyle('aduc-type-card-title'), 'aduc-type-card-title', {
      'font-family': 'DM Serif Display', 'font-size': '28px',
      'line-height': '1.2', 'font-weight': '400',
      'margin-bottom': '14px', 'color': v['av-dark'],
    });
    await clearAndSet(await freshStyle('aduc-type-card-desc'), 'aduc-type-card-desc', {
      'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
      'line-height': '1.7', 'opacity': '0.55', 'color': v['av-dark'],
    });
    await clearAndSet(await freshStyle('aduc-types-progress'), 'aduc-types-progress', {
      'position': 'absolute', 'bottom': '40px', 'left': '50%',
      'z-index': '3', 'display': 'flex', 'align-items': 'center',
    });
    await clearAndSet(await freshStyle('aduc-types-track'), 'aduc-types-track', {
      'width': '200px', 'height': '2px',
      'background-color': 'rgba(17, 17, 17, 0.08)', 'position': 'relative',
    });
    await clearAndSet(await freshStyle('aduc-types-fill'), 'aduc-types-fill', {
      'height': '100%', 'background-color': v['av-red'], 'width': '0%',
    });
    await clearAndSet(await freshStyle('aduc-types-dots'), 'aduc-types-dots', {
      'display': 'flex',
    });
    await clearAndSet(await freshStyle('aduc-tdot'), 'aduc-tdot', {
      'font-family': 'DM Sans', 'font-size': '12px', 'font-weight': '500',
      'opacity': '0.3', 'color': v['av-dark'],
    });
    await wait(500);

    // ── ROI ──
    await clearAndSet(await freshStyle('aduc-roi'), 'aduc-roi', {
      'position': 'relative',
    });
    await clearAndSet(await freshStyle('aduc-roi-header'), 'aduc-roi-header', {
      'text-align': 'center', 'margin-bottom': '80px',
    });
    await clearAndSet(await freshStyle('aduc-roi-grid'), 'aduc-roi-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr 1fr',
      'grid-column-gap': '24px', 'grid-row-gap': '24px',
      'max-width': '1000px', 'margin-left': 'auto', 'margin-right': 'auto',
    });
    await clearAndSet(await freshStyle('aduc-roi-card'), 'aduc-roi-card', {
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
      'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
      'padding-top': '40px', 'padding-bottom': '40px',
      'padding-left': '24px', 'padding-right': '24px',
      'text-align': 'center',
    });
    await clearAndSet(await freshStyle('aduc-roi-value'), 'aduc-roi-value', {
      'font-family': 'DM Serif Display', 'font-size': 'clamp(28px, 3.5vw, 42px)',
      'font-weight': '400', 'color': '#c9a96e', 'margin-bottom': '12px', 'line-height': '1.1',
    });
    await clearAndSet(await freshStyle('aduc-roi-label'), 'aduc-roi-label', {
      'font-family': 'DM Sans', 'font-size': '12px',
      'text-transform': 'uppercase', 'letter-spacing': '0.15em', 'opacity': '0.4',
    });
    await wait(500);

    // ── Process (horizontal timeline) ──
    await clearAndSet(await freshStyle('aduc-process'), 'aduc-process', {
      'position': 'relative',
    });
    await clearAndSet(await freshStyle('aduc-process-header'), 'aduc-process-header', {
      'text-align': 'center', 'margin-bottom': '80px',
    });
    await clearAndSet(await freshStyle('aduc-htl-wrap'), 'aduc-htl-wrap', {
      'position': 'relative', 'max-width': '900px',
      'margin-left': 'auto', 'margin-right': 'auto',
      'padding-top': '60px',
    });
    await clearAndSet(await freshStyle('aduc-htl-track-wrap'), 'aduc-htl-track-wrap', {
      'position': 'absolute', 'top': '18px', 'left': '0px', 'right': '0px',
      'height': '4px',
    });
    await clearAndSet(await freshStyle('aduc-htl-track-bg'), 'aduc-htl-track-bg', {
      'width': '100%', 'height': '100%',
      'background-color': 'rgba(17, 17, 17, 0.08)',
      'border-top-left-radius': '2px', 'border-top-right-radius': '2px',
      'border-bottom-left-radius': '2px', 'border-bottom-right-radius': '2px',
    });
    await clearAndSet(await freshStyle('aduc-htl-track-fill'), 'aduc-htl-track-fill', {
      'position': 'absolute', 'top': '0px', 'left': '0px',
      'height': '100%', 'width': '0%',
      'background-color': v['av-red'],
      'border-top-left-radius': '2px', 'border-top-right-radius': '2px',
      'border-bottom-left-radius': '2px', 'border-bottom-right-radius': '2px',
    });
    await clearAndSet(await freshStyle('aduc-htl-steps'), 'aduc-htl-steps', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr',
      'grid-column-gap': '48px',
    });
    await clearAndSet(await freshStyle('aduc-htl-step'), 'aduc-htl-step', {
      'text-align': 'center', 'position': 'relative',
    });
    await clearAndSet(await freshStyle('aduc-htl-node'), 'aduc-htl-node', {
      'width': '20px', 'height': '20px',
      'border-top-left-radius': '50%', 'border-top-right-radius': '50%',
      'border-bottom-left-radius': '50%', 'border-bottom-right-radius': '50%',
      'border-top-width': '2px', 'border-bottom-width': '2px',
      'border-left-width': '2px', 'border-right-width': '2px',
      'border-top-style': 'solid', 'border-bottom-style': 'solid',
      'border-left-style': 'solid', 'border-right-style': 'solid',
      'border-top-color': 'rgba(17, 17, 17, 0.15)', 'border-bottom-color': 'rgba(17, 17, 17, 0.15)',
      'border-left-color': 'rgba(17, 17, 17, 0.15)', 'border-right-color': 'rgba(17, 17, 17, 0.15)',
      'background-color': v['av-warm'],
      'position': 'absolute', 'top': '-51px', 'left': '50%',
      'z-index': '2',
    });
    await clearAndSet(await freshStyle('aduc-htl-number'), 'aduc-htl-number', {
      'font-family': 'DM Serif Display', 'font-size': '64px',
      'line-height': '1', 'opacity': '0.15',
      'display': 'block', 'margin-bottom': '4px',
    });
    await clearAndSet(await freshStyle('aduc-htl-title'), 'aduc-htl-title', {
      'font-family': 'DM Serif Display', 'font-size': '28px',
      'line-height': '1.2', 'margin-bottom': '8px',
    });
    await clearAndSet(await freshStyle('aduc-htl-time'), 'aduc-htl-time', {
      'font-size': '14px', 'color': v['av-red'],
      'display': 'block', 'margin-bottom': '12px', 'opacity': '0',
    });
    await clearAndSet(await freshStyle('aduc-htl-desc'), 'aduc-htl-desc', {
      'font-size': v['av-text-sm'], 'line-height': '1.7',
      'opacity': '0', 'max-width': '280px',
      'margin-left': 'auto', 'margin-right': 'auto',
    });
    await clearAndSet(await freshStyle('aduc-htl-note'), 'aduc-htl-note', {
      'text-align': 'center', 'margin-top': '48px',
      'font-size': '14px', 'opacity': '0.4',
    });

    // ── Utility ──
    await clearAndSet(await freshStyle('av-mb-48'), 'av-mb-48', { 'margin-bottom': '48px' });
    await clearAndSet(await freshStyle('av-mb-64'), 'av-mb-64', { 'margin-bottom': '64px' });
    await clearAndSet(await freshStyle('aduc-label-line'), 'aduc-label-line', {
      'flex-grow': '1', 'height': '1px', 'background-color': 'rgba(17, 17, 17, 0.15)',
    });
    await wait(500);

    await applyCTAStyleProps(v);
  }

  // ═══════════════ BUILD ELEMENTS ═══════════════

  // SECTION 1: HERO — Full-viewport cinematic
  log('Building Section 1: Hero...');
  const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
  hero.setTag('section');
  hero.setStyles([aducHero]);
  hero.setAttribute('id', 'aduc-hero');

  // Canvas wrap
  const heroCanvasWrap = hero.append(webflow.elementPresets.DOM);
  heroCanvasWrap.setTag('div');
  heroCanvasWrap.setStyles([aducHeroCanvasWrap]);
  heroCanvasWrap.setAttribute('id', 'hero-canvas');

  // Content overlay
  const heroC = hero.append(webflow.elementPresets.DOM);
  heroC.setTag('div');
  heroC.setStyles([aducHeroContent]);

  const heroLabel = heroC.append(webflow.elementPresets.DOM);
  heroLabel.setTag('div');
  heroLabel.setStyles([aducHeroLabel]);
  heroLabel.setTextContent('// ADU Construction');
  heroLabel.setAttribute('data-animate', 'fade-up');

  const heroH = heroC.append(webflow.elementPresets.DOM);
  heroH.setTag('h1');
  heroH.setStyles([s.headingXL]);
  heroH.setTextContent('ADU Construction');
  heroH.setAttribute('data-animate', 'char-cascade');

  const heroGoldLine = heroC.append(webflow.elementPresets.DOM);
  heroGoldLine.setTag('div');
  heroGoldLine.setStyles([aducHeroGoldLine]);

  const heroSub = heroC.append(webflow.elementPresets.DOM);
  heroSub.setTag('p');
  heroSub.setStyles([aducHeroSubtitle]);
  heroSub.setTextContent('An accessory dwelling unit is an independent residential unit on the same lot as your home. Detached, attached, or converted — Avorino designs, permits, and builds it all.');
  heroSub.setAttribute('data-animate', 'fade-up');

  // Scroll hint
  const heroScrollHint = hero.append(webflow.elementPresets.DOM);
  heroScrollHint.setTag('div');
  heroScrollHint.setStyles([aducHeroScrollHint]);
  heroScrollHint.setAttribute('data-animate', 'fade-up');
  const heroScrollText = heroScrollHint.append(webflow.elementPresets.DOM);
  heroScrollText.setTag('span');
  heroScrollText.setTextContent('Scroll');
  const heroScrollLine = heroScrollHint.append(webflow.elementPresets.DOM);
  heroScrollLine.setTag('div');
  heroScrollLine.setStyles([aducHeroScrollLine]);

  await safeCall('append:hero', () => body.append(hero));
  logDetail('Section 1: Hero appended', 'ok');

  // SECTION 2: ADU TYPES — Scroll-locked + Three.js
  log('Building Section 2: ADU Types...');
  const typesSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  typesSection.setTag('section');
  typesSection.setStyles([aducTypes]);
  typesSection.setAttribute('id', 'aduc-types');

  // Canvas wrap
  const typesCanvasWrap = typesSection.append(webflow.elementPresets.DOM);
  typesCanvasWrap.setTag('div');
  typesCanvasWrap.setStyles([aducTypesCanvasWrap]);
  typesCanvasWrap.setAttribute('id', 'types-canvas');

  // Content layer
  const typesContent = typesSection.append(webflow.elementPresets.DOM);
  typesContent.setTag('div');
  typesContent.setStyles([aducTypesContent]);

  // Pinned container
  const typesPinned = typesContent.append(webflow.elementPresets.DOM);
  typesPinned.setTag('div');
  typesPinned.setStyles([aducTypesPinned]);
  typesPinned.setAttribute('data-types-pinned', '');

  // Header inside pinned
  const typesHeader = typesPinned.append(webflow.elementPresets.DOM);
  typesHeader.setTag('div');
  typesHeader.setStyles([aducTypesHeader]);
  const typesLabel = typesHeader.append(webflow.elementPresets.DOM);
  typesLabel.setTag('div');
  typesLabel.setStyles([s.label, mb48]);
  const typesLabelTxt = typesLabel.append(webflow.elementPresets.DOM);
  typesLabelTxt.setTag('div');
  typesLabelTxt.setTextContent('ADU Types');
  const typesLabelLine = typesLabel.append(webflow.elementPresets.DOM);
  typesLabelLine.setTag('div');
  typesLabelLine.setStyles([aducLabelLine]);

  // Info card stack
  const typesInfo = typesPinned.append(webflow.elementPresets.DOM);
  typesInfo.setTag('div');
  typesInfo.setStyles([aducTypesInfo]);

  ADU_TYPES.forEach((type, i) => {
    const card = typesInfo.append(webflow.elementPresets.DOM);
    card.setTag('div');
    card.setStyles([aducTypeCard]);
    card.setAttribute('data-step', String(i));

    const num = card.append(webflow.elementPresets.DOM);
    num.setTag('div');
    num.setStyles([aducTypeCardNum]);
    num.setTextContent(`${type.number} / 04`);

    const title = card.append(webflow.elementPresets.DOM);
    title.setTag('h3');
    title.setStyles([aducTypeCardTitle]);
    title.setTextContent(type.title);

    const desc = card.append(webflow.elementPresets.DOM);
    desc.setTag('p');
    desc.setStyles([aducTypeCardDesc]);
    desc.setTextContent(type.desc);
  });

  // Progress bar
  const typesProgress = typesPinned.append(webflow.elementPresets.DOM);
  typesProgress.setTag('div');
  typesProgress.setStyles([aducTypesProgress]);

  const typesTrack = typesProgress.append(webflow.elementPresets.DOM);
  typesTrack.setTag('div');
  typesTrack.setStyles([aducTypesTrack]);
  const typesFill = typesTrack.append(webflow.elementPresets.DOM);
  typesFill.setTag('div');
  typesFill.setStyles([aducTypesFill]);

  const typesDots = typesProgress.append(webflow.elementPresets.DOM);
  typesDots.setTag('div');
  typesDots.setStyles([aducTypesDots]);
  const dotLabels = ['01', '02', '03', '04'];
  for (const dl of dotLabels) {
    const dot = typesDots.append(webflow.elementPresets.DOM);
    dot.setTag('span');
    dot.setStyles([aducTdot]);
    dot.setTextContent(dl);
  }

  await safeCall('append:types', () => body.append(typesSection));
  logDetail('Section 2: Types appended', 'ok');

  // SECTION 3: ROI / COST
  log('Building Section 3: Cost & ROI...');
  const roiSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  roiSection.setTag('section');
  roiSection.setStyles([s.section, s.sectionWarm, aducRoi]);
  roiSection.setAttribute('id', 'aduc-roi');

  // ROI Header
  const roiHeader = roiSection.append(webflow.elementPresets.DOM);
  roiHeader.setTag('div');
  roiHeader.setStyles([aducRoiHeader]);

  const roiLabel = roiHeader.append(webflow.elementPresets.DOM);
  roiLabel.setTag('div');
  roiLabel.setStyles([s.label, mb64]);
  roiLabel.setAttribute('data-animate', 'fade-up');
  const roiLabelTxt = roiLabel.append(webflow.elementPresets.DOM);
  roiLabelTxt.setTag('div');
  roiLabelTxt.setTextContent('The Numbers');
  const roiLabelLine = roiLabel.append(webflow.elementPresets.DOM);
  roiLabelLine.setTag('div');
  roiLabelLine.setStyles([aducLabelLine]);

  const roiH = roiHeader.append(webflow.elementPresets.DOM);
  roiH.setTag('h2');
  roiH.setStyles([s.headingLG]);
  roiH.setTextContent('The numbers make sense');
  roiH.setAttribute('data-animate', 'line-wipe');

  // ROI Grid
  const roiGrid = roiSection.append(webflow.elementPresets.DOM);
  roiGrid.setTag('div');
  roiGrid.setStyles([aducRoiGrid]);

  const roiData = [
    { value: '$250K–$400K', label: 'Avg. project cost' },
    { value: '$2K–$4.5K+', label: 'Monthly rental' },
    { value: '5–12%', label: 'Annual ROI' },
    { value: '8–15 yrs', label: 'Break-even' },
  ];
  roiData.forEach((rd, i) => {
    const card = roiGrid.append(webflow.elementPresets.DOM);
    card.setTag('div');
    card.setStyles([aducRoiCard]);
    card.setAttribute('data-stat', String(i));
    card.setAttribute('data-animate', 'fade-up');

    const val = card.append(webflow.elementPresets.DOM);
    val.setTag('div');
    val.setStyles([aducRoiValue]);
    val.setTextContent(rd.value);
    val.setAttribute('data-count', rd.value);
    val.setAttribute('data-animate', 'scramble');

    const lbl = card.append(webflow.elementPresets.DOM);
    lbl.setTag('div');
    lbl.setStyles([aducRoiLabel]);
    lbl.setTextContent(rd.label);
  });

  await safeCall('append:roi', () => body.append(roiSection));
  logDetail('Section 3: ROI appended', 'ok');

  // SECTION 4: PROCESS — Horizontal Timeline
  log('Building Section 4: Process...');
  const procSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  procSection.setTag('section');
  procSection.setStyles([s.section, s.sectionWarm, aducProcess]);
  procSection.setAttribute('id', 'aduc-process');

  // Process header
  const procHeader = procSection.append(webflow.elementPresets.DOM);
  procHeader.setTag('div');
  procHeader.setStyles([aducProcessHeader]);

  const procLabel = procHeader.append(webflow.elementPresets.DOM);
  procLabel.setTag('div');
  procLabel.setStyles([s.label, mb64]);
  procLabel.setAttribute('data-animate', 'fade-up');
  const procLabelTxt = procLabel.append(webflow.elementPresets.DOM);
  procLabelTxt.setTag('div');
  procLabelTxt.setTextContent('Our Process');
  const procLabelLine = procLabel.append(webflow.elementPresets.DOM);
  procLabelLine.setTag('div');
  procLabelLine.setStyles([aducLabelLine]);

  const procH = procHeader.append(webflow.elementPresets.DOM);
  procH.setTag('h2');
  procH.setStyles([s.headingLG]);
  procH.setTextContent('Three steps to your ADU');
  procH.setAttribute('data-animate', 'line-wipe');

  // Horizontal timeline wrapper
  const htlWrap = procSection.append(webflow.elementPresets.DOM);
  htlWrap.setTag('div');
  htlWrap.setStyles([aducHtlWrap]);
  htlWrap.setAttribute('id', 'aduc-htl-wrap');

  // Track
  const htlTrackWrap = htlWrap.append(webflow.elementPresets.DOM);
  htlTrackWrap.setTag('div');
  htlTrackWrap.setStyles([aducHtlTrackWrap]);
  const htlTrackBg = htlTrackWrap.append(webflow.elementPresets.DOM);
  htlTrackBg.setTag('div');
  htlTrackBg.setStyles([aducHtlTrackBg]);
  const htlTrackFill = htlTrackWrap.append(webflow.elementPresets.DOM);
  htlTrackFill.setTag('div');
  htlTrackFill.setStyles([aducHtlTrackFill]);
  htlTrackFill.setAttribute('id', 'aduc-htl-fill');

  // Steps grid
  const htlSteps = htlWrap.append(webflow.elementPresets.DOM);
  htlSteps.setTag('div');
  htlSteps.setStyles([aducHtlSteps]);

  PROCESS_STEPS.forEach((step, i) => {
    const stepEl = htlSteps.append(webflow.elementPresets.DOM);
    stepEl.setTag('div');
    stepEl.setStyles([aducHtlStep]);
    stepEl.setAttribute('data-step', String(i));

    // Node circle
    const node = stepEl.append(webflow.elementPresets.DOM);
    node.setTag('div');
    node.setStyles([aducHtlNode]);

    // Number
    const num = stepEl.append(webflow.elementPresets.DOM);
    num.setTag('span');
    num.setStyles([aducHtlNumber]);
    num.setTextContent(step.number);

    // Title with .word spans
    const title = stepEl.append(webflow.elementPresets.DOM);
    title.setTag('h3');
    title.setStyles([aducHtlTitle]);
    // Each word wrapped in a span — single-word titles here
    const wordSpan = title.append(webflow.elementPresets.DOM);
    wordSpan.setTag('span');
    wordSpan.setTextContent(step.title);

    // Time
    const time = stepEl.append(webflow.elementPresets.DOM);
    time.setTag('span');
    time.setStyles([aducHtlTime]);
    time.setTextContent(step.time);

    // Description
    const desc = stepEl.append(webflow.elementPresets.DOM);
    desc.setTag('p');
    desc.setStyles([aducHtlDesc]);
    desc.setTextContent(step.desc);
  });

  // Timeline note
  const htlNote = htlWrap.append(webflow.elementPresets.DOM);
  htlNote.setTag('p');
  htlNote.setStyles([aducHtlNote]);
  htlNote.setTextContent('Total timeline: 10–14 months from design to move-in');

  await safeCall('append:process', () => body.append(procSection));
  logDetail('Section 4: Process appended', 'ok');

  // SECTION 5: CTA
  log('Building Section 5: CTA...');
  await buildCTASection(
    body, v,
    'Get your ADU estimate',
    'ADU Cost Calculator', '/adu-cost-estimator',
    'Schedule a Meeting', '/schedule-a-meeting',
  );

  await applyStyleProperties();

  log('ADU Construction page built!', 'success');
  await webflow.notify({ type: 'Success', message: 'ADU Construction page created!' });
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
  try { await buildADUConstructionPage(); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
