// ════════════════════════════════════════════════════════════════
// Avorino Builder — YORBA LINDA ADU PAGE
// Rename this to index.ts to build the Yorba Linda ADU page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog,
  createAllVariables, buildCityPage, CityData,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

const HEAD_CODE = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@e0a2ad7/avorino-responsive.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@e0a2ad7/avorino-nav-footer.css">',
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@e0a2ad7/avorino-animations.js"><\/script>',
  CALENDLY_JS,
].join('\n');

const CITY_DATA: CityData = {
  slug: 'adu-yorba-linda',
  city: 'Yorba Linda',
  title: 'ADU Construction in Yorba Linda — Avorino',
  seoDesc: 'Build a permitted ADU in Yorba Linda, CA. Premium lots from 7,000 to 15,000+ sqft in the "Land of Gracious Living." Licensed Orange County contractor.',

  overview: 'Yorba Linda — known as the "Land of Gracious Living" — is an upscale residential city of approximately 68,000 residents in northeast Orange County. The city is the birthplace of President Richard Nixon, and the Richard Nixon Presidential Library and Museum remains a prominent cultural landmark. Yorba Linda is distinguished by exceptionally generous lot sizes, particularly in the hills and equestrian areas where parcels regularly exceed 15,000 sqft and some reach half an acre or more. The city is served by the highly rated Placentia-Yorba Linda Unified School District, consistently ranked among the top districts in Orange County. Rolling hills, horse trails, and the proximity to Chino Hills State Park give Yorba Linda a semi-rural character rare in suburban OC. Properties in hillside overlay zones may be subject to additional grading and geological review requirements.',

  whyBuild: 'Among the largest residential lot sizes in Orange County — ideal for spacious detached ADUs — top-rated Placentia-Yorba Linda Unified schools driving family rental demand, an affluent homeowner base with significant equity for ADU investment, and premium rental rates reflecting the city\'s upscale character.',

  regulations: {
    setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. Conversions of existing structures are exempt from setback requirements.',
    height: 'Up to 16 feet for single-story detached ADUs. Up to 25 feet for two-story ADUs per state law (AB 1332) in qualifying residential zones.',
    parking: 'One parking space per ADU may be required. Exempt if within 0.5 miles of public transit, within one block of a car-share vehicle, or if the ADU is a conversion of existing space.',
    lotSize: '7,000–15,000+ sqft typical residential lots. Hillside and equestrian-zoned properties often exceed 20,000 sqft. No minimum lot size required by state law to build an ADU.',
    ownerOccupancy: 'No owner-occupancy requirement for ADUs (made permanent by AB 976 in 2025).',
    additionalNotes: 'Properties in hillside overlay zones may require geotechnical reports, grading permits, and slope stability analysis before ADU construction. Equestrian-zoned properties have additional setback and access considerations. ADUs under 750 sqft are exempt from impact fees.',
  },

  permitting: {
    department: 'City of Yorba Linda Community Development Department',
    steps: [
      { title: 'Verify zoning & overlay districts', desc: 'Check your property on the city\'s zoning map. Identify whether your parcel falls within a hillside overlay zone or equestrian district, as these designations add review requirements. Confirm ADU eligibility and any site-specific constraints.' },
      { title: 'Assess hillside & grading needs', desc: 'For properties with significant slope, commission a geotechnical soils report and preliminary grading plan. Hillside overlay zones require slope stability analysis and may mandate specific foundation types (caissons, grade beams) that affect design and budget.' },
      { title: 'Design your ADU', desc: 'Create architectural plans including site plan, floor plan, elevations, structural, mechanical, electrical, and plumbing. Yorba Linda\'s large lots allow generous ADU footprints up to 1,200 sqft. Design to complement the neighborhood — ranch, Mediterranean, and custom estate styles are prevalent.' },
      { title: 'Submit to Community Development', desc: 'Submit your complete plan set to the Community Development Department. Include Title 24 energy compliance, geotechnical report (if in hillside overlay), and grading plans if required. Pay plan check fees at submission.' },
      { title: 'Plan check & approval', desc: 'The city reviews plans for compliance with building codes, ADU regulations, and any applicable overlay zone standards. State law mandates a 60-day maximum review period for compliant ADU applications.' },
      { title: 'Build, inspect & occupy', desc: 'Once permitted, begin construction with your licensed contractor. Hillside projects may require additional inspections for grading, retaining walls, and drainage. Schedule standard inspections at each milestone through final. Certificate of Occupancy issued upon passing final inspection.' },
    ],
    fees: '$6,000–$14,000 total (plan check, building permit, school fees). Impact fees waived for ADUs under 750 sqft. Geotechnical and grading fees additional for hillside lots.',
    timeline: '4–8 weeks for plan check. 60-day maximum review required by state law. Hillside overlay review may extend the timeline.',
    contact: '(714) 961-7120 — City of Yorba Linda Community Development',
    website: 'yorbalindaca.gov/305/Community-Development',
  },

  costs: {
    constructionRange: '$275K–$425K',
    permitFees: '$6K–$14K',
    impactFees: 'Waived under 750 sqft',
    typicalSize: '600–1,200 sqft',
  },

  rental: {
    monthlyRange: '$2,500–$4,200/mo',
    demandDrivers: 'Families relocating for top-rated Placentia-Yorba Linda Unified schools, professionals working in Anaheim, Brea, and Fullerton employment centers, equestrian community residents seeking guest quarters or caretaker housing, visitors to the Richard Nixon Presidential Library, and the premium that Yorba Linda\'s semi-rural upscale character commands in the rental market.',
  },

  guide: [
    { title: 'Evaluate your lot\'s premium potential', desc: 'Yorba Linda\'s lot sizes are among the largest in Orange County. Properties in the hills often exceed 15,000–20,000 sqft, allowing for substantial detached ADUs up to the full 1,200 sqft maximum. Even standard lots at 7,000–10,000 sqft provide ample space. Walk your property to identify the optimal ADU placement.' },
    { title: 'Check hillside overlay requirements', desc: 'If your property has slope or is within the city\'s hillside overlay zone, you will need a geotechnical soils report and potentially a grading permit before ADU construction can begin. Budget an additional $5,000–$15,000 for geotechnical work and specialized foundations on steep lots.' },
    { title: 'Design a premium ADU', desc: 'Yorba Linda\'s upscale market supports higher-end ADU finishes that command top rental rates. Consider vaulted ceilings, premium flooring, quartz countertops, and indoor-outdoor living features. Match the architectural style — ranch, Mediterranean, or custom estate — to your primary home and neighborhood.' },
    { title: 'Leverage equestrian zoning', desc: 'Properties in Yorba Linda\'s equestrian zones offer unique ADU opportunities — guest quarters for visiting riders, caretaker housing, or rental units that appeal to the equestrian community. Ensure your ADU design respects equestrian setbacks and access requirements specific to these zones.' },
    { title: 'Build with a licensed contractor', desc: 'Work with a California-licensed contractor (General-B) experienced with hillside construction. Avorino handles design, engineering, geotechnical coordination, permitting, and construction as a single point of contact — particularly valuable on complex hillside sites.' },
    { title: 'Command premium rents', desc: 'Yorba Linda ADUs command some of the highest rental rates in north Orange County at $2,500–$4,200/mo. Market to families seeking Placentia-Yorba Linda Unified schools, professionals who want a quiet upscale community, and equestrian enthusiasts. Your ADU investment benefits from the city\'s consistently strong property values.' },
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
  logDetail('Starting Yorba Linda ADU page build...', 'info');
  try { await buildCityPage(CITY_DATA); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
