// ════════════════════════════════════════════════════════════════
// Avorino Builder — CAREERS PAGE
// Cream hero + warm 2-col (culture left + form right) + CTA
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, wait, safeCall, getAvorinVars, getOrCreateStyle, clearAndSet, createSharedStyles, setSharedStyleProps, createAllVariables, createPageWithSlug, buildCTASection, applyCTAStyleProps, buildCleanForm, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
// ── Page config ──
const PAGE_NAME = 'Careers';
const PAGE_SLUG = 'careers';
const PAGE_TITLE = 'Careers at Avorino — Join Our Team';
const PAGE_DESC = 'Join the Avorino team. We build luxury homes, ADUs, and commercial projects across Orange County. Explore open positions.';
const HEAD_CODE = [
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@2bb7ded/avorino-responsive.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@2bb7ded/avorino-nav-footer.css">',
    CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
    '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@2bb7ded/avorino-animations.js"><\/script>',
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
// ── Form fields ──
const FORM_FIELDS = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'you@email.com', halfWidth: true },
    { name: 'phone', label: 'Phone', type: 'tel', placeholder: '(000) 000-0000', halfWidth: true },
    { name: 'position', label: 'Position of Interest', type: 'select', options: ['Project Manager', 'Site Superintendent', 'Carpenter / Framer', 'Electrician', 'Plumber', 'General Laborer', 'Estimator', 'Architect / Designer', 'Other'] },
    { name: 'experience', label: 'Years of Experience', type: 'select', options: ['0–2 years', '3–5 years', '5–10 years', '10+ years'] },
    { name: 'message', label: 'Tell Us About Yourself', type: 'textarea', placeholder: 'Relevant experience, certifications, availability, etc.' },
];
// ── Culture points ──
const CULTURE_POINTS = [
    { heading: 'Build extraordinary', body: 'Work on luxury custom homes, ADUs, and commercial projects across Orange County. Every project is built to last.' },
    { heading: 'Grow with us', body: 'We invest in our people. Training, certifications, and career advancement are part of the job.' },
    { heading: 'Competitive pay', body: 'Market-rate compensation, benefits, and consistent year-round work.' },
];
// ── Build function ──
async function buildCareersPage() {
    clearErrorLog();
    logDetail('Starting Careers page build...', 'info');
    const v = await getAvorinVars();
    logDetail('Loaded Avorino variable collection', 'ok');
    log('Creating shared styles...');
    const s = await createSharedStyles();
    // ── Page-specific styles ──
    log('Creating careers-specific styles...');
    const crHero = await getOrCreateStyle('cr-hero');
    const crHeroContent = await getOrCreateStyle('cr-hero-content');
    const crInfoCol = await getOrCreateStyle('cr-info-col');
    const crInfoHeading = await getOrCreateStyle('cr-info-heading');
    const crInfoBody = await getOrCreateStyle('cr-info-body');
    const crPointHeading = await getOrCreateStyle('cr-point-heading');
    const crPointBody = await getOrCreateStyle('cr-point-body');
    const crFormCol = await getOrCreateStyle('cr-form-col');
    // ── Create page ──
    const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);
    // ── Style properties ──
    async function applyStyleProperties() {
        log('Setting shared style properties...');
        await setSharedStyleProps(s, v);
        await wait(1000);
        log('Setting careers-specific style properties...');
        // Hero: cream bg, left-aligned
        await clearAndSet(crHero, 'cr-hero', {
            'min-height': '40vh', 'display': 'flex', 'align-items': 'flex-end',
            'padding-top': '180px', 'padding-bottom': '64px',
            'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
            'background-color': v['av-cream'], 'color': v['av-dark'],
        });
        await clearAndSet(crHeroContent, 'cr-hero-content', {
            'max-width': '900px',
        });
        await wait(500);
        // Info column (left side — sticky)
        await clearAndSet(crInfoCol, 'cr-info-col', {
            'display': 'flex', 'flex-direction': 'column', 'position': 'sticky', 'top': '160px',
        });
        await clearAndSet(crInfoHeading, 'cr-info-heading', {
            'font-family': 'DM Serif Display', 'font-size': v['av-text-h2'],
            'line-height': '1.08', 'letter-spacing': '-0.02em', 'font-weight': '400',
            'margin-bottom': '16px',
        });
        await clearAndSet(crInfoBody, 'cr-info-body', {
            'font-family': 'DM Sans', 'font-size': v['av-text-body'],
            'line-height': '1.9', 'opacity': '0.6',
        });
        await clearAndSet(crPointHeading, 'cr-point-heading', {
            'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
            'line-height': '1.2', 'font-weight': '400', 'margin-bottom': '8px',
        });
        await clearAndSet(crPointBody, 'cr-point-body', {
            'font-family': 'DM Sans', 'font-size': v['av-text-body'],
            'line-height': '1.7', 'opacity': '0.5',
        });
        await clearAndSet(crFormCol, 'cr-form-col', {
            'display': 'flex', 'flex-direction': 'column',
        });
        await wait(500);
        await applyCTAStyleProps(v);
    }
    // ═══════════════ BUILD ELEMENTS ═══════════════
    // SECTION 1: HERO
    log('Building Section 1: Hero...');
    const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
    hero.setTag('section');
    hero.setStyles([crHero]);
    hero.setAttribute('id', 'cr-hero');
    const heroC = hero.append(webflow.elementPresets.DOM);
    heroC.setTag('div');
    heroC.setStyles([crHeroContent]);
    const heroLabel = heroC.append(webflow.elementPresets.DOM);
    heroLabel.setTag('div');
    heroLabel.setStyles([s.label]);
    heroLabel.setAttribute('data-animate', 'fade-up');
    const heroLabelTxt = heroLabel.append(webflow.elementPresets.DOM);
    heroLabelTxt.setTag('div');
    heroLabelTxt.setTextContent('// Careers');
    const heroH = heroC.append(webflow.elementPresets.DOM);
    heroH.setTag('h1');
    heroH.setStyles([s.headingXL]);
    heroH.setTextContent('Build with us');
    heroH.setAttribute('data-animate', 'word-stagger-elastic');
    const heroSub = heroC.append(webflow.elementPresets.DOM);
    heroSub.setTag('p');
    heroSub.setStyles([s.body, s.bodyMuted]);
    heroSub.setTextContent("We're always looking for skilled professionals who take pride in their craft.");
    heroSub.setAttribute('data-animate', 'fade-up');
    await safeCall('append:hero', () => body.append(hero));
    logDetail('Section 1: Hero appended', 'ok');
    // SECTION 2: CAREERS MAIN (warm bg, 2-col: culture left + form right)
    log('Building Section 2: Careers Main...');
    const mainSection = webflow.elementBuilder(webflow.elementPresets.DOM);
    mainSection.setTag('section');
    mainSection.setStyles([s.section, s.sectionWarm]);
    mainSection.setAttribute('id', 'cr-main');
    const grid = mainSection.append(webflow.elementPresets.DOM);
    grid.setTag('div');
    grid.setStyles([s.split4060]);
    // LEFT: Culture info
    const infoCol = grid.append(webflow.elementPresets.DOM);
    infoCol.setTag('div');
    infoCol.setStyles([crInfoCol]);
    infoCol.setAttribute('data-animate', 'fade-up');
    const infoH = infoCol.append(webflow.elementPresets.DOM);
    infoH.setTag('h2');
    infoH.setStyles([crInfoHeading]);
    infoH.setTextContent('Join the Team');
    const infoP = infoCol.append(webflow.elementPresets.DOM);
    infoP.setTag('p');
    infoP.setStyles([crInfoBody]);
    infoP.setTextContent("Avorino is Orange County\u2019s trusted builder for luxury homes, ADUs, and commercial construction. We\u2019re growing and hiring across all trades.");
    // Divider
    const div1 = infoCol.append(webflow.elementPresets.DOM);
    div1.setTag('div');
    div1.setStyles([s.divider]);
    // Culture points
    for (const point of CULTURE_POINTS) {
        const ph = infoCol.append(webflow.elementPresets.DOM);
        ph.setTag('h3');
        ph.setStyles([crPointHeading]);
        ph.setTextContent(point.heading);
        const pb = infoCol.append(webflow.elementPresets.DOM);
        pb.setTag('p');
        pb.setStyles([crPointBody]);
        pb.setTextContent(point.body);
        // Small spacer between points
        const spacer = infoCol.append(webflow.elementPresets.DOM);
        spacer.setTag('div');
        spacer.setStyles([s.divider]);
    }
    // RIGHT: Application form
    const formCol = grid.append(webflow.elementPresets.DOM);
    formCol.setTag('div');
    formCol.setStyles([crFormCol]);
    buildCleanForm(formCol, FORM_FIELDS, s, 'Submit Application');
    await safeCall('append:careers', () => body.append(mainSection));
    logDetail('Section 2: Careers Main appended', 'ok');
    // SECTION 3: CTA
    log('Building Section 3: CTA...');
    await buildCTASection(body, v, 'Ready to build something extraordinary?', 'Call (714) 900-3676', 'tel:7149003676', 'Contact Us', '/contact');
    // ═══════════════ APPLY STYLES ═══════════════
    await applyStyleProperties();
    log('Careers page built!', 'success');
    await webflow.notify({ type: 'Success', message: 'Careers page created!' });
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
        await buildCareersPage();
    }
    catch (err) {
        log(`Error: ${err.message || err}`, 'error');
        await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
    }
    finally {
        btn.disabled = false;
    }
});
