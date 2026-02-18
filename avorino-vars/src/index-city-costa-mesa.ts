// ════════════════════════════════════════════════════════════════
// Avorino Builder — COSTA MESA ADU PAGE
// Rename this to index.ts to build the Costa Mesa ADU page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog,
  createAllVariables, buildCityPage, CityData,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

const HEAD_CODE = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@dc7bed3/avorino-responsive.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@dc7bed3/avorino-nav-footer.css">',
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@dc7bed3/avorino-animations.js"><\/script>',
  CALENDLY_JS,
].join('\n');

const CITY_DATA: CityData = {
  slug: 'costa-mesa-adu',
  city: 'Costa Mesa',
  title: 'ADU Construction in Costa Mesa — Avorino',
  seoDesc: 'Build a permitted ADU in Costa Mesa, CA. Central OC location, strong rental demand, and two-story options. Licensed contractor.',

  overview: 'Costa Mesa sits at the geographic center of Orange County, bordered by Newport Beach, Huntington Beach, and Irvine. With a population of about 115,000, the city is home to South Coast Plaza — one of the largest shopping centers in the United States — and the Segerstrom Center for the Arts. Costa Mesa\'s central location and diverse neighborhoods ranging from the Eastside to Mesa Verde make it a strong rental market. The city allows a minimum ADU size of just 150 sqft (one of the smallest in the county), giving homeowners flexibility for compact studio units. Costa Mesa also permits two-story detached ADUs up to 18 feet, with additional height for roof pitch.',

  whyBuild: 'Central Orange County location, proximity to South Coast Plaza and Newport Beach, and flexible ADU rules including two-story options.',

  regulations: {
    setbacks: '4-foot minimum from rear and interior side property lines for new detached ADUs. Second-floor/two-story ADUs may have additional setback requirements under Costa Mesa\'s objective design standards.',
    height: '18 feet for detached ADUs, plus an additional 2 feet to accommodate roof pitch. Two-story ADUs are permitted in most residential zones.',
    parking: 'Optional — Costa Mesa does not require additional parking for ADUs in most cases, following state exemptions. Properties near OCTA transit routes are explicitly exempt.',
    lotSize: '5,000–7,000 sqft typical residential lots. No minimum lot size required to build an ADU.',
    ownerOccupancy: 'No owner-occupancy requirement (permanent per AB 976).',
    additionalNotes: 'Detached ADUs capped at 1,200 sqft. Attached ADUs: up to 50% of existing home sqft or 1,000 sqft, whichever is greater. Minimum allowable ADU size is 150 sqft — among the smallest in Orange County.',
  },

  permitting: {
    department: 'Costa Mesa Economic & Development Services — Planning Division',
    steps: [
      { title: 'Review your property', desc: 'Check your zoning and lot dimensions on Costa Mesa\'s GIS system. Most R1 and R2 residential zones allow ADUs by right. Confirm utility connections and easements with the Engineering Division.' },
      { title: 'Design your ADU', desc: 'Create architectural plans meeting Costa Mesa\'s objective design standards. Two-story designs must comply with upper-floor setback requirements. Include structural engineering, Title 24, and MEP plans.' },
      { title: 'Submit application', desc: 'Submit plans to Economic & Development Services. Costa Mesa processes ADU applications ministerially (no public hearing required). The city is required to review compliant applications within 60 days.' },
      { title: 'Plan check corrections', desc: 'Address any corrections from the plan check review. Costa Mesa\'s planning staff can clarify design standard requirements. Resubmit corrected plans for final approval.' },
      { title: 'Obtain permit & build', desc: 'Pay fees and pull your building permit. Begin construction with a licensed contractor. Schedule inspections at each construction milestone.' },
      { title: 'Final approval', desc: 'Pass final inspection and receive Certificate of Occupancy. Your ADU is immediately available for occupancy or rental.' },
    ],
    fees: '$5,000–$12,000 total (plan check, building permit, school fees). Impact fees waived for ADUs under 750 sqft.',
    timeline: '4–8 weeks for plan check. State-mandated 60-day maximum for compliant applications.',
    contact: '(714) 754-5245 — Costa Mesa Planning Division',
    website: 'costamesaca.gov/adu',
  },

  costs: {
    constructionRange: '$250K–$400K',
    permitFees: '$5K–$12K',
    impactFees: 'Waived under 750 sqft',
    typicalSize: '600–1,200 sqft',
  },

  rental: {
    monthlyRange: '$2,500–$4,200/mo',
    demandDrivers: 'South Coast Plaza retail employment, proximity to Newport Beach and the coast, Orange County Fairgrounds events, Vanguard University students, and easy access to the 55, 73, and 405 freeways make Costa Mesa a high-demand rental market year-round.',
  },

  guide: [
    { title: 'Check zoning & lot', desc: 'Use Costa Mesa\'s online GIS map to verify your property\'s zoning classification and lot dimensions. R1 and R2 zones allow ADUs by right. Measure available backyard space accounting for 4-foot setbacks.' },
    { title: 'Consider two-story', desc: 'Costa Mesa permits two-story ADUs up to 18 feet. On smaller lots (5,000 sqft), a two-story design maximizes living space while keeping the footprint small. Factor in the second-floor setback requirements during design.' },
    { title: 'Design with flexibility', desc: 'Costa Mesa allows ADUs as small as 150 sqft. A compact studio unit is the fastest and most affordable build. Larger 1-bed units (600–800 sqft) command the best rental returns in this market.' },
    { title: 'Submit to Planning', desc: 'File your plans with Economic & Development Services. ADU applications are ministerial — no public hearing or discretionary review. The city processes compliant applications within 60 days.' },
    { title: 'Build & inspect', desc: 'Work with a licensed contractor. Costa Mesa inspectors review foundation, framing, rough MEP, insulation, and final construction. Schedule inspections promptly to avoid delays.' },
    { title: 'Rent or occupy', desc: 'After final inspection, you receive a Certificate of Occupancy. Costa Mesa\'s central location and strong job market mean your ADU can be rented quickly — studio units from $2,500/mo, 1-beds from $3,200/mo.' },
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
  logDetail('Starting Costa Mesa ADU page build...', 'info');
  try { await buildCityPage(CITY_DATA); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
