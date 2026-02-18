// ════════════════════════════════════════════════════════════════
// Avorino Builder — LAKE FOREST ADU PAGE
// Rename this to index.ts to build the Lake Forest ADU page.
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
  slug: 'adu-lake-forest',
  city: 'Lake Forest',
  title: 'ADU Construction in Lake Forest — Avorino',
  seoDesc: 'Build a permitted ADU in Lake Forest, CA. Family-friendly city with excellent freeway access to Irvine employment. Detached, attached, and garage conversions. Licensed Orange County contractor.',

  overview: 'Lake Forest is a family-oriented south Orange County city of approximately 85,000 residents, named for its two man-made lakes — Lake 1 and Lake 2 — that serve as private recreational amenities for surrounding neighborhoods. The city grew primarily during the 1970s through 1990s, giving it a diverse housing stock that ranges from established single-story ranch homes in neighborhoods like El Toro Estates and Lake Forest North to newer two-story developments near Portola Hills. Lake Forest\'s greatest asset is its freeway connectivity: the I-5, SR-241, and the Foothill Transportation Corridor (SR-241 toll road) converge here, placing residents within a 10–15 minute commute of Irvine\'s massive employment centers including the Irvine Spectrum, Great Park Neighborhoods, and Irvine Business Complex. Saddleback College, one of the largest community colleges in California, sits within city limits and generates steady demand for nearby housing. Major local employers include Panasonic Avionics Corporation, Oakley (Luxottica), and the Saddleback Church campus.',

  whyBuild: 'Exceptional freeway access to Irvine employment via I-5, SR-241, and the 405, strong rental demand from Saddleback College students and faculty, family-friendly neighborhoods with good lot sizes, and significantly lower construction costs compared to coastal Orange County cities.',

  regulations: {
    setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. Conversions of existing structures (garages, bonus rooms) are exempt from setback requirements.',
    height: 'Up to 16 feet for single-story detached ADUs. Up to 25 feet for two-story ADUs per state law (AB 1332) in qualifying residential zones.',
    parking: 'One parking space per ADU may be required. Exempt if within 0.5 miles of public transit (OCTA bus routes along El Toro Road and Lake Forest Drive), within one block of a car-share vehicle, or if the ADU is a conversion of existing space.',
    lotSize: '5,000–8,000 sqft typical residential lots. Portola Hills and foothill-adjacent neighborhoods may feature larger lots of 8,000–12,000 sqft. No minimum lot size required by state law to build an ADU.',
    ownerOccupancy: 'No owner-occupancy requirement for ADUs (made permanent by AB 976 in 2025).',
    additionalNotes: 'ADUs under 750 sqft are exempt from impact fees. Some Lake Forest neighborhoods have HOAs — while they may require architectural review, they cannot prohibit ADU construction under California law. The city follows standard state ADU guidelines without additional local restrictions beyond objective design standards.',
  },

  permitting: {
    department: 'City of Lake Forest Community Development Department',
    steps: [
      { title: 'Verify zoning & lot characteristics', desc: 'Confirm your property\'s zoning on the city\'s GIS map. Most R1 single-family residential zones allow ADUs by right. Check for any HOA requirements and verify utility easements, especially in older El Toro-era neighborhoods where sewer and water line routing may need assessment.' },
      { title: 'Design your ADU', desc: 'Create architectural plans including site plan, floor plan, elevations, structural, mechanical, electrical, and plumbing. Lake Forest\'s 1970s–90s housing stock means most lots are flat with straightforward grading — an advantage over hillside communities. Design to complement the existing home\'s style, whether ranch, Mediterranean, or contemporary.' },
      { title: 'Submit plans to Community Development', desc: 'Submit your complete plan set to the Community Development Department. Include Title 24 energy compliance documentation. Lake Forest processes ADU applications ministerially — no public hearing or discretionary review is required.' },
      { title: 'Plan check review (60-day)', desc: 'The city reviews plans for compliance with building codes and ADU regulations. State law mandates a 60-day maximum review period for compliant ADU applications. Lake Forest\'s planning staff are experienced with ADU applications and typically process straightforward submissions efficiently.' },
      { title: 'Build & inspect', desc: 'Once permitted, begin construction with your licensed contractor. Schedule required inspections at each milestone — foundation, framing, rough mechanical/electrical/plumbing, insulation, and final. Lake Forest\'s flat terrain and established infrastructure make most ADU builds straightforward.' },
      { title: 'Final inspection & occupancy', desc: 'Request final inspection from the Building Division. Once passed, receive your Certificate of Occupancy. Your ADU is now legal to rent or occupy.' },
    ],
    fees: '$5,000–$12,000 total (plan check, building permit, school fees). Impact fees waived for ADUs under 750 sqft.',
    timeline: '4–8 weeks for plan check. 60-day maximum review required by state law.',
    contact: '(949) 461-3533 — City of Lake Forest Community Development',
    website: 'lakeforestca.gov/departments/community-development',
  },

  costs: {
    constructionRange: '$250K–$400K',
    permitFees: '$5K–$12K',
    impactFees: 'Waived under 750 sqft',
    typicalSize: '600–1,000 sqft',
  },

  rental: {
    monthlyRange: '$2,300–$3,800/mo',
    demandDrivers: 'Saddleback College students and faculty, Irvine Spectrum and Irvine Business Complex commuters seeking more affordable south county housing, Panasonic Avionics and Oakley/Luxottica employees, Saddleback Church staff, and families drawn to Lake Forest\'s parks, recreational lakes, and proximity to Whiting Ranch Wilderness Park.',
  },

  guide: [
    { title: 'Check your lot & neighborhood era', desc: 'Use the City of Lake Forest GIS map to verify your parcel\'s zoning and dimensions. Identify when your neighborhood was built — 1970s El Toro-era homes on the west side often have larger lots and wider setbacks, while 1990s developments near Baker Ranch and Portola Hills may have tighter lot configurations. This determines your best ADU type and placement.' },
    { title: 'Leverage flat terrain advantages', desc: 'Unlike hillside south county cities, most Lake Forest neighborhoods sit on flat or gently graded terrain. This eliminates the need for expensive retaining walls, specialized foundations, and hillside grading plans that add $20K–$50K to construction costs in cities like Laguna Beach or San Clemente. Plan for a standard slab foundation to keep costs down.' },
    { title: 'Target the Saddleback College & Irvine commuter market', desc: 'Lake Forest\'s location makes it ideal for two high-demand renter demographics: Saddleback College students and staff who want to walk or bike to campus, and Irvine workers who commute via I-5 or SR-241. A well-designed 1-bed ADU (600–800 sqft) near the college or freeway on-ramps will lease quickly and command top rental rates.' },
    { title: 'Submit to Community Development', desc: 'File your complete architectural plans with the City of Lake Forest Community Development Department. Include structural engineering, Title 24 energy calculations, and utility connection plans. Pay plan check fees at submission. The city processes ADU applications ministerially within 60 days.' },
    { title: 'Build with a licensed contractor', desc: 'Work with a California-licensed contractor (General-B). Avorino handles design, engineering, permitting, and construction as a single point of contact. Construction typically takes 5–7 months for standard units. Lake Forest\'s established utility infrastructure and flat lots mean fewer site preparation surprises.' },
    { title: 'Rent or occupy', desc: 'With your Certificate of Occupancy in hand, your ADU is ready. Lake Forest\'s central south county location, Saddleback College proximity, and direct freeway access to Irvine support rental rates of $2,300–$3,800/mo. One-bedroom units near Saddleback College rent fastest, while larger units attract families and commuting professionals.' },
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
  logDetail('Starting Lake Forest ADU page build...', 'info');
  try { await buildCityPage(CITY_DATA); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
