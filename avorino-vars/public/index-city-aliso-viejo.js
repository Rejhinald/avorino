// ════════════════════════════════════════════════════════════════
// Avorino Builder — ALISO VIEJO ADU PAGE
// Rename this to index.ts to build the Aliso Viejo ADU page.
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, createAllVariables, buildCityPage, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
const HEAD_CODE = [
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@dc7bed3/avorino-responsive.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@dc7bed3/avorino-nav-footer.css">',
    CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
    '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@dc7bed3/avorino-animations.js"><\/script>',
    CALENDLY_JS,
].join('\n');
const CITY_DATA = {
    slug: 'adu-aliso-viejo',
    city: 'Aliso Viejo',
    title: 'ADU Construction in Aliso Viejo — Avorino',
    seoDesc: 'Build a permitted ADU in Aliso Viejo, CA. One of California\'s newest cities with modern infrastructure. Detached, attached, and garage conversions. Licensed Orange County contractor.',
    overview: 'Aliso Viejo is one of California\'s newest incorporated cities, having become a municipality in 2001 after decades as a master-planned community developed by Mission Viejo Company. With approximately 51,000 residents, the city is characterized by its meticulously planned layout featuring newer infrastructure, underground utilities, and well-maintained common areas. The Aliso Viejo Town Center anchors the commercial district with restaurants, retail, and a movie theater, while Pacific Park — a 14-acre community sports complex — provides recreation for families. The city\'s housing stock was built primarily in the 1980s and 1990s, meaning electrical panels, sewer lines, and water mains are relatively modern compared to older Orange County cities — a significant advantage when connecting ADU utilities. Aliso Viejo sits along the Aliso Creek corridor with quick access to the SR-73 toll road and I-5 freeway, placing residents within 15 minutes of Laguna Beach, 10 minutes of Irvine Spectrum, and 20 minutes of John Wayne Airport. Major employers include Quest Software (now Dell), UST Global, and the retail and dining establishments along Town Center Drive.',
    whyBuild: 'Newer infrastructure from the 1980s–90s makes utility hookups simpler and more affordable, strong rental demand from young professionals and tech workers, proximity to Laguna Beach and Irvine Spectrum, planned community amenities that attract quality tenants, and smaller lot sizes that still accommodate well-designed compact ADUs.',
    regulations: {
        setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. Conversions of existing structures (garages, bonus rooms) are exempt from setback requirements.',
        height: 'Up to 16 feet for single-story detached ADUs. Up to 25 feet for two-story ADUs per state law (AB 1332) in qualifying residential zones.',
        parking: 'One parking space per ADU may be required. Exempt if within 0.5 miles of public transit (OCTA bus routes along Aliso Creek Road and Pacific Park Drive), within one block of a car-share vehicle, or if the ADU is a conversion of existing space.',
        lotSize: '4,000–6,000 sqft typical residential lots — smaller than many south OC cities due to the planned community layout. Some detached single-family areas along Glenwood Drive and Canyon Wren reach 6,000–7,000 sqft. No minimum lot size required by state law to build an ADU.',
        ownerOccupancy: 'No owner-occupancy requirement for ADUs (made permanent by AB 976 in 2025).',
        additionalNotes: 'ADUs under 750 sqft are exempt from impact fees. Many Aliso Viejo neighborhoods have active HOAs managed by the Aliso Viejo Community Association — while HOAs may require architectural review, they cannot prohibit, unreasonably restrict, or effectively block ADU construction under California law (AB 1033). The city\'s newer infrastructure means utility connection costs are typically lower than in older OC cities.',
    },
    permitting: {
        department: 'City of Aliso Viejo Community Development Department',
        steps: [
            { title: 'Verify zoning & HOA requirements', desc: 'Confirm your property\'s zoning on the city\'s GIS map. Most single-family residential zones allow ADUs by right. Contact the Aliso Viejo Community Association or your sub-HOA to request ADU architectural guidelines — they can require design review but cannot deny a compliant ADU.' },
            { title: 'Design your ADU', desc: 'Create architectural plans including site plan, floor plan, elevations, structural, mechanical, electrical, and plumbing. Aliso Viejo\'s smaller lots (4,000–6,000 sqft) call for efficient designs — consider a compact 500–750 sqft studio or 1-bed unit that maximizes usable outdoor space. Two-story designs can increase square footage without consuming limited yard area.' },
            { title: 'Submit plans to Community Development', desc: 'Submit your complete plan set to the Community Development Department. Include Title 24 energy compliance documentation. Aliso Viejo processes ADU applications ministerially — no public hearing or discretionary review is required.' },
            { title: 'Plan check review (60-day)', desc: 'The city reviews plans for compliance with building codes and ADU regulations. State law mandates a 60-day maximum review period for compliant ADU applications. If your HOA requires concurrent review, submit to both simultaneously to avoid delays.' },
            { title: 'Build & inspect', desc: 'Once permitted, begin construction with your licensed contractor. Schedule required inspections at each milestone — foundation, framing, rough mechanical/electrical/plumbing, insulation, and final. Aliso Viejo\'s newer infrastructure means utility connections (sewer, water, electrical) are typically straightforward with fewer surprises than older cities.' },
            { title: 'Final inspection & occupancy', desc: 'Request final inspection from the Building Division. Once passed, receive your Certificate of Occupancy. Your ADU is now legal to rent or occupy.' },
        ],
        fees: '$5,000–$12,000 total (plan check, building permit, school fees). Impact fees waived for ADUs under 750 sqft.',
        timeline: '4–8 weeks for plan check. 60-day maximum review required by state law.',
        contact: '(949) 425-2515 — City of Aliso Viejo Community Development',
        website: 'cityofalisoviejo.com/community-development',
    },
    costs: {
        constructionRange: '$250K–$400K',
        permitFees: '$5K–$12K',
        impactFees: 'Waived under 750 sqft',
        typicalSize: '500–900 sqft',
    },
    rental: {
        monthlyRange: '$2,300–$3,800/mo',
        demandDrivers: 'Tech workers at Quest Software/Dell and UST Global, young professionals seeking proximity to both Laguna Beach lifestyle and Irvine Spectrum employment, Soka University of America students and faculty, families drawn to Aliso Viejo\'s parks and community amenities, and remote workers who value the Town Center walkability and SR-73 access for occasional office commutes.',
    },
    guide: [
        { title: 'Check your lot size & maximize compact design', desc: 'Use the City of Aliso Viejo GIS map to verify your parcel\'s zoning and exact dimensions. Aliso Viejo lots are typically 4,000–6,000 sqft — smaller than many south OC cities. Measure your available backyard space carefully, accounting for 4-foot setbacks. A compact 500–750 sqft ADU is often the sweet spot for these lots, keeping construction costs under control while still commanding strong rent.' },
        { title: 'Consider two-story to preserve yard space', desc: 'On Aliso Viejo\'s smaller lots, a two-story ADU design (allowed up to 25 feet under state law) can deliver 800–900 sqft of living space with a ground-floor footprint of only 400–450 sqft. This preserves usable outdoor space for both the primary home and the ADU — a significant selling point for tenants and a key consideration for HOA architectural review.' },
        { title: 'Leverage newer infrastructure', desc: 'Aliso Viejo was built in the 1980s–90s with modern sewer mains, water lines, electrical panels, and underground utilities. Unlike older OC cities where aging infrastructure can require expensive upgrades before ADU connection, Aliso Viejo properties typically need only standard utility tie-ins. This can save $5K–$15K compared to cities with 1950s–60s infrastructure. Confirm your existing electrical panel capacity (200A recommended) and sewer lateral condition.' },
        { title: 'Submit to Community Development', desc: 'File your complete architectural plans with the City of Aliso Viejo Community Development Department. Include structural engineering, Title 24 energy calculations, and your HOA approval letter (if applicable). Pay plan check fees at submission. The city processes ADU applications ministerially within 60 days.' },
        { title: 'Build with a licensed contractor', desc: 'Work with a California-licensed contractor (General-B). Avorino handles design, engineering, permitting, and construction as a single point of contact. Construction typically takes 5–7 months. On Aliso Viejo\'s compact lots, careful staging and material scheduling are essential — coordinate with your HOA on construction hours, staging areas, and contractor parking to maintain good neighbor relations.' },
        { title: 'Rent or occupy', desc: 'With your Certificate of Occupancy in hand, your ADU is ready. Aliso Viejo\'s planned community amenities, Town Center walkability, and quick access to Laguna Beach and Irvine Spectrum support rental rates of $2,300–$3,800/mo. Compact studio and 1-bed units rent fastest, especially targeting tech professionals, Soka University affiliates, and young couples who value the community\'s modern infrastructure and south county location.' },
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
    logDetail('Starting Aliso Viejo ADU page build...', 'info');
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
