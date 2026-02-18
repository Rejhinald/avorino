// ════════════════════════════════════════════════════════════════
// Avorino Builder — HUNTINGTON BEACH ADU PAGE
// Rename this to index.ts to build the Huntington Beach ADU page.
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
  slug: 'huntington-beach-adu',
  city: 'Huntington Beach',
  title: 'ADU Construction in Huntington Beach — Avorino',
  seoDesc: 'Build a permitted ADU in Huntington Beach, CA. Beachside lots, strong coastal rental demand. Licensed Orange County contractor.',

  overview: 'Huntington Beach — "Surf City USA" — is the largest beach city in Orange County with over 200,000 residents and 9.5 miles of coastline. The city spans from beachfront neighborhoods near Pacific Coast Highway to larger inland lots in areas like Huntington Harbour, Goldenwest, and Edwards Hill. Inland lots are significantly larger (6,000–9,000+ sqft) and ideal for detached ADUs, while smaller beach-adjacent lots are better suited for garage conversions or attached units. Huntington Beach\'s tourism economy, beach lifestyle, and proximity to major employers create year-round rental demand. The city has additional scrutiny around parking and setbacks compared to some Orange County cities, making experienced guidance important.',

  whyBuild: '9.5 miles of coastline drives premium rental demand. Larger inland lots are ideal for detached ADUs, and the tourism economy supports year-round occupancy.',

  regulations: {
    setbacks: '4-foot minimum from rear and interior side property lines for detached ADUs. Front and street-side setbacks follow the underlying zone requirements. Properties in specific plan areas (e.g., Holly-Seacliff, Bolsa Chica) may have additional setback guidelines.',
    height: '16 feet for single-story detached ADUs. State law allows up to 25 feet for qualifying two-story ADUs in residential zones. Check specific plan area overlays for additional height restrictions.',
    parking: 'No additional parking required near transit. Huntington Beach has additional parking sensitivity — particularly in beach-adjacent neighborhoods where street parking is already competitive. Inland properties near OCTA routes qualify for parking exemptions.',
    lotSize: '6,000–9,000 sqft typical. Beachfront lots are smaller (3,000–5,000 sqft). Inland neighborhoods like Goldenwest and Edwards Hill have lots up to 10,000+ sqft.',
    ownerOccupancy: 'No owner-occupancy requirement (permanent per AB 976).',
    additionalNotes: 'Properties in specific plan areas may require additional design review. The city reviews ADU applications within the state-mandated 60-day window. Huntington Beach is known for strict enforcement of building codes and setback compliance.',
  },

  permitting: {
    department: 'Huntington Beach Community Development Department — Permit Center',
    steps: [
      { title: 'Check specific plan areas', desc: 'Verify whether your property falls within a specific plan area (Holly-Seacliff, Bolsa Chica, Brightwater, etc.). These areas may have additional design guidelines that affect your ADU. Use the city\'s zoning map or call the Planning Division.' },
      { title: 'Pre-submission review', desc: 'Visit the Permit Center for a pre-submission review. Discuss your proposed ADU location, parking plan, and any specific plan area requirements. Bring a site plan showing setbacks and existing structures.' },
      { title: 'Prepare & submit plans', desc: 'Submit complete architectural and engineering plans. Huntington Beach expects high-quality submissions — incomplete plans are a common cause of delays. Include site plan, floor plans, elevations, structural, Title 24, and MEP.' },
      { title: 'Plan check (60 days)', desc: 'The city processes ADU applications within the state-mandated 60-day window for compliant submissions. Quality of initial submission directly affects speed — complete, accurate plans are reviewed faster.' },
      { title: 'Pull permit & construct', desc: 'Pay permit fees and begin construction. Huntington Beach inspectors are thorough — ensure your contractor is experienced with the city\'s inspection requirements. Schedule inspections promptly.' },
      { title: 'Final inspection & occupancy', desc: 'Pass all required inspections and receive your Certificate of Occupancy. Beach-adjacent ADUs can command premium rents, especially during summer months.' },
    ],
    fees: '$5,000–$14,000 total (plan check, building permit, school fees). Impact fees waived for ADUs under 750 sqft. Specific plan area review may add fees.',
    timeline: '4–8 weeks for plan check. 60-day maximum per state law. Specific plan areas may add 2–4 weeks.',
    contact: '(714) 536-5241 — Huntington Beach Permit Center',
    website: 'huntingtonbeachca.gov/government/departments/community_development',
  },

  costs: {
    constructionRange: '$250K–$425K',
    permitFees: '$5K–$14K',
    impactFees: 'Waived under 750 sqft',
    typicalSize: '600–1,200 sqft',
  },

  rental: {
    monthlyRange: '$2,400–$4,200/mo',
    demandDrivers: 'Beach lifestyle attracts young professionals and remote workers, Huntington Beach tourism economy employs thousands seasonally, Boeing and other aerospace employers are nearby, proximity to the 405 freeway connects to Irvine and Long Beach job markets, and year-round mild weather keeps rental demand consistent.',
  },

  guide: [
    { title: 'Identify your neighborhood', desc: 'Huntington Beach is large and diverse. Beach-adjacent lots (Downtown, Sunset Beach) are smaller and better for garage conversions. Inland neighborhoods (Goldenwest, Edwards Hill, Huntington Harbour) have larger lots ideal for detached ADUs.' },
    { title: 'Check for specific plans', desc: 'Several Huntington Beach neighborhoods fall under specific plan areas with additional design guidelines. Check with the Planning Division before designing — this prevents costly redesigns later.' },
    { title: 'Plan for parking', desc: 'While state law has relaxed parking requirements, beach neighborhoods have high parking sensitivity. If your property isn\'t near transit, plan for at least one dedicated ADU parking space. Tandem or driveway configurations work well.' },
    { title: 'Submit quality plans', desc: 'Huntington Beach is known for thorough plan review. Submit complete, professional plans from the start — this is the single biggest factor in avoiding delays. Include all engineering, energy compliance, and MEP documentation.' },
    { title: 'Build with coastal knowledge', desc: 'Coastal proximity means higher moisture exposure. Specify corrosion-resistant hardware, proper moisture barriers, and materials rated for coastal environments. This extends ADU lifespan and reduces maintenance costs.' },
    { title: 'Market for maximum return', desc: 'Beach-adjacent ADUs can command premium rents, especially with outdoor living space and modern finishes. Consider adding a small patio or deck — outdoor amenities significantly increase rental value in Huntington Beach.' },
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
  logDetail('Starting Huntington Beach ADU page build...', 'info');
  try { await buildCityPage(CITY_DATA); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
