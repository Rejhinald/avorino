// ════════════════════════════════════════════════════════════════
// Avorino Builder — TUSTIN ADU PAGE
// Rename this to index.ts to build the Tustin ADU page.
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
  slug: 'tustin-adu',
  city: 'Tustin',
  title: 'ADU Construction in Tustin — Avorino',
  seoDesc: 'Build a permitted ADU in Tustin, CA. Detached, attached, and garage conversions. Licensed Orange County contractor serving Old Town Tustin and Tustin Legacy.',

  overview: 'Tustin is a centrally located Orange County city with over 115,000 residents, offering a compelling mix of older character neighborhoods and modern master-planned communities. Old Town Tustin features tree-lined streets with mid-century homes on generous lots, while the Tustin Legacy development — built on the former Marine Corps Air Station — brings newer housing, retail at The District, and open space. The city sits at the geographic heart of Orange County with direct access to the I-5 and SR-55 freeways, placing residents minutes from Irvine\'s massive employment base. Major employers like Blizzard Entertainment are headquartered nearby, and the diverse local economy spans tech, healthcare, and retail sectors.',

  whyBuild: 'Central OC location with direct proximity to the Irvine job market, a mix of lot sizes ranging from spacious North Tustin estates to standard residential parcels, and strong rental demand driven by Irvine tech and biotech workers seeking more affordable housing.',

  regulations: {
    setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. Conversions of existing structures are exempt from setback requirements.',
    height: 'Up to 16 feet for single-story detached ADUs. Up to 25 feet for two-story ADUs per AB 1332 provisions in qualifying residential zones.',
    parking: 'One parking space per ADU may be required. Exempt if within 0.5 miles of public transit, within one block of a car-share vehicle, or if the ADU is a conversion of existing space.',
    lotSize: '6,000–8,000 sqft typical residential lots in Tustin proper. North Tustin unincorporated areas feature significantly larger parcels, often 10,000–20,000+ sqft. No minimum lot size required by state law to build an ADU.',
    ownerOccupancy: 'No owner-occupancy requirement for ADUs (made permanent by AB 976 in 2025).',
    additionalNotes: 'ADUs under 750 sqft are exempt from impact fees. North Tustin properties fall under Orange County jurisdiction, not City of Tustin — verify which entity governs your parcel before beginning the permitting process.',
  },

  permitting: {
    department: 'City of Tustin Community Development Department — Planning Division',
    steps: [
      { title: 'Verify zoning & jurisdiction', desc: 'Confirm your property is within Tustin city limits (not unincorporated North Tustin, which falls under OC County). Check zoning on the city\'s GIS map and verify ADU eligibility for your parcel.' },
      { title: 'Design your ADU', desc: 'Create architectural plans including site plan, floor plan, elevations, structural, mechanical, electrical, and plumbing. Consider neighborhood character — Old Town Tustin has a distinct mid-century aesthetic, while Tustin Legacy skews contemporary.' },
      { title: 'Submit plans to Community Development', desc: 'Submit your complete plan set to the Community Development Department Planning Division. Include Title 24 energy compliance documentation and any required soils reports.' },
      { title: 'Plan check review (60-day)', desc: 'The city reviews plans for compliance with building codes and ADU regulations. State law mandates a 60-day maximum review period for compliant ADU applications.' },
      { title: 'Build & inspect', desc: 'Once permitted, begin construction with your licensed contractor. Schedule required inspections at each milestone — foundation, framing, rough mechanical/electrical/plumbing, insulation, and final.' },
      { title: 'Final inspection & occupancy', desc: 'Request final inspection from the Building Division. Once passed, receive your Certificate of Occupancy. Your ADU is now legal to rent or occupy.' },
    ],
    fees: '$5,000–$12,000 total (plan check, building permit, school fees). Impact fees waived for ADUs under 750 sqft.',
    timeline: '4–8 weeks for plan check. 60-day maximum review required by state law.',
    contact: '(714) 573-3100 — City of Tustin Community Development',
    website: 'tustinca.org/161/Community-Development',
  },

  costs: {
    constructionRange: '$250K–$400K',
    permitFees: '$5K–$12K',
    impactFees: 'Waived under 750 sqft',
    typicalSize: '600–1,200 sqft',
  },

  rental: {
    monthlyRange: '$2,300–$3,800/mo',
    demandDrivers: 'Irvine tech and biotech employment (Broadcom, Edwards Lifesciences, Rivian), Tustin Legacy development attracting young professionals, The District at Tustin Legacy retail and dining hub, Blizzard Entertainment headquarters nearby, and proximity to the I-5 and SR-55 freeways connecting to employment centers across Orange County.',
  },

  guide: [
    { title: 'Check your lot & jurisdiction', desc: 'Verify your property on the City of Tustin GIS map. Crucially, determine whether your parcel is in Tustin city limits or unincorporated North Tustin (Orange County). This affects which agency handles your permits and which regulations apply.' },
    { title: 'Consider North Tustin vs Tustin proper', desc: 'North Tustin\'s larger estate-sized lots (often 10,000–20,000+ sqft) offer more flexibility for detached ADUs. Standard Tustin residential lots (6,000–8,000 sqft) may favor attached ADUs or garage conversions. Match your ADU type to your lot characteristics.' },
    { title: 'Design to your neighborhood', desc: 'Old Town Tustin\'s mid-century character calls for designs that complement existing ranch-style and craftsman homes. Tustin Legacy and newer developments suit modern, contemporary designs. Matching neighborhood aesthetic maximizes property value and rental appeal.' },
    { title: 'Submit to Community Development', desc: 'File your complete architectural plans with the City of Tustin Community Development Department. Include structural engineering, Title 24 energy calculations, and a soils report if your lot requires one. Pay plan check fees at submission.' },
    { title: 'Build with a licensed contractor', desc: 'Work with a California-licensed contractor (General-B). Avorino handles design, engineering, permitting, and construction as a single point of contact. Construction typically takes 6–8 months depending on ADU size and site conditions.' },
    { title: 'Rent or occupy', desc: 'With your Certificate of Occupancy in hand, your ADU is ready. Tustin\'s central location and proximity to Irvine\'s job market support strong rental rates of $2,300–$3,800/mo. Target Irvine tech workers and young professionals priced out of Irvine proper.' },
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
  logDetail('Starting Tustin ADU page build...', 'info');
  try { await buildCityPage(CITY_DATA); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
