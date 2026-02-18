// ════════════════════════════════════════════════════════════════
// Avorino Builder — INVESTMENT PAGE TEMPLATE (v2 redesign)
// Hero with promoted stat + merged overview/process + CTA
// Change PAGE_INDEX below:
//   0 = Investment Opportunity (/investment)
//   1 = Flipping Opportunity (/flippingopportunity)
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, wait, safeCall, getAvorinVars, getOrCreateStyle, freshStyle, clearAndSet, createSharedStyles, setSharedStyleProps, createAllVariables, createPageWithSlug, buildCTASection, applyCTAStyleProps, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
// ═══ CHANGE THIS INDEX ═══
const PAGE_INDEX = 0;
const PAGES = [
    {
        slug: 'investment', name: 'Investment Opportunity',
        heroStat: '+30%', heroStatLabel: 'average property value increase with an ADU',
        desc: 'Adding an ADU to your property is one of the highest-ROI home improvements in California. Generate $2K–$4.5K+ in monthly rental income while building long-term equity.',
        title: 'Investment Opportunity — Avorino', seoDesc: 'ADU investment opportunities in Orange County. 5–12% annual ROI with rental income.',
    },
    {
        slug: 'flippingopportunity', name: 'Flipping Opportunity',
        heroStat: '+30%', heroStatLabel: 'average property value increase with a permitted ADU',
        desc: 'Properties with permitted ADUs sell for significantly more. Build an ADU to increase resale value, then sell the package for a premium.',
        title: 'Flipping Opportunity — Avorino', seoDesc: 'ADU flipping opportunities in Orange County. Increase property value with a permitted ADU.',
    },
];
const PAGE = PAGES[PAGE_INDEX];
// ── Content blocks (stacked text with dividers, replaces stats + process) ──
const BLOCKS = [
    {
        title: 'Find the right property',
        desc: 'Identify a property with ADU potential — lot size, zoning, and market demand. We help evaluate feasibility before you commit.',
    },
    {
        title: 'Design, permit, and build',
        desc: 'We handle all architecture, engineering, and city approvals. Construction is fully managed — you focus on the investment, not the jobsite.',
    },
    {
        title: 'Rent or sell for profit',
        desc: 'Rent for $2K–$4.5K+/month in cash flow, or sell the property with a permitted ADU for a premium. ADU investors in Orange County see 5–12% annual ROI.',
    },
];
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
document.getElementById('page-name').textContent = PAGE.name;
const headCodeEl = document.getElementById('head-code');
const footerCodeEl = document.getElementById('footer-code');
if (headCodeEl)
    headCodeEl.textContent = HEAD_CODE;
if (footerCodeEl)
    footerCodeEl.textContent = FOOTER_CODE;
