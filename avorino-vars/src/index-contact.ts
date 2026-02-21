// ════════════════════════════════════════════════════════════════
// Avorino Builder — CONTACT PAGE (v3 redesign)
// Cream hero, warm 2-col (info left + form right), CTA
// Form uses proper Webflow Form API presets
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog, wait,
  safeCall, getAvorinVars, getOrCreateStyle, freshStyle,
  clearAndSet, createSharedStyles, setSharedStyleProps,
  createAllVariables, createPageWithSlug,
  buildCTASection, applyCTAStyleProps,
  buildCleanForm, FormField,
  CALENDLY_CSS, CALENDLY_JS,
  buildCalendlySection, applyCalendlyStyleProps,
} from './shared.js';

// ── Page config ──
const PAGE_NAME = 'Contact';
const PAGE_SLUG = 'contact';
const PAGE_TITLE = 'Contact Avorino — Orange County Construction';
const PAGE_DESC = 'Get in touch with Avorino Construction. Call (714) 900-3676 or fill out our contact form.';
const HEAD_CODE = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@2bb7ded/avorino-responsive.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@2bb7ded/avorino-nav-footer.css">',
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@2bb7ded/avorino-animations.js"><\/script>',
  CALENDLY_JS,
].join('\n');

// ── Update panel UI ──
document.getElementById('page-name')!.textContent = PAGE_NAME;
const headCodeEl = document.getElementById('head-code');
const footerCodeEl = document.getElementById('footer-code');
if (headCodeEl) headCodeEl.textContent = HEAD_CODE;
if (footerCodeEl) footerCodeEl.textContent = FOOTER_CODE;

// ── Form fields ──
const FORM_FIELDS: FormField[] = [
  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'you@email.com', halfWidth: true },
  { name: 'phone', label: 'Phone', type: 'tel', placeholder: '(000) 000-0000', halfWidth: true },
  { name: 'address', label: 'Property Address', type: 'text', placeholder: 'Street address, City, CA' },
  { name: 'service', label: 'Service Type', type: 'select', options: ['ADU', 'Custom Home', 'Renovation', 'Addition', 'Garage Conversion', 'Commercial', 'Other'] },
  { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Tell us about your project' },
];

const CONTACT_DETAILS = [
  { label: 'Phone', value: '(714) 900-3676' },
  { label: 'Email', value: 'construction@avorino.com' },
];
const CONTACT_DETAILS_2 = [
  { label: 'Location', value: 'Orange County, California' },
  { label: 'License', value: 'General-B #1107538' },
];

