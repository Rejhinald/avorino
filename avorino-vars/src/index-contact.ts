// ════════════════════════════════════════════════════════════════
// Avorino Builder — CONTACT PAGE (v4 complete rework)
// Split hero (dark 3D left + cream form right), trust signals,
// map + office info, CTA — no Calendly
// All animations via CDN: avorino-contact-footer.js
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
const PAGE_NAME = 'Contact';
const PAGE_SLUG = 'contact';
const PAGE_TITLE = 'Contact Avorino — Orange County Construction & ADU Builders';
const PAGE_DESC = 'Get in touch with Avorino Construction. Call (714) 900-3676 or fill out our contact form. Serving all 37 cities in Orange County.';
const CDN = '428c0e0';
const HEAD_CODE = [
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-responsive.css">`,
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-nav-footer.css">`,
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-contact.css">`,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>',
  `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-animations.js"><\/script>`,
  `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-contact-footer.js"><\/script>`,
].join('\n');

// ── Update panel UI ──
document.getElementById('page-name')!.textContent = PAGE_NAME;
const headCodeEl = document.getElementById('head-code');
const footerCodeEl = document.getElementById('footer-code');
if (headCodeEl) headCodeEl.textContent = HEAD_CODE;
if (footerCodeEl) footerCodeEl.textContent = FOOTER_CODE;

// ── Form fields config ──
const FORM_FIELDS: FormField[] = [
  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'you@email.com', halfWidth: true },
  { name: 'phone', label: 'Phone', type: 'tel', placeholder: '(000) 000-0000', halfWidth: true },
  { name: 'address', label: 'Property Address', type: 'text', placeholder: 'Street address, City, CA' },
  { name: 'service', label: 'Service Type', type: 'select', options: ['ADU', 'Custom Home', 'Renovation', 'Addition', 'Garage Conversion', 'Commercial', 'Other'] },
  { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Tell us about your project' },
];

// Trust signal data
const TRUST_STATS = [
  { value: '4.8', suffix: '', label: 'Yelp Rating' },
  { value: '35', suffix: '+', label: '5-Star Reviews' },
  { value: '10', suffix: '+', label: 'Years in OC' },
  { value: '37', suffix: '', label: 'Cities Served' },
];

// Office info data
const OFFICE_INFO = [
  { label: 'Headquarters', lines: ['Irvine, California', 'Orange County'] },
  { label: 'Business Hours', lines: ['Mon — Fri  8:00 AM – 6:00 PM', 'Sat  By appointment', 'Sun  Closed'] },
  { label: 'License', lines: ['General-B #1107538', 'State of California'] },
  { label: 'Direct Contact', lines: ['(714) 900-3676', 'construction@avorino.com'] },
];

const MAP_URL = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d212828.43785693522!2d-118.0064652!3d33.7174708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dcdd0e689140e3%3A0xa77ab575604a9a39!2sOrange%20County%2C%20CA!5e0!3m2!1sen!2sus!4v1';

