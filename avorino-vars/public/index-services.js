// ════════════════════════════════════════════════════════════════
// Avorino Builder — SERVICES PAGE
// Rename this to index.ts to build the Services page.
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, wait, safeCall, getAvorinVars, getOrCreateStyle, freshStyle, clearAndSet, createSharedStyles, setSharedStyleProps, createAllVariables, createPageWithSlug, buildCTASection, applyCTAStyleProps, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
// ── Page config ──
const PAGE_NAME = 'Services';
const PAGE_SLUG = 'services';
const PAGE_TITLE = 'Our Services — Avorino Construction in Orange County';
const PAGE_DESC = 'ADU construction, custom homes, new builds, additions, garage conversions, and commercial projects in Orange County. Licensed, insured, and fully permitted.';
const CDN = '8aafbab';
const HEAD_CODE = [
    `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-responsive.css">`,
    `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-nav-footer.css">`,
    `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-services.css">`,
    CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
    '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>',
    `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-services.js"><\/script>`,
    `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-services-3d.js"><\/script>`,
    `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-about-process3d.js"><\/script>`,
    CALENDLY_JS,
].join('\n');
// ── Update panel UI ──
document.getElementById('page-name').textContent = PAGE_NAME;
const headCodeEl = document.getElementById('head-code');
const footerCodeEl = document.getElementById('footer-code');
if (headCodeEl)
    headCodeEl.textContent = HEAD_CODE;
if (footerCodeEl)
    footerCodeEl.textContent = FOOTER_CODE;
