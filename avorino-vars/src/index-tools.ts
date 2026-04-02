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
    subtitle: 'Get an instant, detailed cost breakdown for your ADU project — by city, size, finish level, and ADU type. Powered by real 2025 Orange County construction data.',
    embedUrl: 'https://aducost.avorino.com/',
    title: 'ADU Cost Estimator — Avorino', seoDesc: 'Estimate your ADU construction cost in Orange County.',
    preview: 'cost',
  },
  {
    slug: 'roi-calculator', name: 'ROI Calculator',
    subtitle: 'See your projected rental income, property value increase, and payback timeline. Make confident investment decisions backed by real Orange County market data.',
    embedUrl: 'https://roi-estimator.avorino.com/',
    title: 'ROI Calculator — Avorino', seoDesc: 'Calculate ADU return on investment for your Orange County property.',
    preview: 'roi',
  },
  {
    slug: 'adu-eligibility', name: 'ADU Loan Qualifier',
    subtitle: 'Check your financing eligibility in 60 seconds. Get personalized loan options, interest rates, and monthly payment estimates tailored to your property and budget.',
    embedUrl: 'https://aduloan.avorino.com/',
    title: 'ADU Loan Qualifier — Avorino', seoDesc: 'Check ADU eligibility and loan qualification for your Orange County property.',
    preview: 'loan',
  },
];

const TOOL = TOOLS[TOOL_INDEX];
const OTHER_TOOLS = TOOLS.filter((_, i) => i !== TOOL_INDEX);

