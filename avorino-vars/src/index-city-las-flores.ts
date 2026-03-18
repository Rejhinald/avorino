// ════════════════════════════════════════════════════════════════
// Avorino Builder — LAS FLORES ADU PAGE
// Rename this to index.ts to build the Las Flores ADU page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog,
  createAllVariables, buildCityPage, CityData,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

const HEAD_CODE = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@ecf44ad/avorino-responsive.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@ecf44ad/avorino-nav-footer.css">',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@ecf44ad/avorino-adu.css">',
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@ecf44ad/avorino-animations.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@ecf44ad/avorino-city-adu-footer.js"><\/script>',
  CALENDLY_JS,
].join('\n');

const CITY_DATA: CityData = {
  slug: 'adu-las-flores',
  city: 'Las Flores',
  title: 'ADU Construction in Las Flores — Avorino',
  seoDesc: 'Build a permitted ADU in Las Flores, CA. Unincorporated south Orange County community with spacious lots, family-friendly setting, and strong rental demand. Licensed OC contractor.',

  overview: 'Las Flores is an unincorporated community in south Orange County, nestled between Rancho Santa Margarita, Mission Viejo, and the foothills of the Santa Ana Mountains. With a population of approximately 5,000 residents, Las Flores offers a quiet, suburban setting with larger lots than many surrounding incorporated cities. Because Las Flores is unincorporated, ADU permitting is handled by the County of Orange rather than a city jurisdiction. The community\'s residential character is predominantly single-family homes built in the 1980s–90s, many on lots of 6,000–10,000+ sqft with hillside views. Las Flores is served by the Saddleback Valley Unified School District — the same top-rated district that serves Mission Viejo and Lake Forest — making it attractive to families. The community is accessed via Oso Parkway and Antonio Parkway, with the 241 toll road and I-5 freeway nearby for commuting to Irvine, Laguna Niguel, and San Diego County. Residents enjoy proximity to O\'Neill Regional Park, Oso Creek Trail, and the Tijeras Creek Golf Club.',

  whyBuild: 'Spacious lots in an unincorporated area allow for larger ADU footprints, top-rated Saddleback Valley Unified schools drive family demand, limited rental housing in the immediate area creates strong occupancy rates, and the quiet foothill setting commands premium rents.',

  regulations: {
    setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. Hillside properties may have additional grading setback requirements from the County of Orange.',
    height: '16 feet for single-story detached ADUs. Up to 18 feet with roof pitch allowance. Two-story ADUs may reach 25 feet in qualifying zones under AB 1332.',
    parking: 'No additional parking required in most cases per state exemptions. Properties near OCTA transit stops are explicitly exempt.',
    lotSize: '6,000–10,000+ sqft typical in Las Flores. Many hillside lots exceed 8,000 sqft, providing ample room for detached ADUs.',
    ownerOccupancy: 'No owner-occupancy requirement (permanent per AB 976, effective 2025).',
    additionalNotes: 'As an unincorporated community, permitting is handled by the County of Orange — OC Development Services. ADUs under 750 sqft are exempt from impact fees. Hillside properties may require a soils report and grading plan. Some properties may be within an HOA — while HOAs cannot prohibit ADUs, they may require architectural review.',
  },

  permitting: {
    department: 'County of Orange — OC Development Services / Building & Safety',
    steps: [
      { title: 'Verify parcel & HOA status', desc: 'Confirm your property details with the County of Orange. Las Flores properties may be in an HOA — check your CC&Rs. Contact OC Development Services at (714) 667-8888 to confirm zoning and any site-specific requirements for your parcel.' },
      { title: 'Assess hillside conditions', desc: 'Many Las Flores lots have slopes or hillside conditions. If your property has significant grade changes, you may need a soils report and grading plan. Flat pad areas within hillside lots are ideal ADU locations.' },
      { title: 'Submit plans to OC Development Services', desc: 'Submit complete architectural and engineering plans to the County of Orange. Include site plan, floor plans, elevations, structural calculations, Title 24 energy compliance, MEP plans, and any required soils or grading reports.' },
      { title: 'Plan check review', desc: 'County plan check typically takes 4–8 weeks. The county must process compliant ADU applications within 60 days per state law. Address any corrections and resubmit promptly.' },
      { title: 'Pull permit & construct', desc: 'Pay fees and pull your building permit from the county. Begin construction with a licensed contractor. Hillside lots may require additional grading and foundation work — budget accordingly.' },
      { title: 'Final inspection & occupancy', desc: 'Pass final county inspection and receive your Certificate of Occupancy. Your ADU is now legally habitable in one of south Orange County\'s most desirable residential settings.' },
    ],
    fees: '$5,000–$13,000 total (county plan check, building permit, school fees, utility connections). Impact fees waived for ADUs under 750 sqft. Hillside properties may incur additional grading permit fees.',
    timeline: '4–8 weeks county plan check. 60-day maximum for complete applications per state mandate.',
    contact: '(714) 667-8888 — OC Development Services',
    website: 'ocpublicworks.com/building',
  },

  costs: {
    constructionRange: '$260K–$420K',
    permitFees: '$5K–$13K',
    impactFees: 'Waived under 750 sqft',
    typicalSize: '600–1,000 sqft',
  },

  rental: {
    monthlyRange: '$2,600–$4,000/mo',
    demandDrivers: 'Families seeking Saddleback Valley Unified School District enrollment, professionals commuting to Irvine and Laguna Niguel via the 241 toll road and I-5, outdoor recreation enthusiasts drawn to O\'Neill Regional Park and Oso Creek Trail, and limited existing rental inventory in unincorporated Las Flores.',
  },

  guide: [
    { title: 'Assess your lot & topography', desc: 'Las Flores lots range from 6,000–10,000+ sqft, but many have hillside grades. Identify the flattest area of your lot for ADU placement. A flat pad area along the rear property line is ideal. If significant grading is needed, factor that into your budget — a soils report will be required.' },
    { title: 'Check HOA requirements', desc: 'Some Las Flores neighborhoods have HOAs. While state law prevents HOAs from prohibiting ADUs, they may require architectural review. Contact your HOA early to request their design guidelines and submit for review concurrently with county permitting.' },
    { title: 'Design for the foothill setting', desc: 'Las Flores homes typically feature Mediterranean, Spanish, or California ranch architectural styles. Match your ADU\'s roofline, stucco finish, and color palette to the primary residence. Take advantage of hillside views when possible — a well-positioned ADU with mountain views commands premium rents.' },
    { title: 'Submit to County of Orange', desc: 'Since Las Flores is unincorporated, your building permit comes from the County of Orange. Submit plans to OC Development Services. Include any required soils reports and grading plans for hillside parcels.' },
    { title: 'Build with Avorino', desc: 'Avorino has extensive experience with both flat-lot and hillside ADU construction in south Orange County. We handle design, engineering, county permitting, and construction — including specialized foundation work for hillside properties.' },
    { title: 'Rent in a premium market', desc: 'Las Flores\'s limited rental inventory and desirable school district support rental rates of $2,600–$4,000/mo. Target families seeking Saddleback Valley Unified enrollment, professionals commuting to Irvine, and outdoor enthusiasts who value the foothill lifestyle.' },
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
  logDetail('Starting Las Flores ADU page build...', 'info');
  try { await buildCityPage(CITY_DATA); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
