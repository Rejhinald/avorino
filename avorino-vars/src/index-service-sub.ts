// ════════════════════════════════════════════════════════════════
// Avorino Builder — SERVICE SUB-PAGE TEMPLATE (v2 redesign)
// Image hero + 2 alternating narrative rows + CTA
// Change SERVICE_INDEX below to select which service to build:
//   0 = Custom Home (/buildcustomhome)
//   1 = New Construction (/newconstruction)
//   2 = Property Additions (/addition)
//   3 = Garage Conversion (/garageconversion)
//   4 = Commercial (/commercial)
//   5 = Build ADU 2024 (/buildadu2024)
//   6 = Real Rendering (/realrendering)
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog, wait,
  safeCall, getAvorinVars, getOrCreateStyle, freshStyle,
  clearAndSet, createSharedStyles, setSharedStyleProps,
  createAllVariables, createPageWithSlug,
  buildCTASection, applyCTAStyleProps,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

// ═══ CHANGE THIS INDEX TO BUILD A DIFFERENT SERVICE PAGE ═══
const SERVICE_INDEX = 0;

// ── Service data ──
const SERVICES = [
  {
    slug: 'buildcustomhome', name: 'Custom Home Building',
    subtitle: 'Ground-up custom residences in Orange County.',
    desc: 'Build a home designed around your life — from floor plan to finishes. We handle architecture, engineering, permitting, and construction. Every detail is tailored to your vision.',
    processDesc: 'Our process is straightforward: we start with your goals and site conditions, develop full architectural and engineering plans, handle all city permits, then build with a licensed crew delivering weekly updates through final inspection.',
    cost: '$350–$550/sqft', timeline: '12–18 months',
    title: 'Custom Home Building — Avorino Construction',
    seoDesc: 'Custom home construction in Orange County. Full design-to-build service by Avorino.',
  },
  {
    slug: 'newconstruction', name: 'New Construction',
    subtitle: 'New builds for landowners in Orange County.',
    desc: 'Turn your vacant lot into a finished home. Full build from site prep through final inspection — engineering, permits, and all finishes included.',
    processDesc: 'We evaluate your lot, create custom plans with structural engineering, manage all permit submissions and plan-check corrections, then build on a transparent schedule with weekly progress reports.',
    cost: '$350–$550/sqft', timeline: '6–10 months',
    title: 'New Construction — Avorino Construction',
    seoDesc: 'New construction for landowners in Orange County. Engineering, permits, and full-service building.',
  },
  {
    slug: 'addition', name: 'Property Additions',
    subtitle: 'Expand your living space without moving.',
    desc: 'Room additions, second stories, and extensions. Maximize your square footage and property value without relocating. We match the addition seamlessly to your existing home.',
    processDesc: 'We assess your property for structural feasibility, design the addition to integrate with your existing home, handle permits, then build with minimal disruption to your daily life.',
    cost: '$300–$500/sqft', timeline: '4–8 months',
    title: 'Property Additions — Avorino Construction',
    seoDesc: 'Room additions and second-story extensions in Orange County. Licensed and fully permitted.',
  },
  {
    slug: 'garageconversion', name: 'Garage Conversion',
    subtitle: 'The most affordable ADU option.',
    desc: 'Convert your garage into a functional living space. Uses existing structure and utilities, keeping costs lower than new construction. Full kitchen, bath, and independent entrance included.',
    processDesc: 'We evaluate your garage structure, design the conversion to maximize livable space, handle all permits including Title 24 energy compliance, then build out the full unit in the shortest timeline of any ADU type.',
    cost: '$75K–$150K', timeline: '3–5 months',
    title: 'Garage Conversion — Avorino Construction',
    seoDesc: 'Garage conversions in Orange County starting at $75K. Fully permitted by Avorino.',
  },
  {
    slug: 'commercial', name: 'Commercial Construction',
    subtitle: 'Tenant improvements and renovations.',
    desc: 'Office buildouts, retail renovations, and tenant improvements. Functional, visually compelling commercial spaces delivered on time and within budget.',
    processDesc: 'We work with your architect or provide design-build services, manage all commercial permits and inspections, then execute the buildout with minimal disruption to adjacent tenants.',
    cost: 'Varies', timeline: 'Varies',
    title: 'Commercial Construction — Avorino Construction',
    seoDesc: 'Tenant improvements and commercial renovations in Orange County by Avorino.',
  },
  {
    slug: 'buildadu2024', name: 'Build an ADU in 2024',
    subtitle: 'Everything you need to know about building an ADU this year.',
    desc: 'California\u2019s latest ADU regulations make it easier than ever to add a unit to your property. From streamlined permitting to pre-approved plans, 2024 is the ideal year to build.',
    processDesc: 'We evaluate your lot, design to current code, handle city permits with expedited timelines, and build your ADU from foundation to final inspection \u2014 typically 10\u201314 months total.',
    cost: '$150K\u2013$450K+', timeline: '10\u201314 months',
    title: 'Build an ADU in 2024 \u2014 Avorino Construction',
    seoDesc: 'Build an ADU in Orange County in 2024. Streamlined permits, pre-approved plans, and full-service construction by Avorino.',
  },
  {
    slug: 'realrendering', name: '3D Rendering Services',
    subtitle: 'Photorealistic visualizations of your project before construction begins.',
    desc: 'See your project before it\u2019s built. Our 3D rendering service produces photorealistic interior and exterior visualizations, helping you make confident design decisions and secure financing.',
    processDesc: 'Share your architectural plans and design preferences. We produce high-resolution 3D renders within 5\u20137 business days, with two rounds of revisions included.',
    cost: 'Starting at $1,500', timeline: '5\u20137 business days',
    title: '3D Rendering Services \u2014 Avorino Construction',
    seoDesc: 'Photorealistic 3D rendering services for construction projects in Orange County by Avorino.',
  },
];

