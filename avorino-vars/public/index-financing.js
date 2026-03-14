// ════════════════════════════════════════════════════════════════
// Avorino Builder — FINANCING PAGE
// Rename this to index.ts to build the Financing service page.
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, createAllVariables, buildServicePage, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
const CDN = 'c4474c3';
const HEAD_CODE = [
    `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-responsive.css">`,
    `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-nav-footer.css">`,
    `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-financing.css">`,
    CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
    '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>',
    `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-animations.js"><\/script>`,
    `<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@${CDN}/avorino-financing-footer.js"><\/script>`,
    CALENDLY_JS,
].join('\n');
const SERVICE_DATA = {
    slug: 'financing',
    pageName: 'Financing',
    title: '100% Construction Financing in Orange County — Avorino Construction',
    seoDesc: 'Build now, pay over time. Up to 100% financing for ADU construction, custom homes, and renovations in Orange County. Leverage your property equity with competitive rates. Serving Irvine, Newport Beach, and all of OC.',
    heroLabel: '// Financing',
    heroTitle: 'Build now, pay over time',
    heroSubtitle: 'Up to 100% financing for your ADU or construction project. Leverage your property equity to build without a large upfront cost — competitive rates, fast approvals, and flexible terms.',
    approach: {
        heading: 'Financing that makes building possible',
        body: 'Most homeowners have the equity to build but not the cash on hand. Our lending partners specialize in construction financing — not generic home equity lines. They understand construction draws, permit timelines, and project phases. That means faster approvals, better terms, and a financing structure designed for how construction actually works.',
        highlights: [
            'Up to 100% project financing — cover your entire build cost without a large down payment',
            'Construction-specific loan structures with draw schedules that match project milestones',
            'Pre-qualification in 48 hours so you know your budget before design begins',
            'Competitive rates from lending partners who specialize in Orange County construction',
        ],
    },
    serviceTypes: [
        {
            number: '01',
            title: 'ADU Construction Loan',
            desc: 'Purpose-built financing for accessory dwelling units. Cover design, permitting, and construction with a single loan — then refinance or pay from rental income.',
            features: ['$150K–$350K typical loan range', 'Interest-only during construction', 'Rental income offsets payments', 'No prepayment penalties'],
        },
        {
            number: '02',
            title: 'Home Equity Line (HELOC)',
            desc: 'Tap into your existing home equity for renovations, additions, or smaller projects. Draw funds as needed and only pay interest on what you use.',
            features: ['Draw up to 85% of equity', 'Flexible draw schedule', 'Variable or fixed rate options', 'Reusable credit line'],
        },
        {
            number: '03',
            title: 'Construction-to-Permanent',
            desc: 'Single-close loan that covers both construction and permanent mortgage. Build your custom home or major addition with one application and one closing.',
            features: ['One closing, one set of fees', 'Rate lock during construction', 'Converts to 30-year fixed', 'Custom home and ground-up eligible'],
        },
        {
            number: '04',
            title: 'Renovation Loan',
            desc: 'Finance your renovation based on the after-improvement value of your home. FHA 203(k) and conventional renovation loans available through our partners.',
            features: ['Based on after-renovation value', 'FHA and conventional options', 'Include permits and labor costs', 'Single monthly payment'],
        },
    ],
    process: [
        { number: '01', title: 'Pre-Qualification', desc: 'Quick credit review and equity assessment. Know your financing capacity within 48 hours — before you invest in design or engineering.' },
        { number: '02', title: 'Project Scoping', desc: 'We provide your lender with project scope, estimated costs, and timeline. Construction-specific documentation that lenders need to approve draws.' },
        { number: '03', title: 'Loan Approval', desc: 'Your lending partner finalizes terms, appraisal, and closing. We coordinate directly with the lender to answer construction-related questions.' },
        { number: '04', title: 'Construction Draws', desc: 'Funds released at project milestones — foundation, framing, rough-in, finishes. We handle draw requests and lender inspections.' },
        { number: '05', title: 'Project Completion', desc: 'Final inspection, certificate of occupancy, and loan conversion to permanent financing. Your project is complete and your payments are set.' },
    ],
    whyAvorino: {
        heading: 'Build without the cash barrier',
        body: 'Most Orange County homeowners have $200K–$800K+ in property equity. An ADU that costs $250K to build can generate $2K–$4.5K/month in rental income — often exceeding the monthly payment from day one. That\'s not just financing — it\'s an investment that pays for itself.',
        stats: [
            { value: '100%', label: 'Financing available' },
            { value: '48hr', label: 'Pre-qualification' },
            { value: '$2-4.5K', label: 'Monthly ADU income' },
        ],
    },
    ctaHeading: 'Ready to get pre-qualified?',
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
    logDetail('Starting Financing page build...', 'info');
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
