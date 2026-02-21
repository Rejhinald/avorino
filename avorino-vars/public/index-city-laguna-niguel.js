// ════════════════════════════════════════════════════════════════
// Avorino Builder — LAGUNA NIGUEL ADU PAGE
// Rename this to index.ts to build the Laguna Niguel ADU page.
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, createAllVariables, buildCityPage, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
const HEAD_CODE = [
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3f8063a/avorino-responsive.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3f8063a/avorino-nav-footer.css">',
    CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
    '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3f8063a/avorino-animations.js"><\/script>',
    CALENDLY_JS,
].join('\n');
const CITY_DATA = {
    slug: 'adu-laguna-niguel',
    city: 'Laguna Niguel',
    title: 'ADU Construction in Laguna Niguel — Avorino',
    seoDesc: 'Build a permitted ADU in Laguna Niguel, CA. Navigate HOA requirements, leverage pre-approved plans, and build in premium south OC. Licensed contractor.',
    overview: 'Laguna Niguel is a master-planned community in south Orange County, consistently ranked among the best places to live in California. The city is defined by its planned neighborhoods, nearly all of which are governed by homeowners associations (HOAs) — making HOA coordination the single most critical factor in any Laguna Niguel ADU project. While state law (AB 68, SB 13, AB 976) prevents HOAs from outright banning ADUs, they may impose objective design standards covering materials, colors, and architectural consistency. Laguna Niguel offers a pre-approved ADU program with an expedited 30-day review cycle, and the city\'s strong property values and desirable south OC location make ADU investment here a compelling long-term play.',
    whyBuild: 'Premium south Orange County location with strong property values, pre-approved ADU program with 30-day review, and consistent demand. HOA approval is required first, but state law prevents HOAs from banning ADUs outright.',
    regulations: {
        setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. Conversions of existing structures are exempt from setback requirements.',
        height: '16 feet for single-story detached ADUs. Up to 18 feet may be permitted for properties near public transit stops.',
        parking: 'One parking space per ADU required. Exemptions available for properties within 0.5 miles of public transit, garage conversions, and other state-mandated conditions.',
        lotSize: '5,000–8,000 sqft typical residential lots. No minimum lot size required by state law to build an ADU.',
        ownerOccupancy: 'No owner-occupancy requirement (permanent per AB 976).',
        additionalNotes: 'HOA architectural approval is required BEFORE submitting your city permit application. HOAs cannot ban ADUs under California state law, but they may impose objective design standards including materials, colors, roof pitch, and architectural style. The city\'s pre-approved ADU program offers expedited 30-day plan review for qualifying projects.',
    },
    permitting: {
        department: 'Laguna Niguel Community Development Department',
        steps: [
            { title: 'Get HOA approval first', desc: 'This is the most critical step in Laguna Niguel. Submit your proposed ADU plans to your HOA\'s architectural review committee BEFORE approaching the city. HOAs cannot ban ADUs but may require specific materials, colors, and design elements. Get written approval before proceeding.' },
            { title: 'Check pre-approved plans', desc: 'Contact the Community Development Department at (949) 362-4300 to learn about the city\'s pre-approved ADU program. Pre-approved plans receive expedited 30-day review and can simplify both HOA and city approvals.' },
            { title: 'Design your ADU', desc: 'Create architectural plans that satisfy both HOA design standards and city building codes. Include site plan, floor plan, elevations, structural engineering, MEP, and Title 24 energy calculations. Match materials and colors to your HOA\'s requirements.' },
            { title: 'Submit to Community Development', desc: 'Submit your plans along with written HOA approval to the Community Development Department. Pre-approved plans receive 30-day review. Custom plans follow the state-mandated 60-day timeline.' },
            { title: 'Obtain permit & build', desc: 'Once approved, pull your building permit and begin construction. Schedule required inspections at each milestone. Ensure construction complies with both city codes and HOA conditions.' },
            { title: 'Final inspection & occupancy', desc: 'Pass final inspection and receive your Certificate of Occupancy. Notify your HOA of completion. Your ADU is now legal to occupy or rent in one of south OC\'s most desirable communities.' },
        ],
        fees: '$6,000–$14,000 total (plan check, building permit, school fees). Impact fees waived for ADUs under 750 sqft. Pre-approved plans may have reduced plan check fees.',
        timeline: '30-day review for pre-approved plans. 4–8 weeks for custom plans. HOA approval timeline varies — allow 2–6 weeks before city submission.',
        contact: '(949) 362-4300 — Laguna Niguel Community Development — Planning@cityoflagunaniguel.org',
        website: 'cityoflagunaniguel.org/planning',
    },
    costs: {
        constructionRange: '$275K–$425K',
        permitFees: '$6K–$14K',
        impactFees: 'Waived under 750 sqft',
        typicalSize: '600–1,200 sqft',
    },
    rental: {
        monthlyRange: '$2,500–$4,000/mo',
        demandDrivers: 'Premium south OC location, top-rated schools (Capistrano Unified), proximity to Laguna Beach and Dana Point coastline, family-oriented community with consistent demand, and access to the 5 and 73 freeways connecting to Irvine\'s tech corridor.',
    },
    guide: [
        { title: 'Contact your HOA first', desc: 'This is non-negotiable in Laguna Niguel. Nearly every neighborhood has an HOA. Request their ADU design guidelines and submit your concept for architectural review before spending money on full plans. State law prevents them from banning your ADU, but they can require specific design elements.' },
        { title: 'Explore pre-approved plans', desc: 'Laguna Niguel offers a pre-approved ADU program with 30-day expedited review. These plans are already vetted for city code compliance and may be easier to get through your HOA\'s architectural review as well.' },
        { title: 'Design to HOA standards', desc: 'Your ADU must match the architectural character of your community. Work with a designer who understands HOA objective design standards — matching roof materials, exterior colors, window styles, and landscaping requirements. This prevents costly redesigns.' },
        { title: 'Hire an experienced team', desc: 'Laguna Niguel ADU projects require navigating both HOA and city processes. Avorino handles design, engineering, permitting, and construction as a single point of contact — including HOA coordination and pre-approved plan selection.' },
        { title: 'Submit with HOA approval in hand', desc: 'File your plans with Community Development along with written HOA approval. Pre-approved plans get 30-day review. Custom plans follow the 60-day state timeline. Pay permit and school fees at issuance.' },
        { title: 'Build & capitalize', desc: 'Construction typically takes 6–8 months. Coordinate with your HOA on any construction-related rules (hours, access, staging). After final inspection, your ADU is ready to rent in one of south OC\'s most desirable zip codes — expect $2,500–$4,000/mo.' },
    ],
};
// ── Panel UI ──
document.getElementById('page-name').textContent = `${CITY_DATA.city} ADU`;
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
    logDetail('Starting Laguna Niguel ADU page build...', 'info');
    try {
        await buildCityPage(CITY_DATA);
    }
    catch (err) {
        log(`Error: ${err.message || err}`, 'error');
        await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
    }
    finally {
        btn.disabled = false;
    }
});
