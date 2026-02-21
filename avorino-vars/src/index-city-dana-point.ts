// ════════════════════════════════════════════════════════════════
// Avorino Builder — DANA POINT ADU PAGE
// Rename this to index.ts to build the Dana Point ADU page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog,
  createAllVariables, buildCityPage, CityData,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

const HEAD_CODE = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@933f826/avorino-responsive.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@933f826/avorino-nav-footer.css">',
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@933f826/avorino-animations.js"><\/script>',
  CALENDLY_JS,
].join('\n');

const CITY_DATA: CityData = {
  slug: 'adu-dana-point',
  city: 'Dana Point',
  title: 'ADU Construction in Dana Point — Avorino',
  seoDesc: 'Build a permitted ADU in Dana Point, CA. Coastal Zone expertise, tourism-driven rental demand, harbor proximity. Licensed Orange County contractor.',

  overview: 'Dana Point is a coastal city in south Orange County known for its harbor, world-class surfing, and year-round tourism economy. The Dana Point Harbor revitalization project is driving renewed real estate interest throughout the city. Most properties in Dana Point fall within the California Coastal Zone, requiring careful navigation of coastal permitting requirements. The city has had ongoing exchanges with the California Department of Housing and Community Development (HCD) regarding ADU ordinance compliance, and Ordinance No. 25-04 now governs current ADU rules. Dana Point\'s marinas, beaches, and mild year-round weather create consistent rental demand from both long-term tenants and tourism-adjacent workers.',

  whyBuild: 'Tourism-driven economy creates year-round rental demand. Coastal location commands premium rents. The Dana Point Harbor revitalization project is driving significant real estate interest and appreciation.',

  regulations: {
    setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. Conversions of existing structures are exempt from setback requirements.',
    height: '16 feet for single-story detached ADUs. Additional height may be permitted near transit per state law.',
    parking: 'One parking space per ADU required. Exemptions include properties within 0.5 miles of transit, garage conversions, and other state-mandated conditions. Under SB 1211, no replacement parking is required when converting a garage to an ADU.',
    lotSize: 'Density-based lot requirements — approximately 4,400 sqft typical for residential properties. No minimum lot size required by state law to build an ADU.',
    ownerOccupancy: 'No owner-occupancy requirement (permanent per AB 976).',
    additionalNotes: 'Most properties in Dana Point are within the Coastal Zone. Review Ordinance No. 25-04 for current ADU regulations. The city uses the eTRAKIT online portal for permit submissions and tracking.',
  },

  permitting: {
    department: 'Dana Point Community Development Department',
    steps: [
      { title: 'Check Coastal Zone status', desc: 'Determine if your property is within the California Coastal Zone using the city\'s zoning maps or by contacting Community Development. Most Dana Point properties are in the Coastal Zone, which may require additional review or a Coastal Development Permit.' },
      { title: 'Review Ordinance No. 25-04', desc: 'Familiarize yourself with Dana Point\'s current ADU regulations under Ordinance No. 25-04. Contact the Community Development Department for guidance on how the ordinance applies to your specific property and project.' },
      { title: 'Design your ADU', desc: 'Create architectural plans compliant with Dana Point\'s ADU regulations and coastal zone requirements. Include site plan, floor plans, elevations, structural engineering, MEP, and Title 24 energy calculations.' },
      { title: 'Submit via eTRAKIT', desc: 'Submit your permit application and plans through Dana Point\'s eTRAKIT online portal. Track your application status online. The city processes compliant ADU applications within the state-mandated 60-day timeline.' },
      { title: 'Obtain permit & build', desc: 'Once approved, pull your building permit and begin construction. Schedule required inspections at each milestone — foundation, framing, rough MEP, insulation, and final.' },
      { title: 'Final inspection & occupancy', desc: 'Pass final inspection and receive your Certificate of Occupancy. Your ADU is ready to enter Dana Point\'s premium coastal rental market — strong demand from tourism workers and lifestyle renters.' },
    ],
    fees: 'Contact city for current fee schedule. Impact fees waived for ADUs under 750 sqft. Submit through eTRAKIT portal.',
    timeline: '4–8 weeks for standard plan check. Additional time for Coastal Zone properties requiring CDP. 60-day maximum review required by state law.',
    contact: 'Dana Point Community Development Department — eTRAKIT portal for submissions',
    website: 'danapoint.org/departments/community-development',
  },

  costs: {
    constructionRange: '$275K–$425K',
    permitFees: '$6K–$15K (contact city for current fees)',
    impactFees: 'Waived under 750 sqft',
    typicalSize: '600–1,200 sqft',
  },

  rental: {
    monthlyRange: '$2,800–$4,200/mo',
    demandDrivers: 'Dana Point Harbor revitalization and marina employment, year-round tourism and hospitality workers, Headlands conservation area visitors, world-class surfing at Doheny State Beach and Salt Creek, proximity to San Juan Capistrano and Laguna Beach, and coastal lifestyle demand from professionals.',
  },

  guide: [
    { title: 'Check Coastal Zone & ordinance', desc: 'Start by confirming your Coastal Zone status and reviewing Ordinance No. 25-04. Most Dana Point properties are in the Coastal Zone. Contact Community Development for guidance on how current regulations apply to your specific lot and project scope.' },
    { title: 'Assess harbor proximity', desc: 'Properties near Dana Point Harbor benefit from the ongoing harbor revitalization, which is driving increased real estate values and rental demand. Factor in harbor-area tourism when evaluating your ADU\'s rental potential — proximity to the harbor can command premium rents.' },
    { title: 'Design for coastal living', desc: 'Dana Point\'s coastal setting rewards quality design. Create an ADU with indoor-outdoor flow, natural light, and finishes that appeal to the coastal lifestyle market. Weather-resistant materials are essential for properties near the coast.' },
    { title: 'Hire a licensed team', desc: 'Dana Point ADU projects benefit from a team experienced in coastal permitting and south OC construction. Avorino handles design, engineering, permitting, and construction as a single point of contact — including eTRAKIT portal navigation and coastal zone compliance.' },
    { title: 'Submit via eTRAKIT', desc: 'File your plans through Dana Point\'s eTRAKIT online portal. Track your application status digitally. Respond promptly to any plan check corrections — faster responses mean shorter timelines.' },
    { title: 'Build & target tourism market', desc: 'Construction typically takes 6–8 months. After final inspection and Certificate of Occupancy, your ADU enters a strong rental market. Dana Point\'s tourism economy drives year-round demand — expect $2,800–$4,200/mo depending on size, finish, and harbor proximity.' },
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
  logDetail('Starting Dana Point ADU page build...', 'info');
  try { await buildCityPage(CITY_DATA); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
