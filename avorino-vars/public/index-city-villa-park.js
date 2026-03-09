// ════════════════════════════════════════════════════════════════
// Avorino Builder — VILLA PARK ADU PAGE
// Rename this to index.ts to build the Villa Park ADU page.
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
    slug: 'adu-villa-park',
    city: 'Villa Park',
    title: 'ADU Construction in Villa Park — Avorino',
    seoDesc: 'Build a permitted ADU in Villa Park, CA. One of OC\'s smallest and most exclusive cities with estate lots, equestrian zoning, and premium rental demand. Licensed OC contractor.',
    overview: 'Villa Park is one of the smallest and most exclusive cities in Orange County — just 2.1 square miles with a population of approximately 5,800 residents. Often called the "Hidden Jewel of Orange County," Villa Park is an affluent residential enclave surrounded by the City of Orange, known for its estate-sized lots, equestrian zoning, and rural character despite its central Orange County location. Lots in Villa Park are among the largest in the county, typically ranging from 10,000 sqft to over an acre, with many properties featuring horse facilities and citrus groves. The city is served by the Orange Unified School District, with Villa Park High School — one of the top-rated public high schools in Orange County — being the primary draw for families. Villa Park has no commercial zoning — it is purely residential — which creates a unique, quiet character. The Santiago Creek bikeway and proximity to Irvine Regional Park and Peters Canyon Regional Park provide extensive outdoor recreation. The 55 freeway is minutes away, connecting residents to Costa Mesa, Newport Beach, and Irvine.',
    whyBuild: 'Estate-sized lots of 10,000 sqft to 1+ acre provide exceptional space for large detached ADUs, Villa Park High School drives premium family rental demand, no commercial zoning means a quiet residential setting that commands top rents, and the city\'s exclusivity creates scarcity that supports high occupancy rates.',
    regulations: {
        setbacks: '4-foot minimum from rear and side property lines for new detached ADUs. Villa Park\'s generous lot sizes make setbacks rarely a constraint. Equestrian-zoned properties may have additional setback considerations for stable areas.',
        height: '16 feet for single-story detached ADUs. Up to 18 feet with roof pitch allowance. Two-story ADUs may reach 25 feet in qualifying zones under AB 1332.',
        parking: 'No additional parking required per standard state exemptions. Villa Park properties typically have ample existing parking and driveway space.',
        lotSize: '10,000 sqft to 1+ acre typical for Villa Park estate lots. Among the largest residential lots in Orange County.',
        ownerOccupancy: 'No owner-occupancy requirement (permanent per AB 976, effective 2025).',
        additionalNotes: 'Villa Park processes ADU applications ministerially per state law. ADUs under 750 sqft are exempt from impact fees. Equestrian-zoned properties should verify ADU placement does not conflict with animal-keeping setbacks. The city\'s purely residential character means no commercial activity restrictions on ADU use — but short-term rentals may be regulated.',
    },
    permitting: {
        department: 'City of Villa Park — City Hall, 17855 Santiago Boulevard',
        steps: [
            { title: 'Verify zoning & equestrian status', desc: 'Confirm your property\'s zoning and whether it carries equestrian designation. Contact Villa Park City Hall at (714) 998-1500. Equestrian-zoned properties should plan ADU placement to avoid conflicts with existing or permitted stable areas.' },
            { title: 'Pre-application consultation', desc: 'Meet with Villa Park\'s planning staff for a pre-application review. Bring your property survey, lot dimensions, and preliminary ADU concept. Staff will confirm setbacks, height limits, and any property-specific considerations.' },
            { title: 'Submit complete plans', desc: 'Submit architectural and engineering plans to City Hall. Include site plan, floor plans, elevations, structural calculations, Title 24 energy compliance, and MEP plans. Villa Park processes ADU applications ministerially — no public hearing required.' },
            { title: 'Plan check review', desc: 'Plan check typically takes 4–6 weeks. The city must process compliant ADU applications within 60 days per state law. Villa Park\'s small application volume generally allows for responsive communication during plan check.' },
            { title: 'Pull permit & construct', desc: 'Pay fees and pull your building permit. Begin construction with a licensed contractor. Villa Park\'s large lots provide excellent construction access and staging areas, simplifying the build process.' },
            { title: 'Final inspection & occupancy', desc: 'Pass final inspection and receive your Certificate of Occupancy. Your ADU is now legally habitable in one of Orange County\'s most exclusive residential communities.' },
        ],
        fees: '$5,000–$13,000 total (plan check, building permit, school fees). Impact fees waived for ADUs under 750 sqft.',
        timeline: '4–6 weeks plan check. 60-day maximum per state mandate.',
        contact: '(714) 998-1500 — Villa Park City Hall',
        website: 'villapark.org',
    },
    costs: {
        constructionRange: '$300K–$475K',
        permitFees: '$5K–$13K',
        impactFees: 'Waived under 750 sqft',
        typicalSize: '800–1,200 sqft',
    },
    rental: {
        monthlyRange: '$3,000–$4,800/mo',
        demandDrivers: 'Families seeking Villa Park High School enrollment — one of OC\'s top-rated public schools, professionals working at nearby Chapman University and Anaheim\'s Platinum Triangle, equestrian lifestyle seekers needing proximity to horse facilities, retirees and empty-nesters seeking a quiet residential setting, and extended family members of existing Villa Park residents.',
    },
    guide: [
        { title: 'Leverage your estate lot', desc: 'Villa Park lots range from 10,000 sqft to over an acre — among the largest in OC. You have exceptional flexibility for ADU placement and size. Consider an 800–1,200 sqft detached unit positioned for privacy and separate access. The generous lot sizes often allow for landscaped buffers between the primary home and ADU.' },
        { title: 'Check equestrian zoning', desc: 'If your property has equestrian designation, verify that your planned ADU location doesn\'t conflict with animal-keeping setbacks or existing stable areas. Many Villa Park properties have both equestrian and residential areas — position your ADU in the residential portion of the lot.' },
        { title: 'Design for Villa Park\'s character', desc: 'Villa Park has a distinct estate-home character — ranch, Mediterranean, and custom architectural styles predominate. Design your ADU to complement the primary residence with matching rooflines, premium materials, and upscale finishes. The estate setting justifies investment in quality that commands top rents.' },
        { title: 'Submit to City Hall', desc: 'File plans with Villa Park City Hall on Santiago Boulevard. The city\'s small size means personalized attention from planning staff. ADU applications are processed ministerially within 60 days — no public hearing required.' },
        { title: 'Build with Avorino', desc: 'Avorino specializes in premium ADU construction suited to Villa Park\'s estate character. Large lot access simplifies construction logistics. We handle design, engineering, permitting, and construction — ensuring your ADU meets Villa Park\'s high standards.' },
        { title: 'Rent at estate-level rates', desc: 'Villa Park\'s exclusivity, top-rated schools, and estate setting support rental rates of $3,000–$4,800/mo. Target families seeking Villa Park High School enrollment, Chapman University professionals, and the equestrian community. Limited rental inventory in the city means your ADU will be in high demand.' },
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
    logDetail('Starting Villa Park ADU page build...', 'info');
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
