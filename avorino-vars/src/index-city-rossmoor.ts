// ════════════════════════════════════════════════════════════════
// Avorino Builder — ROSSMOOR ADU PAGE
// Rename this to index.ts to build the Rossmoor ADU page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog,
  createAllVariables, buildCityPage, CityData,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

const HEAD_CODE = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3cf6b06/avorino-responsive.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3cf6b06/avorino-nav-footer.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3cf6b06/avorino-adu.css">',
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3cf6b06/avorino-animations.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3cf6b06/avorino-city-adu-footer.js"><\/script>',
  CALENDLY_JS,
].join('\n');

const CITY_DATA: CityData = {
  slug: 'rossmoor-adu',
  city: 'Rossmoor',
  title: 'ADU Construction in Rossmoor — Avorino',
  seoDesc: 'Build a permitted ADU in Rossmoor, CA. Unincorporated OC community with larger lots — permits through County of Orange. Licensed Orange County contractor near Seal Beach and Los Alamitos.',

  overview: 'Rossmoor is an unincorporated community in northwest Orange County, situated between Seal Beach, Los Alamitos, and the San Gabriel River. With a quiet suburban character and approximately 11,000 residents, Rossmoor is known for its larger-than-average residential lots — typically 6,000 to 9,000 sqft — mature shade trees, and well-established neighborhoods developed primarily in the 1950s and 1960s. Because Rossmoor is unincorporated, all land use and building permits are handled by the County of Orange, not a city government. The community\'s location provides excellent freeway access via the 405 and 605 freeways, placing residents within a short commute of Long Beach, Cypress, and the greater Los Angeles job market. Rossmoor\'s proximity to Seal Beach and the coast adds lifestyle appeal, while the Los Alamitos Unified School District serves the community with well-regarded schools.',

  whyBuild: 'Larger residential lots ideal for detached ADUs in an unincorporated community with no city-level restrictions beyond County standards, excellent freeway access to both OC and LA County employment, proximity to coastal Seal Beach, and strong rental demand in a neighborhood with limited existing rental inventory.',

  regulations: {
    setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. Conversions of existing structures are exempt from setback requirements.',
    height: 'Up to 16 feet for single-story detached ADUs. Up to 25 feet for two-story ADUs per state law (AB 1332) in qualifying residential zones.',
    parking: 'One parking space per ADU may be required. Exempt if within 0.5 miles of public transit, within one block of a car-share vehicle, or if the ADU is a conversion of existing space.',
    lotSize: '6,000–9,000 sqft typical residential lots — among the most generous in northwest Orange County. Some corner lots and cul-de-sac properties exceed 10,000 sqft. No minimum lot size required by state law to build an ADU.',
    ownerOccupancy: 'No owner-occupancy requirement for ADUs (made permanent by AB 976 in 2025).',
    additionalNotes: 'Rossmoor is UNINCORPORATED — all permits go through the County of Orange, not a city. Some Rossmoor neighborhoods have voluntary community associations (not HOAs with enforcement power) that may encourage design compatibility. Properties near the San Gabriel River may have flood zone considerations. ADUs under 750 sqft are exempt from impact fees.',
  },

  permitting: {
    department: 'County of Orange Planning and Development Services (OC Development Services)',
    steps: [
      { title: 'Confirm County jurisdiction', desc: 'Rossmoor is unincorporated Orange County. All building permits, plan checks, and inspections are handled by the County of Orange — not a city. Contact OC Development Services to confirm your parcel falls within unincorporated territory and verify any flood zone designations.' },
      { title: 'Survey your lot', desc: 'Rossmoor\'s larger lots (6,000–9,000 sqft) provide excellent ADU potential. Commission a property survey or use County GIS tools to confirm lot dimensions, property lines, easements, and utility locations. Check for flood zone designations, particularly for properties near the San Gabriel River.' },
      { title: 'Design your ADU', desc: 'Create architectural plans including site plan, floor plan, elevations, structural, mechanical, electrical, and plumbing. Rossmoor\'s 1950s–1960s ranch-style homes establish the neighborhood character. Include Title 24 energy compliance and any flood zone mitigation measures if applicable.' },
      { title: 'Submit to OC Development Services', desc: 'Submit your complete plan set to the County of Orange Development Services. Include Title 24 documentation, property survey, and flood zone documentation if your parcel is within a FEMA-designated flood zone.' },
      { title: 'County plan check review', desc: 'The County reviews plans for compliance with California Building Code and ADU regulations. State law mandates a 60-day maximum review period for compliant ADU applications.' },
      { title: 'Permit, build & finalize', desc: 'Pull your building permit from the County, begin construction, and schedule County inspections at each milestone — foundation, framing, rough MEP, insulation, and final. Certificate of Occupancy issued by the County upon passing final inspection.' },
    ],
    fees: '$5,000–$12,000 total (County plan check, building permit, school fees). Impact fees waived for ADUs under 750 sqft.',
    timeline: '4–8 weeks for County plan check. 60-day maximum review required by state law.',
    contact: '(714) 667-8888 — County of Orange OC Development Services',
    website: 'ocds.ocpublicworks.com',
  },

  costs: {
    constructionRange: '$250K–$400K',
    permitFees: '$5K–$12K',
    impactFees: 'Waived under 750 sqft',
    typicalSize: '600–1,200 sqft',
  },

  rental: {
    monthlyRange: '$2,200–$3,600/mo',
    demandDrivers: 'Professionals commuting to Long Beach, Cypress, and LA County via the 405 and 605 freeways, families seeking Los Alamitos Unified schools, coastal lifestyle seekers who want proximity to Seal Beach without Seal Beach prices, and the inherent scarcity of rental units in a community that is almost entirely owner-occupied single-family homes.',
  },

  guide: [
    { title: 'Understand County-only permitting', desc: 'Rossmoor is unincorporated — there is no city hall or city building department. All permits, inspections, and approvals go through the County of Orange Development Services at (714) 667-8888. This is the same process used by Ladera Ranch and other unincorporated OC communities.' },
    { title: 'Leverage your generous lot size', desc: 'Rossmoor lots (6,000–9,000 sqft) are among the largest in northwest Orange County, making detached backyard ADUs the strongest option. Many properties have oversized backyards from the original 1950s–1960s development. Walk your lot to identify optimal placement, considering privacy, sun exposure, and access for construction vehicles.' },
    { title: 'Check flood zone status', desc: 'Properties near the San Gabriel River or in low-lying areas of Rossmoor may fall within FEMA-designated flood zones. Check your parcel\'s flood zone status on the County\'s GIS map. Flood zone properties may require elevated foundations or flood-resistant construction methods that add cost but are manageable with proper planning.' },
    { title: 'Design for the ranch-style neighborhood', desc: 'Rossmoor\'s character is defined by 1950s–1960s ranch-style homes with low rooflines, horizontal lines, and mature landscaping. Design your ADU to complement this aesthetic — single-story ranch profiles, horizontal siding, and earth-tone palettes blend naturally and maintain neighborhood cohesion.' },
    { title: 'Build with a licensed contractor', desc: 'Work with a California-licensed contractor (General-B). Avorino handles design, engineering, County permitting, and construction as a single point of contact — simplifying the County process for Rossmoor homeowners who may be unfamiliar with unincorporated permitting procedures.' },
    { title: 'Fill the rental gap', desc: 'Rossmoor is almost entirely owner-occupied single-family homes, creating a significant undersupply of rental units. Your ADU directly addresses this gap. At $2,200–$3,600/mo, market to professionals commuting on the 405/605, families seeking Los Alamitos Unified schools, and renters who want a quiet residential setting near the coast.' },
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
  logDetail('Starting Rossmoor ADU page build...', 'info');
  try { await buildCityPage(CITY_DATA); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
