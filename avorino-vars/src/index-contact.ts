// ════════════════════════════════════════════════════════════════
// Avorino Builder — CONTACT PAGE
// Rename this to index.ts to build the Contact page.
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
const PAGE_TITLE = 'Contact Avorino — Orange County Construction';
const PAGE_DESC = 'Get in touch with Avorino Construction. Call (714) 900-3676 or fill out our contact form.';
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

// ── Form fields ──
const FORM_FIELDS = [
  { name: 'first-name', label: 'First Name', type: 'text', tag: 'input' },
  { name: 'last-name', label: 'Last Name', type: 'text', tag: 'input' },
  { name: 'email', label: 'Email', type: 'email', tag: 'input' },
  { name: 'phone', label: 'Phone', type: 'tel', tag: 'input' },
  { name: 'address', label: 'Property Address', type: 'text', tag: 'input' },
  { name: 'service', label: 'Service Type', type: 'select', tag: 'select',
    options: ['ADU', 'Custom Home', 'Renovation', 'Addition', 'Garage Conversion', 'Commercial', 'Other'] },
  { name: 'message', label: 'Message', type: 'textarea', tag: 'textarea' },
];

const CONTACT_INFO = [
  { label: 'Phone', value: '(714) 900-3676' },
  { label: 'Email', value: 'construction@avorino.com' },
  { label: 'Location', value: 'Orange County, CA' },
  { label: 'License', value: 'General-B #1107538' },
];

