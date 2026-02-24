// ════════════════════════════════════════════════════════════════
// Avorino Builder — ADU CONSTRUCTION PAGE
// Mirrors /adu content with slug 'adu-construction' for SEO/redirect
// Split hero + ADU types + process + CTA
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, wait, safeCall, getAvorinVars, getOrCreateStyle, freshStyle, clearAndSet, createSharedStyles, setSharedStyleProps, createAllVariables, createPageWithSlug, buildCTASection, applyCTAStyleProps, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
const PAGE_NAME = 'ADU Construction';
const PAGE_SLUG = 'adu-construction';
const PAGE_TITLE = 'ADU Construction in Orange County — Avorino';
const PAGE_DESC = 'Detached, attached, and garage conversion ADUs in Orange County. Fully permitted, designed, and built by Avorino.';
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
const ADU_TYPES = [
    { number: '01', title: 'Detached ADU', desc: 'Standalone unit in your backyard — maximum privacy and design flexibility. Popular for rental income or multigenerational living.' },
    { number: '02', title: 'Attached ADU', desc: 'Extension connected to your home with its own private entrance. Shares a wall for cost savings while maintaining complete independence.' },
    { number: '03', title: 'Garage Conversion', desc: 'Convert your existing garage into a fully permitted living space. The most affordable option — starting at $75K with the fastest turnaround.' },
    { number: '04', title: 'Above-Garage ADU', desc: 'Second story above your garage. Keeps parking, adds living space, and maximizes your lot without sacrificing yard area.' },
];
const PROCESS_STEPS = [
    { number: '01', title: 'Design', time: '4–6 months', desc: 'Custom architectural plans, structural engineering, and Title 24 energy calculations — all included.' },
    { number: '02', title: 'Permits', time: 'Included in design', desc: 'We submit to your city and manage all plan-check corrections and approvals.' },
    { number: '03', title: 'Build', time: '6–8 months', desc: 'Licensed crew, weekly progress updates, and on-budget delivery from foundation to final inspection.' },
];
// ── Panel UI ──
document.getElementById('page-name').textContent = PAGE_NAME;
const headCodeEl = document.getElementById('head-code');
const footerCodeEl = document.getElementById('footer-code');
if (headCodeEl)
    headCodeEl.textContent = HEAD_CODE;
if (footerCodeEl)
    footerCodeEl.textContent = FOOTER_CODE;