async function buildInvestmentPage() {
    clearErrorLog();
    logDetail(`Starting ${PAGE.name} page build (v2)...`, 'info');
    const v = await getAvorinVars();
    log('Creating shared styles...');
    const s = await createSharedStyles();
    // ── Page-specific styles ──
    log('Creating investment-specific styles...');
    const invHero = await getOrCreateStyle('inv-hero');
    const invHeroContent = await getOrCreateStyle('inv-hero-content');
    const invHeroStat = await getOrCreateStyle('inv-hero-stat');
    const invHeroStatLabel = await getOrCreateStyle('inv-hero-stat-label');
    const invBlockTitle = await getOrCreateStyle('inv-block-title');
    const invBlockDesc = await getOrCreateStyle('inv-block-desc');
    const invOverview = await getOrCreateStyle('inv-overview');
    const { body } = await createPageWithSlug(PAGE.name, PAGE.slug, PAGE.title, PAGE.seoDesc);
    async function applyStyleProperties() {
        log('Setting shared style properties...');
        await setSharedStyleProps(s, v);
        await wait(1000);
        log('Setting investment-specific style properties...');
        // Hero: centered, dark, with promoted stat
        await clearAndSet(await freshStyle('inv-hero'), 'inv-hero', {
            'min-height': '70vh', 'display': 'flex', 'align-items': 'center', 'justify-content': 'center',
            'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
            'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
            'background-color': v['av-dark'], 'color': v['av-cream'],
            'text-align': 'center',
        });
        await clearAndSet(await freshStyle('inv-hero-content'), 'inv-hero-content', {
            'max-width': '800px',
        });
        await clearAndSet(await freshStyle('inv-hero-stat'), 'inv-hero-stat', {
            'font-family': 'DM Serif Display',
            'font-size': 'clamp(64px, 8vw, 120px)',
            'line-height': '1', 'letter-spacing': '-0.03em', 'font-weight': '400',
            'margin-bottom': '16px',
        });
        await clearAndSet(await freshStyle('inv-hero-stat-label'), 'inv-hero-stat-label', {
            'font-family': 'DM Sans', 'font-size': v['av-text-body'],
            'line-height': '1.7', 'opacity': '0.5', 'margin-bottom': '48px',
        });
        await wait(500);
        // Overview paragraph
        await clearAndSet(await freshStyle('inv-overview'), 'inv-overview', {
            'font-family': 'DM Sans', 'font-size': v['av-text-body'],
            'line-height': '1.9', 'opacity': '0.6', 'max-width': '700px',
            'margin-left': 'auto', 'margin-right': 'auto', 'text-align': 'center',
            'margin-bottom': '64px',
        });
        // Content blocks (stacked text with dividers)
        await clearAndSet(await freshStyle('inv-block-title'), 'inv-block-title', {
            'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
            'line-height': '1.12', 'font-weight': '400', 'margin-bottom': '16px',
        });
        await clearAndSet(await freshStyle('inv-block-desc'), 'inv-block-desc', {
            'font-family': 'DM Sans', 'font-size': v['av-text-body'],
            'line-height': '1.9', 'opacity': '0.6',
        });
        await wait(500);
        await applyCTAStyleProps(v);
    }
    // ═══════════════ BUILD ELEMENTS ═══════════════
    // SECTION 1: HERO (dark, centered, promoted stat)
    log('Building Section 1: Hero...');
    const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
    hero.setTag('section');
    hero.setStyles([invHero]);
    hero.setAttribute('id', 'inv-hero');
    const heroC = hero.append(webflow.elementPresets.DOM);
    heroC.setTag('div');
    heroC.setStyles([invHeroContent]);
    const heroLabel = heroC.append(webflow.elementPresets.DOM);
    heroLabel.setTag('div');
    heroLabel.setStyles([s.label]);
    heroLabel.setAttribute('data-animate', 'fade-up');
    const heroLabelTxt = heroLabel.append(webflow.elementPresets.DOM);
    heroLabelTxt.setTag('div');
    heroLabelTxt.setTextContent(`// ${PAGE.name}`);
    // Promoted stat as hero visual
    const heroStat = heroC.append(webflow.elementPresets.DOM);
    heroStat.setTag('div');
    heroStat.setStyles([invHeroStat]);
    heroStat.setTextContent(PAGE.heroStat);
    heroStat.setAttribute('data-animate', 'blur-focus');
    const heroStatLabel = heroC.append(webflow.elementPresets.DOM);
    heroStatLabel.setTag('div');
    heroStatLabel.setStyles([invHeroStatLabel]);
    heroStatLabel.setTextContent(PAGE.heroStatLabel);
    heroStatLabel.setAttribute('data-animate', 'fade-up');
    const heroH = heroC.append(webflow.elementPresets.DOM);
    heroH.setTag('h1');
    heroH.setStyles([s.headingLG]);
    heroH.setTextContent(PAGE.name);
    heroH.setAttribute('data-animate', 'word-stagger-elastic');
    await safeCall('append:hero', () => body.append(hero));
    logDetail('Section 1: Hero appended', 'ok');
    // SECTION 2: OVERVIEW + STEPS (cream bg, stacked text blocks with dividers)
    log('Building Section 2: Overview + Steps...');
    const mainSection = webflow.elementBuilder(webflow.elementPresets.DOM);
    mainSection.setTag('section');
    mainSection.setStyles([s.section, s.sectionCream]);
    mainSection.setAttribute('id', 'inv-main');
    // Overview paragraph (centered)
    const overP = mainSection.append(webflow.elementPresets.DOM);
    overP.setTag('p');
    overP.setStyles([invOverview]);
    overP.setTextContent(PAGE.desc);
    overP.setAttribute('data-animate', 'fade-up');
    // Stacked text blocks with dividers
    BLOCKS.forEach((block, i) => {
        if (i > 0) {
            const div = mainSection.append(webflow.elementPresets.DOM);
            div.setTag('div');
            div.setStyles([s.divider]);
        }
        const el = mainSection.append(webflow.elementPresets.DOM);
        el.setTag('div');
        el.setAttribute('data-animate', 'fade-up');
        const title = el.append(webflow.elementPresets.DOM);
        title.setTag('h3');
        title.setStyles([invBlockTitle]);
        title.setTextContent(block.title);
        const desc = el.append(webflow.elementPresets.DOM);
        desc.setTag('p');
        desc.setStyles([invBlockDesc]);
        desc.setTextContent(block.desc);
    });
    await safeCall('append:main', () => body.append(mainSection));
    logDetail('Section 2: Overview + Steps appended', 'ok');
    // SECTION 3: CTA
    log('Building Section 3: CTA...');
    await buildCTASection(body, v, 'Get started', 'Schedule a Meeting', '/schedule-a-meeting', 'View Financing', '/financing');
    await applyStyleProperties();
    log(`${PAGE.name} page built!`, 'success');
    await webflow.notify({ type: 'Success', message: `${PAGE.name} page created!` });
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
        await buildInvestmentPage();
    }
    catch (err) {
        log(`Error: ${err.message || err}`, 'error');
        await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
    }
    finally {
        btn.disabled = false;
    }
});
