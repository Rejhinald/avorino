// ════════════════════════════════════════════════════════════════
// Avorino Builder — RENOVATIONS PAGE
// Split hero + renovation types + narrative + process + trust + CTA
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, wait, safeCall, getAvorinVars, getOrCreateStyle, freshStyle, clearAndSet, createSharedStyles, setSharedStyleProps, createAllVariables, createPageWithSlug, buildCTASection, applyCTAStyleProps, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
const PAGE_NAME = 'Renovations';
const PAGE_SLUG = 'renovations';
const PAGE_TITLE = 'Home Renovations in Orange County — Avorino Construction';
const PAGE_DESC = 'Kitchen, bathroom, and whole-home renovations in Orange County. Licensed, fully permitted, and built by Avorino.';
const CDN = '6f6b42d';
const HEAD_CODE = [
    `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-responsive.css">`,
    CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
    '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
    `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-animations.js"><\/script>`,
    CALENDLY_JS,
].join('\n');
// ── Content data ──
const RENOVATION_TYPES = [
    { number: '01', title: 'Kitchen Remodel', desc: 'Custom cabinetry, quartz countertops, premium appliances. The kitchen sets the tone for the entire home.' },
    { number: '02', title: 'Bathroom Renovation', desc: 'Walk-in showers, freestanding tubs, heated floors. Spa-level finishes with practical engineering.' },
    { number: '03', title: 'Whole-Home Interior', desc: 'Complete interior transformation. Open floor plans, new flooring, lighting, and finishes throughout every room.' },
    { number: '04', title: 'Room Additions', desc: 'Expand your living space without moving. We match additions seamlessly to your existing home\'s architecture.' },
];
const PROCESS_STEPS = [
    { number: '01', title: 'Design & Planning', desc: 'We assess your space, discuss goals, and create detailed plans with material selections and 3D renderings.' },
    { number: '02', title: 'Permits & Approvals', desc: 'All city permits, plan-check corrections, and HOA approvals handled. No work starts until everything is approved.' },
    { number: '03', title: 'Demo & Prep', desc: 'Controlled demolition, structural modifications, and rough-in for electrical, plumbing, and HVAC.' },
    { number: '04', title: 'Build & Finish', desc: 'Installation of finishes, fixtures, and details. Final inspection, walkthrough, and warranty documentation.' },
];
// ── Panel UI ──
document.getElementById('page-name').textContent = PAGE_NAME;
const headCodeEl = document.getElementById('head-code');
const footerCodeEl = document.getElementById('footer-code');
if (headCodeEl)
    headCodeEl.textContent = HEAD_CODE;
if (footerCodeEl)
    footerCodeEl.textContent = FOOTER_CODE;
