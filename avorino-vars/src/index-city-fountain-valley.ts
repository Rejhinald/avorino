// ════════════════════════════════════════════════════════════════
// Avorino Builder — FOUNTAIN VALLEY ADU PAGE
// Rename this to index.ts to build the Fountain Valley ADU page.
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
  slug: 'adu-fountain-valley',
  city: 'Fountain Valley',
  title: 'ADU Construction in Fountain Valley — Avorino',
  seoDesc: 'Build a permitted ADU in Fountain Valley, CA. Centrally located in OC with generous lots, top-rated schools, and strong rental demand. Licensed Orange County ADU contractor.',

  overview: 'Fountain Valley is a centrally located city of approximately 57,000 residents in the heart of Orange County, known for its excellent schools, well-maintained parks, and the 640-acre Mile Square Regional Park — one of the largest urban parks in the county. The city was originally developed as a planned community in the 1960s, resulting in consistent residential neighborhoods with generous lot sizes averaging 6,000–8,000 sqft. Fountain Valley is served by the highly regarded Fountain Valley School District and Huntington Beach Union High School District, with Fountain Valley High School consistently ranking among the top public high schools in Orange County. The city\'s central location provides easy access to the 405 freeway, placing residents within a short commute of Irvine, Costa Mesa, Huntington Beach, and the John Wayne Airport. MemorialCare Orange Coast Medical Center is a major employer and driver of healthcare worker rental demand. The Vietnamese-American community centered along Brookhurst Street contributes to the city\'s cultural richness and supports a thriving restaurant and retail corridor.',

  whyBuild: 'Generous 1960s-era lot sizes are ideal for detached ADUs, top-rated Fountain Valley School District drives family rental demand, central OC location with easy 405 freeway access, and MemorialCare Orange Coast Medical Center generates steady healthcare worker housing needs.',

  regulations: {
    setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. No setback required for conversions of existing structures.',
    height: '16 feet for single-story detached ADUs. Up to 18 feet with roof pitch allowance. Two-story ADUs may reach 25 feet in qualifying zones under AB 1332.',
    parking: 'No additional parking required if within 0.5 miles of public transit. OCTA bus routes on Brookhurst Street, Euclid Street, and Warner Avenue qualify many properties for parking exemptions.',
    lotSize: '6,000–8,000 sqft typical in Fountain Valley\'s planned neighborhoods. No minimum lot size required by state law.',
    ownerOccupancy: 'No owner-occupancy requirement (permanent per AB 976, effective 2025).',
    additionalNotes: 'Fountain Valley processes ADU applications ministerially per state law. ADUs under 750 sqft are exempt from impact fees. The city\'s consistent lot sizes and flat topography make ADU construction particularly straightforward.',
  },

  permitting: {
    department: 'City of Fountain Valley Planning Division — Community Development Department',
    steps: [
      { title: 'Verify zoning & lot dimensions', desc: 'Confirm your property is zoned R-1 (Single Family Residential) using the city\'s zoning map. Measure your lot — most Fountain Valley lots at 6,000–8,000 sqft with flat topography can easily accommodate a detached ADU.' },
      { title: 'Pre-application consultation', desc: 'Contact the Planning Division at (714) 593-4431 for an informal consultation. Staff will confirm ADU eligibility, setback requirements, and any utility considerations specific to your property.' },
      { title: 'Submit complete plans', desc: 'Submit architectural and engineering plans to the Community Development Department. Include site plan, floor plans, elevations, structural calculations, Title 24 energy compliance, and MEP plans. The city processes ADU applications ministerially.' },
      { title: 'Plan check review', desc: 'Plan check typically takes 4–6 weeks. Fountain Valley must process compliant ADU applications within 60 days per state law. The city\'s building division is known for thorough but efficient reviews.' },
      { title: 'Pull permit & construct', desc: 'Pay fees and pull your building permit. Begin construction with a licensed contractor. Fountain Valley\'s flat lots and consistent infrastructure make construction logistics straightforward. Schedule inspections at each milestone.' },
      { title: 'Final inspection & occupancy', desc: 'Pass final inspection and receive your Certificate of Occupancy. Your ADU is now legally habitable and ready for occupancy or rental.' },
    ],
    fees: '$4,000–$11,000 total (plan check, building permit, school fees, utility connections). Impact fees waived for ADUs under 750 sqft.',
    timeline: '4–6 weeks plan check. 60-day maximum for compliant applications per state mandate.',
    contact: '(714) 593-4431 — Fountain Valley Planning Division',
    website: 'fountainvalley.org/departments/community-development',
  },

  costs: {
    constructionRange: '$235K–$385K',
    permitFees: '$4K–$11K',
    impactFees: 'Waived under 750 sqft',
    typicalSize: '600–1,000 sqft',
  },

  rental: {
    monthlyRange: '$2,300–$3,600/mo',
    demandDrivers: 'MemorialCare Orange Coast Medical Center nurses and medical staff, families seeking Fountain Valley School District enrollment, 405 freeway commuters to Irvine and Costa Mesa, Mile Square Regional Park and recreation-oriented residents, and the thriving Brookhurst Street commercial corridor attracting small business owners and workers.',
  },

  guide: [
    { title: 'Evaluate your lot', desc: 'Fountain Valley\'s 1960s planned development means consistent lot sizes of 6,000–8,000 sqft with flat topography. Measure your backyard depth and width accounting for 4-foot setbacks. Most lots can accommodate a 600–800 sqft detached ADU with room for landscaping and setbacks.' },
    { title: 'Choose your ADU type', desc: 'Detached backyard ADUs are the most popular choice in Fountain Valley given the generous, flat lots. Garage conversions are cost-effective alternatives. The city\'s consistent infrastructure — sewer, water, and electrical — typically makes utility connections straightforward for new detached units.' },
    { title: 'Design for Fountain Valley', desc: 'Fountain Valley homes are predominantly 1960s ranch-style. Match your ADU\'s roofline, stucco finish, and color palette to the primary residence. A well-designed ADU that complements the neighborhood aesthetic adds significant property value.' },
    { title: 'Submit to Community Development', desc: 'File complete plans with the City of Fountain Valley Community Development Department. ADU applications are processed ministerially within 60 days — no public hearing or discretionary review required.' },
    { title: 'Build with Avorino', desc: 'Avorino handles the entire ADU process — design, engineering, permitting, and construction. Fountain Valley\'s flat topography and consistent lot layouts make for efficient construction, often completing projects faster than hillside communities.' },
    { title: 'Rent in a strong market', desc: 'Fountain Valley\'s central location, top schools, and proximity to Orange Coast Medical Center support rental rates of $2,300–$3,600/mo. Target healthcare workers, families seeking school district enrollment, and professionals commuting on the 405 to Irvine and Costa Mesa.' },
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
  logDetail('Starting Fountain Valley ADU page build...', 'info');
  try { await buildCityPage(CITY_DATA); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
