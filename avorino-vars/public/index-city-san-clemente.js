// ════════════════════════════════════════════════════════════════
// Avorino Builder — SAN CLEMENTE ADU PAGE
// Rename this to index.ts to build the San Clemente ADU page.
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, createAllVariables, buildCityPage, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
const HEAD_CODE = [
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@d1d3300/avorino-responsive.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@d1d3300/avorino-nav-footer.css">',
    CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
    '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@d1d3300/avorino-animations.js"><\/script>',
    CALENDLY_JS,
].join('\n');
const CITY_DATA = {
    slug: 'adu-san-clemente',
    city: 'San Clemente',
    title: 'ADU Construction in San Clemente — Avorino',
    seoDesc: 'Build a permitted ADU in San Clemente, CA. Spanish Colonial Revival design expertise, Coastal Zone navigation, premium coastal rental market. Licensed contractor.',
    overview: 'San Clemente — the "Spanish Village by the Sea" — is the southernmost city in Orange County and one of the most architecturally distinctive. The city enforces mandatory Spanish Colonial Revival design review for all new construction, meaning your ADU must conform to Hispanic architectural principles including specific materials, finishes, roof tiles, stucco textures, and color palettes. Most of the city falls within the California Coastal Zone, requiring a Coastal Development Permit (CDP) for ADU projects. The combination of rigorous design requirements and coastal permitting makes San Clemente one of the more complex ADU markets in Orange County — but the premium coastal lifestyle, strong rental demand ($2,500–$4,000/mo), and unique architectural character create significant property value upside for those who navigate the process correctly.',
    whyBuild: 'Premium coastal lifestyle with strong rental demand ($2,500–$4,000/mo). Unique Spanish Colonial architectural character adds lasting property value. Requires an experienced team for design review and coastal permitting, but the investment is well rewarded.',
    regulations: {
        setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. Conversions of existing structures are exempt from setback requirements.',
        height: '16 feet for single-story detached ADUs. Coastal view protection ordinances may further limit height and massing on certain properties.',
        parking: 'One parking space per ADU required. Exemptions available for properties within 0.5 miles of transit, garage conversions, and other state-mandated conditions.',
        lotSize: '5,000–8,000 sqft typical residential lots. Some lots range from 8,000–9,600+ sqft in hillside and coastal neighborhoods.',
        ownerOccupancy: 'No owner-occupancy requirement (permanent per AB 976).',
        additionalNotes: 'MANDATORY Spanish Colonial Revival design review for all new construction. Most of the city is within the Coastal Zone, requiring a Coastal Development Permit (CDP). Maximum ADU size is 1,200 sqft or 50% of the primary home\'s living area, whichever is less. View protection ordinances may limit height and massing. CC&Rs in certain neighborhoods may impose additional restrictions.',
    },
    permitting: {
        department: 'San Clemente Planning Services — 910 Calle Negocio',
        steps: [
            { title: 'Contact a planner FIRST', desc: 'Before any design work, contact San Clemente Planning Services at (949) 361-6197 or planning@san-clemente.org. You MUST speak with a planner to get guidance on Coastal Zone requirements, Spanish Colonial design standards, and any view protection issues specific to your property.' },
            { title: 'Design to Spanish Colonial standards', desc: 'Your ADU must conform to San Clemente\'s mandatory Spanish Colonial Revival architectural standards. This includes clay barrel tile roofing, smooth or sand-finish stucco, arched openings, wrought iron details, earth-tone color palettes, and recessed windows. Work with a designer who understands these requirements.' },
            { title: 'Prepare CDP application', desc: 'Most San Clemente properties require a Coastal Development Permit. Prepare your CDP application with environmental documentation, view analysis if applicable, and any required geotechnical reports for hillside properties.' },
            { title: 'Submit for design review & permits', desc: 'Submit your plans to Planning Services for Spanish Colonial design review and building permit plan check simultaneously. Include site plan, floor plans, elevations with material callouts, structural engineering, MEP, and Title 24.' },
            { title: 'Build to architectural standards', desc: 'Once approved, pull your permit and begin construction. All construction must match the approved Spanish Colonial design — inspectors will verify materials and finishes. Use clay tile, real stucco, and authentic architectural details.' },
            { title: 'Final inspection & occupancy', desc: 'Pass final inspection including design conformity review. Receive your Certificate of Occupancy. Your Spanish Colonial ADU enters San Clemente\'s premium coastal rental market — $2,500–$4,000/mo with the unique character that defines this city.' },
        ],
        fees: '$8,000–$18,000 total (plan check, building permit, CDP fees, design review, school fees). Impact fees waived for ADUs under 750 sqft. Premium materials increase construction costs but command higher rents.',
        timeline: '8–16 weeks total. Plan check 4–8 weeks. CDP adds 4–8+ weeks. Design review adds 2–4 weeks. Contact planner first to understand full timeline for your property.',
        contact: '(949) 361-6197 — San Clemente Planning Services — 910 Calle Negocio — planning@san-clemente.org — MUST contact planner first for Coastal Commission guidance',
        website: 'san-clemente.org/government/departments-divisions/community-development/planning',
    },
    costs: {
        constructionRange: '$275K–$425K',
        permitFees: '$8K–$18K',
        impactFees: 'Waived under 750 sqft',
        typicalSize: '600–1,200 sqft',
    },
    rental: {
        monthlyRange: '$2,500–$4,000/mo',
        demandDrivers: 'Premium coastal lifestyle, Camp Pendleton adjacent employment (military and civilian), Trestles and San Onofre surf culture, vibrant Del Mar Street and Avenida Del Mar downtown, Amtrak/Metrolink station connectivity, year-round mild weather, and strong family demand from top-rated Capistrano Unified schools.',
    },
    guide: [
        { title: 'Contact a planner FIRST', desc: 'This is non-negotiable in San Clemente. Call Planning Services at (949) 361-6197 before starting any design work. A planner will advise on your property\'s Coastal Zone status, view protection requirements, Spanish Colonial design standards, and any CC&R issues. This upfront conversation prevents costly mistakes.' },
        { title: 'Study Spanish Colonial requirements', desc: 'San Clemente\'s mandatory Spanish Colonial Revival design review is the defining characteristic of ADU construction here. Your ADU must feature clay barrel tile roofing, stucco exterior, arched details, earth-tone colors, wrought iron accents, and recessed windows. Study existing ADUs in your neighborhood for reference.' },
        { title: 'Hire a design-savvy team', desc: 'San Clemente requires expertise in both Spanish Colonial architecture and coastal permitting. Avorino understands the city\'s design standards and Coastal Zone requirements — we handle design, engineering, permitting, and construction so your ADU passes design review the first time.' },
        { title: 'Prepare for CDP process', desc: 'Most of San Clemente is in the Coastal Zone. Your CDP application needs environmental documentation and may require view analysis. On hillside lots, geotechnical reports are often mandatory. Budget 4–8+ weeks for CDP review on top of standard plan check.' },
        { title: 'Build with authentic materials', desc: 'San Clemente inspectors verify that construction matches approved Spanish Colonial design. Use genuine clay barrel tiles (not concrete substitutes), quality stucco application, real wrought iron details, and appropriate color palettes. Cutting corners on materials will fail inspection.' },
        { title: 'Capitalize on the character', desc: 'After final inspection, your Spanish Colonial ADU enters a market that values architectural authenticity. The unique "Spanish Village" character of San Clemente drives premium rents and property values. Expect $2,500–$4,000/mo — with properties near the pier and downtown commanding the highest rates.' },
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
    logDetail('Starting San Clemente ADU page build...', 'info');
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
