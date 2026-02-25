// ════════════════════════════════════════════════════════════════
// Avorino Builder — CLIENT REVIEWS PAGE
// Rename this to index.ts to build the Client Reviews page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog, wait,
  safeCall, getAvorinVars, getOrCreateStyle, freshStyle,
  clearAndSet, createSharedStyles, setSharedStyleProps,
  createAllVariables, createPageWithSlug,
  buildCTASection, applyCTAStyleProps,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

// ── Review data (real Yelp reviews) ──
const REVIEWS = [
  { quote: 'I am so happy I used Avorino Construction to build and renovate my two custom homes in Santa Ana. Raja and his team were absolutely amazing and made the whole process seamless and streamlined. The quality of work was absolutely fantastic and top notch all the way!', author: 'S S.', location: 'Irvine, CA', stars: 5 },
  { quote: 'Avorino converted our RV garage to a custom ADU. Raja is a great project manager and easy to work with. He is organized and a clear communicator. Our architect made mistakes on the plans but Raja and team helped work through all issues. I highly recommend them.', author: 'Sam W.', location: 'Oakland, CA', stars: 5 },
  { quote: 'These guys helped us out, converting our one car garage into a junior ADU. The city was difficult to work with, and they took care of everything. Raja was excellent and easy to work with. Their cost was very competitive. I would definitely work with them again.', author: 'Alex D.', location: 'Los Angeles, CA', stars: 5 },
  { quote: 'We had Avorino build us an ADU in our property recently. They provided the full design and rendering. They pulled permits and built our 1,000 sqft ADU from start to finish. They are really easy to work with and their prices are very competitive.', author: 'Ray W.', location: 'Irvine, CA', stars: 5 },
  { quote: 'This was my first kitchen remodeling experience and I was very nervous. From the first time I made contact, it was a smooth and professional experience. They executed my vision in every detail. The work was completed in less time than estimated and perfectly within budget.', author: 'Tina C.', location: 'Dana Point, CA', stars: 5 },
  { quote: 'What a wonderful experience working with Raja and his team! Raja was extremely professional, timely, and had clear communication the entire time. My parents were so happy with how their ADU turned out and I am impressed with the care and service I received!', author: 'Alarah R.', location: 'Orange County, CA', stars: 5 },
  { quote: 'It\'s so rare to find a contractor that you have a good experience with. They got the work done quickly and made sure every little detail was completed without me having to be on top of them. I highly recommend and will definitely use them again!', author: 'Nikki B.', location: 'Laguna Niguel, CA', stars: 5 },
  { quote: 'These are the best people in the business. They beat every single price that I got on top of that they did an excellent job finishing it in no time. They are truly the best of the best, highly recommended.', author: 'Shahin S.', location: 'Los Angeles, CA', stars: 5 },
  { quote: 'Avorino built me a custom home. We loved how great they executed our project. We were impressed that they finished before the estimated timeline. They communicated every step. Love this company.', author: 'Hooman E.', location: 'Irvine, CA', stars: 5 },
  { quote: 'Raja and William were great to work with. After our consultation they started the work within a week. They were professional, courteous, and precise. The job turned out great. I would totally recommend them.', author: 'Ryan J.', location: 'Brentwood, CA', stars: 5 },
  { quote: 'They responded very quickly and showed up the next day to give a quote. Always responded and showed up on time. The job was done on time and I love the fine look and clear way of working. I highly recommend this business!', author: 'Pazit B.', location: 'Irvine, CA', stars: 5 },
  { quote: 'Raja was attentive, responsive and communicative with the entire process. He gave us good ideas throughout and supported us in selecting the various fixtures and tiles. We\'ve been thrilled with how the kitchen has turned out!', author: 'Peeb P.', location: 'Irvine, CA', stars: 5 },
  { quote: 'William and Raja are hands down the best around! They are with you from start to finish and are incredibly helpful, communicative and understanding. We have used them for multiple projects at home and at our two businesses.', author: 'Kristle J.', location: 'San Clemente, CA', stars: 5 },
  { quote: 'Did a bathroom remodel. Full service company. Accommodates changes along the way, and fixing anything we point out or that we wanted changed. Fast and things get done, thanks Raja!', author: 'Tony H.', location: 'Irvine, CA', stars: 5 },
  { quote: 'They did an excellent job and actually at a good price. We did a retile plus new fixtures and it came out looking like a high end resort bathroom.', author: 'Amy D.', location: 'San Clemente, CA', stars: 5 },
  { quote: 'They were exceptional. The expertise, responsiveness, professionalism, cleanliness, creative and ingenuity is top of the line. Their work is so good and most important, honest.', author: 'Boris B.', location: 'Newport Beach, CA', stars: 5 },
  { quote: 'Such a professional and creative team! They walked into my house with confidence that they would remodel my horrific 1960s fireplace to a clean cut, modern, cozy and budget friendly replacement. And so they did!', author: 'Teri N.', location: 'Irvine, CA', stars: 5 },
  { quote: 'William and his team did a spectacular job on our new front porch! I rehired him due to his responsiveness, honesty and speedy, quality work! His team got our porch done in literally a day and a half.', author: 'Courtney C.', location: 'Mission Viejo, CA', stars: 5 },
  { quote: 'Raja and Amir are easily the most friendly and up front contractors we\'ve worked with. Highly recommend them for being super easy to work with and good quality.', author: 'Allen D.', location: 'San Clemente, CA', stars: 5 },
  { quote: 'This company is VERY communicative, professional and cost friendly. They got the job done in a timely manner. Every pre-existing issue I had they went over and beyond to fix. 100/100 across the board.', author: 'Jeremy C.', location: 'Long Beach, CA', stars: 5 },
  { quote: 'Raja and his team came in with a reasonable price and worked after hours to get the job done! His team was respectful, clean, and worked after hours. I cannot recommend them enough.', author: 'Behrooz S.', location: 'Huntington Beach, CA', stars: 5 },
  { quote: 'We had them complete our media wall and absolutely loved working with their team! They were so professional from the beginning and set very realistic expectations. Our final product was better than I had imagined.', author: 'Srishti P.', location: 'Burbank, CA', stars: 5 },
  { quote: 'I am very happy with my decision and the final outcome is fabulous! All the workers were on time, professional and respectful. The work is top notch!', author: 'Theresa F.', location: 'Laguna Niguel, CA', stars: 5 },
  { quote: 'Raja gave me the kitchen of my dreams. I couldn\'t have made a better decision. He was honest and very easy to work with. They were always on time and completed the work in record time.', author: 'Sonia H.', location: 'Irvine, CA', stars: 5 },
  { quote: 'William was wonderful in relieving my fears and reassuring me they could take care of everything! He was professional as was his crew. I would certainly recommend them!', author: 'Marcia R.', location: 'San Clemente, CA', stars: 5 },
  { quote: 'Excellent work, reliable \u2014 highly recommend them. They are very tidy and the results speak for themselves.', author: 'Ellen C.', location: 'San Francisco, CA', stars: 5 },
];

