// ════════════════════════════════════════════════════════════════
// Avorino Builder — WESTMINSTER ADU PAGE
// Rename this to index.ts to build the Westminster ADU page.
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
    slug: 'adu-westminster',
    city: 'Westminster',
    title: 'ADU Construction in Westminster — Avorino',
    seoDesc: 'Build a permitted ADU in Westminster, CA. Home to Little Saigon, strong multigenerational housing demand, affordable construction costs, and excellent rental returns. Licensed OC contractor.',
    overview: 'Westminster is a culturally vibrant city of approximately 92,000 residents in central-west Orange County, best known as the home of Little Saigon — the largest Vietnamese-American community in the United States. The Bolsa Avenue commercial corridor is a nationally recognized cultural destination, drawing visitors from across Southern California for its restaurants, shops, and cultural events. Westminster\'s residential neighborhoods are predominantly single-family homes built in the 1960s–70s on lots typically ranging from 5,500–7,000 sqft, with flat topography ideal for ADU construction. The city\'s strong multigenerational family culture creates exceptional demand for ADUs as in-law suites and family housing — a demand pattern that exists alongside traditional rental demand. Westminster is served by the Westminster School District, Ocean View School District, and Huntington Beach Union High School District. The 405 and 22 freeways provide commute access to Huntington Beach, Costa Mesa, Irvine, and the broader OC/LA metro area. Westminster Mall and the Bella Terra shopping center anchor the city\'s retail offerings.',
    whyBuild: 'Little Saigon\'s multigenerational family culture drives exceptional ADU demand for in-law suites and family housing, affordable construction costs maximize ROI, strong traditional rental demand from a diverse workforce, and central OC location with good freeway access to multiple employment centers.',
    regulations: {
        setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. No setback required for conversions of existing structures.',
        height: '16 feet for single-story detached ADUs. Up to 18 feet with roof pitch allowance. Two-story ADUs may reach 25 feet in qualifying zones under AB 1332.',
        parking: 'No additional parking required if within 0.5 miles of public transit. OCTA bus routes on Bolsa Avenue, Brookhurst Street, and Westminster Avenue qualify many properties for parking exemptions.',
        lotSize: '5,500–7,000 sqft typical in established Westminster neighborhoods. No minimum lot size required by state law.',
        ownerOccupancy: 'No owner-occupancy requirement (permanent per AB 976, effective 2025).',
        additionalNotes: 'Westminster processes ADU applications ministerially per state law. ADUs under 750 sqft are exempt from impact fees. The city actively supports ADU construction as part of its housing element and multigenerational housing goals.',
    },
    permitting: {
        department: 'City of Westminster Community Development Department',
        steps: [
            { title: 'Verify zoning & lot dimensions', desc: 'Confirm your property is zoned residential using the city\'s zoning map. Most single-family zones in Westminster allow ADUs by right. Measure your lot — typical lots of 5,500–7,000 sqft with flat topography can accommodate a 600–800 sqft detached ADU.' },
            { title: 'Pre-application consultation', desc: 'Contact the Community Development Department at (714) 898-3311, ext. 262, for a pre-application consultation. Staff can confirm ADU eligibility and identify any site-specific requirements for your property.' },
            { title: 'Submit complete plans', desc: 'Submit architectural and engineering plans to Community Development. Include site plan, floor plans, elevations, structural calculations, Title 24 energy compliance, and MEP plans. Westminster processes ADU applications ministerially — no public hearing required.' },
            { title: 'Plan check review', desc: 'Plan check typically takes 4–6 weeks. The city must process compliant ADU applications within 60 days per state law. Address any corrections and resubmit promptly.' },
            { title: 'Pull permit & construct', desc: 'Pay fees and pull your building permit. Begin construction with a licensed contractor. Westminster\'s flat lots and consistent infrastructure make construction straightforward and efficient.' },
            { title: 'Final inspection & occupancy', desc: 'Pass final inspection and receive your Certificate of Occupancy. Your ADU is legally habitable and can serve as a rental unit, in-law suite, or multigenerational family housing.' },
        ],
        fees: '$3,500–$9,000 total (plan check, building permit, school fees). Impact fees waived for ADUs under 750 sqft.',
        timeline: '4–6 weeks plan check. 60-day maximum for compliant applications per state mandate.',
        contact: '(714) 898-3311, ext. 262 — Westminster Community Development',
        website: 'westminster-ca.gov/departments/community-development',
    },
    costs: {
        constructionRange: '$210K–$360K',
        permitFees: '$3.5K–$9K',
        impactFees: 'Waived under 750 sqft',
        typicalSize: '600–1,000 sqft',
    },
    rental: {
        monthlyRange: '$2,100–$3,300/mo',
        demandDrivers: 'Multigenerational Vietnamese-American families seeking in-law suites and family housing (the largest single demand driver in Westminster), Little Saigon corridor workers and small business owners, commuters to Huntington Beach, Costa Mesa, and Irvine, healthcare workers at nearby hospitals, and families seeking affordable Orange County housing.',
    },
    guide: [
        { title: 'Evaluate your lot', desc: 'Westminster\'s 1960s–70s homes sit on flat lots of 5,500–7,000 sqft. Measure your buildable area accounting for 4-foot setbacks. Most lots can accommodate a 600–800 sqft detached ADU. The flat topography keeps foundation and grading costs low.' },
        { title: 'Consider multigenerational design', desc: 'Westminster\'s strong multigenerational family culture means many ADUs here are built for aging parents, adult children, or extended family. If building for family use, consider design features like step-free entries, wider doorways, and a kitchen layout suited to multi-course cooking. Even if you plan to rent, these features appeal to Westminster\'s family-oriented rental market.' },
        { title: 'Choose your ADU type', desc: 'Detached backyard ADUs are the most popular choice in Westminster. Garage conversions are the most cost-effective option, starting around $90K–$140K. For multigenerational use, a detached unit with a private entrance and small patio area maximizes both privacy and family connection.' },
        { title: 'Submit to Community Development', desc: 'File plans with the City of Westminster Community Development Department. ADU applications are processed ministerially within 60 days — no public hearing or discretionary review required.' },
        { title: 'Build with Avorino', desc: 'Avorino provides full-service ADU construction — design, engineering, permitting, and building. We understand Westminster\'s community character and multigenerational housing needs, and design ADUs that serve both family use and rental purposes.' },
        { title: 'Serve family or generate income', desc: 'Westminster ADUs serve dual purposes exceptionally well. As family housing, they provide privacy and independence for multigenerational living. As rentals, they command $2,100–$3,300/mo in a market with strong demand from families and workers throughout central-west OC.' },
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
    logDetail('Starting Westminster ADU page build...', 'info');
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
