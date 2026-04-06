// ════════════════════════════════════════════════════════════════
// Avorino Builder — COMMERCIAL PAGE (Custom Builder)
// Rename this to index.ts to build the Commercial service page.
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, createAllVariables, buildCommercialPage, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
const CDN = '0a5bf9d';
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
const COMMERCIAL_DATA = {
    slug: 'commercial',
    pageName: 'Commercial',
    title: 'Commercial Construction in Orange County — Avorino Construction',
    seoDesc: 'Select commercial construction in Orange County. Tenant improvements, restaurant buildouts, medical offices, and retail construction. Licensed General-B contractor with disciplined preconstruction, strong communication, and hands-on project management.',
    hero: {
        label: '// Commercial',
        title: 'Select commercial construction, executed with precision.',
        subtitle: 'Avorino delivers high-touch construction management for private commercial projects — disciplined coordination, strong communication, and a smoother owner experience from preconstruction through closeout.',
    },
    trustStrip: {
        words: ['Responsive', 'Organized', 'Accountable', 'Selective'],
        proof: { value: 'CA License #1107538', label: 'General-B · Irvine, CA' },
    },
    comparison: {
        heading: 'Not the typical construction experience',
        items: [
            { typical: 'Updates when you chase them', avorino: 'Weekly owner reports, same-day responses' },
            { typical: 'Preconstruction is a napkin estimate', avorino: 'Line-item budgets with scope-matched pricing' },
            { typical: 'Your project competes with 15 others', avorino: 'Selective portfolio — fewer projects, deeper attention' },
            { typical: 'Scope gaps surface during framing', avorino: 'Scope gaps caught and resolved in preconstruction' },
            { typical: 'Punch list drags for months', avorino: 'Closeout managed with the same urgency as day one' },
        ],
        proof: {
            number: '3',
            text: 'Repeat commercial clients in the last 24 months.',
            subtext: 'Owners who came back because the process worked.',
        },
    },
    preconstruction: {
        heading: 'Preconstruction that adds real value',
        subtitle: 'Strong projects begin long before construction starts. We help clients think through scope, budgeting, coordination, and constructability early.',
        layers: [
            { title: 'Site Shell', desc: 'Understanding the raw commercial space — demising walls, slab, shell openings — before touching anything.' },
            { title: 'Code & MEP Overlay', desc: 'Duct routing, electrical runs, plumbing risers, fire sprinkler mains. Identifying what the plans require and what the space demands.' },
            { title: 'Procurement & Schedule', desc: 'Locking scopes, sequencing trades, and buying long-lead materials before the first hammer swings.' },
            { title: 'Built Environment', desc: 'The build phase moves with clarity because preconstruction did the thinking.' },
        ],
    },
    projectTypes: {
        heading: 'Where we add the most value',
        subtitle: 'We work on select private commercial projects where planning, coordination, and responsiveness determine the outcome.',
        types: [
            { number: '01', title: 'Dental & Medical Offices', desc: 'ADA-compliant clinical buildouts with specialized MEP, sterilization plumbing, and health department coordination.' },
            { number: '02', title: 'Restaurants & Food Service', desc: 'Full kitchen buildouts including Type I/II hoods, grease interceptors, walk-in coolers, and health department plan check.' },
            { number: '03', title: 'Retail & Storefront', desc: 'Branded environments with storefront glazing, display fixtures, lighting design, and customer flow optimization.' },
            { number: '04', title: 'Office Interiors', desc: 'Tenant improvements, open-plan conversions, conference suites, and updated MEP systems for modern workplaces.' },
        ],
    },
    idealFit: {
        heading: 'The projects we are best positioned for',
        body: 'Avorino is a strong fit for private commercial projects where ownership values responsiveness, clean execution, and a contractor who stays on top of the process.',
        fits: [
            'Projects that require strong coordination across multiple trades',
            'Owners who want direct, same-day communication with project leadership',
            'Teams that value preconstruction rigor before breaking ground',
            'Commercial work where service quality and accountability matter as much as price',
            'Operators opening on a deadline who need schedule certainty',
        ],
        proofLine: 'Recent projects include restaurant buildouts, medical office TIs, and multi-unit retail — all in Orange County, all delivered to schedule.',
    },
    process: {
        heading: 'How we execute',
        steps: [
            { number: '01', title: 'Review', desc: 'Plans, scope, site conditions, timeline goals, and practical constraints — understood before moving forward.' },
            { number: '02', title: 'Mobilize', desc: 'Scopes locked, trades scheduled, long-lead items procured. Construction starts with momentum, not ambiguity.' },
            { number: '03', title: 'Build', desc: 'Scheduling, trade coordination, field execution, and owner communication — managed with accountability and urgency.' },
            { number: '04', title: 'Close', desc: 'Punch, documentation, final inspections, and handover — carried through with the same professionalism as day one.' },
        ],
    },
    cta: {
        heading: 'Planning a commercial project? Let\'s talk.',
        primaryBtn: { text: 'Start the Conversation', href: '/schedule-a-meeting' },
        secondaryBtn: { text: 'Call (714) 900-3676', href: 'tel:7149003676' },
    },
};
// ── Panel UI ──
document.getElementById('page-name').textContent = `${COMMERCIAL_DATA.pageName}`;
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
    logDetail('Starting Commercial page build...', 'info');
    try {
        await buildCommercialPage(COMMERCIAL_DATA);
    }
    catch (err) {
        log(`Error: ${err.message || err}`, 'error');
        await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
    }
    finally {
        btn.disabled = false;
    }
});