const SVC = SERVICES[SERVICE_INDEX];

const HEAD_CODE = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3cf6b06/avorino-responsive.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3cf6b06/avorino-nav-footer.css">',
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3cf6b06/avorino-animations.js"><\/script>',
  CALENDLY_JS,
].join('\n');

// ── Update panel UI ──
document.getElementById('page-name')!.textContent = SVC.name;
const headCodeEl = document.getElementById('head-code');
const footerCodeEl = document.getElementById('footer-code');
if (headCodeEl) headCodeEl.textContent = HEAD_CODE;
if (footerCodeEl) footerCodeEl.textContent = FOOTER_CODE;

// ── Build function ──
async function buildServiceSubPage() {
  clearErrorLog();
  logDetail(`Starting ${SVC.name} page build (v2)...`, 'info');
  const v = await getAvorinVars();

  log('Creating shared styles...');
  const s = await createSharedStyles();

  // ── Page-specific styles ──
  log('Creating page-specific styles...');
  const svHero = await getOrCreateStyle('svsub-hero');
  const svHeroOverlay = await getOrCreateStyle('svsub-hero-overlay');
  const svHeroContent = await getOrCreateStyle('svsub-hero-content');
  const svHeroMeta = await getOrCreateStyle('svsub-hero-meta');
  const svNarrRow = await getOrCreateStyle('svsub-narr-row');
  const svNarrText = await getOrCreateStyle('svsub-narr-text');
  const svNarrHeading = await getOrCreateStyle('svsub-narr-heading');
  const svNarrBody = await getOrCreateStyle('svsub-narr-body');

  const { body } = await createPageWithSlug(SVC.name, SVC.slug, SVC.title, SVC.seoDesc);

  async function applyStyleProperties() {
    log('Setting shared style properties...');
    await setSharedStyleProps(s, v);
    await wait(1000);

    log('Setting page-specific style properties...');

    // Hero: full-width image area with text at bottom
    await clearAndSet(await freshStyle('svsub-hero'), 'svsub-hero', {
      'min-height': '70vh', 'display': 'flex', 'align-items': 'flex-end',
      'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    // Subtle gradient overlay at bottom for text readability
    await clearAndSet(await freshStyle('svsub-hero-overlay'), 'svsub-hero-overlay', {
      'position': 'absolute', 'left': '0px', 'right': '0px', 'bottom': '0px',
      'height': '60%',
      'background-image': 'linear-gradient(transparent, rgba(17,17,17,0.9))',
    });
    await clearAndSet(await freshStyle('svsub-hero-content'), 'svsub-hero-content', {
      'position': 'relative', 'z-index': '2', 'max-width': '700px',
    });
    await clearAndSet(await freshStyle('svsub-hero-meta'), 'svsub-hero-meta', {
      'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
      'opacity': '0.4', 'margin-top': '24px',
    });
    await wait(500);

    // Narrative rows (alternating image+text)
    await clearAndSet(await freshStyle('svsub-narr-row'), 'svsub-narr-row', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr',
      'grid-column-gap': '96px', 'grid-row-gap': '48px', 'align-items': 'center',
    });
    await clearAndSet(await freshStyle('svsub-narr-text'), 'svsub-narr-text', {
      'display': 'flex', 'flex-direction': 'column',
    });
    await clearAndSet(await freshStyle('svsub-narr-heading'), 'svsub-narr-heading', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
      'line-height': '1.12', 'font-weight': '400', 'margin-bottom': '16px',
    });
    await clearAndSet(await freshStyle('svsub-narr-body'), 'svsub-narr-body', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.9', 'opacity': '0.6',
    });
    await wait(500);

    await applyCTAStyleProps(v);
  }

  // ═══════════════ BUILD ELEMENTS ═══════════════

  // SECTION 1: IMAGE HERO (dark, full-width image bg area)
  log('Building Section 1: Image Hero...');
  const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
  hero.setTag('section');
  hero.setStyles([svHero]);
  hero.setAttribute('id', 'svsub-hero');

  // Gradient overlay
  const overlay = hero.append(webflow.elementPresets.DOM);
  overlay.setTag('div');
  overlay.setStyles([svHeroOverlay]);

  // Content at bottom
  const heroC = hero.append(webflow.elementPresets.DOM);
  heroC.setTag('div');
  heroC.setStyles([svHeroContent]);

  const heroH = heroC.append(webflow.elementPresets.DOM);
  heroH.setTag('h1');
  heroH.setStyles([s.headingXL]);
  heroH.setTextContent(SVC.name);
  heroH.setAttribute('data-animate', 'word-stagger-elastic');

  const heroSub = heroC.append(webflow.elementPresets.DOM);
  heroSub.setTag('p');
  heroSub.setStyles([s.body, s.bodyMuted]);
  heroSub.setTextContent(SVC.subtitle);
  heroSub.setAttribute('data-animate', 'fade-up');

  // Inline cost + timeline metadata
  const heroMeta = heroC.append(webflow.elementPresets.DOM);
  heroMeta.setTag('div');
  heroMeta.setStyles([svHeroMeta]);
  heroMeta.setTextContent(`${SVC.cost} | ${SVC.timeline}`);
  heroMeta.setAttribute('data-animate', 'fade-up');

  await safeCall('append:hero', () => body.append(hero));
  logDetail('Section 1: Image Hero appended', 'ok');

  // SECTION 2: SERVICE NARRATIVE (warm bg, 2 alternating rows)
  log('Building Section 2: Service Narrative...');
  const narrSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  narrSection.setTag('section');
  narrSection.setStyles([s.section, s.sectionWarm]);
  narrSection.setAttribute('id', 'svsub-narrative');

  // Row 1: image left, text right (overview)
  const row1 = narrSection.append(webflow.elementPresets.DOM);
  row1.setTag('div');
  row1.setStyles([svNarrRow]);
  row1.setAttribute('data-animate', 'fade-up');

  const row1Img = row1.append(webflow.elementPresets.DOM);
  row1Img.setTag('div');
  row1Img.setStyles([s.imgLandscape]);

  const row1Text = row1.append(webflow.elementPresets.DOM);
  row1Text.setTag('div');
  row1Text.setStyles([svNarrText]);

  const row1H = row1Text.append(webflow.elementPresets.DOM);
  row1H.setTag('h2');
  row1H.setStyles([svNarrHeading]);
  row1H.setTextContent('What we build');

  const row1P = row1Text.append(webflow.elementPresets.DOM);
  row1P.setTag('p');
  row1P.setStyles([svNarrBody]);
  row1P.setTextContent(SVC.desc);

  // Divider
  const div1 = narrSection.append(webflow.elementPresets.DOM);
  div1.setTag('div');
  div1.setStyles([s.divider]);

  // Row 2: text left, image right (process)
  const row2 = narrSection.append(webflow.elementPresets.DOM);
  row2.setTag('div');
  row2.setStyles([svNarrRow]);
  row2.setAttribute('data-animate', 'fade-up');

  const row2Text = row2.append(webflow.elementPresets.DOM);
  row2Text.setTag('div');
  row2Text.setStyles([svNarrText]);

  const row2H = row2Text.append(webflow.elementPresets.DOM);
  row2H.setTag('h2');
  row2H.setStyles([svNarrHeading]);
  row2H.setTextContent('How we build it');

  const row2P = row2Text.append(webflow.elementPresets.DOM);
  row2P.setTag('p');
  row2P.setStyles([svNarrBody]);
  row2P.setTextContent(SVC.processDesc);

  const row2Img = row2.append(webflow.elementPresets.DOM);
  row2Img.setTag('div');
  row2Img.setStyles([s.imgLandscape]);

  await safeCall('append:narrative', () => body.append(narrSection));
  logDetail('Section 2: Narrative appended', 'ok');

  // SECTION 3: CTA
  log('Building Section 3: CTA...');
  await buildCTASection(
    body, v,
    'Book a consultation',
    'Schedule a Meeting', '/schedule-a-meeting',
    'Call Us', 'tel:7149003676',
  );

  await applyStyleProperties();

  log(`${SVC.name} page built!`, 'success');
  await webflow.notify({ type: 'Success', message: `${SVC.name} page created!` });
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
  try { await buildServiceSubPage(); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
