// ════════════════════════════════════════════════════════════════
// Avorino Builder — SAN JUAN CAPISTRANO ADU PAGE
// Rename this to index.ts to build the San Juan Capistrano ADU page.
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, createAllVariables, buildCityPage, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
const HEAD_CODE = [
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@b91dd73/avorino-responsive.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@b91dd73/avorino-nav-footer.css">',
    CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
    '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@b91dd73/avorino-animations.js"><\/script>',
    CALENDLY_JS,
].join('\n');
const CITY_DATA = {
    slug: 'adu-san-juan-capistrano',
    city: 'San Juan Capistrano',
    title: 'ADU Construction in San Juan Capistrano — Avorino',
    seoDesc: 'Build a permitted ADU in San Juan Capistrano, CA. Historic equestrian community with spacious lots. Detached, attached, and garage conversions. Licensed Orange County contractor.',
    overview: 'San Juan Capistrano is one of Orange County\'s most distinctive cities, anchored by the historic Mission San Juan Capistrano — the birthplace of Orange County — and the surrounding Los Rios Historic District, the oldest continuously occupied residential neighborhood in California. The city\'s rural-residential character sets it apart from the master-planned communities to the north, with equestrian-zoned neighborhoods featuring generous lots of 10,000 to 20,000+ square feet along streets like Paseo Adelanto and Calle Arroyo. The annual Return of the Swallows celebration draws visitors each March, and the Capistrano Depot anchors a walkable downtown with independent restaurants and galleries. San Juan Capistrano sits along the Metrolink Orange County Line, providing commuter rail access to Irvine, Laguna Niguel, and Los Angeles. Major employers in the surrounding area include the Capistrano Unified School District, St. Margaret\'s Episcopal School, and the equestrian and agricultural industries that define the local economy.',
    whyBuild: 'Spacious equestrian and rural-residential lots provide ample room for detached ADUs, strong demand from families drawn to top-rated Capistrano Unified schools, Metrolink commuter rail access, and a unique small-town character that commands premium rental rates in south Orange County.',
    regulations: {
        setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. Conversions of existing structures (barns, guest houses, garages) are exempt from setback requirements. Properties within the Los Rios Historic District may require additional design review for street-facing facades.',
        height: 'Up to 16 feet for single-story detached ADUs. Up to 25 feet for two-story ADUs per state law (AB 1332) in qualifying residential zones.',
        parking: 'One parking space per ADU may be required. Exempt if within 0.5 miles of the San Juan Capistrano Metrolink station, within one block of a car-share vehicle, or if the ADU is a conversion of existing space.',
        lotSize: '10,000–20,000+ sqft in equestrian-zoned neighborhoods. Standard residential lots range from 6,000–10,000 sqft. No minimum lot size required by state law to build an ADU.',
        ownerOccupancy: 'No owner-occupancy requirement for ADUs (made permanent by AB 976 in 2025).',
        additionalNotes: 'ADUs under 750 sqft are exempt from impact fees. Properties in the Historic Town Center Plan area or Los Rios Historic District may require design compatibility review — this is limited to objective standards and cannot block an otherwise compliant ADU. Equestrian-zoned properties should verify that ADU placement does not conflict with existing stable setbacks or riding easements.',
    },
    permitting: {
        department: 'City of San Juan Capistrano Development Services Department',
        steps: [
            { title: 'Verify zoning & historic overlays', desc: 'Confirm your property\'s zoning on the city\'s GIS map. Check whether your parcel falls within the Historic Town Center Plan, Los Rios Historic District, or an equestrian overlay zone — each may carry additional objective design standards for ADUs.' },
            { title: 'Design your ADU', desc: 'Create architectural plans including site plan, floor plan, elevations, structural, mechanical, electrical, and plumbing. For equestrian properties, show existing structures (stables, arenas) and riding easements. In the Historic District, design facades to complement the adobe and early-California architectural character.' },
            { title: 'Submit plans to Development Services', desc: 'Submit your complete plan set to the Development Services Department. Include Title 24 energy compliance, soils report (especially important in hillside areas near Ortega Highway), and any required septic or sewer connection documentation.' },
            { title: 'Plan check review (60-day)', desc: 'The city reviews plans for compliance with building codes and ADU regulations. State law mandates a 60-day maximum review period for compliant ADU applications. Historic District properties may require concurrent review by the Cultural Heritage Commission under objective standards only.' },
            { title: 'Build & inspect', desc: 'Once permitted, begin construction with your licensed contractor. Schedule required inspections at each milestone — foundation, framing, rough mechanical/electrical/plumbing, insulation, and final. Equestrian-area builds should coordinate construction vehicle access to avoid impacting horse trails.' },
            { title: 'Final inspection & occupancy', desc: 'Request final inspection from the Building Division. Once passed, receive your Certificate of Occupancy. Your ADU is now legal to rent or occupy.' },
        ],
        fees: '$6,000–$14,000 total (plan check, building permit, school fees). Impact fees waived for ADUs under 750 sqft.',
        timeline: '4–8 weeks for plan check. 60-day maximum review required by state law.',
        contact: '(949) 493-1171 — City of San Juan Capistrano Development Services',
        website: 'sanjuancapistrano.org/Departments/Development-Services',
    },
    costs: {
        constructionRange: '$275K–$425K',
        permitFees: '$6K–$14K',
        impactFees: 'Waived under 750 sqft',
        typicalSize: '600–1,200 sqft',
    },
    rental: {
        monthlyRange: '$2,500–$4,000/mo',
        demandDrivers: 'Capistrano Unified School District families seeking affordable housing in the attendance area, Metrolink commuters working in Irvine and north county, equestrian community workers and trainers, St. Margaret\'s Episcopal School faculty and staff, retirees drawn to the historic downtown lifestyle, and seasonal visitors seeking short-term stays near the Mission and Dana Point Harbor.',
    },
    guide: [
        { title: 'Check your lot & zoning overlays', desc: 'Use the City of San Juan Capistrano GIS map to verify your parcel\'s zoning, lot size, and any overlay districts. Equestrian-zoned properties on Paseo Adelanto, Calle Arroyo, and surrounding streets have generous setbacks that make detached ADUs straightforward. Confirm whether your property is in the Historic Town Center or Los Rios District.' },
        { title: 'Evaluate existing structures for conversion', desc: 'San Juan Capistrano\'s equestrian properties often have barns, guest cottages, or detached garages that can be converted to ADUs with reduced permitting requirements. Conversions of existing structures are exempt from setback rules. A former tack room or barn apartment may need only interior renovation and utility upgrades to qualify as a legal ADU.' },
        { title: 'Design for the neighborhood character', desc: 'The city\'s architectural identity ranges from Spanish Colonial Revival near the Mission to ranch-style homes in the equestrian areas and newer construction in developments like Rancho San Juan. Design your ADU to complement the surrounding character — earth tones, tile roofs, and covered porches fit naturally in most San Juan Capistrano neighborhoods and maximize rental appeal.' },
        { title: 'Submit to Development Services', desc: 'File your complete architectural plans with the Development Services Department. Include structural engineering, Title 24 energy calculations, and a soils report — particularly important if your property is near hillside terrain along Ortega Highway or in the San Juan Creek floodplain area. Pay plan check fees at submission.' },
        { title: 'Build with a licensed contractor', desc: 'Work with a California-licensed contractor (General-B). Avorino handles design, engineering, permitting, and construction as a single point of contact. Construction typically takes 6–8 months. On equestrian properties, coordinate staging areas and construction access to minimize impact on horses and riding areas.' },
        { title: 'Rent or occupy', desc: 'With your Certificate of Occupancy in hand, your ADU is ready. San Juan Capistrano\'s unique small-town character, top-rated schools, and Metrolink access support rental rates of $2,500–$4,000/mo. Target families in the Capistrano Unified district, Metrolink commuters, and equestrian community professionals seeking housing close to local stables and training facilities.' },
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
    logDetail('Starting San Juan Capistrano ADU page build...', 'info');
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