// ── Build function ──
async function buildContactPage() {
  clearErrorLog();
  logDetail('Starting Contact page build (v3)...', 'info');
  const v = await getAvorinVars();
  logDetail('Loaded Avorino variable collection', 'ok');

  log('Creating shared styles...');
  const s = await createSharedStyles();

  // ── Page-specific styles ──
  log('Creating contact-specific styles...');
  const ctHero = await getOrCreateStyle('ct-hero');
  const ctHeroContent = await getOrCreateStyle('ct-hero-content');
  const ctInfoCol = await getOrCreateStyle('ct-info-col');
  const ctInfoHeading = await getOrCreateStyle('ct-info-heading');
  const ctInfoBody = await getOrCreateStyle('ct-info-body');
  const ctInfoPhone = await getOrCreateStyle('ct-info-phone');
  const ctInfoDetail = await getOrCreateStyle('ct-info-detail');
  const ctInfoLabel = await getOrCreateStyle('ct-info-label');
  const ctFormCol = await getOrCreateStyle('ct-form-col');

  // ── Create page ──
  const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);

  // ── Style properties ──
  async function applyStyleProperties() {
    log('Setting shared style properties...');
    await setSharedStyleProps(s, v);
    await wait(1000);

    log('Setting contact-specific style properties...');

    // Hero: cream bg, left-aligned, NOT dark — breaks the dark-hero-everywhere pattern
    await clearAndSet(await freshStyle('ct-hero'), 'ct-hero', {
      'min-height': '40vh', 'display': 'flex', 'align-items': 'flex-end',
      'padding-top': '180px', 'padding-bottom': '64px',
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'background-color': v['av-cream'], 'color': v['av-dark'],
    });
    await clearAndSet(await freshStyle('ct-hero-content'), 'ct-hero-content', {
      'max-width': '900px',
    });
    await wait(500);

    // Info column (left side — sticky)
    await clearAndSet(await freshStyle('ct-info-col'), 'ct-info-col', {
      'display': 'flex', 'flex-direction': 'column', 'position': 'sticky', 'top': '160px',
    });
    await clearAndSet(await freshStyle('ct-info-heading'), 'ct-info-heading', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h2'],
      'line-height': '1.08', 'letter-spacing': '-0.02em', 'font-weight': '400',
      'margin-bottom': '16px',
    });
    await clearAndSet(await freshStyle('ct-info-body'), 'ct-info-body', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.9', 'opacity': '0.6',
    });
    await clearAndSet(await freshStyle('ct-info-phone'), 'ct-info-phone', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
      'line-height': '1.2', 'font-weight': '400',
    });
    await clearAndSet(await freshStyle('ct-info-detail'), 'ct-info-detail', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.7',
    });
    await clearAndSet(await freshStyle('ct-info-label'), 'ct-info-label', {
      'font-family': 'DM Sans', 'font-size': v['av-text-label'],
      'letter-spacing': '0.3em', 'text-transform': 'uppercase', 'opacity': '0.3',
      'margin-bottom': '8px',
    });
    await clearAndSet(await freshStyle('ct-form-col'), 'ct-form-col', {
      'display': 'flex', 'flex-direction': 'column',
    });
    await wait(500);

    await applyCTAStyleProps(v);
  }

  // ═══════════════ BUILD ELEMENTS ═══════════════

  // SECTION 1: HERO — cream bg, left-aligned, large heading
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
  heroH.setTextContent("Let's build together");
  heroH.setAttribute('data-animate', 'word-stagger-elastic');

  const heroSub = heroC.append(webflow.elementPresets.DOM);
  heroSub.setTag('p');
  heroSub.setStyles([s.body, s.bodyMuted]);
  heroSub.setTextContent("Your vision, our expertise. Orange County's trusted builder.");
  heroSub.setAttribute('data-animate', 'fade-up');

  await safeCall('append:hero', () => body.append(hero));
  logDetail('Section 1: Hero appended', 'ok');

  // SECTION 2: CONTACT MAIN (warm bg, 2-col: info left + form right)
  // Section appended to body FIRST, then form built inside (Webflow Form API requirement)
  log('Building Section 2: Contact Main...');
  const mainSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  mainSection.setTag('section');
  mainSection.setStyles([s.section, s.sectionWarm]);
  mainSection.setAttribute('id', 'ct-main');

  const grid = mainSection.append(webflow.elementPresets.DOM);
  grid.setTag('div');
  grid.setStyles([s.split4060]);

  // LEFT: Info column
  const infoCol = grid.append(webflow.elementPresets.DOM);
  infoCol.setTag('div');
  infoCol.setStyles([ctInfoCol]);
  infoCol.setAttribute('data-animate', 'fade-up');

  const infoH = infoCol.append(webflow.elementPresets.DOM);
  infoH.setTag('h2');
  infoH.setStyles([ctInfoHeading]);
  infoH.setTextContent('Get in Touch');

  const infoP = infoCol.append(webflow.elementPresets.DOM);
  infoP.setTag('p');
  infoP.setStyles([ctInfoBody]);
  infoP.setTextContent('Call, email, or fill out the form. We respond within 24 hours.');

  // Divider
  const div1 = infoCol.append(webflow.elementPresets.DOM);
  div1.setTag('div');
  div1.setStyles([s.divider]);

  // Phone + Email details
  CONTACT_DETAILS.forEach(detail => {
    const lbl = infoCol.append(webflow.elementPresets.DOM);
    lbl.setTag('div');
    lbl.setStyles([ctInfoLabel]);
    lbl.setTextContent(detail.label);

    const val = infoCol.append(webflow.elementPresets.DOM);
    val.setTag('div');
    val.setStyles([detail.label === 'Phone' ? ctInfoPhone : ctInfoDetail]);
    val.setTextContent(detail.value);
  });

  // Divider
  const div2 = infoCol.append(webflow.elementPresets.DOM);
  div2.setTag('div');
  div2.setStyles([s.divider]);

  // Location + License details
  CONTACT_DETAILS_2.forEach(detail => {
    const lbl = infoCol.append(webflow.elementPresets.DOM);
    lbl.setTag('div');
    lbl.setStyles([ctInfoLabel]);
    lbl.setTextContent(detail.label);

    const val = infoCol.append(webflow.elementPresets.DOM);
    val.setTag('div');
    val.setStyles([ctInfoDetail]);
    val.setTextContent(detail.value);
  });

  // RIGHT: Form column
  const formCol = grid.append(webflow.elementPresets.DOM);
  formCol.setTag('div');
  formCol.setStyles([ctFormCol]);

  buildCleanForm(formCol, FORM_FIELDS, s, 'Send Message');

  await safeCall('append:contact', () => body.append(mainSection));
  logDetail('Section 2: Contact Main appended', 'ok');

  // SECTION 3: CALENDLY
  log('Building Section 3: Calendly...');
  await buildCalendlySection(body, v, 'Book a Free Consultation');

  // SECTION 4: CTA
  log('Building Section 4: CTA...');
  await buildCTASection(
    body, v,
    'Schedule a free consultation',
    'Call (714) 900-3676', 'tel:7149003676',
    'Schedule a Meeting', '/schedule-a-meeting',
  );

  // ═══════════════ APPLY STYLES ═══════════════
  await applyStyleProperties();
  await applyCalendlyStyleProps(v);

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
