// ════════════════════════════════════════════════════════════════
// Avorino Builder — SCHEDULE A MEETING PAGE
// Calendly-focused booking page — cream hero + inline widget + CTA
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, wait, safeCall, getAvorinVars, getOrCreateStyle, freshStyle, clearAndSet, createSharedStyles, setSharedStyleProps, createAllVariables, createPageWithSlug, buildCTASection, applyCTAStyleProps, CALENDLY_CSS, CALENDLY_JS, buildCalendlySection, applyCalendlyStyleProps, } from './shared.js';
// ── Page config ──
const PAGE_NAME = 'Schedule a Meeting';
const PAGE_SLUG = 'schedule-a-meeting';
const PAGE_TITLE = 'Schedule a Consultation — Avorino Construction';
const PAGE_DESC = 'Book a free 45-minute project consultation with Avorino Construction. No obligations.';
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
// ── Build function ──
async function buildSchedulePage() {
    clearErrorLog();
    logDetail('Starting Schedule a Meeting page build...', 'info');
    const v = await getAvorinVars();
    logDetail('Loaded Avorino variable collection', 'ok');
    log('Creating shared styles...');
    const s = await createSharedStyles();
    // ── Page-specific styles ──
    log('Creating schedule-specific styles...');
    const schHero = await getOrCreateStyle('sch-hero');
    const schHeroContent = await getOrCreateStyle('sch-hero-content');
    const schDetails = await getOrCreateStyle('sch-details');
    const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);
    async function applyStyleProperties() {
        log('Setting shared style properties...');
        await setSharedStyleProps(s, v);
        await wait(1000);
        log('Setting schedule-specific style properties...');
        // Hero: cream bg, left-aligned
        await clearAndSet(await freshStyle('sch-hero'), 'sch-hero', {
            'min-height': '40vh', 'display': 'flex', 'align-items': 'flex-end',
            'padding-top': '180px', 'padding-bottom': '64px',
            'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
            'background-color': v['av-cream'], 'color': v['av-dark'],
        });
        await clearAndSet(await freshStyle('sch-hero-content'), 'sch-hero-content', {
            'max-width': '900px',
        });
        await clearAndSet(await freshStyle('sch-details'), 'sch-details', {
            'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
            'line-height': '1.7', 'opacity': '0.4', 'margin-top': '24px',
        });
        await wait(500);
        await applyCalendlyStyleProps(v);
        await applyCTAStyleProps(v);
    }
    // ═══════════════ BUILD ELEMENTS ═══════════════
    // SECTION 1: HERO — cream bg, left-aligned
    log('Building Section 1: Hero...');
    const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
    hero.setTag('section');
    hero.setStyles([schHero]);
    hero.setAttribute('id', 'sch-hero');
    const heroC = hero.append(webflow.elementPresets.DOM);
    heroC.setTag('div');
    heroC.setStyles([schHeroContent]);
    const heroLabel = heroC.append(webflow.elementPresets.DOM);
    heroLabel.setTag('div');
    heroLabel.setStyles([s.label]);
    heroLabel.setAttribute('data-animate', 'fade-up');
    const heroLabelTxt = heroLabel.append(webflow.elementPresets.DOM);
    heroLabelTxt.setTag('div');
    heroLabelTxt.setTextContent('// Schedule');
    const heroH = heroC.append(webflow.elementPresets.DOM);
    heroH.setTag('h1');
    heroH.setStyles([s.headingXL]);
    heroH.setTextContent('Book a Consultation');
    heroH.setAttribute('data-animate', 'word-stagger-elastic');
    const heroSub = heroC.append(webflow.elementPresets.DOM);
    heroSub.setTag('p');
    heroSub.setStyles([s.body, s.bodyMuted]);
    heroSub.setTextContent('45 minutes, no obligations. Discuss your project with our team via Zoom.');
    heroSub.setAttribute('data-animate', 'fade-up');
    // Meeting details — single compact line
    const detailsLine = heroC.append(webflow.elementPresets.DOM);
    detailsLine.setTag('p');
    detailsLine.setStyles([schDetails]);
    detailsLine.setTextContent('45 min \u00B7 Zoom \u00B7 Complimentary');
    detailsLine.setAttribute('data-animate', 'fade-up');
    await safeCall('append:hero', () => body.append(hero));
    logDetail('Section 1: Hero appended', 'ok');
    // SECTION 2: CALENDLY WIDGET
    log('Building Section 2: Calendly...');
    await buildCalendlySection(body, v, 'Select a Date & Time');
    // SECTION 3: CTA
    log('Building Section 3: CTA...');
    await buildCTASection(body, v, 'Prefer a phone call?', 'Call (714) 900-3676', 'tel:7149003676', 'Send us a message', '/contact');
    // ═══════════════ APPLY STYLES ═══════════════
    await applyStyleProperties();
    log('Schedule a Meeting page built!', 'success');
    await webflow.notify({ type: 'Success', message: 'Schedule a Meeting page created!' });
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
        await buildSchedulePage();
    }
    catch (err) {
        log(`Error: ${err.message || err}`, 'error');
        await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
    }
    finally {
        btn.disabled = false;
    }
});
