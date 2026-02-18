// ════════════════════════════════════════════════════════════════
// Avorino Builder — TOOL EMBED PAGE TEMPLATE
// Rename this to index.ts to build a tool embed page.
// Change TOOL_INDEX below:
//   0 = ADU Cost Estimator (/adu-cost-estimator)
//   1 = ROI Calculator (/roi-calculator)
//   2 = ADU Eligibility (/adu-eligibility)
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog, wait,
  safeCall, getAvorinVars, getOrCreateStyle, freshStyle,
  clearAndSet, createSharedStyles, setSharedStyleProps,
  createAllVariables, createPageWithSlug,
  buildCTASection, applyCTAStyleProps,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

// ═══ CHANGE THIS INDEX TO BUILD A DIFFERENT TOOL PAGE ═══
const TOOL_INDEX = 0;

const TOOLS = [
  {
    slug: 'adu-cost-estimator', name: 'ADU Cost Estimator',
    subtitle: 'Get an instant estimate for your ADU project.',
    embedUrl: 'https://aducost.avorino.com/',
    title: 'ADU Cost Estimator — Avorino', seoDesc: 'Estimate your ADU construction cost in Orange County.',
  },
  {
    slug: 'roi-calculator', name: 'ROI Calculator',
    subtitle: 'Calculate your return on investment for an ADU.',
    embedUrl: 'https://roi-estimator.avorino.com/',
    title: 'ROI Calculator — Avorino', seoDesc: 'Calculate ADU return on investment for your Orange County property.',
  },
  {
    slug: 'adu-eligibility', name: 'ADU Eligibility',
    subtitle: 'Check if your property qualifies for an ADU.',
    embedUrl: 'https://loan.aduportal.com/',
    title: 'ADU Eligibility Check — Avorino', seoDesc: 'Check ADU eligibility and loan qualification for your Orange County property.',
  },
];

const TOOL = TOOLS[TOOL_INDEX];
const OTHER_TOOLS = TOOLS.filter((_, i) => i !== TOOL_INDEX);

const HEAD_CODE = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@91090e8/avorino-responsive.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@91090e8/avorino-nav-footer.css">',
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@91090e8/avorino-animations.js"><\/script>',
  CALENDLY_JS,
].join('\n');

document.getElementById('page-name')!.textContent = TOOL.name;
const headCodeEl = document.getElementById('head-code');
const footerCodeEl = document.getElementById('footer-code');
if (headCodeEl) headCodeEl.textContent = HEAD_CODE;
if (footerCodeEl) footerCodeEl.textContent = FOOTER_CODE;

