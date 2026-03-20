// ════════════════════════════════════════════════════════════════
// Avorino Builder — LA HABRA ADU PAGE
// Rename this to index.ts to build the La Habra ADU page.
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
    slug: 'adu-la-habra',
    city: 'La Habra',
    title: 'ADU Construction in La Habra — Avorino',
    seoDesc: 'Build a permitted ADU in La Habra, CA. Affordable entry point to Orange County homeownership, strong rental demand, generous lot sizes. Licensed OC ADU contractor.',
    overview: 'La Habra is a diverse city of approximately 63,000 residents in the northernmost corner of Orange County, bordering La Habra Heights and the Los Angeles County line. The city offers one of the most affordable entry points to Orange County homeownership, with median home prices significantly below the county average. This affordability extends to construction costs, making ADU development particularly attractive from a return-on-investment standpoint. La Habra\'s residential neighborhoods feature a mix of post-war ranch homes from the 1950s–60s and newer developments, with lot sizes typically ranging from 5,500–7,500 sqft. The city is served by the Lowell Joint School District and La Habra City School District, with Sonora High School and La Habra High School drawing families to the area. La Habra Boulevard and Whittier Boulevard form the commercial spine, while the 57 and 90 freeways provide direct commute access to Fullerton, Anaheim, Brea, and downtown LA. The Westridge Golf Club and La Habra Community Center anchor the city\'s recreational offerings.',
    whyBuild: 'One of the most affordable cities in Orange County for ADU construction, generous lot sizes in established neighborhoods, strong rental demand from families and workers priced out of surrounding cities, and excellent freeway connectivity to north OC and LA job centers.',
    regulations: {
        setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. No setback required for conversions of existing legal structures.',
        height: '16 feet for single-story detached ADUs. Up to 18 feet with roof pitch allowance. Two-story ADUs may reach 25 feet in qualifying zones under AB 1332.',
        parking: 'No additional parking required if within 0.5 miles of public transit. OCTA bus routes along La Habra Boulevard and Whittier Boulevard qualify many properties for parking exemptions.',
        lotSize: '5,500–7,500 sqft typical in established La Habra neighborhoods. No minimum lot size required by state law.',
        ownerOccupancy: 'No owner-occupancy requirement (permanent per AB 976, effective 2025).',
        additionalNotes: 'La Habra processes ADU applications ministerially per state law. ADUs under 750 sqft are exempt from impact fees. The city\'s relatively affordable land and construction costs make ADU investment highly attractive for ROI.',
    },
    permitting: {
        department: 'City of La Habra Community & Economic Development Department',
        steps: [
            { title: 'Verify zoning & lot size', desc: 'Confirm your property\'s zoning using the city\'s zoning map. All single-family residential zones in La Habra allow ADUs by right. Measure your lot to plan placement — most La Habra lots at 5,500–7,500 sqft can accommodate a 600–800 sqft detached ADU.' },
            { title: 'Pre-application consultation', desc: 'Contact the Community & Economic Development Department for a pre-application consultation. Bring your property address and preliminary ADU concept. Staff can identify any site-specific considerations before you invest in full plans.' },
            { title: 'Submit complete plans', desc: 'Submit architectural and engineering plans including site plan, floor plans, elevations, structural calculations, Title 24 energy compliance, and MEP drawings. La Habra processes ADU applications ministerially — no public hearing required.' },
            { title: 'Plan check & corrections', desc: 'Plan check typically takes 4–6 weeks. The city must process compliant ADU applications within 60 days per state law. Address any corrections and resubmit promptly to stay on schedule.' },
            { title: 'Pull permit & construct', desc: 'Pay fees and pull your building permit. Begin construction with a licensed contractor. Schedule inspections at each phase: foundation, framing, rough MEP, insulation, and final.' },
            { title: 'Final inspection & occupancy', desc: 'Pass final inspection and receive your Certificate of Occupancy. Your ADU is legally habitable and ready to rent or occupy.' },
        ],
        fees: '$3,500–$9,000 total (plan check, building permit, school fees). Impact fees waived for ADUs under 750 sqft.',
        timeline: '4–6 weeks plan check. 60-day maximum for compliant applications per state mandate.',
        contact: '(562) 383-4100 — La Habra Community & Economic Development',
        website: 'lahabracity.com/departments/community-economic-development',
    },
    costs: {
        constructionRange: '$200K–$350K',
        permitFees: '$3.5K–$9K',
        impactFees: 'Waived under 750 sqft',
        typicalSize: '600–1,000 sqft',
    },
    rental: {
        monthlyRange: '$2,000–$3,200/mo',
        demandDrivers: 'Workers commuting to Fullerton, Anaheim, and Brea job centers, families seeking affordable Orange County housing, La Habra High School and Sonora High School enrollment demand, proximity to Cal State Fullerton, and healthcare workers at nearby PIH Health Whittier Hospital.',
    },
    guide: [
        { title: 'Evaluate your lot', desc: 'La Habra\'s established neighborhoods feature lots typically ranging from 5,500–7,500 sqft. Measure your backyard depth and width to plan ADU placement with 4-foot setbacks. Many post-war ranch homes have deep lots ideal for detached ADUs.' },
        { title: 'Choose the most cost-effective option', desc: 'La Habra\'s affordability makes it an excellent market for maximizing ADU ROI. Garage conversions are the most budget-friendly option starting around $100K–$150K. Detached ADUs offer the highest rental returns. Evaluate your property to determine which type delivers the best return.' },
        { title: 'Design for the neighborhood', desc: 'La Habra neighborhoods have a mix of architectural styles. Match your ADU\'s roofline and exterior materials to the primary residence. Simple, clean designs that complement the existing home are approved fastest and add the most property value.' },
        { title: 'Submit to Community Development', desc: 'File your complete plans with the City of La Habra Community & Economic Development Department. The city processes ADU applications ministerially — no public hearing or discretionary review required for compliant applications.' },
        { title: 'Build with Avorino', desc: 'Avorino provides full-service ADU construction — design, engineering, permitting, and building — as a single point of contact. Our experience in north Orange County ensures efficient navigation of La Habra\'s building department processes.' },
        { title: 'Maximize your rental income', desc: 'La Habra\'s lower construction costs combined with competitive rental rates ($2,000–$3,200/mo) create one of the best ROI profiles in Orange County. Target families, commuters, and workers priced out of nearby Brea, Fullerton, and Whittier.' },
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
    logDetail('Starting La Habra ADU page build...', 'info');
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
