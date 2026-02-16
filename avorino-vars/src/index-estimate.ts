// ════════════════════════════════════════════════════════════════
// Avorino Builder — FREE ESTIMATE PAGE
// Rename this to index.ts to build the Free Estimate page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog, wait,
  safeCall, getAvorinVars, getOrCreateStyle, freshStyle,
  clearAndSet, createSharedStyles, setSharedStyleProps,
  createAllVariables, createPageWithSlug,
  buildCTASection, applyCTAStyleProps,
} from './shared.js';

// ── Page config ──
const PAGE_NAME = 'Free Estimate';
const PAGE_SLUG = 'free-estimate';
const PAGE_TITLE = 'Get Your Free Estimate — Avorino Construction';
const PAGE_DESC = 'No obligations. Real numbers for your construction project in Orange County.';
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

// ── Next steps ──
const NEXT_STEPS = [
  { number: '01', title: 'We review your details', desc: 'Our team evaluates your project within 24 hours.' },
  { number: '02', title: 'Free site visit', desc: 'We visit your property to assess scope and feasibility.' },
  { number: '03', title: 'Detailed proposal', desc: 'You receive a full proposal within 5 business days.' },
];

// ── Build function ──
async function buildEstimatePage() {
  clearErrorLog();
  logDetail('Starting Free Estimate page build...', 'info');
  const v = await getAvorinVars();

  log('Creating shared styles...');
  const s = await createSharedStyles();

  // ── Page-specific styles ──
  log('Creating page-specific styles...');
  const estHero = await getOrCreateStyle('est-hero');
  const estHeroContent = await getOrCreateStyle('est-hero-content');
  const estHeroSub = await getOrCreateStyle('est-hero-subtitle');
  const estFormWrap = await getOrCreateStyle('est-form-wrap');
  const estFormGrid = await getOrCreateStyle('est-form-grid');
  const estInput = await getOrCreateStyle('est-input');
  const estTextarea = await getOrCreateStyle('est-textarea');
  const estSelect = await getOrCreateStyle('est-select');
  const estFormLabel = await getOrCreateStyle('est-form-label');
  const estSubmitBtn = await getOrCreateStyle('est-submit-btn');
  const estStepsGrid = await getOrCreateStyle('est-steps-grid');
  const estStep = await getOrCreateStyle('est-step');
  const estStepNum = await getOrCreateStyle('est-step-num');
  const estStepTitle = await getOrCreateStyle('est-step-title');
  const estStepDesc = await getOrCreateStyle('est-step-desc');
  const estMb32 = await getOrCreateStyle('est-mb-32');
  const estMb64 = await getOrCreateStyle('est-mb-64');
  const estLabelLine = await getOrCreateStyle('est-label-line');

  const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);

  async function applyStyleProperties() {
    log('Setting shared style properties...');
    await setSharedStyleProps(s, v);
    await wait(1000);

    log('Setting page-specific style properties...');

    // Hero
    await clearAndSet(await freshStyle('est-hero'), 'est-hero', {
      'min-height': '50vh', 'display': 'flex', 'align-items': 'flex-end',
      'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('est-hero-content'), 'est-hero-content', {
      'position': 'relative', 'z-index': '2', 'max-width': '700px',
    });
    await clearAndSet(await freshStyle('est-hero-subtitle'), 'est-hero-subtitle', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.9', 'opacity': '0.6', 'margin-top': '24px', 'color': v['av-cream'],
    });
    await wait(500);

    // Form
    await clearAndSet(await freshStyle('est-form-wrap'), 'est-form-wrap', {
      'max-width': '720px', 'margin-left': 'auto', 'margin-right': 'auto',
      'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '24px',
    });
    await clearAndSet(await freshStyle('est-form-grid'), 'est-form-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr',
      'grid-column-gap': '16px', 'grid-row-gap': '16px',
    });
    await clearAndSet(await freshStyle('est-form-label'), 'est-form-label', {
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
    await clearAndSet(await freshStyle('est-input'), 'est-input', inputProps);
    await clearAndSet(await freshStyle('est-select'), 'est-select', inputProps);
    await clearAndSet(await freshStyle('est-textarea'), 'est-textarea', { ...inputProps, 'min-height': '140px' });
    await clearAndSet(await freshStyle('est-submit-btn'), 'est-submit-btn', {
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

    // Steps
    await clearAndSet(await freshStyle('est-steps-grid'), 'est-steps-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr',
      'grid-column-gap': '32px', 'grid-row-gap': '32px',
    });
    await clearAndSet(await freshStyle('est-step'), 'est-step', {
      'display': 'flex', 'flex-direction': 'column',
    });
    await clearAndSet(await freshStyle('est-step-num'), 'est-step-num', {
      'font-family': 'DM Sans', 'font-size': v['av-text-label'],
      'letter-spacing': '0.3em', 'text-transform': 'uppercase',
      'opacity': '0.3', 'margin-bottom': '24px',
    });
    await clearAndSet(await freshStyle('est-step-title'), 'est-step-title', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
      'line-height': '1.12', 'font-weight': '400', 'margin-bottom': '16px',
    });
    await clearAndSet(await freshStyle('est-step-desc'), 'est-step-desc', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.9', 'opacity': '0.6',
    });
    await wait(500);

    // Utility
    await clearAndSet(await freshStyle('est-mb-32'), 'est-mb-32', { 'margin-bottom': v['av-gap-sm'] });
    await clearAndSet(await freshStyle('est-mb-64'), 'est-mb-64', { 'margin-bottom': v['av-gap-md'] });
    await clearAndSet(await freshStyle('est-label-line'), 'est-label-line', { 'flex-grow': '1', 'height': '1px', 'background-color': v['av-dark-15'] });

    await applyCTAStyleProps(v);
  }

  // ═══════════════ BUILD ELEMENTS ═══════════════

  // SECTION 1: HERO
  log('Building Section 1: Hero...');
  const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
  hero.setTag('section');
  hero.setStyles([estHero]);
  hero.setAttribute('id', 'est-hero');

  const heroC = hero.append(webflow.elementPresets.DOM);
  heroC.setTag('div');
  heroC.setStyles([estHeroContent]);

  const heroLabel = heroC.append(webflow.elementPresets.DOM);
  heroLabel.setTag('div');
  heroLabel.setStyles([s.label]);
  heroLabel.setAttribute('data-animate', 'fade-up');
  const heroLabelTxt = heroLabel.append(webflow.elementPresets.DOM);
  heroLabelTxt.setTag('div');
  heroLabelTxt.setTextContent('// Free Estimate');

  const heroH = heroC.append(webflow.elementPresets.DOM);
  heroH.setTag('h1');
  heroH.setStyles([s.headingXL]);
  heroH.setTextContent('Get Your Free Estimate');
  heroH.setAttribute('data-animate', 'opacity-sweep');

  const heroSub = heroC.append(webflow.elementPresets.DOM);
  heroSub.setTag('p');
  heroSub.setStyles([estHeroSub]);
  heroSub.setTextContent('No obligations. Real numbers for your project.');
  heroSub.setAttribute('data-animate', 'fade-up');

  await safeCall('append:hero', () => body.append(hero));

  // SECTION 2: FORM (warm bg, centered)
  log('Building Section 2: Form...');
  const formSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  formSection.setTag('section');
  formSection.setStyles([s.section, s.sectionWarm]);
  formSection.setAttribute('id', 'est-form');

  const formWrap = formSection.append(webflow.elementPresets.DOM);
  formWrap.setTag('form');
  formWrap.setStyles([estFormWrap]);
  formWrap.setAttribute('data-animate', 'fade-up');

  // Name + Email row
  const row1 = formWrap.append(webflow.elementPresets.DOM);
  row1.setTag('div');
  row1.setStyles([estFormGrid]);

  // Name field
  const nameF = row1.append(webflow.elementPresets.DOM);
  nameF.setTag('div');
  const nameLabel = nameF.append(webflow.elementPresets.DOM);
  nameLabel.setTag('label');
  nameLabel.setStyles([estFormLabel]);
  nameLabel.setTextContent('Full Name');
  const nameInput = nameF.append(webflow.elementPresets.DOM);
  nameInput.setTag('input');
  nameInput.setStyles([estInput]);
  nameInput.setAttribute('type', 'text');
  nameInput.setAttribute('name', 'name');
  nameInput.setAttribute('placeholder', 'Your name');

  // Email field
  const emailF = row1.append(webflow.elementPresets.DOM);
  emailF.setTag('div');
  const emailLabel = emailF.append(webflow.elementPresets.DOM);
  emailLabel.setTag('label');
  emailLabel.setStyles([estFormLabel]);
  emailLabel.setTextContent('Email');
  const emailInput = emailF.append(webflow.elementPresets.DOM);
  emailInput.setTag('input');
  emailInput.setStyles([estInput]);
  emailInput.setAttribute('type', 'email');
  emailInput.setAttribute('name', 'email');
  emailInput.setAttribute('placeholder', 'you@email.com');

  // Phone + Address row
  const row2 = formWrap.append(webflow.elementPresets.DOM);
  row2.setTag('div');
  row2.setStyles([estFormGrid]);

  const phoneF = row2.append(webflow.elementPresets.DOM);
  phoneF.setTag('div');
  const phoneLabel = phoneF.append(webflow.elementPresets.DOM);
  phoneLabel.setTag('label');
  phoneLabel.setStyles([estFormLabel]);
  phoneLabel.setTextContent('Phone');
  const phoneInput = phoneF.append(webflow.elementPresets.DOM);
  phoneInput.setTag('input');
  phoneInput.setStyles([estInput]);
  phoneInput.setAttribute('type', 'tel');
  phoneInput.setAttribute('name', 'phone');
  phoneInput.setAttribute('placeholder', '(000) 000-0000');

  const addrF = row2.append(webflow.elementPresets.DOM);
  addrF.setTag('div');
  const addrLabel = addrF.append(webflow.elementPresets.DOM);
  addrLabel.setTag('label');
  addrLabel.setStyles([estFormLabel]);
  addrLabel.setTextContent('Property Address');
  const addrInput = addrF.append(webflow.elementPresets.DOM);
  addrInput.setTag('input');
  addrInput.setStyles([estInput]);
  addrInput.setAttribute('type', 'text');
  addrInput.setAttribute('name', 'address');
  addrInput.setAttribute('placeholder', 'Street, City, CA');

  // Service + Budget row
  const row3 = formWrap.append(webflow.elementPresets.DOM);
  row3.setTag('div');
  row3.setStyles([estFormGrid]);

  const svcF = row3.append(webflow.elementPresets.DOM);
  svcF.setTag('div');
  const svcLabel = svcF.append(webflow.elementPresets.DOM);
  svcLabel.setTag('label');
  svcLabel.setStyles([estFormLabel]);
  svcLabel.setTextContent('Service Type');
  const svcSelect = svcF.append(webflow.elementPresets.DOM);
  svcSelect.setTag('select');
  svcSelect.setStyles([estSelect]);
  svcSelect.setAttribute('name', 'service');

  const budgetF = row3.append(webflow.elementPresets.DOM);
  budgetF.setTag('div');
  const budgetLabel = budgetF.append(webflow.elementPresets.DOM);
  budgetLabel.setTag('label');
  budgetLabel.setStyles([estFormLabel]);
  budgetLabel.setTextContent('Budget Range');
  const budgetSelect = budgetF.append(webflow.elementPresets.DOM);
  budgetSelect.setTag('select');
  budgetSelect.setStyles([estSelect]);
  budgetSelect.setAttribute('name', 'budget');

  // Timeline (full width select)
  const timeLabel = formWrap.append(webflow.elementPresets.DOM);
  timeLabel.setTag('label');
  timeLabel.setStyles([estFormLabel]);
  timeLabel.setTextContent('Timeline');
  const timeSelect = formWrap.append(webflow.elementPresets.DOM);
  timeSelect.setTag('select');
  timeSelect.setStyles([estSelect]);
  timeSelect.setAttribute('name', 'timeline');

  // Project details (textarea)
  const detailLabel = formWrap.append(webflow.elementPresets.DOM);
  detailLabel.setTag('label');
  detailLabel.setStyles([estFormLabel]);
  detailLabel.setTextContent('Project Details');
  const detailInput = formWrap.append(webflow.elementPresets.DOM);
  detailInput.setTag('textarea');
  detailInput.setStyles([estTextarea]);
  detailInput.setAttribute('name', 'details');
  detailInput.setAttribute('placeholder', 'Describe your project — size, goals, anything relevant.');

  // Submit
  const submitBtn = formWrap.append(webflow.elementPresets.DOM);
  submitBtn.setTag('button');
  submitBtn.setStyles([estSubmitBtn]);
  submitBtn.setTextContent('Get My Free Estimate');
  submitBtn.setAttribute('type', 'submit');

  await safeCall('append:form', () => body.append(formSection));

  // SECTION 3: WHAT HAPPENS NEXT (cream bg, 3-step)
  log('Building Section 3: What Happens Next...');
  const nextSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  nextSection.setTag('section');
  nextSection.setStyles([s.section, s.sectionCream]);
  nextSection.setAttribute('id', 'est-next');

  const nextHeader = nextSection.append(webflow.elementPresets.DOM);
  nextHeader.setTag('div');
  nextHeader.setStyles([estMb64]);

  const nextLabel = nextHeader.append(webflow.elementPresets.DOM);
  nextLabel.setTag('div');
  nextLabel.setStyles([s.label, estMb32]);
  nextLabel.setAttribute('data-animate', 'fade-up');
  const nextLabelTxt = nextLabel.append(webflow.elementPresets.DOM);
  nextLabelTxt.setTag('div');
  nextLabelTxt.setTextContent('What Happens Next');
  const nextLabelLine = nextLabel.append(webflow.elementPresets.DOM);
  nextLabelLine.setTag('div');
  nextLabelLine.setStyles([estLabelLine]);

  const stepsGrid = nextSection.append(webflow.elementPresets.DOM);
  stepsGrid.setTag('div');
  stepsGrid.setStyles([estStepsGrid]);
  stepsGrid.setAttribute('data-animate', 'fade-up-stagger');

  NEXT_STEPS.forEach(step => {
    const el = stepsGrid.append(webflow.elementPresets.DOM);
    el.setTag('div');
    el.setStyles([estStep]);
    el.setAttribute('data-animate', 'fade-up');

    const num = el.append(webflow.elementPresets.DOM);
    num.setTag('div');
    num.setStyles([estStepNum]);
    num.setTextContent(step.number);

    const title = el.append(webflow.elementPresets.DOM);
    title.setTag('h3');
    title.setStyles([estStepTitle]);
    title.setTextContent(step.title);

    const desc = el.append(webflow.elementPresets.DOM);
    desc.setTag('p');
    desc.setStyles([estStepDesc]);
    desc.setTextContent(step.desc);
  });

  await safeCall('append:next', () => body.append(nextSection));

  // SECTION 4: CTA
  log('Building Section 4: CTA...');
  await buildCTASection(
    body, v,
    'Or call us directly',
    'Call (714) 900-3676', 'tel:7149003676',
  );

  await applyStyleProperties();

  log('Free Estimate page built!', 'success');
  await webflow.notify({ type: 'Success', message: 'Free Estimate page created!' });
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
  try { await buildEstimatePage(); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
