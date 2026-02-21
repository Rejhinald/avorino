// ════════════════════════════════════════════════════════════════
// Avorino Builder — SERVICES PAGE
// Rename this to index.ts to build the Services page.
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
const PAGE_NAME = 'Services';
const PAGE_SLUG = 'services';
const PAGE_TITLE = 'Our Services — Avorino Construction in Orange County';
const PAGE_DESC = 'ADU construction, custom homes, new builds, additions, garage conversions, and commercial projects in Orange County. Licensed, insured, and fully permitted.';
const HEAD_CODE = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@933f826/avorino-responsive.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@933f826/avorino-nav-footer.css">',
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@933f826/avorino-about-process3d.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@933f826/avorino-animations.js"><\/script>',
  CALENDLY_JS,
].join('\n');

// ── Update panel UI ──
document.getElementById('page-name')!.textContent = PAGE_NAME;
const headCodeEl = document.getElementById('head-code');
const footerCodeEl = document.getElementById('footer-code');
if (headCodeEl) headCodeEl.textContent = HEAD_CODE;
if (footerCodeEl) footerCodeEl.textContent = FOOTER_CODE;

// ── Service data (inspired by v7-sections landing page) ──
const SERVICES = [
  {
    number: '01 / 06',
    title: 'ADU Construction',
    desc: 'Detached, attached, and garage conversion ADUs. Fully permitted, built to maximize property value.',
    href: '/adu',
  },
  {
    number: '02 / 06',
    title: 'Garage Conversion',
    desc: 'Transform your garage into a functional living space. Most affordable ADU option at $75K–$150K.',
    href: '/garageconversion',
  },
  {
    number: '03 / 06',
    title: 'Custom Homes',
    desc: 'Ground-up custom residences tailored to your vision. Full design-to-build service.',
    href: '/buildcustomhome',
  },
  {
    number: '04 / 06',
    title: 'New Construction',
    desc: 'New builds for landowners. Engineering, permits, and construction managed end-to-end.',
    href: '/newconstruction',
  },
  {
    number: '05 / 06',
    title: 'Additions',
    desc: 'Expand your living space with room additions, second stories, and extensions.',
    href: '/addition',
  },
  {
    number: '06 / 06',
    title: 'Commercial',
    desc: 'Tenant improvements and commercial renovations in Orange County.',
    href: '/commercial',
  },
];

