// ════════════════════════════════════════════════════════════════
// Avorino Builder — LAGUNA BEACH ADU PAGE
// Rename this to index.ts to build the Laguna Beach ADU page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog,
  createAllVariables, buildCityPage, CityData,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

const HEAD_CODE = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@29e8db3/avorino-responsive.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@29e8db3/avorino-nav-footer.css">',
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@29e8db3/avorino-animations.js"><\/script>',
  CALENDLY_JS,
].join('\n');

const CITY_DATA: CityData = {
  slug: 'adu-laguna-beach',
  city: 'Laguna Beach',
  title: 'ADU Construction in Laguna Beach — Avorino',
  seoDesc: 'Build a permitted ADU in Laguna Beach, CA. Coastal Zone and CDP expertise, design review navigation, highest rental rates in OC. Licensed contractor.',

  overview: 'Laguna Beach is a prestigious artist colony and coastal city that commands the highest ADU rental rates in Orange County — averaging $4,417 per month. The most critical factor for ADU construction here is that the majority of the city falls within the California Coastal Zone, requiring a Coastal Development Permit (CDP) in addition to standard building permits. The city adopted a March 2025 urgency ordinance to bring its ADU regulations into compliance with state law. Design review is mandatory for all new construction to ensure aesthetic conformity with the community\'s artistic character. Hillside properties face additional grading restrictions and geotechnical requirements. Despite these complexities, Laguna Beach\'s premium rental market makes ADU investment here exceptionally rewarding for those willing to navigate the process.',

  whyBuild: 'Highest rental rates in Orange County ($4,417/mo average ADU rent). Premium coastal market where strong rental income justifies higher construction costs and longer permitting timelines.',

  regulations: {
    setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. Oceanfront properties require 25-foot setback from bluff top. Properties near watercourses require 25-foot setback from centerline.',
    height: '16 feet for single-story detached ADUs. Up to 18 feet may be permitted for properties near public transit stops.',
    parking: 'Standard parking requirements with state exemptions. Properties within 0.5 miles of transit, garage conversions, and other state-mandated conditions are exempt from additional parking.',
    lotSize: 'R-1 zoning requires minimum 6,000 sqft lot with 80-foot minimum depth. Other residential zones vary.',
    ownerOccupancy: 'No owner-occupancy requirement (permanent per AB 976).',
    additionalNotes: 'MOST of the city is within the Coastal Zone — a Coastal Development Permit (CDP) is required for nearly all ADU projects. Design review is mandatory for aesthetic conformity. ADU size is limited to 850 sqft for studio/one-bedroom units or 1,000 sqft for two-or-more-bedroom units. Impact fees are capped at 50% of the fees charged for the primary dwelling.',
  },

  permitting: {
    department: 'Laguna Beach Community Development Department — 505 Forest Avenue',
    steps: [
      { title: 'Determine Coastal Zone status', desc: 'Nearly all properties in Laguna Beach are within the Coastal Zone. Contact Community Development at (949) 497-0712 to confirm. Coastal Zone properties require a Coastal Development Permit (CDP), which adds 4–8+ weeks to your timeline.' },
      { title: 'Submit for design review', desc: 'All new ADU construction in Laguna Beach requires design review to ensure aesthetic conformity with the community\'s artistic and architectural character. Prepare detailed elevations, material samples, and color selections.' },
      { title: 'Prepare CDP application', desc: 'For Coastal Zone properties, prepare and submit your CDP application. Include environmental documentation, view analysis if on a hillside, and any required geotechnical reports. This is a separate review from the building permit.' },
      { title: 'Submit building plans', desc: 'Submit complete architectural plans including site plan, floor plans, elevations, structural engineering, MEP, and Title 24 energy calculations. Plans must reflect design review conditions and CDP requirements.' },
      { title: 'Build with premium finishes', desc: 'Once approved, pull your building permit and begin construction. Laguna Beach expects high-quality construction — invest in premium materials and finishes that match the community\'s artistic character.' },
      { title: 'Final inspection & occupancy', desc: 'Pass final inspection and receive your Certificate of Occupancy. Your ADU enters Orange County\'s highest-rent market — average ADU rents of $4,417/mo make the investment worthwhile.' },
    ],
    fees: '$10,000–$20,000+ total (plan check, building permit, CDP fees, design review, school fees). Impact fees capped at 50% of primary dwelling fees. Impact fees waived for ADUs under 750 sqft.',
    timeline: '8–16 weeks total. Standard plan check 4–8 weeks. CDP adds 4–8+ additional weeks. Design review adds 2–4 weeks.',
    contact: '(949) 497-0712 — Laguna Beach Community Development — 505 Forest Avenue',
    website: 'lagunabeachcity.net/government/departments/community-development',
  },

  costs: {
    constructionRange: '$325K–$475K',
    permitFees: '$10K–$20K+',
    impactFees: 'Capped at 50% of primary dwelling; waived under 750 sqft',
    typicalSize: '600–1,000 sqft',
  },

  rental: {
    monthlyRange: '$3,500–$5,000+/mo',
    demandDrivers: 'Prestigious coastal location, thriving arts and tourism economy (Festival of Arts, Pageant of the Masters, Sawdust Art Festival), Montage and Resort at Pelican Hill employment, limited housing supply driving premium rents, and year-round tourist and seasonal demand.',
  },

  guide: [
    { title: 'Confirm Coastal Zone status', desc: 'This is the most critical first step. Nearly all of Laguna Beach falls within the Coastal Zone. Call Community Development at (949) 497-0712 to confirm your property\'s status. If you\'re in the Coastal Zone (very likely), you will need a Coastal Development Permit — plan your timeline and budget accordingly.' },
    { title: 'Understand design review', desc: 'Laguna Beach has mandatory design review for all new construction. Your ADU must complement the artistic and architectural character of the community. Start gathering inspiration and material samples early — design review comments can require costly revisions if not anticipated.' },
    { title: 'Size your ADU correctly', desc: 'Laguna Beach limits ADUs to 850 sqft for studio/one-bedroom units or 1,000 sqft for two-or-more-bedroom units. Design within these limits from the start. A well-designed 850 sqft one-bedroom with premium finishes commands top rents in this market.' },
    { title: 'Hire coastal-experienced team', desc: 'Laguna Beach ADU projects require expertise in coastal permitting, design review, and hillside construction. Avorino has experience navigating CDP applications and design review in coastal OC cities — critical for avoiding delays and redesigns.' },
    { title: 'Invest in premium finishes', desc: 'This is Orange County\'s highest-rent ADU market. Every dollar spent on quality finishes — designer fixtures, premium flooring, high-end appliances, custom cabinetry — translates directly to higher monthly rent and faster tenant placement.' },
    { title: 'Navigate CDP & build', desc: 'Submit your CDP application alongside building plans. Allow 4–8+ weeks for CDP review on top of standard plan check. Construction typically takes 6–9 months. After final inspection, your ADU enters a market averaging $4,417/mo — the highest in Orange County.' },
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
  logDetail('Starting Laguna Beach ADU page build...', 'info');
  try { await buildCityPage(CITY_DATA); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
