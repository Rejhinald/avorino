// ════════════════════════════════════════════════════════════════
// Avorino Builder — 3D RENDERING PAGE
// Rename this to index.ts to build the 3D Rendering service page.
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, createAllVariables, buildServicePage, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
const CDN = '37e756c';
const HEAD_CODE = [
    `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-responsive.css">`,
    `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-nav-footer.css">`,
    `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-realrendering.css">`,
    CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
    '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>',
    `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-animations.js"><\/script>`,
    `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-realrendering-footer.js"><\/script>`,
    CALENDLY_JS,
].join('\n');
const SERVICE_DATA = {
    slug: 'realrendering',
    pageName: '3D Rendering',
    title: '3D Architectural Rendering in Orange County — Avorino Construction',
    seoDesc: 'Photorealistic 3D architectural rendering and visualization in Orange County. See your project before it\'s built. Interior and exterior renders, virtual walkthroughs, and construction visualization for homes, ADUs, and commercial projects.',
    heroLabel: '// 3D Rendering',
    heroTitle: 'See it before you build it',
    heroSubtitle: 'Photorealistic 3D rendering and architectural visualization. Make design decisions with confidence — see materials, lighting, and spatial relationships before construction begins.',
    approach: {
        heading: 'Visualization as a design tool',
        body: 'Our 3D renderings aren\'t just pretty pictures — they\'re decision-making tools. When you can see exactly how a marble countertop looks next to oak cabinetry, or how afternoon light falls through a west-facing window, you make better choices. Every render we produce is architecturally accurate, built from real construction documents, and designed to help you and your builder align on the final result.',
        highlights: [
            'Built from actual construction documents — dimensions, materials, and details match what will be built',
            'Accurate sun position and natural light simulation based on your property\'s GPS coordinates and orientation',
            'Material libraries with real manufacturer products — see actual tile, stone, wood, and fixture options in context',
            'Interactive revision process — make material swaps and layout changes and see results within 48 hours',
        ],
    },
    serviceTypes: [
        {
            number: '01',
            title: 'Exterior Rendering',
            desc: 'Photorealistic exterior views showing your project in its real environment. Landscaping, hardscaping, lighting, and neighborhood context included.',
            features: ['Multiple camera angles and perspectives', 'Real-site environment integration', 'Day and night lighting scenarios', 'Landscaping and hardscape visualization'],
        },
        {
            number: '02',
            title: 'Interior Rendering',
            desc: 'Room-by-room interior visualization with accurate materials, lighting, and furnishing scale. See your kitchen, bathroom, living room, and bedrooms before demolition day.',
            features: ['Material-accurate surfaces and textures', 'Natural and artificial lighting simulation', 'Furniture and fixture staging', 'Color palette and finish comparison views'],
        },
        {
            number: '03',
            title: 'Virtual Walkthrough',
            desc: 'Animated walkthrough of your entire project. Move through rooms, experience spatial flow, and understand proportions in a way static images can\'t convey.',
            features: ['Smooth camera path through all rooms', '60fps high-resolution output', 'Ambient sound and music scoring', 'Shareable video file format'],
        },
        {
            number: '04',
            title: 'Construction Visualization',
            desc: 'Show the construction sequence — phased views from demolition through framing through finishes. Useful for permitting presentations, HOA approvals, and investor communication.',
            features: ['Phase-by-phase construction sequence', 'Before and after comparisons', 'Site plan and aerial perspective views', 'Presentation-ready format for approvals'],
        },
    ],
    process: [
        { number: '01', title: 'Document Review', desc: 'We receive your architectural plans, material specifications, and design intent. If plans are in progress, we coordinate directly with your architect.' },
        { number: '02', title: '3D Modeling', desc: 'Accurate 3D model built from construction documents. Every wall, window, door, and detail modeled to true dimensions.' },
        { number: '03', title: 'Material Application', desc: 'Real materials applied to the model — specific tile patterns, stone selections, wood species, paint colors, and fixture models.' },
        { number: '04', title: 'Lighting & Environment', desc: 'Sun position, interior lighting fixtures, and environmental context set up. Exterior views include real-site surroundings when available.' },
        { number: '05', title: 'Render & Review', desc: 'High-resolution renders produced and presented. Two rounds of revisions included — material swaps, camera angle changes, and detail adjustments.' },
        { number: '06', title: 'Final Delivery', desc: 'Deliverables in your preferred format — high-res images, presentation boards, video walkthroughs, or interactive viewers.' },
    ],
    whyAvorino: {
        heading: 'Built by builders, not just artists',
        body: 'Our rendering team works inside a construction company. That means every render is architecturally accurate — not just beautiful, but buildable. When we show you a material, it\'s one we\'ve actually installed. When we model a detail, it\'s one we\'ve actually built.',
        stats: [
            { value: '48hr', label: 'Revision turnaround' },
            { value: '4K+', label: 'Resolution output' },
            { value: '100%', label: 'Buildable accuracy' },
        ],
    },
    ctaHeading: 'Ready to visualize your project?',
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
    logDetail('Starting 3D Rendering page build...', 'info');
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
