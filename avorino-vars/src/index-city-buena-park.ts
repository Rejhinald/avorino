// ════════════════════════════════════════════════════════════════
// Avorino Builder — BUENA PARK ADU PAGE
// Rename this to index.ts to build the Buena Park ADU page.
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
  slug: 'adu-buena-park',
  city: 'Buena Park',
  title: 'ADU Construction in Buena Park — Avorino',
  seoDesc: 'Build a permitted ADU in Buena Park, CA. Entertainment district location, affordable construction costs, strong rental demand near Knott\'s Berry Farm. Licensed OC contractor.',

  overview: 'Buena Park is a vibrant city of approximately 82,000 residents in northwest Orange County, best known as the home of Knott\'s Berry Farm — one of America\'s oldest theme parks — and the surrounding Entertainment Corridor along Beach Boulevard. This tourism and hospitality infrastructure generates significant employment and year-round rental demand from seasonal and full-time workers. Beyond the entertainment district, Buena Park is a diverse, family-oriented community with established residential neighborhoods featuring single-family homes from the 1950s–70s on lots typically ranging from 5,000–7,000 sqft. The city sits at the crossroads of the 5 and 91 freeways, providing excellent commute access to Anaheim, Fullerton, Cerritos, and downtown LA. Buena Park\'s public schools serve through the Buena Park School District and Centralia School District at the elementary level, with Savanna and Western high schools in the Anaheim Union High School District. The city\'s relatively affordable home prices compared to surrounding communities make ADU investment here particularly attractive for maximizing rental returns.',

  whyBuild: 'Knott\'s Berry Farm and the Entertainment Corridor generate year-round hospitality worker rental demand, affordable construction costs maximize ROI, excellent freeway access to Anaheim, Fullerton, and LA job centers, and diverse residential demand from families and young professionals.',

  regulations: {
    setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. No setback required for conversions of existing structures.',
    height: '16 feet for single-story detached ADUs. Up to 18 feet with additional roof pitch. Two-story ADUs may reach 25 feet in qualifying zones under AB 1332.',
    parking: 'No additional parking required if within 0.5 miles of public transit. OCTA bus routes on Beach Boulevard, La Palma Avenue, and Knott Avenue qualify many Buena Park properties for parking exemptions.',
    lotSize: '5,000–7,000 sqft typical in established Buena Park neighborhoods. No minimum lot size required by state law.',
    ownerOccupancy: 'No owner-occupancy requirement (permanent per AB 976, effective 2025).',
    additionalNotes: 'Buena Park processes ADU applications ministerially per state law. ADUs under 750 sqft are exempt from impact fees. The city has been actively encouraging ADU development as part of its housing element compliance strategy.',
  },

  permitting: {
    department: 'City of Buena Park Community Development Department',
    steps: [
      { title: 'Verify zoning & property details', desc: 'Confirm your property\'s zoning and lot dimensions. All single-family residential zones in Buena Park allow ADUs by right. Properties near the Entertainment Corridor should verify that they are zoned residential, not commercial.' },
      { title: 'Pre-application consultation', desc: 'Contact the Community Development Department at (714) 562-3626 for an initial consultation. Staff can help identify any site-specific considerations and walk you through the city\'s ADU requirements.' },
      { title: 'Submit complete plans', desc: 'Submit architectural and engineering plans including site plan, floor plans, elevations, structural engineering, Title 24 energy compliance, and MEP drawings. The city processes ADU applications ministerially — no public hearing required.' },
      { title: 'Plan check review', desc: 'Plan check typically takes 4–6 weeks. Buena Park must process compliant ADU applications within 60 days per state law. Address any corrections promptly.' },
      { title: 'Pull permit & construct', desc: 'Pay fees and pull your building permit. Begin construction with a licensed contractor. Schedule required inspections: foundation, framing, rough MEP, insulation, and final.' },
      { title: 'Final inspection & occupancy', desc: 'Pass final inspection and receive your Certificate of Occupancy. Your ADU is now legally habitable and ready for tenants.' },
    ],
    fees: '$3,500–$9,000 total (plan check, building permit, school fees). Impact fees waived for ADUs under 750 sqft.',
    timeline: '4–6 weeks plan check. 60-day maximum for compliant applications per state mandate.',
    contact: '(714) 562-3626 — Buena Park Community Development',
    website: 'buenapark.com/departments/community-development',
  },

  costs: {
    constructionRange: '$200K–$350K',
    permitFees: '$3.5K–$9K',
    impactFees: 'Waived under 750 sqft',
    typicalSize: '600–1,000 sqft',
  },

  rental: {
    monthlyRange: '$2,000–$3,200/mo',
    demandDrivers: 'Knott\'s Berry Farm and Entertainment Corridor hospitality workers, families seeking affordable Orange County housing, commuters to Anaheim\'s Resort District and Convention Center, healthcare workers at nearby hospitals, and young professionals drawn to Buena Park\'s central OC/LA County location.',
  },

  guide: [
    { title: 'Evaluate your lot', desc: 'Buena Park\'s mid-century neighborhoods typically feature lots of 5,000–7,000 sqft. Measure your backyard accounting for 4-foot setbacks. Most lots can accommodate a 500–750 sqft detached ADU. Homes with attached two-car garages are also strong conversion candidates.' },
    { title: 'Choose the right ADU type', desc: 'Garage conversions are the most cost-effective option in Buena Park, often starting at $100K–$150K. Detached backyard ADUs maximize rental income. Consider your lot layout and which option delivers the best balance of investment and return.' },
    { title: 'Design for your neighborhood', desc: 'Buena Park neighborhoods are diverse in style. Match your ADU\'s exterior to the primary residence for a cohesive look. Simple, practical designs work best — clean lines, durable materials, and efficient floor plans that appeal to the broadest range of tenants.' },
    { title: 'Submit to Community Development', desc: 'File complete plans with the City of Buena Park Community Development Department. ADU applications are processed ministerially within 60 days — no public hearing or discretionary review required.' },
    { title: 'Build with Avorino', desc: 'Avorino provides turnkey ADU construction — design, engineering, permitting, and building. Our experience in northwest Orange County means we understand Buena Park\'s building department workflows and can keep your project on schedule and budget.' },
    { title: 'Target high-demand renters', desc: 'Buena Park\'s Entertainment Corridor and freeway access create diverse rental demand. Market your ADU to hospitality workers at Knott\'s and nearby attractions, commuters to Anaheim and LA, healthcare workers, and families. Rental rates of $2,000–$3,200/mo deliver strong ROI given Buena Park\'s affordable construction costs.' },
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
  logDetail('Starting Buena Park ADU page build...', 'info');
  try { await buildCityPage(CITY_DATA); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