// ── Build function ──
async function buildServicesPage() {
  clearErrorLog();
  logDetail('Starting Services page build...', 'info');
  const v = await getAvorinVars();
  logDetail('Loaded Avorino variable collection', 'ok');

  log('Creating shared styles...');
  const s = await createSharedStyles();
  logDetail('Shared styles done', 'ok');

  // ── Page-specific styles ──
  log('Creating page-specific styles...');
  // Hero
  const svHero = await getOrCreateStyle('sv-hero');
  const svHeroContent = await getOrCreateStyle('sv-hero-content');
  const svHeroSubtitle = await getOrCreateStyle('sv-hero-subtitle');
  // Service grid
  const svGrid = await getOrCreateStyle('sv-grid');
  const svCard = await getOrCreateStyle('sv-card');
  const svCardImg = await getOrCreateStyle('sv-card-img');
  const svCardContent = await getOrCreateStyle('sv-card-content');
  const svCardNumber = await getOrCreateStyle('sv-card-number');
  const svCardTitle = await getOrCreateStyle('sv-card-title');
  const svCardDesc = await getOrCreateStyle('sv-card-desc');
  const svCardCta = await getOrCreateStyle('sv-card-cta');
  // Process (Three.js 3D section — moved from About page)
  const processPinned = await getOrCreateStyle('about-process-pinned');
  const processVisual = await getOrCreateStyle('about-process-visual');
  const processFx = await getOrCreateStyle('about-process-fx');
  const processCards = await getOrCreateStyle('about-process-cards');
  const processCard = await getOrCreateStyle('about-process-card');
  const processNav = await getOrCreateStyle('about-process-nav');
  const processCardNum = await getOrCreateStyle('about-process-card-num');
  const processCardTitle = await getOrCreateStyle('about-process-card-title');
  const processCardDesc = await getOrCreateStyle('about-process-card-desc');
  // Utility
  const svMb64 = await getOrCreateStyle('sv-mb-64');
  const svMb96 = await getOrCreateStyle('sv-mb-96');
  const svLabelLine = await getOrCreateStyle('sv-label-line');

  // ── Create page ──
  const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);

  // ── Style property setter (applied after all elements) ──
  async function applyStyleProperties() {
    log('Setting shared style properties...');
    await setSharedStyleProps(s, v);
    logDetail('Shared style properties set', 'ok');
    await wait(1000);

    log('Setting page-specific style properties...');

    // Hero — v7-sections style: dark bg, content at bottom, image-ready
    logDetail('Setting hero props...', 'info');
    await clearAndSet(await freshStyle('sv-hero'), 'sv-hero', {
      'min-height': '60vh', 'display': 'flex', 'align-items': 'flex-end',
      'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('sv-hero-content'), 'sv-hero-content', {
      'position': 'relative', 'z-index': '2', 'max-width': '800px',
    });
    await clearAndSet(await freshStyle('sv-hero-subtitle'), 'sv-hero-subtitle', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.9', 'opacity': '0.6', 'margin-top': '24px', 'color': v['av-cream'],
    });
    await wait(500);

    // Service cards — inspired by v7-sections service-card: tall, image bg, overlaid content
    logDetail('Setting service card props...', 'info');
    await clearAndSet(await freshStyle('sv-grid'), 'sv-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr',
      'grid-column-gap': '32px', 'grid-row-gap': '32px',
    });
    await clearAndSet(await freshStyle('sv-card'), 'sv-card', {
      'position': 'relative',
      'min-height': '420px',
      'border-top-left-radius': '12px', 'border-top-right-radius': '12px',
      'border-bottom-left-radius': '12px', 'border-bottom-right-radius': '12px',
      'overflow-x': 'hidden', 'overflow-y': 'hidden',
      'display': 'flex', 'flex-direction': 'column', 'justify-content': 'flex-end',
      'background-color': v['av-dark'],
    });
    await clearAndSet(await freshStyle('sv-card-img'), 'sv-card-img', {
      'position': 'absolute', 'top': '0px', 'left': '0px', 'right': '0px', 'bottom': '0px',
      'background-color': 'rgba(240,237,232,0.04)',
    });
    await clearAndSet(await freshStyle('sv-card-content'), 'sv-card-content', {
      'position': 'relative', 'z-index': '2',
      'padding-top': '48px', 'padding-bottom': '48px',
      'padding-left': '40px', 'padding-right': '40px',
      'color': v['av-cream'],
      'display': 'flex', 'flex-direction': 'column',
    });
    await clearAndSet(await freshStyle('sv-card-number'), 'sv-card-number', {
      'font-family': 'DM Sans', 'font-size': v['av-text-xs'],
      'letter-spacing': '0.3em', 'text-transform': 'uppercase',
      'opacity': '0.5', 'margin-bottom': '24px',
    });
    await clearAndSet(await freshStyle('sv-card-title'), 'sv-card-title', {
      'font-family': 'DM Serif Display', 'font-size': '28px',
      'line-height': '1.15', 'letter-spacing': '-0.01em', 'font-weight': '400',
      'color': v['av-cream'], 'margin-bottom': '16px',
    });
    await clearAndSet(await freshStyle('sv-card-desc'), 'sv-card-desc', {
      'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
      'line-height': '1.7', 'opacity': '0.6', 'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('sv-card-cta'), 'sv-card-cta', {
      'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
      'font-weight': '400', 'letter-spacing': '0.08em',
      'display': 'inline-flex', 'align-items': 'center', 'grid-column-gap': '8px',
      'color': v['av-cream'], 'margin-top': '24px',
      'text-decoration': 'none',
    });
    await wait(500);

    // Process section styles (Three.js 3D — uses about-process-* names for process3d.js compatibility)
    logDetail('Setting process props...', 'info');
    await clearAndSet(await freshStyle('about-process-pinned'), 'about-process-pinned', {
      'height': '100vh', 'display': 'flex', 'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('about-process-visual'), 'about-process-visual', { 'width': '100%', 'height': '100%', 'position': 'relative' });
    await clearAndSet(await freshStyle('about-process-fx'), 'about-process-fx', { 'position': 'absolute', 'top': '0px', 'left': '0px', 'width': '100%', 'height': '100%' });
    await clearAndSet(await freshStyle('about-process-cards'), 'about-process-cards', { 'position': 'absolute', 'top': '0px', 'left': '0px', 'width': '100%', 'height': '100%', 'z-index': '2' });
    await clearAndSet(await freshStyle('about-process-card'), 'about-process-card', {
      'position': 'absolute', 'background-color': v['av-dark'], 'color': v['av-cream'],
      'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
      'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
      'padding-top': '56px', 'padding-bottom': '56px', 'padding-left': '48px', 'padding-right': '48px',
      'max-width': '500px', 'width': '100%', 'top': '50%', 'left': '50%',
    });
    await clearAndSet(await freshStyle('about-process-nav'), 'about-process-nav', { 'position': 'absolute', 'bottom': '32px', 'left': '0px', 'width': '100%', 'text-align': 'center' });
    await clearAndSet(await freshStyle('about-process-card-num'), 'about-process-card-num', {
      'font-family': 'DM Sans', 'font-size': v['av-text-xs'], 'letter-spacing': '0.2em', 'text-transform': 'uppercase', 'opacity': '0.4', 'margin-bottom': '16px', 'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('about-process-card-title'), 'about-process-card-title', {
      'font-family': 'DM Serif Display', 'font-size': '28px', 'line-height': '1.2', 'font-weight': '400', 'margin-bottom': '14px', 'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('about-process-card-desc'), 'about-process-card-desc', {
      'font-family': 'DM Sans', 'font-size': v['av-text-sm'], 'line-height': '1.7', 'opacity': '0.5', 'color': v['av-cream'],
    });
    await wait(500);

    // Utility
    await clearAndSet(await freshStyle('sv-mb-64'), 'sv-mb-64', { 'margin-bottom': v['av-gap-md'] });
    await clearAndSet(await freshStyle('sv-mb-96'), 'sv-mb-96', { 'margin-bottom': v['av-gap-lg'] });
    await clearAndSet(await freshStyle('sv-label-line'), 'sv-label-line', { 'flex-grow': '1', 'height': '1px', 'background-color': v['av-dark-15'] });

    // CTA
    await applyCTAStyleProps(v);
  }

  // ═══════════════ BUILD ELEMENTS ═══════════════

  // SECTION 1: HERO (dark, like v7 hero — title at bottom)
  log('Building Section 1: Hero...');
  const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
  hero.setTag('section');
  hero.setStyles([svHero]);
  hero.setAttribute('id', 'sv-hero');

  const heroC = hero.append(webflow.elementPresets.DOM);
  heroC.setTag('div');
  heroC.setStyles([svHeroContent]);

  const heroLabel = heroC.append(webflow.elementPresets.DOM);
  heroLabel.setTag('div');
  heroLabel.setStyles([s.label]);
  heroLabel.setAttribute('data-animate', 'fade-up');
  const heroLabelTxt = heroLabel.append(webflow.elementPresets.DOM);
  heroLabelTxt.setTag('div');
  heroLabelTxt.setTextContent('// Our Services');

  const heroH = heroC.append(webflow.elementPresets.DOM);
  heroH.setTag('h1');
  heroH.setStyles([s.headingXL]);
  heroH.setTextContent('Our Services');
  heroH.setAttribute('data-animate', 'opacity-sweep');

  const heroSub = heroC.append(webflow.elementPresets.DOM);
  heroSub.setTag('p');
  heroSub.setStyles([svHeroSubtitle]);
  heroSub.setTextContent('Design, permits, and construction in Orange County.');
  heroSub.setAttribute('data-animate', 'fade-up');

  await safeCall('append:hero', () => body.append(hero));
  logDetail('Section 1: Hero appended', 'ok');

  // SECTION 2: SERVICE GRID (warm bg, 3×2 cards like v7 service-card)
  log('Building Section 2: Service Grid...');
  const svcSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  svcSection.setTag('section');
  svcSection.setStyles([s.section, s.sectionWarm]);
  svcSection.setAttribute('id', 'sv-services');

  const svcLabel = svcSection.append(webflow.elementPresets.DOM);
  svcLabel.setTag('div');
  svcLabel.setStyles([s.label, svMb64]);
  svcLabel.setAttribute('data-animate', 'fade-up');
  const svcLabelTxt = svcLabel.append(webflow.elementPresets.DOM);
  svcLabelTxt.setTag('div');
  svcLabelTxt.setTextContent('What We Do');
  const svcLabelLine = svcLabel.append(webflow.elementPresets.DOM);
  svcLabelLine.setTag('div');
  svcLabelLine.setStyles([svLabelLine]);

  const grid = svcSection.append(webflow.elementPresets.DOM);
  grid.setTag('div');
  grid.setStyles([svGrid]);
  grid.setAttribute('data-animate', 'fade-up-stagger');

  SERVICES.forEach(svc => {
    const card = grid.append(webflow.elementPresets.DOM);
    card.setTag('a');
    card.setStyles([svCard]);
    card.setAttribute('href', svc.href);
    card.setAttribute('data-animate', 'fade-up');

    // Image placeholder (absolute positioned, for future bg image)
    const img = card.append(webflow.elementPresets.DOM);
    img.setTag('div');
    img.setStyles([svCardImg]);

    // Card content (overlaid at bottom)
    const content = card.append(webflow.elementPresets.DOM);
    content.setTag('div');
    content.setStyles([svCardContent]);

    const num = content.append(webflow.elementPresets.DOM);
    num.setTag('div');
    num.setStyles([svCardNumber]);
    num.setTextContent(svc.number);

    const title = content.append(webflow.elementPresets.DOM);
    title.setTag('h3');
    title.setStyles([svCardTitle]);
    title.setTextContent(svc.title);

    const desc = content.append(webflow.elementPresets.DOM);
    desc.setTag('p');
    desc.setStyles([svCardDesc]);
    desc.setTextContent(svc.desc);

    const cta = content.append(webflow.elementPresets.DOM);
    cta.setTag('span');
    cta.setStyles([svCardCta]);
    cta.setTextContent('Learn more \u2192');
  });

  await safeCall('append:services', () => body.append(svcSection));
  logDetail('Section 2: Service Grid appended', 'ok');

  // SECTION 3: PROCESS (Three.js 3D — pinned scroll section)
  log('Building Section 3: Process...');
  const proc = webflow.elementBuilder(webflow.elementPresets.DOM);
  proc.setTag('section'); proc.setStyles([s.section, s.sectionWarm]); proc.setAttribute('id', 'about-process');

  const procLbl = proc.append(webflow.elementPresets.DOM); procLbl.setTag('div'); procLbl.setStyles([s.label, svMb64]); procLbl.setAttribute('data-animate', 'fade-up');
  const procLblTxt = procLbl.append(webflow.elementPresets.DOM); procLblTxt.setTag('div'); procLblTxt.setTextContent('How We Work');
  const procLblLine = procLbl.append(webflow.elementPresets.DOM); procLblLine.setTag('div'); procLblLine.setStyles([svLabelLine]);

  const procH = proc.append(webflow.elementPresets.DOM); procH.setTag('h2'); procH.setStyles([s.headingLG, svMb96]);
  procH.setTextContent("Avorino's Process"); procH.setAttribute('data-animate', 'line-wipe');

  const pinned = proc.append(webflow.elementPresets.DOM); pinned.setTag('div'); pinned.setStyles([processPinned]); pinned.setAttribute('data-process-pinned', '');
  const visual = pinned.append(webflow.elementPresets.DOM); visual.setTag('div'); visual.setStyles([processVisual]); visual.setAttribute('data-process-visual', '');
  const fx = visual.append(webflow.elementPresets.DOM); fx.setTag('div'); fx.setStyles([processFx]); fx.setAttribute('data-process-fx', '');
  const cards = pinned.append(webflow.elementPresets.DOM); cards.setTag('div'); cards.setStyles([processCards]); cards.setAttribute('data-process-cards', '');

  [
    { step: 'Step 01', title: 'Pre-construction Consultation', desc: 'It is essential to plan ahead and setting project goals, identifying future challenges, and creating a solid foundation for a successful construction project.' },
    { step: 'Step 02', title: 'Architectural & Structural Design', desc: 'Our engineers and architects will work with you to understand your vision and will design a unique project based on your needs and preferences.' },
    { step: 'Step 03', title: 'Financing', desc: 'Our financing partners offer up to 100% financing of your project with up to 30-year terms with the option to re-finance.' },
    { step: 'Step 04', title: 'Permitting', desc: 'Permits are crucial for almost all construction projects, ensuring compliance, safety, and legal authorization for the work to proceed successfully.' },
    { step: 'Step 05', title: 'Construction', desc: 'The construction phase is the heart of any project. It brings plans to life, involving skilled professionals executing with quality, coordination, and adherence to timelines.' },
    { step: 'Step 06', title: 'Post-construction Relationship', desc: 'At Avorino, we value long-lasting client relationships over one-time transactions. We are committed to nurturing and maintaining these connections.' },
  ].forEach((item, idx) => {
    const card = cards.append(webflow.elementPresets.DOM); card.setTag('div'); card.setStyles([processCard]); card.setAttribute('data-process-card', String(idx));
    const n = card.append(webflow.elementPresets.DOM); n.setTag('div'); n.setStyles([processCardNum]); n.setTextContent(item.step);
    const t = card.append(webflow.elementPresets.DOM); t.setTag('h3'); t.setStyles([processCardTitle]); t.setTextContent(item.title);
    const d = card.append(webflow.elementPresets.DOM); d.setTag('p'); d.setStyles([processCardDesc]); d.setTextContent(item.desc);
  });

  const nav = pinned.append(webflow.elementPresets.DOM); nav.setTag('div'); nav.setStyles([processNav]); nav.setAttribute('data-process-nav', '');

  await safeCall('append:process', () => body.append(proc));
  logDetail('Section 3: Process appended', 'ok');

  // SECTION 4: CTA
  log('Building Section 4: CTA...');
  await buildCTASection(
    body, v,
    "Let's talk about your next project",
    'Schedule a Meeting', '/schedule-a-meeting',
    'Schedule a Call', '/schedule-a-meeting',
  );

  // ═══════════════ APPLY STYLES ═══════════════
  await applyStyleProperties();

  log('Services page built! Add custom code manually (see instructions below).', 'success');
  await webflow.notify({ type: 'Success', message: 'Services page created! Now add custom code manually.' });
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
  try { await buildServicesPage(); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