// ── Build function ──
async function buildContactPage() {
  clearErrorLog();
  logDetail('Starting Contact page build (v4 rework)...', 'info');
  const v = await getAvorinVars();
  logDetail('Loaded Avorino variable collection', 'ok');

  log('Creating shared styles...');
  const s = await createSharedStyles();

  // ── Page-specific styles (all via Webflow Designer API) ──
  log('Creating contact-specific styles...');

  // Hero section
  const ctHeroSection = await getOrCreateStyle('ct-hero');
  const ctHeroLeft = await getOrCreateStyle('ct-hero-left');
  const ctCanvasWrap = await getOrCreateStyle('ct-canvas-wrap');
  const ctHeroContent = await getOrCreateStyle('ct-hero-content');
  const ctHeroLabel = await getOrCreateStyle('ct-hero-label');
  const ctHeroHeading = await getOrCreateStyle('ct-hero-heading');
  const ctHeroSub = await getOrCreateStyle('ct-hero-sub');
  const ctContactRow = await getOrCreateStyle('ct-contact-row');
  const ctContactLabel = await getOrCreateStyle('ct-contact-label');
  const ctContactValue = await getOrCreateStyle('ct-contact-value');
  const ctHeroRight = await getOrCreateStyle('ct-hero-right');
  const ctFormHeading = await getOrCreateStyle('ct-form-heading');
  const ctFormSub = await getOrCreateStyle('ct-form-sub');
  const ctFormCol = await getOrCreateStyle('ct-form-col');

  // Trust section
  const ctTrust = await getOrCreateStyle('ct-trust');
  const ctTrustGrid = await getOrCreateStyle('ct-trust-grid');
  const ctTrustItem = await getOrCreateStyle('ct-trust-item');
  const ctTrustValue = await getOrCreateStyle('ct-trust-value');
  const ctTrustLabel = await getOrCreateStyle('ct-trust-label');

  // Location section
  const ctLocation = await getOrCreateStyle('ct-location');
  const ctLocHeader = await getOrCreateStyle('ct-loc-header');
  const ctLocLabel = await getOrCreateStyle('ct-loc-label');
  const ctLocHeading = await getOrCreateStyle('ct-loc-heading');
  const ctLocGrid = await getOrCreateStyle('ct-loc-grid');
  const ctMapWrap = await getOrCreateStyle('ct-map-wrap');
  const ctOfficeInfo = await getOrCreateStyle('ct-office-info');
  const ctOfficeBlock = await getOrCreateStyle('ct-office-block');
  const ctOfficeLabel = await getOrCreateStyle('ct-office-label');
  const ctOfficeValue = await getOrCreateStyle('ct-office-value');
  const ctOfficeDivider = await getOrCreateStyle('ct-office-divider');

  // ── Create page ──
  const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);

  // ── Style properties ──
  async function applyStyleProperties() {
    log('Setting shared style properties...');
    await setSharedStyleProps(s, v);
    await wait(1000);

    log('Setting contact-specific style properties...');

    // ── HERO SECTION ──
    await clearAndSet(await freshStyle('ct-hero'), 'ct-hero', {
      'min-height': '100vh',
      'display': 'grid',
      'grid-template-columns': '1fr 1fr',
      'position': 'relative',
      'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('ct-hero-left'), 'ct-hero-left', {
      'position': 'relative',
      'display': 'flex', 'flex-direction': 'column', 'justify-content': 'flex-end',
      'padding-top': '160px', 'padding-bottom': '80px',
      'padding-left': '64px', 'padding-right': '64px',
      'background-color': v['av-dark'],
      'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('ct-canvas-wrap'), 'ct-canvas-wrap', {
      'position': 'absolute', 'top': '0px', 'left': '0px',
      'width': '100%', 'height': '100%',
      'z-index': '0', 'pointer-events': 'none',
      'opacity': '0.6',
    });
    await clearAndSet(await freshStyle('ct-hero-content'), 'ct-hero-content', {
      'position': 'relative', 'z-index': '2',
    });
    await clearAndSet(await freshStyle('ct-hero-label'), 'ct-hero-label', {
      'font-family': 'DM Sans', 'font-size': '12px', 'font-weight': '500',
      'letter-spacing': '0.3em', 'text-transform': 'uppercase',
      'color': v['av-cream'], 'opacity': '0.4',
      'margin-bottom': '20px',
    });
    await clearAndSet(await freshStyle('ct-hero-heading'), 'ct-hero-heading', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h1'],
      'font-weight': '400', 'line-height': '1.08', 'letter-spacing': '-0.02em',
      'color': v['av-cream'], 'margin-bottom': '20px',
    });
    await clearAndSet(await freshStyle('ct-hero-sub'), 'ct-hero-sub', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.8', 'color': v['av-cream'], 'opacity': '0.55',
      'max-width': '440px',
    });
    await clearAndSet(await freshStyle('ct-contact-row'), 'ct-contact-row', {
      'display': 'flex', 'grid-column-gap': '40px',
      'margin-top': '32px', 'padding-top': '32px',
      'border-top-width': '1px', 'border-top-style': 'solid', 'border-top-color': 'rgba(240,237,232,0.08)',
    });
    await clearAndSet(await freshStyle('ct-contact-label'), 'ct-contact-label', {
      'font-family': 'DM Sans', 'font-size': '11px', 'font-weight': '500',
      'letter-spacing': '0.25em', 'text-transform': 'uppercase',
      'color': v['av-cream'], 'opacity': '0.3',
      'margin-bottom': '6px',
    });
    await clearAndSet(await freshStyle('ct-contact-value'), 'ct-contact-value', {
      'font-family': 'DM Serif Display', 'font-size': '20px',
      'color': v['av-cream'], 'font-weight': '400',
    });
    await wait(500);

    // ── RIGHT SIDE: FORM ──
    await clearAndSet(await freshStyle('ct-hero-right'), 'ct-hero-right', {
      'background-color': v['av-cream'],
      'display': 'flex', 'flex-direction': 'column', 'justify-content': 'center',
      'padding-top': '160px', 'padding-bottom': '80px',
      'padding-left': '64px', 'padding-right': '64px',
    });
    await clearAndSet(await freshStyle('ct-form-heading'), 'ct-form-heading', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h2'],
      'font-weight': '400', 'line-height': '1.15', 'letter-spacing': '-0.02em',
      'color': v['av-dark'], 'margin-bottom': '8px',
    });
    await clearAndSet(await freshStyle('ct-form-sub'), 'ct-form-sub', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.7', 'color': v['av-dark'], 'opacity': '0.5',
      'margin-bottom': '40px',
    });
    await clearAndSet(await freshStyle('ct-form-col'), 'ct-form-col', {
      'display': 'flex', 'flex-direction': 'column',
    });
    await wait(500);

    // ── TRUST SECTION ──
    await clearAndSet(await freshStyle('ct-trust'), 'ct-trust', {
      'background-color': v['av-dark'],
      'padding-top': '80px', 'padding-bottom': '80px',
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'border-top-width': '1px', 'border-top-style': 'solid', 'border-top-color': 'rgba(240,237,232,0.06)',
    });
    await clearAndSet(await freshStyle('ct-trust-grid'), 'ct-trust-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr 1fr',
      'grid-column-gap': '48px', 'grid-row-gap': '48px',
      'max-width': '1200px', 'margin-left': 'auto', 'margin-right': 'auto',
    });
    await clearAndSet(await freshStyle('ct-trust-item'), 'ct-trust-item', {
      'text-align': 'center',
      'padding-top': '40px', 'padding-bottom': '40px',
      'padding-left': '24px', 'padding-right': '24px',
      'border-top-left-radius': '8px', 'border-top-right-radius': '8px',
      'border-bottom-left-radius': '8px', 'border-bottom-right-radius': '8px',
      'background-color': 'rgba(240,237,232,0.02)',
      'border-width': '1px', 'border-style': 'solid', 'border-color': 'rgba(240,237,232,0.04)',
    });
    await clearAndSet(await freshStyle('ct-trust-value'), 'ct-trust-value', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h2'],
      'font-weight': '400', 'color': v['av-cream'],
      'line-height': '1', 'margin-bottom': '12px',
    });
    await clearAndSet(await freshStyle('ct-trust-label'), 'ct-trust-label', {
      'font-family': 'DM Sans', 'font-size': '12px', 'font-weight': '500',
      'letter-spacing': '0.2em', 'text-transform': 'uppercase',
      'color': v['av-cream'], 'opacity': '0.35',
    });
    await wait(500);

    // ── LOCATION SECTION ──
    await clearAndSet(await freshStyle('ct-location'), 'ct-location', {
      'background-color': '#0d0d0d',
      'padding-top': v['av-section-pad-y'], 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
    });
    await clearAndSet(await freshStyle('ct-loc-header'), 'ct-loc-header', {
      'text-align': 'center', 'margin-bottom': '72px',
    });
    await clearAndSet(await freshStyle('ct-loc-label'), 'ct-loc-label', {
      'font-family': 'DM Sans', 'font-size': '12px', 'font-weight': '500',
      'letter-spacing': '0.3em', 'text-transform': 'uppercase',
      'color': v['av-cream'], 'opacity': '0.35',
      'margin-bottom': '16px',
    });
    await clearAndSet(await freshStyle('ct-loc-heading'), 'ct-loc-heading', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h2'],
      'font-weight': '400', 'line-height': '1.1',
      'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('ct-loc-grid'), 'ct-loc-grid', {
      'display': 'grid', 'grid-template-columns': '1.4fr 1fr',
      'grid-column-gap': '64px', 'grid-row-gap': '64px',
      'max-width': '1200px', 'margin-left': 'auto', 'margin-right': 'auto',
    });
    await clearAndSet(await freshStyle('ct-map-wrap'), 'ct-map-wrap', {
      'border-top-left-radius': '12px', 'border-top-right-radius': '12px',
      'border-bottom-left-radius': '12px', 'border-bottom-right-radius': '12px',
      'overflow-x': 'hidden', 'overflow-y': 'hidden',
      'background-color': '#1a1a1a',
      'min-height': '400px',
    });
    await clearAndSet(await freshStyle('ct-office-info'), 'ct-office-info', {
      'display': 'flex', 'flex-direction': 'column', 'justify-content': 'center',
      'grid-row-gap': '36px',
    });
    await clearAndSet(await freshStyle('ct-office-label'), 'ct-office-label', {
      'font-family': 'DM Sans', 'font-size': '11px', 'font-weight': '600',
      'letter-spacing': '0.25em', 'text-transform': 'uppercase',
      'color': v['av-cream'], 'opacity': '0.3',
      'margin-bottom': '12px',
    });
    await clearAndSet(await freshStyle('ct-office-value'), 'ct-office-value', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.8', 'color': v['av-cream'], 'opacity': '0.7',
    });
    await clearAndSet(await freshStyle('ct-office-divider'), 'ct-office-divider', {
      'width': '100%', 'height': '1px',
      'background-color': 'rgba(240,237,232,0.08)',
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
  hero.setStyles([ctHeroSection]);
  hero.setAttribute('id', 'ct-hero');

  // ── Left side: 3D canvas + content ──
  const heroLeft = hero.append(webflow.elementPresets.DOM);
  heroLeft.setTag('div');
  heroLeft.setStyles([ctHeroLeft]);
  heroLeft.setAttribute('class', 'ct-hero-left');

  // Canvas container (Three.js renders here via footer JS)
  const canvasWrap = heroLeft.append(webflow.elementPresets.DOM);
  canvasWrap.setTag('div');
  canvasWrap.setStyles([ctCanvasWrap]);
  canvasWrap.setAttribute('id', 'ct-canvas');
  canvasWrap.setAttribute('class', 'ct-canvas-wrap');

  // Content overlay
  const heroContent = heroLeft.append(webflow.elementPresets.DOM);
  heroContent.setTag('div');
  heroContent.setStyles([ctHeroContent]);

  // Label
  const heroLabel = heroContent.append(webflow.elementPresets.DOM);
  heroLabel.setTag('div');
  heroLabel.setStyles([ctHeroLabel]);
  heroLabel.setTextContent('// Contact');
  heroLabel.setAttribute('class', 'ct-hero-label');

  // Heading
  const heroH = heroContent.append(webflow.elementPresets.DOM);
  heroH.setTag('h1');
  heroH.setStyles([ctHeroHeading]);
  heroH.setTextContent("Let's build something extraordinary");
  heroH.setAttribute('class', 'ct-hero-heading');

  // Subtitle
  const heroSub = heroContent.append(webflow.elementPresets.DOM);
  heroSub.setTag('p');
  heroSub.setStyles([ctHeroSub]);
  heroSub.setTextContent('Your vision, our expertise. Start your Orange County construction project with a conversation.');
  heroSub.setAttribute('class', 'ct-hero-sub');

  // Contact row (phone + email)
  const contactRow = heroContent.append(webflow.elementPresets.DOM);
  contactRow.setTag('div');
  contactRow.setStyles([ctContactRow]);
  contactRow.setAttribute('class', 'ct-contact-row');

  // Phone
  const phoneItem = contactRow.append(webflow.elementPresets.DOM);
  phoneItem.setTag('div');

  const phoneLabel = phoneItem.append(webflow.elementPresets.DOM);
  phoneLabel.setTag('div');
  phoneLabel.setStyles([ctContactLabel]);
  phoneLabel.setTextContent('Phone');

  const phoneVal = phoneItem.append(webflow.elementPresets.DOM);
  phoneVal.setTag('a');
  phoneVal.setStyles([ctContactValue]);
  phoneVal.setAttribute('href', 'tel:7149003676');
  phoneVal.setTextContent('(714) 900-3676');

  // Email
  const emailItem = contactRow.append(webflow.elementPresets.DOM);
  emailItem.setTag('div');

  const emailLabel = emailItem.append(webflow.elementPresets.DOM);
  emailLabel.setTag('div');
  emailLabel.setStyles([ctContactLabel]);
  emailLabel.setTextContent('Email');

  const emailVal = emailItem.append(webflow.elementPresets.DOM);
  emailVal.setTag('a');
  emailVal.setStyles([ctContactValue]);
  emailVal.setAttribute('href', 'mailto:construction@avorino.com');
  emailVal.setTextContent('construction@avorino.com');

  // ── Right side: Form ──
  const heroRight = hero.append(webflow.elementPresets.DOM);
  heroRight.setTag('div');
  heroRight.setStyles([ctHeroRight]);
  heroRight.setAttribute('class', 'ct-hero-right');

  const formHeading = heroRight.append(webflow.elementPresets.DOM);
  formHeading.setTag('h2');
  formHeading.setStyles([ctFormHeading]);
  formHeading.setTextContent('Start your project');

  const formSub = heroRight.append(webflow.elementPresets.DOM);
  formSub.setTag('p');
  formSub.setStyles([ctFormSub]);
  formSub.setTextContent("Fill out the form and we'll respond within 24 hours.");

  // Form — uses shared buildCleanForm (div-based, not <form>)
  const formCol = heroRight.append(webflow.elementPresets.DOM);
  formCol.setTag('div');
  formCol.setStyles([ctFormCol]);
  formCol.setAttribute('class', 'ct-form');

  buildCleanForm(formCol, FORM_FIELDS, s, 'Send Message');

  await safeCall('append:hero', () => body.append(hero));
  logDetail('Section 1: Split Hero appended', 'ok');

  // ──────────────────────────────────────────────
  // SECTION 2: TRUST SIGNALS
  // ──────────────────────────────────────────────
  log('Building Section 2: Trust Signals...');
  const trust = webflow.elementBuilder(webflow.elementPresets.DOM);
  trust.setTag('section');
  trust.setStyles([ctTrust]);
  trust.setAttribute('id', 'ct-trust');

  const trustGrid = trust.append(webflow.elementPresets.DOM);
  trustGrid.setTag('div');
  trustGrid.setStyles([ctTrustGrid]);

  for (const stat of TRUST_STATS) {
    const item = trustGrid.append(webflow.elementPresets.DOM);
    item.setTag('div');
    item.setStyles([ctTrustItem]);
    item.setAttribute('class', 'ct-trust-item');
    item.setAttribute('data-animate', 'fade-up');

    const val = item.append(webflow.elementPresets.DOM);
    val.setTag('div');
    val.setStyles([ctTrustValue]);
    val.setAttribute('class', 'ct-trust-value');
    val.setAttribute('data-value', stat.value);
    val.setAttribute('data-suffix', stat.suffix);
    val.setTextContent(stat.value + stat.suffix);

    const lbl = item.append(webflow.elementPresets.DOM);
    lbl.setTag('div');
    lbl.setStyles([ctTrustLabel]);
    lbl.setTextContent(stat.label);
  }

  await safeCall('append:trust', () => body.append(trust));
  logDetail('Section 2: Trust Signals appended', 'ok');

  // ──────────────────────────────────────────────
  // SECTION 3: MAP + OFFICE INFO
  // ──────────────────────────────────────────────
  log('Building Section 3: Map + Office Info...');
  const location = webflow.elementBuilder(webflow.elementPresets.DOM);
  location.setTag('section');
  location.setStyles([ctLocation]);
  location.setAttribute('id', 'ct-location');

  // Header
  const locHeader = location.append(webflow.elementPresets.DOM);
  locHeader.setTag('div');
  locHeader.setStyles([ctLocHeader]);

  const locLabel = locHeader.append(webflow.elementPresets.DOM);
  locLabel.setTag('div');
  locLabel.setStyles([ctLocLabel]);
  locLabel.setTextContent('// Our Location');
  locLabel.setAttribute('class', 'ct-location-label');

  const locH = locHeader.append(webflow.elementPresets.DOM);
  locH.setTag('h2');
  locH.setStyles([ctLocHeading]);
  locH.setTextContent('Serving all of Orange County');
  locH.setAttribute('data-animate', 'blur-focus');
  locH.setAttribute('class', 'ct-location-heading');

  // Grid
  const locGrid = location.append(webflow.elementPresets.DOM);
  locGrid.setTag('div');
  locGrid.setStyles([ctLocGrid]);

  // Map iframe wrapper
  const mapWrap = locGrid.append(webflow.elementPresets.DOM);
  mapWrap.setTag('div');
  mapWrap.setStyles([ctMapWrap]);
  mapWrap.setAttribute('class', 'ct-map-wrapper');
  mapWrap.setAttribute('data-animate', 'fade-up');

  // Iframe as DOM element
  const mapFrame = mapWrap.append(webflow.elementPresets.DOM);
  mapFrame.setTag('iframe');
  mapFrame.setAttribute('src', MAP_URL);
  mapFrame.setAttribute('loading', 'lazy');
  mapFrame.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
  mapFrame.setAttribute('title', 'Avorino service area — Orange County, CA');
  mapFrame.setAttribute('style', 'width:100%;height:100%;min-height:400px;border:0;filter:grayscale(1) invert(1) contrast(0.9) brightness(0.6);');

  // Office info column
  const officeInfo = locGrid.append(webflow.elementPresets.DOM);
  officeInfo.setTag('div');
  officeInfo.setStyles([ctOfficeInfo]);
  officeInfo.setAttribute('class', 'ct-office-info');

  for (let i = 0; i < OFFICE_INFO.length; i++) {
    const info = OFFICE_INFO[i];

    if (i > 0) {
      const divider = officeInfo.append(webflow.elementPresets.DOM);
      divider.setTag('div');
      divider.setStyles([ctOfficeDivider]);
    }

    const block = officeInfo.append(webflow.elementPresets.DOM);
    block.setTag('div');
    block.setAttribute('class', 'ct-office-block');

    const lbl = block.append(webflow.elementPresets.DOM);
    lbl.setTag('div');
    lbl.setStyles([ctOfficeLabel]);
    lbl.setTextContent(info.label);

    // Each line as its own div for proper line breaks
    for (const line of info.lines) {
      const lineEl = block.append(webflow.elementPresets.DOM);
      lineEl.setTag('div');
      lineEl.setStyles([ctOfficeValue]);
      lineEl.setTextContent(line);
    }
  }

  await safeCall('append:location', () => body.append(location));
  logDetail('Section 3: Map + Office Info appended', 'ok');

  // ──────────────────────────────────────────────
  // SECTION 4: CTA (shared builder — matches all other pages)
  // ──────────────────────────────────────────────
  log('Building Section 4: CTA...');
  await buildCTASection(
    body, v,
    'Ready to start building?',
    'Call (714) 900-3676', 'tel:7149003676',
    'Fill Out the Form', '#ct-hero',
  );

  // ═══════════════ APPLY STYLES ═══════════════
  await applyStyleProperties();

  log('Contact page built!', 'success');
  await webflow.notify({ type: 'Success', message: 'Contact page created!' });
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
  try { await buildContactPage(); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