async function buildToolPage() {
  clearErrorLog();
  logDetail(`Starting ${TOOL.name} page build...`, 'info');
  const v = await getAvorinVars();

  log('Creating shared styles...');
  const s = await createSharedStyles();

  log('Creating page-specific styles...');
  const tlHero = await getOrCreateStyle('tl-hero');
  const tlHeroContent = await getOrCreateStyle('tl-hero-content');
  const tlEmbed = await getOrCreateStyle('tl-embed');
  const tlIframe = await getOrCreateStyle('tl-iframe');
  const tlRelatedGrid = await getOrCreateStyle('tl-related-grid');
  const tlRelatedCard = await getOrCreateStyle('tl-related-card');
  const tlRelatedTitle = await getOrCreateStyle('tl-related-title');
  const tlRelatedDesc = await getOrCreateStyle('tl-related-desc');
  const tlMb32 = await getOrCreateStyle('tl-mb-32');
  const tlMb64 = await getOrCreateStyle('tl-mb-64');
  const tlLabelLine = await getOrCreateStyle('tl-label-line');

  const { body } = await createPageWithSlug(TOOL.name, TOOL.slug, TOOL.title, TOOL.seoDesc);

  async function applyStyleProperties() {
    log('Setting shared style properties...');
    await setSharedStyleProps(s, v);
    await wait(1000);

    log('Setting page-specific style properties...');

    await clearAndSet(await freshStyle('tl-hero'), 'tl-hero', {
      'min-height': '30vh', 'display': 'flex', 'align-items': 'flex-end',
      'padding-top': '160px', 'padding-bottom': v['av-gap-md'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('tl-hero-content'), 'tl-hero-content', {
      'position': 'relative', 'z-index': '2', 'max-width': '600px',
    });
    await wait(500);

    // Embed container
    await clearAndSet(await freshStyle('tl-embed'), 'tl-embed', {
      'max-width': '960px', 'margin-left': 'auto', 'margin-right': 'auto',
    });
    await clearAndSet(await freshStyle('tl-iframe'), 'tl-iframe', {
      'width': '100%', 'min-height': '700px',
      'border-top-width': '0px', 'border-bottom-width': '0px',
      'border-left-width': '0px', 'border-right-width': '0px',
      'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
      'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
    });
    await wait(500);

    // Related tools
    await clearAndSet(await freshStyle('tl-related-grid'), 'tl-related-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr',
      'grid-column-gap': '24px', 'grid-row-gap': '24px',
    });
    await clearAndSet(await freshStyle('tl-related-card'), 'tl-related-card', {
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
      'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
      'padding-top': '48px', 'padding-bottom': '48px',
      'padding-left': '40px', 'padding-right': '40px',
      'text-decoration': 'none', 'display': 'block',
    });
    await clearAndSet(await freshStyle('tl-related-title'), 'tl-related-title', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
      'line-height': '1.12', 'font-weight': '400',
      'margin-bottom': '12px', 'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('tl-related-desc'), 'tl-related-desc', {
      'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
      'line-height': '1.7', 'opacity': '0.6', 'color': v['av-cream'],
    });
    await wait(500);

    await clearAndSet(await freshStyle('tl-mb-32'), 'tl-mb-32', { 'margin-bottom': v['av-gap-sm'] });
    await clearAndSet(await freshStyle('tl-mb-64'), 'tl-mb-64', { 'margin-bottom': v['av-gap-md'] });
    await clearAndSet(await freshStyle('tl-label-line'), 'tl-label-line', { 'flex-grow': '1', 'height': '1px', 'background-color': v['av-dark-15'] });

    await applyCTAStyleProps(v);
  }

  // ═══════════════ BUILD ELEMENTS ═══════════════

  // SECTION 1: HERO (minimal)
  log('Building Section 1: Hero...');
  const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
  hero.setTag('section');
  hero.setStyles([tlHero]);
  hero.setAttribute('id', 'tl-hero');

  const heroC = hero.append(webflow.elementPresets.DOM);
  heroC.setTag('div');
  heroC.setStyles([tlHeroContent]);

  const heroH = heroC.append(webflow.elementPresets.DOM);
  heroH.setTag('h1');
  heroH.setStyles([s.headingLG]);
  heroH.setTextContent(TOOL.name);
  heroH.setAttribute('data-animate', 'opacity-sweep');

  const heroSub = heroC.append(webflow.elementPresets.DOM);
  heroSub.setTag('p');
  heroSub.setStyles([s.body, s.bodyMuted]);
  heroSub.setTextContent(TOOL.subtitle);

  await safeCall('append:hero', () => body.append(hero));

  // SECTION 2: EMBED (warm bg)
  log('Building Section 2: Embed...');
  const embedSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  embedSection.setTag('section');
  embedSection.setStyles([s.section, s.sectionWarm]);
  embedSection.setAttribute('id', 'tl-embed');

  const embedWrap = embedSection.append(webflow.elementPresets.DOM);
  embedWrap.setTag('div');
  embedWrap.setStyles([tlEmbed]);

  const iframe = embedWrap.append(webflow.elementPresets.DOM);
  iframe.setTag('iframe');
  iframe.setStyles([tlIframe]);
  iframe.setAttribute('src', TOOL.embedUrl);
  iframe.setAttribute('title', TOOL.name);
  iframe.setAttribute('loading', 'lazy');

  await safeCall('append:embed', () => body.append(embedSection));

  // SECTION 3: RELATED TOOLS (cream bg)
  log('Building Section 3: Related Tools...');
  const relatedSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  relatedSection.setTag('section');
  relatedSection.setStyles([s.section, s.sectionCream]);
  relatedSection.setAttribute('id', 'tl-related');

  const relHeader = relatedSection.append(webflow.elementPresets.DOM);
  relHeader.setTag('div');
  relHeader.setStyles([tlMb64]);

  const relLabel = relHeader.append(webflow.elementPresets.DOM);
  relLabel.setTag('div');
  relLabel.setStyles([s.label, tlMb32]);
  const relLabelTxt = relLabel.append(webflow.elementPresets.DOM);
  relLabelTxt.setTag('div');
  relLabelTxt.setTextContent('More Tools');
  const relLabelLine = relLabel.append(webflow.elementPresets.DOM);
  relLabelLine.setTag('div');
  relLabelLine.setStyles([tlLabelLine]);

  const relGrid = relatedSection.append(webflow.elementPresets.DOM);
  relGrid.setTag('div');
  relGrid.setStyles([tlRelatedGrid]);

  OTHER_TOOLS.forEach(tool => {
    const card = relGrid.append(webflow.elementPresets.DOM);
    card.setTag('a');
    card.setStyles([tlRelatedCard]);
    card.setAttribute('href', `/${tool.slug}`);
    card.setAttribute('data-animate', 'fade-up');

    const title = card.append(webflow.elementPresets.DOM);
    title.setTag('h3');
    title.setStyles([tlRelatedTitle]);
    title.setTextContent(tool.name);

    const desc = card.append(webflow.elementPresets.DOM);
    desc.setTag('p');
    desc.setStyles([tlRelatedDesc]);
    desc.setTextContent(tool.subtitle);
  });

  await safeCall('append:related', () => body.append(relatedSection));

  // SECTION 4: CTA
  log('Building Section 4: CTA...');
  await buildCTASection(body, v, 'Book a consultation', 'Schedule a Meeting', '/schedule-a-meeting');

  await applyStyleProperties();

  log(`${TOOL.name} page built!`, 'success');
  await webflow.notify({ type: 'Success', message: `${TOOL.name} page created!` });
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
  try { await buildToolPage(); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
