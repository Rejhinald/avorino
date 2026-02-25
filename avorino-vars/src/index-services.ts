// ════════════════════════════════════════════════════════════════
// Avorino Builder — SERVICES PAGE (Revamped)
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
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@HASH/avorino-responsive.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@HASH/avorino-nav-footer.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@HASH/avorino-services.css">',
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@HASH/avorino-services.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@HASH/avorino-services-3d.js"><\/script>',
  CALENDLY_JS,
].join('\n');

// ── Update panel UI ──
document.getElementById('page-name')!.textContent = PAGE_NAME;
const headCodeEl = document.getElementById('head-code');
const footerCodeEl = document.getElementById('footer-code');
if (headCodeEl) headCodeEl.textContent = HEAD_CODE;
if (footerCodeEl) footerCodeEl.textContent = FOOTER_CODE;

// ── Service data ──
const SERVICES = [
  {
    number: '01 / 06', title: 'ADU Construction',
    desc: 'Detached, attached, and garage conversion ADUs. Fully permitted, built to maximize property value and rental income.',
    features: ['Detached & attached units', 'Full permit handling', 'ROI-optimized design'],
    href: '/adu',
  },
  {
    number: '02 / 06', title: 'Garage Conversion',
    desc: 'Transform your existing garage into a functional living space. The most affordable path to additional square footage.',
    features: ['Budget-friendly from $75K', 'No new foundation needed', 'Quick 8\u201312 week timeline'],
    href: '/garageconversion',
  },
  {
    number: '03 / 06', title: 'Custom Homes',
    desc: 'Ground-up custom residences tailored to your vision. Full design-to-build service with architectural precision.',
    features: ['Bespoke floor plans', 'Premium materials', 'Design-build integration'],
    href: '/buildcustomhome',
  },
  {
    number: '04 / 06', title: 'New Construction',
    desc: 'New builds for landowners. Engineering, permits, and construction managed end-to-end from raw lot to move-in.',
    features: ['Site preparation & grading', 'Full engineering services', 'Turnkey delivery'],
    href: '/newconstruction',
  },
  {
    number: '05 / 06', title: 'Additions',
    desc: 'Expand your living space with room additions, second stories, and home extensions that blend seamlessly.',
    features: ['Second story additions', 'Room extensions', 'Structural reinforcement'],
    href: '/addition',
  },
  {
    number: '06 / 06', title: 'Commercial',
    desc: 'Tenant improvements, commercial renovations, and build-outs in Orange County for businesses of all sizes.',
    features: ['Tenant improvements', 'Retail & office build-outs', 'ADA compliance'],
    href: '/commercial',
  },
];

