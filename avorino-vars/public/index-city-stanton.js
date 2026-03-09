// ════════════════════════════════════════════════════════════════
// Avorino Builder — STANTON ADU PAGE
// Rename this to index.ts to build the Stanton ADU page.
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, createAllVariables, buildCityPage, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
const HEAD_CODE = [
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@6141837/avorino-responsive.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@6141837/avorino-nav-footer.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@6141837/avorino-adu.css">',
    CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
    '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@6141837/avorino-animations.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@6141837/avorino-city-adu-footer.js"><\/script>',
    CALENDLY_JS,
].join('\n');
const CITY_DATA = {
    slug: 'adu-stanton',
    city: 'Stanton',
    title: 'ADU Construction in Stanton — Avorino',
    seoDesc: 'Build a permitted ADU in Stanton, CA. Most affordable city in Orange County for ADU construction, high rental demand, and excellent ROI potential. Licensed OC ADU contractor.',
    overview: 'Stanton is a compact city of approximately 39,000 residents in central-west Orange County, covering just 3.1 square miles between Cypress, Garden Grove, Anaheim, and Buena Park. As one of the most affordable cities in Orange County, Stanton offers the best ADU return on investment in the region — lower land values and construction costs combine with competitive rental rates to deliver exceptional ROI. The city\'s residential neighborhoods feature a mix of post-war homes from the 1950s–60s on lots typically ranging from 5,000–6,500 sqft. Beach Boulevard (Highway 39) runs through the city, providing commercial services and OCTA transit connections. Stanton is served by the Magnolia School District at the elementary level and the Anaheim Union High School District for secondary education. The city\'s central location provides freeway access via the 5 and 22 freeways, connecting residents to Anaheim, Garden Grove, Huntington Beach, and the broader OC/LA metro area. Stanton\'s diverse, working-class community has strong demand for affordable rental housing.',
    whyBuild: 'Lowest construction entry point in Orange County for maximum ROI, strong rental demand from working families and professionals priced out of surrounding cities, central OC location with good freeway and transit access, and the city\'s compact size means your ADU is always close to services and employment.',
    regulations: {
        setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. No setback required for conversions of existing structures.',
        height: '16 feet for single-story detached ADUs. Up to 18 feet with roof pitch allowance. Two-story ADUs may reach 25 feet in qualifying zones under AB 1332.',
        parking: 'No additional parking required if within 0.5 miles of public transit. OCTA bus routes on Beach Boulevard, Katella Avenue, and Cerritos Avenue qualify many Stanton properties for parking exemptions.',
        lotSize: '5,000–6,500 sqft typical in Stanton neighborhoods. No minimum lot size required by state law.',
        ownerOccupancy: 'No owner-occupancy requirement (permanent per AB 976, effective 2025).',
        additionalNotes: 'Stanton processes ADU applications ministerially per state law. ADUs under 750 sqft are exempt from impact fees. The city has been supportive of ADU development as part of its housing element goals.',
    },
    permitting: {
        department: 'City of Stanton Community Development Department',
        steps: [
            { title: 'Verify zoning & lot dimensions', desc: 'Confirm your property is zoned residential using the city\'s zoning map. Stanton lots typically range from 5,000–6,500 sqft. Measure your buildable area accounting for 4-foot setbacks.' },
            { title: 'Pre-application consultation', desc: 'Contact the Community Development Department at (714) 890-4245 for an initial consultation. Staff can identify site-specific considerations and confirm ADU eligibility for your property.' },
            { title: 'Submit complete plans', desc: 'Submit architectural and engineering plans including site plan, floor plans, elevations, structural calculations, Title 24 energy compliance, and MEP drawings. Stanton processes ADU applications ministerially — no public hearing required.' },
            { title: 'Plan check review', desc: 'Plan check typically takes 4–6 weeks. The city must process compliant ADU applications within 60 days per state law. Address any corrections promptly.' },
            { title: 'Pull permit & construct', desc: 'Pay fees and pull your building permit. Begin construction with a licensed contractor. Stanton\'s flat lots and established infrastructure make construction straightforward.' },
            { title: 'Final inspection & occupancy', desc: 'Pass final inspection and receive your Certificate of Occupancy. Your ADU is legally habitable and ready for tenants in one of OC\'s highest-demand rental markets.' },
        ],
        fees: '$3,000–$8,000 total (plan check, building permit, school fees). Impact fees waived for ADUs under 750 sqft. Among the lowest permit fee structures in Orange County.',
        timeline: '4–6 weeks plan check. 60-day maximum for compliant applications per state mandate.',
        contact: '(714) 890-4245 — Stanton Community Development',
        website: 'ci.stanton.ca.us/departments/community-development',
    },
    costs: {
        constructionRange: '$180K–$320K',
        permitFees: '$3K–$8K',
        impactFees: 'Waived under 750 sqft',
        typicalSize: '500–850 sqft',
    },
    rental: {
        monthlyRange: '$1,800–$2,800/mo',
        demandDrivers: 'Working families seeking affordable Orange County housing, Knott\'s Berry Farm and Beach Boulevard corridor workers, commuters to Anaheim and Garden Grove employment centers, healthcare workers at nearby West Anaheim Medical Center, and young professionals drawn to Stanton\'s affordable rents and central OC location.',
    },
    guide: [
        { title: 'Evaluate your lot', desc: 'Stanton lots typically range from 5,000–6,500 sqft. While smaller than some OC cities, most lots can accommodate a 500–750 sqft detached ADU with proper planning. Garage conversions are particularly effective in Stanton, offering the lowest-cost path to rental income.' },
        { title: 'Maximize ROI with smart design', desc: 'Stanton offers the best ADU ROI in Orange County — lower construction costs with competitive rents. A well-designed one-bedroom unit at 500–650 sqft keeps costs low while commanding $1,800–$2,400/mo. Focus on efficient floor plans and durable finishes that minimize maintenance.' },
        { title: 'Choose cost-effective construction', desc: 'Garage conversions in Stanton can start as low as $80K–$130K, making them the most accessible entry point. Detached ADUs at $180K–$320K offer higher rental rates. Calculate your break-even timeline for each option to determine the best investment.' },
        { title: 'Submit to Community Development', desc: 'File plans with the City of Stanton Community Development Department. ADU applications are processed ministerially within 60 days. Stanton\'s streamlined process and lower fees keep your upfront costs manageable.' },
        { title: 'Build with Avorino', desc: 'Avorino provides full-service ADU construction at competitive pricing. Our experience in central-west Orange County means we understand Stanton\'s building department and can deliver a quality ADU on budget.' },
        { title: 'Achieve the best ROI in OC', desc: 'Stanton\'s combination of low construction costs and solid rental demand ($1,800–$2,800/mo) creates the fastest payback period in Orange County. A $200K investment generating $2,200/mo in rent delivers outstanding returns that outperform most OC cities.' },
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
    logDetail('Starting Stanton ADU page build...', 'info');
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
