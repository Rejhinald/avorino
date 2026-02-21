// ════════════════════════════════════════════════════════════════
// Avorino Builder — FINANCING PAGE (v2 redesign)
// Split hero with image + stacked text blocks with dividers
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
const PAGE_NAME = 'Financing';
const PAGE_SLUG = 'financing';
const PAGE_TITLE = '100% Financing Available — Avorino Construction';
const PAGE_DESC = 'Build now, pay over time. ADU and construction financing options in Orange County.';
const HEAD_CODE = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3f8063a/avorino-responsive.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3f8063a/avorino-nav-footer.css">',
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3f8063a/avorino-animations.js"><\/script>',
  CALENDLY_JS,
].join('\n');

// ── Update panel UI ──
document.getElementById('page-name')!.textContent = PAGE_NAME;
const headCodeEl = document.getElementById('head-code');
const footerCodeEl = document.getElementById('footer-code');
if (headCodeEl) headCodeEl.textContent = HEAD_CODE;
if (footerCodeEl) footerCodeEl.textContent = FOOTER_CODE;

// ── Content data ──
const BENEFITS = [
  { title: 'Up to 100% project financing', desc: 'Cover your entire project cost without a large down payment. Our lending partners offer competitive rates for ADU construction, custom homes, and major renovations.' },
  { title: 'Leverage your property equity', desc: 'Use your home equity plus credit to qualify for favorable terms. Most Orange County homeowners already have the equity needed to build.' },
  { title: 'Positive monthly cash flow', desc: 'ADU rental income in Orange County ranges $2K–$4.5K/month — often exceeding your monthly loan payment from day one.' },
];

// ── Build function ──
async function buildFinancingPage() {
  clearErrorLog();
  logDetail('Starting Financing page build (v2)...', 'info');
  const v = await getAvorinVars();

  log('Creating shared styles...');
  const s = await createSharedStyles();

  // ── Page-specific styles ──
  log('Creating financing-specific styles...');
  const finHero = await getOrCreateStyle('fin-hero');
  const finHeroContent = await getOrCreateStyle('fin-hero-content');
  const finBenefitTitle = await getOrCreateStyle('fin-benefit-title');
  const finBenefitDesc = await getOrCreateStyle('fin-benefit-desc');
  const finProcessInline = await getOrCreateStyle('fin-process-inline');

  const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);

  async function applyStyleProperties() {
    log('Setting shared style properties...');
    await setSharedStyleProps(s, v);
    await wait(1000);

    log('Setting financing-specific style properties...');

    // Hero: dark, split layout (text left, image right)
    await clearAndSet(await freshStyle('fin-hero'), 'fin-hero', {
      'display': 'grid', 'grid-template-columns': '1.5fr 1fr',
      'grid-column-gap': '96px', 'grid-row-gap': '64px', 'align-items': 'center',
      'min-height': '70vh',
      'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'background-color': v['av-dark'], 'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('fin-hero-content'), 'fin-hero-content', {
      'max-width': '640px',
    });
    await wait(500);

    // Benefit text blocks
    await clearAndSet(await freshStyle('fin-benefit-title'), 'fin-benefit-title', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
      'line-height': '1.12', 'font-weight': '400', 'margin-bottom': '16px',
    });
    await clearAndSet(await freshStyle('fin-benefit-desc'), 'fin-benefit-desc', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.9', 'opacity': '0.6',
    });
    // Inline process summary
    await clearAndSet(await freshStyle('fin-process-inline'), 'fin-process-inline', {
      'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
      'opacity': '0.4', 'text-align': 'center', 'margin-top': '24px',
    });
    await wait(500);

    await applyCTAStyleProps(v);
  }

  // ═══════════════ BUILD ELEMENTS ═══════════════

  // SECTION 1: SPLIT HERO (dark, text left + image right)
  log('Building Section 1: Split Hero...');
  const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
  hero.setTag('section');
  hero.setStyles([finHero]);
  hero.setAttribute('id', 'fin-hero');

  // Left: text
  const heroC = hero.append(webflow.elementPresets.DOM);
  heroC.setTag('div');
  heroC.setStyles([finHeroContent]);

  const heroLabel = heroC.append(webflow.elementPresets.DOM);
  heroLabel.setTag('div');
  heroLabel.setStyles([s.label]);
  heroLabel.setAttribute('data-animate', 'fade-up');
  const heroLabelTxt = heroLabel.append(webflow.elementPresets.DOM);
  heroLabelTxt.setTag('div');
  heroLabelTxt.setTextContent('// Financing');

  const heroH = heroC.append(webflow.elementPresets.DOM);
  heroH.setTag('h1');
  heroH.setStyles([s.headingXL]);
  heroH.setTextContent('Build now, pay over time');
  heroH.setAttribute('data-animate', 'word-stagger-elastic');

  const heroSub = heroC.append(webflow.elementPresets.DOM);
  heroSub.setTag('p');
  heroSub.setStyles([s.body, s.bodyMuted]);
  heroSub.setTextContent('Up to 100% financing for your ADU or construction project. Leverage your property equity to build without a large upfront cost.');
  heroSub.setAttribute('data-animate', 'fade-up');

  // Right: tall image placeholder
  const heroImg = hero.append(webflow.elementPresets.DOM);
  heroImg.setTag('div');
  heroImg.setStyles([s.imgTall]);
  heroImg.setAttribute('data-animate', 'parallax-depth');

  await safeCall('append:hero', () => body.append(hero));
  logDetail('Section 1: Split Hero appended', 'ok');

  // SECTION 2: BENEFITS + PROCESS (cream bg, stacked text blocks with dividers)
  log('Building Section 2: Benefits...');
  const benefitsSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  benefitsSection.setTag('section');
  benefitsSection.setStyles([s.section, s.sectionCream]);
  benefitsSection.setAttribute('id', 'fin-benefits');

  // Benefits as stacked text blocks
  BENEFITS.forEach((b, i) => {
    if (i > 0) {
      const div = benefitsSection.append(webflow.elementPresets.DOM);
      div.setTag('div');
      div.setStyles([s.divider]);
    }

    const block = benefitsSection.append(webflow.elementPresets.DOM);
    block.setTag('div');
    block.setAttribute('data-animate', 'fade-up');

    const title = block.append(webflow.elementPresets.DOM);
    title.setTag('h3');
    title.setStyles([finBenefitTitle]);
    title.setTextContent(b.title);

    const desc = block.append(webflow.elementPresets.DOM);
    desc.setTag('p');
    desc.setStyles([finBenefitDesc]);
    desc.setTextContent(b.desc);
  });

  // Inline process note
  const processNote = benefitsSection.append(webflow.elementPresets.DOM);
  processNote.setTag('p');
  processNote.setStyles([finProcessInline]);
  processNote.setTextContent('Apply \u2192 Get approved \u2192 Construction begins');
  processNote.setAttribute('data-animate', 'fade-up');

  await safeCall('append:benefits', () => body.append(benefitsSection));
  logDetail('Section 2: Benefits appended', 'ok');

  // SECTION 3: CTA
  log('Building Section 3: CTA...');
  await buildCTASection(
    body, v,
    'Get pre-qualified',
    'Apply Now', '/schedule-a-meeting',
    'Call Us', 'tel:7149003676',
  );

  await applyStyleProperties();

  log('Financing page built!', 'success');
  await webflow.notify({ type: 'Success', message: 'Financing page created!' });
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
  try { await buildFinancingPage(); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
