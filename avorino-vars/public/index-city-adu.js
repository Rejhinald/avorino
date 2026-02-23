// ════════════════════════════════════════════════════════════════
// Avorino Builder — CITY ADU TEMPLATE
// Rename this to index.ts to build a city ADU page.
// Change CITY_INDEX below to select which city (0–25):
//   0=Anaheim, 1=Irvine, 2=Newport Beach, 3=Costa Mesa,
//   4=Huntington Beach, 5=Tustin, 6=Orange, 7=Santa Ana,
//   8=Fullerton, 9=Brea, 10=Garden Grove, 11=Laguna Niguel,
//   12=Laguna Beach, 13=Dana Point, 14=San Clemente,
//   15=San Juan Capistrano, 16=Mission Viejo, 17=Lake Forest,
//   18=Laguna Hills, 19=Aliso Viejo, 20=Rancho Santa Margarita,
//   21=Ladera Ranch, 22=Yorba Linda, 23=La Palma,
//   24=Placentia, 25=Rossmoor
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, wait, safeCall, getAvorinVars, getOrCreateStyle, freshStyle, clearAndSet, createSharedStyles, setSharedStyleProps, createAllVariables, createPageWithSlug, buildCTASection, applyCTAStyleProps, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
// ═══ CHANGE THIS INDEX TO BUILD A DIFFERENT CITY PAGE ═══
const CITY_INDEX = 0;
// ── City data ──
const CITIES = [
    { slug: 'anaheim-adu', city: 'Anaheim', overview: 'Larger lot sizes (7K–10K sqft) make Anaheim ideal for both attached and detached ADUs. No owner-occupancy requirement.', lots: '7,000–10,000 sqft', cost: '$250K–$400K', size: '600–1,200 sqft', regs: 'Standard state ADU setbacks. No additional local restrictions.', permit: 'Anaheim Building Department. Four printed plan copies required.' },
    { slug: 'adu-irvine', city: 'Irvine', overview: 'Master-planned communities with larger lots and strong rental market. Excellent ADU ROI potential.', lots: '5,000–8,000 sqft', cost: '$275K–$425K', size: '600–1,000 sqft', regs: '4-foot rear/side setbacks. Max 16ft height for detached units.', permit: 'Community Development Department. 4–6 week plan check.' },
    { slug: 'adu-newport-beach', city: 'Newport Beach', overview: 'Premium rental rates — among the highest in Orange County. Coastal zone properties may need additional review.', lots: '5,000–7,500 sqft', cost: '$300K–$450K', size: '600–1,000 sqft', regs: 'Owner occupancy required. Coastal zone may require CDP.', permit: 'Community Development Department.' },
    { slug: 'costa-mesa-adu', city: 'Costa Mesa', overview: 'Central location with growing rental demand. Diverse neighborhoods offer flexibility in ADU design.', lots: '5,000–7,000 sqft', cost: '$250K–$400K', size: '600–1,200 sqft', regs: 'State ADU guidelines. 4-foot setbacks for detached ADUs.', permit: 'Development Services Department.' },
    { slug: 'huntington-beach-adu', city: 'Huntington Beach', overview: 'Beachside location drives strong rental demand. Larger inland lots are well-suited for detached ADUs.', lots: '6,000–9,000 sqft', cost: '$250K–$425K', size: '600–1,200 sqft', regs: 'State ADU laws apply. Specific plan areas may have additional guidelines.', permit: 'Community Development Department. 4–8 week review.' },
    { slug: 'tustin-adu', city: 'Tustin', overview: 'Mix of older and newer neighborhoods with central location and good access to employment centers.', lots: '6,000–8,000 sqft', cost: '$250K–$400K', size: '600–1,200 sqft', regs: 'State ADU requirements. Standard setbacks.', permit: 'Community Development Department.' },
    { slug: 'orange-adu', city: 'Orange', overview: 'Established neighborhoods with generous lots, especially Orange Park Acres. Strong local rental demand.', lots: '6,000–10,000+ sqft', cost: '$250K–$400K', size: '600–1,200 sqft', regs: 'State guidelines. Old Towne Historic District may require design review.', permit: 'Community Development Department.' },
    { slug: 'santa-ana-adu', city: 'Santa Ana', overview: 'Urban density and strong rental market. The city actively encourages ADU development with expedited processing.', lots: '5,000–7,000 sqft', cost: '$225K–$375K', size: '500–1,000 sqft', regs: 'State requirements. No additional local restrictions.', permit: 'Planning and Building Agency. Expedited ADU processing.' },
    { slug: 'fullerton-adu', city: 'Fullerton', overview: 'Diverse neighborhoods and university proximity create consistent rental demand. Hill-area lots are ideal for detached ADUs.', lots: '6,000–9,000 sqft', cost: '$250K–$400K', size: '600–1,200 sqft', regs: 'State ADU laws. Standard setback and height requirements.', permit: 'Community Development Department.' },
    { slug: 'brea-adu', city: 'Brea', overview: 'Family-friendly neighborhoods with adequate lot sizes support long-term rental stability.', lots: '6,000–8,000 sqft', cost: '$250K–$400K', size: '600–1,200 sqft', regs: 'State guidelines. Standard setbacks and height limits.', permit: 'Community Development Department.' },
    { slug: 'garden-grove-adu', city: 'Garden Grove', overview: 'Affordable entry into ADU investment with competitive construction costs and steady rental demand.', lots: '5,000–7,000 sqft', cost: '$225K–$375K', size: '500–1,000 sqft', regs: 'State requirements. No additional local restrictions.', permit: 'Planning Services Division.' },
    { slug: 'adu-laguna-niguel', city: 'Laguna Niguel', overview: 'South County premium with planned community layout. Larger lots support quality ADU construction.', lots: '5,000–8,000 sqft', cost: '$275K–$425K', size: '600–1,000 sqft', regs: 'State guidelines. HOAs may require architectural review.', permit: 'Community Development.' },
    { slug: 'adu-laguna-beach', city: 'Laguna Beach', overview: 'Prestigious coastal location with the highest rental rates in OC. Premium design expected.', lots: '4,000–7,000 sqft', cost: '$325K–$475K', size: '500–900 sqft', regs: 'Coastal zone applies. Additional design review. Hillside grading restrictions.', permit: 'Community Development. Coastal Development Permit may be required.' },
    { slug: 'adu-dana-point', city: 'Dana Point', overview: 'Coastal setting with tourism-driven economy supports strong short and long-term rental demand.', lots: '5,000–8,000 sqft', cost: '$275K–$425K', size: '600–1,000 sqft', regs: 'Coastal zone may require additional permits. State guidelines apply.', permit: 'Community Development Department.' },
    { slug: 'adu-san-clemente', city: 'San Clemente', overview: 'Spanish-village charm and coastal lifestyle drive premium rental demand. Varied topography offers creative ADU placement.', lots: '5,000–8,000 sqft', cost: '$275K–$425K', size: '600–1,000 sqft', regs: 'State guidelines. Design review in certain overlay zones.', permit: 'Community Development.' },
    { slug: 'adu-san-juan-capistrano', city: 'San Juan Capistrano', overview: 'Historic character and larger lots in rural-residential zones are ideal for detached ADUs.', lots: '6,000–20,000+ sqft', cost: '$275K–$425K', size: '600–1,200 sqft', regs: 'Historic district may require design review. State setbacks apply.', permit: 'Development Services.' },
    { slug: 'adu-mission-viejo', city: 'Mission Viejo', overview: 'Master-planned neighborhoods with consistent lot sizes. Strong schools drive family-oriented rental demand.', lots: '5,000–8,000 sqft', cost: '$250K–$400K', size: '600–1,000 sqft', regs: 'State guidelines. HOA review may be required.', permit: 'Community Development.' },
    { slug: 'adu-lake-forest', city: 'Lake Forest', overview: 'Family-friendly environment near Irvine employment centers. Steady rental demand and strong ADU ROI.', lots: '5,000–7,000 sqft', cost: '$250K–$400K', size: '600–1,000 sqft', regs: 'State ADU guidelines with standard setbacks.', permit: 'Community Development.' },
    { slug: 'adu-laguna-hills', city: 'Laguna Hills', overview: 'South county location premium with moderate construction costs compared to coastal cities.', lots: '5,000–7,000 sqft', cost: '$250K–$400K', size: '600–1,000 sqft', regs: 'State guidelines. Standard setbacks and height limits.', permit: 'Community Development.' },
    { slug: 'adu-aliso-viejo', city: 'Aliso Viejo', overview: 'Newer infrastructure makes ADU construction straightforward. Strong rental demand in planned community.', lots: '4,000–6,000 sqft', cost: '$250K–$400K', size: '500–900 sqft', regs: 'State guidelines. HOA architectural review may be required.', permit: 'Community Development.' },
    { slug: 'adu-rancho-santa-margarita', city: 'Rancho Santa Margarita', overview: 'Suburban setting with larger lots. Excellent space for detached ADU construction.', lots: '5,000–8,000 sqft', cost: '$250K–$400K', size: '600–1,000 sqft', regs: 'State guidelines. HOAs may require architectural review.', permit: 'Development Services.' },
    { slug: 'adu-ladera-ranch', city: 'Ladera Ranch', overview: 'Newer master-planned community. Family-oriented amenities support strong rental demand.', lots: '4,000–7,000 sqft', cost: '$275K–$425K', size: '600–1,000 sqft', regs: 'State guidelines. HOA and architectural review required.', permit: 'County of Orange Planning Department (unincorporated).' },
    { slug: 'adu-yorba-linda', city: 'Yorba Linda', overview: 'Upscale residential with generous lot sizes, especially in the hills. Premium ADU opportunities.', lots: '7,000–15,000+ sqft', cost: '$275K–$425K', size: '600–1,200 sqft', regs: 'State guidelines. Hillside overlay may have grading requirements.', permit: 'Community Development.' },
    { slug: 'adu-la-palma', city: 'La Palma', overview: 'Compact city with well-maintained neighborhoods. Standard residential lots for ADU construction.', lots: '5,000–7,000 sqft', cost: '$250K–$375K', size: '500–900 sqft', regs: 'State guidelines. Standard setbacks.', permit: 'Community Development.' },
    { slug: 'adu-placentia', city: 'Placentia', overview: 'Established neighborhoods with growing rental demand. Practical choice for ADU construction.', lots: '5,000–7,000 sqft', cost: '$250K–$375K', size: '500–1,000 sqft', regs: 'State guidelines. Standard setbacks and height limits.', permit: 'Community Development.' },
    { slug: 'rossmoor-adu', city: 'Rossmoor', overview: 'Unincorporated community with larger lots near Seal Beach. Permits through County of Orange.', lots: '6,000–9,000 sqft', cost: '$250K–$400K', size: '600–1,200 sqft', regs: 'State guidelines apply (unincorporated area).', permit: 'County of Orange Planning and Development Services.' },
];
const CITY = CITIES[CITY_INDEX];
const HEAD_CODE = [
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@9f2e416/avorino-responsive.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@9f2e416/avorino-nav-footer.css">',
    CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
    '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@9f2e416/avorino-animations.js"><\/script>',
    CALENDLY_JS,
].join('\n');
// ── Update panel UI ──
document.getElementById('page-name').textContent = `${CITY.city} ADU`;
const headCodeEl = document.getElementById('head-code');
const footerCodeEl = document.getElementById('footer-code');
if (headCodeEl)
    headCodeEl.textContent = HEAD_CODE;