// ── Service data ──
const SERVICES = [
    { number: '01 / 06', title: 'ADU Construction', desc: 'Detached, attached, and garage conversion ADUs. Fully permitted, built to maximize property value and rental income.', features: ['Detached & attached units', 'Full permit handling', 'ROI-optimized design'], href: '/adu' },
    { number: '02 / 06', title: 'Garage Conversion', desc: 'Transform your existing garage into a functional living space. The most affordable path to additional square footage.', features: ['Budget-friendly from $75K', 'No new foundation needed', 'Quick 8\u201312 week timeline'], href: '/garageconversion' },
    { number: '03 / 06', title: 'Custom Homes', desc: 'Ground-up custom residences tailored to your vision. Full design-to-build service with architectural precision.', features: ['Bespoke floor plans', 'Premium materials', 'Design-build integration'], href: '/buildcustomhome' },
    { number: '04 / 06', title: 'New Construction', desc: 'New builds for landowners. Engineering, permits, and construction managed end-to-end from raw lot to move-in.', features: ['Site preparation & grading', 'Full engineering services', 'Turnkey delivery'], href: '/newconstruction' },
    { number: '05 / 06', title: 'Additions', desc: 'Expand your living space with room additions, second stories, and home extensions that blend seamlessly.', features: ['Second story additions', 'Room extensions', 'Structural reinforcement'], href: '/addition' },
    { number: '06 / 06', title: 'Commercial', desc: 'Tenant improvements, commercial renovations, and build-outs in Orange County for businesses of all sizes.', features: ['Tenant improvements', 'Retail & office build-outs', 'ADA compliance'], href: '/commercial' },
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
    // Showcase section (Webflow styles for designer preview, CDN CSS for extras)
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
    const svProgressBar = await getOrCreateStyle('sv-progress-bar');
    const svBarTrack = await getOrCreateStyle('sv-bar-track');
    const svBarFill = await getOrCreateStyle('sv-bar-fill');
    const svBarDot = await getOrCreateStyle('sv-bar-dot');
    // Process (Three.js 3D — uses about-process-* names for process3d.js compatibility)
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
    logDetail('All styles created', 'ok');
    // ── Create page ──
    const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);
    // ── Style property setter (called AFTER all elements are built) ──
    async function applyStyleProperties() {
        log('Setting shared style properties...');
        await setSharedStyleProps(s, v);
        logDetail('Shared style properties set', 'ok');
        await wait(1000);
        log('Setting page-specific style properties...');
        // Safe wrapper — if one style fails, don't kill the rest
        async function safeStyle(name, props) {
            try {
                await clearAndSet(await freshStyle(name), name, props);
            }
            catch (err) {
                logDetail(`WARN style ${name}: ${err?.message || err}`, 'err');
            }
        }
        // ── Hero ──
        logDetail('Setting hero props...', 'info');
        await safeStyle('sv-hero', {
            'min-height': '60vh', 'display': 'flex', 'align-items': 'flex-end',
            'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
            'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
            'background-color': v['av-dark'], 'color': v['av-cream'],
            'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
        });
        await safeStyle('sv-hero-content', {
            'position': 'relative', 'z-index': '2', 'max-width': '800px',
        });
        await safeStyle('sv-hero-subtitle', {
            'font-family': 'DM Sans', 'font-size': v['av-text-body'],
            'line-height': '1.9', 'opacity': '0.6', 'margin-top': '24px', 'color': v['av-cream'],
        });
        await wait(500);
        // ── Showcase section ──
        logDetail('Setting showcase props...', 'info');
        await safeStyle('sv-showcase', {
            'width': '100%', 'min-height': '100vh', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
            'position': 'relative', 'background-color': v['av-dark'], 'color': v['av-cream'],
        });
        await safeStyle('sv-canvas-wrap', {
            'position': 'absolute', 'top': '0px', 'right': '0px',
            'width': '50%', 'height': '100%', 'z-index': '1',
            'overflow-x': 'hidden', 'overflow-y': 'hidden',
        });
        await safeStyle('sv-showcase-content', {
            'position': 'relative', 'z-index': '2',
            'max-width': '1400px', 'margin-left': 'auto', 'margin-right': 'auto',
            'padding-left': '80px', 'padding-right': '80px',
            'width': '100%', 'height': '100vh',
            'display': 'grid', 'grid-template-columns': '5fr 7fr',
            'grid-column-gap': '96px', 'align-items': 'center',
        });
        await safeStyle('sv-showcase-info', {
            'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '24px',
            'position': 'relative', 'min-height': '420px',
        });
        await wait(500);
        // ── Service panels ──
        logDetail('Setting panel props...', 'info');
        await safeStyle('sv-service-panel', {
            'position': 'absolute', 'top': '0px', 'left': '0px', 'width': '100%', 'height': '100%',
            'display': 'flex', 'flex-direction': 'column', 'justify-content': 'center',
            'grid-row-gap': '24px', 'opacity': '0',
        });
        await safeStyle('sv-service-label', {
            'font-family': 'DM Sans', 'font-size': '11px',
            'letter-spacing': '0.25em', 'text-transform': 'uppercase',
            'color': '#c9a96e', 'opacity': '0.8',
        });
        await safeStyle('sv-service-title', {
            'font-family': 'DM Serif Display', 'font-size': '48px',
            'font-weight': '400', 'line-height': '1.08', 'letter-spacing': '-0.02em',
            'color': v['av-cream'],
        });
        await safeStyle('sv-service-desc', {
            'font-family': 'DM Sans', 'font-size': '16px',
            'line-height': '1.9', 'color': v['av-cream'], 'opacity': '0.55',
            'max-width': '480px',
        });
        await safeStyle('sv-service-features', {
            'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '12px',
            'margin-top': '8px',
        });
        await safeStyle('sv-service-feature', {
            'font-family': 'DM Sans', 'font-size': '14px',
            'color': v['av-cream'], 'opacity': '0.7', 'padding-left': '20px',
        });
        await safeStyle('sv-service-cta', {
            'font-family': 'DM Sans', 'font-size': '14px', 'font-weight': '500',
            'letter-spacing': '0.08em', 'display': 'inline-flex', 'align-items': 'center',
            'grid-column-gap': '8px', 'color': '#c9a96e', 'text-decoration': 'none',
            'margin-top': '16px',
        });
        await wait(500);
        // ── Counter + Progress bar ──
        logDetail('Setting counter + bar props...', 'info');
        await safeStyle('sv-counter', {
            'font-family': 'DM Serif Display', 'font-size': '120px',
            'font-weight': '400', 'line-height': '1', 'color': v['av-cream'],
            'opacity': '0.12', 'position': 'absolute', 'bottom': '80px', 'left': '80px', 'z-index': '2',
        });
        await safeStyle('sv-progress-bar', {
            'position': 'absolute', 'bottom': '0px', 'left': '0px', 'right': '0px',
            'height': '48px', 'display': 'flex', 'align-items': 'center',
            'justify-content': 'space-between', 'padding-left': '80px', 'padding-right': '80px',
            'z-index': '10',
        });
        await safeStyle('sv-bar-track', {
            'position': 'absolute', 'top': '50%', 'left': '80px', 'right': '80px',
            'height': '1px', 'background-color': 'rgba(240,237,232,0.06)',
        });
        await safeStyle('sv-bar-fill', {
            'position': 'absolute', 'top': '50%', 'left': '80px', 'right': '80px',
            'height': '1px', 'background-color': 'rgba(201,169,110,0.5)',
        });
        await safeStyle('sv-bar-dot', {
            'position': 'relative', 'width': '8px', 'height': '8px',
            'border-top-left-radius': '50%', 'border-top-right-radius': '50%',
            'border-bottom-left-radius': '50%', 'border-bottom-right-radius': '50%',
            'background-color': 'transparent', 'z-index': '1',
        });
        await wait(500);
        // ── Process (Three.js 3D) ──
        logDetail('Setting process props...', 'info');
        await safeStyle('about-process-pinned', {
            'height': '100vh', 'display': 'flex', 'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
        });
        await safeStyle('about-process-visual', { 'width': '100%', 'height': '100%', 'position': 'relative' });
        await safeStyle('about-process-fx', { 'position': 'absolute', 'top': '0px', 'left': '0px', 'width': '100%', 'height': '100%' });
        await safeStyle('about-process-cards', { 'position': 'absolute', 'top': '0px', 'left': '0px', 'width': '100%', 'height': '100%', 'z-index': '2' });
        await safeStyle('about-process-card', {
            'position': 'absolute', 'background-color': v['av-dark'], 'color': v['av-cream'],
            'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
            'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
            'padding-top': '56px', 'padding-bottom': '56px', 'padding-left': '48px', 'padding-right': '48px',
            'max-width': '500px', 'width': '100%', 'top': '50%', 'left': '50%',
        });
        await safeStyle('about-process-nav', { 'position': 'absolute', 'bottom': '32px', 'left': '0px', 'width': '100%', 'text-align': 'center' });
        await safeStyle('about-process-card-num', {
            'font-family': 'DM Sans', 'font-size': v['av-text-xs'], 'letter-spacing': '0.2em',
            'text-transform': 'uppercase', 'opacity': '0.4', 'margin-bottom': '16px', 'color': v['av-cream'],
        });
        await safeStyle('about-process-card-title', {
            'font-family': 'DM Serif Display', 'font-size': '28px', 'line-height': '1.2',
            'font-weight': '400', 'margin-bottom': '14px', 'color': v['av-cream'],
        });
        await safeStyle('about-process-card-desc', {
            'font-family': 'DM Sans', 'font-size': v['av-text-sm'], 'line-height': '1.7',
            'opacity': '0.5', 'color': v['av-cream'],
        });
        await wait(500);
        // ── Utility ──
        await safeStyle('sv-mb-64', { 'margin-bottom': v['av-gap-md'] });
        await safeStyle('sv-mb-96', { 'margin-bottom': v['av-gap-lg'] });
        await safeStyle('sv-label-line', { 'flex-grow': '1', 'height': '1px', 'background-color': v['av-dark-15'] });
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
    heroH.setTextContent('Our Services');
    heroH.setAttribute('data-animate', 'opacity-sweep');
    const heroSub = heroC.append(webflow.elementPresets.DOM);
    heroSub.setTag('p');
    heroSub.setStyles([svHeroSubtitle]);
    heroSub.setTextContent('Design, permits, and construction in Orange County.');
    heroSub.setAttribute('data-animate', 'fade-up');
    await safeCall('append:hero', () => body.append(hero));
    logDetail('Section 1: Hero appended', 'ok');
    // SECTION 2: SERVICE SHOWCASE (Webflow styles for designer, CDN CSS/JS for animations)
    log('Building Section 2: Service Showcase...');
    const showcase = webflow.elementBuilder(webflow.elementPresets.DOM);
    showcase.setTag('section');
    showcase.setStyles([svShowcase]);
    showcase.setAttribute('id', 'sv-showcase');
    // Canvas wrap (Three.js fills this at runtime)
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
    // Build 6 service panels (all opacity:0, JS shows the active one at runtime)
    SERVICES.forEach((svc, i) => {
        const panel = info.append(webflow.elementPresets.DOM);
        panel.setTag('div');
        panel.setStyles([svServicePanel]);
        if (i === 0)
            panel.setAttribute('data-active', 'true');
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
    // SECTION 3: PROCESS — Three.js 3D scroll-locked (process3d.js compatible)
    log('Building Section 3: Process...');
    const proc = webflow.elementBuilder(webflow.elementPresets.DOM);
    proc.setTag('section');
    proc.setStyles([s.section, s.sectionWarm]);
    proc.setAttribute('id', 'about-process');
    const procLbl = proc.append(webflow.elementPresets.DOM);
    procLbl.setTag('div');
    procLbl.setStyles([s.label, svMb64]);
    procLbl.setAttribute('data-animate', 'fade-up');
    const procLblTxt = procLbl.append(webflow.elementPresets.DOM);
    procLblTxt.setTag('div');
    procLblTxt.setTextContent('How We Work');
    const procLblLine = procLbl.append(webflow.elementPresets.DOM);
    procLblLine.setTag('div');
    procLblLine.setStyles([svLabelLine]);
    const procH = proc.append(webflow.elementPresets.DOM);
    procH.setTag('h2');
    procH.setStyles([s.headingLG, svMb96]);
    procH.setTextContent("Avorino's Process");
    procH.setAttribute('data-animate', 'line-wipe');
    const pinned = proc.append(webflow.elementPresets.DOM);
    pinned.setTag('div');
    pinned.setStyles([processPinned]);
    pinned.setAttribute('data-process-pinned', '');
    const visual = pinned.append(webflow.elementPresets.DOM);
    visual.setTag('div');
    visual.setStyles([processVisual]);
    visual.setAttribute('data-process-visual', '');
    const fx = visual.append(webflow.elementPresets.DOM);
    fx.setTag('div');
    fx.setStyles([processFx]);
    fx.setAttribute('data-process-fx', '');
    const cards = pinned.append(webflow.elementPresets.DOM);
    cards.setTag('div');
    cards.setStyles([processCards]);
    cards.setAttribute('data-process-cards', '');
    PROCESS_STEPS.forEach((item, idx) => {
        const card = cards.append(webflow.elementPresets.DOM);
        card.setTag('div');
        card.setStyles([processCard]);
        card.setAttribute('data-process-card', String(idx));
        const n = card.append(webflow.elementPresets.DOM);
        n.setTag('div');
        n.setStyles([processCardNum]);
        n.setTextContent(item.step);
        const t = card.append(webflow.elementPresets.DOM);
        t.setTag('h3');
        t.setStyles([processCardTitle]);
        t.setTextContent(item.title);
        const d = card.append(webflow.elementPresets.DOM);
        d.setTag('p');
        d.setStyles([processCardDesc]);
        d.setTextContent(item.desc);
    });
    const nav = pinned.append(webflow.elementPresets.DOM);
    nav.setTag('div');
    nav.setStyles([processNav]);
    nav.setAttribute('data-process-nav', '');
    await safeCall('append:process', () => body.append(proc));
    logDetail('Section 3: Process appended', 'ok');
    // SECTION 4: CTA
    log('Building Section 4: CTA...');
    await buildCTASection(body, v, "Let's talk about your next project", 'Schedule a Meeting', '/schedule-a-meeting', 'Schedule a Call', '/schedule-a-meeting');
    // ═══════════════ APPLY STYLES ═══════════════
    await applyStyleProperties();
    log('Services page built! Add custom code manually (see instructions below).', 'success');
    await webflow.notify({ type: 'Success', message: 'Services page created! Now add custom code manually.' });
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
        await buildServicesPage();
    }
    catch (err) {
        log(`Error: ${err.message || err}`, 'error');
        await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
    }
    finally {
        btn.disabled = false;
    }
});