async function buildADUConstructionPage() {
    clearErrorLog();
    logDetail('Starting ADU Construction page build...', 'info');
    const v = await getAvorinVars();
    log('Creating shared styles...');
    const s = await createSharedStyles();
    log('Creating page-specific styles...');
    const aduHero = await getOrCreateStyle('aduc-hero');
    const aduHeroContent = await getOrCreateStyle('aduc-hero-content');
    const aduTypeRow = await getOrCreateStyle('aduc-type-row');
    const aduTypeText = await getOrCreateStyle('aduc-type-text');
    const aduTypeNum = await getOrCreateStyle('aduc-type-num');
    const aduTypeTitle = await getOrCreateStyle('aduc-type-title');
    const aduTypeDesc = await getOrCreateStyle('aduc-type-desc');
    const aduCostNote = await getOrCreateStyle('aduc-cost-note');
    const aduStepRow = await getOrCreateStyle('aduc-step-row');
    const aduStepNumCol = await getOrCreateStyle('aduc-step-num-col');
    const aduStepNum = await getOrCreateStyle('aduc-step-num');
    const aduStepContent = await getOrCreateStyle('aduc-step-content');
    const aduStepTitle = await getOrCreateStyle('aduc-step-title');
    const aduStepTime = await getOrCreateStyle('aduc-step-time');
    const aduStepDesc = await getOrCreateStyle('aduc-step-desc');
    const aduTimeline = await getOrCreateStyle('aduc-timeline');
    const aduRoiGrid = await getOrCreateStyle('aduc-roi-grid');
    const aduRoiCard = await getOrCreateStyle('aduc-roi-card');
    const aduRoiValue = await getOrCreateStyle('aduc-roi-value');
    const aduRoiLabel = await getOrCreateStyle('aduc-roi-label');
    const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);
    async function applyStyleProperties() {
        log('Setting shared style properties...');
        await setSharedStyleProps(s, v);
        await wait(1000);
        log('Setting page-specific style properties...');
        await clearAndSet(await freshStyle('aduc-hero'), 'aduc-hero', {
            'display': 'grid', 'grid-template-columns': '1.5fr 1fr',
            'grid-column-gap': '96px', 'grid-row-gap': '64px', 'align-items': 'center',
            'min-height': '70vh',
            'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
            'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
            'background-color': v['av-dark'], 'color': v['av-cream'],
        });
        await clearAndSet(await freshStyle('aduc-hero-content'), 'aduc-hero-content', {
            'max-width': '640px',
        });
        await wait(500);
        await clearAndSet(await freshStyle('aduc-type-row'), 'aduc-type-row', {
            'display': 'grid', 'grid-template-columns': '1fr 1fr',
            'grid-column-gap': '96px', 'grid-row-gap': '48px', 'align-items': 'center',
        });
        await clearAndSet(await freshStyle('aduc-type-text'), 'aduc-type-text', {
            'display': 'flex', 'flex-direction': 'column',
        });
        await clearAndSet(await freshStyle('aduc-type-num'), 'aduc-type-num', {
            'font-family': 'DM Sans', 'font-size': v['av-text-label'],
            'letter-spacing': '0.3em', 'text-transform': 'uppercase',
            'opacity': '0.3', 'margin-bottom': '16px',
        });
        await clearAndSet(await freshStyle('aduc-type-title'), 'aduc-type-title', {
            'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
            'line-height': '1.12', 'font-weight': '400', 'margin-bottom': '16px',
        });
        await clearAndSet(await freshStyle('aduc-type-desc'), 'aduc-type-desc', {
            'font-family': 'DM Sans', 'font-size': v['av-text-body'],
            'line-height': '1.9', 'opacity': '0.6',
        });
        await clearAndSet(await freshStyle('aduc-cost-note'), 'aduc-cost-note', {
            'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
            'opacity': '0.4', 'text-align': 'center', 'margin-top': '24px',
        });
        await wait(500);
        // ROI grid
        await clearAndSet(await freshStyle('aduc-roi-grid'), 'aduc-roi-grid', {
            'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr 1fr',
            'grid-column-gap': '24px', 'grid-row-gap': '24px',
        });
        await clearAndSet(await freshStyle('aduc-roi-card'), 'aduc-roi-card', {
            'background-color': v['av-dark'], 'color': v['av-cream'],
            'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
            'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
            'padding-top': '40px', 'padding-bottom': '40px',
            'padding-left': '32px', 'padding-right': '32px',
            'text-align': 'center',
        });
        await clearAndSet(await freshStyle('aduc-roi-value'), 'aduc-roi-value', {
            'font-family': 'DM Serif Display', 'font-size': '42px',
            'font-weight': '400', 'color': '#c9a96e', 'margin-bottom': '8px',
        });
        await clearAndSet(await freshStyle('aduc-roi-label'), 'aduc-roi-label', {
            'font-family': 'DM Sans', 'font-size': '12px',
            'opacity': '0.4', 'text-transform': 'uppercase', 'letter-spacing': '0.15em',
        });
        await wait(500);
        // Process
        await clearAndSet(await freshStyle('aduc-step-row'), 'aduc-step-row', {
            'display': 'grid', 'grid-template-columns': '80px 1fr',
            'grid-column-gap': '48px', 'align-items': 'start',
        });
        await clearAndSet(await freshStyle('aduc-step-num-col'), 'aduc-step-num-col', { 'padding-top': '4px' });
        await clearAndSet(await freshStyle('aduc-step-num'), 'aduc-step-num', {
            'font-family': 'DM Serif Display', 'font-size': 'clamp(36px, 4vw, 56px)',
            'line-height': '1', 'font-weight': '400', 'opacity': '0.15',
        });
        await clearAndSet(await freshStyle('aduc-step-content'), 'aduc-step-content', { 'display': 'flex', 'flex-direction': 'column' });
        await clearAndSet(await freshStyle('aduc-step-title'), 'aduc-step-title', {
            'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
            'line-height': '1.12', 'font-weight': '400', 'margin-bottom': '8px',
        });
        await clearAndSet(await freshStyle('aduc-step-time'), 'aduc-step-time', {
            'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
            'opacity': '0.4', 'margin-bottom': '16px',
        });
        await clearAndSet(await freshStyle('aduc-step-desc'), 'aduc-step-desc', {
            'font-family': 'DM Sans', 'font-size': v['av-text-body'],
            'line-height': '1.9', 'opacity': '0.6',
        });
        await clearAndSet(await freshStyle('aduc-timeline'), 'aduc-timeline', {
            'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
            'opacity': '0.4', 'text-align': 'center', 'margin-top': '24px',
        });
        await wait(500);
        await applyCTAStyleProps(v);
    }
    // ═══════════════ BUILD ELEMENTS ═══════════════
    // SECTION 1: SPLIT HERO
    log('Building Section 1: Hero...');
    const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
    hero.setTag('section');
    hero.setStyles([aduHero]);
    hero.setAttribute('id', 'aduc-hero');
    const heroC = hero.append(webflow.elementPresets.DOM);
    heroC.setTag('div');
    heroC.setStyles([aduHeroContent]);
    const heroLabel = heroC.append(webflow.elementPresets.DOM);
    heroLabel.setTag('div');
    heroLabel.setStyles([s.label]);
    heroLabel.setAttribute('data-animate', 'fade-up');
    heroLabel.append(webflow.elementPresets.DOM).setTag('div');
    heroLabel.getChildren()[0].setTextContent('// ADU Construction');
    const heroH = heroC.append(webflow.elementPresets.DOM);
    heroH.setTag('h1');
    heroH.setStyles([s.headingXL]);
    heroH.setTextContent('A second home on your property');
    heroH.setAttribute('data-animate', 'word-stagger-elastic');
    const heroSub = heroC.append(webflow.elementPresets.DOM);
    heroSub.setTag('p');
    heroSub.setStyles([s.body, s.bodyMuted]);
    heroSub.setTextContent('An accessory dwelling unit is an independent residential unit on the same lot as your home. Detached, attached, or converted — Avorino designs, permits, and builds it all.');
    heroSub.setAttribute('data-animate', 'fade-up');
    const heroImg = hero.append(webflow.elementPresets.DOM);
    heroImg.setTag('div');
    heroImg.setStyles([s.imgTall]);
    heroImg.setAttribute('data-animate', 'parallax-depth');
    await safeCall('append:hero', () => body.append(hero));
    logDetail('Section 1: Hero appended', 'ok');
    // SECTION 2: ADU TYPES
    log('Building Section 2: ADU Types...');
    const typesSection = webflow.elementBuilder(webflow.elementPresets.DOM);
    typesSection.setTag('section');
    typesSection.setStyles([s.section, s.sectionCream]);
    typesSection.setAttribute('id', 'aduc-types');
    const typesH = typesSection.append(webflow.elementPresets.DOM);
    typesH.setTag('h2');
    typesH.setStyles([s.headingLG]);
    typesH.setTextContent('Four ways to build');
    typesH.setAttribute('data-animate', 'blur-focus');
    ADU_TYPES.forEach((type, i) => {
        if (i > 0) {
            const div = typesSection.append(webflow.elementPresets.DOM);
            div.setTag('div');
            div.setStyles([s.divider]);
        }
        const row = typesSection.append(webflow.elementPresets.DOM);
        row.setTag('div');
        row.setStyles([aduTypeRow]);
        row.setAttribute('data-animate', 'fade-up');
        if (i % 2 === 0) {
            const img = row.append(webflow.elementPresets.DOM);
            img.setTag('div');
            img.setStyles([s.imgLandscape]);
            const text = row.append(webflow.elementPresets.DOM);
            text.setTag('div');
            text.setStyles([aduTypeText]);
            buildTypeText(text, type);
        }
        else {
            const text = row.append(webflow.elementPresets.DOM);
            text.setTag('div');
            text.setStyles([aduTypeText]);
            buildTypeText(text, type);
            const img = row.append(webflow.elementPresets.DOM);
            img.setTag('div');
            img.setStyles([s.imgLandscape]);
        }
    });
    const costNote = typesSection.append(webflow.elementPresets.DOM);
    costNote.setTag('p');
    costNote.setStyles([aduCostNote]);
    costNote.setTextContent('Starting at $75K for conversions, $250K+ for new builds');
    costNote.setAttribute('data-animate', 'fade-up');
    function buildTypeText(parent, type) {
        const num = parent.append(webflow.elementPresets.DOM);
        num.setTag('div');
        num.setStyles([aduTypeNum]);
        num.setTextContent(type.number);
        const title = parent.append(webflow.elementPresets.DOM);
        title.setTag('h3');
        title.setStyles([aduTypeTitle]);
        title.setTextContent(type.title);
        const desc = parent.append(webflow.elementPresets.DOM);
        desc.setTag('p');
        desc.setStyles([aduTypeDesc]);
        desc.setTextContent(type.desc);
    }
    await safeCall('append:types', () => body.append(typesSection));
    logDetail('Section 2: Types appended', 'ok');
    // SECTION 3: ROI
    log('Building Section 3: Cost & ROI...');
    const roiSection = webflow.elementBuilder(webflow.elementPresets.DOM);
    roiSection.setTag('section');
    roiSection.setStyles([s.section, s.sectionWarm]);
    roiSection.setAttribute('id', 'aduc-roi');
    const roiH = roiSection.append(webflow.elementPresets.DOM);
    roiH.setTag('h2');
    roiH.setStyles([s.headingLG]);
    roiH.setTextContent('The numbers make sense');
    roiH.setAttribute('data-animate', 'blur-focus');
    const roiGrid = roiSection.append(webflow.elementPresets.DOM);
    roiGrid.setTag('div');
    roiGrid.setStyles([aduRoiGrid]);
    roiGrid.setAttribute('data-animate', 'fade-up-stagger');
    const roiData = [
        { value: '$250K–$400K', label: 'Avg. project cost' },
        { value: '$2K–$4.5K+', label: 'Monthly rental' },
        { value: '5–12%', label: 'Annual ROI' },
        { value: '8–15 yrs', label: 'Break-even' },
    ];
    for (const rd of roiData) {
        const card = roiGrid.append(webflow.elementPresets.DOM);
        card.setTag('div');
        card.setStyles([aduRoiCard]);
        card.setAttribute('data-animate', 'fade-up');
        const val = card.append(webflow.elementPresets.DOM);
        val.setTag('div');
        val.setStyles([aduRoiValue]);
        val.setTextContent(rd.value);
        const lbl = card.append(webflow.elementPresets.DOM);
        lbl.setTag('div');
        lbl.setStyles([aduRoiLabel]);
        lbl.setTextContent(rd.label);
    }
    await safeCall('append:roi', () => body.append(roiSection));
    logDetail('Section 3: ROI appended', 'ok');
    // SECTION 4: PROCESS
    log('Building Section 4: Process...');
    const procSection = webflow.elementBuilder(webflow.elementPresets.DOM);
    procSection.setTag('section');
    procSection.setStyles([s.section, s.sectionCream]);
    procSection.setAttribute('id', 'aduc-process');
    const procH = procSection.append(webflow.elementPresets.DOM);
    procH.setTag('h2');
    procH.setStyles([s.headingLG]);
    procH.setTextContent('Three steps to your ADU');
    procH.setAttribute('data-animate', 'blur-focus');
    PROCESS_STEPS.forEach((step, i) => {
        if (i > 0) {
            const div = procSection.append(webflow.elementPresets.DOM);
            div.setTag('div');
            div.setStyles([s.divider]);
        }
        const row = procSection.append(webflow.elementPresets.DOM);
        row.setTag('div');
        row.setStyles([aduStepRow]);
        row.setAttribute('data-animate', 'fade-up');
        const numCol = row.append(webflow.elementPresets.DOM);
        numCol.setTag('div');
        numCol.setStyles([aduStepNumCol]);
        const num = numCol.append(webflow.elementPresets.DOM);
        num.setTag('div');
        num.setStyles([aduStepNum]);
        num.setTextContent(step.number);
        const content = row.append(webflow.elementPresets.DOM);
        content.setTag('div');
        content.setStyles([aduStepContent]);
        const title = content.append(webflow.elementPresets.DOM);
        title.setTag('h3');
        title.setStyles([aduStepTitle]);
        title.setTextContent(step.title);
        const time = content.append(webflow.elementPresets.DOM);
        time.setTag('div');
        time.setStyles([aduStepTime]);
        time.setTextContent(step.time);
        const desc = content.append(webflow.elementPresets.DOM);
        desc.setTag('p');
        desc.setStyles([aduStepDesc]);
        desc.setTextContent(step.desc);
    });
    const timeline = procSection.append(webflow.elementPresets.DOM);
    timeline.setTag('p');
    timeline.setStyles([aduTimeline]);
    timeline.setTextContent('Total timeline: 10–14 months from design to move-in');
    timeline.setAttribute('data-animate', 'fade-up');
    await safeCall('append:process', () => body.append(procSection));
    logDetail('Section 4: Process appended', 'ok');
    // SECTION 5: CTA
    log('Building Section 5: CTA...');
    await buildCTASection(body, v, 'Get your ADU estimate', 'ADU Cost Calculator', '/adu-cost-estimator', 'Schedule a Meeting', '/schedule-a-meeting');
    await applyStyleProperties();
    log('ADU Construction page built!', 'success');
    await webflow.notify({ type: 'Success', message: 'ADU Construction page created!' });
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
        await buildADUConstructionPage();
    }
    catch (err) {
        log(`Error: ${err.message || err}`, 'error');
        await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
    }
    finally {
        btn.disabled = false;
    }
});
