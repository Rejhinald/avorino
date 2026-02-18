// ════════════════════════════════════════════════════════════════
// Avorino Builder — NEWPORT BEACH ADU PAGE
// Rename this to index.ts to build the Newport Beach ADU page.
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, createAllVariables, buildCityPage, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
const HEAD_CODE = [
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@42ef7d5/avorino-responsive.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@42ef7d5/avorino-nav-footer.css">',
    CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
    '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@42ef7d5/avorino-animations.js"><\/script>',
    CALENDLY_JS,
].join('\n');
const CITY_DATA = {
    slug: 'adu-newport-beach',
    city: 'Newport Beach',
    title: 'ADU Construction in Newport Beach — Avorino',
    seoDesc: 'Build a permitted ADU in Newport Beach, CA. Coastal zone expertise, premium finishes, and top rental income. Licensed Orange County contractor.',
    overview: 'Newport Beach is one of Orange County\'s most affluent coastal cities, with a median home value exceeding $3 million. The city\'s harbor, beaches, and Fashion Island shopping center make it a premier residential destination. ADUs here command some of the highest rental rates in the county — a well-finished 1-bedroom ADU can generate $3,500–$5,000+ per month. The primary complexity in Newport Beach ADU construction is the Coastal Zone: properties within it may require a Coastal Development Permit in addition to standard building permits. Newport Beach launched its Safe ADU program with waived city fees to encourage compliant ADU development.',
    whyBuild: 'Premium rental rates ($3,500–$5,000+/mo), affluent location, and the Safe ADU program with waived city fees.',
    regulations: {
        setbacks: '4-foot minimum from rear and interior side property lines for detached ADUs. Front and street-side setbacks may exceed 4 feet depending on the underlying zone. Conversions of existing structures are exempt from setbacks.',
        height: '16 feet for detached ADUs. Additional height up to 18 feet may be permitted for roof pitch in certain zones. Two-story ADUs may be allowed up to 25 feet under recent state law updates.',
        parking: 'One parking space per ADU required unless exempt. Exemptions include: within 0.5 miles of transit, within a historic district, when on-street parking permits are not provided to the ADU tenant, or within one block of a car-share stop. Properties NOT in the Coastal Zone and built with new construction are also exempt.',
        lotSize: '5,000–7,500 sqft typical residential lots. Some harbor and peninsula properties are smaller.',
        ownerOccupancy: 'No owner-occupancy requirement per AB 976 (2025). Previously, Newport Beach required owner occupancy — this is no longer enforceable.',
        additionalNotes: 'Coastal Zone properties may require a Coastal Development Permit (CDP), which can involve a public hearing. The Safe ADU program waives city permit fees for qualifying projects. ADUs under 750 sqft are exempt from impact fees.',
    },
    permitting: {
        department: 'Newport Beach Community Development Department',
        steps: [
            { title: 'Determine Coastal Zone status', desc: 'Check if your property is within the California Coastal Zone using the city\'s zoning map. Coastal Zone properties require an additional Coastal Development Permit (CDP), which adds 4–8 weeks to the timeline.' },
            { title: 'Pre-application meeting', desc: 'Schedule a meeting with Community Development to review your proposed ADU. Discuss setback requirements, parking, and whether a CDP is needed. Bring a preliminary site plan and property survey.' },
            { title: 'Submit plans', desc: 'Submit complete architectural plans including site plan, floor plans, elevations, structural, MEP, Title 24, and landscape plan. If in the Coastal Zone, include the CDP application and any required environmental documentation.' },
            { title: 'Plan check & CDP review', desc: 'Standard ADU plan check: 4–6 weeks. If a CDP is required, allow an additional 4–8 weeks. The city may schedule a public hearing for CDP applications in sensitive coastal areas.' },
            { title: 'Build & inspect', desc: 'Pull your permit, begin construction with a licensed contractor. Newport Beach requires high-quality construction and design. Schedule inspections at all required phases through the Building Division.' },
            { title: 'Final inspection', desc: 'Pass final inspection and obtain your Certificate of Occupancy. Check if the Safe ADU program covers your city permit fee waiver.' },
        ],
        fees: '$8,000–$18,000 total (plan check, building permit, school fees, utility connections). City permit fees may be waived through the Safe ADU program. Impact fees waived for ADUs under 750 sqft.',
        timeline: '6–10 weeks for standard properties. 10–16 weeks if Coastal Development Permit is required.',
        contact: '(949) 644-3200 — Newport Beach Community Development',
        website: 'newportbeachca.gov/government/departments/community-development',
    },
    costs: {
        constructionRange: '$300K–$450K',
        permitFees: '$8K–$18K',
        impactFees: 'Waived under 750 sqft',
        typicalSize: '600–1,000 sqft',
    },
    rental: {
        monthlyRange: '$3,500–$5,000+/mo',
        demandDrivers: 'Coastal lifestyle demand, Fashion Island and Hoag Hospital employment, UCI and nearby tech corridors, short-term vacation rental potential in non-restricted zones, and Newport Beach\'s premium school ratings drive consistently high rents.',
    },
    guide: [
        { title: 'Check Coastal Zone', desc: 'This is the most critical first step in Newport Beach. Use the city\'s zoning map or call Community Development to confirm if your property is in the Coastal Zone. This determines whether you need a standard permit or a CDP.' },
        { title: 'Explore the Safe ADU program', desc: 'Newport Beach offers waived city permit fees through its Safe ADU program. Check eligibility early — this can save thousands. The program was designed to encourage legal ADU development and reduce unpermitted construction.' },
        { title: 'Design for coastal aesthetics', desc: 'Newport Beach homes command premium values. Design your ADU with quality materials, coastal-appropriate finishes, and architectural details that complement the main residence. Higher finishes = higher rent.' },
        { title: 'Hire Coastal Zone expertise', desc: 'If your property requires a CDP, work with a team experienced in coastal permitting. Avorino has built multiple ADUs in Newport Beach\'s Coastal Zone and understands the additional documentation and review requirements.' },
        { title: 'Submit & track permits', desc: 'Submit to Community Development with all required documentation. Track your application and respond promptly to any plan check corrections. Faster responses = shorter timelines.' },
        { title: 'Build premium, rent premium', desc: 'Construction quality matters in Newport Beach. Invest in upgraded finishes — quartz countertops, hardwood or LVP flooring, modern fixtures. A well-finished ADU in Newport Beach can generate $5,000+/mo and significantly boost property value.' },
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
    logDetail('Starting Newport Beach ADU page build...', 'info');
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