// ── Build function ──
async function buildContactPage() {
  clearErrorLog();
  logDetail('Starting Contact page build...', 'info');
  const v = await getAvorinVars();
  logDetail('Loaded Avorino variable collection', 'ok');

  log('Creating shared styles...');
  const s = await createSharedStyles();

  // ── Page-specific styles ──
  log('Creating page-specific styles...');
  const ctHero = await getOrCreateStyle('ct-hero');
  const ctHeroContent = await getOrCreateStyle('ct-hero-content');
  const ctGrid = await getOrCreateStyle('ct-grid');
  const ctFormWrap = await getOrCreateStyle('ct-form-wrap');
  const ctFormGrid = await getOrCreateStyle('ct-form-grid');
  const ctInput = await getOrCreateStyle('ct-input');
  const ctTextarea = await getOrCreateStyle('ct-textarea');
  const ctSelect = await getOrCreateStyle('ct-select');
  const ctFormLabel = await getOrCreateStyle('ct-form-label');
  const ctSubmitBtn = await getOrCreateStyle('ct-submit-btn');
  const ctInfoCard = await getOrCreateStyle('ct-info-card');
  const ctInfoItem = await getOrCreateStyle('ct-info-item');
  const ctInfoLabel = await getOrCreateStyle('ct-info-label');
  const ctInfoValue = await getOrCreateStyle('ct-info-value');
  const ctMb32 = await getOrCreateStyle('ct-mb-32');
  const ctMb64 = await getOrCreateStyle('ct-mb-64');

  // ── Create page ──
  const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);

  // ── Style properties ──
  async function applyStyleProperties() {
    log('Setting shared style properties...');
    await setSharedStyleProps(s, v);
    await wait(1000);

    log('Setting page-specific style properties...');

    // Hero (minimal, dark)
    await clearAndSet(await freshStyle('ct-hero'), 'ct-hero', {
      'min-height': '40vh', 'display': 'flex', 'align-items': 'flex-end',
      'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('ct-hero-content'), 'ct-hero-content', {
      'position': 'relative', 'z-index': '2', 'max-width': '600px',
    });
    await wait(500);

    // Contact grid (2-col: form left, info right)
    await clearAndSet(await freshStyle('ct-grid'), 'ct-grid', {
      'display': 'grid', 'grid-template-columns': '1.4fr 1fr',
      'grid-column-gap': '96px', 'grid-row-gap': '64px', 'align-items': 'start',
    });
    await wait(500);

    // Form
    await clearAndSet(await freshStyle('ct-form-wrap'), 'ct-form-wrap', {
      'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '24px',
    });
    await clearAndSet(await freshStyle('ct-form-grid'), 'ct-form-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr',
      'grid-column-gap': '16px', 'grid-row-gap': '16px',
    });
    await clearAndSet(await freshStyle('ct-form-label'), 'ct-form-label', {
      'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
      'font-weight': '500', 'margin-bottom': '8px', 'display': 'block',
    });

    const inputProps: Record<string, any> = {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'padding-top': '16px', 'padding-bottom': '16px',
      'padding-left': '20px', 'padding-right': '20px',
      'background-color': v['av-cream'], 'color': v['av-dark'],
      'border-top-width': '1px', 'border-bottom-width': '1px',
      'border-left-width': '1px', 'border-right-width': '1px',
      'border-top-style': 'solid', 'border-bottom-style': 'solid',
      'border-left-style': 'solid', 'border-right-style': 'solid',
      'border-top-color': v['av-dark-10'], 'border-bottom-color': v['av-dark-10'],
      'border-left-color': v['av-dark-10'], 'border-right-color': v['av-dark-10'],
      'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
      'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
      'width': '100%',
    };
    await clearAndSet(await freshStyle('ct-input'), 'ct-input', inputProps);
    await clearAndSet(await freshStyle('ct-select'), 'ct-select', inputProps);
    await clearAndSet(await freshStyle('ct-textarea'), 'ct-textarea', { ...inputProps, 'min-height': '140px' });
    await wait(500);

    // Submit button
    await clearAndSet(await freshStyle('ct-submit-btn'), 'ct-submit-btn', {
      'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
      'font-weight': '500', 'letter-spacing': '0.04em',
      'display': 'inline-flex', 'align-items': 'center', 'justify-content': 'center',
      'color': v['av-cream'], 'background-color': v['av-red'],
      'padding-top': v['av-btn-pad-y'], 'padding-bottom': v['av-btn-pad-y'],
      'padding-left': v['av-btn-pad-x'], 'padding-right': v['av-btn-pad-x'],
      'border-top-left-radius': v['av-radius-pill'], 'border-top-right-radius': v['av-radius-pill'],
      'border-bottom-left-radius': v['av-radius-pill'], 'border-bottom-right-radius': v['av-radius-pill'],
      'border-top-width': '0px', 'border-bottom-width': '0px',
      'border-left-width': '0px', 'border-right-width': '0px',
      'cursor': 'pointer', 'width': '100%',
    });
    await wait(500);

    // Info card
    await clearAndSet(await freshStyle('ct-info-card'), 'ct-info-card', {
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
      'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
      'padding-top': v['av-gap-md'], 'padding-bottom': v['av-gap-md'],
      'padding-left': '48px', 'padding-right': '48px',
      'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '40px',
    });
    await clearAndSet(await freshStyle('ct-info-item'), 'ct-info-item', {
      'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '8px',
    });
    await clearAndSet(await freshStyle('ct-info-label'), 'ct-info-label', {
      'font-family': 'DM Sans', 'font-size': v['av-text-label'],
      'letter-spacing': '0.3em', 'text-transform': 'uppercase', 'opacity': '0.4',
    });
    await clearAndSet(await freshStyle('ct-info-value'), 'ct-info-value', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
      'line-height': '1.2', 'font-weight': '400',
    });
    await wait(500);

    // Utility
    await clearAndSet(await freshStyle('ct-mb-32'), 'ct-mb-32', { 'margin-bottom': v['av-gap-sm'] });
    await clearAndSet(await freshStyle('ct-mb-64'), 'ct-mb-64', { 'margin-bottom': v['av-gap-md'] });

    await applyCTAStyleProps(v);
  }

  // ═══════════════ BUILD ELEMENTS ═══════════════

  // SECTION 1: HERO (minimal dark)
  log('Building Section 1: Hero...');
  const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
  hero.setTag('section');
  hero.setStyles([ctHero]);
  hero.setAttribute('id', 'ct-hero');

  const heroC = hero.append(webflow.elementPresets.DOM);
  heroC.setTag('div');
  heroC.setStyles([ctHeroContent]);

  const heroLabel = heroC.append(webflow.elementPresets.DOM);
  heroLabel.setTag('div');
  heroLabel.setStyles([s.label]);
  heroLabel.setAttribute('data-animate', 'fade-up');
  const heroLabelTxt = heroLabel.append(webflow.elementPresets.DOM);
  heroLabelTxt.setTag('div');
  heroLabelTxt.setTextContent('// Contact');

  const heroH = heroC.append(webflow.elementPresets.DOM);
  heroH.setTag('h1');
  heroH.setStyles([s.headingXL]);
  heroH.setTextContent('Get in Touch');
  heroH.setAttribute('data-animate', 'opacity-sweep');

  await safeCall('append:hero', () => body.append(hero));
  logDetail('Section 1: Hero appended', 'ok');

  // SECTION 2: CONTACT GRID (warm, form + info card)
  log('Building Section 2: Contact Grid...');
  const contactSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  contactSection.setTag('section');
  contactSection.setStyles([s.section, s.sectionWarm]);
  contactSection.setAttribute('id', 'ct-main');

  const grid = contactSection.append(webflow.elementPresets.DOM);
  grid.setTag('div');
  grid.setStyles([ctGrid]);

  // LEFT: Form
  const formWrap = grid.append(webflow.elementPresets.DOM);
  formWrap.setTag('form');
  formWrap.setStyles([ctFormWrap]);
  formWrap.setAttribute('data-animate', 'fade-up');

  // Name row (2-col)
  const nameRow = formWrap.append(webflow.elementPresets.DOM);
  nameRow.setTag('div');
  nameRow.setStyles([ctFormGrid]);

  // First Name
  const fn = nameRow.append(webflow.elementPresets.DOM);
  fn.setTag('div');
  const fnLabel = fn.append(webflow.elementPresets.DOM);
  fnLabel.setTag('label');
  fnLabel.setStyles([ctFormLabel]);
  fnLabel.setTextContent('First Name');
  const fnInput = fn.append(webflow.elementPresets.DOM);
  fnInput.setTag('input');
  fnInput.setStyles([ctInput]);
  fnInput.setAttribute('type', 'text');
  fnInput.setAttribute('name', 'first-name');
  fnInput.setAttribute('placeholder', 'First name');

  // Last Name
  const ln = nameRow.append(webflow.elementPresets.DOM);
  ln.setTag('div');
  const lnLabel = ln.append(webflow.elementPresets.DOM);
  lnLabel.setTag('label');
  lnLabel.setStyles([ctFormLabel]);
  lnLabel.setTextContent('Last Name');
  const lnInput = ln.append(webflow.elementPresets.DOM);
  lnInput.setTag('input');
  lnInput.setStyles([ctInput]);
  lnInput.setAttribute('type', 'text');
  lnInput.setAttribute('name', 'last-name');
  lnInput.setAttribute('placeholder', 'Last name');

  // Email + Phone (2-col)
  const epRow = formWrap.append(webflow.elementPresets.DOM);
  epRow.setTag('div');
  epRow.setStyles([ctFormGrid]);

  const emailF = epRow.append(webflow.elementPresets.DOM);
  emailF.setTag('div');
  const emailLabel = emailF.append(webflow.elementPresets.DOM);
  emailLabel.setTag('label');
  emailLabel.setStyles([ctFormLabel]);
  emailLabel.setTextContent('Email');
  const emailInput = emailF.append(webflow.elementPresets.DOM);
  emailInput.setTag('input');
  emailInput.setStyles([ctInput]);
  emailInput.setAttribute('type', 'email');
  emailInput.setAttribute('name', 'email');
  emailInput.setAttribute('placeholder', 'you@email.com');

  const phoneF = epRow.append(webflow.elementPresets.DOM);
  phoneF.setTag('div');
  const phoneLabel = phoneF.append(webflow.elementPresets.DOM);
  phoneLabel.setTag('label');
  phoneLabel.setStyles([ctFormLabel]);
  phoneLabel.setTextContent('Phone');
  const phoneInput = phoneF.append(webflow.elementPresets.DOM);
  phoneInput.setTag('input');
  phoneInput.setStyles([ctInput]);
  phoneInput.setAttribute('type', 'tel');
  phoneInput.setAttribute('name', 'phone');
  phoneInput.setAttribute('placeholder', '(000) 000-0000');

  // Address (full width)
  const addrLabel = formWrap.append(webflow.elementPresets.DOM);
  addrLabel.setTag('label');
  addrLabel.setStyles([ctFormLabel]);
  addrLabel.setTextContent('Property Address');
  const addrInput = formWrap.append(webflow.elementPresets.DOM);
  addrInput.setTag('input');
  addrInput.setStyles([ctInput]);
  addrInput.setAttribute('type', 'text');
  addrInput.setAttribute('name', 'address');
  addrInput.setAttribute('placeholder', 'Street address, City, CA');

  // Service type (select)
  const svcLabel = formWrap.append(webflow.elementPresets.DOM);
  svcLabel.setTag('label');
  svcLabel.setStyles([ctFormLabel]);
  svcLabel.setTextContent('Service Type');
  const svcSelect = formWrap.append(webflow.elementPresets.DOM);
  svcSelect.setTag('select');
  svcSelect.setStyles([ctSelect]);
  svcSelect.setAttribute('name', 'service');

  // Message (textarea)
  const msgLabel = formWrap.append(webflow.elementPresets.DOM);
  msgLabel.setTag('label');
  msgLabel.setStyles([ctFormLabel]);
  msgLabel.setTextContent('Message');
  const msgInput = formWrap.append(webflow.elementPresets.DOM);
  msgInput.setTag('textarea');
  msgInput.setStyles([ctTextarea]);
  msgInput.setAttribute('name', 'message');
  msgInput.setAttribute('placeholder', 'Tell us about your project');

  // Submit
  const submitBtn = formWrap.append(webflow.elementPresets.DOM);
  submitBtn.setTag('button');
  submitBtn.setStyles([ctSubmitBtn]);
  submitBtn.setTextContent('Send Message');
  submitBtn.setAttribute('type', 'submit');

  // RIGHT: Contact info card
  const infoCard = grid.append(webflow.elementPresets.DOM);
  infoCard.setTag('div');
  infoCard.setStyles([ctInfoCard]);
  infoCard.setAttribute('data-animate', 'fade-up');

  CONTACT_INFO.forEach(info => {
    const item = infoCard.append(webflow.elementPresets.DOM);
    item.setTag('div');
    item.setStyles([ctInfoItem]);

    const lbl = item.append(webflow.elementPresets.DOM);
    lbl.setTag('div');
    lbl.setStyles([ctInfoLabel]);
    lbl.setTextContent(info.label);

    const val = item.append(webflow.elementPresets.DOM);
    val.setTag('div');
    val.setStyles([ctInfoValue]);
    val.setTextContent(info.value);
  });

  await safeCall('append:contact', () => body.append(contactSection));
  logDetail('Section 2: Contact Grid appended', 'ok');

  // SECTION 3: CTA
  log('Building Section 3: CTA...');
  await buildCTASection(
    body, v,
    'Schedule a free consultation',
    'Call (714) 900-3676', 'tel:7149003676',
    'Get a Free Estimate', '/free-estimate',
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
