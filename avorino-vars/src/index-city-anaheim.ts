// ════════════════════════════════════════════════════════════════
// Avorino Builder — ANAHEIM ADU PAGE
// Rename this to index.ts to build the Anaheim ADU page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog,
  createAllVariables, buildCityPage, CityData,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

const HEAD_CODE = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@d47eb8f/avorino-responsive.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@d47eb8f/avorino-nav-footer.css">',
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@d47eb8f/avorino-animations.js"><\/script>',
  CALENDLY_JS,
].join('\n');

const CITY_DATA: CityData = {
  slug: 'anaheim-adu',
  city: 'Anaheim',
  title: 'ADU Construction in Anaheim — Avorino',
  seoDesc: 'Build a permitted ADU in Anaheim, CA. Detached, attached, and garage conversions. Licensed Orange County contractor.',

  overview: 'Anaheim is the second-largest city in Orange County by land area, with over 350,000 residents. Known for the Disneyland Resort, Angel Stadium, and Honda Center, Anaheim has a diverse real estate market with lot sizes that are significantly larger than many neighboring cities. The city eliminated its owner-occupancy requirement in 2020, making Anaheim one of the most investor-friendly cities in Orange County for ADU construction. Its proximity to major employment centers and tourism hubs drives consistent rental demand.',

  whyBuild: 'Larger lots, no owner-occupancy requirement, and strong rental demand near Disneyland and major employment centers.',

  regulations: {
    setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. Conversions of existing structures are exempt from setback requirements.',
    height: 'Up to 16 feet for single-story detached ADUs. Up to 25 feet for two-story ADUs in certain residential zones. An additional 2 feet may be permitted to accommodate roof pitch on lots with multi-family dwellings.',
    parking: 'No additional parking required if within 0.5 miles of public transit, or if the ADU is a conversion of existing space. Otherwise, one space per ADU may be required — can be tandem or in the driveway.',
    lotSize: '7,000–10,000 sqft typical residential lots. No minimum lot size required by state law to build an ADU.',
    ownerOccupancy: 'No owner-occupancy requirement for ADUs (eliminated 2020, made permanent by AB 976 in 2025).',
    additionalNotes: 'ADUs under 750 sqft are exempt from impact fees. The city requires a Certificate of Line and Grade before foundation inspection.',
  },

  permitting: {
    department: 'Anaheim Planning & Building Department',
    steps: [
      { title: 'Pre-application review', desc: 'Schedule a meeting with the Planning Division to confirm your property qualifies. Bring your APN and a rough site plan showing the proposed ADU location.' },
      { title: 'Submit plans', desc: 'Submit four printed copies of architectural plans in black and white to the Building Department. Plans must include site plan, floor plan, elevations, structural, mechanical, electrical, and plumbing.' },
      { title: 'Plan check review', desc: 'The city reviews your plans for compliance with building codes and ADU regulations. Anaheim targets 60-day turnaround for compliant ADU applications per state law.' },
      { title: 'Obtain permits & build', desc: 'Once approved, pull your building permit and begin construction. Schedule required inspections — including the Certificate of Line and Grade before foundation work.' },
      { title: 'Final inspection', desc: 'Request final inspection from the Building Department. Once passed, you receive your Certificate of Occupancy and your ADU is legal to occupy.' },
    ],
    fees: '$5,000–$12,000 total (plan check, building permit, school fees). Impact fees waived for ADUs under 750 sqft.',
    timeline: '4–8 weeks for plan check. 60-day maximum review required by state law.',
    contact: '(714) 765-5139 — Anaheim Building Division',
    website: 'anaheim.net/599/Building-Division',
  },

  costs: {
    constructionRange: '$250K–$400K',
    permitFees: '$5K–$12K',
    impactFees: 'Waived under 750 sqft',
    typicalSize: '600–1,200 sqft',
  },

  rental: {
    monthlyRange: '$2,200–$3,800/mo',
    demandDrivers: 'Disneyland Resort and hospitality sector workers, Angel Stadium and Honda Center employment, Cal State Fullerton student housing demand, and proximity to the 5 and 91 freeways make Anaheim a consistently strong rental market.',
  },

  guide: [
    { title: 'Check your lot', desc: 'Verify your lot size and zoning on the City of Anaheim GIS map. Most single-family residential zones (RS-1, RS-2, RS-3) allow ADUs by right.' },
    { title: 'Choose your ADU type', desc: 'Detached backyard units offer the most flexibility on Anaheim\'s larger lots. Garage conversions are the fastest and most affordable option. Attached ADUs work well for properties with limited yard space.' },
    { title: 'Hire a licensed team', desc: 'Work with a California-licensed contractor (General-B) and architect. Avorino handles design, engineering, permitting, and construction as a single point of contact.' },
    { title: 'Design & engineer', desc: 'Create architectural plans that comply with Anaheim\'s building codes. Include structural engineering, Title 24 energy calculations, and a soils report if required for your lot.' },
    { title: 'Submit & permit', desc: 'Submit plans to the Anaheim Building Department. Four printed B&W copies required. Plan check takes 4–8 weeks. Pay permit and school fees at issuance.' },
    { title: 'Build & inspect', desc: 'Construction typically takes 6–8 months. Obtain your Certificate of Line and Grade before foundation. Schedule city inspections at each milestone. Final inspection yields your Certificate of Occupancy.' },
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
  logDetail('Starting Anaheim ADU page build...', 'info');
  try { await buildCityPage(CITY_DATA); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
