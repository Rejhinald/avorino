// ════════════════════════════════════════════════════════════════
// Avorino Builder — PLACENTIA ADU PAGE
// Rename this to index.ts to build the Placentia ADU page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog,
  createAllVariables, buildCityPage, CityData,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

const HEAD_CODE = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3f8063a/avorino-responsive.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3f8063a/avorino-nav-footer.css">',
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3f8063a/avorino-animations.js"><\/script>',
  CALENDLY_JS,
].join('\n');

const CITY_DATA: CityData = {
  slug: 'adu-placentia',
  city: 'Placentia',
  title: 'ADU Construction in Placentia — Avorino',
  seoDesc: 'Build a permitted ADU in Placentia, CA — "A Pleasant Place to Live." Top-rated schools, growing rental demand near Cal State Fullerton. Licensed Orange County contractor.',

  overview: 'Placentia — branded as "A Pleasant Place to Live" — is a well-established city of approximately 52,000 residents in north-central Orange County. The city features a mix of mid-century neighborhoods with mature tree canopy and newer developments, all served by the highly rated Placentia-Yorba Linda Unified School District. Placentia\'s historic downtown along Santa Fe Avenue is undergoing a revitalization that includes new dining, retail, and mixed-use development, bringing renewed energy to the city center. The proximity to Cal State Fullerton (CSUF) — located just across the border in Fullerton — creates consistent demand for rental housing from students, faculty, and university staff. Residential lots typically range from 5,000 to 7,000 sqft, providing practical space for ADU construction. The city\'s central north OC location offers convenient access to the 57 and 91 freeways.',

  whyBuild: 'Growing rental demand driven by Cal State Fullerton proximity, top-rated Placentia-Yorba Linda Unified schools attracting families, historic downtown revitalization increasing neighborhood appeal, and practical lot sizes with a straightforward city permitting process.',

  regulations: {
    setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. Conversions of existing structures are exempt from setback requirements.',
    height: 'Up to 16 feet for single-story detached ADUs. Up to 25 feet for two-story ADUs per state law (AB 1332) in qualifying residential zones.',
    parking: 'One parking space per ADU may be required. Exempt if within 0.5 miles of public transit, within one block of a car-share vehicle, or if the ADU is a conversion of existing space.',
    lotSize: '5,000–7,000 sqft typical residential lots. Some older neighborhoods near downtown have slightly smaller parcels. No minimum lot size required by state law to build an ADU.',
    ownerOccupancy: 'No owner-occupancy requirement for ADUs (made permanent by AB 976 in 2025).',
    additionalNotes: 'Properties near the downtown revitalization area may benefit from increased property values as new retail, dining, and mixed-use projects are completed. ADUs under 750 sqft are exempt from impact fees.',
  },

  permitting: {
    department: 'City of Placentia Community Development Department',
    steps: [
      { title: 'Verify lot & zoning', desc: 'Confirm your property\'s zoning designation and lot dimensions on the city\'s zoning map. Most single-family residential zones in Placentia allow ADUs by right. Check for any easements, utility locations, or planned infrastructure improvements in your area.' },
      { title: 'Design your ADU', desc: 'Create architectural plans including site plan, floor plan, elevations, structural, mechanical, electrical, and plumbing. Placentia\'s established neighborhoods feature a mix of ranch-style and mid-century homes — design your ADU to complement the existing streetscape. Include Title 24 energy compliance.' },
      { title: 'Submit to Community Development', desc: 'Submit your complete plan set to the Community Development Department. Include Title 24 documentation and any required soils reports. Pay plan check fees at submission.' },
      { title: 'Plan check review', desc: 'The city reviews plans for compliance with building codes and ADU regulations. State law mandates a 60-day maximum review period for compliant ADU applications.' },
      { title: 'Build & inspect', desc: 'Once permitted, begin construction with your licensed contractor. Schedule required inspections at each milestone — foundation, framing, rough MEP, insulation, and final.' },
      { title: 'Final inspection & occupancy', desc: 'Request final inspection from the Building Division. Once passed, receive your Certificate of Occupancy. Your ADU is now legal to rent or occupy — and Placentia\'s rental market is ready for new inventory.' },
    ],
    fees: '$5,000–$10,000 total (plan check, building permit, school fees). Impact fees waived for ADUs under 750 sqft.',
    timeline: '4–8 weeks for plan check. 60-day maximum review required by state law.',
    contact: '(714) 993-8124 — City of Placentia Community Development',
    website: 'placentia.org/197/Community-Development',
  },

  costs: {
    constructionRange: '$250K–$375K',
    permitFees: '$5K–$10K',
    impactFees: 'Waived under 750 sqft',
    typicalSize: '500–1,000 sqft',
  },

  rental: {
    monthlyRange: '$2,100–$3,300/mo',
    demandDrivers: 'Cal State Fullerton students, faculty, and staff seeking off-campus housing, families relocating for top-rated Placentia-Yorba Linda Unified schools, young professionals drawn to the revitalizing downtown Santa Fe Avenue corridor, commuters using the 57 and 91 freeways to reach Anaheim, Brea, and Fullerton employment centers, and growing demand from residents priced out of neighboring Yorba Linda.',
  },

  guide: [
    { title: 'Evaluate your established Placentia lot', desc: 'Most Placentia residential lots are 5,000–7,000 sqft with mature landscaping and established homes from the 1960s–1980s. Survey your backyard to identify the best ADU placement — note existing trees, fences, utility lines, and the distance from your primary dwelling. Many properties have detached garages ripe for conversion.' },
    { title: 'Target the CSUF rental market', desc: 'Cal State Fullerton is just across the city border, with over 40,000 students and thousands of faculty and staff. Design your ADU with this market in mind — a studio or one-bedroom unit with good internet infrastructure, efficient layout, and proximity to the 57 freeway appeals to university-affiliated renters.' },
    { title: 'Complement the neighborhood character', desc: 'Placentia\'s neighborhoods have a warm, established feel with ranch-style homes, mature trees, and well-maintained yards. Design your ADU to blend in — earth tones, horizontal siding or stucco, and compatible rooflines. This approach protects property values and appeals to renters who choose Placentia for its neighborhood character.' },
    { title: 'Capitalize on downtown revitalization', desc: 'The ongoing revitalization of downtown Placentia along Santa Fe Avenue is bringing new restaurants, shops, and mixed-use development. Properties near downtown may see increased values as the corridor matures. An ADU adds rental income now while your property appreciates from the neighborhood improvements.' },
    { title: 'Build with a licensed contractor', desc: 'Work with a California-licensed contractor (General-B). Avorino handles design, engineering, permitting, and construction as a single point of contact — simplifying the process for Placentia homeowners navigating ADU construction for the first time.' },
    { title: 'Rent to a diverse tenant base', desc: 'Placentia\'s central north OC location and proximity to CSUF create a diverse rental pool. At $2,100–$3,300/mo, your ADU appeals to university students and staff, families seeking PYLUSD schools, young professionals near downtown, and commuters who value the 57 and 91 freeway access. This diversity reduces vacancy risk.' },
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
  logDetail('Starting Placentia ADU page build...', 'info');
  try { await buildCityPage(CITY_DATA); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
