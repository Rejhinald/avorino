// ════════════════════════════════════════════════════════════════
// Avorino Builder — COTO DE CAZA ADU PAGE
// Rename this to index.ts to build the Coto De Caza ADU page.
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, createAllVariables, buildCityPage, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
const HEAD_CODE = [
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@ecf44ad/avorino-responsive.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@ecf44ad/avorino-nav-footer.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@ecf44ad/avorino-adu.css">',
    CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
    '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@ecf44ad/avorino-animations.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@ecf44ad/avorino-city-adu-footer.js"><\/script>',
    CALENDLY_JS,
].join('\n');
const CITY_DATA = {
    slug: 'adu-coto-de-caza',
    city: 'Coto De Caza',
    title: 'ADU Construction in Coto De Caza — Avorino',
    seoDesc: 'Build a permitted ADU in Coto De Caza, CA. Large estate lots, gated community expertise, and premium rental income. Licensed Orange County ADU contractor.',
    overview: 'Coto De Caza is one of the largest gated communities in the United States, an unincorporated master-planned community in the foothills of the Santa Ana Mountains with a population of approximately 15,000. The community is known for its expansive estate lots — many exceeding 10,000 sqft and some over an acre — equestrian trails, and resort-style amenities including pools, tennis courts, and the Coto De Caza Golf & Racquet Club. Because Coto De Caza is unincorporated, ADU permitting falls under the County of Orange rather than a city jurisdiction. The large lot sizes make Coto De Caza one of the most ADU-friendly communities in Orange County from a buildability standpoint. However, the community\'s active HOA (the Coto De Caza Homeowners Association) requires architectural review, though California state law (AB 1033) prevents HOAs from prohibiting ADUs.',
    whyBuild: 'Estate-sized lots provide ample room for large detached ADUs, premium rental demand from professionals and families seeking the gated community lifestyle, and strong ROI driven by south Orange County\'s limited housing supply.',
    regulations: {
        setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. Given Coto De Caza\'s generous lot sizes, setbacks are rarely a constraint.',
        height: '16 feet for single-story detached ADUs. Up to 18 feet with roof pitch allowance. Two-story ADUs may reach 25 feet in qualifying zones under AB 1332.',
        parking: 'No additional parking required for ADUs in most cases. Garage conversions and properties near transit are exempt. Most Coto De Caza properties have ample existing parking.',
        lotSize: '10,000 sqft to 1+ acre typical for Coto De Caza estate lots. Among the largest residential lots in Orange County.',
        ownerOccupancy: 'No owner-occupancy requirement (permanent per AB 976, effective 2025).',
        additionalNotes: 'As an unincorporated community, permitting is handled by the County of Orange. The Coto De Caza HOA requires architectural review — designs must complement the community\'s upscale aesthetic. ADUs under 750 sqft are exempt from impact fees. Equestrian properties may have additional setback considerations for stable structures.',
    },
    permitting: {
        department: 'County of Orange — OC Development Services / Building & Safety',
        steps: [
            { title: 'Review HOA architectural guidelines', desc: 'Contact the Coto De Caza Homeowners Association to obtain their architectural review guidelines. While the HOA cannot prohibit your ADU, they may regulate design elements like materials, colors, and roof style. Submit early to run HOA review in parallel with county permitting.' },
            { title: 'County pre-application consult', desc: 'Schedule a pre-application consultation with OC Development Services. Bring your APN, property survey, and preliminary site plan. County staff will confirm zoning, setback requirements, and any site-specific conditions for your parcel.' },
            { title: 'Submit plans to OC Development Services', desc: 'Submit complete architectural and engineering plans to the County of Orange. Include site plan, floor plans, elevations, structural calculations, Title 24 energy compliance, and MEP plans. The county processes ADU applications ministerially within 60 days.' },
            { title: 'Plan check & corrections', desc: 'County plan check typically takes 4–8 weeks. Address any corrections and resubmit. Concurrent HOA review can prevent delays — submit architectural review to the HOA at the same time as county plan check.' },
            { title: 'Pull permit & construct', desc: 'Pay fees and pull your building permit from the county. Begin construction with a licensed contractor. Coto De Caza\'s large lots allow for efficient staging and construction access. Schedule inspections at each phase.' },
            { title: 'Final inspection & occupancy', desc: 'Pass final county inspection and receive your Certificate of Occupancy. Your ADU is now legally habitable. Coto De Caza\'s prestige and gated security command premium rental rates in south Orange County.' },
        ],
        fees: '$5,000–$14,000 total (county plan check, building permit, school fees, utility connections). Impact fees waived for ADUs under 750 sqft.',
        timeline: '4–8 weeks county plan check. 60-day maximum for complete applications per state mandate. HOA review adds 2–4 weeks if not run concurrently.',
        contact: '(714) 667-8888 — OC Development Services',
        website: 'ocpublicworks.com/building',
    },
    costs: {
        constructionRange: '$300K–$475K',
        permitFees: '$5K–$14K',
        impactFees: 'Waived under 750 sqft',
        typicalSize: '800–1,200 sqft',
    },
    rental: {
        monthlyRange: '$3,200–$5,000/mo',
        demandDrivers: 'Gated community prestige attracting executives and professionals, proximity to employment in Irvine and Laguna Niguel, Capistrano Unified School District enrollment demand, equestrian lifestyle seekers, and limited rental housing within Coto De Caza itself creating high demand for any available units.',
    },
    guide: [
        { title: 'Engage the HOA early', desc: 'The Coto De Caza Homeowners Association requires architectural review for all new construction. Request their ADU design guidelines before you begin designing — matching the community\'s upscale aesthetic from the start prevents costly redesigns. Remember: state law protects your right to build an ADU, but HOA design standards apply.' },
        { title: 'Leverage your large lot', desc: 'Coto De Caza\'s estate lots are among the largest in Orange County. Most properties can accommodate an 800–1,200 sqft detached ADU with room to spare. Consider placement that maximizes privacy for both the primary home and the ADU — rear or side lot positions with separate access work best.' },
        { title: 'Design for the community aesthetic', desc: 'Coto De Caza has a distinct upscale character — Mediterranean, Spanish Colonial, and Tuscan architectural styles predominate. Match your ADU\'s roof tiles, stucco finish, window style, and color palette to the primary residence and neighborhood. Premium finishes accelerate HOA approval and justify top rental rates.' },
        { title: 'Submit to County of Orange', desc: 'Since Coto De Caza is unincorporated, your building permit comes from the County of Orange, not a city. Submit plans to OC Development Services. Run your county plan check and HOA architectural review simultaneously to save 2–4 weeks.' },
        { title: 'Build with a licensed contractor', desc: 'Avorino handles the full process — design, engineering, HOA coordination, county permitting, and construction. Large lot access in Coto De Caza makes construction logistics smoother than in dense urban areas, often reducing build time.' },
        { title: 'Rent at premium rates', desc: 'Coto De Caza\'s gated community status, top-rated schools, and resort amenities justify rental rates of $3,200–$5,000/mo. Target executives commuting to Irvine, medical professionals at nearby hospitals, and families seeking Capistrano Unified School District enrollment.' },
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
    logDetail('Starting Coto De Caza ADU page build...', 'info');
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
