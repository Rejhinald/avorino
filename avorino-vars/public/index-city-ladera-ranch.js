// ════════════════════════════════════════════════════════════════
// Avorino Builder — LADERA RANCH ADU PAGE
// Rename this to index.ts to build the Ladera Ranch ADU page.
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, createAllVariables, buildCityPage, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
const HEAD_CODE = [
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@a6d6a3e/avorino-responsive.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@a6d6a3e/avorino-nav-footer.css">',
    CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
    '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@a6d6a3e/avorino-animations.js"><\/script>',
    CALENDLY_JS,
].join('\n');
const CITY_DATA = {
    slug: 'adu-ladera-ranch',
    city: 'Ladera Ranch',
    title: 'ADU Construction in Ladera Ranch — Avorino',
    seoDesc: 'Build a permitted ADU in Ladera Ranch, CA. Unincorporated Orange County community — permits through the County. HOA architectural review required. Licensed OC contractor.',
    overview: 'Ladera Ranch is an unincorporated master-planned community in south Orange County, developed between 1999 and 2010 by a consortium led by Rancho Mission Viejo. With approximately 25,000 residents, the community is known for its extensive family amenities — including 17 parks, 20+ pools, miles of walking trails, a skate park, a water park, and community centers — that rival those of incorporated cities many times its size. Because Ladera Ranch is unincorporated, all land use and building permits are handled by the County of Orange, not a city government. Lots typically range from 4,000 to 7,000 sqft, and virtually every neighborhood is governed by a homeowners association with active architectural review committees. The community sits along Antonio Parkway with direct access to the 241 toll road and proximity to I-5, placing residents within commuting distance of Irvine, Mission Viejo, and San Juan Capistrano employment centers.',
    whyBuild: 'Newer construction on well-maintained lots in a premium master-planned community, strong family rental demand driven by top-rated Capistrano Unified schools and exceptional community amenities, and the ability to add rental income or multigenerational living space to properties that have appreciated significantly since initial development.',
    regulations: {
        setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. Conversions of existing structures are exempt from setback requirements.',
        height: 'Up to 16 feet for single-story detached ADUs. Up to 25 feet for two-story ADUs per state law (AB 1332) in qualifying residential zones.',
        parking: 'One parking space per ADU may be required. Exempt if within 0.5 miles of public transit, within one block of a car-share vehicle, or if the ADU is a conversion of existing space.',
        lotSize: '4,000–7,000 sqft typical residential lots. Newer phases may have smaller lots (3,500–4,500 sqft). No minimum lot size required by state law to build an ADU.',
        ownerOccupancy: 'No owner-occupancy requirement for ADUs (made permanent by AB 976 in 2025).',
        additionalNotes: 'Ladera Ranch is UNINCORPORATED — permits go through the County of Orange, not a city. HOA architectural review is required in virtually all neighborhoods. While HOAs cannot prohibit ADUs under state law (AB 1033), they enforce design standards for exterior materials, colors, fencing, and landscaping. ADUs under 750 sqft are exempt from impact fees.',
    },
    permitting: {
        department: 'County of Orange Planning & Development Services (OC Development Services)',
        steps: [
            { title: 'Confirm County jurisdiction', desc: 'Ladera Ranch is unincorporated Orange County. Your permits, plan checks, and inspections are all handled by the County of Orange — not a city building department. Contact OC Development Services to begin the process.' },
            { title: 'Submit HOA architectural review', desc: 'Contact your Ladera Ranch HOA\'s architectural review committee (ARC) early. Provide preliminary plans showing exterior elevations, materials, colors, and landscaping. While HOAs cannot block ADUs under state law, securing ARC approval early prevents delays and redesigns.' },
            { title: 'Prepare architectural plans', desc: 'Create complete plans including site plan, floor plan, elevations, structural, mechanical, electrical, and plumbing. Design must complement Ladera Ranch\'s newer architectural styles — primarily Mediterranean, Tuscan, and California contemporary. Include Title 24 energy compliance.' },
            { title: 'Submit to OC Development Services', desc: 'Submit your complete plan set to the County of Orange Development Services. Include Title 24 documentation, HOA architectural approval (if obtained), and any required soils or drainage reports.' },
            { title: 'County plan check review', desc: 'The County reviews plans for compliance with California Building Code and ADU regulations. State law mandates a 60-day maximum review period for compliant ADU applications.' },
            { title: 'Permit, build & finalize', desc: 'Pull your building permit from the County, begin construction, and schedule County inspections at each milestone — foundation, framing, rough MEP, insulation, and final. Certificate of Occupancy issued by the County upon passing final inspection.' },
        ],
        fees: '$6,000–$14,000 total (County plan check, building permit, school fees). Impact fees waived for ADUs under 750 sqft.',
        timeline: '4–8 weeks for County plan check. 60-day maximum review required by state law.',
        contact: '(714) 667-8888 — County of Orange OC Development Services',
        website: 'ocds.ocpublicworks.com',
    },
    costs: {
        constructionRange: '$275K–$425K',
        permitFees: '$6K–$14K',
        impactFees: 'Waived under 750 sqft',
        typicalSize: '600–1,000 sqft',
    },
    rental: {
        monthlyRange: '$2,500–$4,000/mo',
        demandDrivers: 'Families relocating for top-rated Capistrano Unified schools (Oso Grande Elementary, Ladera Ranch Middle School), professionals commuting to Irvine and Mission Viejo, young families drawn to the community\'s exceptional amenities (pools, parks, trails, water park), and the premium that Ladera Ranch commands as one of south Orange County\'s most desirable neighborhoods.',
    },
    guide: [
        { title: 'Understand County permitting', desc: 'Ladera Ranch is unincorporated — there is no city hall. All building permits, plan checks, and inspections go through the County of Orange Development Services at (714) 667-8888. This is different from neighboring incorporated cities like Rancho Santa Margarita or Mission Viejo.' },
        { title: 'Engage your HOA architectural review early', desc: 'Every Ladera Ranch neighborhood has an active HOA with an architectural review committee. Submit preliminary ADU plans — including exterior elevations, material samples, and color selections — to your ARC before finalizing designs. State law (AB 1033) prevents HOAs from blocking ADUs, but working with your ARC avoids friction.' },
        { title: 'Maximize your compact lot', desc: 'Ladera Ranch lots (4,000–7,000 sqft) are smaller than some neighboring communities. Consider attached ADUs, garage conversions, or compact detached designs that maximize livable space within your buildable area. Two-story ADUs (up to 25 feet) can work well on tighter lots.' },
        { title: 'Match Ladera Ranch aesthetics', desc: 'The community was built with cohesive architectural themes — Mediterranean, Tuscan, and California contemporary. Your ADU should use complementary materials, roof tiles, stucco finishes, and color palettes. This satisfies HOA requirements and protects your property value in a community where curb appeal matters.' },
        { title: 'Build with a licensed contractor', desc: 'Work with a California-licensed contractor (General-B). Avorino handles design, engineering, HOA coordination, County permitting, and construction as a single point of contact — essential in a community where both County and HOA approvals are required.' },
        { title: 'Capitalize on premium rental rates', desc: 'Ladera Ranch commands some of the highest ADU rental rates in south OC at $2,500–$4,000/mo. Market your ADU to families seeking the community\'s schools and amenities, or professionals who want a turnkey living situation in a walkable, amenity-rich neighborhood.' },
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
    logDetail('Starting Ladera Ranch ADU page build...', 'info');
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
