// ════════════════════════════════════════════════════════════════
// Avorino Builder — FULLERTON ADU PAGE
// Rename this to index.ts to build the Fullerton ADU page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog,
  createAllVariables, buildCityPage, CityData,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

const HEAD_CODE = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@af53b2e/avorino-responsive.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@af53b2e/avorino-nav-footer.css">',
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@af53b2e/avorino-animations.js"><\/script>',
  CALENDLY_JS,
].join('\n');

const CITY_DATA: CityData = {
  slug: 'fullerton-adu',
  city: 'Fullerton',
  title: 'ADU Construction in Fullerton — Avorino',
  seoDesc: 'Build a permitted ADU in Fullerton, CA. Detached, attached, and garage conversions. Licensed Orange County contractor near Cal State Fullerton.',

  overview: 'Fullerton is a vibrant north Orange County city of approximately 140,000 residents, defined by its relationship with Cal State Fullerton — one of the largest universities in the CSU system with over 40,000 students. The city features diverse neighborhoods ranging from the walkable downtown core with its restaurants, bars, and live music venues, to the upscale hillside homes of Sunny Hills and Raymond Hills, to established flatland neighborhoods near the university. Fullerton\'s Metrolink and Amtrak station connects to Los Angeles and San Diego, and the city enforces a 31-day minimum rental period on ADUs, effectively prohibiting short-term vacation rentals while supporting the long-term housing market.',

  whyBuild: 'Cal State Fullerton\'s 40,000+ students drive enormous and consistent rental demand. Diverse lot sizes from hillside estates to flatland residential parcels offer flexibility, and a strong young professional population supports premium rents near downtown.',

  regulations: {
    setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. Conversions of existing structures are exempt from setback requirements.',
    height: 'Up to 16 feet for detached ADUs. Up to 25 feet for attached ADUs in qualifying residential zones.',
    parking: 'One parking space per ADU may be required. Exempt if within 0.5 miles of public transit (including Fullerton Transportation Center), if the property is in a designated Preservation "P" zone, or if the property is on the local historic register.',
    lotSize: '6,000–9,000 sqft for standard residential neighborhoods. Hillside properties in Sunny Hills and Raymond Hills may be significantly larger. No minimum lot size required by state law to build an ADU.',
    ownerOccupancy: 'No owner-occupancy requirement for ADUs (made permanent by AB 976 in 2025).',
    additionalNotes: 'Fullerton enforces a 31-day minimum rental period for ADUs — short-term rentals (Airbnb, VRBO) are not permitted. Properties in Preservation "P" zones or on the local historic register receive automatic parking exemptions. The city\'s Fullerton Transportation Center (Metrolink/Amtrak) creates a large transit-proximity exemption zone.',
  },

  permitting: {
    department: 'City of Fullerton Community & Economic Development Department — Planning & Zoning Division, 303 W. Commonwealth Avenue',
    steps: [
      { title: 'Verify zoning & lot characteristics', desc: 'Check your property on the City of Fullerton zoning map. Determine whether your parcel is in a Preservation "P" zone or on the local historic register, as this affects parking requirements. Hillside properties may have additional grading and geotechnical requirements.' },
      { title: 'Design your ADU', desc: 'Create architectural plans including site plan, floor plan, elevations, structural, mechanical, electrical, and plumbing. Consider the target rental market — student housing near CSUF vs. young professional housing near downtown vs. family housing in Sunny Hills.' },
      { title: 'Submit to Community & Economic Development', desc: 'Submit your complete plan set to the Planning & Zoning Division at 303 W. Commonwealth Avenue. Include structural engineering, Title 24 energy calculations, and a soils/geotechnical report if on a hillside lot.' },
      { title: 'Plan check review', desc: 'The city reviews plans for compliance with building codes and ADU regulations. State law mandates a 60-day maximum review period for compliant ADU applications.' },
      { title: 'Build & inspect', desc: 'Once permitted, begin construction with your licensed contractor. Schedule required inspections at each milestone — foundation, framing, rough MEP, insulation, and final.' },
      { title: 'Final inspection & occupancy', desc: 'Request final inspection from the Building Division. Once passed, receive your Certificate of Occupancy. Remember: 31-day minimum rental period applies — no short-term rentals.' },
    ],
    fees: '$5,000–$12,000 total (plan check, building permit, school fees). Impact fees waived for ADUs under 750 sqft.',
    timeline: '4–8 weeks for plan check. 60-day maximum review required by state law.',
    contact: '(714) 738-6300 — City of Fullerton Community & Economic Development',
    website: 'cityoffullerton.com/government/departments/community-economic-development',
  },

  costs: {
    constructionRange: '$250K–$400K',
    permitFees: '$5K–$12K',
    impactFees: 'Waived under 750 sqft',
    typicalSize: '600–1,200 sqft',
  },

  rental: {
    monthlyRange: '$2,200–$3,600/mo',
    demandDrivers: 'Cal State Fullerton students and faculty (40,000+ enrollment creating year-round demand), downtown Fullerton employers and restaurant/entertainment industry workers, Disneyland Resort and Anaheim Convention Center hospitality employees, Raytheon and Beckman Coulter in nearby Brea and Anaheim Hills, and Fullerton Transportation Center commuters working in Los Angeles.',
  },

  guide: [
    { title: 'Check your lot & zoning', desc: 'Verify your property on the City of Fullerton zoning map. Note whether you\'re in a Preservation "P" zone or on the historic register (automatic parking exemption). Hillside lots in Sunny Hills and Raymond Hills should also check for slope and grading requirements.' },
    { title: 'Target the student housing market', desc: 'With 40,000+ students at Cal State Fullerton, ADUs within a few miles of campus command premium rents and experience near-zero vacancy. Design with student needs in mind — reliable WiFi infrastructure, efficient layouts, and proximity to transit or bike routes to campus.' },
    { title: 'Design for your neighborhood', desc: 'Downtown-adjacent ADUs attract young professionals who value walkability to restaurants and nightlife. Sunny Hills and Raymond Hills attract families and professionals who value quiet, upscale neighborhoods. Match your ADU\'s finishes and layout to your target tenant.' },
    { title: 'Submit to Planning & Zoning', desc: 'File your complete plans at 303 W. Commonwealth Avenue. Include structural engineering, Title 24 energy calculations, and geotechnical reports for hillside properties. Pay plan check fees at submission.' },
    { title: 'Build with a licensed contractor', desc: 'Work with a California-licensed contractor (General-B). Avorino handles design, engineering, permitting, and construction as a single point of contact. Construction typically takes 6–8 months depending on ADU size, site access, and hillside grading requirements.' },
    { title: 'Rent (31-day minimum) or occupy', desc: 'With your Certificate of Occupancy, your ADU is ready. Fullerton requires a 31-day minimum rental period — no Airbnb or short-term rentals. This works in your favor: long-term tenants provide stable income with lower turnover costs. Target CSUF students, downtown professionals, or Metrolink commuters for $2,200–$3,600/mo.' },
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
  logDetail('Starting Fullerton ADU page build...', 'info');
  try { await buildCityPage(CITY_DATA); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
