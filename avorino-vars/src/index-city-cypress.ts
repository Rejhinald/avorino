// ════════════════════════════════════════════════════════════════
// Avorino Builder — CYPRESS ADU PAGE
// Rename this to index.ts to build the Cypress ADU page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog,
  createAllVariables, buildCityPage, CityData,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

const HEAD_CODE = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@ecf44ad/avorino-responsive.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@ecf44ad/avorino-nav-footer.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@ecf44ad/avorino-adu.css">',
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@ecf44ad/avorino-animations.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@ecf44ad/avorino-city-adu-footer.js"><\/script>',
  CALENDLY_JS,
].join('\n');

const CITY_DATA: CityData = {
  slug: 'adu-cypress',
  city: 'Cypress',
  title: 'ADU Construction in Cypress — Avorino',
  seoDesc: 'Build a permitted ADU in Cypress, CA. Family-friendly community with generous lot sizes, Cypress College proximity, and strong rental demand. Licensed Orange County contractor.',

  overview: 'Cypress is a well-established residential city of approximately 50,000 residents in northwest Orange County, known for its tree-lined streets, family-friendly neighborhoods, and central location between Los Angeles and the OC coast. The city is anchored by Cypress College — a respected community college serving over 15,000 students — and sits adjacent to the Los Alamitos Joint Forces Training Base, both of which generate steady rental demand. Cypress offers a mix of mid-century single-family homes built in the 1960s–70s with generous lot sizes averaging 6,000–7,500 sqft, making most properties well-suited for detached ADU construction. The city\'s proximity to the 605 and 405 freeways provides easy commute access to Long Beach, downtown LA, and Irvine, while retail and dining along Lincoln Avenue and Katella Avenue serve daily needs. Cypress consistently ranks among the best places to live in Orange County for families, driven by strong schools in the Cypress and Anaheim Union High School Districts.',

  whyBuild: 'Generous mid-century lot sizes are ideal for detached ADUs, Cypress College creates year-round student rental demand, proximity to Los Alamitos Joint Forces Training Base drives military-affiliated housing needs, and strong freeway access to LA and OC job centers.',

  regulations: {
    setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. No setback required for conversions of existing structures.',
    height: '16 feet for single-story detached ADUs. Up to 18 feet with roof pitch allowance. Two-story ADUs may reach 25 feet in qualifying zones under AB 1332.',
    parking: 'No additional parking required if within 0.5 miles of public transit. Most Cypress residential areas qualify for exemptions due to OCTA bus coverage on major corridors.',
    lotSize: '6,000–7,500 sqft typical for established Cypress neighborhoods. No minimum lot size required by state law to build an ADU.',
    ownerOccupancy: 'No owner-occupancy requirement (permanent per AB 976, effective 2025).',
    additionalNotes: 'Cypress adopted a compliant ADU ordinance in alignment with state law. ADUs under 750 sqft are exempt from impact fees. The city processes ADU applications ministerially — no discretionary review or public hearing required.',
  },

  permitting: {
    department: 'City of Cypress Community Development Department',
    steps: [
      { title: 'Verify zoning & lot dimensions', desc: 'Confirm your property is zoned single-family residential using the city\'s zoning map. Measure your lot to plan ADU placement with 4-foot setbacks. Most Cypress lots at 6,000–7,500 sqft can accommodate a 600–800 sqft detached ADU.' },
      { title: 'Pre-application consultation', desc: 'Visit or call the Community Development Department for an informal pre-application consultation. Bring your property address, lot dimensions, and preliminary ADU concept. Staff will identify any site-specific considerations.' },
      { title: 'Submit complete plans', desc: 'Submit architectural and engineering plans to Community Development. Include site plan, floor plans, elevations, structural calculations, Title 24 energy compliance, and MEP plans. Cypress processes ADU applications ministerially.' },
      { title: 'Plan check review', desc: 'Plan check typically takes 4–6 weeks. The city is required to process compliant ADU applications within 60 days per state law. Address any plan check corrections and resubmit promptly.' },
      { title: 'Pull permit & construct', desc: 'Pay fees and pull your building permit. Begin construction with a licensed contractor. Schedule inspections at each milestone: foundation, framing, rough MEP, insulation, and final.' },
      { title: 'Final inspection & occupancy', desc: 'Pass final inspection and receive your Certificate of Occupancy. Your ADU is legally habitable and can be rented or occupied immediately.' },
    ],
    fees: '$4,000–$10,000 total (plan check, building permit, school fees). Impact fees waived for ADUs under 750 sqft.',
    timeline: '4–6 weeks plan check. 60-day maximum for compliant applications per state mandate.',
    contact: '(714) 229-6720 — Cypress Community Development',
    website: 'cypressca.org/departments/community-development',
  },

  costs: {
    constructionRange: '$225K–$375K',
    permitFees: '$4K–$10K',
    impactFees: 'Waived under 750 sqft',
    typicalSize: '600–1,000 sqft',
  },

  rental: {
    monthlyRange: '$2,200–$3,500/mo',
    demandDrivers: 'Cypress College students and faculty, Los Alamitos Joint Forces Training Base military personnel, families seeking Cypress School District enrollment, commuters using the 605 and 405 freeways to reach LA and Irvine job centers, and healthcare workers at nearby Los Alamitos Medical Center.',
  },

  guide: [
    { title: 'Evaluate your lot', desc: 'Cypress\'s mid-century homes typically sit on 6,000–7,500 sqft lots with good backyard depth. Measure your available buildable area accounting for 4-foot setbacks. Most lots can accommodate a 600–800 sqft detached ADU. Homes with oversized two-car garages are also strong candidates for garage conversions.' },
    { title: 'Choose your ADU type', desc: 'Detached backyard ADUs are the most popular choice in Cypress given the generous lot sizes. Garage conversions are also common and often the most cost-effective option. Attached ADUs (additions) work well for corner lots with side-yard access.' },
    { title: 'Design for the neighborhood', desc: 'Cypress neighborhoods have a consistent mid-century suburban character. Match your ADU\'s roofline, exterior materials, and color palette to the primary residence. A well-designed ADU that blends with the neighborhood adds the most property value.' },
    { title: 'Submit to Community Development', desc: 'File your complete plans with the City of Cypress Community Development Department. The city processes ADU applications ministerially within 60 days. No public hearing or discretionary review is required for compliant ADU applications.' },
    { title: 'Build with Avorino', desc: 'Avorino handles design, engineering, permitting, and construction as your single point of contact. Our experience in northwest Orange County means we understand Cypress\'s building department processes and neighborhood design standards.' },
    { title: 'Rent at competitive rates', desc: 'Cypress\'s central location and proximity to Cypress College, Los Alamitos JFTB, and major freeways support rental rates of $2,200–$3,500/mo. Target students, military personnel, healthcare workers, and young professionals commuting to LA or Irvine.' },
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
  logDetail('Starting Cypress ADU page build...', 'info');
  try { await buildCityPage(CITY_DATA); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
