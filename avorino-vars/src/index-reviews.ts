// ════════════════════════════════════════════════════════════════
// Avorino Builder — CLIENT REVIEWS PAGE (v3 — wall redesign)
// 5-column rotated marquee wall of review cards
// Wall DOM built dynamically by avorino-reviews.js
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog, wait,
  safeCall, getAvorinVars, getOrCreateStyle,
  clearAndSet, createSharedStyles, setSharedStyleProps,
  createAllVariables, createPageWithSlug,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

// ── Page config ──
const PAGE_NAME = 'Client Reviews';
const PAGE_SLUG = 'clientreviews';
const PAGE_TITLE = 'Client Reviews — Avorino Construction';
const PAGE_DESC = '4.9 average rating from 35+ reviews. See what Orange County homeowners say about working with Avorino.';
const HEAD_CODE = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@2627e8f/avorino-responsive.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@2627e8f/avorino-nav-footer.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@2627e8f/avorino-reviews.css">',
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@2627e8f/avorino-reviews.js"><\/script>',
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
  logDetail('Starting Reviews page build (v3 — wall)...', 'info');
  const v = await getAvorinVars();

  log('Creating shared styles...');
  const s = await createSharedStyles();

  // ── Minimal page-specific style: dark body background ──
  log('Creating reviews-specific styles...');
  const rvBody = await getOrCreateStyle('rv-body');

  const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);

  async function applyStyleProperties() {
    log('Setting shared style properties...');
    await setSharedStyleProps(s, v);
    await wait(500);

    log('Setting reviews-specific style properties...');
    // Dark background for the page body — wall JS creates the wall section
    await clearAndSet(rvBody, 'rv-body', {
      'background-color': v['av-dark'],
      'overflow-x': 'hidden',
    });
    await wait(300);
  }

  // ═══════════════ BUILD ELEMENTS ═══════════════

  // The review wall is built dynamically by avorino-reviews.js
  // The builder only creates the page container with correct head/footer code

  // Body wrapper — sets dark bg, houses the JS-generated wall
  log('Building page body...');
  const bodyWrap = webflow.elementBuilder(webflow.elementPresets.DOM);
  bodyWrap.setTag('div');
  bodyWrap.setStyles([rvBody]);
  bodyWrap.setAttribute('id', 'rv-page');

  // Placeholder text (hidden, for Webflow SEO / accessibility)
  const srOnly = bodyWrap.append(webflow.elementPresets.DOM);
  srOnly.setTag('div');
  srOnly.setTextContent('Client reviews for Avorino Custom Home & ADU — 4.9 stars from 35+ reviews across Orange County');
  srOnly.setAttribute('style', 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)');

  await safeCall('append:body', () => body.append(bodyWrap));
  logDetail('Page body appended (wall built by JS at runtime)', 'ok');

  await applyStyleProperties();

  log('Reviews page built!', 'success');
  await webflow.notify({ type: 'Success', message: 'Reviews wall page created! Preview to see the animated wall.' });
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