// 10 featured reviews shown in the scroll section (must match avorino-reviews.js FEATURED selection)
const FEATURED = [REVIEWS[0], REVIEWS[1], REVIEWS[3], REVIEWS[5], REVIEWS[8], REVIEWS[4], REVIEWS[15], REVIEWS[19], REVIEWS[12], REVIEWS[23]];

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
document.getElementById('page-name')!.textContent = PAGE_NAME;
const headCodeEl = document.getElementById('head-code');
const footerCodeEl = document.getElementById('footer-code');
if (headCodeEl) headCodeEl.textContent = HEAD_CODE;
if (footerCodeEl) footerCodeEl.textContent = FOOTER_CODE;

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

  logDetail(`Progress bar built (track, fill, ${FEATURED.length} dots)`, 'ok');

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
  const btn = document.getElementById('inject-btn') as HTMLButtonElement;
  btn.disabled = true;
  try { await createAllVariables(); } catch (err: any) { log(`Error: ${err.message || err}`, 'error'); } finally { btn.disabled = false; }
});

document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const type = (btn as HTMLElement).dataset.copy;
    let text = type === 'head' ? HEAD_CODE : type === 'footer' ? FOOTER_CODE : '';
    navigator.clipboard.writeText(text).then(() => {
      (btn as HTMLElement).textContent = 'Copied!';
      setTimeout(() => { (btn as HTMLElement).textContent = 'Copy'; }, 2000);
    });
  });
});

document.getElementById('build-page')?.addEventListener('click', async () => {
  const btn = document.getElementById('build-page') as HTMLButtonElement;
  btn.disabled = true;
  try { await buildReviewsPage(); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
