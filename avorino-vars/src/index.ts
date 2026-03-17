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
} from './shared.js';

// ── Page config ──
const PAGE_NAME = 'Contact';
const PAGE_SLUG = 'contact';
const PAGE_TITLE = 'Contact Avorino — Orange County Construction & ADU Builders';
const PAGE_DESC = 'Get in touch with Avorino Construction. Call (714) 900-3676 or fill out our contact form. Serving all 37 cities in Orange County.';
const CDN = 'd507750';
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
const FORM_FIELDS = [
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

// Google Maps embed URL
const MAP_URL = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d212828.43785693522!2d-118.0064652!3d33.7174708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dcdd0e689140e3%3A0xa77ab575604a9a39!2sOrange%20County%2C%20CA!5e0!3m2!1sen!2sus!4v1';

// ── Build function ──
async function buildContactPage() {
  clearErrorLog();
  logDetail('Starting Contact page build (v4 rework)...', 'info');
  const v = await getAvorinVars();
  logDetail('Loaded Avorino variable collection', 'ok');

  log('Creating shared styles...');
  const s = await createSharedStyles();

  // ── Page-specific styles (minimal — CSS is in avorino-contact.css) ──
  log('Creating contact-specific styles...');
  // We only need styles for elements that use Webflow Designer API classes
  // Most visual styling comes from avorino-contact.css via className attributes

  // ── Create page ──
  const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);

  // ═══════════════ BUILD ELEMENTS ═══════════════

  // ──────────────────────────────────────────────
  // SECTION 1: SPLIT HERO
  // Left: dark bg + Three.js canvas + heading + contact info
  // Right: cream bg + contact form
  // ──────────────────────────────────────────────
  log('Building Section 1: Split Hero...');
  const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
  hero.setTag('section');
  hero.setAttribute('class', 'ct-hero');
  hero.setAttribute('id', 'ct-hero');

  // ── Left side: 3D canvas + content ──
  const heroLeft = hero.append(webflow.elementPresets.DOM);
  heroLeft.setTag('div');
  heroLeft.setAttribute('class', 'ct-hero-left');

  // Canvas container (Three.js renders here via footer JS)
  const canvasWrap = heroLeft.append(webflow.elementPresets.DOM);
  canvasWrap.setTag('div');
  canvasWrap.setAttribute('class', 'ct-canvas-wrap');
  canvasWrap.setAttribute('id', 'ct-canvas');

  // Content overlay
  const heroContent = heroLeft.append(webflow.elementPresets.DOM);
  heroContent.setTag('div');
  heroContent.setAttribute('class', 'ct-hero-content');

  // Label
  const heroLabel = heroContent.append(webflow.elementPresets.DOM);
  heroLabel.setTag('div');
  heroLabel.setAttribute('class', 'ct-hero-label');
  heroLabel.setTextContent('// Contact');

  // Heading
  const heroH = heroContent.append(webflow.elementPresets.DOM);
  heroH.setTag('h1');
  heroH.setAttribute('class', 'ct-hero-heading');
  heroH.setTextContent("Let's build something extraordinary");

  // Subtitle
  const heroSub = heroContent.append(webflow.elementPresets.DOM);
  heroSub.setTag('p');
  heroSub.setAttribute('class', 'ct-hero-sub');
  heroSub.setTextContent("Your vision, our expertise. Start your Orange County construction project with a conversation.");

  // Contact row (phone + email)
  const contactRow = heroContent.append(webflow.elementPresets.DOM);
  contactRow.setTag('div');
  contactRow.setAttribute('class', 'ct-contact-row');

  // Phone
  const phoneItem = contactRow.append(webflow.elementPresets.DOM);
  phoneItem.setTag('div');
  phoneItem.setAttribute('class', 'ct-contact-item');

  const phoneLabel = phoneItem.append(webflow.elementPresets.DOM);
  phoneLabel.setTag('div');
  phoneLabel.setAttribute('class', 'ct-contact-label');
  phoneLabel.setTextContent('Phone');

  const phoneVal = phoneItem.append(webflow.elementPresets.DOM);
  phoneVal.setTag('div');
  phoneVal.setAttribute('class', 'ct-contact-value');

  const phoneLink = phoneVal.append(webflow.elementPresets.DOM);
  phoneLink.setTag('a');
  phoneLink.setAttribute('href', 'tel:7149003676');
  phoneLink.setTextContent('(714) 900-3676');

  // Email
  const emailItem = contactRow.append(webflow.elementPresets.DOM);
  emailItem.setTag('div');
  emailItem.setAttribute('class', 'ct-contact-item');

  const emailLabel = emailItem.append(webflow.elementPresets.DOM);
  emailLabel.setTag('div');
  emailLabel.setAttribute('class', 'ct-contact-label');
  emailLabel.setTextContent('Email');

  const emailVal = emailItem.append(webflow.elementPresets.DOM);
  emailVal.setTag('div');
  emailVal.setAttribute('class', 'ct-contact-value');

  const emailLink = emailVal.append(webflow.elementPresets.DOM);
  emailLink.setTag('a');
  emailLink.setAttribute('href', 'mailto:construction@avorino.com');
  emailLink.setTextContent('construction@avorino.com');

  // ── Right side: Form ──
  const heroRight = hero.append(webflow.elementPresets.DOM);
  heroRight.setTag('div');
  heroRight.setAttribute('class', 'ct-hero-right');

  const formHeading = heroRight.append(webflow.elementPresets.DOM);
  formHeading.setTag('h2');
  formHeading.setAttribute('class', 'ct-form-heading');
  formHeading.setTextContent('Start your project');

  const formSub = heroRight.append(webflow.elementPresets.DOM);
  formSub.setTag('p');
  formSub.setAttribute('class', 'ct-form-sub');
  formSub.setTextContent("Fill out the form and we'll respond within 24 hours.");

  // Form container (div, not form — Webflow auto-injects on <form>)
  const formWrap = heroRight.append(webflow.elementPresets.DOM);
  formWrap.setTag('div');
  formWrap.setAttribute('class', 'ct-form');

  // Helper: build a single field inside a parent
  function buildField(parent: any, field: typeof FORM_FIELDS[number]) {
    const group = parent.append(webflow.elementPresets.DOM);
    group.setTag('div');
    group.setAttribute('class', 'ct-form-group');

    const label = group.append(webflow.elementPresets.DOM);
    label.setTag('label');
    label.setAttribute('class', 'ct-form-label');
    label.setTextContent(field.label);

    if (field.type === 'textarea') {
      const ta = group.append(webflow.elementPresets.DOM);
      ta.setTag('textarea');
      ta.setAttribute('class', 'ct-form-textarea');
      ta.setAttribute('name', field.name);
      if (field.placeholder) ta.setAttribute('placeholder', field.placeholder);
      ta.setAttribute('rows', '3');
    } else if (field.type === 'select') {
      const sel = group.append(webflow.elementPresets.DOM);
      sel.setTag('select');
      sel.setAttribute('class', 'ct-form-select');
      sel.setAttribute('name', field.name);
      const opt0 = sel.append(webflow.elementPresets.DOM);
      opt0.setTag('option');
      opt0.setTextContent('Select a service');
      opt0.setAttribute('value', '');
      opt0.setAttribute('disabled', '');
      opt0.setAttribute('selected', '');
      for (const optVal of (field.options || [])) {
        const opt = sel.append(webflow.elementPresets.DOM);
        opt.setTag('option');
        opt.setTextContent(optVal);
        opt.setAttribute('value', optVal);
      }
    } else {
      const input = group.append(webflow.elementPresets.DOM);
      input.setTag('input');
      input.setAttribute('class', 'ct-form-input');
      input.setAttribute('type', field.type);
      input.setAttribute('name', field.name);
      if (field.placeholder) input.setAttribute('placeholder', field.placeholder);
    }
  }

  // Build fields in order, pairing halfWidth fields into rows
  let i = 0;
  const fields = [...FORM_FIELDS];
  while (i < fields.length) {
    const field = fields[i];
    const next = fields[i + 1];

    if (field.halfWidth && next?.halfWidth) {
      // Two half-width fields → side-by-side row
      const row = formWrap.append(webflow.elementPresets.DOM);
      row.setTag('div');
      row.setAttribute('class', 'ct-form-row');
      buildField(row, field);
      buildField(row, next);
      i += 2;
    } else {
      // Full-width field
      buildField(formWrap, field);
      i += 1;
    }
  }

  // Submit button
  const submitBtn = formWrap.append(webflow.elementPresets.DOM);
  submitBtn.setTag('button');
  submitBtn.setAttribute('class', 'ct-form-submit');
  submitBtn.setAttribute('type', 'submit');
  submitBtn.setTextContent('Send Message');

  await safeCall('append:hero', () => body.append(hero));
  logDetail('Section 1: Split Hero appended', 'ok');

  // ──────────────────────────────────────────────
  // SECTION 2: TRUST SIGNALS
  // ──────────────────────────────────────────────
  log('Building Section 2: Trust Signals...');
  const trust = webflow.elementBuilder(webflow.elementPresets.DOM);
  trust.setTag('section');
  trust.setAttribute('class', 'ct-trust');
  trust.setAttribute('id', 'ct-trust');

  const trustGrid = trust.append(webflow.elementPresets.DOM);
  trustGrid.setTag('div');
  trustGrid.setAttribute('class', 'ct-trust-grid');

  for (const stat of TRUST_STATS) {
    const item = trustGrid.append(webflow.elementPresets.DOM);
    item.setTag('div');
    item.setAttribute('class', 'ct-trust-item');
    item.setAttribute('data-animate', 'fade-up');

    const val = item.append(webflow.elementPresets.DOM);
    val.setTag('div');
    val.setAttribute('class', 'ct-trust-value');
    val.setAttribute('data-value', stat.value);
    val.setAttribute('data-suffix', stat.suffix);
    val.setTextContent(stat.value + stat.suffix);

    const lbl = item.append(webflow.elementPresets.DOM);
    lbl.setTag('div');
    lbl.setAttribute('class', 'ct-trust-label');
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
  location.setAttribute('class', 'ct-location');
  location.setAttribute('id', 'ct-location');

  // Header
  const locHeader = location.append(webflow.elementPresets.DOM);
  locHeader.setTag('div');
  locHeader.setAttribute('class', 'ct-location-header');

  const locLabel = locHeader.append(webflow.elementPresets.DOM);
  locLabel.setTag('div');
  locLabel.setAttribute('class', 'ct-location-label');
  locLabel.setTextContent('// Our Location');

  const locH = locHeader.append(webflow.elementPresets.DOM);
  locH.setTag('h2');
  locH.setAttribute('class', 'ct-location-heading');
  locH.setTextContent('Serving all of Orange County');
  locH.setAttribute('data-animate', 'blur-focus');

  // Grid
  const locGrid = location.append(webflow.elementPresets.DOM);
  locGrid.setTag('div');
  locGrid.setAttribute('class', 'ct-location-grid');

  // Map iframe wrapper
  const mapWrap = locGrid.append(webflow.elementPresets.DOM);
  mapWrap.setTag('div');
  mapWrap.setAttribute('class', 'ct-map-wrapper');
  mapWrap.setAttribute('data-animate', 'fade-up');

  const mapFrame = mapWrap.append(webflow.elementPresets.DOM);
  mapFrame.setTag('iframe');
  mapFrame.setAttribute('src', MAP_URL);
  mapFrame.setAttribute('loading', 'lazy');
  mapFrame.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
  mapFrame.setAttribute('title', 'Avorino service area — Orange County, CA');

  // Office info column
  const officeInfo = locGrid.append(webflow.elementPresets.DOM);
  officeInfo.setTag('div');
  officeInfo.setAttribute('class', 'ct-office-info');

  for (let i = 0; i < OFFICE_INFO.length; i++) {
    const info = OFFICE_INFO[i];

    if (i > 0) {
      const divider = officeInfo.append(webflow.elementPresets.DOM);
      divider.setTag('div');
      divider.setAttribute('class', 'ct-office-divider');
    }

    const block = officeInfo.append(webflow.elementPresets.DOM);
    block.setTag('div');
    block.setAttribute('class', 'ct-office-block');

    const lbl = block.append(webflow.elementPresets.DOM);
    lbl.setTag('div');
    lbl.setAttribute('class', 'ct-office-label');
    lbl.setTextContent(info.label);

    const val = block.append(webflow.elementPresets.DOM);
    val.setTag('div');
    val.setAttribute('class', 'ct-office-value');
    val.setTextContent(info.lines.join('\n'));
  }

  await safeCall('append:location', () => body.append(location));
  logDetail('Section 3: Map + Office Info appended', 'ok');

  // ──────────────────────────────────────────────
  // SECTION 4: CTA (uses shared builder — matches all other pages)
  // ──────────────────────────────────────────────
  log('Building Section 4: CTA...');
  await buildCTASection(
    body, v,
    'Ready to start building?',
    'Call (714) 900-3676', 'tel:7149003676',
    'Fill Out the Form', '#ct-hero',
  );

  // ═══════════════ APPLY STYLES ═══════════════
  log('Setting shared style properties...');
  await setSharedStyleProps(s, v);
  await wait(1000);
  await applyCTAStyleProps(v);

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
