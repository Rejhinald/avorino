// ════════════════════════════════════════════════════════════════
// Avorino Builder — FREE ESTIMATE PAGE (v2 redesign)
// 2-col: "what happens next" left + extended form right
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, wait, safeCall, getAvorinVars, getOrCreateStyle, freshStyle, clearAndSet, createSharedStyles, setSharedStyleProps, createAllVariables, createPageWithSlug, buildCTASection, applyCTAStyleProps, buildCleanForm, CALENDLY_CSS, CALENDLY_JS, buildCalendlySection, applyCalendlyStyleProps, } from './shared.js';
// ── Page config ──
const PAGE_NAME = 'Free Estimate';
const PAGE_SLUG = 'free-estimate';
const PAGE_TITLE = 'Get Your Free Estimate — Avorino Construction';
const PAGE_DESC = 'No obligations. Real numbers for your construction project in Orange County.';
const HEAD_CODE = [
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@1bd982d/avorino-responsive.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@1bd982d/avorino-nav-footer.css">',
    CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
    '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@1bd982d/avorino-animations.js"><\/script>',
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
    { name: 'address', label: 'Property Address', type: 'text', placeholder: 'Street address, City, CA' },
    { name: 'service', label: 'Service Type', type: 'select', options: ['ADU', 'Custom Home', 'Renovation', 'Addition', 'Garage Conversion', 'Commercial', 'Other'], halfWidth: true },
    { name: 'budget', label: 'Budget Range', type: 'select', options: ['Under $100K', '$100K–$250K', '$250K–$500K', '$500K–$1M', '$1M+', 'Not sure yet'], halfWidth: true },
    { name: 'timeline', label: 'Timeline', type: 'select', options: ['Ready now', '1–3 months', '3–6 months', '6–12 months', 'Just exploring'] },
    { name: 'details', label: 'Project Details', type: 'textarea', placeholder: 'Describe your project — size, goals, anything relevant.' },
];
// ── "What happens next" items ──
const NEXT_STEPS = [
    { title: 'We review your details', note: 'within 24 hours' },
    { title: 'Free site visit', note: 'at your property' },
    { title: 'Detailed proposal', note: 'in 5 business days' },
];
// ── Build function ──
async function buildEstimatePage() {
    clearErrorLog();
    logDetail('Starting Free Estimate page build (v2)...', 'info');
    const v = await getAvorinVars();
    log('Creating shared styles...');
    const s = await createSharedStyles();
    // ── Page-specific styles ──
    log('Creating estimate-specific styles...');
    const estHero = await getOrCreateStyle('est-hero');
    const estHeroContent = await getOrCreateStyle('est-hero-content');
    const estInfoCol = await getOrCreateStyle('est-info-col');
    const estInfoHeading = await getOrCreateStyle('est-info-heading');
    const estInfoBody = await getOrCreateStyle('est-info-body');
    const estStepItem = await getOrCreateStyle('est-step-item');
    const estStepTitle = await getOrCreateStyle('est-step-title');
    const estStepNote = await getOrCreateStyle('est-step-note');
    const estStepNum = await getOrCreateStyle('est-step-num');
    const estFormCol = await getOrCreateStyle('est-form-col');
    const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);
    async function applyStyleProperties() {
        log('Setting shared style properties...');
        await setSharedStyleProps(s, v);
        await wait(1000);
        log('Setting estimate-specific style properties...');
        // Hero: centered, dark, minimal
        await clearAndSet(await freshStyle('est-hero'), 'est-hero', {
            'min-height': '50vh', 'display': 'flex', 'align-items': 'center', 'justify-content': 'center',
            'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
            'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
            'background-color': v['av-dark'], 'color': v['av-cream'],
            'text-align': 'center',
        });
        await clearAndSet(await freshStyle('est-hero-content'), 'est-hero-content', {
            'max-width': '700px',
        });
        await wait(500);
        // Info column (left side)
        await clearAndSet(await freshStyle('est-info-col'), 'est-info-col', {
            'display': 'flex', 'flex-direction': 'column', 'position': 'sticky', 'top': '160px',
        });
        await clearAndSet(await freshStyle('est-info-heading'), 'est-info-heading', {
            'font-family': 'DM Serif Display', 'font-size': v['av-text-h2'],
            'line-height': '1.08', 'letter-spacing': '-0.02em', 'font-weight': '400',
            'margin-bottom': '16px',
        });
        await clearAndSet(await freshStyle('est-info-body'), 'est-info-body', {
            'font-family': 'DM Sans', 'font-size': v['av-text-body'],
            'line-height': '1.9', 'opacity': '0.6',
        });
        // Step items (stacked in left column)
        await clearAndSet(await freshStyle('est-step-item'), 'est-step-item', {
            'display': 'flex', 'align-items': 'baseline', 'grid-column-gap': '16px',
            'padding-top': '16px', 'padding-bottom': '16px',
        });
        await clearAndSet(await freshStyle('est-step-num'), 'est-step-num', {
            'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
            'line-height': '1', 'font-weight': '400', 'opacity': '0.15',
            'min-width': '32px',
        });
        await clearAndSet(await freshStyle('est-step-title'), 'est-step-title', {
            'font-family': 'DM Serif Display', 'font-size': v['av-text-body'],
            'line-height': '1.4', 'font-weight': '400',
        });
        await clearAndSet(await freshStyle('est-step-note'), 'est-step-note', {
            'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
            'opacity': '0.4', 'margin-left': 'auto',
        });
        await clearAndSet(await freshStyle('est-form-col'), 'est-form-col', {
            'display': 'flex', 'flex-direction': 'column',
        });
        await wait(500);
        await applyCTAStyleProps(v);
    }
    // ═══════════════ BUILD ELEMENTS ═══════════════
    // SECTION 1: HERO (dark, centered)
    log('Building Section 1: Hero...');
    const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
    hero.setTag('section');
    hero.setStyles([estHero]);
    hero.setAttribute('id', 'est-hero');
    const heroC = hero.append(webflow.elementPresets.DOM);
    heroC.setTag('div');
    heroC.setStyles([estHeroContent]);
    const heroH = heroC.append(webflow.elementPresets.DOM);
    heroH.setTag('h1');
    heroH.setStyles([s.headingXL]);
    heroH.setTextContent('Get Your Free Estimate');
    heroH.setAttribute('data-animate', 'word-stagger-elastic');
    const heroSub = heroC.append(webflow.elementPresets.DOM);
    heroSub.setTag('p');
    heroSub.setStyles([s.body, s.bodyMuted]);
    heroSub.setTextContent('No obligations. Real numbers for your project.');
    heroSub.setAttribute('data-animate', 'fade-up');
    await safeCall('append:hero', () => body.append(hero));
    logDetail('Section 1: Hero appended', 'ok');
    // SECTION 2: ESTIMATE FORM (warm bg, 2-col: info left + form right)
    log('Building Section 2: Form...');
    const formSection = webflow.elementBuilder(webflow.elementPresets.DOM);
    formSection.setTag('section');
    formSection.setStyles([s.section, s.sectionWarm]);
    formSection.setAttribute('id', 'est-form');
    const grid = formSection.append(webflow.elementPresets.DOM);
    grid.setTag('div');
    grid.setStyles([s.split4060]);
    // LEFT: Info + "what happens next"
    const infoCol = grid.append(webflow.elementPresets.DOM);
    infoCol.setTag('div');
    infoCol.setStyles([estInfoCol]);
    infoCol.setAttribute('data-animate', 'fade-up');
    const infoH = infoCol.append(webflow.elementPresets.DOM);
    infoH.setTag('h2');
    infoH.setStyles([estInfoHeading]);
    infoH.setTextContent('Tell us about your project');
    const infoP = infoCol.append(webflow.elementPresets.DOM);
    infoP.setTag('p');
    infoP.setStyles([estInfoBody]);
    infoP.setTextContent('Fill out the form and we\u2019ll get back to you within 24 hours with a detailed estimate.');
    // Divider
    const div1 = infoCol.append(webflow.elementPresets.DOM);
    div1.setTag('div');
    div1.setStyles([s.divider]);
    // "What Happens Next" label
    const nextLabel = infoCol.append(webflow.elementPresets.DOM);
    nextLabel.setTag('div');
    nextLabel.setStyles([s.label]);
    const nextLabelTxt = nextLabel.append(webflow.elementPresets.DOM);
    nextLabelTxt.setTag('div');
    nextLabelTxt.setTextContent('What Happens Next');
    // Step items
    NEXT_STEPS.forEach((step, i) => {
        const item = infoCol.append(webflow.elementPresets.DOM);
        item.setTag('div');
        item.setStyles([estStepItem]);
        const num = item.append(webflow.elementPresets.DOM);
        num.setTag('div');
        num.setStyles([estStepNum]);
        num.setTextContent(String(i + 1));
        const title = item.append(webflow.elementPresets.DOM);
        title.setTag('div');
        title.setStyles([estStepTitle]);
        title.setTextContent(step.title);
        const note = item.append(webflow.elementPresets.DOM);
        note.setTag('div');
        note.setStyles([estStepNote]);
        note.setTextContent(step.note);
    });
    // RIGHT: Form
    const formCol = grid.append(webflow.elementPresets.DOM);
    formCol.setTag('div');
    formCol.setStyles([estFormCol]);
    buildCleanForm(formCol, FORM_FIELDS, s, 'Request Estimate');
    await safeCall('append:form', () => body.append(formSection));
    logDetail('Section 2: Form appended', 'ok');
    // SECTION 3: CALENDLY
    log('Building Section 3: Calendly...');
    await buildCalendlySection(body, v, 'Or Book a Consultation');
    // SECTION 4: CTA
    log('Building Section 4: CTA...');
    await buildCTASection(body, v, 'Or call us directly', 'Call (714) 900-3676', 'tel:7149003676');
    await applyStyleProperties();
    await applyCalendlyStyleProps(v);
    log('Free Estimate page built!', 'success');
    await webflow.notify({ type: 'Success', message: 'Free Estimate page created!' });
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
        await buildEstimatePage();
    }
    catch (err) {
        log(`Error: ${err.message || err}`, 'error');
        await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
    }
    finally {
        btn.disabled = false;
    }
});
