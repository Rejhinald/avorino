// ════════════════════════════════════════════════════════════════
// Avorino Builder — CLIENT REVIEWS PAGE (v2 redesign)
// Featured quote hero + 2-col light review cards
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, wait, safeCall, getAvorinVars, getOrCreateStyle, clearAndSet, createSharedStyles, setSharedStyleProps, createAllVariables, createPageWithSlug, buildCTASection, applyCTAStyleProps, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
// ── Page config ──
const PAGE_NAME = 'Client Reviews';
const PAGE_SLUG = 'clientreviews';
const PAGE_TITLE = 'Client Reviews — Avorino Construction';
const PAGE_DESC = '4.9 average rating from 35+ reviews. See what Orange County homeowners say about working with Avorino.';
const HEAD_CODE = [
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@403b53d/avorino-responsive.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@403b53d/avorino-nav-footer.css">',
    CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
    '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@403b53d/avorino-animations.js"><\/script>',
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
// ── Featured review (displayed in hero) ──
const FEATURED = {
    quote: 'I am so happy I used Avorino Construction to build and renovate my two custom homes in Santa Ana. Raja and his team were absolutely amazing and made the whole process seamless and streamlined. The quality of work was absolutely fantastic and top notch all the way!',
    author: 'S S.',
    location: 'Irvine',
};
// ── All reviews (displayed in grid) ──
const REVIEWS = [
    { quote: 'Avorino converted our RV garage to a custom ADU. Raja is a great project manager and easy to work with. He is organized and a clear communicator. I highly recommend them.', author: 'Sam W.', location: 'Oakland', stars: 5 },
    { quote: 'Raja uses technology and shared spreadsheets that really helped me stay on track with ordering finishes and the progress of the overall project. Absolutely amazing and 10/10 experience.', author: 'S S.', location: 'Irvine', stars: 5 },
    { quote: 'Owner Raja was warm and friendly. Coordinator Jay was a gem. She worked to keep everything going on time. The team worked efficiently to get the work done.', author: 'Peter H.', location: 'Lakewood', stars: 4 },
    { quote: 'Raja treated my project as if it was his own and I knew I was definitely in good hands. The quality of work was absolutely fantastic and top notch all the way!', author: 'S S.', location: 'Santa Ana', stars: 5 },
];
// ── Build function ──
async function buildReviewsPage() {
    clearErrorLog();
    logDetail('Starting Reviews page build (v2)...', 'info');
    const v = await getAvorinVars();
    log('Creating shared styles...');
    const s = await createSharedStyles();
    // ── Page-specific styles ──
    log('Creating reviews-specific styles...');
    const rvHero = await getOrCreateStyle('rv-hero');
    const rvHeroContent = await getOrCreateStyle('rv-hero-content');
    const rvHeroLabel = await getOrCreateStyle('rv-hero-label');
    const rvHeroQuote = await getOrCreateStyle('rv-hero-quote');
    const rvHeroAttrib = await getOrCreateStyle('rv-hero-attrib');
    const rvGrid = await getOrCreateStyle('rv-grid');
    const rvCard = await getOrCreateStyle('rv-card');
    const rvQuote = await getOrCreateStyle('rv-quote');
    const rvAuthor = await getOrCreateStyle('rv-author');
    const rvLocation = await getOrCreateStyle('rv-location');
    const rvStars = await getOrCreateStyle('rv-stars');
    const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);
    async function applyStyleProperties() {
        log('Setting shared style properties...');
        await setSharedStyleProps(s, v);
        await wait(1000);
        log('Setting reviews-specific style properties...');
        // Hero: tall, dark, centered featured quote
        await clearAndSet(rvHero, 'rv-hero', {
            'min-height': '70vh', 'display': 'flex', 'align-items': 'center', 'justify-content': 'center',
            'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
            'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
            'background-color': v['av-dark'], 'color': v['av-cream'],
            'text-align': 'center',
        });
        await clearAndSet(rvHeroContent, 'rv-hero-content', {
            'max-width': '800px',
        });
        await clearAndSet(rvHeroLabel, 'rv-hero-label', {
            'font-family': 'DM Sans', 'font-size': v['av-text-label'],
            'letter-spacing': '0.3em', 'text-transform': 'uppercase',
            'opacity': '0.3', 'margin-bottom': '48px',
        });
        await clearAndSet(rvHeroQuote, 'rv-hero-quote', {
            'font-family': 'DM Serif Display',
            'font-size': 'clamp(28px, 3.5vw, 48px)',
            'line-height': '1.3', 'font-weight': '400', 'font-style': 'italic',
            'margin-bottom': '40px', 'color': v['av-cream'],
        });
        await clearAndSet(rvHeroAttrib, 'rv-hero-attrib', {
            'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
            'opacity': '0.5',
        });
        await wait(500);
        // Review grid (2-col, light cards)
        await clearAndSet(rvGrid, 'rv-grid', {
            'display': 'grid', 'grid-template-columns': '1fr 1fr',
            'grid-column-gap': '24px', 'grid-row-gap': '24px',
        });
        await clearAndSet(rvCard, 'rv-card', {
            'background-color': v['av-cream'], 'color': v['av-dark'],
            'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
            'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
            'padding-top': '48px', 'padding-bottom': '48px',
            'padding-left': '40px', 'padding-right': '40px',
            'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '24px',
            'border-top-width': '1px', 'border-bottom-width': '1px',
            'border-left-width': '1px', 'border-right-width': '1px',
            'border-top-style': 'solid', 'border-bottom-style': 'solid',
            'border-left-style': 'solid', 'border-right-style': 'solid',
            'border-top-color': v['av-dark-06'], 'border-bottom-color': v['av-dark-06'],
            'border-left-color': v['av-dark-06'], 'border-right-color': v['av-dark-06'],
        });
        await clearAndSet(rvQuote, 'rv-quote', {
            'font-family': 'DM Serif Display', 'font-size': '20px',
            'line-height': '1.5', 'font-weight': '400', 'font-style': 'italic',
        });
        await clearAndSet(rvAuthor, 'rv-author', {
            'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
            'font-weight': '500',
        });
        await clearAndSet(rvLocation, 'rv-location', {
            'font-family': 'DM Sans', 'font-size': v['av-text-xs'],
            'opacity': '0.4',
        });
        await clearAndSet(rvStars, 'rv-stars', {
            'font-size': '18px', 'letter-spacing': '0.1em', 'color': v['av-red'],
        });
        await wait(500);
        await applyCTAStyleProps(v);
    }
    // ═══════════════ BUILD ELEMENTS ═══════════════
    // SECTION 1: FEATURED QUOTE HERO (dark, tall, centered)
    log('Building Section 1: Featured Quote Hero...');
    const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
    hero.setTag('section');
    hero.setStyles([rvHero]);
    hero.setAttribute('id', 'rv-hero');
    const heroC = hero.append(webflow.elementPresets.DOM);
    heroC.setTag('div');
    heroC.setStyles([rvHeroContent]);
    const heroLabel = heroC.append(webflow.elementPresets.DOM);
    heroLabel.setTag('div');
    heroLabel.setStyles([rvHeroLabel]);
    heroLabel.setTextContent('4.9 stars from 35+ reviews');
    heroLabel.setAttribute('data-animate', 'fade-up');
    const heroQuote = heroC.append(webflow.elementPresets.DOM);
    heroQuote.setTag('div');
    heroQuote.setStyles([rvHeroQuote]);
    heroQuote.setTextContent(`\u201C${FEATURED.quote}\u201D`);
    heroQuote.setAttribute('data-animate', 'fade-up');
    const heroAttrib = heroC.append(webflow.elementPresets.DOM);
    heroAttrib.setTag('div');
    heroAttrib.setStyles([rvHeroAttrib]);
    heroAttrib.setTextContent(`\u2014 ${FEATURED.author}, ${FEATURED.location}`);
    heroAttrib.setAttribute('data-animate', 'fade-up');
    await safeCall('append:hero', () => body.append(hero));
    logDetail('Section 1: Featured Quote Hero appended', 'ok');
    // SECTION 2: REVIEWS GRID (warm bg, 2-col light cards)
    log('Building Section 2: Reviews Grid...');
    const reviewsSection = webflow.elementBuilder(webflow.elementPresets.DOM);
    reviewsSection.setTag('section');
    reviewsSection.setStyles([s.section, s.sectionWarm]);
    reviewsSection.setAttribute('id', 'rv-reviews');
    const grid = reviewsSection.append(webflow.elementPresets.DOM);
    grid.setTag('div');
    grid.setStyles([rvGrid]);
    grid.setAttribute('data-animate', 'fade-up-stagger');
    REVIEWS.forEach(review => {
        const card = grid.append(webflow.elementPresets.DOM);
        card.setTag('div');
        card.setStyles([rvCard]);
        card.setAttribute('data-animate', 'fade-up');
        const stars = card.append(webflow.elementPresets.DOM);
        stars.setTag('div');
        stars.setStyles([rvStars]);
        stars.setTextContent('\u2605'.repeat(review.stars) + '\u2606'.repeat(5 - review.stars));
        const quote = card.append(webflow.elementPresets.DOM);
        quote.setTag('p');
        quote.setStyles([rvQuote]);
        quote.setTextContent(`\u201C${review.quote}\u201D`);
        const author = card.append(webflow.elementPresets.DOM);
        author.setTag('div');
        author.setStyles([rvAuthor]);
        author.setTextContent(review.author);
        const loc = card.append(webflow.elementPresets.DOM);
        loc.setTag('div');
        loc.setStyles([rvLocation]);
        loc.setTextContent(review.location);
    });
    await safeCall('append:reviews', () => body.append(reviewsSection));
    logDetail('Section 2: Reviews Grid appended', 'ok');
    // SECTION 3: CTA
    log('Building Section 3: CTA...');
    await buildCTASection(body, v, 'Start your project', 'Schedule a Meeting', '/schedule-a-meeting', 'View Our Work', '/adu');
    await applyStyleProperties();
    log('Reviews page built!', 'success');
    await webflow.notify({ type: 'Success', message: 'Reviews page created!' });
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
        await buildReviewsPage();
    }
    catch (err) {
        log(`Error: ${err.message || err}`, 'error');
        await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
    }
    finally {
        btn.disabled = false;
    }
});
