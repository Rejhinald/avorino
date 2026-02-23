// ════════════════════════════════════════════════════════════════
// Avorino Builder — BREA ADU PAGE
// Rename this to index.ts to build the Brea ADU page.
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, createAllVariables, buildCityPage, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
const HEAD_CODE = [
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@00e47e2/avorino-responsive.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@00e47e2/avorino-nav-footer.css">',
    CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
    '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@00e47e2/avorino-animations.js"><\/script>',
    CALENDLY_JS,
].join('\n');
const CITY_DATA = {
    slug: 'brea-adu',
    city: 'Brea',
    title: 'ADU Construction in Brea — Avorino',
    seoDesc: 'Build a permitted ADU in Brea, CA. Pre-approved plans available. Licensed Orange County contractor serving this affluent north OC community.',
    overview: 'Brea is an affluent, family-friendly community of approximately 48,000 residents in north Orange County, with a median household income of $131,000. Known for its excellent schools (Brea-Olinda Unified School District), well-maintained neighborhoods, and the Brea Mall — one of the region\'s premier shopping destinations — Brea offers a high quality of life that attracts long-term residents. The city sits along the 57 freeway corridor near the Birch Hills Golf Course and Carbon Canyon Regional Park, providing quick access to both Orange County and Inland Empire employment centers. Brea has proactively embraced ADU development by offering a pre-approved ADU plans program that streamlines permitting and reduces costs for homeowners.',
    whyBuild: 'Affluent community with a pre-approved ADU plans program that streamlines permitting, family-oriented demographics that support stable long-term rentals, and proximity to major employment centers along the 57 corridor.',
    regulations: {
        setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. Conversions of existing structures are exempt from setback requirements.',
        height: 'Up to 18 feet for detached ADUs per 2025 regulatory updates. Up to 25 feet for attached ADUs in some qualifying residential zones.',
        parking: 'One parking space per ADU may be required. Exempt if within 0.5 miles of public transit, within one block of a car-share vehicle, or if the ADU is a conversion of existing space.',
        lotSize: '6,000–8,000 sqft for standard residential neighborhoods. Some hillside and estate properties offer larger parcels. No minimum lot size required by state law to build an ADU.',
        ownerOccupancy: 'No owner-occupancy requirement for ADUs (made permanent by AB 976 in 2025).',
        additionalNotes: 'Brea offers a pre-approved ADU plans program — selecting from pre-approved designs significantly streamlines the permitting process and can reduce plan check timelines to 30 days. Fee schedule was updated in July 2025 — contact the Community Development Department for current rates.',
    },
    permitting: {
        department: 'City of Brea Community Development Department — Planning Division, 1 Civic Center Circle',
        steps: [
            { title: 'Explore pre-approved plans', desc: 'Before commissioning custom designs, review Brea\'s pre-approved ADU plans program. These designs have already been reviewed for code compliance, reducing your plan check timeline to approximately 30 days and eliminating common revision cycles.' },
            { title: 'Design your ADU (or adapt pre-approved)', desc: 'If using custom plans, create full architectural drawings including site plan, floor plan, elevations, structural, and MEP. If using pre-approved plans, prepare site-specific adaptations showing lot layout, setback compliance, and utility connections.' },
            { title: 'Submit to Community Development', desc: 'Submit your complete plan set to the Community Development Department at 1 Civic Center Circle. Include structural engineering, Title 24 energy compliance, and any required soils reports for hillside properties.' },
            { title: 'Plan check review', desc: 'Pre-approved plans target a 30-day turnaround. Custom designs follow standard review — state law mandates a 60-day maximum for compliant ADU applications. Fee schedule updated July 2025 — confirm current fees at submission.' },
            { title: 'Build & inspect', desc: 'Once permitted, begin construction with your licensed contractor. Schedule required inspections at each milestone — foundation, framing, rough MEP, insulation, and final.' },
            { title: 'Final inspection & occupancy', desc: 'Request final inspection from the Building Division. Once passed, receive your Certificate of Occupancy. Your ADU is now legal to rent or occupy.' },
        ],
        fees: 'Contact city for current fee schedule (updated July 2025). Call (714) 990-7600 or visit 1 Civic Center Circle for the latest rate sheet.',
        timeline: '4–8 weeks for custom plans (60-day state maximum). Approximately 30 days for pre-approved plans.',
        contact: '(714) 990-7600 — City of Brea Community Development Department',
        website: 'cityofbrea.net/160/Community-Development',
    },
    costs: {
        constructionRange: '$250K–$400K',
        permitFees: 'Contact city (updated July 2025)',
        impactFees: 'Waived under 750 sqft',
        typicalSize: '600–1,200 sqft',
    },
    rental: {
        monthlyRange: '$2,200–$3,500/mo',
        demandDrivers: 'Brea\'s affluent community supports premium finishes and higher rents. Proximity to Blizzard Entertainment and other tech employers in Irvine draws gaming and tech industry professionals. Strong school ratings in the Brea-Olinda Unified School District attract families seeking long-term rentals. The 57 freeway corridor provides access to employment in Anaheim, Fullerton, Diamond Bar, and the Inland Empire.',
    },
    guide: [
        { title: 'Explore pre-approved plans first', desc: 'Brea\'s pre-approved ADU plans program is a significant advantage. These designs have already cleared code review, cutting your permitting timeline roughly in half (30 days vs. 60 days for custom plans). Review the available designs before investing in custom architecture — you may find a plan that fits your lot and goals.' },
        { title: 'Check your lot', desc: 'Verify your property on the City of Brea zoning map. Standard residential lots are 6,000–8,000 sqft. Hillside properties near Carbon Canyon or Birch Hills may have additional grading and geotechnical requirements. Confirm your lot\'s setback dimensions and utility access points.' },
        { title: 'Design to the community standard', desc: 'Brea\'s affluent demographics (median household income $131K) support premium ADU finishes. Consider quartz countertops, in-unit laundry, modern fixtures, and energy-efficient appliances. Higher upfront investment in finishes translates directly to higher monthly rents and better tenant retention.' },
        { title: 'Submit to Community Development', desc: 'File your plans at 1 Civic Center Circle. If using pre-approved designs, bring site-specific adaptations. For custom plans, include full structural engineering and Title 24 calculations. Note: fee schedule was updated July 2025 — confirm current rates at submission.' },
        { title: 'Build with a licensed contractor', desc: 'Work with a California-licensed contractor (General-B). Avorino handles design, engineering, permitting, and construction as a single point of contact. Construction typically takes 6–8 months depending on ADU size and site conditions.' },
        { title: 'Rent or occupy', desc: 'With your Certificate of Occupancy in hand, your ADU is ready. Brea\'s family-oriented community supports stable, long-term tenancies with low turnover. Target tech professionals from Blizzard Entertainment and nearby Irvine employers, or families drawn by Brea-Olinda\'s strong school ratings, for $2,200–$3,500/mo.' },
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
    logDetail('Starting Brea ADU page build...', 'info');
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
