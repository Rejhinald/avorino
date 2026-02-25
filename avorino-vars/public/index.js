// ════════════════════════════════════════════════════════════════
// Avorino Builder — CLIENT REVIEWS PAGE
// Rename this to index.ts to build the Client Reviews page.
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, wait, safeCall, getAvorinVars, createSharedStyles, setSharedStyleProps, createAllVariables, createPageWithSlug, buildCTASection, applyCTAStyleProps, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
// ── Review data ──
const REVIEWS = [
    { quote: 'I am so happy I used Avorino Construction to build and renovate my two custom homes in Santa Ana. Raja and his team were absolutely amazing and made the whole process seamless and streamlined.', author: 'S S.', location: 'Irvine, CA', stars: 5 },
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
// 5 featured reviews shown in the scroll section (must match avorino-reviews.js FEATURED selection)
const FEATURED = [REVIEWS[0], REVIEWS[5], REVIEWS[8], REVIEWS[3], REVIEWS[12]];
// ── Page config ──
const PAGE_NAME = 'Client Reviews';
const PAGE_SLUG = 'clientreviews';
const PAGE_TITLE = 'Client Reviews — Avorino Construction';
const PAGE_DESC = '4.9 average rating from 35+ reviews. See what Orange County homeowners say about working with Avorino.';
const HEAD_CODE = [
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@0c184a6/avorino-responsive.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@0c184a6/avorino-nav-footer.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@0c184a6/avorino-reviews.css">',
    CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
    '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@0c184a6/avorino-reviews.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@0c184a6/avorino-reviews-3d.js"><\/script>',
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
    // Create page
    const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);
    // ═══════════════ BUILD REVIEW WALL ═══════════════
    log('Building review wall...');
    const wall = webflow.elementBuilder(webflow.elementPresets.DOM);
    wall.setTag('section');
    wall.setAttribute('class', 'rv-wall');
    // Three.js canvas wrapper (populated by avorino-reviews-3d.js at runtime)
    const canvasWrap = wall.append(webflow.elementPresets.DOM);
    canvasWrap.setTag('div');
    canvasWrap.setAttribute('class', 'rv-canvas-wrap');
    // Content grid (2-column: header left, reviews right)
    const content = wall.append(webflow.elementPresets.DOM);
    content.setTag('div');
    content.setAttribute('class', 'rv-content');
    // ── Left column: Header ──
    const header = content.append(webflow.elementPresets.DOM);
    header.setTag('div');
    header.setAttribute('class', 'rv-header');
    const label = header.append(webflow.elementPresets.DOM);
    label.setTag('div');
    label.setAttribute('class', 'rv-label');
    label.setTextContent('Client Reviews');
    const heading = header.append(webflow.elementPresets.DOM);
    heading.setTag('h2');
    heading.setAttribute('class', 'rv-heading');
    heading.setTextContent('What our clients say');
    const stats = header.append(webflow.elementPresets.DOM);
    stats.setTag('div');
    stats.setAttribute('class', 'rv-stats');
    const statsStars = stats.append(webflow.elementPresets.DOM);
    statsStars.setTag('span');
    statsStars.setAttribute('class', 'rv-stats-stars');
    statsStars.setTextContent('\u2605\u2605\u2605\u2605\u2605');
    const statsText = stats.append(webflow.elementPresets.DOM);
    statsText.setTag('span');
    statsText.setTextContent('4.9 average from 35+ reviews');
    const counter = header.append(webflow.elementPresets.DOM);
    counter.setTag('div');
    counter.setAttribute('class', 'rv-counter');
    counter.setAttribute('data-el', 'rv-counter');
    counter.setTextContent('01');
    const nav = header.append(webflow.elementPresets.DOM);
    nav.setTag('div');
    nav.setAttribute('class', 'rv-nav');
    const arrowL = nav.append(webflow.elementPresets.DOM);
    arrowL.setTag('button');
    arrowL.setAttribute('class', 'rv-arrow');
    arrowL.setAttribute('aria-label', 'Previous review');
    arrowL.setTextContent('\u2039');
    const arrowR = nav.append(webflow.elementPresets.DOM);
    arrowR.setTag('button');
    arrowR.setAttribute('class', 'rv-arrow');
    arrowR.setAttribute('aria-label', 'Next review');
    arrowR.setTextContent('\u203A');
    logDetail('Header built (label, heading, stats, counter, nav)', 'ok');
    // ── Right column: Review Area ──
    const reviewArea = content.append(webflow.elementPresets.DOM);
    reviewArea.setTag('div');
    reviewArea.setAttribute('class', 'rv-review-area');
    FEATURED.forEach((review, i) => {
        const el = reviewArea.append(webflow.elementPresets.DOM);
        el.setTag('div');
        el.setAttribute('class', i === 0 ? 'rv-review is-active' : 'rv-review');
        const rvStars = el.append(webflow.elementPresets.DOM);
        rvStars.setTag('div');
        rvStars.setAttribute('class', 'rv-stars');
        rvStars.setTextContent('\u2605'.repeat(review.stars) + '\u2606'.repeat(5 - review.stars));
        const quote = el.append(webflow.elementPresets.DOM);
        quote.setTag('blockquote');
        quote.setAttribute('class', 'rv-quote');
        quote.setTextContent('\u201C' + review.quote + '\u201D');
        const sep = el.append(webflow.elementPresets.DOM);
        sep.setTag('div');
        sep.setAttribute('class', 'rv-sep');
        const author = el.append(webflow.elementPresets.DOM);
        author.setTag('div');
        author.setAttribute('class', 'rv-author');
        author.setTextContent(review.author);
        const loc = el.append(webflow.elementPresets.DOM);
        loc.setTag('div');
        loc.setAttribute('class', 'rv-location');
        loc.setTextContent(review.location);
    });
    logDetail(`Review area built (${FEATURED.length} featured reviews)`, 'ok');
    // ── Progress Bar (bottom) ──
    const progressBar = wall.append(webflow.elementPresets.DOM);
    progressBar.setTag('div');
    progressBar.setAttribute('class', 'rv-progress-bar');
    const barTrack = progressBar.append(webflow.elementPresets.DOM);
    barTrack.setTag('div');
    barTrack.setAttribute('class', 'rv-bar-track');
    const barFill = progressBar.append(webflow.elementPresets.DOM);
    barFill.setTag('div');
    barFill.setAttribute('class', 'rv-bar-fill');
    barFill.setAttribute('data-el', 'rv-bar-fill');
    FEATURED.forEach((_, i) => {
        const dot = progressBar.append(webflow.elementPresets.DOM);
        dot.setTag('div');
        dot.setAttribute('class', i === 0 ? 'rv-bar-dot is-active' : 'rv-bar-dot');
    });
    logDetail('Progress bar built (track, fill, 5 dots)', 'ok');
    await safeCall('append:wall', () => body.append(wall));
    logDetail('Review wall appended to page', 'ok');
    // CTA
    log('Building CTA...');
    await buildCTASection(body, v, 'Share your experience', 'Get a Free Estimate', '/schedule-a-meeting', 'View Our Work', '/projects');
    // APPLY STYLES
    log('Setting shared style properties...');
    await setSharedStyleProps(s, v);
    logDetail('Shared style properties set', 'ok');
    await wait(500);
    await applyCTAStyleProps(v);
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
