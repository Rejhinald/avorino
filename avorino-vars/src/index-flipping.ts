// ════════════════════════════════════════════════════════════════
// Avorino Builder — FLIPPING OPPORTUNITY PAGE
// Rename this to index.ts to build the Flipping Opportunity page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog,
  createAllVariables, buildServicePage, ServiceData,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

const CDN = '59b1ad3';
const HEAD_CODE = [
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-responsive.css">`,
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-nav-footer.css">`,
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-flipping.css">`,
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>',
  `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-animations.js"><\/script>`,
  `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-flipping-footer.js"><\/script>`,
  CALENDLY_JS,
].join('\n');

const SERVICE_DATA: ServiceData = {
  slug: 'flippingopportunity',
  pageName: 'Flipping Opportunity',
  title: 'House Flipping with ADU Value-Add — Avorino Construction Orange County',
  seoDesc: 'Flip smarter with ADU construction. Add $150K–$350K in property value by building an ADU before resale. Orange County house flipping with Avorino — design, permits, and construction in 6–10 months.',

  heroLabel: '// Flipping Opportunity',
  heroTitle: 'Flip smarter. Build more equity.',
  heroSubtitle: 'The most profitable flip strategy in Orange County isn\'t cosmetic — it\'s adding square footage. Build a permitted ADU before resale and capture $150K–$350K in additional value that no amount of paint and staging can match.',

  approach: {
    heading: 'The value-add flip strategy',
    body: 'Traditional flips compete on cosmetics — kitchens, bathrooms, curb appeal. But in Orange County\'s $1M+ market, the highest-margin strategy is adding permitted living space. A 600–1,200 sqft ADU adds more appraised value than any interior remodel, and California\'s streamlined ADU laws make it faster than ever. We handle the entire build so you can focus on acquisition and disposition.',
    highlights: [
      'Add $150K–$350K in appraised value with a single permitted ADU — far exceeding cosmetic renovation ROI',
      'California\'s ADU fast-track permitting means 60-day approvals in most OC cities',
      'Standardized floor plans reduce design costs and accelerate construction timelines',
      'Dual-income potential: sell the property or hold it — the ADU generates income either way',
    ],
  },

  serviceTypes: [
    {
      number: '01',
      title: 'ADU Value-Add Flip',
      desc: 'Purchase a single-family home, build a detached ADU, and sell the package. The ADU adds appraised square footage and a second income stream that buyers pay a premium for.',
      features: ['Highest value-add per dollar spent', 'Detached 1-2BR ADU builds', 'Appraisal-maximized designs', 'Sell with rental income history'],
    },
    {
      number: '02',
      title: 'Garage Conversion Flip',
      desc: 'Convert an existing attached or detached garage into permitted living space. Lower construction cost, faster timeline, and immediate sqft increase on the appraisal.',
      features: ['$80K–$150K conversion cost', '3–5 month build timeline', 'No new foundation needed', 'Junior ADU or full conversion'],
    },
    {
      number: '03',
      title: 'Full Renovation + ADU',
      desc: 'Combine a whole-home renovation with ADU construction for a complete value transformation. New kitchen, baths, and finishes inside — plus a brand-new rental unit outside.',
      features: ['Maximum total property value', 'Single contractor, one timeline', 'Coordinated design language', 'Turnkey resale package'],
    },
    {
      number: '04',
      title: 'Multi-Unit Development',
      desc: 'For larger lots, build multiple ADUs or convert existing structures into multi-unit properties. SB 9 lot splits and AB 68 multi-ADU provisions create new possibilities.',
      features: ['Up to 4 units on qualifying lots', 'SB 9 lot split consultation', 'Multi-ADU permitting expertise', 'Portfolio-scale project management'],
    },
  ],

  process: [
    { number: '01', title: 'Acquisition Analysis', desc: 'Before you close, we evaluate the lot — setbacks, zoning, utility access, and ADU feasibility. You know the build potential before you commit capital.' },
    { number: '02', title: 'Value Engineering', desc: 'We model the construction cost, projected appraisal increase, and resale timeline. Real numbers for your pro forma — not back-of-napkin estimates.' },
    { number: '03', title: 'Fast-Track Permitting', desc: 'Pre-approved floor plans and experienced city relationships mean 60-day permits in most OC jurisdictions. Time is money on a flip.' },
    { number: '04', title: 'Parallel Construction', desc: 'ADU construction runs simultaneously with your interior renovation. We coordinate trades so both projects finish on the same timeline.' },
    { number: '05', title: 'Resale-Ready Handover', desc: 'Certificate of Occupancy, final inspection sign-off, and a move-in-ready ADU that appraisers and buyers can see. Maximum value at disposition.' },
  ],

  whyAvorino: {
    heading: 'Built for flippers who do the math',
    body: 'We work with investors who understand that construction speed and cost control determine flip margins. Our standardized ADU plans, pre-negotiated material pricing, and streamlined permitting process are designed to protect your timeline and your profit.',
    stats: [
      { value: '$150-350K', label: 'Value added' },
      { value: '6-10mo', label: 'Build timeline' },
      { value: '60day', label: 'Permit approvals' },
    ],
  },

  ctaHeading: 'Ready to flip with a value-add strategy?',
};

// ── Panel UI ──
document.getElementById('page-name')!.textContent = `${SERVICE_DATA.pageName}`;
const headCodeEl = document.getElementById('head-code');
const footerCodeEl = document.getElementById('footer-code');
if (headCodeEl) headCodeEl.textContent = HEAD_CODE;
if (footerCodeEl) footerCodeEl.textContent = FOOTER_CODE;

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
  clearErrorLog();
  logDetail('Starting Flipping Opportunity page build...', 'info');
  try { await buildServicePage(SERVICE_DATA); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
