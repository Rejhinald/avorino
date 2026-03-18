// ════════════════════════════════════════════════════════════════
// Avorino Builder — CAREERS PAGE (v2 complete rework)
// Split hero (dark 3D left + cream culture right), positions
// accordion, application form, stats strip, CTA
// All animations via CDN: avorino-careers-footer.js
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog, wait,
  safeCall, getAvorinVars, getOrCreateStyle, freshStyle,
  clearAndSet, createSharedStyles, setSharedStyleProps,
  createAllVariables, createPageWithSlug,
  buildCTASection, applyCTAStyleProps,
  buildCleanForm, FormField,
} from './shared.js';

// ── Page config ──
const PAGE_NAME = 'Careers';
const PAGE_SLUG = 'careers';
const PAGE_TITLE = 'Careers at Avorino — Join Our Team | Orange County Construction';
const PAGE_DESC = 'Join the Avorino team. We build luxury homes, ADUs, and commercial projects across Orange County. Explore open positions and apply today.';
const CDN = '75864a2';
const HEAD_CODE = [
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-responsive.css">`,
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-nav-footer.css">`,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>',
  `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-animations.js"><\/script>`,
  `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-careers-footer.js"><\/script>`,
].join('\n');

// ── Update panel UI ──
document.getElementById('page-name')!.textContent = PAGE_NAME;
const headCodeEl = document.getElementById('head-code');
const footerCodeEl = document.getElementById('footer-code');
if (headCodeEl) headCodeEl.textContent = HEAD_CODE;
if (footerCodeEl) footerCodeEl.textContent = FOOTER_CODE;

// ── Form fields ──
const FORM_FIELDS: FormField[] = [
  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name', halfWidth: true },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'you@email.com', halfWidth: true },
  { name: 'phone', label: 'Phone', type: 'tel', placeholder: '(000) 000-0000', halfWidth: true },
  { name: 'position', label: 'Position of Interest', type: 'select', halfWidth: true, options: ['Project Manager', 'Site Superintendent', 'Carpenter / Framer', 'Electrician', 'Plumber', 'General Laborer', 'Estimator', 'Architect / Designer', 'Other'] },
  { name: 'experience', label: 'Years of Experience', type: 'select', options: ['0–2 years', '3–5 years', '5–10 years', '10+ years'] },
  { name: 'message', label: 'Tell Us About Yourself', type: 'textarea', placeholder: 'Relevant experience, certifications, availability, etc.' },
];

// ── Culture values ──
const CULTURE_VALUES = [
  { num: '01', heading: 'Build extraordinary', body: 'Work on luxury custom homes, ADUs, and commercial projects across Orange County. Every project is built to last.' },
  { num: '02', heading: 'Grow with us', body: 'Training, certifications, and career advancement are part of the job. We invest in our people.' },
  { num: '03', heading: 'Competitive pay', body: 'Market-rate compensation, benefits, and consistent year-round work across Orange County.' },
];

// ── Open positions (currently none) ──

// ── Stats ──
const STATS = [
  { value: '4.8', suffix: '/5', label: 'Yelp Rating' },
  { value: '35', suffix: '+', label: '5-Star Reviews' },
  { value: '10', suffix: '+', label: 'Years in OC' },
  { value: '37', suffix: '', label: 'Cities Served' },
];

// ── Perks ──
const PERKS = [
  'Year-round work across Orange County',
  'Health benefits & competitive compensation',
  'Training, certifications & career advancement',
  'Work on luxury custom homes & commercial builds',
];

