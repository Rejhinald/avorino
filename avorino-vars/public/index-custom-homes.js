// ════════════════════════════════════════════════════════════════
// Avorino Builder — CUSTOM HOMES PAGE
// Cinematic hero + philosophy + service tiers + process + CTA
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, wait, safeCall, getAvorinVars, getOrCreateStyle, freshStyle, clearAndSet, createSharedStyles, setSharedStyleProps, createAllVariables, createPageWithSlug, buildCTASection, applyCTAStyleProps, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
const PAGE_NAME = 'Custom Homes';
const PAGE_SLUG = 'custom-homes';
const PAGE_TITLE = 'Custom Home Building in Orange County — Avorino Construction';
const PAGE_DESC = 'Ground-up custom residences in Orange County. Architecture, engineering, permitting, and construction — every detail tailored to your vision.';
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
const SERVICE_TIERS = [
    { number: '01', title: 'Single-Story Custom', desc: 'Open floor plans with seamless indoor-outdoor living. Ideal for larger lots where horizontal space allows every room to connect to the landscape.' },
    { number: '02', title: 'Two-Story Residence', desc: 'Maximized square footage with clear spatial separation — living areas downstairs, private quarters above. The most popular configuration in Orange County.' },
    { number: '03', title: 'Modern Architectural', desc: 'Flat rooflines, floor-to-ceiling glass, cantilevered volumes. Statement design with structural engineering that makes bold geometry possible.' },
    { number: '04', title: 'Estate & Luxury', desc: 'Premium materials, smart-home integration, and spaces designed around how you actually live. Wine rooms, home theaters, guest suites — built to your brief.' },
];
const PROCESS_STEPS = [
    { number: '01', title: 'Site & Feasibility', desc: 'Lot evaluation, soil testing, zoning verification. We confirm what\'s buildable before you invest in design.' },
    { number: '02', title: 'Architecture & Engineering', desc: 'Custom floor plans, structural engineering, Title 24 energy compliance, and 3D renderings — all developed in-house.' },
    { number: '03', title: 'Permitting', desc: 'Full plan-check submission, corrections management, and city approvals. Nothing starts until everything is signed off.' },
    { number: '04', title: 'Construction', desc: 'Licensed crew, weekly progress updates, transparent budgets. Foundation through final inspection, on schedule.' },
    { number: '05', title: 'Handover', desc: 'Final walkthrough, punch list, warranty documentation. Your home, built exactly as designed.' },
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
async function buildCustomHomesPage() {
    clearErrorLog();
    logDetail('Starting Custom Homes page build...', 'info');
    const v = await getAvorinVars();
    log('Creating shared styles...');
    const s = await createSharedStyles();
    // ── Page-specific styles ──
    log('Creating page-specific styles...');
    const chHero = await getOrCreateStyle('ch-hero');
    const chHeroContent = await getOrCreateStyle('ch-hero-content');
    const chHeroMeta = await getOrCreateStyle('ch-hero-meta');
    const chHeroMetaItem = await getOrCreateStyle('ch-hero-meta-item');
    const chHeroMetaValue = await getOrCreateStyle('ch-hero-meta-value');
    const chHeroMetaLabel = await getOrCreateStyle('ch-hero-meta-label');
    const chPhiloSection = await getOrCreateStyle('ch-philo-section');
    const chPhiloText = await getOrCreateStyle('ch-philo-text');
    const chPhiloBody = await getOrCreateStyle('ch-philo-body');
    const chTierRow = await getOrCreateStyle('ch-tier-row');
    const chTierText = await getOrCreateStyle('ch-tier-text');
    const chTierNum = await getOrCreateStyle('ch-tier-num');
    const chTierTitle = await getOrCreateStyle('ch-tier-title');
    const chTierDesc = await getOrCreateStyle('ch-tier-desc');
    const chStepRow = await getOrCreateStyle('ch-step-row');
    const chStepNumCol = await getOrCreateStyle('ch-step-num-col');
    const chStepNum = await getOrCreateStyle('ch-step-num');
    const chStepContent = await getOrCreateStyle('ch-step-content');
    const chStepTitle = await getOrCreateStyle('ch-step-title');
    const chStepDesc = await getOrCreateStyle('ch-step-desc');
    const chCostNote = await getOrCreateStyle('ch-cost-note');
    const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);
    async function applyStyleProperties() {
        log('Setting shared style properties...');
        await setSharedStyleProps(s, v);
        await wait(1000);
        log('Setting page-specific style properties...');
        // Hero
        await clearAndSet(await freshStyle('ch-hero'), 'ch-hero', {
            'min-height': '80vh', 'display': 'flex', 'align-items': 'flex-end',
            'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
            'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
            'background-color': v['av-dark'], 'color': v['av-cream'],
            'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
        });
        await clearAndSet(await freshStyle('ch-hero-content'), 'ch-hero-content', {
            'position': 'relative', 'z-index': '2', 'max-width': '800px',
        });
        await clearAndSet(await freshStyle('ch-hero-meta'), 'ch-hero-meta', {
            'display': 'flex', 'grid-column-gap': '48px', 'margin-top': '40px',
            'padding-top': '32px', 'border-top-width': '1px', 'border-top-style': 'solid',
            'border-top-color': 'rgba(240,237,232,0.1)',
        });
        await clearAndSet(await freshStyle('ch-hero-meta-item'), 'ch-hero-meta-item', {
            'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '4px',
        });
        await clearAndSet(await freshStyle('ch-hero-meta-value'), 'ch-hero-meta-value', {
            'font-family': 'DM Serif Display', 'font-size': '32px',
            'font-weight': '400', 'color': '#c9a96e',
        });
        await clearAndSet(await freshStyle('ch-hero-meta-label'), 'ch-hero-meta-label', {
            'font-family': 'DM Sans', 'font-size': v['av-text-xs'],
            'opacity': '0.35', 'letter-spacing': '0.15em', 'text-transform': 'uppercase',
        });
        await wait(500);
        // Philosophy split
        await clearAndSet(await freshStyle('ch-philo-section'), 'ch-philo-section', {
            'display': 'grid', 'grid-template-columns': '1fr 1fr',
            'grid-column-gap': '0px', 'min-height': '60vh',
        });
        await clearAndSet(await freshStyle('ch-philo-text'), 'ch-philo-text', {
            'display': 'flex', 'flex-direction': 'column', 'justify-content': 'center',
            'padding-top': '80px', 'padding-bottom': '80px',
            'padding-left': '80px', 'padding-right': '80px',
            'background-color': v['av-dark'], 'color': v['av-cream'],
        });
        await clearAndSet(await freshStyle('ch-philo-body'), 'ch-philo-body', {
            'font-family': 'DM Sans', 'font-size': v['av-text-body'],
            'line-height': '1.9', 'opacity': '0.55', 'margin-top': '20px', 'max-width': '420px',
        });
        await wait(500);
        // Service tiers
        await clearAndSet(await freshStyle('ch-tier-row'), 'ch-tier-row', {
            'display': 'grid', 'grid-template-columns': '1fr 1fr',
            'grid-column-gap': '96px', 'grid-row-gap': '48px', 'align-items': 'center',
        });
        await clearAndSet(await freshStyle('ch-tier-text'), 'ch-tier-text', {
            'display': 'flex', 'flex-direction': 'column',
        });
        await clearAndSet(await freshStyle('ch-tier-num'), 'ch-tier-num', {
            'font-family': 'DM Sans', 'font-size': v['av-text-label'],
            'letter-spacing': '0.3em', 'text-transform': 'uppercase',
            'opacity': '0.3', 'margin-bottom': '16px',
        });
        await clearAndSet(await freshStyle('ch-tier-title'), 'ch-tier-title', {
            'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
            'line-height': '1.12', 'font-weight': '400', 'margin-bottom': '16px',
        });
        await clearAndSet(await freshStyle('ch-tier-desc'), 'ch-tier-desc', {
            'font-family': 'DM Sans', 'font-size': v['av-text-body'],
            'line-height': '1.9', 'opacity': '0.6',
        });
        await clearAndSet(await freshStyle('ch-cost-note'), 'ch-cost-note', {
            'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
            'opacity': '0.4', 'text-align': 'center', 'margin-top': '24px',
        });
        await wait(500);
        // Process steps
        await clearAndSet(await freshStyle('ch-step-row'), 'ch-step-row', {
            'display': 'grid', 'grid-template-columns': '80px 1fr',
            'grid-column-gap': '48px', 'align-items': 'start',
        });
        await clearAndSet(await freshStyle('ch-step-num-col'), 'ch-step-num-col', {
            'padding-top': '4px',
        });
        await clearAndSet(await freshStyle('ch-step-num'), 'ch-step-num', {
            'font-family': 'DM Serif Display',
            'font-size': 'clamp(36px, 4vw, 56px)',
            'line-height': '1', 'font-weight': '400', 'opacity': '0.15',
        });
        await clearAndSet(await freshStyle('ch-step-content'), 'ch-step-content', {
            'display': 'flex', 'flex-direction': 'column',
        });
        await clearAndSet(await freshStyle('ch-step-title'), 'ch-step-title', {
            'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
            'line-height': '1.12', 'font-weight': '400', 'margin-bottom': '16px',
        });
        await clearAndSet(await freshStyle('ch-step-desc'), 'ch-step-desc', {
            'font-family': 'DM Sans', 'font-size': v['av-text-body'],
            'line-height': '1.9', 'opacity': '0.6',
        });
        await wait(500);
        await applyCTAStyleProps(v);
    }
    // ═══════════════ BUILD ELEMENTS ═══════════════
    // SECTION 1: CINEMATIC HERO
    log('Building Section 1: Hero...');
    const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
    hero.setTag('section');
    hero.setStyles([chHero]);
    hero.setAttribute('id', 'ch-hero');
    const heroC = hero.append(webflow.elementPresets.DOM);
    heroC.setTag('div');
    heroC.setStyles([chHeroContent]);
    const heroLabel = heroC.append(webflow.elementPresets.DOM);
    heroLabel.setTag('div');
    heroLabel.setStyles([s.label]);
    heroLabel.setAttribute('data-animate', 'fade-up');
    heroLabel.append(webflow.elementPresets.DOM).setTag('div');
    heroLabel.getChildren()[0].setTextContent('// Custom Homes');
    const heroH = heroC.append(webflow.elementPresets.DOM);
    heroH.setTag('h1');
    heroH.setStyles([s.headingXL]);
    heroH.setTextContent('Built around the way you live');
    heroH.setAttribute('data-animate', 'word-stagger-elastic');
    const heroSub = heroC.append(webflow.elementPresets.DOM);
    heroSub.setTag('p');
    heroSub.setStyles([s.body, s.bodyMuted]);
    heroSub.setTextContent('Ground-up custom residences in Orange County. Architecture, engineering, permitting, and construction — every detail tailored to your vision.');
    heroSub.setAttribute('data-animate', 'fade-up');
    // Hero meta row
    const heroMeta = heroC.append(webflow.elementPresets.DOM);
    heroMeta.setTag('div');
    heroMeta.setStyles([chHeroMeta]);
    heroMeta.setAttribute('data-animate', 'fade-up');
    const metaItems = [
        { value: '$350–$550', label: 'Per sqft' },
        { value: '12–18 mo', label: 'Timeline' },
        { value: '100%', label: 'Licensed & insured' },
    ];
    for (const m of metaItems) {
        const item = heroMeta.append(webflow.elementPresets.DOM);
        item.setTag('div');
        item.setStyles([chHeroMetaItem]);
        const val = item.append(webflow.elementPresets.DOM);
        val.setTag('span');
        val.setStyles([chHeroMetaValue]);
        val.setTextContent(m.value);
        const lbl = item.append(webflow.elementPresets.DOM);
        lbl.setTag('span');
        lbl.setStyles([chHeroMetaLabel]);
        lbl.setTextContent(m.label);
    }
    await safeCall('append:hero', () => body.append(hero));
    logDetail('Section 1: Hero appended', 'ok');
    // SECTION 2: PHILOSOPHY (dark text + image, full-width split)
    log('Building Section 2: Philosophy...');
    const philoSection = webflow.elementBuilder(webflow.elementPresets.DOM);
    philoSection.setTag('section');
    philoSection.setStyles([chPhiloSection]);
    philoSection.setAttribute('id', 'ch-philosophy');
    const philoText = philoSection.append(webflow.elementPresets.DOM);
    philoText.setTag('div');
    philoText.setStyles([chPhiloText]);
    const philoEyebrow = philoText.append(webflow.elementPresets.DOM);
    philoEyebrow.setTag('div');
    philoEyebrow.setStyles([s.label]);
    philoEyebrow.setAttribute('data-animate', 'fade-up');
    philoEyebrow.append(webflow.elementPresets.DOM).setTag('div');
    philoEyebrow.getChildren()[0].setTextContent('Our approach');
    const philoH = philoText.append(webflow.elementPresets.DOM);
    philoH.setTag('h2');
    philoH.setStyles([s.headingLG]);
    philoH.setTextContent('Design-build, not design-then-build');
    philoH.setAttribute('data-animate', 'fade-up');
    const philoP = philoText.append(webflow.elementPresets.DOM);
    philoP.setTag('p');
    philoP.setStyles([chPhiloBody]);
    philoP.setTextContent('Most builders separate design and construction into disconnected phases. We integrate them. Your architect and your builder work as one team from day one — eliminating miscommunication, reducing change orders, and delivering a home that matches what was promised.');
    philoP.setAttribute('data-animate', 'fade-up');
    const philoP2 = philoText.append(webflow.elementPresets.DOM);
    philoP2.setTag('p');
    philoP2.setStyles([chPhiloBody]);
    philoP2.setTextContent('Every home we build starts with your goals and your site conditions — not a catalog template. The result is a residence that fits your lot, your lifestyle, and your budget.');
    philoP2.setAttribute('data-animate', 'fade-up');
    // Right image
    const philoImg = philoSection.append(webflow.elementPresets.DOM);
    philoImg.setTag('div');
    philoImg.setStyles([s.imgTall]);
    philoImg.setAttribute('data-animate', 'parallax-depth');
    await safeCall('append:philosophy', () => body.append(philoSection));
    logDetail('Section 2: Philosophy appended', 'ok');
    // SECTION 3: SERVICE TIERS (alternating rows)
    log('Building Section 3: Service Tiers...');
    const tiersSection = webflow.elementBuilder(webflow.elementPresets.DOM);
    tiersSection.setTag('section');
    tiersSection.setStyles([s.section, s.sectionCream]);
    tiersSection.setAttribute('id', 'ch-tiers');
    const tiersH = tiersSection.append(webflow.elementPresets.DOM);
    tiersH.setTag('h2');
    tiersH.setStyles([s.headingLG]);
    tiersH.setTextContent('What we build');
    tiersH.setAttribute('data-animate', 'blur-focus');
    SERVICE_TIERS.forEach((tier, i) => {
        if (i > 0) {
            const div = tiersSection.append(webflow.elementPresets.DOM);
            div.setTag('div');
            div.setStyles([s.divider]);
        }
        const row = tiersSection.append(webflow.elementPresets.DOM);
        row.setTag('div');
        row.setStyles([chTierRow]);
        row.setAttribute('data-animate', 'fade-up');
        if (i % 2 === 0) {
            const img = row.append(webflow.elementPresets.DOM);
            img.setTag('div');
            img.setStyles([s.imgLandscape]);
            const text = row.append(webflow.elementPresets.DOM);
            text.setTag('div');
            text.setStyles([chTierText]);
            buildTierText(text, tier);
        }
        else {
            const text = row.append(webflow.elementPresets.DOM);
            text.setTag('div');
            text.setStyles([chTierText]);
            buildTierText(text, tier);
            const img = row.append(webflow.elementPresets.DOM);
            img.setTag('div');
            img.setStyles([s.imgLandscape]);
        }
    });
    const costNote = tiersSection.append(webflow.elementPresets.DOM);
    costNote.setTag('p');
    costNote.setStyles([chCostNote]);
    costNote.setTextContent('$350–$550 per sqft depending on scope, finishes, and lot conditions');
    costNote.setAttribute('data-animate', 'fade-up');
    function buildTierText(parent, tier) {
        const num = parent.append(webflow.elementPresets.DOM);
        num.setTag('div');
        num.setStyles([chTierNum]);
        num.setTextContent(tier.number);
        const title = parent.append(webflow.elementPresets.DOM);
        title.setTag('h3');
        title.setStyles([chTierTitle]);
        title.setTextContent(tier.title);
        const desc = parent.append(webflow.elementPresets.DOM);
        desc.setTag('p');
        desc.setStyles([chTierDesc]);
        desc.setTextContent(tier.desc);
    }
    await safeCall('append:tiers', () => body.append(tiersSection));
    logDetail('Section 3: Tiers appended', 'ok');
    // SECTION 4: PROCESS
    log('Building Section 4: Process...');
    const procSection = webflow.elementBuilder(webflow.elementPresets.DOM);
    procSection.setTag('section');
    procSection.setStyles([s.section, s.sectionWarm]);
    procSection.setAttribute('id', 'ch-process');
    const procH = procSection.append(webflow.elementPresets.DOM);
    procH.setTag('h2');
    procH.setStyles([s.headingLG]);
    procH.setTextContent('From lot to lockbox');
    procH.setAttribute('data-animate', 'blur-focus');
    PROCESS_STEPS.forEach((step, i) => {
        if (i > 0) {
            const div = procSection.append(webflow.elementPresets.DOM);
            div.setTag('div');
            div.setStyles([s.divider]);
        }
        const row = procSection.append(webflow.elementPresets.DOM);
        row.setTag('div');
        row.setStyles([chStepRow]);
        row.setAttribute('data-animate', 'fade-up');
        const numCol = row.append(webflow.elementPresets.DOM);
        numCol.setTag('div');
        numCol.setStyles([chStepNumCol]);
        const num = numCol.append(webflow.elementPresets.DOM);
        num.setTag('div');
        num.setStyles([chStepNum]);
        num.setTextContent(step.number);
        const content = row.append(webflow.elementPresets.DOM);
        content.setTag('div');
        content.setStyles([chStepContent]);
        const title = content.append(webflow.elementPresets.DOM);
        title.setTag('h3');
        title.setStyles([chStepTitle]);
        title.setTextContent(step.title);
        const desc = content.append(webflow.elementPresets.DOM);
        desc.setTag('p');
        desc.setStyles([chStepDesc]);
        desc.setTextContent(step.desc);
    });
    await safeCall('append:process', () => body.append(procSection));
    logDetail('Section 4: Process appended', 'ok');
    // SECTION 5: CTA
    log('Building Section 5: CTA...');
    await buildCTASection(body, v, 'Ready to build your dream home?', 'Schedule a Consultation', '/schedule-a-meeting', 'Call Us', 'tel:7149003676');
    await applyStyleProperties();
    log('Custom Homes page built!', 'success');
    await webflow.notify({ type: 'Success', message: 'Custom Homes page created!' });
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
        await buildCustomHomesPage();
    }
    catch (err) {
        log(`Error: ${err.message || err}`, 'error');
        await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
    }
    finally {
        btn.disabled = false;
    }
});
