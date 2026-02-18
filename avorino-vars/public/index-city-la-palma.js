// ════════════════════════════════════════════════════════════════
// Avorino Builder — LA PALMA ADU PAGE
// Rename this to index.ts to build the La Palma ADU page.
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, createAllVariables, buildCityPage, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
const HEAD_CODE = [
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@31d0290/avorino-responsive.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@31d0290/avorino-nav-footer.css">',
    CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
    '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@31d0290/avorino-animations.js"><\/script>',
    CALENDLY_JS,
].join('\n');
const CITY_DATA = {
    slug: 'adu-la-palma',
    city: 'La Palma',
    title: 'ADU Construction in La Palma — Avorino',
    seoDesc: 'Build a permitted ADU in La Palma, CA. Small-city charm with well-maintained neighborhoods. Licensed Orange County contractor serving this quiet residential community.',
    overview: 'La Palma is one of Orange County\'s smallest and most tightly knit communities — just 1.8 square miles with approximately 15,000 residents. Despite its compact size, the city maintains an exceptional quality of life with well-kept neighborhoods, Central Park as the community\'s green heart, the La Palma Community Center, and a strong volunteer-driven civic culture. The residential character is predominantly single-family homes built in the 1960s and 1970s on lots typically ranging from 5,000 to 7,000 sqft. La Palma\'s location in northwest Orange County provides convenient access to the 5 and 91 freeways, placing residents within a short commute of Anaheim, Buena Park, and Cerritos employment centers. The city\'s quiet streets, low crime rates, and community-oriented atmosphere make it a hidden gem for families seeking an affordable OC foothold.',
    whyBuild: 'Affordable entry into a well-maintained OC community with strong neighborhood character, low crime rates and family-friendly atmosphere driving steady rental demand, proximity to major freeways and employment centers, and a straightforward city permitting process suited to the small-city scale.',
    regulations: {
        setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. Conversions of existing structures are exempt from setback requirements.',
        height: 'Up to 16 feet for single-story detached ADUs. Up to 25 feet for two-story ADUs per state law (AB 1332) in qualifying residential zones.',
        parking: 'One parking space per ADU may be required. Exempt if within 0.5 miles of public transit, within one block of a car-share vehicle, or if the ADU is a conversion of existing space.',
        lotSize: '5,000–7,000 sqft typical residential lots. La Palma\'s uniform grid layout means most lots have consistent dimensions and predictable buildable areas. No minimum lot size required by state law to build an ADU.',
        ownerOccupancy: 'No owner-occupancy requirement for ADUs (made permanent by AB 976 in 2025).',
        additionalNotes: 'La Palma\'s compact lot sizes favor efficient ADU designs — garage conversions and smaller detached units (500–750 sqft) are popular choices. ADUs under 750 sqft are exempt from impact fees, making this size range particularly cost-effective in La Palma.',
    },
    permitting: {
        department: 'City of La Palma Community Development Department',
        steps: [
            { title: 'Verify lot & zoning', desc: 'Confirm your property\'s zoning designation and lot dimensions with the Community Development Department. La Palma\'s consistent residential grid makes most properties straightforward to evaluate. Check for any easements or utility restrictions.' },
            { title: 'Design your ADU', desc: 'Create architectural plans including site plan, floor plan, elevations, structural, mechanical, electrical, and plumbing. La Palma\'s 5,000–7,000 sqft lots work well for compact detached ADUs (500–750 sqft) or garage conversions. Include Title 24 energy compliance documentation.' },
            { title: 'Submit to Community Development', desc: 'Submit your complete plan set to the Community Development Department. La Palma\'s smaller staff means you often work directly with senior planners — take advantage of this accessibility to address questions early in the process.' },
            { title: 'Plan check review', desc: 'The city reviews plans for compliance with building codes and ADU regulations. State law mandates a 60-day maximum review period for compliant ADU applications.' },
            { title: 'Build & inspect', desc: 'Once permitted, begin construction with your licensed contractor. Schedule required inspections at each milestone — foundation, framing, rough MEP, insulation, and final.' },
            { title: 'Final inspection & occupancy', desc: 'Request final inspection from the Building Division. Once passed, receive your Certificate of Occupancy. Your ADU is now legal to rent or occupy in La Palma\'s consistently strong rental market.' },
        ],
        fees: '$5,000–$10,000 total (plan check, building permit, school fees). Impact fees waived for ADUs under 750 sqft.',
        timeline: '4–8 weeks for plan check. 60-day maximum review required by state law.',
        contact: '(714) 690-3336 — City of La Palma Community Development',
        website: 'cityoflapalma.org/180/Community-Development',
    },
    costs: {
        constructionRange: '$250K–$375K',
        permitFees: '$5K–$10K',
        impactFees: 'Waived under 750 sqft',
        typicalSize: '500–900 sqft',
    },
    rental: {
        monthlyRange: '$2,100–$3,300/mo',
        demandDrivers: 'Families seeking affordable Orange County housing in a safe, quiet community, workers commuting to Anaheim, Buena Park, and Cerritos via the 5 and 91 freeways, young professionals priced out of neighboring Cypress and Los Alamitos, and the steady demand for rental units in a city where single-family homes dominate and rental inventory is inherently limited.',
    },
    guide: [
        { title: 'Assess your standard La Palma lot', desc: 'La Palma\'s residential grid features consistent lot sizes of 5,000–7,000 sqft with uniform setbacks. Measure your available backyard space and identify the best ADU placement. Most homes were built in the 1960s–1970s, and many have detached garages that are strong conversion candidates.' },
        { title: 'Consider a garage conversion', desc: 'On La Palma\'s compact lots, converting an existing detached garage is often the fastest and most affordable path to an ADU. Garage conversions avoid new foundation costs, require minimal setback analysis, and can be completed in 4–5 months. State law exempts garage conversions from replacement parking requirements.' },
        { title: 'Design for efficiency', desc: 'With typical lot sizes of 5,000–7,000 sqft, La Palma ADUs should prioritize efficient design. Open floor plans, built-in storage, and multi-functional spaces maximize livability in 500–750 sqft. Staying under 750 sqft also exempts you from impact fees — a significant cost saving.' },
        { title: 'Work with a responsive small city', desc: 'La Palma\'s small-city scale means shorter lines, direct access to senior planning staff, and a more personal permitting experience than larger OC cities. Take advantage by scheduling pre-application meetings and building a working relationship with the Community Development team.' },
        { title: 'Build with a licensed contractor', desc: 'Work with a California-licensed contractor (General-B). Avorino handles design, engineering, permitting, and construction as a single point of contact — delivering a turnkey process that works smoothly with La Palma\'s straightforward permitting.' },
        { title: 'Tap into limited rental supply', desc: 'La Palma is almost entirely single-family homes, creating a natural scarcity of rental units. Your ADU addresses this gap directly. At $2,100–$3,300/mo, target families who want La Palma\'s safety and community character, or commuters who value the central northwest OC location near the 5 and 91 freeways.' },
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
    logDetail('Starting La Palma ADU page build...', 'info');
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
