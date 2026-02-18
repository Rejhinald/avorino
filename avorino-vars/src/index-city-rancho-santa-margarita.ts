// ════════════════════════════════════════════════════════════════
// Avorino Builder — RANCHO SANTA MARGARITA ADU PAGE
// Rename this to index.ts to build the Rancho Santa Margarita ADU page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog,
  createAllVariables, buildCityPage, CityData,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

const HEAD_CODE = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@9d6ec3d/avorino-responsive.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@9d6ec3d/avorino-nav-footer.css">',
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@9d6ec3d/avorino-animations.js"><\/script>',
  CALENDLY_JS,
].join('\n');

const CITY_DATA: CityData = {
  slug: 'adu-rancho-santa-margarita',
  city: 'Rancho Santa Margarita',
  title: 'ADU Construction in Rancho Santa Margarita — Avorino',
  seoDesc: 'Build a permitted ADU in Rancho Santa Margarita, CA. Detached and attached ADUs on spacious master-planned lots. Licensed Orange County contractor near O\'Neill Regional Park.',

  overview: 'Rancho Santa Margarita is a master-planned community of approximately 50,000 residents nestled in the foothills of the Santa Ana Mountains in southeast Orange County. The city features a distinctly suburban character with well-maintained neighborhoods, tree-lined streets, and generous lot sizes ranging from 5,000 to 8,000 sqft — with hillside properties often exceeding 10,000 sqft. Bordered by O\'Neill Regional Park and Tijeras Creek Trail, the community offers immediate access to hiking, mountain biking, and outdoor recreation that few OC cities can match. The family-oriented atmosphere, top-rated Capistrano Unified and Saddleback Valley Unified school districts, and proximity to major employers along the I-5 corridor make Rancho Santa Margarita a consistently desirable residential market.',

  whyBuild: 'Spacious suburban lots in a master-planned setting ideal for detached ADUs, strong family rental demand driven by top-rated schools and outdoor recreation access, proximity to Irvine and Lake Forest employment corridors, and a homeowner demographic with the equity to invest in ADU construction.',

  regulations: {
    setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. Conversions of existing structures (garages, workshops) are exempt from setback requirements.',
    height: 'Up to 16 feet for single-story detached ADUs. Up to 25 feet for two-story ADUs per state law (AB 1332) in qualifying residential zones.',
    parking: 'One parking space per ADU may be required. Exempt if within 0.5 miles of public transit, within one block of a car-share vehicle, or if the ADU is a conversion of existing space.',
    lotSize: '5,000–8,000 sqft typical residential lots, with hillside parcels often 10,000+ sqft. No minimum lot size required by state law to build an ADU.',
    ownerOccupancy: 'No owner-occupancy requirement for ADUs (made permanent by AB 976 in 2025).',
    additionalNotes: 'HOAs are prevalent throughout Rancho Santa Margarita. While HOAs cannot prohibit ADUs under state law (AB 1033), they may impose reasonable architectural standards regarding exterior materials, colors, and landscaping. Review your CC&Rs and submit architectural review applications early. ADUs under 750 sqft are exempt from impact fees.',
  },

  permitting: {
    department: 'City of Rancho Santa Margarita Development Services Department',
    steps: [
      { title: 'Review HOA requirements', desc: 'Before designing your ADU, contact your homeowners association to understand architectural review requirements. While HOAs cannot block ADUs under state law, they may have standards for exterior finishes, roofing materials, and landscaping that influence your design.' },
      { title: 'Verify lot & zoning', desc: 'Confirm your property\'s zoning designation, lot dimensions, and available buildable area on the city\'s GIS map. Measure setbacks from property lines and note any easements, slopes, or drainage features that may affect ADU placement.' },
      { title: 'Design your ADU', desc: 'Create architectural plans including site plan, floor plan, elevations, structural, mechanical, electrical, and plumbing. Hillside lots may require additional grading and soils reports. Design to complement the existing neighborhood aesthetic.' },
      { title: 'Submit to Development Services', desc: 'Submit your complete plan set to the Development Services Department. Include Title 24 energy compliance documentation, soils report (if required for hillside lots), and HOA architectural approval letter if applicable.' },
      { title: 'Plan check & approval', desc: 'The city reviews plans for compliance with building codes and ADU regulations. State law mandates a 60-day maximum review period for compliant ADU applications.' },
      { title: 'Build, inspect & occupy', desc: 'Once permitted, begin construction with your licensed contractor. Schedule required inspections at each milestone — foundation, framing, rough MEP, insulation, and final. Certificate of Occupancy issued upon passing final inspection.' },
    ],
    fees: '$5,000–$12,000 total (plan check, building permit, school fees). Impact fees waived for ADUs under 750 sqft.',
    timeline: '4–8 weeks for plan check. 60-day maximum review required by state law.',
    contact: '(949) 635-1800 — City of Rancho Santa Margarita Development Services',
    website: 'cityofrsm.org/149/Development-Services',
  },

  costs: {
    constructionRange: '$250K–$400K',
    permitFees: '$5K–$12K',
    impactFees: 'Waived under 750 sqft',
    typicalSize: '600–1,000 sqft',
  },

  rental: {
    monthlyRange: '$2,300–$3,800/mo',
    demandDrivers: 'Families drawn to top-rated Capistrano Unified and Saddleback Valley Unified schools, outdoor recreation enthusiasts seeking proximity to O\'Neill Regional Park and Tijeras Creek Trail, professionals commuting to Irvine and Lake Forest employment centers along the I-5 corridor, and young couples priced out of newer south OC communities like Ladera Ranch and Rancho Mission Viejo.',
  },

  guide: [
    { title: 'Navigate your HOA first', desc: 'Most Rancho Santa Margarita neighborhoods have active HOAs with architectural review committees. Contact your HOA early to understand their design standards for exterior materials, colors, roof pitch, and landscaping. State law (AB 1033) prevents HOAs from blocking ADUs, but early coordination avoids costly redesigns.' },
    { title: 'Assess your lot for a detached ADU', desc: 'Rancho Santa Margarita\'s generous lot sizes (5,000–8,000 sqft, larger on hillsides) make detached backyard ADUs the strongest option. Walk your property to identify the best placement — consider privacy from neighbors, access for construction equipment, and proximity to existing utility connections.' },
    { title: 'Address hillside considerations', desc: 'If your property has slope or grade changes, budget for a geotechnical soils report and potential grading work. Hillside lots may require retaining walls or stepped foundations. These add cost but also create opportunities for walk-out or split-level ADU designs with dramatic views.' },
    { title: 'Design to match the neighborhood', desc: 'Rancho Santa Margarita has a cohesive master-planned aesthetic — Mediterranean, Spanish, and California ranch styles predominate. Design your ADU with complementary materials, roof tiles, and color palettes. This satisfies HOA standards and maximizes property value.' },
    { title: 'Build with a licensed contractor', desc: 'Work with a California-licensed contractor (General-B). Avorino handles design, engineering, HOA coordination, permitting, and construction as a single point of contact — critical in HOA-heavy communities where process coordination matters.' },
    { title: 'Rent to families and professionals', desc: 'With your Certificate of Occupancy in hand, market your ADU to families seeking top-rated schools and outdoor access, or professionals commuting to Irvine and Lake Forest. Rental rates of $2,300–$3,800/mo reflect Rancho Santa Margarita\'s desirable suburban character.' },
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
  logDetail('Starting Rancho Santa Margarita ADU page build...', 'info');
  try { await buildCityPage(CITY_DATA); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