// ── Build function ──
async function buildRenovationsPage() {
    clearErrorLog();
    logDetail('Starting Renovations page build...', 'info');
    const v = await getAvorinVars();
    log('Creating shared styles...');
    const s = await createSharedStyles();
    // ── Page-specific styles ──
    log('Creating page-specific styles...');
    const renHero = await getOrCreateStyle('ren-hero');
    const renHeroContent = await getOrCreateStyle('ren-hero-content');
    const renHeroMeta = await getOrCreateStyle('ren-hero-meta');
    const renHeroMetaItem = await getOrCreateStyle('ren-hero-meta-item');
    const renHeroMetaValue = await getOrCreateStyle('ren-hero-meta-value');
    const renHeroMetaLabel = await getOrCreateStyle('ren-hero-meta-label');
    const renTypeRow = await getOrCreateStyle('ren-type-row');
    const renTypeText = await getOrCreateStyle('ren-type-text');
    const renTypeNum = await getOrCreateStyle('ren-type-num');
    const renTypeTitle = await getOrCreateStyle('ren-type-title');
    const renTypeDesc = await getOrCreateStyle('ren-type-desc');
    const renNarrSection = await getOrCreateStyle('ren-narr-section');
    const renNarrText = await getOrCreateStyle('ren-narr-text');
    const renNarrBody = await getOrCreateStyle('ren-narr-body');
    const renStatRow = await getOrCreateStyle('ren-stat-row');
    const renStatValue = await getOrCreateStyle('ren-stat-value');
    const renStatLabel = await getOrCreateStyle('ren-stat-label');
    const renStepRow = await getOrCreateStyle('ren-step-row');
    const renStepNumCol = await getOrCreateStyle('ren-step-num-col');
    const renStepNum = await getOrCreateStyle('ren-step-num');
    const renStepContent = await getOrCreateStyle('ren-step-content');
    const renStepTitle = await getOrCreateStyle('ren-step-title');
    const renStepDesc = await getOrCreateStyle('ren-step-desc');
    const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);
    async function applyStyleProperties() {
        log('Setting shared style properties...');
        await setSharedStyleProps(s, v);
        await wait(1000);
        log('Setting page-specific style properties...');
        // Hero
        await clearAndSet(await freshStyle('ren-hero'), 'ren-hero', {
            'min-height': '70vh', 'display': 'flex', 'align-items': 'flex-end',
            'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
            'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
            'background-color': v['av-dark'], 'color': v['av-cream'],
            'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
        });
        await clearAndSet(await freshStyle('ren-hero-content'), 'ren-hero-content', {
            'position': 'relative', 'z-index': '2', 'max-width': '800px',
        });
        await clearAndSet(await freshStyle('ren-hero-meta'), 'ren-hero-meta', {
            'display': 'flex', 'grid-column-gap': '48px', 'margin-top': '40px',
            'padding-top': '32px', 'border-top-width': '1px', 'border-top-style': 'solid',
            'border-top-color': 'rgba(240,237,232,0.1)',
        });
        await clearAndSet(await freshStyle('ren-hero-meta-item'), 'ren-hero-meta-item', {
            'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '4px',
        });
        await clearAndSet(await freshStyle('ren-hero-meta-value'), 'ren-hero-meta-value', {
            'font-family': 'DM Serif Display', 'font-size': '32px',
            'font-weight': '400', 'color': '#c9a96e',
        });
        await clearAndSet(await freshStyle('ren-hero-meta-label'), 'ren-hero-meta-label', {
            'font-family': 'DM Sans', 'font-size': v['av-text-xs'],
            'opacity': '0.35', 'letter-spacing': '0.15em', 'text-transform': 'uppercase',
        });
        await wait(500);
        // Type rows
        await clearAndSet(await freshStyle('ren-type-row'), 'ren-type-row', {
            'display': 'grid', 'grid-template-columns': '1fr 1fr',
            'grid-column-gap': '96px', 'grid-row-gap': '48px', 'align-items': 'center',
        });
        await clearAndSet(await freshStyle('ren-type-text'), 'ren-type-text', {
            'display': 'flex', 'flex-direction': 'column',
        });
        await clearAndSet(await freshStyle('ren-type-num'), 'ren-type-num', {
            'font-family': 'DM Sans', 'font-size': v['av-text-label'],
            'letter-spacing': '0.3em', 'text-transform': 'uppercase',
            'opacity': '0.3', 'margin-bottom': '16px',
        });
        await clearAndSet(await freshStyle('ren-type-title'), 'ren-type-title', {
            'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
            'line-height': '1.12', 'font-weight': '400', 'margin-bottom': '16px',
        });
        await clearAndSet(await freshStyle('ren-type-desc'), 'ren-type-desc', {
            'font-family': 'DM Sans', 'font-size': v['av-text-body'],
            'line-height': '1.9', 'opacity': '0.6',
        });
        await wait(500);
        // Narrative
        await clearAndSet(await freshStyle('ren-narr-section'), 'ren-narr-section', {
            'display': 'grid', 'grid-template-columns': '1fr 1fr',
            'grid-column-gap': '0px', 'min-height': '60vh',
        });
        await clearAndSet(await freshStyle('ren-narr-text'), 'ren-narr-text', {
            'display': 'flex', 'flex-direction': 'column', 'justify-content': 'center',
            'padding-top': '80px', 'padding-bottom': '80px',
            'padding-left': '80px', 'padding-right': '80px',
            'background-color': v['av-dark'], 'color': v['av-cream'],
        });
        await clearAndSet(await freshStyle('ren-narr-body'), 'ren-narr-body', {
            'font-family': 'DM Sans', 'font-size': v['av-text-body'],
            'line-height': '1.9', 'opacity': '0.55', 'margin-top': '20px', 'max-width': '420px',
        });
        await clearAndSet(await freshStyle('ren-stat-row'), 'ren-stat-row', {
            'display': 'flex', 'grid-column-gap': '48px', 'margin-top': '48px',
            'padding-top': '32px', 'border-top-width': '1px', 'border-top-style': 'solid',
            'border-top-color': 'rgba(240,237,232,0.08)',
        });
        await clearAndSet(await freshStyle('ren-stat-value'), 'ren-stat-value', {
            'font-family': 'DM Serif Display', 'font-size': '40px',
            'font-weight': '400', 'color': '#c9a96e',
        });
        await clearAndSet(await freshStyle('ren-stat-label'), 'ren-stat-label', {
            'font-family': 'DM Sans', 'font-size': '12px',
            'opacity': '0.35', 'margin-top': '4px', 'text-transform': 'uppercase', 'letter-spacing': '0.15em',
        });
        await wait(500);
        // Process steps
        await clearAndSet(await freshStyle('ren-step-row'), 'ren-step-row', {
            'display': 'grid', 'grid-template-columns': '80px 1fr',
            'grid-column-gap': '48px', 'align-items': 'start',
        });
        await clearAndSet(await freshStyle('ren-step-num-col'), 'ren-step-num-col', {
            'padding-top': '4px',
        });
        await clearAndSet(await freshStyle('ren-step-num'), 'ren-step-num', {
            'font-family': 'DM Serif Display',
            'font-size': 'clamp(36px, 4vw, 56px)',
            'line-height': '1', 'font-weight': '400', 'opacity': '0.15',
        });
        await clearAndSet(await freshStyle('ren-step-content'), 'ren-step-content', {
            'display': 'flex', 'flex-direction': 'column',
        });
        await clearAndSet(await freshStyle('ren-step-title'), 'ren-step-title', {
            'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
            'line-height': '1.12', 'font-weight': '400', 'margin-bottom': '16px',
        });
        await clearAndSet(await freshStyle('ren-step-desc'), 'ren-step-desc', {
            'font-family': 'DM Sans', 'font-size': v['av-text-body'],
            'line-height': '1.9', 'opacity': '0.6',
        });
        await wait(500);
        await applyCTAStyleProps(v);
    }
    // ═══════════════ BUILD ELEMENTS ═══════════════
    // SECTION 1: HERO
    log('Building Section 1: Hero...');
    const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
    hero.setTag('section');
    hero.setStyles([renHero]);
    hero.setAttribute('id', 'ren-hero');
    const heroC = hero.append(webflow.elementPresets.DOM);
    heroC.setTag('div');
    heroC.setStyles([renHeroContent]);
    const heroLabel = heroC.append(webflow.elementPresets.DOM);
    heroLabel.setTag('div');
    heroLabel.setStyles([s.label]);
    heroLabel.setAttribute('data-animate', 'fade-up');
    heroLabel.append(webflow.elementPresets.DOM).setTag('div');
    heroLabel.getChildren()[0].setTextContent('// Home Renovations');
    const heroH = heroC.append(webflow.elementPresets.DOM);
    heroH.setTag('h1');
    heroH.setStyles([s.headingXL]);
    heroH.setTextContent('Renovate with intention');
    heroH.setAttribute('data-animate', 'word-stagger-elastic');
    const heroSub = heroC.append(webflow.elementPresets.DOM);
    heroSub.setTag('p');
    heroSub.setStyles([s.body, s.bodyMuted]);
    heroSub.setTextContent('Kitchens, bathrooms, full interiors. We transform existing homes into spaces that feel entirely new.');
    heroSub.setAttribute('data-animate', 'fade-up');
    // Hero meta row
    const heroMeta = heroC.append(webflow.elementPresets.DOM);
    heroMeta.setTag('div');
    heroMeta.setStyles([renHeroMeta]);
    heroMeta.setAttribute('data-animate', 'fade-up');
    const metaItems = [
        { value: '150+', label: 'Projects completed' },
        { value: '4.9', label: 'Google rating' },
        { value: '100%', label: 'Licensed & insured' },
    ];
    for (const m of metaItems) {
        const item = heroMeta.append(webflow.elementPresets.DOM);
        item.setTag('div');
        item.setStyles([renHeroMetaItem]);
        const val = item.append(webflow.elementPresets.DOM);
        val.setTag('span');
        val.setStyles([renHeroMetaValue]);
        val.setTextContent(m.value);
        const lbl = item.append(webflow.elementPresets.DOM);
        lbl.setTag('span');
        lbl.setStyles([renHeroMetaLabel]);
        lbl.setTextContent(m.label);
    }
    await safeCall('append:hero', () => body.append(hero));
    logDetail('Section 1: Hero appended', 'ok');
    // SECTION 2: RENOVATION TYPES (alternating rows)
    log('Building Section 2: Renovation Types...');
    const typesSection = webflow.elementBuilder(webflow.elementPresets.DOM);
    typesSection.setTag('section');
    typesSection.setStyles([s.section, s.sectionWarm]);
    typesSection.setAttribute('id', 'ren-types');
    const typesH = typesSection.append(webflow.elementPresets.DOM);
    typesH.setTag('h2');
    typesH.setStyles([s.headingLG]);
    typesH.setTextContent('Every room, reimagined');
    typesH.setAttribute('data-animate', 'blur-focus');
    RENOVATION_TYPES.forEach((type, i) => {
        if (i > 0) {
            const div = typesSection.append(webflow.elementPresets.DOM);
            div.setTag('div');
            div.setStyles([s.divider]);
        }
        const row = typesSection.append(webflow.elementPresets.DOM);
        row.setTag('div');
        row.setStyles([renTypeRow]);
        row.setAttribute('data-animate', 'fade-up');
        if (i % 2 === 0) {
            const img = row.append(webflow.elementPresets.DOM);
            img.setTag('div');
            img.setStyles([s.imgLandscape]);
            const text = row.append(webflow.elementPresets.DOM);
            text.setTag('div');
            text.setStyles([renTypeText]);
            buildTypeText(text, type);
        }
        else {
            const text = row.append(webflow.elementPresets.DOM);
            text.setTag('div');
            text.setStyles([renTypeText]);
            buildTypeText(text, type);
            const img = row.append(webflow.elementPresets.DOM);
            img.setTag('div');
            img.setStyles([s.imgLandscape]);
        }
    });
    function buildTypeText(parent, type) {
        const num = parent.append(webflow.elementPresets.DOM);
        num.setTag('div');
        num.setStyles([renTypeNum]);
        num.setTextContent(type.number);
        const title = parent.append(webflow.elementPresets.DOM);
        title.setTag('h3');
        title.setStyles([renTypeTitle]);
        title.setTextContent(type.title);
        const desc = parent.append(webflow.elementPresets.DOM);
        desc.setTag('p');
        desc.setStyles([renTypeDesc]);
        desc.setTextContent(type.desc);
    }
    await safeCall('append:types', () => body.append(typesSection));
    logDetail('Section 2: Types appended', 'ok');
    // SECTION 3: NARRATIVE (dark text + image, full-width split)
    log('Building Section 3: Narrative...');
    const narrSection = webflow.elementBuilder(webflow.elementPresets.DOM);
    narrSection.setTag('section');
    narrSection.setStyles([renNarrSection]);
    narrSection.setAttribute('id', 'ren-narrative');
    const narrText = narrSection.append(webflow.elementPresets.DOM);
    narrText.setTag('div');
    narrText.setStyles([renNarrText]);
    const narrEyebrow = narrText.append(webflow.elementPresets.DOM);
    narrEyebrow.setTag('div');
    narrEyebrow.setStyles([s.label]);
    narrEyebrow.setAttribute('data-animate', 'fade-up');
    narrEyebrow.append(webflow.elementPresets.DOM).setTag('div');
    narrEyebrow.getChildren()[0].setTextContent('Why renovate');
    const narrH = narrText.append(webflow.elementPresets.DOM);
    narrH.setTag('h2');
    narrH.setStyles([s.headingLG]);
    narrH.setTextContent('Your home deserves the investment');
    narrH.setAttribute('data-animate', 'fade-up');
    const narrP = narrText.append(webflow.elementPresets.DOM);
    narrP.setTag('p');
    narrP.setStyles([renNarrBody]);
    narrP.setTextContent('A well-executed renovation doesn\'t just improve your daily life — it significantly increases your property value. We focus on quality materials, smart design, and construction that lasts.');
    narrP.setAttribute('data-animate', 'fade-up');
    // Stats
    const statRow = narrText.append(webflow.elementPresets.DOM);
    statRow.setTag('div');
    statRow.setStyles([renStatRow]);
    statRow.setAttribute('data-animate', 'fade-up');
    const stats = [{ value: '25%', label: 'Avg. value increase' }, { value: '$200+', label: 'Per sqft ROI' }];
    for (const st of stats) {
        const wrap = statRow.append(webflow.elementPresets.DOM);
        wrap.setTag('div');
        const val = wrap.append(webflow.elementPresets.DOM);
        val.setTag('div');
        val.setStyles([renStatValue]);
        val.setTextContent(st.value);
        const lbl = wrap.append(webflow.elementPresets.DOM);
        lbl.setTag('div');
        lbl.setStyles([renStatLabel]);
        lbl.setTextContent(st.label);
    }
    // Right image
    const narrImg = narrSection.append(webflow.elementPresets.DOM);
    narrImg.setTag('div');
    narrImg.setStyles([s.imgTall]);
    narrImg.setAttribute('data-animate', 'parallax-depth');
    await safeCall('append:narrative', () => body.append(narrSection));
    logDetail('Section 3: Narrative appended', 'ok');
    // SECTION 4: PROCESS
    log('Building Section 4: Process...');
    const procSection = webflow.elementBuilder(webflow.elementPresets.DOM);
    procSection.setTag('section');
    procSection.setStyles([s.section, s.sectionCream]);
    procSection.setAttribute('id', 'ren-process');
    const procH = procSection.append(webflow.elementPresets.DOM);
    procH.setTag('h2');
    procH.setStyles([s.headingLG]);
    procH.setTextContent('Straightforward. Transparent.');
    procH.setAttribute('data-animate', 'blur-focus');
    PROCESS_STEPS.forEach((step, i) => {
        if (i > 0) {
            const div = procSection.append(webflow.elementPresets.DOM);
            div.setTag('div');
            div.setStyles([s.divider]);
        }
        const row = procSection.append(webflow.elementPresets.DOM);
        row.setTag('div');
        row.setStyles([renStepRow]);
        row.setAttribute('data-animate', 'fade-up');
        const numCol = row.append(webflow.elementPresets.DOM);
        numCol.setTag('div');
        numCol.setStyles([renStepNumCol]);
        const num = numCol.append(webflow.elementPresets.DOM);
        num.setTag('div');
        num.setStyles([renStepNum]);
        num.setTextContent(step.number);
        const content = row.append(webflow.elementPresets.DOM);
        content.setTag('div');
        content.setStyles([renStepContent]);
        const title = content.append(webflow.elementPresets.DOM);
        title.setTag('h3');
        title.setStyles([renStepTitle]);
        title.setTextContent(step.title);
        const desc = content.append(webflow.elementPresets.DOM);
        desc.setTag('p');
        desc.setStyles([renStepDesc]);
        desc.setTextContent(step.desc);
    });
    await safeCall('append:process', () => body.append(procSection));
    logDetail('Section 4: Process appended', 'ok');
    // SECTION 5: CTA
    log('Building Section 5: CTA...');
    await buildCTASection(body, v, 'Ready to transform your home?', 'Schedule a Consultation', '/schedule-a-meeting', 'Call Us', 'tel:7149003676');
    await applyStyleProperties();
    log('Renovations page built!', 'success');
    await webflow.notify({ type: 'Success', message: 'Renovations page created!' });
}
// ── Event listeners ──
document.getElementById('inject-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('inject-btn');
    btn.disabled = true;
    try {
        await createAllVariables();
    }
    catch (err) {
        log(`Error: ${err.message || err}`, 'error');
    }
    finally {
        btn.disabled = false;
    }
});
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.dataset.copy;
        let text = type === 'head' ? HEAD_CODE : type === 'footer' ? FOOTER_CODE : '';
        navigator.clipboard.writeText(text).then(() => {
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
        });
    });
});
document.getElementById('build-page')?.addEventListener('click', async () => {
    const btn = document.getElementById('build-page');
    btn.disabled = true;
    try {
        await buildRenovationsPage();
    }
    catch (err) {
        log(`Error: ${err.message || err}`, 'error');
        await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
    }
    finally {
        btn.disabled = false;
    }
});
