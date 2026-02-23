// ════════════════════════════════════════════════════════════════
// Avorino Builder — MISSION VIEJO ADU PAGE
// Rename this to index.ts to build the Mission Viejo ADU page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog,
  createAllVariables, buildCityPage, CityData,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

const HEAD_CODE = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3cf6b06/avorino-responsive.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3cf6b06/avorino-nav-footer.css">',
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3cf6b06/avorino-animations.js"><\/script>',
  CALENDLY_JS,
].join('\n');

const CITY_DATA: CityData = {
  slug: 'adu-mission-viejo',
  city: 'Mission Viejo',
  title: 'ADU Construction in Mission Viejo — Avorino',
  seoDesc: 'Build a permitted ADU in Mission Viejo, CA. One of the largest master-planned communities in the US. Detached, attached, and garage conversions. Licensed Orange County contractor.',

  overview: 'Mission Viejo is one of the largest master-planned communities in the United States, home to approximately 96,000 residents across a carefully designed landscape of residential villages, parks, and community amenities. The crown jewel is Lake Mission Viejo, a private 124-acre recreational lake available exclusively to residents, offering swimming, fishing, boating, and summer concerts. The city consistently ranks among the safest in America and is served by the highly rated Saddleback Valley Unified School District, with schools like Mission Viejo High School and Trabuco Hills High School drawing families from across south Orange County. Neighborhoods range from the original 1970s developments around the lake — including the Villages of Mission Viejo and Casta del Sol active-adult community — to newer hillside communities near O\'Neill Regional Park. The I-5 freeway bisects the city, providing direct commute access to Irvine, Laguna Niguel, and San Diego County. Major employers include Providence Mission Hospital, Saddleback College, and the retail corridor along Marguerite Parkway and La Paz Road.',

  whyBuild: 'Top-rated Saddleback Valley Unified schools drive consistent family demand, Lake Mission Viejo and recreational amenities make the city highly desirable, consistent lot sizes of 5,000–8,000 sqft are well-suited for detached ADUs, and strong rental demand from hospital workers, college staff, and families priced out of purchasing in the area.',

  regulations: {
    setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. Conversions of existing structures (garages, bonus rooms) are exempt from setback requirements.',
    height: 'Up to 16 feet for single-story detached ADUs. Up to 25 feet for two-story ADUs per state law (AB 1332) in qualifying residential zones.',
    parking: 'One parking space per ADU may be required. Exempt if within 0.5 miles of public transit, within one block of a car-share vehicle, or if the ADU is a conversion of existing space.',
    lotSize: '5,000–8,000 sqft typical residential lots across most Mission Viejo villages. No minimum lot size required by state law to build an ADU.',
    ownerOccupancy: 'No owner-occupancy requirement for ADUs (made permanent by AB 976 in 2025).',
    additionalNotes: 'ADUs under 750 sqft are exempt from impact fees. Many Mission Viejo neighborhoods have active HOAs — while HOAs may require architectural review, they cannot prohibit, unreasonably restrict, or effectively block ADU construction under California law (AB 1033). HOA review timelines cannot exceed 60 days.',
  },

  permitting: {
    department: 'City of Mission Viejo Community Development Department',
    steps: [
      { title: 'Verify zoning & HOA requirements', desc: 'Confirm your property\'s zoning on the city\'s GIS map. Most single-family residential zones allow ADUs by right. Additionally, contact your HOA (if applicable) to request their ADU architectural guidelines — they can require design review but cannot deny a compliant ADU.' },
      { title: 'Design your ADU', desc: 'Create architectural plans including site plan, floor plan, elevations, structural, mechanical, electrical, and plumbing. Mission Viejo\'s consistent lot sizes (5,000–8,000 sqft) often favor a 600–800 sqft detached unit positioned along the rear property line. Match the existing home\'s roofline and exterior materials for HOA compatibility.' },
      { title: 'Submit plans to Community Development', desc: 'Submit your complete plan set to the Community Development Department. Include Title 24 energy compliance documentation. Mission Viejo processes ADU applications ministerially — no public hearing or discretionary review is required.' },
      { title: 'Plan check review (60-day)', desc: 'The city reviews plans for compliance with building codes and ADU regulations. State law mandates a 60-day maximum review period for compliant ADU applications. If your HOA requires concurrent review, submit to both simultaneously to avoid delays.' },
      { title: 'Build & inspect', desc: 'Once permitted, begin construction with your licensed contractor. Schedule required inspections at each milestone — foundation, framing, rough mechanical/electrical/plumbing, insulation, and final. HOA may request a pre-construction meeting to confirm design compliance.' },
      { title: 'Final inspection & occupancy', desc: 'Request final inspection from the Building Division. Once passed, receive your Certificate of Occupancy. Your ADU is now legal to rent or occupy.' },
    ],
    fees: '$5,000–$12,000 total (plan check, building permit, school fees). Impact fees waived for ADUs under 750 sqft.',
    timeline: '4–8 weeks for plan check. 60-day maximum review required by state law.',
    contact: '(949) 470-3054 — City of Mission Viejo Community Development',
    website: 'cityofmissionviejo.org/departments/community-development',
  },

  costs: {
    constructionRange: '$250K–$400K',
    permitFees: '$5K–$12K',
    impactFees: 'Waived under 750 sqft',
    typicalSize: '600–1,000 sqft',
  },

  rental: {
    monthlyRange: '$2,400–$3,800/mo',
    demandDrivers: 'Providence Mission Hospital nurses and medical staff, Saddleback College faculty and students, families seeking Saddleback Valley Unified School District enrollment, I-5 commuters working in Irvine and Laguna Niguel, and retirees drawn to Casta del Sol and the Lake Mission Viejo lifestyle who seek nearby housing for caregivers or family members.',
  },

  guide: [
    { title: 'Check your lot & HOA status', desc: 'Use the City of Mission Viejo GIS map to verify your parcel\'s zoning and dimensions. Identify your HOA — nearly all Mission Viejo neighborhoods have one. Request your HOA\'s ADU architectural guidelines early, as this often takes 2–3 weeks. Remember: your HOA cannot deny a code-compliant ADU, only require reasonable design standards.' },
    { title: 'Choose the right ADU type for your village', desc: 'Mission Viejo\'s master-planned villages have consistent lot sizes but varying layouts. Homes in the original lake-area villages (built in the 1970s–80s) often have attached two-car garages ideal for conversion. Newer hillside communities near Oso Parkway may have more backyard space for detached units. Evaluate your specific lot to determine whether detached, attached, or garage conversion makes the most sense.' },
    { title: 'Design for HOA compatibility', desc: 'Match your ADU\'s exterior materials, roof pitch, and color palette to the existing primary residence. Mission Viejo HOAs typically require architectural consistency. Using the same stucco finish, roof tiles, and window style as your main home streamlines HOA approval and increases property value. Designs that blend seamlessly with the neighborhood are approved fastest.' },
    { title: 'Submit to Community Development', desc: 'File your complete architectural plans with the City of Mission Viejo Community Development Department. Include structural engineering, Title 24 energy calculations, and your HOA approval letter (if applicable). Pay plan check fees at submission. The city processes ADU applications ministerially within 60 days.' },
    { title: 'Build with a licensed contractor', desc: 'Work with a California-licensed contractor (General-B). Avorino handles design, engineering, permitting, and construction as a single point of contact. Construction typically takes 6–8 months. Coordinate with your HOA regarding construction hours, staging areas, and contractor parking — most Mission Viejo HOAs have specific construction access rules.' },
    { title: 'Rent or occupy', desc: 'With your Certificate of Occupancy in hand, your ADU is ready. Mission Viejo\'s top-rated schools, lake access, and family-friendly reputation support rental rates of $2,400–$3,800/mo. Target Providence Mission Hospital healthcare workers, Saddleback College staff, and families seeking enrollment in Saddleback Valley Unified schools.' },
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
  logDetail('Starting Mission Viejo ADU page build...', 'info');
  try { await buildCityPage(CITY_DATA); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
