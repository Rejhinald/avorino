// ════════════════════════════════════════════════════════════════
// Avorino Builder — INVESTMENT OPPORTUNITY PAGE
// Rename this to index.ts to build the Investment Opportunity page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog,
  createAllVariables, buildServicePage, ServiceData,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

const CDN = '0561094';
const HEAD_CODE = [
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-responsive.css">`,
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-nav-footer.css">`,
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-investment.css">`,
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>',
  `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-animations.js"><\/script>`,
  `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-investment-footer.js"><\/script>`,
  CALENDLY_JS,
].join('\n');

const SERVICE_DATA: ServiceData = {
  slug: 'investment',
  pageName: 'Investment Opportunity',
  title: 'ADU Investment Opportunity in Orange County — Avorino Construction',
  seoDesc: 'ADU investment opportunities in Orange County. Generate $2K–$4.5K+ monthly rental income. 5–12% annual ROI with property value appreciation. Build an ADU on your lot with Avorino Construction.',

  heroLabel: '// Investment Opportunity',
  heroTitle: 'Your property is your portfolio',
  heroSubtitle: 'Adding an ADU to your Orange County property is one of the highest-ROI home improvements in California. Generate passive rental income while building long-term equity — without selling or moving.',

  approach: {
    heading: 'Real estate investing from your own backyard',
    body: 'You don\'t need to buy a second property to build rental income. California law now allows ADUs on most single-family lots — and Orange County\'s rental market is one of the strongest in the country. A well-designed ADU generates $2K–$4.5K/month in rental income, increases your property value by 20–35%, and often pays for itself within 5–7 years.',
    highlights: [
      'Monthly rental income of $2,000–$4,500+ in Orange County — often exceeding your construction loan payment',
      'Property value increase of 20–35% with a permitted, professionally-built ADU',
      'Tax advantages including depreciation, mortgage interest deductions, and operating expense write-offs',
      'No landlord experience needed — we connect you with property management partners',
    ],
  },

  serviceTypes: [
    {
      number: '01',
      title: 'Long-Term Rental ADU',
      desc: 'Build a 1-2 bedroom unit designed for 12-month tenants. Steady, predictable income with minimal turnover and management overhead.',
      features: ['$2K–$3.5K/month in OC', 'Lower management costs', 'Stable occupancy rates', 'Attractive to quality tenants'],
    },
    {
      number: '02',
      title: 'Premium Rental ADU',
      desc: 'Higher-end finishes targeting professional tenants willing to pay above-market rates. Studio to 2BR in desirable neighborhoods.',
      features: ['$3K–$4.5K/month premium', 'Luxury finishes and appliances', 'Smart home integration', 'Indoor-outdoor living design'],
    },
    {
      number: '03',
      title: 'Multi-Generational ADU',
      desc: 'Build for family now, rent later. A flexible unit that houses parents or adult children today and becomes an income property when needs change.',
      features: ['ADA-adaptable design', 'Private entrance and parking', 'Full kitchen and laundry', 'Future rental conversion ready'],
    },
    {
      number: '04',
      title: 'Portfolio Addition',
      desc: 'Already own investment properties? Add ADUs to maximize lot potential. We handle multiple projects simultaneously across your portfolio.',
      features: ['Multi-property project management', 'Volume pricing on materials', 'Standardized floor plans', 'Coordinated permitting'],
    },
  ],

  process: [
    { number: '01', title: 'Feasibility Analysis', desc: 'We evaluate your lot — zoning, setbacks, utility access, and rental market comps. You get a clear picture of what\'s buildable and what the income potential is.' },
    { number: '02', title: 'Financial Modeling', desc: 'Construction cost estimate, rental income projections, ROI timeline, and financing options. Real numbers, not marketing projections.' },
    { number: '03', title: 'Design & Permitting', desc: 'Architecture optimized for rental appeal and construction efficiency. Full permit submission and city approval management.' },
    { number: '04', title: 'Construction', desc: 'Foundation to finish in 6–10 months. Weekly progress updates, transparent budgets, and milestone-based draw schedules for your lender.' },
    { number: '05', title: 'Tenant-Ready Handover', desc: 'Final inspection, Certificate of Occupancy, and a move-in-ready unit. We can connect you with property management if needed.' },
  ],

  whyAvorino: {
    heading: 'The numbers speak for themselves',
    body: 'An ADU in Orange County isn\'t just an addition — it\'s a performing asset. With rental rates at historic highs and housing demand outpacing supply, a professionally-built ADU is one of the safest real estate investments you can make.',
    stats: [
      { value: '5–12%', label: 'Annual ROI' },
      { value: '+30%', label: 'Property value' },
      { value: '$2-4.5K', label: 'Monthly income' },
    ],
  },

  ctaHeading: 'Ready to build your investment?',
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
  logDetail('Starting Investment Opportunity page build...', 'info');
  try { await buildServicePage(SERVICE_DATA); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
