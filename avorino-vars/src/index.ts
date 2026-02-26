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
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@c14eb30/avorino-responsive.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@c14eb30/avorino-nav-footer.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@c14eb30/avorino-services.css">',
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@c14eb30/avorino-services.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@c14eb30/avorino-services-3d.js"><\/script>',
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

  // Hero
  const svHero = await getOrCreateStyle('sv-hero');
  const svHeroContent = await getOrCreateStyle('sv-hero-content');
  const svHeroSubtitle = await getOrCreateStyle('sv-hero-subtitle');

  // Showcase section
  const svShowcase = await getOrCreateStyle('sv-showcase');
  const svCanvasWrap = await getOrCreateStyle('sv-canvas-wrap');
  const svShowcaseContent = await getOrCreateStyle('sv-showcase-content');
  const svShowcaseInfo = await getOrCreateStyle('sv-showcase-info');
  const svServicePanel = await getOrCreateStyle('sv-service-panel');
  const svServiceLabel = await getOrCreateStyle('sv-service-label');
  const svServiceTitle = await getOrCreateStyle('sv-service-title');
  const svServiceDesc = await getOrCreateStyle('sv-service-desc');
  const svServiceFeatures = await getOrCreateStyle('sv-service-features');
  const svServiceFeature = await getOrCreateStyle('sv-service-feature');
  const svServiceCta = await getOrCreateStyle('sv-service-cta');
  const svCounter = await getOrCreateStyle('sv-counter');

  // Progress bar
  const svProgressBar = await getOrCreateStyle('sv-progress-bar');
  const svBarTrack = await getOrCreateStyle('sv-bar-track');
  const svBarFill = await getOrCreateStyle('sv-bar-fill');
  const svBarDot = await getOrCreateStyle('sv-bar-dot');

  // Process timeline
  const svProcess = await getOrCreateStyle('sv-process');
  const svProcessLabel = await getOrCreateStyle('sv-process-label');
  const svProcessLabelLine = await getOrCreateStyle('sv-process-label-line');
  const svProcessHeading = await getOrCreateStyle('sv-process-heading');
  const svTimeline = await getOrCreateStyle('sv-timeline');
  const svTimelineLine = await getOrCreateStyle('sv-timeline-line');
  const svTimelineStep = await getOrCreateStyle('sv-timeline-step');
  const svTimelineMarker = await getOrCreateStyle('sv-timeline-marker');
  const svTimelineCard = await getOrCreateStyle('sv-timeline-card');
  const svTimelineNum = await getOrCreateStyle('sv-timeline-num');
  const svTimelineTitle = await getOrCreateStyle('sv-timeline-title');
  const svTimelineDesc = await getOrCreateStyle('sv-timeline-desc');

  logDetail('All styles created', 'ok');

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

    // Showcase section
    logDetail('Setting showcase props...', 'info');
    await clearAndSet(await freshStyle('sv-showcase'), 'sv-showcase', {
      'width': '100%', 'min-height': '100vh', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
      'position': 'relative', 'background-color': v['av-dark'], 'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('sv-canvas-wrap'), 'sv-canvas-wrap', {
      'position': 'absolute', 'top': '0px', 'right': '0px',
      'width': '50%', 'height': '100%', 'z-index': '1',
      'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('sv-showcase-content'), 'sv-showcase-content', {
      'position': 'relative', 'z-index': '2',
      'max-width': '1400px', 'margin-left': 'auto', 'margin-right': 'auto',
      'padding-left': '80px', 'padding-right': '80px',
      'width': '100%', 'height': '100vh',
      'display': 'grid', 'grid-template-columns': '5fr 7fr',
      'grid-column-gap': '96px', 'align-items': 'center',
    });
    await clearAndSet(await freshStyle('sv-showcase-info'), 'sv-showcase-info', {
      'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '24px',
      'position': 'relative', 'min-height': '420px',
    });
    await wait(500);

    // Service panels
    logDetail('Setting service panel props...', 'info');
    await clearAndSet(await freshStyle('sv-service-panel'), 'sv-service-panel', {
      'position': 'absolute', 'top': '0px', 'left': '0px', 'width': '100%', 'height': '100%',
      'display': 'flex', 'flex-direction': 'column', 'justify-content': 'center',
      'grid-row-gap': '24px', 'opacity': '0',
    });
    await clearAndSet(await freshStyle('sv-service-label'), 'sv-service-label', {
      'font-family': 'DM Sans', 'font-size': '11px',
      'letter-spacing': '0.25em', 'text-transform': 'uppercase',
      'color': '#c9a96e', 'opacity': '0.8',
    });
    await clearAndSet(await freshStyle('sv-service-title'), 'sv-service-title', {
      'font-family': 'DM Serif Display', 'font-size': '48px',
      'font-weight': '400', 'line-height': '1.08', 'letter-spacing': '-0.02em',
      'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('sv-service-desc'), 'sv-service-desc', {
      'font-family': 'DM Sans', 'font-size': '16px',
      'line-height': '1.9', 'color': v['av-cream'], 'opacity': '0.55',
      'max-width': '480px',
    });
    await clearAndSet(await freshStyle('sv-service-features'), 'sv-service-features', {
      'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '12px',
      'margin-top': '8px',
    });
    await clearAndSet(await freshStyle('sv-service-feature'), 'sv-service-feature', {
      'font-family': 'DM Sans', 'font-size': '14px',
      'color': v['av-cream'], 'opacity': '0.7', 'padding-left': '20px',
    });
    await clearAndSet(await freshStyle('sv-service-cta'), 'sv-service-cta', {
      'font-family': 'DM Sans', 'font-size': '14px', 'font-weight': '500',
      'letter-spacing': '0.08em', 'display': 'inline-flex', 'align-items': 'center',
      'grid-column-gap': '8px', 'color': '#c9a96e', 'text-decoration': 'none',
      'margin-top': '16px',
    });
    await wait(500);

    // Counter
    await clearAndSet(await freshStyle('sv-counter'), 'sv-counter', {
      'font-family': 'DM Serif Display', 'font-size': '120px',
      'font-weight': '400', 'line-height': '1', 'color': v['av-cream'],
      'opacity': '0.08', 'position': 'absolute', 'bottom': '80px', 'left': '80px', 'z-index': '2',
    });

    // Progress bar
    logDetail('Setting progress bar props...', 'info');
    await clearAndSet(await freshStyle('sv-progress-bar'), 'sv-progress-bar', {
      'position': 'absolute', 'bottom': '0px', 'left': '0px', 'right': '0px',
      'height': '48px', 'display': 'flex', 'align-items': 'center',
      'justify-content': 'space-between', 'padding-left': '80px', 'padding-right': '80px',
      'z-index': '10',
    });
    await clearAndSet(await freshStyle('sv-bar-track'), 'sv-bar-track', {
      'position': 'absolute', 'top': '50%', 'left': '80px', 'right': '80px',
      'height': '1px', 'background-color': 'rgba(240, 237, 232, 0.06)',
    });
    await clearAndSet(await freshStyle('sv-bar-fill'), 'sv-bar-fill', {
      'position': 'absolute', 'top': '50%', 'left': '80px', 'right': '80px',
      'height': '1px', 'background-color': 'rgba(201, 169, 110, 0.5)',
    });
    await clearAndSet(await freshStyle('sv-bar-dot'), 'sv-bar-dot', {
      'position': 'relative', 'width': '8px', 'height': '8px',
      'border-top-left-radius': '50%', 'border-top-right-radius': '50%',
      'border-bottom-left-radius': '50%', 'border-bottom-right-radius': '50%',
      'background-color': 'transparent', 'z-index': '1',
    });
    await wait(500);

    // Process section
    logDetail('Setting process props...', 'info');
    await clearAndSet(await freshStyle('sv-process'), 'sv-process', {
      'position': 'relative',
      'padding-top': '120px', 'padding-bottom': '120px',
      'padding-left': '80px', 'padding-right': '80px',
      'background-color': v['av-warm'],
    });
    await clearAndSet(await freshStyle('sv-process-label'), 'sv-process-label', {
      'font-family': 'DM Sans', 'font-size': '11px',
      'letter-spacing': '0.25em', 'text-transform': 'uppercase',
      'color': v['av-dark'], 'opacity': '0.4',
      'margin-bottom': '64px', 'display': 'flex', 'align-items': 'center', 'grid-column-gap': '24px',
    });
    await clearAndSet(await freshStyle('sv-process-label-line'), 'sv-process-label-line', {
      'flex-grow': '1', 'height': '1px', 'background-color': 'rgba(17, 17, 17, 0.15)',
    });
    await clearAndSet(await freshStyle('sv-process-heading'), 'sv-process-heading', {
      'font-family': 'DM Serif Display', 'font-size': '48px',
      'font-weight': '400', 'line-height': '1.08', 'letter-spacing': '-0.02em',
      'color': v['av-dark'], 'margin-bottom': '96px',
    });
    await wait(500);

    // Timeline
    logDetail('Setting timeline props...', 'info');
    await clearAndSet(await freshStyle('sv-timeline'), 'sv-timeline', {
      'position': 'relative', 'max-width': '900px',
      'margin-left': 'auto', 'margin-right': 'auto',
    });
    await clearAndSet(await freshStyle('sv-timeline-line'), 'sv-timeline-line', {
      'position': 'absolute', 'left': '50%', 'top': '0px', 'bottom': '0px',
      'width': '1px', 'background-color': 'rgba(201, 169, 110, 0.3)',
    });
    await clearAndSet(await freshStyle('sv-timeline-step'), 'sv-timeline-step', {
      'display': 'flex', 'align-items': 'flex-start',
      'margin-bottom': '80px', 'position': 'relative',
    });
    await clearAndSet(await freshStyle('sv-timeline-marker'), 'sv-timeline-marker', {
      'position': 'absolute', 'left': '50%', 'top': '16px',
      'width': '24px', 'height': '24px',
      'border-top-left-radius': '50%', 'border-top-right-radius': '50%',
      'border-bottom-left-radius': '50%', 'border-bottom-right-radius': '50%',
      'background-color': '#c9a96e', 'z-index': '2', 'flex-shrink': '0',
    });
    await clearAndSet(await freshStyle('sv-timeline-card'), 'sv-timeline-card', {
      'width': '45%', 'background-color': 'rgba(255, 255, 255, 0.7)',
      'border-top-left-radius': '12px', 'border-top-right-radius': '12px',
      'border-bottom-left-radius': '12px', 'border-bottom-right-radius': '12px',
      'padding-top': '40px', 'padding-bottom': '40px',
      'padding-left': '40px', 'padding-right': '40px',
    });
    await clearAndSet(await freshStyle('sv-timeline-num'), 'sv-timeline-num', {
      'font-family': 'DM Sans', 'font-size': '11px',
      'letter-spacing': '0.25em', 'text-transform': 'uppercase',
      'opacity': '0.4', 'margin-bottom': '16px', 'color': v['av-dark'],
    });
    await clearAndSet(await freshStyle('sv-timeline-title'), 'sv-timeline-title', {
      'font-family': 'DM Serif Display', 'font-size': '24px',
      'font-weight': '400', 'line-height': '1.2',
      'margin-bottom': '14px', 'color': v['av-dark'],
    });
    await clearAndSet(await freshStyle('sv-timeline-desc'), 'sv-timeline-desc', {
      'font-family': 'DM Sans', 'font-size': '15px',
      'line-height': '1.7', 'opacity': '0.55', 'color': v['av-dark'],
    });

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
  showcase.setStyles([svShowcase]);
  showcase.setAttribute('id', 'sv-showcase');

  // Canvas wrap (Three.js fills this)
  const canvasWrap = showcase.append(webflow.elementPresets.DOM);
  canvasWrap.setTag('div');
  canvasWrap.setStyles([svCanvasWrap]);

  // Content grid
  const content = showcase.append(webflow.elementPresets.DOM);
  content.setTag('div');
  content.setStyles([svShowcaseContent]);

  // Left column: service info
  const info = content.append(webflow.elementPresets.DOM);
  info.setTag('div');
  info.setStyles([svShowcaseInfo]);

  // Build 6 service panels
  SERVICES.forEach((svc, i) => {
    const panel = info.append(webflow.elementPresets.DOM);
    panel.setTag('div');
    panel.setStyles([svServicePanel]);
    if (i === 0) panel.setAttribute('data-active', 'true');

    const label = panel.append(webflow.elementPresets.DOM);
    label.setTag('div');
    label.setStyles([svServiceLabel]);
    label.setTextContent(svc.number);

    const title = panel.append(webflow.elementPresets.DOM);
    title.setTag('h3');
    title.setStyles([svServiceTitle]);
    title.setTextContent(svc.title);

    const desc = panel.append(webflow.elementPresets.DOM);
    desc.setTag('p');
    desc.setStyles([svServiceDesc]);
    desc.setTextContent(svc.desc);

    const features = panel.append(webflow.elementPresets.DOM);
    features.setTag('div');
    features.setStyles([svServiceFeatures]);

    svc.features.forEach(f => {
      const feat = features.append(webflow.elementPresets.DOM);
      feat.setTag('div');
      feat.setStyles([svServiceFeature]);
      feat.setTextContent(f);
    });

    const cta = panel.append(webflow.elementPresets.DOM);
    cta.setTag('a');
    cta.setStyles([svServiceCta]);
    cta.setAttribute('href', svc.href);
    cta.setTextContent('Explore ' + svc.title + ' \u2192');
  });

  // Right column (empty — Three.js fills canvas-wrap)
  const right = content.append(webflow.elementPresets.DOM);
  right.setTag('div');

  // Counter (large faint number)
  const counter = showcase.append(webflow.elementPresets.DOM);
  counter.setTag('div');
  counter.setStyles([svCounter]);
  counter.setTextContent('01');

  // Progress bar
  const progressBar = showcase.append(webflow.elementPresets.DOM);
  progressBar.setTag('div');
  progressBar.setStyles([svProgressBar]);

  const barTrack = progressBar.append(webflow.elementPresets.DOM);
  barTrack.setTag('div');
  barTrack.setStyles([svBarTrack]);

  const barFill = progressBar.append(webflow.elementPresets.DOM);
  barFill.setTag('div');
  barFill.setStyles([svBarFill]);

  SERVICES.forEach(() => {
    const dot = progressBar.append(webflow.elementPresets.DOM);
    dot.setTag('div');
    dot.setStyles([svBarDot]);
  });

  await safeCall('append:showcase', () => body.append(showcase));
  logDetail('Section 2: Service Showcase appended', 'ok');

  // SECTION 3: PROCESS TIMELINE (warm)
  log('Building Section 3: Process Timeline...');
  const proc = webflow.elementBuilder(webflow.elementPresets.DOM);
  proc.setTag('section');
  proc.setStyles([svProcess]);
  proc.setAttribute('id', 'sv-process');

  // Label
  const procLabel = proc.append(webflow.elementPresets.DOM);
  procLabel.setTag('div');
  procLabel.setStyles([svProcessLabel]);
  const procLabelTxt = procLabel.append(webflow.elementPresets.DOM);
  procLabelTxt.setTag('div');
  procLabelTxt.setTextContent('How We Work');
  const procLabelLine = procLabel.append(webflow.elementPresets.DOM);
  procLabelLine.setTag('div');
  procLabelLine.setStyles([svProcessLabelLine]);

  // Heading
  const procHeading = proc.append(webflow.elementPresets.DOM);
  procHeading.setTag('h2');
  procHeading.setStyles([svProcessHeading]);
  procHeading.setTextContent("Avorino's Process");
  procHeading.setAttribute('data-animate', 'line-wipe');

  // Timeline
  const timeline = proc.append(webflow.elementPresets.DOM);
  timeline.setTag('div');
  timeline.setStyles([svTimeline]);

  // Timeline vertical line
  const timelineLine = timeline.append(webflow.elementPresets.DOM);
  timelineLine.setTag('div');
  timelineLine.setStyles([svTimelineLine]);

  // Timeline steps
  PROCESS_STEPS.forEach((step) => {
    const stepEl = timeline.append(webflow.elementPresets.DOM);
    stepEl.setTag('div');
    stepEl.setStyles([svTimelineStep]);

    // Marker (gold circle on timeline)
    const marker = stepEl.append(webflow.elementPresets.DOM);
    marker.setTag('div');
    marker.setStyles([svTimelineMarker]);

    // Card
    const card = stepEl.append(webflow.elementPresets.DOM);
    card.setTag('div');
    card.setStyles([svTimelineCard]);

    const num = card.append(webflow.elementPresets.DOM);
    num.setTag('div');
    num.setStyles([svTimelineNum]);
    num.setTextContent(step.step);

    const title = card.append(webflow.elementPresets.DOM);
    title.setTag('h3');
    title.setStyles([svTimelineTitle]);
    title.setTextContent(step.title);

    const desc = card.append(webflow.elementPresets.DOM);
    desc.setTag('p');
    desc.setStyles([svTimelineDesc]);
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
