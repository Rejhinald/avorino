// ════════════════════════════════════════════════════════════════
// Avorino Builder — GARDEN GROVE ADU PAGE
// Rename this to index.ts to build the Garden Grove ADU page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog,
  createAllVariables, buildCityPage, CityData,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

const HEAD_CODE = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@8ae532e/avorino-responsive.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@8ae532e/avorino-nav-footer.css">',
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@8ae532e/avorino-animations.js"><\/script>',
  CALENDLY_JS,
].join('\n');

const CITY_DATA: CityData = {
  slug: 'garden-grove-adu',
  city: 'Garden Grove',
  title: 'ADU Construction in Garden Grove — Avorino',
  seoDesc: 'Build a permitted ADU in Garden Grove, CA. Most affordable OC entry point with the ADU Go pre-approved program. Licensed Orange County contractor.',

  overview: 'Garden Grove is one of the most affordable cities in Orange County for ADU investment, with a population of over 170,000 residents. The city launched its "ADU Go" pre-approved program, offering homeowners a streamlined path to ADU construction with pre-reviewed plans that significantly reduce permitting time. Garden Grove maintains low vacancy rates of approximately 5%, driven by strong blue-collar rental demand and diverse neighborhoods including Midway City and West Garden Grove. Its proximity to Disneyland employment and the broader Anaheim tourism economy provides a steady pipeline of renters seeking affordable housing options in a county where median rents continue to climb.',

  whyBuild: 'Most affordable ADU market entry in Orange County, pre-approved "ADU Go" program for faster permitting, low vacancy rates (~5%), and strong blue-collar rental demand near major employment centers.',

  regulations: {
    setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. Conversions of existing structures are exempt from setback requirements.',
    height: '16 feet for single-story detached ADUs. Up to 17 feet may be permitted to accommodate roof pitch on certain lot configurations.',
    parking: 'One parking space per ADU required. Exemptions available for properties within 0.5 miles of public transit, garage conversions, and other state-mandated conditions.',
    lotSize: '5,000–7,000 sqft typical residential lots. Some R-1 zones have larger lots ranging from 11,000–15,000 sqft, providing ample space for detached ADUs.',
    ownerOccupancy: 'No owner-occupancy requirement (permanent per AB 976).',
    additionalNotes: 'Minimum 6-foot building separation required between the ADU and the primary dwelling. The "ADU Go" pre-approved program offers pre-reviewed plans that can reduce plan check time significantly. Impact fees waived for ADUs under 750 sqft.',
  },

  permitting: {
    department: 'Garden Grove Building and Safety Division',
    steps: [
      { title: 'Check ADU Go eligibility', desc: 'Contact the Building and Safety Division to determine if your property qualifies for the "ADU Go" pre-approved ADU program. Pre-approved plans can reduce your permitting timeline by several weeks.' },
      { title: 'Verify lot & zoning', desc: 'Confirm your lot size, zoning classification, and setback dimensions. Measure the 6-foot building separation from your primary dwelling. Check utility connections and easement locations.' },
      { title: 'Design or select plans', desc: 'Choose from ADU Go pre-approved plans or create custom architectural plans. Custom plans must include site plan, floor plan, elevations, structural, MEP, and Title 24 energy calculations.' },
      { title: 'Submit to Building and Safety', desc: 'Submit your plans to the Building and Safety Division. Pre-approved ADU Go plans receive expedited review. Custom plans follow the standard 60-day state-mandated review timeline.' },
      { title: 'Obtain permit & build', desc: 'Once approved, pull your building permit and begin construction. Schedule required inspections at each milestone — foundation, framing, rough MEP, insulation, and final.' },
      { title: 'Final inspection & occupancy', desc: 'Request final inspection from the Building and Safety Division. Once passed, you receive your Certificate of Occupancy and your ADU is legal to occupy or rent.' },
    ],
    fees: '$5,000–$10,000 total (plan check, building permit, school fees). Impact fees waived for ADUs under 750 sqft. ADU Go plans may have reduced plan check fees.',
    timeline: '4–8 weeks for standard plan check. ADU Go pre-approved plans may be processed faster. 60-day maximum review required by state law.',
    contact: '(714) 741-5307 — Garden Grove Building and Safety Division — building@ggcity.org',
    website: 'ggcity.org/building-and-safety',
  },

  costs: {
    constructionRange: '$225K–$375K',
    permitFees: '$5K–$10K',
    impactFees: 'Waived under 750 sqft',
    typicalSize: '400–1,200 sqft',
  },

  rental: {
    monthlyRange: '$2,000–$3,500/mo',
    demandDrivers: 'Disneyland Resort and hospitality sector workers, diverse blue-collar workforce, proximity to the 22 and 5 freeways, affordable alternative to neighboring Anaheim and Westminster, low vacancy rates (~5%), and growing demand from families seeking affordable OC housing.',
  },

  guide: [
    { title: 'Check the ADU Go program', desc: 'Before starting any custom design work, contact Garden Grove Building and Safety at (714) 741-5307 to learn about the "ADU Go" pre-approved ADU program. Pre-approved plans can save weeks of permitting time and reduce design costs.' },
    { title: 'Verify your lot dimensions', desc: 'Use the city\'s GIS map or a property survey to confirm lot size, zoning, and available space. Measure the distance from your primary dwelling — you need at least 6 feet of separation for a detached ADU. Most R-1 lots in Garden Grove have enough space.' },
    { title: 'Choose your ADU type', desc: 'Garden Grove\'s affordable lot prices make detached backyard ADUs the best value. Garage conversions are the fastest and cheapest option. On larger R-1 lots (11K–15K sqft), you may have room for a full 1,200 sqft detached unit.' },
    { title: 'Hire a licensed team', desc: 'Work with a California-licensed contractor (General-B) and architect. Avorino handles design, engineering, permitting, and construction as a single point of contact — simplifying the process for Garden Grove homeowners.' },
    { title: 'Submit & permit', desc: 'Submit plans to the Building and Safety Division. If using ADU Go pre-approved plans, the review is expedited. Custom plans follow the standard 60-day state-mandated timeline. Pay permit and school fees at issuance.' },
    { title: 'Build & rent', desc: 'Construction typically takes 6–8 months. Schedule city inspections at each milestone. After final inspection and Certificate of Occupancy, your ADU is ready to rent. Garden Grove\'s low vacancy rates mean strong tenant demand from day one.' },
  ],
};

// ── Panel UI ──
document.getElementById('page-name')!.textContent = `${CITY_DATA.city} ADU`;
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
  logDetail('Starting Garden Grove ADU page build...', 'info');
  try { await buildCityPage(CITY_DATA); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
