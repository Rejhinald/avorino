// ════════════════════════════════════════════════════════════════
// Avorino Builder — CUSTOM HOMES PAGE
// Rename this to index.ts to build the Custom Homes service page.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog,
  createAllVariables, buildServicePage, ServiceData,
  CALENDLY_CSS, CALENDLY_JS,
} from './shared.js';

const CDN = 'a0b63f8';
const HEAD_CODE = [
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-responsive.css">`,
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-nav-footer.css">`,
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-custom-homes.css">`,
  CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
  '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
  '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>',
  `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-animations.js"><\/script>`,
  `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-custom-homes-footer.js"><\/script>`,
  CALENDLY_JS,
].join('\n');

const SERVICE_DATA: ServiceData = {
  slug: 'custom-homes',
  pageName: 'Custom Homes',
  title: 'Custom Home Building in Orange County — Avorino Construction',
  seoDesc: 'Ground-up custom home builder in Orange County, CA. Luxury residential construction from architecture through move-in. Design-build approach, licensed and insured. Serving Irvine, Newport Beach, Laguna Beach, and all of OC.',

  heroLabel: '// Custom Homes',
  heroTitle: 'Built around the way you live',
  heroSubtitle: 'Ground-up custom residences in Orange County. Architecture, engineering, permitting, and construction — every detail tailored to your vision.',

  approach: {
    heading: 'Design-build, not design-then-build',
    body: 'Most builders separate design and construction into disconnected phases. We integrate them. Your architect and your builder work as one team from day one — eliminating miscommunication, reducing change orders, and delivering a home that matches what was promised. Every home we build starts with your goals and your site conditions — not a catalog template.',
    highlights: [
      'Single point of accountability from concept to certificate of occupancy — no finger-pointing between architect and contractor',
      'Real-time cost visibility during design so you make material and layout decisions with budget clarity',
      'Structural engineering integrated from day one — bold architectural concepts are buildable, not just renderable',
      'Site-specific design that accounts for soil conditions, topography, views, solar orientation, and local code',
    ],
  },

  serviceTypes: [
    {
      number: '01',
      title: 'Single-Story Custom',
      desc: 'Open floor plans with seamless indoor-outdoor living. Ideal for larger lots where horizontal space allows every room to connect to the landscape.',
      features: ['Great rooms with 12-14ft ceilings', 'Covered outdoor living integration', 'ADA-adaptable floor plans', 'Energy-efficient single-level HVAC'],
    },
    {
      number: '02',
      title: 'Two-Story Residence',
      desc: 'Maximized square footage with clear spatial separation — living areas downstairs, private quarters above. The most popular configuration in Orange County.',
      features: ['Grand entry with statement staircase', 'Primary suite with retreat area', 'Bonus/flex rooms for evolving needs', 'Optimized lot coverage for yard space'],
    },
    {
      number: '03',
      title: 'Modern Architectural',
      desc: 'Flat rooflines, floor-to-ceiling glass, cantilevered volumes. Statement design with structural engineering that makes bold geometry possible.',
      features: ['Steel moment frames for open spans', 'Curtain wall glazing systems', 'Green roof and deck integration', 'Smart home pre-wire throughout'],
    },
    {
      number: '04',
      title: 'Estate & Luxury',
      desc: 'Premium materials, smart-home integration, and spaces designed around how you actually live. Wine rooms, home theaters, guest suites — built to your brief.',
      features: ['Custom millwork and built-ins', 'Home theater and wine cellar', 'Pool house and outdoor kitchen', 'Multi-car garage with EV charging'],
    },
  ],

  process: [
    { number: '01', title: 'Site & Feasibility', desc: 'Lot evaluation, soil testing, zoning verification. We confirm what\'s buildable before you invest in design.' },
    { number: '02', title: 'Architecture & Engineering', desc: 'Custom floor plans, structural engineering, Title 24 energy compliance, and 3D renderings — all developed in-house.' },
    { number: '03', title: 'Permitting & Approvals', desc: 'Full plan-check submission, HOA review coordination, corrections management, and city approvals. Nothing starts until everything is signed off.' },
    { number: '04', title: 'Foundation & Framing', desc: 'Engineered foundation systems, precision framing, structural steel as needed. The bones of your home built to last generations.' },
    { number: '05', title: 'MEP & Finishes', desc: 'Mechanical, electrical, plumbing rough-in followed by drywall, flooring, cabinetry, fixtures, and paint. Weekly progress updates and transparent budgets.' },
    { number: '06', title: 'Final Walkthrough & Handover', desc: 'Comprehensive punch list, final inspection, Certificate of Occupancy, warranty documentation. Your home, built exactly as designed.' },
  ],

  whyAvorino: {
    heading: 'One team, start to finish',
    body: 'Avorino is a licensed general contractor and design-build firm based in Orange County. We handle architecture, engineering, permitting, and construction under one roof — so your custom home is built with the same vision from first sketch to final walkthrough.',
    stats: [
      { value: '$350–550', label: 'Per sqft' },
      { value: '12–18mo', label: 'Typical timeline' },
      { value: '100%', label: 'Licensed & insured' },
    ],
  },

  ctaHeading: 'Ready to build your dream home?',
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
  logDetail('Starting Custom Homes page build...', 'info');
  try { await buildServicePage(SERVICE_DATA); } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally { btn.disabled = false; }
});
