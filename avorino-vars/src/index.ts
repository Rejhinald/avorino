// ════════════════════════════════════════════════════════════════
// Avorino Builder — GARAGE CONVERSION PAGE
// Rename this to index.ts to build the Garage Conversion service page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog,
  createAllVariables, buildServicePage, ServiceData,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

const CDN = '72eb296';
const HEAD_CODE = [
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-responsive.css">`,
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-nav-footer.css">`,
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-garageconversion.css">`,
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>',
  `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-animations.js"><\/script>`,
  `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-garageconversion-footer.js"><\/script>`,
  CALENDLY_JS,
].join('\n');

const SERVICE_DATA: ServiceData = {
  slug: 'garageconversion',
  pageName: 'Garage Conversions',
  title: 'Garage Conversion in Orange County — Avorino Construction',
  seoDesc: 'Convert your garage into a legal ADU, rental unit, or living space in Orange County. Full-service garage conversion — design, engineering, permitting, and construction. Fastest ROI of any ADU type.',

  heroLabel: '// Garage Conversions',
  heroTitle: 'Your garage is your best investment',
  heroSubtitle: 'Convert underused garage space into a legal, permitted living unit. The fastest and most cost-effective path to rental income or multigenerational housing in Orange County.',

  approach: {
    heading: 'Conversion, not just renovation',
    body: 'A garage conversion isn\'t simply finishing a garage — it\'s transforming a non-habitable structure into a code-compliant dwelling unit. This requires structural upgrades, insulation, ventilation, plumbing, electrical service, and fire separation. We handle the engineering and code compliance so the finished unit passes inspection and qualifies as legal habitable space.',
    highlights: [
      'Structural assessment of existing garage — verify slab thickness, wall framing, and roof capacity for habitable-space code requirements',
      'Full MEP design — new electrical sub-panel, plumbing for kitchen and bathroom, HVAC for year-round comfort',
      'Fire separation and egress engineering — required when converting attached garages per California Building Code',
      'Parking replacement solutions — tandem parking, carport, or permeable driveway paving to satisfy replacement parking requirements',
    ],
  },

  serviceTypes: [
    {
      number: '01',
      title: 'Full Garage Conversion',
      desc: 'Transform the entire 2-car garage into a studio or 1-bedroom unit. 380–500+ sqft of living space with full kitchen, bathroom, and separate entrance.',
      features: ['Full kitchen with range and refrigerator', 'Bathroom with shower or tub', 'Separate entrance and utility meters', 'Insulated walls, ceiling, and new flooring'],
    },
    {
      number: '02',
      title: 'Partial Garage Conversion',
      desc: 'Convert half the garage while keeping one parking bay. Ideal for homeowners who want a home office, gym, or studio while retaining some garage functionality.',
      features: ['Demising wall between living and garage', 'Independent HVAC zone', 'Maintains one-car parking', 'Flexible use — office, studio, or guest suite'],
    },
    {
      number: '03',
      title: 'Junior ADU (JADU)',
      desc: 'A unit of 500 sqft or less created within the existing footprint of the primary home, including the garage. Requires an efficiency kitchen — may share a bathroom with the main house.',
      features: ['Efficiency kitchen (sink, cooking, fridge)', 'Interior or exterior entrance options', 'No impact fees under 500 sqft', 'Simplest permitting pathway in California'],
    },
    {
      number: '04',
      title: 'Garage + Addition Hybrid',
      desc: 'Convert the garage and extend beyond its footprint. Adds square footage for a full 1-bedroom layout with separate living and sleeping areas.',
      features: ['Extended foundation beyond garage slab', 'Full bedroom with closet', 'Living room and full kitchen', 'Maximizes rental income potential'],
    },
  ],

  process: [
    { number: '01', title: 'Feasibility Assessment', desc: 'We inspect your garage — slab condition, framing, roof, electrical panel capacity, and sewer/water lateral location. Many garages need slab reinforcement or raising to meet habitable-space requirements.' },
    { number: '02', title: 'Design & Engineering', desc: 'Floor plan layout, structural engineering for any modifications, MEP design, Title 24 energy compliance, and fire separation details if attached to the main home.' },
    { number: '03', title: 'Permitting', desc: 'ADU permit application filed ministerially — no public hearing required. Garage conversions are among the fastest to approve because they convert existing structures with minimal site impact.' },
    { number: '04', title: 'Structural & MEP Rough-In', desc: 'Framing modifications, insulation, electrical panel upgrade or sub-panel, plumbing rough-in, HVAC installation, and fire-rated assemblies as required.' },
    { number: '05', title: 'Finishes & Inspection', desc: 'Drywall, flooring, cabinetry, fixtures, paint, and exterior modifications. Final building inspection and Certificate of Occupancy.' },
    { number: '06', title: 'Move-In Ready', desc: 'Your converted unit is legally habitable and ready for a tenant, family member, or personal use. Full warranty documentation provided.' },
  ],

  whyAvorino: {
    heading: 'The fastest ROI in residential construction',
    body: 'Garage conversions typically cost 40–60% less than detached ADUs and can be completed in half the time. With no foundation excavation, minimal site disturbance, and an existing roof over your head, a garage conversion is the most efficient path to additional living space or rental income in Orange County.',
    stats: [
      { value: '$90–180K', label: 'Typical cost' },
      { value: '8–14wk', label: 'Build timeline' },
      { value: '$1.8–2.8K', label: 'Monthly rental' },
    ],
  },

  ctaHeading: 'Ready to unlock your garage\'s potential?',
};

// ── Panel UI ──
document.getElementById('page-name')!.textContent = `${SERVICE_DATA.pageName}`;
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
  logDetail('Starting Garage Conversions page build...', 'info');
  try { await buildServicePage(SERVICE_DATA); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
