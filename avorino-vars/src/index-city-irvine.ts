// ════════════════════════════════════════════════════════════════
// Avorino Builder — IRVINE ADU PAGE
// Rename this to index.ts to build the Irvine ADU page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog,
  createAllVariables, buildCityPage, CityData,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

const HEAD_CODE = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@5ed4f6c/avorino-responsive.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@5ed4f6c/avorino-nav-footer.css">',
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@5ed4f6c/avorino-animations.js"><\/script>',
  CALENDLY_JS,
].join('\n');

const CITY_DATA: CityData = {
  slug: 'adu-irvine',
  city: 'Irvine',
  title: 'ADU Construction in Irvine — Avorino',
  seoDesc: 'Build a permitted ADU in Irvine, CA. Master-planned lots, strong rental market, and excellent ROI. Licensed Orange County contractor.',

  overview: 'Irvine is one of the largest master-planned communities in the United States, with a population over 300,000. The city consistently ranks among the safest in America and is home to UC Irvine, the Irvine Spectrum, and numerous Fortune 500 headquarters. Irvine\'s strong job market and top-rated schools drive some of the highest rental rates in Orange County. Master-planned neighborhoods typically have well-maintained infrastructure, making ADU construction straightforward from a utility and site-access standpoint. However, many Irvine communities are governed by HOAs — while state law (AB 1033) has expanded ADU rights in HOA communities, architectural review may still apply.',

  whyBuild: 'Top-rated schools, Fortune 500 job centers, and UC Irvine drive premium rental demand in one of America\'s safest cities.',

  regulations: {
    setbacks: '4-foot minimum from rear and interior side property lines for new detached ADUs. No setback required for conversions of existing legal structures.',
    height: '16 feet for single-story detached ADUs. Up to 18 feet with additional 2 feet for roof pitch. Two-story ADUs may reach 25 feet in qualifying zones under AB 1332.',
    parking: 'No additional parking required if within 0.5 miles of transit (Irvine has multiple OCTA and Metrolink stops). Most locations qualify for parking exemptions.',
    lotSize: '5,000–8,000 sqft in most residential neighborhoods. Some communities have larger lots up to 10,000+ sqft.',
    ownerOccupancy: 'No owner-occupancy requirement (permanent per AB 976, effective 2025).',
    additionalNotes: 'HOA communities may require architectural review but cannot outright prohibit ADUs under state law (AB 1033). ADUs under 750 sqft are exempt from impact fees.',
  },

  permitting: {
    department: 'City of Irvine Community Development — Development Assistance Center',
    steps: [
      { title: 'Verify HOA rules', desc: 'If your property is in an HOA community, review CC&Rs and submit for architectural review. State law prevents HOAs from banning ADUs, but they may regulate design elements like materials and colors.' },
      { title: 'Pre-application consult', desc: 'Visit the Development Assistance Center at City Hall for a free pre-application review. Bring your APN, property survey, and preliminary site plan.' },
      { title: 'Submit plans', desc: 'Submit complete architectural and engineering plans to the Community Development Department. Include site plan, floor plans, elevations, structural calculations, Title 24 energy compliance, and MEP plans.' },
      { title: 'Plan check & corrections', desc: 'Plan check typically takes 4–6 weeks for ADU applications. Address any plan check corrections and resubmit. The city is required to process compliant ADU applications within 60 days.' },
      { title: 'Pull permit & construct', desc: 'Pay fees and pull your building permit. Begin construction with a licensed contractor. Schedule inspections at each phase: foundation, framing, rough MEP, insulation, and final.' },
      { title: 'Final inspection & occupancy', desc: 'Pass final inspection and receive your Certificate of Occupancy. Your ADU is now legally habitable and can be rented immediately.' },
    ],
    fees: '$6,000–$15,000 total (plan check, building permit, school fees, utility connections). Impact fees waived for units under 750 sqft.',
    timeline: '4–6 weeks plan check. 60-day max for complete applications per state mandate.',
    contact: '(949) 724-6000 — Irvine Community Development',
    website: 'cityofirvine.org/community-development',
  },

  costs: {
    constructionRange: '$275K–$425K',
    permitFees: '$6K–$15K',
    impactFees: 'Waived under 750 sqft',
    typicalSize: '600–1,000 sqft',
  },

  rental: {
    monthlyRange: '$2,800–$4,500/mo',
    demandDrivers: 'UC Irvine students and faculty, tech and biotech company employees at Irvine Spectrum and Great Park, top-rated Irvine Unified School District attracting families, and proximity to John Wayne Airport create sustained high-end rental demand.',
  },

  guide: [
    { title: 'Check HOA & zoning', desc: 'Most Irvine properties are in HOA communities. Confirm your HOA cannot block your ADU (state law protects you), but plan for architectural review timelines. Verify your zoning allows ADUs — all single-family residential zones do.' },
    { title: 'Assess your lot', desc: 'Measure your available buildable area accounting for 4-foot setbacks. Irvine lots are typically 5,000–8,000 sqft. A 600 sqft detached ADU needs roughly a 900 sqft footprint with setbacks.' },
    { title: 'Design for the neighborhood', desc: 'Irvine communities have consistent architectural styles. Design your ADU to complement existing homes — matching rooflines, materials, and color palettes increases both approval speed and property value.' },
    { title: 'Engineer & submit', desc: 'Complete structural engineering, Title 24 energy compliance, and soils report. Submit to the Development Assistance Center. Track your application online through the city\'s permit portal.' },
    { title: 'Build with a licensed contractor', desc: 'Irvine requires all construction to be performed by licensed contractors. Avorino handles the entire process — design, engineering, permitting, and construction — as your single point of contact.' },
    { title: 'Inspect & rent', desc: 'Pass final city inspection and obtain your Certificate of Occupancy. Irvine\'s premium rental market means your ADU can generate $2,800–$4,500/mo depending on size and finishes.' },
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
  logDetail('Starting Irvine ADU page build...', 'info');
  try { await buildCityPage(CITY_DATA); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