if (footerCodeEl)
    footerCodeEl.textContent = FOOTER_CODE;
// ── Build function ──
async function buildCityADUPage() {
    clearErrorLog();
    logDetail(`Starting ${CITY.city} ADU page build...`, 'info');
    const v = await getAvorinVars();
    log('Creating shared styles...');
    const s = await createSharedStyles();
    // ── Page-specific styles ──
    log('Creating page-specific styles...');
    const cyHero = await getOrCreateStyle('cy-hero');
    const cyHeroContent = await getOrCreateStyle('cy-hero-content');
    const cyHeroSub = await getOrCreateStyle('cy-hero-subtitle');
    const cyInfoCard = await getOrCreateStyle('cy-info-card');
    const cyInfoItem = await getOrCreateStyle('cy-info-item');
    const cyInfoLabel = await getOrCreateStyle('cy-info-label');
    const cyInfoValue = await getOrCreateStyle('cy-info-value');
    const cyStatsGrid = await getOrCreateStyle('cy-stats-grid');
    const cyStatItem = await getOrCreateStyle('cy-stat-item');
    const cyStatNum = await getOrCreateStyle('cy-stat-num');
    const cyStatLabel = await getOrCreateStyle('cy-stat-label');
    const cyMb32 = await getOrCreateStyle('cy-mb-32');
    const cyMb64 = await getOrCreateStyle('cy-mb-64');
    const { body } = await createPageWithSlug(`${CITY.city} ADU`, CITY.slug, `ADU Construction in ${CITY.city} — Avorino`, `ADU construction in ${CITY.city}, Orange County. Fully permitted, designed, and built by Avorino.`);
    async function applyStyleProperties() {
        log('Setting shared style properties...');
        await setSharedStyleProps(s, v);
        await wait(1000);
        log('Setting page-specific style properties...');
        await clearAndSet(await freshStyle('cy-hero'), 'cy-hero', {
            'min-height': '50vh', 'display': 'flex', 'align-items': 'flex-end',
            'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
            'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
            'background-color': v['av-dark'], 'color': v['av-cream'],
            'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
        });
        await clearAndSet(await freshStyle('cy-hero-content'), 'cy-hero-content', {
            'position': 'relative', 'z-index': '2', 'max-width': '700px',
        });
        await clearAndSet(await freshStyle('cy-hero-subtitle'), 'cy-hero-subtitle', {
            'font-family': 'DM Sans', 'font-size': v['av-text-body'],
            'line-height': '1.9', 'opacity': '0.6', 'margin-top': '24px', 'color': v['av-cream'],
        });
        await wait(500);
        // Info card (regulations + permit)
        await clearAndSet(await freshStyle('cy-info-card'), 'cy-info-card', {
            'background-color': v['av-dark'], 'color': v['av-cream'],
            'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
            'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
            'padding-top': v['av-gap-md'], 'padding-bottom': v['av-gap-md'],
            'padding-left': '48px', 'padding-right': '48px',
            'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '40px',
        });
        await clearAndSet(await freshStyle('cy-info-item'), 'cy-info-item', {
            'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '8px',
        });
        await clearAndSet(await freshStyle('cy-info-label'), 'cy-info-label', {
            'font-family': 'DM Sans', 'font-size': v['av-text-label'],
            'letter-spacing': '0.3em', 'text-transform': 'uppercase', 'opacity': '0.4',
        });
        await clearAndSet(await freshStyle('cy-info-value'), 'cy-info-value', {
            'font-family': 'DM Sans', 'font-size': v['av-text-body'],
            'line-height': '1.7', 'color': v['av-cream'],
        });
        await wait(500);
        // Stats
        await clearAndSet(await freshStyle('cy-stats-grid'), 'cy-stats-grid', {
            'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr',
            'grid-column-gap': '64px', 'grid-row-gap': '64px', 'text-align': 'center',
        });
        await clearAndSet(await freshStyle('cy-stat-item'), 'cy-stat-item', {
            'display': 'flex', 'flex-direction': 'column', 'align-items': 'center', 'grid-row-gap': '24px',
        });
        await clearAndSet(await freshStyle('cy-stat-num'), 'cy-stat-num', {
            'font-family': 'DM Serif Display',
            'font-size': 'clamp(32px, 4vw, 56px)',
            'line-height': '1', 'letter-spacing': '-0.03em', 'font-weight': '400',
            'color': v['av-cream'],
        });
        await clearAndSet(await freshStyle('cy-stat-label'), 'cy-stat-label', {
            'font-family': 'DM Sans', 'font-size': v['av-text-label'],
            'letter-spacing': '0.25em', 'text-transform': 'uppercase',
            'opacity': '0.4', 'color': v['av-cream'],
        });
        await wait(500);
        // Utility
        await clearAndSet(await freshStyle('cy-mb-32'), 'cy-mb-32', { 'margin-bottom': v['av-gap-sm'] });
        await clearAndSet(await freshStyle('cy-mb-64'), 'cy-mb-64', { 'margin-bottom': v['av-gap-md'] });
        await applyCTAStyleProps(v);
    }
    // ═══════════════ BUILD ELEMENTS ═══════════════
    // SECTION 1: HERO
    log('Building Section 1: Hero...');
    const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
    hero.setTag('section');
    hero.setStyles([cyHero]);
    hero.setAttribute('id', 'cy-hero');
    const heroC = hero.append(webflow.elementPresets.DOM);
    heroC.setTag('div');
    heroC.setStyles([cyHeroContent]);
    const heroLabel = heroC.append(webflow.elementPresets.DOM);
    heroLabel.setTag('div');
    heroLabel.setStyles([s.label]);
    heroLabel.setAttribute('data-animate', 'fade-up');
    const heroLabelTxt = heroLabel.append(webflow.elementPresets.DOM);
    heroLabelTxt.setTag('div');
    heroLabelTxt.setTextContent(`// ${CITY.city}`);
    const heroH = heroC.append(webflow.elementPresets.DOM);
    heroH.setTag('h1');
    heroH.setStyles([s.headingXL]);
    heroH.setTextContent(`ADU Construction in ${CITY.city}`);
    heroH.setAttribute('data-animate', 'opacity-sweep');
    const heroSub = heroC.append(webflow.elementPresets.DOM);
    heroSub.setTag('p');
    heroSub.setStyles([cyHeroSub]);
    heroSub.setTextContent(CITY.overview);
    heroSub.setAttribute('data-animate', 'fade-up');
    await safeCall('append:hero', () => body.append(hero));
    // SECTION 2: REGULATIONS & PERMITTING (warm, 2-col: info card + overview card)
    log('Building Section 2: Regulations...');
    const infoSection = webflow.elementBuilder(webflow.elementPresets.DOM);
    infoSection.setTag('section');
    infoSection.setStyles([s.section, s.sectionWarm]);
    infoSection.setAttribute('id', 'cy-info');
    const infoGrid = infoSection.append(webflow.elementPresets.DOM);
    infoGrid.setTag('div');
    infoGrid.setStyles([s.grid2]);
    // Left: Regulations card
    const regsCard = infoGrid.append(webflow.elementPresets.DOM);
    regsCard.setTag('div');
    regsCard.setStyles([cyInfoCard]);
    regsCard.setAttribute('data-animate', 'fade-up');
    const regsItems = [
        { label: 'Lot Sizes', value: CITY.lots },
        { label: 'Regulations', value: CITY.regs },
        { label: 'Permitting', value: CITY.permit },
    ];
    regsItems.forEach(info => {
        const item = regsCard.append(webflow.elementPresets.DOM);
        item.setTag('div');
        item.setStyles([cyInfoItem]);
        const lbl = item.append(webflow.elementPresets.DOM);
        lbl.setTag('div');
        lbl.setStyles([cyInfoLabel]);
        lbl.setTextContent(info.label);
        const val = item.append(webflow.elementPresets.DOM);
        val.setTag('div');
        val.setStyles([cyInfoValue]);
        val.setTextContent(info.value);
    });
    // Right: Cost stats card
    const costCard = infoGrid.append(webflow.elementPresets.DOM);
    costCard.setTag('div');
    costCard.setStyles([cyInfoCard]);
    costCard.setAttribute('data-animate', 'fade-up');
    const costItems = [
        { label: 'Cost Range', value: CITY.cost },
        { label: 'Typical ADU Size', value: CITY.size },
    ];
    costItems.forEach(info => {
        const item = costCard.append(webflow.elementPresets.DOM);
        item.setTag('div');
        item.setStyles([cyInfoItem]);
        const lbl = item.append(webflow.elementPresets.DOM);
        lbl.setTag('div');
        lbl.setStyles([cyInfoLabel]);
        lbl.setTextContent(info.label);
        const val = item.append(webflow.elementPresets.DOM);
        val.setTag('div');
        val.setStyles([cyInfoValue]);
        val.setTextContent(info.value);
    });
    await safeCall('append:info', () => body.append(infoSection));
    // SECTION 3: CTA
    log('Building Section 3: CTA...');
    await buildCTASection(body, v, `Get your ${CITY.city} ADU estimate`, 'ADU Cost Calculator', '/adu-cost-estimator', 'Schedule a Meeting', '/schedule-a-meeting');
    await applyStyleProperties();
    log(`${CITY.city} ADU page built!`, 'success');
    await webflow.notify({ type: 'Success', message: `${CITY.city} ADU page created!` });
}
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
    try {
        await buildCityADUPage();
    }
    catch (err) {
        log(`Error: ${err.message || err}`, 'error');
        await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
    }
    finally {
        btn.disabled = false;
    }
});
