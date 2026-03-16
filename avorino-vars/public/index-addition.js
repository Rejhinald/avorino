// ════════════════════════════════════════════════════════════════
// Avorino Builder — ADDITIONS PAGE
// Rename this to index.ts to build the Additions service page.
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, createAllVariables, buildServicePage, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
const CDN = 'a0b63f8';
const HEAD_CODE = [
    `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-responsive.css">`,
    `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-nav-footer.css">`,
    `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-addition.css">`,
    CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
    '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>',
    `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-animations.js"><\/script>`,
    `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-addition-footer.js"><\/script>`,
    CALENDLY_JS,
].join('\n');
const SERVICE_DATA = {
    slug: 'addition',
    pageName: 'Additions',
    title: 'Home Additions in Orange County — Avorino Construction',
    seoDesc: 'Room additions, second story additions, and home extensions in Orange County. Structural engineering, permitting, and licensed construction. Expand your home without moving. Serving all of OC.',
    heroLabel: '// Additions',
    heroTitle: 'More space, same address',
    heroSubtitle: 'Room additions, second stories, and home extensions in Orange County. Engineered to integrate seamlessly with your existing structure.',
    approach: {
        heading: 'Expand without compromise',
        body: 'Adding onto an existing home is more complex than new construction — the new must integrate perfectly with the old. We start with a structural assessment of your existing home, then engineer the addition to tie in seamlessly. Matching rooflines, siding, and finishes so the addition looks like it was always there.',
        highlights: [
            'Structural assessment of existing home before design — identify load paths, foundation capacity, and framing connections',
            'Roofline matching and exterior finish integration so the addition looks original, not bolted on',
            'Phased construction minimizes disruption — you stay in your home through most of the project',
            'Foundation engineering matched to existing conditions — pier, slab, or stem wall as appropriate',
        ],
    },
    serviceTypes: [
        {
            number: '01',
            title: 'Second Story Addition',
            desc: 'Double your living space without expanding your footprint. Structural reinforcement of existing walls and foundation to support the new level.',
            features: ['Structural shoring and temporary support', 'Foundation reinforcement engineering', 'Primary suite or multi-room configurations', 'Staircase design and placement optimization'],
        },
        {
            number: '02',
            title: 'Room Extension',
            desc: 'Expand outward — add square footage to existing rooms or create entirely new spaces. Kitchen expansions, family rooms, and primary bedroom extensions.',
            features: ['Seamless wall removal and header installation', 'Foundation tie-in to existing slab', 'Matched exterior siding and trim', 'Extended HVAC and electrical systems'],
        },
        {
            number: '03',
            title: 'Bump-Out Addition',
            desc: 'Smaller-scale expansion that adds 50–200 sqft to a specific room. Perfect for expanding a kitchen, adding a breakfast nook, or creating a home office.',
            features: ['Cantilevered or pier-supported designs', 'Minimal foundation requirements', 'Fast 6–10 week build timeline', 'Cost-effective per-sqft option'],
        },
        {
            number: '04',
            title: 'Sunroom & Enclosed Patio',
            desc: 'Convert outdoor space to conditioned living area. Glass walls, skylights, and climate control create a room that brings the outdoors in year-round.',
            features: ['Floor-to-ceiling glazing options', 'Climate-controlled with mini-split HVAC', 'Indoor-outdoor transition design', 'Natural light optimization'],
        },
    ],
    process: [
        { number: '01', title: 'Structural Assessment', desc: 'We evaluate your existing home\'s structural capacity — foundation type, framing system, roof structure, and load paths. This determines what\'s possible.' },
        { number: '02', title: 'Design & Engineering', desc: 'Architectural plans that integrate with your existing home. Structural engineering for tie-in connections, new foundation, and any required reinforcement.' },
        { number: '03', title: 'Permitting', desc: 'Full plan submission including structural calculations showing integration with existing structure. We manage corrections and city approvals.' },
        { number: '04', title: 'Structural Prep', desc: 'Foundation work, shoring of existing structure if needed, and preparation of connection points. The critical phase that ensures structural integrity.' },
        { number: '05', title: 'Build & Integrate', desc: 'Framing, roofline integration, MEP extensions, and finish work. The addition is built to match your existing home in every detail.' },
        { number: '06', title: 'Final Walkthrough', desc: 'Inspection, punch list, and handover. The addition should look and feel like it was always part of the original home.' },
    ],
    whyAvorino: {
        heading: 'Addition specialists, not generalists',
        body: 'Additions require a builder who understands existing structures. We\'ve engineered second stories onto 1960s slab-on-grade homes, extended kitchens through load-bearing walls, and added rooms to homes on hillsides. The structural complexity is what we do best.',
        stats: [
            { value: '$300–500', label: 'Per sqft' },
            { value: '4–10mo', label: 'Build timeline' },
            { value: '0', label: 'Structural failures' },
        ],
    },
    ctaHeading: 'Ready to expand your home?',
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
    logDetail('Starting Additions page build...', 'info');
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
