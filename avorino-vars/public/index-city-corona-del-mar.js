// ════════════════════════════════════════════════════════════════
// Avorino Builder — CORONA DEL MAR ADU PAGE
// Rename this to index.ts to build the Corona Del Mar ADU page.
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
    slug: 'adu-corona-del-mar',
    city: 'Corona Del Mar',
    title: 'ADU Construction in Corona Del Mar — Avorino',
    seoDesc: 'Build a permitted ADU in Corona Del Mar, CA. Prestigious coastal village within Newport Beach, Coastal Zone expertise, ultra-premium rental market. Licensed OC ADU contractor.',
    overview: 'Corona Del Mar is an affluent coastal village within the City of Newport Beach, located on the bluffs overlooking the Pacific Ocean between the Newport Channel and Crystal Cove State Park. Known for its charming village center along East Coast Highway, world-class beaches (Corona Del Mar State Beach and Little Corona Beach), and multi-million-dollar homes, CdM is one of the most prestigious addresses in Orange County. ADU construction here falls under Newport Beach\'s jurisdiction and is subject to the city\'s ADU ordinance. Critically, most of Corona Del Mar is within the California Coastal Zone, requiring a Coastal Development Permit (CDP) for new construction. The village\'s compact lot sizes and high property values make ADU investment here a premium play — construction costs are higher, but rental rates are among the highest in Orange County. The community\'s walkable village center, proximity to Fashion Island, and Newport Beach\'s top-rated schools in the Newport-Mesa Unified School District make CdM exceptionally desirable for both residents and renters.',
    whyBuild: 'Ultra-premium rental rates driven by the coastal village lifestyle, one of OC\'s most prestigious addresses commands top dollar per square foot, walkable village center and world-class beaches attract high-quality tenants, and limited rental inventory in CdM ensures low vacancy rates.',
    regulations: {
        setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. Oceanfront and blufftop properties may have additional setback requirements. Properties near public access paths may require special considerations.',
        height: '16 feet for single-story detached ADUs. Up to 18 feet may be permitted near transit stops. Height restrictions in the Coastal Zone may vary by specific location.',
        parking: 'Parking requirements follow Newport Beach\'s ADU ordinance with standard state exemptions. Properties within 0.5 miles of transit are exempt. CdM\'s walkable village center provides transit accessibility for many properties.',
        lotSize: '5,000–7,500 sqft typical for CdM village lots. Some blufftop and hillside properties are larger. Buildable area may be constrained by coastal setbacks and view corridors.',
        ownerOccupancy: 'No owner-occupancy requirement (permanent per AB 976, effective 2025).',
        additionalNotes: 'Most of Corona Del Mar is within the Coastal Zone — a Coastal Development Permit (CDP) is required for nearly all new ADU construction. Newport Beach\'s ADU regulations and design standards apply. View corridor protections and public coastal access requirements may affect ADU placement. ADUs are limited to 850 sqft (studio/1-bedroom) or 1,000 sqft (2+ bedroom).',
    },
    permitting: {
        department: 'City of Newport Beach Community Development Department',
        steps: [
            { title: 'Confirm Coastal Zone status', desc: 'Virtually all of Corona Del Mar falls within the Coastal Zone. Contact Newport Beach Community Development at (949) 644-3200 to confirm your property\'s status. Coastal Zone properties require a Coastal Development Permit (CDP) — plan your timeline and budget accordingly.' },
            { title: 'Pre-application review', desc: 'Schedule a pre-application meeting with Newport Beach planning staff. CdM properties may have specific constraints including view corridors, public access requirements, and neighborhood-specific design guidelines. Understanding these early prevents costly redesigns.' },
            { title: 'Submit CDP & building plans', desc: 'Prepare and submit your Coastal Development Permit application alongside building plans. Include environmental documentation, view analysis (if applicable), and detailed architectural plans. Newport Beach coordinates CDP review with the California Coastal Commission for certain projects.' },
            { title: 'Plan check & coastal review', desc: 'Plan check takes 4–8 weeks for standard review. CDP review adds additional time. Newport Beach must process compliant ADU applications within 60 days per state law, though CDP timelines may extend beyond this for complex coastal projects.' },
            { title: 'Build with premium quality', desc: 'Corona Del Mar expects exceptional construction quality. Invest in premium materials, fixtures, and finishes that match the village\'s upscale character. CdM\'s compact lots require efficient construction staging — work with an experienced contractor who understands tight-site coastal construction.' },
            { title: 'Final inspection & occupancy', desc: 'Pass final inspection and receive your Certificate of Occupancy. Your ADU enters one of Orange County\'s most exclusive rental markets, where demand consistently exceeds supply.' },
        ],
        fees: '$12,000–$25,000+ total (plan check, building permit, CDP fees, school fees, utility connections). Impact fees waived for ADUs under 750 sqft.',
        timeline: '8–16 weeks total. Standard plan check 4–8 weeks. CDP adds 4–8+ weeks. Pre-application review recommended.',
        contact: '(949) 644-3200 — Newport Beach Community Development',
        website: 'newportbeachca.gov/government/departments/community-development',
    },
    costs: {
        constructionRange: '$350K–$525K',
        permitFees: '$12K–$25K+',
        impactFees: 'Waived under 750 sqft',
        typicalSize: '600–1,000 sqft',
    },
    rental: {
        monthlyRange: '$3,800–$5,500+/mo',
        demandDrivers: 'Executives and professionals working at Fashion Island and Newport Center offices, coastal lifestyle seekers willing to pay premium rents, Newport-Mesa Unified School District enrollment demand, seasonal and vacation rental potential (subject to Newport Beach short-term rental regulations), and proximity to UCI and Hoag Hospital employment.',
    },
    guide: [
        { title: 'Confirm Coastal Zone & CDP requirements', desc: 'This is step one for any Corona Del Mar ADU project. Nearly all CdM properties are in the Coastal Zone, requiring a Coastal Development Permit. Call Newport Beach Community Development at (949) 644-3200 to confirm your property\'s exact requirements, including any view corridor protections or coastal access considerations.' },
        { title: 'Assess your CdM lot', desc: 'Corona Del Mar lots typically range from 5,000–7,500 sqft. Measure your buildable area carefully — coastal setbacks, view corridors, and public access requirements may reduce the available footprint. A well-designed 850 sqft unit that maximizes livable space is often the best approach.' },
        { title: 'Design for the village aesthetic', desc: 'CdM has a distinct coastal village character — Mediterranean, Spanish Colonial, and beach cottage styles predominate. Your ADU must complement this aesthetic. Use premium materials: natural stone, quality wood siding, copper or bronze fixtures, and designer-grade finishes that reflect the neighborhood\'s luxury standard.' },
        { title: 'Navigate permitting with expertise', desc: 'Corona Del Mar ADU permitting involves Newport Beach\'s building department, Coastal Zone regulations, and potentially the California Coastal Commission. Avorino has deep experience navigating coastal permitting in Newport Beach — critical for avoiding delays and redesigns.' },
        { title: 'Build for the premium market', desc: 'Every finish detail matters in Corona Del Mar. High-end appliances, designer tile, custom cabinetry, and luxury fixtures translate directly to higher rents. A well-finished CdM ADU commands $3,800–$5,500+/mo — among the highest rates in Orange County.' },
        { title: 'Maximize your investment', desc: 'Despite higher construction and permitting costs, Corona Del Mar ADUs offer exceptional returns. Ultra-premium rents, near-zero vacancy rates, and significant property value appreciation make CdM one of the most rewarding ADU markets in Orange County.' },
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
    logDetail('Starting Corona Del Mar ADU page build...', 'info');
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
