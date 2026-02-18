// ════════════════════════════════════════════════════════════════
// Avorino Builder — SANTA ANA ADU PAGE
// Rename this to index.ts to build the Santa Ana ADU page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog,
  createAllVariables, buildCityPage, CityData,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

const HEAD_CODE = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@b91dd73/avorino-responsive.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@b91dd73/avorino-nav-footer.css">',
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@b91dd73/avorino-animations.js"><\/script>',
  CALENDLY_JS,
].join('\n');

const CITY_DATA: CityData = {
  slug: 'santa-ana-adu',
  city: 'Santa Ana',
  title: 'ADU Construction in Santa Ana — Avorino',
  seoDesc: 'Build a permitted ADU in Santa Ana, CA. Expedited processing, pre-approved plans available. Licensed Orange County contractor serving the county seat.',

  overview: 'Santa Ana is the county seat of Orange County and its most urban city, with approximately 310,000 residents packed into 27 square miles. As the administrative hub of OC — home to the Orange County Superior Court, federal courthouse, and county government offices — Santa Ana has a massive daytime workforce. Roughly 55% of households are renters, making it the strongest rental market in the county by volume. The city has emerged as one of the most ADU-friendly jurisdictions in Orange County, offering expedited same-day counter processing for compliant applications and a pre-approved ADU plans program that dramatically reduces permitting timelines. For investors, Santa Ana represents the most affordable entry point for ADU construction in Orange County while delivering reliable rental income.',

  whyBuild: 'The most ADU-friendly city in Orange County — offering expedited same-day counter processing for compliant applications and a pre-approved plans program. With 55% of households renting, Santa Ana has the strongest and most consistent rental demand in the county.',

  regulations: {
    setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. Conversions of existing structures are exempt from setback requirements.',
    height: 'Up to 16 feet for detached ADUs. Up to 25 feet for attached ADUs in qualifying residential zones.',
    parking: 'No additional parking required if within 0.5 miles of public transit — which covers a significant portion of Santa Ana due to OCTA bus route density. Otherwise, one space per ADU may be required.',
    lotSize: '5,000–7,000 sqft for standard residential neighborhoods. Premium neighborhoods like Floral Park, Morrison Park, and Park Santiago offer lots up to 10,000+ sqft. No minimum lot size required by state law to build an ADU.',
    ownerOccupancy: 'No owner-occupancy requirement for ADUs (made permanent by AB 976 in 2025).',
    additionalNotes: 'Santa Ana offers a pre-approved ADU plans program — selecting from pre-approved designs significantly reduces plan check time. Expedited same-day counter processing is available for compliant applications that use standard designs and meet all requirements. Due to OCTA\'s extensive bus network, many Santa Ana properties qualify for the transit parking exemption.',
  },

  permitting: {
    department: 'City of Santa Ana Planning and Building Department',
    steps: [
      { title: 'Check for pre-approved plans', desc: 'Before designing from scratch, check the city\'s pre-approved ADU plans catalog. Using a pre-approved design can reduce your permitting timeline from weeks to days and eliminate plan check review entirely for qualifying applications.' },
      { title: 'Design your ADU (or select pre-approved)', desc: 'If using custom plans, create architectural drawings including site plan, floor plan, elevations, structural, and MEP. If using pre-approved plans, prepare site-specific adaptations showing your lot layout, utility connections, and setback compliance.' },
      { title: 'Submit to Planning and Building', desc: 'Submit your plans to the Planning and Building Department. For compliant applications using pre-approved or straightforward designs, expedited same-day counter review may be available. Email planning@santa-ana.org for questions.' },
      { title: 'Plan check review', desc: 'Custom designs undergo standard plan check review. State law mandates a 60-day maximum. Pre-approved plans may receive expedited processing — as little as one day at the counter for fully compliant applications.' },
      { title: 'Build & inspect', desc: 'Once permitted, begin construction with your licensed contractor. Schedule required inspections at each milestone. Call (714) 667-2738 for inspection scheduling.' },
      { title: 'Final inspection & occupancy', desc: 'Request final inspection. Once passed, receive your Certificate of Occupancy. Your ADU is now legal to rent or occupy in Orange County\'s strongest rental market.' },
    ],
    fees: 'Contact city for current fee schedule. Santa Ana periodically updates fees — call (714) 667-2738 or email planning@santa-ana.org for the latest schedule.',
    timeline: 'Same-day to 60 days depending on application type. Pre-approved plans with compliant applications may receive same-day counter approval. Custom designs follow standard 60-day state-mandated timeline.',
    contact: '(714) 667-2738 — City of Santa Ana Planning and Building (inspections) | planning@santa-ana.org',
    website: 'santa-ana.org/planning-and-building',
  },

  costs: {
    constructionRange: '$225K–$375K',
    permitFees: 'Contact city for current schedule',
    impactFees: 'Waived under 750 sqft',
    typicalSize: '600–1,200 sqft',
  },

  rental: {
    monthlyRange: '$2,000–$3,200/mo',
    demandDrivers: 'Orange County government and court system employees, Ingram Micro headquarters (Fortune 100), First American Financial Corporation, Santa Ana Unified School District (one of OC\'s largest employers), healthcare workers at nearby hospitals, and a 55% renter population that creates consistent baseline demand. Santa Ana\'s central OC location and freeway access (I-5, SR-55, SR-22) connect renters to employment across the county.',
  },

  guide: [
    { title: 'Explore the pre-approved plans program', desc: 'Before hiring an architect, check Santa Ana\'s pre-approved ADU plans catalog. These designs have already passed plan review, meaning your permitting process can be reduced from weeks to as little as one day. This is the fastest path to a permitted ADU in Orange County.' },
    { title: 'Check your lot', desc: 'Verify your property on the City of Santa Ana zoning map. Standard residential lots are 5,000–7,000 sqft, while premium neighborhoods like Floral Park and Park Santiago offer larger parcels. Also check your proximity to OCTA bus routes — being within 0.5 miles eliminates the parking requirement.' },
    { title: 'Design or adapt plans', desc: 'If using pre-approved plans, you only need site-specific adaptations showing utility connections and setback compliance. For custom designs, create full architectural plans. Santa Ana\'s lower construction costs compared to coastal OC cities make even custom ADUs financially viable.' },
    { title: 'Submit for expedited processing', desc: 'File your plans with the Planning and Building Department. Ask about same-day counter processing for compliant applications. Bring complete documentation to maximize your chances of expedited approval. Email planning@santa-ana.org with questions before your visit.' },
    { title: 'Build with a licensed contractor', desc: 'Work with a California-licensed contractor (General-B). Avorino handles design, engineering, permitting, and construction as a single point of contact. Santa Ana\'s lower land and construction costs translate to faster ROI on your ADU investment.' },
    { title: 'Rent or occupy', desc: 'With your Certificate of Occupancy in hand, your ADU enters Orange County\'s strongest rental market. Santa Ana\'s 55% renter population, central location, and proximity to county government offices and Fortune 100 employers support rents of $2,000–$3,200/mo with minimal vacancy.' },
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
  logDetail('Starting Santa Ana ADU page build...', 'info');
  try { await buildCityPage(CITY_DATA); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
