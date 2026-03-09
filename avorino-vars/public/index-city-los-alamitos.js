// ════════════════════════════════════════════════════════════════
// Avorino Builder — LOS ALAMITOS ADU PAGE
// Rename this to index.ts to build the Los Alamitos ADU page.
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
    slug: 'adu-los-alamitos',
    city: 'Los Alamitos',
    title: 'ADU Construction in Los Alamitos — Avorino',
    seoDesc: 'Build a permitted ADU in Los Alamitos, CA. Small-town charm with top-rated schools, military base proximity, and strong rental demand. Licensed Orange County ADU contractor.',
    overview: 'Los Alamitos is a small, tightly knit city of approximately 12,000 residents on the northwestern border of Orange County, adjacent to the Los Alamitos Joint Forces Training Base. Despite its compact size — just 4.1 square miles — Los Alamitos is one of the most desirable family communities in the region, driven almost entirely by the Los Alamitos Unified School District, consistently ranked among the top districts in Orange County and all of California. Los Alamitos High School and the McAuliffe Middle School are perennial top performers. The city\'s residential neighborhoods are predominantly single-family homes from the 1960s–70s on lots averaging 5,500–7,000 sqft, with tree-lined streets and a walkable old-town center along Katella Avenue. The Joint Forces Training Base brings steady military-affiliated housing demand, while proximity to the 405 and 605 freeways provides excellent commute access to Long Beach, Irvine, and downtown LA. Los Alamitos Medical Center (Tenet Healthcare) is another significant employer and demand driver for local housing.',
    whyBuild: 'Top-rated Los Alamitos Unified School District — among the best in California — drives premium family rental demand, Joint Forces Training Base military-affiliated housing needs, small-city charm with strong community identity, and excellent freeway access to multiple OC and LA employment centers.',
    regulations: {
        setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. No setback required for conversions of existing structures.',
        height: '16 feet for single-story detached ADUs. Up to 18 feet with roof pitch allowance. Two-story ADUs may reach 25 feet in qualifying zones under AB 1332.',
        parking: 'No additional parking required if within 0.5 miles of public transit. OCTA bus routes on Katella Avenue and Los Alamitos Boulevard qualify many properties for parking exemptions.',
        lotSize: '5,500–7,000 sqft typical in Los Alamitos neighborhoods. No minimum lot size required by state law.',
        ownerOccupancy: 'No owner-occupancy requirement (permanent per AB 976, effective 2025).',
        additionalNotes: 'Los Alamitos processes ADU applications ministerially per state law. ADUs under 750 sqft are exempt from impact fees. The city\'s small size means the building department provides personalized attention to each application.',
    },
    permitting: {
        department: 'City of Los Alamitos Community Development Department',
        steps: [
            { title: 'Verify zoning & lot dimensions', desc: 'Confirm your property is in a residential zone using the city\'s zoning map. Los Alamitos lots typically range from 5,500–7,000 sqft. Measure your buildable area accounting for 4-foot setbacks to plan your ADU placement.' },
            { title: 'Pre-application consultation', desc: 'Contact the Community Development Department at (562) 431-3538, ext. 301, for a pre-application consultation. Los Alamitos\'s small building department offers personalized guidance that can help streamline your application.' },
            { title: 'Submit complete plans', desc: 'Submit architectural and engineering plans including site plan, floor plans, elevations, structural calculations, Title 24 energy compliance, and MEP plans. Los Alamitos processes ADU applications ministerially — no public hearing required.' },
            { title: 'Plan check review', desc: 'Plan check typically takes 4–6 weeks. The city must process compliant ADU applications within 60 days per state law. Los Alamitos\'s smaller application volume often means faster turnaround times.' },
            { title: 'Pull permit & construct', desc: 'Pay fees and pull your building permit. Begin construction with a licensed contractor. Los Alamitos\'s flat lots and established infrastructure make construction logistics straightforward.' },
            { title: 'Final inspection & occupancy', desc: 'Pass final inspection and receive your Certificate of Occupancy. Your ADU is now legally habitable in one of Orange County\'s most sought-after school districts.' },
        ],
        fees: '$4,000–$10,000 total (plan check, building permit, school fees). Impact fees waived for ADUs under 750 sqft.',
        timeline: '4–6 weeks plan check. 60-day maximum per state mandate. Smaller application volume often results in faster processing.',
        contact: '(562) 431-3538, ext. 301 — Los Alamitos Community Development',
        website: 'cityoflosalamitos.org/departments/community-development',
    },
    costs: {
        constructionRange: '$225K–$375K',
        permitFees: '$4K–$10K',
        impactFees: 'Waived under 750 sqft',
        typicalSize: '600–1,000 sqft',
    },
    rental: {
        monthlyRange: '$2,400–$3,800/mo',
        demandDrivers: 'Families paying premium rents specifically for Los Alamitos Unified School District enrollment, Joint Forces Training Base military personnel and civilian contractors, Los Alamitos Medical Center healthcare workers, commuters using the 405 and 605 freeways to Long Beach, Irvine, and LA, and young professionals drawn to the small-town community atmosphere.',
    },
    guide: [
        { title: 'Evaluate your lot', desc: 'Los Alamitos lots typically range from 5,500–7,000 sqft with flat topography. Measure your backyard depth and width accounting for 4-foot setbacks. Most lots can accommodate a 500–750 sqft detached ADU. Many 1960s-era homes have oversized garages that are excellent conversion candidates.' },
        { title: 'Understand the school district premium', desc: 'Los Alamitos Unified is the primary rental demand driver. Families routinely pay significantly above-market rents for units within the district boundaries. Confirm your property is within LAUSD boundaries — this is your biggest value proposition when marketing your ADU to potential tenants.' },
        { title: 'Design for the neighborhood', desc: 'Los Alamitos has a consistent mid-century residential character. Match your ADU\'s roofline, exterior materials, and colors to the primary residence. A two-bedroom unit appeals to families seeking school district enrollment and commands the highest rents.' },
        { title: 'Submit to Community Development', desc: 'File complete plans with the City of Los Alamitos Community Development Department. The city\'s smaller size often means more personalized service and faster plan check turnaround. ADU applications are processed ministerially within 60 days.' },
        { title: 'Build with Avorino', desc: 'Avorino provides full-service ADU construction — design, engineering, permitting, and building. Our familiarity with Los Alamitos\'s building department and northwest OC construction conditions ensures an efficient, on-schedule project.' },
        { title: 'Command premium school-district rents', desc: 'Los Alamitos Unified is your ADU\'s strongest asset. Market to families seeking district enrollment — they will pay $2,400–$3,800/mo for a well-designed unit within the attendance boundaries. A two-bedroom ADU with family-friendly finishes maximizes both rental rate and occupancy.' },
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
    logDetail('Starting Los Alamitos ADU page build...', 'info');
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
