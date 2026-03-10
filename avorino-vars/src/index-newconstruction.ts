// ════════════════════════════════════════════════════════════════
// Avorino Builder — NEW CONSTRUCTION PAGE
// Rename this to index.ts to build the New Construction service page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog,
  createAllVariables, buildServicePage, ServiceData,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

const CDN = '58a79f0';
const HEAD_CODE = [
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-responsive.css">`,
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-nav-footer.css">`,
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-newconstruction.css">`,
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>',
  `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-animations.js"><\/script>`,
  `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-newconstruction-footer.js"><\/script>`,
  CALENDLY_JS,
].join('\n');

const SERVICE_DATA: ServiceData = {
  slug: 'newconstruction',
  pageName: 'New Construction',
  title: 'New Construction in Orange County — Avorino Construction',
  seoDesc: 'New residential and multi-unit construction in Orange County. Foundation to finish — structural engineering, permitting, and licensed construction. Serving Irvine, Newport Beach, Anaheim, and all of OC.',

  heroLabel: '// New Construction',
  heroTitle: 'From foundation to finish',
  heroSubtitle: 'New residential and multi-unit construction in Orange County. Engineering-first approach with full-service project management from groundbreak to certificate of occupancy.',

  approach: {
    heading: 'Engineering before everything',
    body: 'New construction demands precision from the start. We begin with geotechnical reports, structural calculations, and code analysis before the first design line is drawn. This engineering-first approach means fewer surprises during construction, fewer change orders, and a building that performs for decades.',
    highlights: [
      'Geotechnical analysis and structural engineering completed before design finalization',
      'Full Title 24 energy compliance modeling integrated into architectural plans',
      'Value engineering identifies cost savings without compromising structural integrity',
      'Phased construction scheduling with milestone tracking and weekly progress reporting',
    ],
  },

  serviceTypes: [
    {
      number: '01',
      title: 'Single-Family Residential',
      desc: 'Ground-up custom homes from 1,500 to 8,000+ sqft. Every detail engineered and built to your specifications on your lot.',
      features: ['Custom architecture and floor plans', 'Full structural engineering', 'Smart home pre-wire packages', 'Energy-efficient building envelope'],
    },
    {
      number: '02',
      title: 'Multi-Unit Residential',
      desc: 'Duplexes, triplexes, and small multi-family projects. Maximize lot potential with code-compliant density and quality construction.',
      features: ['Density and zoning optimization', 'Separate utility metering', 'Sound attenuation between units', 'Shared amenity space design'],
    },
    {
      number: '03',
      title: 'Mixed-Use Development',
      desc: 'Ground-floor commercial with residential above. Navigate complex zoning and build projects that serve both tenants and the community.',
      features: ['Commercial-residential code compliance', 'ADA-accessible ground floor', 'Separate ingress/egress planning', 'Fire separation and rated assemblies'],
    },
    {
      number: '04',
      title: 'Spec & Investment Builds',
      desc: 'New construction built to sell or lease. Market-optimized design, controlled budgets, and construction timelines that protect your ROI.',
      features: ['Market analysis-driven design', 'Cost-per-sqft optimization', 'Finish packages for target buyers', 'Accelerated construction schedules'],
    },
  ],

  process: [
    { number: '01', title: 'Site Analysis & Feasibility', desc: 'Soil testing, topographic survey, zoning verification, utility mapping. We determine buildability and identify constraints before committing resources.' },
    { number: '02', title: 'Design & Engineering', desc: 'Architectural plans, structural engineering, MEP design, Title 24 energy compliance, and landscape planning — all coordinated under one project team.' },
    { number: '03', title: 'Permitting & Plan Check', desc: 'Full plan submission to building department, fire department review, corrections management, and approval tracking. No construction starts without signed permits.' },
    { number: '04', title: 'Site Prep & Foundation', desc: 'Grading, excavation, utilities trenching, and engineered foundation systems. The critical phase that determines everything built above.' },
    { number: '05', title: 'Framing Through Finishes', desc: 'Structural framing, rough-in MEP, insulation, drywall, flooring, cabinetry, fixtures, and paint. Weekly updates with photo documentation.' },
    { number: '06', title: 'Inspection & Turnover', desc: 'Final building inspection, utility connection verification, punch list completion, and Certificate of Occupancy. Full warranty documentation provided at handover.' },
  ],

  whyAvorino: {
    heading: 'Built to perform, not just to pass',
    body: 'Avorino builds new construction that exceeds code minimums. We use engineered lumber systems, high-performance building envelopes, and construction practices that deliver homes and buildings built for the next 50 years — not just the next inspection.',
    stats: [
      { value: '$280–550', label: 'Per sqft range' },
      { value: '8–18mo', label: 'Build timeline' },
      { value: 'A+', label: 'BBB rated' },
    ],
  },

  ctaHeading: 'Ready to break ground?',
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
  logDetail('Starting New Construction page build...', 'info');
  try { await buildServicePage(SERVICE_DATA); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