// ── Build function ──
async function buildCareersPage() {
  clearErrorLog();
  logDetail('Starting Careers page build (v2 rework)...', 'info');
  const v = await getAvorinVars();
  logDetail('Loaded Avorino variable collection', 'ok');

  log('Creating shared styles...');
  const s = await createSharedStyles();

  // ── Page-specific styles (all via Webflow Designer API) ──
  log('Creating careers-specific styles...');

  // Hero
  const crHero = await getOrCreateStyle('cr-hero');
  const crHeroLeft = await getOrCreateStyle('cr-hero-left');
  const crCanvasWrap = await getOrCreateStyle('cr-canvas-wrap');
  const crHeroContent = await getOrCreateStyle('cr-hero-content');
  const crHeroLabel = await getOrCreateStyle('cr-hero-label');
  const crHeroHeading = await getOrCreateStyle('cr-hero-heading');
  const crHeroSub = await getOrCreateStyle('cr-hero-sub');
  const crHeroRight = await getOrCreateStyle('cr-hero-right');
  const crValuesLabel = await getOrCreateStyle('cr-values-label');
  const crValueItem = await getOrCreateStyle('cr-value-item');
  const crValueNum = await getOrCreateStyle('cr-value-number');
  const crValueHeading = await getOrCreateStyle('cr-value-heading');
  const crValueBody = await getOrCreateStyle('cr-value-body');

  // Positions
  const crPositions = await getOrCreateStyle('cr-positions');
  const crPosLabel = await getOrCreateStyle('cr-positions-label');
  const crPosHeading = await getOrCreateStyle('cr-positions-heading');
  const crPosList = await getOrCreateStyle('cr-pos-list');
  const crPosItem = await getOrCreateStyle('cr-pos-item');
  const crPosHeader = await getOrCreateStyle('cr-pos-header');
  const crPosTitle = await getOrCreateStyle('cr-pos-title');
  const crPosTags = await getOrCreateStyle('cr-pos-tags');
  const crPosTag = await getOrCreateStyle('cr-pos-tag');
  const crPosDesc = await getOrCreateStyle('cr-pos-desc');

  // Apply section
  const crApply = await getOrCreateStyle('cr-apply');
  const crApplyGrid = await getOrCreateStyle('cr-apply-grid');
  const crApplyLabel = await getOrCreateStyle('cr-apply-label');
  const crApplyHeading = await getOrCreateStyle('cr-apply-heading');
  const crApplyBody = await getOrCreateStyle('cr-apply-body');
  const crApplyPerks = await getOrCreateStyle('cr-apply-perks');
  const crPerk = await getOrCreateStyle('cr-perk');
  const crPerkText = await getOrCreateStyle('cr-perk-text');
  const crFormCol = await getOrCreateStyle('cr-form-col');

  // Stats
  const crStats = await getOrCreateStyle('cr-stats');
  const crStatsGrid = await getOrCreateStyle('cr-stats-grid');
  const crStatValue = await getOrCreateStyle('cr-stat-value');
  const crStatLabel = await getOrCreateStyle('cr-stat-label');

  // ── Create page ──
  const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);

  // ── Style properties ──
  async function applyStyleProperties() {
    log('Setting shared style properties...');
    await setSharedStyleProps(s, v);
    await wait(1000);

    log('Setting careers-specific style properties...');

    // ── HERO ──
    await clearAndSet(crHero, 'cr-hero', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr',
      'min-height': '100vh',
    });
    await clearAndSet(crHeroLeft, 'cr-hero-left', {
      'position': 'relative',
      'display': 'flex', 'flex-direction': 'column', 'justify-content': 'flex-end',
      'padding-top': '180px', 'padding-bottom': '80px',
      'padding-left': '80px', 'padding-right': '80px',
      'background-color': v['av-dark'],
      'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(crCanvasWrap, 'cr-canvas-wrap', {
      'position': 'absolute', 'top': '0px', 'left': '0px',
      'width': '100%', 'height': '100%',
      'z-index': '0', 'pointer-events': 'none', 'opacity': '0.6',
    });
    await clearAndSet(crHeroContent, 'cr-hero-content', {
      'position': 'relative', 'z-index': '2',
    });
    await clearAndSet(crHeroLabel, 'cr-hero-label', {
      'font-family': 'DM Sans', 'font-size': '12px', 'font-weight': '500',
      'letter-spacing': '0.2em', 'text-transform': 'uppercase',
      'color': v['av-cream'], 'opacity': '0.4', 'margin-bottom': '20px',
    });
    await clearAndSet(crHeroHeading, 'cr-hero-heading', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h1'],
      'font-weight': '400', 'line-height': '1.05', 'letter-spacing': '-0.02em',
      'color': v['av-cream'], 'margin-bottom': '20px',
    });
    await clearAndSet(crHeroSub, 'cr-hero-sub', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.7', 'color': v['av-cream'], 'opacity': '0.5',
      'max-width': '480px',
    });
    await wait(500);

    // ── RIGHT: Culture values ──
    await clearAndSet(crHeroRight, 'cr-hero-right', {
      'background-color': v['av-cream'], 'color': v['av-dark'],
      'display': 'flex', 'flex-direction': 'column', 'justify-content': 'center',
      'padding-top': '120px', 'padding-bottom': '120px',
      'padding-left': '80px', 'padding-right': '80px',
    });
    await clearAndSet(crValuesLabel, 'cr-values-label', {
      'font-family': 'DM Sans', 'font-size': '11px', 'font-weight': '500',
      'letter-spacing': '0.2em', 'text-transform': 'uppercase',
      'opacity': '0.35', 'margin-bottom': '48px',
    });
    await clearAndSet(crValueItem, 'cr-value-item', {
      'padding-top': '36px', 'padding-bottom': '36px',
      'border-bottom-width': '1px', 'border-bottom-style': 'solid',
      'border-bottom-color': 'rgba(17,17,17,0.1)',
    });
    await clearAndSet(crValueNum, 'cr-value-number', {
      'font-family': 'DM Serif Display', 'font-size': '14px',
      'opacity': '0.25', 'margin-bottom': '12px',
    });
    await clearAndSet(crValueHeading, 'cr-value-heading', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
      'font-weight': '400', 'line-height': '1.2', 'margin-bottom': '10px',
    });
    await clearAndSet(crValueBody, 'cr-value-body', {
      'font-family': 'DM Sans', 'font-size': '16px',
      'line-height': '1.7', 'opacity': '0.5', 'max-width': '400px',
    });
    await wait(500);

    // ── POSITIONS ──
    await clearAndSet(crPositions, 'cr-positions', {
      'background-color': v['av-dark'],
      'padding-top': v['av-section-pad-y'], 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
    });
    await clearAndSet(crPosLabel, 'cr-positions-label', {
      'font-family': 'DM Sans', 'font-size': '11px', 'font-weight': '500',
      'letter-spacing': '0.2em', 'text-transform': 'uppercase',
      'color': v['av-cream'], 'opacity': '0.35', 'margin-bottom': '16px',
    });
    await clearAndSet(crPosHeading, 'cr-positions-heading', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h2'],
      'font-weight': '400', 'line-height': '1.1',
      'color': v['av-cream'], 'margin-bottom': '64px', 'max-width': '700px',
    });
    await wait(300);
    await clearAndSet(crPosList, 'cr-pos-list', {
      'max-width': '900px', 'margin-left': 'auto', 'margin-right': 'auto',
    });
    await clearAndSet(crPosItem, 'cr-pos-item', {
      'border-top-width': '1px', 'border-top-style': 'solid',
      'border-top-color': 'rgba(240,237,232,0.08)',
      'padding-top': '32px', 'padding-bottom': '32px',
      'cursor': 'pointer',
    });
    await clearAndSet(crPosHeader, 'cr-pos-header', {
      'display': 'flex', 'align-items': 'center', 'justify-content': 'space-between',
      'grid-column-gap': '24px',
    });
    await clearAndSet(crPosTitle, 'cr-pos-title', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
      'font-weight': '400', 'line-height': '1.3', 'color': v['av-cream'],
    });
    await clearAndSet(crPosTags, 'cr-pos-tags', {
      'display': 'flex', 'grid-column-gap': '12px', 'flex-shrink': '0',
    });
    await clearAndSet(crPosTag, 'cr-pos-tag', {
      'font-family': 'DM Sans', 'font-size': '11px',
      'text-transform': 'uppercase', 'letter-spacing': '0.15em',
      'padding-top': '6px', 'padding-bottom': '6px',
      'padding-left': '16px', 'padding-right': '16px',
      'border-width': '1px', 'border-style': 'solid',
      'border-color': 'rgba(240,237,232,0.12)',
      'border-top-left-radius': '100px', 'border-top-right-radius': '100px',
      'border-bottom-left-radius': '100px', 'border-bottom-right-radius': '100px',
      'color': v['av-cream'], 'opacity': '0.4',
    });
    await clearAndSet(crPosDesc, 'cr-pos-desc', {
      'font-family': 'DM Sans', 'font-size': '17px',
      'line-height': '1.8', 'color': v['av-cream'], 'opacity': '0.5',
      'margin-top': '20px', 'max-width': '600px',
    });
    await wait(500);

    // ── APPLY SECTION ──
    await clearAndSet(crApply, 'cr-apply', {
      'background-color': '#1a1917',
      'padding-top': v['av-section-pad-y'], 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
    });
    await clearAndSet(crApplyGrid, 'cr-apply-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1.2fr',
      'grid-column-gap': '80px', 'max-width': '1200px',
      'margin-left': 'auto', 'margin-right': 'auto',
    });
    await clearAndSet(crApplyLabel, 'cr-apply-label', {
      'font-family': 'DM Sans', 'font-size': '11px', 'font-weight': '500',
      'letter-spacing': '0.2em', 'text-transform': 'uppercase',
      'color': v['av-cream'], 'opacity': '0.35', 'margin-bottom': '16px',
    });
    await clearAndSet(crApplyHeading, 'cr-apply-heading', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h2'],
      'font-weight': '400', 'line-height': '1.1',
      'color': v['av-cream'], 'margin-bottom': '24px',
    });
    await clearAndSet(crApplyBody, 'cr-apply-body', {
      'font-family': 'DM Sans', 'font-size': '17px',
      'line-height': '1.7', 'color': v['av-cream'], 'opacity': '0.45',
      'max-width': '420px', 'margin-bottom': '48px',
    });
    await wait(300);
    await clearAndSet(crApplyPerks, 'cr-apply-perks', {
      'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '20px',
    });
    await clearAndSet(crPerk, 'cr-perk', {
      'display': 'flex', 'align-items': 'flex-start', 'grid-column-gap': '16px',
    });
    await clearAndSet(crPerkText, 'cr-perk-text', {
      'font-family': 'DM Sans', 'font-size': '15px',
      'line-height': '1.5', 'color': v['av-cream'], 'opacity': '0.6',
    });
    await clearAndSet(crFormCol, 'cr-form-col', {
      'display': 'flex', 'flex-direction': 'column',
    });
    await wait(500);

    // ── STATS ──
    await clearAndSet(crStats, 'cr-stats', {
      'background-color': v['av-dark'],
      'padding-top': '96px', 'padding-bottom': '96px',
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'border-top-width': '1px', 'border-top-style': 'solid',
      'border-top-color': 'rgba(240,237,232,0.06)',
      'border-bottom-width': '1px', 'border-bottom-style': 'solid',
      'border-bottom-color': 'rgba(240,237,232,0.06)',
    });
    await clearAndSet(crStatsGrid, 'cr-stats-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr 1fr',
      'grid-column-gap': '48px', 'max-width': '1100px',
      'margin-left': 'auto', 'margin-right': 'auto', 'text-align': 'center',
    });
    await clearAndSet(crStatValue, 'cr-stat-value', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h2'],
      'font-weight': '400', 'line-height': '1',
      'color': v['av-cream'], 'margin-bottom': '8px',
    });
    await clearAndSet(crStatLabel, 'cr-stat-label', {
      'font-family': 'DM Sans', 'font-size': '13px', 'font-weight': '500',
      'letter-spacing': '0.15em', 'text-transform': 'uppercase',
      'color': v['av-cream'], 'opacity': '0.35',
    });
    await wait(500);

    await applyCTAStyleProps(v);
  }

  // ═══════════════ BUILD ELEMENTS ═══════════════

  // ──────────────────────────────────────────────
  // SECTION 1: SPLIT HERO
  // ──────────────────────────────────────────────
  log('Building Section 1: Split Hero...');
  const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
  hero.setTag('section');
  hero.setStyles([crHero]);
  hero.setAttribute('id', 'cr-hero');

  // Left: dark + 3D canvas
  const heroLeft = hero.append(webflow.elementPresets.DOM);
  heroLeft.setTag('div');
  heroLeft.setStyles([crHeroLeft]);
  heroLeft.setAttribute('class', 'cr-hero-left');

  const canvasWrap = heroLeft.append(webflow.elementPresets.DOM);
  canvasWrap.setTag('div');
  canvasWrap.setStyles([crCanvasWrap]);
  canvasWrap.setAttribute('id', 'cr-canvas');
  canvasWrap.setAttribute('class', 'cr-canvas-wrap');

  const heroContent = heroLeft.append(webflow.elementPresets.DOM);
  heroContent.setTag('div');
  heroContent.setStyles([crHeroContent]);

  const heroLabel = heroContent.append(webflow.elementPresets.DOM);
  heroLabel.setTag('div');
  heroLabel.setStyles([crHeroLabel]);
  heroLabel.setTextContent('// Careers');
  heroLabel.setAttribute('class', 'cr-hero-label');

  const heroH = heroContent.append(webflow.elementPresets.DOM);
  heroH.setTag('h1');
  heroH.setStyles([crHeroHeading]);
  heroH.setTextContent('Build your future with us');
  heroH.setAttribute('class', 'cr-hero-heading');

  const heroSub = heroContent.append(webflow.elementPresets.DOM);
  heroSub.setTag('p');
  heroSub.setStyles([crHeroSub]);
  heroSub.setTextContent("Join Orange County\u2019s trusted builder of luxury homes, ADUs, and commercial projects. We\u2019re growing \u2014 and hiring.");
  heroSub.setAttribute('class', 'cr-hero-sub');

  // Right: culture values
  const heroRight = hero.append(webflow.elementPresets.DOM);
  heroRight.setTag('div');
  heroRight.setStyles([crHeroRight]);
  heroRight.setAttribute('class', 'cr-hero-right');

  const valLabel = heroRight.append(webflow.elementPresets.DOM);
  valLabel.setTag('div');
  valLabel.setStyles([crValuesLabel]);
  valLabel.setTextContent('Why Avorino');
  valLabel.setAttribute('class', 'cr-values-label');

  for (const val of CULTURE_VALUES) {
    const item = heroRight.append(webflow.elementPresets.DOM);
    item.setTag('div');
    item.setStyles([crValueItem]);
    item.setAttribute('class', 'cr-value-item');

    const num = item.append(webflow.elementPresets.DOM);
    num.setTag('div');
    num.setStyles([crValueNum]);
    num.setTextContent(val.num);

    const h = item.append(webflow.elementPresets.DOM);
    h.setTag('h3');
    h.setStyles([crValueHeading]);
    h.setTextContent(val.heading);

    const b = item.append(webflow.elementPresets.DOM);
    b.setTag('p');
    b.setStyles([crValueBody]);
    b.setTextContent(val.body);
  }

  await safeCall('append:hero', () => body.append(hero));
  logDetail('Section 1: Split Hero appended', 'ok');

  // ──────────────────────────────────────────────
  // SECTION 2: OPEN POSITIONS (currently none)
  // ──────────────────────────────────────────────
  log('Building Section 2: Open Positions...');
  const posSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  posSection.setTag('section');
  posSection.setStyles([crPositions]);
  posSection.setAttribute('id', 'cr-positions');

  const posInner = posSection.append(webflow.elementPresets.DOM);
  posInner.setTag('div');
  posInner.setStyles([crPosList]);

  const posLabel = posInner.append(webflow.elementPresets.DOM);
  posLabel.setTag('div');
  posLabel.setStyles([crPosLabel]);
  posLabel.setTextContent('// Open Positions');

  const posH = posInner.append(webflow.elementPresets.DOM);
  posH.setTag('h2');
  posH.setStyles([crPosHeading]);
  posH.setTextContent("We\u2019re always looking for skilled professionals");

  const posBody = posInner.append(webflow.elementPresets.DOM);
  posBody.setTag('p');
  posBody.setStyles([crPosDesc]);
  posBody.setTextContent("There are no current open positions right now, but we\u2019re always interested in hearing from talented people. Submit your application below and we\u2019ll reach out when a role opens up.");

  await safeCall('append:positions', () => body.append(posSection));
  logDetail('Section 2: Open Positions appended', 'ok');

  // ──────────────────────────────────────────────
  // SECTION 3: APPLICATION FORM
  // ──────────────────────────────────────────────
  log('Building Section 3: Application Form...');
  const applySection = webflow.elementBuilder(webflow.elementPresets.DOM);
  applySection.setTag('section');
  applySection.setStyles([crApply]);
  applySection.setAttribute('id', 'cr-apply');

  const applyGrid = applySection.append(webflow.elementPresets.DOM);
  applyGrid.setTag('div');
  applyGrid.setStyles([crApplyGrid]);

  // Left: info + perks
  const applyLeft = applyGrid.append(webflow.elementPresets.DOM);
  applyLeft.setTag('div');
  applyLeft.setAttribute('class', 'cr-apply-left');

  const apLabel = applyLeft.append(webflow.elementPresets.DOM);
  apLabel.setTag('div');
  apLabel.setStyles([crApplyLabel]);
  apLabel.setTextContent('// Apply Now');

  const apH = applyLeft.append(webflow.elementPresets.DOM);
  apH.setTag('h2');
  apH.setStyles([crApplyHeading]);
  apH.setTextContent('Ready to join the team?');

  const apBody = applyLeft.append(webflow.elementPresets.DOM);
  apBody.setTag('p');
  apBody.setStyles([crApplyBody]);
  apBody.setTextContent("Fill out the form and we\u2019ll get back to you within 48 hours. You can also email us directly at construction@avorino.com");

  const perksWrap = applyLeft.append(webflow.elementPresets.DOM);
  perksWrap.setTag('div');
  perksWrap.setStyles([crApplyPerks]);
  perksWrap.setAttribute('class', 'cr-apply-perks');

  for (const perkText of PERKS) {
    const perkEl = perksWrap.append(webflow.elementPresets.DOM);
    perkEl.setTag('div');
    perkEl.setStyles([crPerk]);
    perkEl.setAttribute('class', 'cr-perk');

    // Checkmark (text, no SVG since Webflow DOM doesn't support inline SVG easily)
    const check = perkEl.append(webflow.elementPresets.DOM);
    check.setTag('span');
    check.setTextContent('\u2713');
    check.setAttribute('style', 'color:#c8222a;font-size:16px;flex-shrink:0;margin-top:2px;');

    const text = perkEl.append(webflow.elementPresets.DOM);
    text.setTag('span');
    text.setStyles([crPerkText]);
    text.setTextContent(perkText);
  }

  // Right: form
  const formCol = applyGrid.append(webflow.elementPresets.DOM);
  formCol.setTag('div');
  formCol.setStyles([crFormCol]);
  formCol.setAttribute('class', 'cr-form');

  buildCleanForm(formCol, FORM_FIELDS, s, 'Submit Application');

  await safeCall('append:apply', () => body.append(applySection));
  logDetail('Section 3: Application Form appended', 'ok');

  // ──────────────────────────────────────────────
  // SECTION 4: STATS
  // ──────────────────────────────────────────────
  log('Building Section 4: Stats...');
  const statsSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  statsSection.setTag('section');
  statsSection.setStyles([crStats]);
  statsSection.setAttribute('id', 'cr-stats');

  const statsGrid = statsSection.append(webflow.elementPresets.DOM);
  statsGrid.setTag('div');
  statsGrid.setStyles([crStatsGrid]);

  for (const stat of STATS) {
    const item = statsGrid.append(webflow.elementPresets.DOM);
    item.setTag('div');
    item.setAttribute('class', 'cr-stat-item');

    const val = item.append(webflow.elementPresets.DOM);
    val.setTag('div');
    val.setStyles([crStatValue]);
    val.setAttribute('class', 'cr-stat-value');
    val.setAttribute('data-value', stat.value);
    val.setAttribute('data-suffix', stat.suffix);
    val.setTextContent(stat.value + stat.suffix);

    const lbl = item.append(webflow.elementPresets.DOM);
    lbl.setTag('div');
    lbl.setStyles([crStatLabel]);
    lbl.setTextContent(stat.label);
  }

  await safeCall('append:stats', () => body.append(statsSection));
  logDetail('Section 4: Stats appended', 'ok');

  // ──────────────────────────────────────────────
  // SECTION 5: CTA (shared builder)
  // ──────────────────────────────────────────────
  log('Building Section 5: CTA...');
  await buildCTASection(
    body, v,
    'Ready to build something extraordinary?',
    'Call (714) 900-3676', 'tel:7149003676',
    'Contact Us', '/contact',
  );

  // ═══════════════ APPLY STYLES ═══════════════
  await applyStyleProperties();

  log('Careers page built!', 'success');
  await webflow.notify({ type: 'Success', message: 'Careers page created!' });
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
  try { await buildCareersPage(); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