const HEAD_CODE = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@b14c0ca/avorino-responsive.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@b14c0ca/avorino-nav-footer.css">',
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@b14c0ca/avorino-animations.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@b14c0ca/avorino-tools-footer.js"><\/script>',
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
  const tlCanvasWrap = await getOrCreateStyle('tl-canvas-wrap');
  const tlContentOverlay = await getOrCreateStyle('tl-content-overlay');
  const tlHeroContent = await getOrCreateStyle('tl-hero-content');
  const tlHeroLabel = await getOrCreateStyle('tl-hero-label');
  const tlHeroGoldLine = await getOrCreateStyle('tl-hero-gold-line');
  const tlHeroSubtitle = await getOrCreateStyle('tl-hero-subtitle');
  const tlHeroScrollHint = await getOrCreateStyle('tl-hero-scroll-hint');
  const tlHeroScrollLine = await getOrCreateStyle('tl-hero-scroll-line');
  const tlEmbed = await getOrCreateStyle('tl-embed');
  const tlIframe = await getOrCreateStyle('tl-iframe');
  const tlRelatedGrid = await getOrCreateStyle('tl-related-grid');
  const tlRelatedCard = await getOrCreateStyle('tl-related-card');
  const tlRelatedPreview = await getOrCreateStyle('tl-related-preview');
  const tlRelatedTitle = await getOrCreateStyle('tl-related-title');
  const tlRelatedDesc = await getOrCreateStyle('tl-related-desc');
  const tlRelatedCta = await getOrCreateStyle('tl-related-cta');
  const tlPreviewBar = await getOrCreateStyle('tl-preview-bar');
  const tlPreviewBarAccent = await getOrCreateStyle('tl-preview-bar-accent');
  const tlPreviewRow = await getOrCreateStyle('tl-preview-row');
  const tlPreviewLabel = await getOrCreateStyle('tl-preview-label');
  const tlPreviewValue = await getOrCreateStyle('tl-preview-value');
  const tlPreviewGauge = await getOrCreateStyle('tl-preview-gauge');
  const tlPreviewGaugeFill = await getOrCreateStyle('tl-preview-gauge-fill');
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
      'min-height': '80vh', 'display': 'flex', 'align-items': 'flex-end',
      'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('tl-canvas-wrap'), 'tl-canvas-wrap', {
      'position': 'absolute', 'top': '0px', 'left': '0px',
      'width': '100%', 'height': '100%',
      'z-index': '1', 'pointer-events': 'none',
      'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('tl-content-overlay'), 'tl-content-overlay', {
      'position': 'relative', 'z-index': '2',
    });
    await clearAndSet(await freshStyle('tl-hero-content'), 'tl-hero-content', {
      'max-width': '700px',
    });
    await clearAndSet(await freshStyle('tl-hero-label'), 'tl-hero-label', {
      'font-family': 'DM Sans', 'font-size': v['av-text-xs'],
      'letter-spacing': '0.3em', 'text-transform': 'uppercase',
      'opacity': '0', 'margin-bottom': '32px', 'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('tl-hero-gold-line'), 'tl-hero-gold-line', {
      'width': '0px', 'height': '1px',
      'background-color': '#c9a96e', 'margin-bottom': '24px',
    });
    await clearAndSet(await freshStyle('tl-hero-subtitle'), 'tl-hero-subtitle', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.9', 'opacity': '0', 'margin-top': '24px',
      'color': v['av-cream'], 'max-width': '560px',
    });
    await clearAndSet(await freshStyle('tl-hero-scroll-hint'), 'tl-hero-scroll-hint', {
      'position': 'absolute', 'bottom': '40px', 'left': '50%',
      'z-index': '3', 'display': 'flex', 'flex-direction': 'column',
      'align-items': 'center', 'grid-row-gap': '8px', 'opacity': '0',
    });
    await clearAndSet(await freshStyle('tl-hero-scroll-line'), 'tl-hero-scroll-line', {
      'width': '1px', 'height': '40px', 'background-color': '#c9a96e',
    });
    await wait(500);

    // Embed container — full viewport
    await clearAndSet(await freshStyle('tl-embed'), 'tl-embed', {
      'width': '100vw', 'margin-left': 'calc(-50vw + 50%)',
    });
    await clearAndSet(await freshStyle('tl-iframe'), 'tl-iframe', {
      'width': '100%', 'height': '100vh', 'min-height': '700px',
      'overflow-x': 'hidden', 'overflow-y': 'hidden',
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
      'text-decoration': 'none', 'display': 'flex', 'flex-direction': 'column',
      'grid-row-gap': '24px', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('tl-related-preview'), 'tl-related-preview', {
      'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '8px',
      'padding-top': '20px', 'padding-bottom': '20px', 'padding-left': '20px', 'padding-right': '20px',
      'border-top-left-radius': '8px', 'border-top-right-radius': '8px',
      'border-bottom-left-radius': '8px', 'border-bottom-right-radius': '8px',
      'background-color': 'rgba(201, 169, 110, 0.04)',
    });
    await clearAndSet(await freshStyle('tl-related-title'), 'tl-related-title', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
      'line-height': '1.12', 'font-weight': '400',
      'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('tl-related-desc'), 'tl-related-desc', {
      'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
      'line-height': '1.7', 'opacity': '0.5', 'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('tl-related-cta'), 'tl-related-cta', {
      'font-family': 'DM Sans', 'font-size': '14px', 'font-weight': '500',
      'letter-spacing': '0.08em', 'text-transform': 'uppercase',
      'color': 'rgba(201, 169, 110, 0.7)', 'margin-top': '8px',
    });
    await clearAndSet(await freshStyle('tl-preview-bar'), 'tl-preview-bar', {
      'height': '3px',
      'border-top-left-radius': '2px', 'border-top-right-radius': '2px',
      'border-bottom-left-radius': '2px', 'border-bottom-right-radius': '2px',
      'background-color': 'rgba(201, 169, 110, 0.2)',
    });
    await clearAndSet(await freshStyle('tl-preview-bar-accent'), 'tl-preview-bar-accent', {
      'background-color': 'rgba(201, 169, 110, 0.45)',
    });
    await clearAndSet(await freshStyle('tl-preview-row'), 'tl-preview-row', {
      'display': 'flex', 'justify-content': 'space-between', 'align-items': 'baseline',
    });
    await clearAndSet(await freshStyle('tl-preview-label'), 'tl-preview-label', {
      'font-family': 'DM Sans', 'font-size': '11px', 'font-weight': '500',
      'letter-spacing': '0.15em', 'text-transform': 'uppercase',
      'color': 'rgba(240, 237, 232, 0.3)',
    });
    await clearAndSet(await freshStyle('tl-preview-value'), 'tl-preview-value', {
      'font-family': 'DM Serif Display', 'font-size': '22px',
      'color': 'rgba(201, 169, 110, 0.7)', 'letter-spacing': '-0.02em',
    });
    await clearAndSet(await freshStyle('tl-preview-gauge'), 'tl-preview-gauge', {
      'width': '48px', 'height': '48px',
      'border-top-left-radius': '50%', 'border-top-right-radius': '50%',
      'border-bottom-left-radius': '50%', 'border-bottom-right-radius': '50%',
      'border-top-width': '2px', 'border-bottom-width': '2px',
      'border-left-width': '2px', 'border-right-width': '2px',
      'border-top-color': 'rgba(201, 169, 110, 0.1)', 'border-bottom-color': 'rgba(201, 169, 110, 0.1)',
      'border-left-color': 'rgba(201, 169, 110, 0.1)', 'border-right-color': 'rgba(201, 169, 110, 0.1)',
      'border-top-style': 'solid', 'border-bottom-style': 'solid',
      'border-left-style': 'solid', 'border-right-style': 'solid',
      'position': 'relative',
    });
    await clearAndSet(await freshStyle('tl-preview-gauge-fill'), 'tl-preview-gauge-fill', {
      'position': 'absolute', 'top': '-2px', 'left': '-2px', 'right': '-2px', 'bottom': '-2px',
      'border-top-left-radius': '50%', 'border-top-right-radius': '50%',
      'border-bottom-left-radius': '50%', 'border-bottom-right-radius': '50%',
      'border-top-width': '2px', 'border-bottom-width': '2px',
      'border-left-width': '2px', 'border-right-width': '2px',
      'border-top-color': 'rgba(201, 169, 110, 0.5)', 'border-right-color': 'rgba(201, 169, 110, 0.3)',
      'border-bottom-color': 'transparent', 'border-left-color': 'transparent',
      'border-top-style': 'solid', 'border-bottom-style': 'solid',
      'border-left-style': 'solid', 'border-right-style': 'solid',
    });
    await wait(500);

    await clearAndSet(await freshStyle('tl-mb-32'), 'tl-mb-32', { 'margin-bottom': v['av-gap-sm'] });
    await clearAndSet(await freshStyle('tl-mb-64'), 'tl-mb-64', { 'margin-bottom': v['av-gap-md'] });
    await clearAndSet(await freshStyle('tl-label-line'), 'tl-label-line', { 'flex-grow': '1', 'height': '1px', 'background-color': v['av-dark-15'] });

    await applyCTAStyleProps(v);
  }

  // ═══════════════ BUILD ELEMENTS ═══════════════

  // SECTION 1: HERO (with Three.js canvas)
  log('Building Section 1: Hero...');
  const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
  hero.setTag('section');
  hero.setStyles([tlHero]);
  hero.setAttribute('id', 'tl-hero');

  // Canvas wrapper for Three.js (layer 1)
  const heroCanvasWrap = hero.append(webflow.elementPresets.DOM);
  heroCanvasWrap.setTag('div');
  heroCanvasWrap.setStyles([tlCanvasWrap]);
  heroCanvasWrap.setAttribute('id', 'hero-canvas');

  // Content overlay (layer 2)
  const heroOverlay = hero.append(webflow.elementPresets.DOM);
  heroOverlay.setTag('div');
  heroOverlay.setStyles([tlContentOverlay, tlHeroContent]);

  const heroLabel = heroOverlay.append(webflow.elementPresets.DOM);
  heroLabel.setTag('div');
  heroLabel.setStyles([tlHeroLabel]);
  heroLabel.setTextContent(`// ${TOOL.name}`);
  heroLabel.setAttribute('data-animate', 'fade-up');

  const heroH = heroOverlay.append(webflow.elementPresets.DOM);
  heroH.setTag('h1');
  heroH.setStyles([s.headingXL]);
  heroH.setTextContent(TOOL.name);
  heroH.setAttribute('data-animate', 'blur-focus');

  const heroGoldLine = heroOverlay.append(webflow.elementPresets.DOM);
  heroGoldLine.setTag('div');
  heroGoldLine.setStyles([tlHeroGoldLine]);

  const heroSub = heroOverlay.append(webflow.elementPresets.DOM);
  heroSub.setTag('p');
  heroSub.setStyles([tlHeroSubtitle]);
  heroSub.setTextContent(TOOL.subtitle);
  heroSub.setAttribute('data-animate', 'fade-up');

  // Scroll hint
  const scrollHint = hero.append(webflow.elementPresets.DOM);
  scrollHint.setTag('div');
  scrollHint.setStyles([tlHeroScrollHint]);
  scrollHint.setAttribute('data-animate', 'fade-up');
  const scrollHintText = scrollHint.append(webflow.elementPresets.DOM);
  scrollHintText.setTag('span');
  scrollHintText.setTextContent('Scroll');
  const scrollHintLine = scrollHint.append(webflow.elementPresets.DOM);
  scrollHintLine.setTag('div');
  scrollHintLine.setStyles([tlHeroScrollLine]);

  await safeCall('append:hero', () => body.append(hero));

  // SECTION 2: EMBED (warm bg — uses div with inline iframe via custom code)
  log('Building Section 2: Embed...');
  const embedSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  embedSection.setTag('section');
  embedSection.setStyles([s.section, s.sectionWarm]);
  embedSection.setAttribute('id', 'tl-embed');

  const embedWrap = embedSection.append(webflow.elementPresets.DOM);
  embedWrap.setTag('div');
  embedWrap.setStyles([tlEmbed]);

  // Webflow Designer API doesn't support setTag('iframe'), so we use a
  // styled div container. The actual iframe is injected via page custom code
  // or Webflow's native Embed element after the page is built.
  const iframeHolder = embedWrap.append(webflow.elementPresets.DOM);
  iframeHolder.setTag('div');
  iframeHolder.setStyles([tlIframe]);
  iframeHolder.setAttribute('id', 'tool-iframe-holder');
  iframeHolder.setAttribute('data-embed-url', TOOL.embedUrl);
  iframeHolder.setAttribute('data-embed-title', TOOL.name);

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

    // CSS preview visual
    const preview = card.append(webflow.elementPresets.DOM);
    preview.setTag('div');
    preview.setStyles([tlRelatedPreview]);

    if (tool.preview === 'cost') {
      // Cost preview: 3 bars + estimated total
      const bar1 = preview.append(webflow.elementPresets.DOM);
      bar1.setTag('div'); bar1.setStyles([tlPreviewBar]);
      bar1.setAttribute('style', 'width:65%');
      const bar2 = preview.append(webflow.elementPresets.DOM);
      bar2.setTag('div'); bar2.setStyles([tlPreviewBar]);
      bar2.setAttribute('style', 'width:40%');
      const bar3 = preview.append(webflow.elementPresets.DOM);
      bar3.setTag('div'); bar3.setStyles([tlPreviewBar, tlPreviewBarAccent]);
      bar3.setAttribute('style', 'width:85%');
      const row = preview.append(webflow.elementPresets.DOM);
      row.setTag('div'); row.setStyles([tlPreviewRow]);
      const lbl = row.append(webflow.elementPresets.DOM);
      lbl.setTag('span'); lbl.setStyles([tlPreviewLabel]); lbl.setTextContent('Estimated Cost');
      const val = row.append(webflow.elementPresets.DOM);
      val.setTag('span'); val.setStyles([tlPreviewValue]); val.setTextContent('$185K');
    } else if (tool.preview === 'roi') {
      // ROI preview: stat row + bars
      const row = preview.append(webflow.elementPresets.DOM);
      row.setTag('div'); row.setStyles([tlPreviewRow]);
      const lbl = row.append(webflow.elementPresets.DOM);
      lbl.setTag('span'); lbl.setStyles([tlPreviewLabel]); lbl.setTextContent('Annual Return');
      const val = row.append(webflow.elementPresets.DOM);
      val.setTag('span'); val.setStyles([tlPreviewValue]); val.setTextContent('18.4%');
      const bar1 = preview.append(webflow.elementPresets.DOM);
      bar1.setTag('div'); bar1.setStyles([tlPreviewBar]);
      bar1.setAttribute('style', 'width:35%');
      const bar2 = preview.append(webflow.elementPresets.DOM);
      bar2.setTag('div'); bar2.setStyles([tlPreviewBar]);
      bar2.setAttribute('style', 'width:55%');
      const bar3 = preview.append(webflow.elementPresets.DOM);
      bar3.setTag('div'); bar3.setStyles([tlPreviewBar, tlPreviewBarAccent]);
      bar3.setAttribute('style', 'width:100%');
    } else if (tool.preview === 'loan') {
      // Loan preview: gauge + amount
      const row = preview.append(webflow.elementPresets.DOM);
      row.setTag('div'); row.setStyles([tlPreviewRow]);
      const gauge = row.append(webflow.elementPresets.DOM);
      gauge.setTag('div'); gauge.setStyles([tlPreviewGauge]);
      const gaugeFill = gauge.append(webflow.elementPresets.DOM);
      gaugeFill.setTag('div'); gaugeFill.setStyles([tlPreviewGaugeFill]);
      const val = row.append(webflow.elementPresets.DOM);
      val.setTag('span'); val.setStyles([tlPreviewValue]); val.setTextContent('$350K');
      const lbl = preview.append(webflow.elementPresets.DOM);
      lbl.setTag('span'); lbl.setStyles([tlPreviewLabel]); lbl.setTextContent('Pre-Qualified');
    }

    const title = card.append(webflow.elementPresets.DOM);
    title.setTag('h3');
    title.setStyles([tlRelatedTitle]);
    title.setTextContent(tool.name);

    const desc = card.append(webflow.elementPresets.DOM);
    desc.setTag('p');
    desc.setStyles([tlRelatedDesc]);
    desc.setTextContent(tool.subtitle);

    const cta = card.append(webflow.elementPresets.DOM);
    cta.setTag('span');
    cta.setStyles([tlRelatedCta]);
    cta.setTextContent('Try This Tool →');
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
