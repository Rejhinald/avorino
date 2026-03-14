// ════════════════════════════════════════════════════════════════
// Avorino Builder — COMMERCIAL PAGE
// Rename this to index.ts to build the Commercial service page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog,
  createAllVariables, buildServicePage, ServiceData,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

const CDN = 'c4474c3';
const HEAD_CODE = [
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-responsive.css">`,
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-nav-footer.css">`,
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-commercial.css">`,
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>',
  `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-animations.js"><\/script>`,
  `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-commercial-footer.js"><\/script>`,
  CALENDLY_JS,
].join('\n');

const SERVICE_DATA: ServiceData = {
  slug: 'commercial',
  pageName: 'Commercial',
  title: 'Commercial Construction in Orange County — Avorino Construction',
  seoDesc: 'Commercial construction, tenant improvements, and restaurant buildouts in Orange County. Licensed contractor for retail, office, restaurant, and mixed-use projects. Code-compliant construction with ADA accessibility.',

  heroLabel: '// Commercial',
  heroTitle: 'Built for business',
  heroSubtitle: 'Tenant improvements, restaurant buildouts, retail construction, and office renovations in Orange County. Code-compliant commercial construction that opens on time and on budget.',

  approach: {
    heading: 'Commercial demands a different standard',
    body: 'Commercial construction operates under different codes, different timelines, and different stakes than residential. ADA compliance, fire-rated assemblies, commercial HVAC, grease traps, Type I hoods — we navigate the complexity so you can focus on your business. Every day of delay costs you revenue, which is why we build to schedules, not estimates.',
    highlights: [
      'ADA accessibility compliance from design through final inspection — no costly retrofits',
      'Commercial building code expertise — CBC, CFC, CPC, CMC, and CEC requirements understood and built to',
      'Health department coordination for restaurant and food-service projects',
      'Phased construction schedules that minimize revenue disruption for operating businesses',
    ],
  },

  serviceTypes: [
    {
      number: '01',
      title: 'Tenant Improvements',
      desc: 'Transform raw or second-generation commercial space into your ideal business environment. Offices, clinics, salons, and professional spaces built to your brand and workflow.',
      features: ['Space planning and partition layout', 'Commercial HVAC and electrical', 'ADA-compliant restrooms and access', 'IT infrastructure and low-voltage'],
    },
    {
      number: '02',
      title: 'Restaurant Buildout',
      desc: 'Full restaurant construction from shell to service. Kitchen exhaust systems, grease interceptors, walk-in coolers, bar builds, and dining room finishes.',
      features: ['Type I and Type II hood systems', 'Grease trap and interceptor installation', 'Health department plan check coordination', 'Bar and front-of-house millwork'],
    },
    {
      number: '03',
      title: 'Retail Construction',
      desc: 'Storefront buildouts that create customer experiences. Display fixtures, lighting design, dressing rooms, checkout counters, and branded environments.',
      features: ['Storefront glazing and signage prep', 'Custom display and fixture installation', 'Lighting design for merchandising', 'Security system pre-wire'],
    },
    {
      number: '04',
      title: 'Office Renovation',
      desc: 'Modernize existing office space. Open-plan conversions, conference rooms, executive suites, and collaborative work areas with updated MEP systems.',
      features: ['Open plan and private office hybrid layouts', 'Acoustic treatment and sound masking', 'Conference and collaboration spaces', 'Updated lighting and HVAC controls'],
    },
  ],

  process: [
    { number: '01', title: 'Scope & Code Review', desc: 'Evaluate the space, review lease requirements, identify code requirements (ADA, fire, health), and establish scope and budget framework.' },
    { number: '02', title: 'Design & Permitting', desc: 'Architectural plans, MEP design, and full permit submission. Commercial plan check with building department, fire department, and health department as applicable.' },
    { number: '03', title: 'Procurement & Scheduling', desc: 'Long-lead items ordered, subcontractors locked, and construction schedule published. Equipment procurement coordinated with kitchen/specialty vendors.' },
    { number: '04', title: 'Construction', desc: 'Demolition, rough-in, framing, MEP installation, finishes. Daily progress tracking with project management communication to ownership.' },
    { number: '05', title: 'Inspections & Turnover', desc: 'Final inspections, fire department sign-off, health department approval, Certificate of Occupancy. Keys handed over with your space ready for business.' },
  ],

  whyAvorino: {
    heading: 'Your opening date is our deadline',
    body: 'Commercial construction is about business outcomes. Lease clocks are running, staff is hired, inventory is ordered. We build to schedules with weekly milestone tracking because we understand that construction delays cost you more than just time — they cost revenue.',
    stats: [
      { value: '$80–300', label: 'Per sqft TI' },
      { value: '6–16wk', label: 'Typical timeline' },
      { value: '100%', label: 'Code compliance' },
    ],
  },

  ctaHeading: 'Ready to build your business space?',
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
  logDetail('Starting Commercial page build...', 'info');
  try { await buildServicePage(SERVICE_DATA); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
