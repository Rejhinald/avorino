// ════════════════════════════════════════════════════════════════
// Avorino Builder — RENOVATIONS PAGE
// Rename this to index.ts to build the Renovations service page.
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, createAllVariables, buildServicePage, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
const CDN = 'c4474c3';
const HEAD_CODE = [
    `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-responsive.css">`,
    `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-nav-footer.css">`,
    `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-renovations.css">`,
    CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
    '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>',
    `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-animations.js"><\/script>`,
    `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-renovations-footer.js"><\/script>`,
    CALENDLY_JS,
].join('\n');
const SERVICE_DATA = {
    slug: 'renovations',
    pageName: 'Renovations',
    title: 'Home Renovations in Orange County — Avorino Construction',
    seoDesc: 'Kitchen remodels, bathroom renovations, and whole-home transformations in Orange County. Licensed contractor with design-build approach. From outdated to outstanding. Serving Irvine, Newport Beach, and all of OC.',
    heroLabel: '// Renovations',
    heroTitle: 'Transform what you already love',
    heroSubtitle: 'Kitchen remodels, bathroom renovations, and whole-home transformations in Orange County. Design-build renovation that preserves what works and reimagines what doesn\'t.',
    approach: {
        heading: 'Renovation, not demolition',
        body: 'Great renovations honor the bones of the original home while reimagining everything else. We assess structural conditions, identify what should stay and what should go, then design a transformation that feels intentional — not patched together. Every material choice, every layout decision, every finish is selected for how it works in your specific space.',
        highlights: [
            'Pre-renovation structural and systems assessment — know the true condition before committing to a scope',
            'Design decisions made in context of your home\'s existing character, proportions, and natural light',
            'Material selection guided by longevity and livability — not just trend cycles',
            'Phased renovation plans that let you stay home during construction when possible',
        ],
    },
    serviceTypes: [
        {
            number: '01',
            title: 'Kitchen Remodel',
            desc: 'The most impactful renovation you can make. Full gut-and-rebuild or strategic updates — new layout, custom cabinetry, countertops, fixtures, and appliance integration.',
            features: ['Custom cabinetry and millwork', 'Quartz, marble, or porcelain countertops', 'Appliance integration and panel-ready installs', 'Lighting design with task and ambient layers'],
        },
        {
            number: '02',
            title: 'Bathroom Renovation',
            desc: 'Primary suites, guest baths, and powder rooms transformed with premium materials. Walk-in showers, freestanding tubs, floating vanities, and heated floors.',
            features: ['Walk-in shower with linear drain', 'Custom tile design and waterproofing', 'Floating vanity with vessel or undermount sink', 'Heated flooring and towel warmers'],
        },
        {
            number: '03',
            title: 'Whole-Home Renovation',
            desc: 'Comprehensive transformation — every room, every system, every surface. Open floor plan conversions, modernized MEP, and cohesive design throughout.',
            features: ['Load-bearing wall removal with steel headers', 'Complete MEP system upgrades', 'Flooring continuity throughout', 'Smart home integration'],
        },
        {
            number: '04',
            title: 'Outdoor Living',
            desc: 'Extend your living space outside. Covered patios, outdoor kitchens, fire features, and landscape hardscaping designed for year-round Southern California living.',
            features: ['Built-in BBQ and outdoor kitchen', 'Covered patio with recessed lighting', 'Fire pit or fireplace feature', 'Drainage and hardscape engineering'],
        },
    ],
    process: [
        { number: '01', title: 'Discovery & Assessment', desc: 'Walk your home with our team. We assess existing conditions, discuss your vision, identify structural opportunities and constraints, and establish a realistic scope.' },
        { number: '02', title: 'Design Development', desc: 'Floor plans, material selections, 3D renderings, and detailed specifications. You see every detail before demolition begins.' },
        { number: '03', title: 'Permitting & Procurement', desc: 'Building permits filed, materials ordered with confirmed lead times, and subcontractor schedules locked. No construction starts until everything is staged.' },
        { number: '04', title: 'Selective Demolition', desc: 'Careful removal of existing finishes and systems. We protect what stays and properly dispose of what goes. Discovery phase confirms structural assumptions.' },
        { number: '05', title: 'Construction & Installation', desc: 'Rough-in, framing modifications, finish installation. Weekly check-ins with photo documentation so you always know the status.' },
        { number: '06', title: 'Final Reveal', desc: 'Comprehensive punch list, final inspection, and walkthrough. Every detail reviewed, every surface cleaned, every system tested. Your transformed home, ready to live in.' },
    ],
    whyAvorino: {
        heading: 'Renovation requires a different skill set',
        body: 'New construction is predictable. Renovation is adaptive. You need a builder who can make decisions in real time as existing conditions are uncovered — a builder who\'s seen the inside of hundreds of OC homes and knows what to expect behind the drywall.',
        stats: [
            { value: '$150–400', label: 'Per sqft' },
            { value: '6–16wk', label: 'Typical timeline' },
            { value: '500+', label: 'Renovations completed' },
        ],
    },
    ctaHeading: 'Ready to transform your home?',
};
// ── Panel UI ──
document.getElementById('page-name').textContent = `${SERVICE_DATA.pageName}`;
const headCodeEl = document.getElementById('head-code');
const footerCodeEl = document.getElementById('footer-code');
if (headCodeEl)
    headCodeEl.textContent = HEAD_CODE;
if (footerCodeEl)
    footerCodeEl.textContent = FOOTER_CODE;
// ── Event listeners ──
document.getElementById('inject-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('inject-btn');
    btn.disabled = true;
    try {
        await createAllVariables();
    }
    catch (err) {
        log(`Error: ${err.message || err}`, 'error');
    }
    finally {
        btn.disabled = false;
    }
});
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.dataset.copy;
        let text = type === 'head' ? HEAD_CODE : type === 'footer' ? FOOTER_CODE : '';
        navigator.clipboard.writeText(text).then(() => {
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
        });
    });
});
document.getElementById('build-page')?.addEventListener('click', async () => {
    const btn = document.getElementById('build-page');
    btn.disabled = true;
    clearErrorLog();
    logDetail('Starting Renovations page build...', 'info');
    try {
        await buildServicePage(SERVICE_DATA);
    }
    catch (err) {
        log(`Error: ${err.message || err}`, 'error');
        await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
    }
    finally {
        btn.disabled = false;
    }
});
