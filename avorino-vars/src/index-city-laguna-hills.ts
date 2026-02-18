// ════════════════════════════════════════════════════════════════
// Avorino Builder — LAGUNA HILLS ADU PAGE
// Rename this to index.ts to build the Laguna Hills ADU page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog,
  createAllVariables, buildCityPage, CityData,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

const HEAD_CODE = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@eab31dd/avorino-responsive.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@eab31dd/avorino-nav-footer.css">',
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@eab31dd/avorino-animations.js"><\/script>',
  CALENDLY_JS,
].join('\n');

const CITY_DATA: CityData = {
  slug: 'adu-laguna-hills',
  city: 'Laguna Hills',
  title: 'ADU Construction in Laguna Hills — Avorino',
  seoDesc: 'Build a permitted ADU in Laguna Hills, CA. South Orange County premium with moderate costs. Near Laguna Beach and Irvine. Licensed Orange County contractor.',

  overview: 'Laguna Hills is a compact south Orange County city of approximately 31,000 residents that delivers a south county premium location at a more moderate price point than neighboring coastal cities. Nestled between Laguna Beach to the west, Mission Viejo to the east, and Aliso Viejo to the south, the city occupies a strategic position that provides quick access to both the coast and inland employment centers. The Five Points Plaza shopping area at the intersection of El Toro Road and Moulton Parkway serves as the commercial heart of the community, while Saddleback Memorial Medical Center (now Providence) — one of south Orange County\'s major hospitals — is a significant local employer drawing healthcare workers from across the region. Laguna Hills\' residential neighborhoods are primarily composed of 1970s–80s single-family homes in communities like Laguna Hills Estates, Nellie Gail Ranch (partially in the city), and the villages surrounding Moulton Parkway. The I-5 and SR-73 toll road are both accessible within minutes, connecting residents to Irvine\'s Spectrum district, Laguna Beach, and the broader OC freeway network.',

  whyBuild: 'South Orange County premium location at lower construction costs than coastal neighbors like Laguna Beach and Dana Point, proximity to Providence Saddleback Memorial Medical Center creating steady healthcare worker housing demand, quick access to both Laguna Beach and Irvine employment, and a compact city layout that puts most neighborhoods within minutes of shopping, dining, and freeways.',

  regulations: {
    setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. Conversions of existing structures (garages, bonus rooms) are exempt from setback requirements.',
    height: 'Up to 16 feet for single-story detached ADUs. Up to 25 feet for two-story ADUs per state law (AB 1332) in qualifying residential zones.',
    parking: 'One parking space per ADU may be required. Exempt if within 0.5 miles of public transit (OCTA bus routes along El Toro Road and Moulton Parkway), within one block of a car-share vehicle, or if the ADU is a conversion of existing space.',
    lotSize: '5,000–8,000 sqft typical residential lots. Nellie Gail Ranch and hillside-adjacent properties may feature larger lots of 10,000–20,000+ sqft. No minimum lot size required by state law to build an ADU.',
    ownerOccupancy: 'No owner-occupancy requirement for ADUs (made permanent by AB 976 in 2025).',
    additionalNotes: 'ADUs under 750 sqft are exempt from impact fees. Some Laguna Hills neighborhoods have HOAs — while they may require architectural review, they cannot prohibit ADU construction under California law. Nellie Gail Ranch properties that fall within Laguna Hills city limits follow city permitting; verify your jurisdiction on the city GIS map.',
  },

  permitting: {
    department: 'City of Laguna Hills Community Development Department',
    steps: [
      { title: 'Verify zoning & property boundaries', desc: 'Confirm your property\'s zoning on the city\'s GIS map. Most R1 single-family residential zones allow ADUs by right. Laguna Hills shares borders with unincorporated county areas and neighboring cities — verify your parcel is within Laguna Hills city limits to ensure correct permitting jurisdiction.' },
      { title: 'Design your ADU', desc: 'Create architectural plans including site plan, floor plan, elevations, structural, mechanical, electrical, and plumbing. Consider the topography of your lot — many Laguna Hills neighborhoods have gentle slopes that may require minor grading. Design to complement the 1970s–80s architectural character common across the city.' },
      { title: 'Submit plans to Community Development', desc: 'Submit your complete plan set to the Community Development Department. Include Title 24 energy compliance documentation and any required soils or drainage reports for sloped lots. Laguna Hills processes ADU applications ministerially — no public hearing required.' },
      { title: 'Plan check review (60-day)', desc: 'The city reviews plans for compliance with building codes and ADU regulations. State law mandates a 60-day maximum review period for compliant ADU applications. Laguna Hills\' smaller city size often means responsive planning staff and efficient review cycles.' },
      { title: 'Build & inspect', desc: 'Once permitted, begin construction with your licensed contractor. Schedule required inspections at each milestone — foundation, framing, rough mechanical/electrical/plumbing, insulation, and final. Coordinate with neighbors in close-set neighborhoods to manage construction access and parking.' },
      { title: 'Final inspection & occupancy', desc: 'Request final inspection from the Building Division. Once passed, receive your Certificate of Occupancy. Your ADU is now legal to rent or occupy.' },
    ],
    fees: '$5,000–$12,000 total (plan check, building permit, school fees). Impact fees waived for ADUs under 750 sqft.',
    timeline: '4–8 weeks for plan check. 60-day maximum review required by state law.',
    contact: '(949) 707-2650 — City of Laguna Hills Community Development',
    website: 'ci.laguna-hills.ca.us/community-development',
  },

  costs: {
    constructionRange: '$250K–$400K',
    permitFees: '$5K–$12K',
    impactFees: 'Waived under 750 sqft',
    typicalSize: '600–1,000 sqft',
  },

  rental: {
    monthlyRange: '$2,300–$3,800/mo',
    demandDrivers: 'Providence Saddleback Memorial Medical Center nurses and healthcare staff, Laguna Beach service workers seeking more affordable nearby housing, Irvine Spectrum commuters, retirees downsizing within the community who rent their ADU to supplement income, and young professionals drawn to the proximity to both Laguna Beach nightlife and Irvine career opportunities.',
  },

  guide: [
    { title: 'Check your lot & city boundaries', desc: 'Use the City of Laguna Hills GIS map to verify your parcel\'s zoning, dimensions, and confirm your property is within Laguna Hills city limits. The city borders Laguna Beach, Aliso Viejo, Mission Viejo, and unincorporated county territory — addresses on border streets may fall under a different jurisdiction. Verify before you begin the permitting process.' },
    { title: 'Assess your lot topography', desc: 'Many Laguna Hills neighborhoods sit on gentle hillside terrain. Walk your property and identify the flattest area for ADU placement — usually along the rear property line. Lots with significant slopes may require a retaining wall or stepped foundation, adding $5K–$15K to construction costs. Flat lots in the Moulton Parkway corridor and Laguna Hills Estates neighborhoods are the most cost-effective to build on.' },
    { title: 'Position for the healthcare rental market', desc: 'Providence Saddleback Memorial Medical Center is one of the city\'s largest employers, with nurses, technicians, and support staff working rotating shifts. Properties within a 5-minute drive of the hospital on Moulton Parkway are ideally positioned for this tenant pool. A furnished 1-bed ADU targeting traveling nurses can command premium rates above the standard rental range.' },
    { title: 'Submit to Community Development', desc: 'File your complete architectural plans with the City of Laguna Hills Community Development Department. Include structural engineering, Title 24 energy calculations, and a drainage plan if your lot has any slope. Pay plan check fees at submission. The city processes ADU applications ministerially within 60 days.' },
    { title: 'Build with a licensed contractor', desc: 'Work with a California-licensed contractor (General-B). Avorino handles design, engineering, permitting, and construction as a single point of contact. Construction typically takes 5–7 months for standard units. Laguna Hills\' compact neighborhoods mean staging areas and material deliveries should be planned carefully to minimize disruption to adjacent properties.' },
    { title: 'Rent or occupy', desc: 'With your Certificate of Occupancy in hand, your ADU is ready. Laguna Hills\' location between Laguna Beach and Irvine supports rental rates of $2,300–$3,800/mo. Target healthcare workers at Providence Saddleback, Laguna Beach restaurant and hospitality employees seeking affordable nearby housing, and Irvine commuters who prefer the south county lifestyle at a lower cost than the coast.' },
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
  logDetail('Starting Laguna Hills ADU page build...', 'info');
  try { await buildCityPage(CITY_DATA); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