const PROCESS_STEPS = [
  { step: 'Step 01', title: 'Pre-construction Consultation', desc: 'It is essential to plan ahead and setting project goals, identifying future challenges, and creating a solid foundation for a successful construction project.' },
  { step: 'Step 02', title: 'Architectural & Structural Design', desc: 'Our engineers and architects will work with you to understand your vision and will design a unique project based on your needs and preferences.' },
  { step: 'Step 03', title: 'Financing', desc: 'Our financing partners offer up to 100% financing of your project with up to 30-year terms with the option to re-finance.' },
  { step: 'Step 04', title: 'Permitting', desc: 'Permits are crucial for almost all construction projects, ensuring compliance, safety, and legal authorization for the work to proceed successfully.' },
  { step: 'Step 05', title: 'Construction', desc: 'The construction phase is the heart of any project. It brings plans to life, involving skilled professionals executing with quality, coordination, and adherence to timelines.' },
  { step: 'Step 06', title: 'Post-construction Relationship', desc: 'At Avorino, we value long-lasting client relationships over one-time transactions. We are committed to nurturing and maintaining these connections.' },
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
  const svHero = await getOrCreateStyle('sv-hero');
  const svHeroContent = await getOrCreateStyle('sv-hero-content');
  const svHeroSubtitle = await getOrCreateStyle('sv-hero-subtitle');
  const svMb64 = await getOrCreateStyle('sv-mb-64');
  const svMb96 = await getOrCreateStyle('sv-mb-96');
  const svLabelLine = await getOrCreateStyle('sv-label-line');

  // ── Create page ──
  const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);

  // ── Style property setter ──
  async function applyStyleProperties() {
    log('Setting shared style properties...');
    await setSharedStyleProps(s, v);
    logDetail('Shared style properties set', 'ok');
    await wait(1000);

    log('Setting page-specific style properties...');

    // Hero
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

    // Utility
    await clearAndSet(await freshStyle('sv-mb-64'), 'sv-mb-64', { 'margin-bottom': v['av-gap-md'] });
    await clearAndSet(await freshStyle('sv-mb-96'), 'sv-mb-96', { 'margin-bottom': v['av-gap-lg'] });
    await clearAndSet(await freshStyle('sv-label-line'), 'sv-label-line', { 'flex-grow': '1', 'height': '1px', 'background-color': v['av-dark-15'] });

    // CTA
    await applyCTAStyleProps(v);
  }

  // ═══════════════ BUILD ELEMENTS ═══════════════

  // SECTION 1: HERO
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
  heroH.setTextContent('Building Your Vision');
  heroH.setAttribute('data-animate', 'char-cascade');

  const heroSub = heroC.append(webflow.elementPresets.DOM);
  heroSub.setTag('p');
  heroSub.setStyles([svHeroSubtitle]);
  heroSub.setTextContent('Six specialized construction services. One relentless commitment to quality.');
  heroSub.setAttribute('data-animate', 'opacity-sweep');

  await safeCall('append:hero', () => body.append(hero));
  logDetail('Section 1: Hero appended', 'ok');

  // SECTION 2: SERVICE SHOWCASE (scroll-locked, dark)
  log('Building Section 2: Service Showcase...');
  const showcase = webflow.elementBuilder(webflow.elementPresets.DOM);
  showcase.setTag('section');
  showcase.setAttribute('class', 'sv-showcase');
  showcase.setAttribute('id', 'sv-showcase');

  // Canvas wrap (Three.js fills this)
  const canvasWrap = showcase.append(webflow.elementPresets.DOM);
  canvasWrap.setTag('div');
  canvasWrap.setAttribute('class', 'sv-canvas-wrap');

  // Content grid
  const content = showcase.append(webflow.elementPresets.DOM);
  content.setTag('div');
  content.setAttribute('class', 'sv-showcase-content');

  // Left column: service info
  const info = content.append(webflow.elementPresets.DOM);
  info.setTag('div');
  info.setAttribute('class', 'sv-showcase-info');

  // Build 6 service panels
  SERVICES.forEach((svc, i) => {
    const panel = info.append(webflow.elementPresets.DOM);
    panel.setTag('div');
    panel.setAttribute('class', 'sv-service-panel' + (i === 0 ? ' is-active' : ''));

    const label = panel.append(webflow.elementPresets.DOM);
    label.setTag('div');
    label.setAttribute('class', 'sv-service-label');
    label.setTextContent(svc.number);

    const title = panel.append(webflow.elementPresets.DOM);
    title.setTag('h3');
    title.setAttribute('class', 'sv-service-title');
    title.setTextContent(svc.title);

    const desc = panel.append(webflow.elementPresets.DOM);
    desc.setTag('p');
    desc.setAttribute('class', 'sv-service-desc');
    desc.setTextContent(svc.desc);

    const features = panel.append(webflow.elementPresets.DOM);
    features.setTag('div');
    features.setAttribute('class', 'sv-service-features');

    svc.features.forEach(f => {
      const feat = features.append(webflow.elementPresets.DOM);
      feat.setTag('div');
      feat.setAttribute('class', 'sv-service-feature');
      feat.setTextContent(f);
    });

    const cta = panel.append(webflow.elementPresets.DOM);
    cta.setTag('a');
    cta.setAttribute('class', 'sv-service-cta');
    cta.setAttribute('href', svc.href);
    cta.setTextContent('Explore ' + svc.title + ' \u2192');
  });

  // Right column (empty — Three.js fills canvas-wrap)
  const right = content.append(webflow.elementPresets.DOM);
  right.setTag('div');

  // Counter (large faint number)
  const counter = showcase.append(webflow.elementPresets.DOM);
  counter.setTag('div');
  counter.setAttribute('class', 'sv-counter');
  counter.setTextContent('01');

  // Progress bar
  const progressBar = showcase.append(webflow.elementPresets.DOM);
  progressBar.setTag('div');
  progressBar.setAttribute('class', 'sv-progress-bar');

  const barTrack = progressBar.append(webflow.elementPresets.DOM);
  barTrack.setTag('div');
  barTrack.setAttribute('class', 'sv-bar-track');

  const barFill = progressBar.append(webflow.elementPresets.DOM);
  barFill.setTag('div');
  barFill.setAttribute('class', 'sv-bar-fill');

  SERVICES.forEach((_, i) => {
    const dot = progressBar.append(webflow.elementPresets.DOM);
    dot.setTag('div');
    dot.setAttribute('class', 'sv-bar-dot' + (i === 0 ? ' is-active' : ''));
  });

  await safeCall('append:showcase', () => body.append(showcase));
  logDetail('Section 2: Service Showcase appended', 'ok');

  // SECTION 3: PROCESS TIMELINE (warm)
  log('Building Section 3: Process Timeline...');
  const proc = webflow.elementBuilder(webflow.elementPresets.DOM);
  proc.setTag('section');
  proc.setAttribute('class', 'sv-process');
  proc.setAttribute('id', 'sv-process');

  // Label
  const procLabel = proc.append(webflow.elementPresets.DOM);
  procLabel.setTag('div');
  procLabel.setAttribute('class', 'sv-process-label');
  const procLabelTxt = procLabel.append(webflow.elementPresets.DOM);
  procLabelTxt.setTag('div');
  procLabelTxt.setTextContent('How We Work');
  const procLabelLine = procLabel.append(webflow.elementPresets.DOM);
  procLabelLine.setTag('div');
  procLabelLine.setAttribute('class', 'sv-process-label-line');

  // Heading
  const procHeading = proc.append(webflow.elementPresets.DOM);
  procHeading.setTag('h2');
  procHeading.setAttribute('class', 'sv-process-heading');
  procHeading.setTextContent("Avorino's Process");
  procHeading.setAttribute('data-animate', 'line-wipe');

  // Timeline
  const timeline = proc.append(webflow.elementPresets.DOM);
  timeline.setTag('div');
  timeline.setAttribute('class', 'sv-timeline');

  // Timeline vertical line
  const timelineLine = timeline.append(webflow.elementPresets.DOM);
  timelineLine.setTag('div');
  timelineLine.setAttribute('class', 'sv-timeline-line');

  // Timeline steps
  PROCESS_STEPS.forEach((step) => {
    const stepEl = timeline.append(webflow.elementPresets.DOM);
    stepEl.setTag('div');
    stepEl.setAttribute('class', 'sv-timeline-step');

    // Marker (gold circle on timeline)
    const marker = stepEl.append(webflow.elementPresets.DOM);
    marker.setTag('div');
    marker.setAttribute('class', 'sv-timeline-marker');

    // Card
    const card = stepEl.append(webflow.elementPresets.DOM);
    card.setTag('div');
    card.setAttribute('class', 'sv-timeline-card');

    const num = card.append(webflow.elementPresets.DOM);
    num.setTag('div');
    num.setAttribute('class', 'sv-timeline-num');
    num.setTextContent(step.step);

    const title = card.append(webflow.elementPresets.DOM);
    title.setTag('h3');
    title.setAttribute('class', 'sv-timeline-title');
    title.setTextContent(step.title);

    const desc = card.append(webflow.elementPresets.DOM);
    desc.setTag('p');
    desc.setAttribute('class', 'sv-timeline-desc');
    desc.setTextContent(step.desc);
  });

  await safeCall('append:process', () => body.append(proc));
  logDetail('Section 3: Process Timeline appended', 'ok');

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
