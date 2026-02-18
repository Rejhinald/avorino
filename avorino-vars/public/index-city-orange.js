// ════════════════════════════════════════════════════════════════
// Avorino Builder — ORANGE ADU PAGE
// Rename this to index.ts to build the Orange ADU page.
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, createAllVariables, buildCityPage, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
const HEAD_CODE = [
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@af53b2e/avorino-responsive.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@af53b2e/avorino-nav-footer.css">',
    CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
    '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@af53b2e/avorino-animations.js"><\/script>',
    CALENDLY_JS,
].join('\n');
const CITY_DATA = {
    slug: 'orange-adu',
    city: 'Orange',
    title: 'ADU Construction in Orange — Avorino',
    seoDesc: 'Build a permitted ADU in Orange, CA. Detached, attached, and garage conversions. Licensed Orange County contractor serving Orange Park Acres and Old Towne Orange.',
    overview: 'The City of Orange is one of the most architecturally distinctive communities in Orange County, anchored by the Old Towne Historic District — one of the largest National Register-listed historic districts in California. Home to Chapman University and its 10,000+ students, Orange features established neighborhoods with mature landscaping and generous lot sizes. Orange Park Acres, a unique semi-rural enclave within the city, offers half-acre to multi-acre equestrian properties ideal for large detached ADUs. The city\'s central OC location provides easy access to the 55, 57, and 22 freeways, connecting residents to employment centers in Irvine, Anaheim, and Santa Ana.',
    whyBuild: 'Generous lot sizes especially in Orange Park Acres, strong rental demand from Chapman University students and faculty, and a central location that draws renters working across Orange County.',
    regulations: {
        setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. Conversions of existing structures are exempt from setback requirements.',
        height: 'Up to 16 feet for detached ADUs. Up to 25 feet for attached ADUs in qualifying residential zones.',
        parking: 'One parking space per ADU may be required. Exempt if within 0.5 miles of public transit, within one block of a car-share vehicle, or if the ADU is a conversion of existing space.',
        lotSize: '6,000–10,000+ sqft for standard residential neighborhoods. Orange Park Acres lots range from 0.5 to 5+ acres. No minimum lot size required by state law to build an ADU.',
        ownerOccupancy: 'No owner-occupancy requirement for ADUs (made permanent by AB 976 in 2025).',
        additionalNotes: 'Properties within the Old Towne Historic District require design review conforming to the Secretary of the Interior\'s Standards for the Treatment of Historic Properties. The city requires a minimum of 2 exterior colors and at least 3 distinct architectural elements (e.g., varied roofline, window trim, wainscoting, decorative vents) on ADU facades. Orange Park Acres properties may have additional equestrian overlay zoning considerations.',
    },
    permitting: {
        department: 'City of Orange Planning Division — 300 E. Chapman Avenue',
        steps: [
            { title: 'Verify zoning & historic status', desc: 'Check your property on the City of Orange zoning map. Critically, determine whether your parcel falls within the Old Towne Historic District — if so, your ADU design must conform to the Secretary of the Interior\'s Standards and undergo additional design review.' },
            { title: 'Design your ADU', desc: 'Create architectural plans that include 2 exterior colors and at least 3 architectural elements as required by the city. For Old Towne properties, ensure the design is compatible with the historic character of the neighborhood.' },
            { title: 'Submit plans to Planning Division', desc: 'Submit your complete plan set to the Planning Division at 300 E. Chapman Avenue. Include structural engineering, Title 24 energy compliance, and a soils report if required. Old Towne properties will be routed for historic review.' },
            { title: 'Plan check review', desc: 'The city reviews plans for compliance with building codes and ADU regulations. State law mandates a 60-day maximum review period. Old Towne historic review may run concurrently but can add processing time.' },
            { title: 'Build & inspect', desc: 'Once permitted, begin construction with your licensed contractor. Schedule required inspections at each milestone — foundation, framing, rough MEP, insulation, and final.' },
            { title: 'Final inspection & occupancy', desc: 'Request final inspection from the Building Division. Once passed, receive your Certificate of Occupancy. Your ADU is now legal to rent or occupy.' },
        ],
        fees: '$5,000–$12,000 total (plan check, building permit, school fees). Impact fees waived for ADUs under 750 sqft.',
        timeline: '4–8 weeks for plan check. 60-day maximum review required by state law. Old Towne historic review may add additional time.',
        contact: '(714) 744-7220 — City of Orange Planning Division',
        website: 'cityoforange.org/174/Planning-Division',
    },
    costs: {
        constructionRange: '$250K–$400K',
        permitFees: '$5K–$12K',
        impactFees: 'Waived under 750 sqft',
        typicalSize: '600–1,200 sqft',
    },
    rental: {
        monthlyRange: '$2,400–$3,800/mo',
        demandDrivers: 'Chapman University students and faculty (10,000+ enrollment), proximity to Anaheim\'s Disneyland Resort and hospitality employment, Irvine tech and biotech companies, Children\'s Hospital of Orange County (CHOC) staff, and the 55/57/22 freeway interchange providing quick access to jobs across central Orange County.',
    },
    guide: [
        { title: 'Check your lot & historic status', desc: 'Verify your property on the City of Orange zoning and parcel map. Determine whether your property is within the Old Towne Historic District, which triggers additional design review requirements. Orange Park Acres properties should also check for equestrian overlay zoning.' },
        { title: 'Choose your ADU type', desc: 'Orange Park Acres\' half-acre to multi-acre lots are ideal for large detached ADUs. Standard residential neighborhoods (6,000–10,000 sqft lots) support detached, attached, or garage conversion ADUs. Consider your lot\'s constraints and target rental market.' },
        { title: 'Design with character in mind', desc: 'The city requires 2 exterior colors and 3 architectural elements on all ADUs. Old Towne properties must conform to the Secretary of the Interior\'s Standards — work with a designer experienced in historic district compliance. Non-historic areas still benefit from designs that complement the established neighborhood aesthetic.' },
        { title: 'Submit to the Planning Division', desc: 'File your complete plans at 300 E. Chapman Avenue. Include structural engineering, Title 24 energy calculations, and soils reports if required. Pay plan check fees at submission. Old Towne applications will be routed for concurrent historic review.' },
        { title: 'Build with a licensed contractor', desc: 'Work with a California-licensed contractor (General-B). Avorino handles design, engineering, permitting, and construction as a single point of contact. Construction typically takes 6–8 months depending on ADU size and site conditions.' },
        { title: 'Rent or occupy', desc: 'With your Certificate of Occupancy in hand, your ADU is ready. Orange\'s Chapman University drives year-round rental demand for student and faculty housing. Premium finishes and proximity to Old Towne\'s restaurants and shops command the top of the $2,400–$3,800/mo range.' },
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
    logDetail('Starting Orange ADU page build...', 'info');
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
