// ════════════════════════════════════════════════════════════════
// Avorino Builder — CLIENT REVIEWS PAGE
// Rename this to index.ts to build the Client Reviews page.
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, wait, safeCall, getAvorinVars, getOrCreateStyle, freshStyle, clearAndSet, createSharedStyles, setSharedStyleProps, createAllVariables, createPageWithSlug, buildCTASection, applyCTAStyleProps, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
// ── Review data ──
const REVIEWS = [
    { quote: 'I am so happy I used Avorino Construction to build and renovate my two custom homes in Santa Ana. Raja and his team were absolutely amazing and made the whole process seamless and streamlined. The quality of work was absolutely fantastic and top notch all the way!', author: 'S S.', location: 'Irvine, CA', stars: 5 },
    { quote: 'Avorino converted our RV garage to a custom ADU. Raja is a great project manager and easy to work with. He is organized and a clear communicator. I highly recommend them.', author: 'Sam W.', location: 'Oakland, CA', stars: 5 },
    { quote: 'Raja uses technology and shared spreadsheets that really helped me stay on track with ordering finishes and the progress of the overall project. Absolutely amazing and 10/10 experience.', author: 'S S.', location: 'Irvine, CA', stars: 5 },
    { quote: 'Owner Raja was warm and friendly. Coordinator Jay was a gem. She worked to keep everything going on time. The team worked efficiently to get the work done.', author: 'Peter H.', location: 'Lakewood, CA', stars: 4 },
    { quote: 'Raja treated my project as if it was his own and I knew I was definitely in good hands. The quality of work was absolutely fantastic and top notch all the way!', author: 'S S.', location: 'Santa Ana, CA', stars: 5 },
    { quote: 'Avorino built me a custom home. We loved how great they executed our project. The team was incredibly professional throughout the entire build process.', author: 'M. R.', location: 'Newport Beach, CA', stars: 5 },
    { quote: 'We had Avorino build us an ADU in our property recently. They provided the full design and rendering. Everything came out beautifully and on time.', author: 'L. T.', location: 'Dana Point, CA', stars: 5 },
    { quote: 'They were professional, courteous, and precise. Could not have asked for a better experience building our dream home addition.', author: 'D. K.', location: 'Mission Viejo, CA', stars: 5 },
    { quote: 'We\'ve been thrilled with how our project has turned out. This company is VERY communicative, professional and cost friendly. They got the job done in a timely manner.', author: 'K. M.', location: 'Laguna Beach, CA', stars: 5 },
    { quote: 'Raja was extremely responsive and thorough with helping guide us through our first remodeling project. We couldn\'t be happier with the results.', author: 'J. L.', location: 'Costa Mesa, CA', stars: 5 },
    { quote: 'Raja is a great project manager and easy to work with. Our architect made mistakes on the plans but Raja and team helped work through all issues expertly.', author: 'R. C.', location: 'Tustin, CA', stars: 5 },
    { quote: 'The entire team at Avorino was fantastic. From design to final walkthrough, they kept us informed every step of the way. Highly recommend.', author: 'M. P.', location: 'San Clemente, CA', stars: 5 },
    { quote: 'Best construction company in Orange County. Raja and his team deliver on their promises. Our ADU is exactly what we envisioned.', author: 'T. H.', location: 'Huntington Beach, CA', stars: 5 },
    { quote: 'Outstanding work on our custom home renovation. The attention to detail was impressive and the project was completed on schedule and within budget.', author: 'J. W.', location: 'Yorba Linda, CA', stars: 5 },
    { quote: 'Avorino made the ADU building process stress-free. Weekly updates and transparent pricing. Highly recommend to anyone in Orange County.', author: 'S. G.', location: 'Aliso Viejo, CA', stars: 5 },
];
const VARIANTS = ['', '--dark', '--red', '--warm', '--slate'];
const CARDS_PER_SET = 25;
const COLUMNS = [
    { offset: 0, speed: '80s', dir: 'up' },
    { offset: 2, speed: '100s', dir: 'down' },
    { offset: 5, speed: '70s', dir: 'up' },
    { offset: 8, speed: '110s', dir: 'down' },
    { offset: 11, speed: '90s', dir: 'up' },
];
// ── Page config ──
const PAGE_NAME = 'Client Reviews';
const PAGE_SLUG = 'clientreviews';
const PAGE_TITLE = 'Client Reviews — Avorino Construction';
const PAGE_DESC = '4.9 average rating from 35+ reviews. See what Orange County homeowners say about working with Avorino.';
const HEAD_CODE = [
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@403b53d/avorino-responsive.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@403b53d/avorino-nav-footer.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@403b53d/avorino-reviews.css">',
    CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
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
async function buildReviewsPage() {
    clearErrorLog();
    logDetail('Starting Reviews page build...', 'info');
    const v = await getAvorinVars();
    logDetail('Loaded Avorino variable collection', 'ok');
    log('Creating shared styles...');
    const s = await createSharedStyles();
    logDetail('Shared styles done', 'ok');
    // Page-specific styles
    log('Creating page-specific styles...');
    const rvWall = await getOrCreateStyle('rv-wall');
    const rvGrid = await getOrCreateStyle('rv-grid');
    const rvCol = await getOrCreateStyle('rv-col');
    const rvColUp = await getOrCreateStyle('rv-col--up');
    const rvColDown = await getOrCreateStyle('rv-col--down');
    const rvColTrack = await getOrCreateStyle('rv-col-track');
    const rvCard = await getOrCreateStyle('rv-card');
    const rvCardDark = await getOrCreateStyle('rv-card--dark');
    const rvCardRed = await getOrCreateStyle('rv-card--red');
    const rvCardWarm = await getOrCreateStyle('rv-card--warm');
    const rvCardSlate = await getOrCreateStyle('rv-card--slate');
    const rvStars = await getOrCreateStyle('rv-stars');
    const rvQuote = await getOrCreateStyle('rv-quote');
    const rvAttrib = await getOrCreateStyle('rv-attrib');
    const rvAuthor = await getOrCreateStyle('rv-author');
    const rvLocation = await getOrCreateStyle('rv-location');
    // Carousel styles
    const rvCarousel = await getOrCreateStyle('rv-carousel');
    const rvCarouselViewport = await getOrCreateStyle('rv-carousel-viewport');
    const rvCarouselTrack = await getOrCreateStyle('rv-carousel-track');
    const rvCarouselSlide = await getOrCreateStyle('rv-carousel-slide');
    const rvCarouselCard = await getOrCreateStyle('rv-carousel-card');
    const rvCarouselArrow = await getOrCreateStyle('rv-carousel-arrow');
    // Create page
    const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);
    // Style properties — applied after all elements are built
    async function applyStyleProperties() {
        log('Setting shared style properties...');
        await setSharedStyleProps(s, v);
        logDetail('Shared style properties set', 'ok');
        await wait(1000);
        log('Setting page-specific style properties...');
        await clearAndSet(await freshStyle('rv-wall'), 'rv-wall', {
            'width': '100vw', 'height': '100vh',
            'overflow-x': 'hidden', 'overflow-y': 'hidden',
            'position': 'relative', 'background-color': v['av-dark'],
        });
        await clearAndSet(await freshStyle('rv-grid'), 'rv-grid', {
            'position': 'absolute', 'top': '50%', 'left': '50%',
            'display': 'flex', 'grid-column-gap': '24px',
            'filter': 'blur(3px)', 'opacity': '0.6',
        });
        await clearAndSet(await freshStyle('rv-col'), 'rv-col', {
            'width': '500px', 'flex-shrink': '0',
            'overflow-x': 'hidden', 'overflow-y': 'hidden',
            'height': '250vmax',
        });
        await wait(500);
        await clearAndSet(await freshStyle('rv-col-track'), 'rv-col-track', {
            'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '24px',
        });
        await clearAndSet(await freshStyle('rv-card'), 'rv-card', {
            'background-color': v['av-cream'],
            'border-top-left-radius': '24px', 'border-top-right-radius': '24px',
            'border-bottom-left-radius': '24px', 'border-bottom-right-radius': '24px',
            'padding-top': '48px', 'padding-bottom': '48px',
            'padding-left': '44px', 'padding-right': '44px',
            'flex-shrink': '0', 'display': 'flex', 'flex-direction': 'column',
            'grid-row-gap': '24px',
        });
        await wait(500);
        await clearAndSet(await freshStyle('rv-card--dark'), 'rv-card--dark', {
            'background-color': '#1a1a1a',
        });
        await clearAndSet(await freshStyle('rv-card--red'), 'rv-card--red', {
            'background-color': v['av-red'],
        });
        await clearAndSet(await freshStyle('rv-card--warm'), 'rv-card--warm', {
            'background-color': v['av-warm'],
        });
        await clearAndSet(await freshStyle('rv-card--slate'), 'rv-card--slate', {
            'background-color': v['av-teal'],
        });
        await wait(500);
        await clearAndSet(await freshStyle('rv-stars'), 'rv-stars', {
            'color': v['av-red'], 'font-size': '19px', 'letter-spacing': '3px',
            'font-family': 'system-ui, sans-serif',
        });
        await clearAndSet(await freshStyle('rv-quote'), 'rv-quote', {
            'font-family': 'DM Serif Display', 'font-size': '22px',
            'line-height': '1.6', 'font-weight': '400', 'font-style': 'italic',
            'color': v['av-dark'], 'margin-top': '0px', 'margin-bottom': '0px',
        });
        await clearAndSet(await freshStyle('rv-attrib'), 'rv-attrib', {
            'display': 'flex', 'align-items': 'baseline', 'grid-column-gap': '8px',
            'padding-top': '4px',
            'border-top-width': '1px', 'border-top-style': 'solid',
            'border-top-color': v['av-dark-06'],
        });
        await clearAndSet(await freshStyle('rv-author'), 'rv-author', {
            'font-family': 'DM Sans', 'font-size': '16px', 'font-weight': '600',
            'color': v['av-dark'],
        });
        await clearAndSet(await freshStyle('rv-location'), 'rv-location', {
            'font-family': 'DM Sans', 'font-size': '14px',
            'color': v['av-dark'], 'opacity': '0.35',
        });
        await wait(500);
        // Carousel styles
        log('Setting carousel style properties...');
        await clearAndSet(await freshStyle('rv-carousel'), 'rv-carousel', {
            'position': 'absolute', 'top': '50%', 'left': '50%',
            'z-index': '10', 'width': '100%', 'max-width': '1100px',
            'padding-left': '80px', 'padding-right': '80px',
        });
        await clearAndSet(await freshStyle('rv-carousel-viewport'), 'rv-carousel-viewport', {
            'overflow-x': 'hidden', 'overflow-y': 'hidden', 'width': '100%',
        });
        await clearAndSet(await freshStyle('rv-carousel-track'), 'rv-carousel-track', {
            'display': 'flex',
        });
        await clearAndSet(await freshStyle('rv-carousel-slide'), 'rv-carousel-slide', {
            'flex-shrink': '0', 'padding-left': '16px', 'padding-right': '16px',
        });
        await clearAndSet(await freshStyle('rv-carousel-card'), 'rv-carousel-card', {
            'border-top-left-radius': '28px', 'border-top-right-radius': '28px',
            'border-bottom-left-radius': '28px', 'border-bottom-right-radius': '28px',
            'padding-top': '52px', 'padding-bottom': '52px',
            'padding-left': '44px', 'padding-right': '44px',
            'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '24px',
        });
        await clearAndSet(await freshStyle('rv-carousel-arrow'), 'rv-carousel-arrow', {
            'position': 'absolute', 'top': '50%', 'z-index': '11',
            'width': '52px', 'height': '52px',
            'border-top-left-radius': '50%', 'border-top-right-radius': '50%',
            'border-bottom-left-radius': '50%', 'border-bottom-right-radius': '50%',
            'color': v['av-dark'], 'font-size': '24px',
            'cursor': 'pointer', 'display': 'flex',
            'align-items': 'center', 'justify-content': 'center',
        });
        await wait(500);
        await applyCTAStyleProps(v);
    }
    // ═══════════════ BUILD ELEMENTS ═══════════════
    // WALL SECTION
    log('Building review wall...');
    const wall = webflow.elementBuilder(webflow.elementPresets.DOM);
    wall.setTag('section');
    wall.setStyles([rvWall]);
    const grid = wall.append(webflow.elementPresets.DOM);
    grid.setTag('div');
    grid.setStyles([rvGrid]);
    const variantStyles = {
        '': null,
        '--dark': rvCardDark,
        '--red': rvCardRed,
        '--warm': rvCardWarm,
        '--slate': rvCardSlate,
    };
    COLUMNS.forEach((colConfig, colIdx) => {
        const col = grid.append(webflow.elementPresets.DOM);
        col.setTag('div');
        col.setStyles([rvCol, colConfig.dir === 'up' ? rvColUp : rvColDown]);
        col.setAttribute('style', `--rv-speed: ${colConfig.speed}`);
        const track = col.append(webflow.elementPresets.DOM);
        track.setTag('div');
        track.setStyles([rvColTrack]);
        for (let dup = 0; dup < 2; dup++) {
            for (let i = 0; i < CARDS_PER_SET; i++) {
                const review = REVIEWS[(i + colConfig.offset) % REVIEWS.length];
                const variant = VARIANTS[(i + colIdx) % VARIANTS.length];
                const card = track.append(webflow.elementPresets.DOM);
                card.setTag('div');
                const vs = variantStyles[variant];
                card.setStyles(vs ? [rvCard, vs] : [rvCard]);
                const stars = card.append(webflow.elementPresets.DOM);
                stars.setTag('div');
                stars.setStyles([rvStars]);
                stars.setTextContent('\u2605'.repeat(review.stars) + '\u2606'.repeat(5 - review.stars));
                const quote = card.append(webflow.elementPresets.DOM);
                quote.setTag('p');
                quote.setStyles([rvQuote]);
                quote.setTextContent('\u201C' + review.quote + '\u201D');
                const attrib = card.append(webflow.elementPresets.DOM);
                attrib.setTag('div');
                attrib.setStyles([rvAttrib]);
                const author = attrib.append(webflow.elementPresets.DOM);
                author.setTag('span');
                author.setStyles([rvAuthor]);
                author.setTextContent(review.author);
                const loc = attrib.append(webflow.elementPresets.DOM);
                loc.setTag('span');
                loc.setStyles([rvLocation]);
                loc.setTextContent(review.location);
            }
        }
    });
    // CAROUSEL OVERLAY
    log('Building carousel overlay...');
    const carousel = wall.append(webflow.elementPresets.DOM);
    carousel.setTag('div');
    carousel.setStyles([rvCarousel]);
    const arrowLeft = carousel.append(webflow.elementPresets.DOM);
    arrowLeft.setTag('button');
    arrowLeft.setStyles([rvCarouselArrow]);
    arrowLeft.setTextContent('\u2039');
    const viewport = carousel.append(webflow.elementPresets.DOM);
    viewport.setTag('div');
    viewport.setStyles([rvCarouselViewport]);
    const cTrack = viewport.append(webflow.elementPresets.DOM);
    cTrack.setTag('div');
    cTrack.setStyles([rvCarouselTrack]);
    REVIEWS.forEach((review) => {
        const slide = cTrack.append(webflow.elementPresets.DOM);
        slide.setTag('div');
        slide.setStyles([rvCarouselSlide]);
        const cCard = slide.append(webflow.elementPresets.DOM);
        cCard.setTag('div');
        cCard.setStyles([rvCarouselCard]);
        const cStars = cCard.append(webflow.elementPresets.DOM);
        cStars.setTag('div');
        cStars.setStyles([rvStars]);
        cStars.setTextContent('\u2605'.repeat(review.stars) + '\u2606'.repeat(5 - review.stars));
        const cQuote = cCard.append(webflow.elementPresets.DOM);
        cQuote.setTag('p');
        cQuote.setStyles([rvQuote]);
        cQuote.setTextContent('\u201C' + review.quote + '\u201D');
        const cAttrib = cCard.append(webflow.elementPresets.DOM);
        cAttrib.setTag('div');
        cAttrib.setStyles([rvAttrib]);
        const cAuthor = cAttrib.append(webflow.elementPresets.DOM);
        cAuthor.setTag('span');
        cAuthor.setStyles([rvAuthor]);
        cAuthor.setTextContent(review.author);
        const cLoc = cAttrib.append(webflow.elementPresets.DOM);
        cLoc.setTag('span');
        cLoc.setStyles([rvLocation]);
        cLoc.setTextContent(review.location);
    });
    const arrowRight = carousel.append(webflow.elementPresets.DOM);
    arrowRight.setTag('button');
    arrowRight.setStyles([rvCarouselArrow]);
    arrowRight.setTextContent('\u203A');
    logDetail('Carousel overlay built (15 slides)', 'ok');
    await safeCall('append:wall', () => body.append(wall));
    logDetail('Review wall + carousel appended', 'ok');
    // CTA
    log('Building CTA...');
    await buildCTASection(body, v, 'Share your experience', 'Get a Free Estimate', '/schedule-a-meeting', 'View Our Work', '/projects');
    // APPLY STYLES
    await applyStyleProperties();
    log('Reviews page built! Add custom code manually (see instructions below).', 'success');
    await webflow.notify({ type: 'Success', message: 'Reviews page created! Now add custom code manually.' });
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
