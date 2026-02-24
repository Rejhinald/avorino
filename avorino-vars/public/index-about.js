// ════════════════════════════════════════════════════════════════
// Avorino Builder — ABOUT PAGE
// Rename this to index.ts to build the About page.
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, wait, safeCall, getAvorinVars, getOrCreateStyle, freshStyle, clearAndSet, createSharedStyles, setSharedStyleProps, createAllVariables, createPageWithSlug, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
// ── Page config ──
const PAGE_NAME = 'About';
const PAGE_SLUG = 'about';
const PAGE_TITLE = 'About Avorino — Custom Home & ADU Builder in Orange County';
const PAGE_DESC = 'Learn about Avorino, a custom home and ADU builder in Orange County since 2023. Exceptional craftsmanship, innovative design, and unwavering commitment to quality.';
const HEAD_CODE = [
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3bacd73/avorino-about-head.css">',
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3bacd73/avorino-responsive.css">',
    CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
    '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3bacd73/avorino-about-footer.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3bacd73/avorino-about-mv3d.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3bacd73/avorino-about-values3d.js"><\/script>',
    CALENDLY_JS,
].join('\n');
// ── Update panel UI ──
document.getElementById('page-name').textContent = PAGE_NAME;
const headCodeEl = document.getElementById('head-code');
const footerCodeEl = document.getElementById('footer-code');
if (headCodeEl)
    headCodeEl.textContent = HEAD_CODE;
if (footerCodeEl)
    footerCodeEl.textContent = FOOTER_CODE;
// ── Build function ──
async function buildAboutPage() {
    clearErrorLog();
    logDetail('Starting About page build...', 'info');
    const v = await getAvorinVars();
    logDetail('Loaded Avorino variable collection', 'ok');
    log('Creating shared styles...');
    const s = await createSharedStyles();
    logDetail('Shared styles done', 'ok');
    // Page-specific styles
    log('Creating page-specific styles...');
    const heroSection = await getOrCreateStyle('about-hero');
    const heroOverlay = await getOrCreateStyle('about-hero-overlay');
    const heroContent = await getOrCreateStyle('about-hero-content');
    const heroSubtitle = await getOrCreateStyle('about-hero-subtitle');
    const storyBody = await getOrCreateStyle('about-story-body');
    const storyImg = await getOrCreateStyle('about-story-img');
    const maxWidth520 = await getOrCreateStyle('av-max-520');
    const maxWidth580 = await getOrCreateStyle('av-max-580');
    const mb48 = await getOrCreateStyle('av-mb-48');
    const mb64 = await getOrCreateStyle('av-mb-64');
    const mb96 = await getOrCreateStyle('av-mb-96');
    const labelLine = await getOrCreateStyle('about-label-line');
    // Stats — flip-clock styles
    const statsGrid = await getOrCreateStyle('about-stats-grid');
    const statItem = await getOrCreateStyle('about-stat-item');
    const statDigits = await getOrCreateStyle('about-stat-digits');
    const flipCard = await getOrCreateStyle('about-flip-card');
    const flipCardInner = await getOrCreateStyle('about-flip-card-inner');
    const flipCardTop = await getOrCreateStyle('about-flip-card-top');
    const flipCardBottom = await getOrCreateStyle('about-flip-card-bottom');
    const statSuffix = await getOrCreateStyle('about-stat-suffix');
    const statSeparator = await getOrCreateStyle('about-stat-separator');
    const statLabel = await getOrCreateStyle('about-stat-label');
    // Values — grid + canvas
    const valuesCanvasWrap = await getOrCreateStyle('about-values-canvas-wrap');
    const valuesGrid = await getOrCreateStyle('about-values-grid');
    const valuesCard = await getOrCreateStyle('about-values-card');
    const valueNumber = await getOrCreateStyle('about-value-num');
    const valueTitle = await getOrCreateStyle('about-value-title');
    const valueDesc = await getOrCreateStyle('about-value-desc');
    // CTA — custom build
    const ctaSubtitle = await getOrCreateStyle('av-cta-subtitle');
    const ctaSection = await getOrCreateStyle('av-cta');
    const ctaContainer = await getOrCreateStyle('about-cta-container');
    const ctaBg = await getOrCreateStyle('av-cta-bg');
    const ctaContent = await getOrCreateStyle('av-cta-content');
    const ctaHeading = await getOrCreateStyle('av-cta-heading');
    const ctaBtn = await getOrCreateStyle('av-cta-btn');
    // Create page
    const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);
    // Style properties — applied after all elements are built
    async function applyStyleProperties() {
        log('Setting shared style properties...');
        await setSharedStyleProps(s, v);
        logDetail('Shared style properties set', 'ok');
        await wait(1000);
        log('Setting page-specific style properties...');
        await clearAndSet(await freshStyle('about-hero'), 'about-hero', {
            'min-height': '60vh', 'display': 'flex', 'align-items': 'flex-end',
            'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
            'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
            'background-color': v['av-dark'], 'color': v['av-cream'],
            'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
        });
        await clearAndSet(await freshStyle('about-hero-overlay'), 'about-hero-overlay', {
            'position': 'absolute', 'top': '0px', 'left': '0px', 'right': '0px', 'bottom': '0px',
            'background-image': 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
        });
        await clearAndSet(await freshStyle('about-hero-content'), 'about-hero-content', {
            'position': 'relative', 'z-index': '2', 'max-width': '800px',
        });
        await clearAndSet(await freshStyle('about-hero-subtitle'), 'about-hero-subtitle', {
            'font-family': 'DM Sans', 'font-size': v['av-text-body'],
            'line-height': '1.9', 'opacity': '0.6', 'margin-top': '24px', 'color': v['av-cream'],
        });
        await wait(500);
        await clearAndSet(await freshStyle('about-story-body'), 'about-story-body', {
            'display': 'flex', 'flex-direction': 'column', 'justify-content': 'flex-end', 'padding-top': '8px',
        });
        await clearAndSet(await freshStyle('about-story-img'), 'about-story-img', {
            'width': '100%', 'height': '100%', 'min-height': '400px', 'background-color': v['av-dark-06'],
            'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
            'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
        });
        await clearAndSet(await freshStyle('av-max-520'), 'av-max-520', { 'max-width': '520px' });
        await clearAndSet(await freshStyle('av-max-580'), 'av-max-580', { 'max-width': '580px' });
        await clearAndSet(await freshStyle('av-mb-48'), 'av-mb-48', { 'margin-bottom': '48px' });
        await clearAndSet(await freshStyle('av-mb-64'), 'av-mb-64', { 'margin-bottom': v['av-gap-md'] });
        await clearAndSet(await freshStyle('av-mb-96'), 'av-mb-96', { 'margin-bottom': v['av-gap-lg'] });
        await wait(500);
        await clearAndSet(await freshStyle('about-label-line'), 'about-label-line', { 'flex-grow': '1', 'height': '1px', 'background-color': v['av-dark-15'] });
        await wait(500);
        // Stats — flip-clock styles
        await clearAndSet(await freshStyle('about-stats-grid'), 'about-stats-grid', {
            'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr 1fr', 'grid-column-gap': '64px', 'grid-row-gap': '64px',
        });
        await clearAndSet(await freshStyle('about-stat-item'), 'about-stat-item', {
            'display': 'flex', 'flex-direction': 'column', 'align-items': 'center', 'grid-row-gap': '24px', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
        });
        await clearAndSet(await freshStyle('about-stat-digits'), 'about-stat-digits', {
            'display': 'flex', 'align-items': 'center', 'grid-column-gap': '6px',
        });
        await clearAndSet(await freshStyle('about-flip-card'), 'about-flip-card', {
            'position': 'relative', 'width': '72px', 'height': '96px',
        });
        await clearAndSet(await freshStyle('about-flip-card-inner'), 'about-flip-card-inner', {
            'position': 'relative', 'width': '100%', 'height': '100%',
        });
        await clearAndSet(await freshStyle('about-flip-card-top'), 'about-flip-card-top', {
            'font-family': 'DM Serif Display', 'font-weight': '400',
            'position': 'absolute', 'width': '100%', 'height': '50%',
            'overflow-x': 'hidden', 'overflow-y': 'hidden',
            'display': 'flex', 'justify-content': 'center', 'align-items': 'flex-start',
            'font-size': '48px', 'color': v['av-cream'], 'background-color': '#1a1a1a',
            'border-top-left-radius': '6px', 'border-top-right-radius': '6px',
            'border-bottom-left-radius': '0px', 'border-bottom-right-radius': '0px',
        });
        await clearAndSet(await freshStyle('about-flip-card-bottom'), 'about-flip-card-bottom', {
            'font-family': 'DM Serif Display', 'font-weight': '400',
            'position': 'absolute', 'width': '100%', 'height': '50%',
            'overflow-x': 'hidden', 'overflow-y': 'hidden',
            'display': 'flex', 'justify-content': 'center', 'align-items': 'flex-end',
            'font-size': '48px', 'color': v['av-cream'], 'background-color': '#1a1a1a',
            'bottom': '0px',
            'border-top-left-radius': '0px', 'border-top-right-radius': '0px',
            'border-bottom-left-radius': '6px', 'border-bottom-right-radius': '6px',
        });
        await clearAndSet(await freshStyle('about-stat-suffix'), 'about-stat-suffix', {
            'font-family': 'DM Serif Display', 'font-weight': '400',
            'font-size': '36px', 'color': v['av-cream'], 'opacity': '0', 'margin-left': '4px',
        });
        await clearAndSet(await freshStyle('about-stat-separator'), 'about-stat-separator', {
            'font-family': 'DM Serif Display', 'font-weight': '400',
            'font-size': '36px', 'color': v['av-cream'], 'opacity': '0',
            'margin-bottom': '12px',
        });
        await clearAndSet(await freshStyle('about-stat-label'), 'about-stat-label', {
            'font-family': 'DM Sans', 'font-size': '11px', 'letter-spacing': '0.25em', 'text-transform': 'uppercase', 'opacity': '0.55', 'text-align': 'center', 'color': v['av-cream'],
        });
        await wait(500);
        // Values — grid + canvas
        await clearAndSet(await freshStyle('about-values-canvas-wrap'), 'about-values-canvas-wrap', {
            'position': 'absolute', 'top': '0px', 'left': '0px', 'width': '100%', 'height': '100%', 'z-index': '1', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
        });
        await clearAndSet(await freshStyle('about-values-grid'), 'about-values-grid', {
            'display': 'grid', 'grid-template-columns': '1fr 1fr', 'grid-column-gap': '32px', 'grid-row-gap': '32px',
            'position': 'relative', 'z-index': '2',
        });
        await clearAndSet(await freshStyle('about-values-card'), 'about-values-card', {
            'background-color': 'rgba(17,17,17,0.85)', 'color': v['av-cream'],
            'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
            'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
            'padding-top': '48px', 'padding-bottom': '48px',
            'padding-left': '40px', 'padding-right': '40px',
            'position': 'relative', 'z-index': '2',
        });
        await clearAndSet(await freshStyle('about-value-num'), 'about-value-num', {
            'font-family': 'DM Serif Display', 'font-size': '56px',
            'line-height': '1', 'opacity': '0.22', 'margin-bottom': '24px', 'color': v['av-cream'],
        });
        await clearAndSet(await freshStyle('about-value-title'), 'about-value-title', {
            'font-family': 'DM Serif Display', 'font-size': '24px',
            'line-height': '1.2', 'font-weight': '400', 'margin-bottom': '16px', 'color': v['av-cream'],
        });
        await clearAndSet(await freshStyle('about-value-desc'), 'about-value-desc', {
            'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
            'line-height': '1.7', 'opacity': '0.5', 'color': v['av-cream'],
        });
        await wait(500);
        await clearAndSet(await freshStyle('av-cta-subtitle'), 'av-cta-subtitle', {
            'font-family': 'DM Sans', 'font-size': '12px', 'letter-spacing': '0.3em',
            'text-transform': 'uppercase', 'opacity': '0.4', 'margin-bottom': '32px', 'color': v['av-cream'],
        });
        await wait(500);
        // CTA styles
        await clearAndSet(await freshStyle('av-cta'), 'av-cta', {
            'padding-top': v['av-page-pad'], 'padding-bottom': v['av-page-pad'],
            'padding-left': v['av-page-pad'], 'padding-right': v['av-page-pad'],
        });
        await clearAndSet(await freshStyle('about-cta-container'), 'about-cta-container', {
            'background-color': v['av-dark'], 'color': v['av-cream'],
            'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
            'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
            'min-height': '56vh',
            'padding-top': v['av-gap-lg'], 'padding-bottom': v['av-gap-lg'],
            'padding-left': v['av-gap-md'], 'padding-right': v['av-gap-md'],
            'display': 'flex', 'flex-direction': 'column', 'align-items': 'center', 'justify-content': 'center',
            'text-align': 'center', 'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
        });
        await clearAndSet(await freshStyle('av-cta-bg'), 'av-cta-bg', {
            'position': 'absolute', 'top': '0px', 'left': '0px', 'right': '0px', 'bottom': '0px',
            'opacity': '0.2',
        });
        await clearAndSet(await freshStyle('av-cta-content'), 'av-cta-content', {
            'position': 'relative', 'z-index': '2',
            'padding-top': '64px', 'padding-bottom': '64px',
            'padding-left': '64px', 'padding-right': '64px',
        });
        await clearAndSet(await freshStyle('av-cta-heading'), 'av-cta-heading', {
            'font-family': 'DM Serif Display', 'font-size': v['av-text-h2'],
            'line-height': '1.08', 'letter-spacing': '-0.02em', 'font-weight': '400',
            'margin-bottom': v['av-gap-sm'], 'max-width': '10em', 'color': v['av-cream'],
            'margin-left': 'auto', 'margin-right': 'auto',
        });
        await clearAndSet(await freshStyle('av-cta-btn'), 'av-cta-btn', {
            'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
            'font-weight': '500', 'letter-spacing': '0.04em',
            'display': 'inline-flex', 'align-items': 'center', 'grid-column-gap': '12px',
            'color': v['av-dark'], 'background-color': v['av-cream'],
            'padding-top': v['av-btn-pad-y'], 'padding-bottom': v['av-btn-pad-y'],
            'padding-left': v['av-btn-pad-x'], 'padding-right': v['av-btn-pad-x'],
            'border-top-left-radius': v['av-radius-pill'], 'border-top-right-radius': v['av-radius-pill'],
            'border-bottom-left-radius': v['av-radius-pill'], 'border-bottom-right-radius': v['av-radius-pill'],
            'text-decoration': 'none',
        });
    }
    // ═══════════════ BUILD ELEMENTS ═══════════════
    // HERO
    log('Building Hero...');
    const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
    hero.setTag('section');
    hero.setStyles([heroSection]);
    hero.setAttribute('id', 'about-hero');
    const overlay = hero.append(webflow.elementPresets.DOM);
    overlay.setTag('div');
    overlay.setStyles([heroOverlay]);
    const heroC = hero.append(webflow.elementPresets.DOM);
    heroC.setTag('div');
    heroC.setStyles([heroContent]);
    const heroH = heroC.append(webflow.elementPresets.DOM);
    heroH.setTag('h1');
    heroH.setStyles([s.headingXL]);
    heroH.setTextContent('About Avorino');
    heroH.setAttribute('data-animate', 'char-cascade');
    const heroSub = heroC.append(webflow.elementPresets.DOM);
    heroSub.setTag('p');
    heroSub.setStyles([heroSubtitle]);
    heroSub.setTextContent('Custom home and ADU builder in Orange County since 2023');
    heroSub.setAttribute('data-animate', 'fade-up');
    await safeCall('append:hero', () => body.append(hero));
    // STORY
    log('Building Story...');
    const story = webflow.elementBuilder(webflow.elementPresets.DOM);
    story.setTag('section');
    story.setStyles([s.section, s.sectionWarm]);
    story.setAttribute('id', 'about-story');
    const storyLbl = story.append(webflow.elementPresets.DOM);
    storyLbl.setTag('div');
    storyLbl.setStyles([s.label, mb64]);
    storyLbl.setAttribute('data-animate', 'fade-up');
    const storyLblTxt = storyLbl.append(webflow.elementPresets.DOM);
    storyLblTxt.setTag('div');
    storyLblTxt.setTextContent('Our Story');
    const storyLblLine = storyLbl.append(webflow.elementPresets.DOM);
    storyLblLine.setTag('div');
    storyLblLine.setStyles([labelLine]);
    const storyGrid = story.append(webflow.elementPresets.DOM);
    storyGrid.setTag('div');
    storyGrid.setStyles([s.grid2]);
    const storyLeft = storyGrid.append(webflow.elementPresets.DOM);
    storyLeft.setTag('div');
    storyLeft.setAttribute('data-animate', 'fade-up');
    const storyImgEl = storyLeft.append(webflow.elementPresets.DOM);
    storyImgEl.setTag('div');
    storyImgEl.setStyles([storyImg]);
    const storyRight = storyGrid.append(webflow.elementPresets.DOM);
    storyRight.setTag('div');
    storyRight.setStyles([storyBody]);
    const storyH = storyRight.append(webflow.elementPresets.DOM);
    storyH.setTag('h2');
    storyH.setStyles([s.headingLG, maxWidth580, mb48]);
    storyH.setTextContent('We redefine the art of construction');
    storyH.setAttribute('data-animate', 'line-wipe');
    const storyP = storyRight.append(webflow.elementPresets.DOM);
    storyP.setTag('p');
    storyP.setStyles([s.body, s.bodyMuted, maxWidth520, mb48]);
    storyP.setTextContent('Avorino is a custom home and an ADU builder in Orange County that takes pride in its exceptional customer service. With a friendly and professional approach, Avorino actively involves clients throughout the process, ensuring their unique needs are met with utmost care. Our unwavering commitment to quality is evident in every detail, resulting in remarkable outcomes that exceed expectations. Avorino stands out by embracing innovation, leveraging cutting-edge technologies and sustainable practices to deliver exceptional results. Our in-house crew is capable of handling every aspect of a project from design to execution.');
    storyP.setAttribute('data-animate', 'opacity-sweep');
    await safeCall('append:story', () => body.append(story));
    // STATS — Flip-Clock
    log('Building Stats (flip-clock)...');
    const stats = webflow.elementBuilder(webflow.elementPresets.DOM);
    stats.setTag('section');
    stats.setStyles([s.section, s.sectionDark]);
    stats.setAttribute('id', 'about-stats');
    const statsG = stats.append(webflow.elementPresets.DOM);
    statsG.setTag('div');
    statsG.setStyles([statsGrid]);
    const statsData = [
        { digits: [1, 5, 0], suffix: '+', label: 'Projects Completed' },
        { digits: [3, 0], suffix: '+', label: 'Orange County Cities' },
        { digits: [4, 9], suffix: '', separator: '.', label: 'Yelp Rating' },
        { digits: [1, 0, 0], suffix: '%', label: 'Licensed & Insured' },
    ];
    statsData.forEach(stat => {
        const item = statsG.append(webflow.elementPresets.DOM);
        item.setTag('div');
        item.setStyles([statItem]);
        item.setAttribute('data-animate', 'flip-clock');
        item.setAttribute('data-target', stat.digits.join(''));
        item.setAttribute('data-suffix', stat.suffix);
        if (stat.separator)
            item.setAttribute('data-separator', stat.separator);
        const digitsWrap = item.append(webflow.elementPresets.DOM);
        digitsWrap.setTag('div');
        digitsWrap.setStyles([statDigits]);
        stat.digits.forEach((digit, di) => {
            // Insert separator before second digit if needed (e.g. 4.9)
            if (stat.separator && di === 1) {
                const sep = digitsWrap.append(webflow.elementPresets.DOM);
                sep.setTag('span');
                sep.setStyles([statSeparator]);
                sep.setTextContent(stat.separator);
                sep.setAttribute('data-el', 'stat-separator');
            }
            const card = digitsWrap.append(webflow.elementPresets.DOM);
            card.setTag('div');
            card.setStyles([flipCard]);
            card.setAttribute('data-el', 'flip-card');
            card.setAttribute('data-digit', String(digit));
            const inner = card.append(webflow.elementPresets.DOM);
            inner.setTag('div');
            inner.setStyles([flipCardInner]);
            inner.setAttribute('data-el', 'flip-card-inner');
            const top = inner.append(webflow.elementPresets.DOM);
            top.setTag('div');
            top.setStyles([flipCardTop]);
            top.setAttribute('data-el', 'flip-card-top');
            const topSpan = top.append(webflow.elementPresets.DOM);
            topSpan.setTag('span');
            topSpan.setTextContent('0');
            const bottom = inner.append(webflow.elementPresets.DOM);
            bottom.setTag('div');
            bottom.setStyles([flipCardBottom]);
            bottom.setAttribute('data-el', 'flip-card-bottom');
            const bottomSpan = bottom.append(webflow.elementPresets.DOM);
            bottomSpan.setTag('span');
            bottomSpan.setTextContent('0');
        });
        if (stat.suffix) {
            const suf = digitsWrap.append(webflow.elementPresets.DOM);
            suf.setTag('span');
            suf.setStyles([statSuffix]);
            suf.setTextContent(stat.suffix);
            suf.setAttribute('data-el', 'stat-suffix');
        }
        const lbl = item.append(webflow.elementPresets.DOM);
        lbl.setTag('div');
        lbl.setStyles([statLabel]);
        lbl.setTextContent(stat.label);
        lbl.setAttribute('data-animate', 'scramble');
    });
    await safeCall('append:stats', () => body.append(stats));
    // MISSION & VISION — Cinematic scroll-lock (no cards, full-bleed panels)
    log('Building Mission & Vision...');
    const mv = webflow.elementBuilder(webflow.elementPresets.DOM);
    mv.setTag('section');
    mv.setStyles([s.section, s.sectionWarm]);
    mv.setAttribute('id', 'about-mission-vision');
    // Three.js canvas wrapper (right half — populated by mv3d.js)
    const mvCanvasWrap = mv.append(webflow.elementPresets.DOM);
    mvCanvasWrap.setTag('div');
    mvCanvasWrap.setAttribute('class', 'mv-canvas-wrap');
    // Phrase layer — big text that fills viewport first
    const mvPhraseLayer = mv.append(webflow.elementPresets.DOM);
    mvPhraseLayer.setTag('div');
    mvPhraseLayer.setAttribute('class', 'mv-phrase-layer');
    const mvPhrase = mvPhraseLayer.append(webflow.elementPresets.DOM);
    mvPhrase.setTag('div');
    mvPhrase.setAttribute('class', 'mv-phrase');
    mvPhrase.setAttribute('data-mv-phrase', '');
    mvPhrase.setTextContent('Bringing visionary dreams to life');
    // Mission panel
    const missionPanel = mv.append(webflow.elementPresets.DOM);
    missionPanel.setTag('div');
    missionPanel.setAttribute('class', 'mv-panel');
    missionPanel.setAttribute('data-mv', 'mission');
    const mLabel = missionPanel.append(webflow.elementPresets.DOM);
    mLabel.setTag('div');
    mLabel.setAttribute('class', 'mv-panel-label');
    mLabel.setTextContent('Mission');
    const mHeading = missionPanel.append(webflow.elementPresets.DOM);
    mHeading.setTag('h3');
    mHeading.setAttribute('class', 'mv-panel-heading');
    mHeading.setTextContent('Bringing visionary dreams to life');
    const mLine = missionPanel.append(webflow.elementPresets.DOM);
    mLine.setTag('div');
    mLine.setAttribute('class', 'mv-panel-line');
    const mBody = missionPanel.append(webflow.elementPresets.DOM);
    mBody.setTag('p');
    mBody.setAttribute('class', 'mv-panel-body');
    mBody.setTextContent('Our mission is to bring visionary dreams to life through strong communication and transformative construction. As builders, we are committed to delivering exceptional projects that exceed expectations, inspire awe, and leave a lasting impact. With a focus on collaboration and innovation, we strive to create spaces that not only fulfill our clients\' visions but also enhance the lives of those who experience them.');
    // Vision panel
    const visionPanel = mv.append(webflow.elementPresets.DOM);
    visionPanel.setTag('div');
    visionPanel.setAttribute('class', 'mv-panel');
    visionPanel.setAttribute('data-mv', 'vision');
    const vLabel = visionPanel.append(webflow.elementPresets.DOM);
    vLabel.setTag('div');
    vLabel.setAttribute('class', 'mv-panel-label');
    vLabel.setTextContent('Vision');
    const vHeading = visionPanel.append(webflow.elementPresets.DOM);
    vHeading.setTag('h3');
    vHeading.setAttribute('class', 'mv-panel-heading');
    vHeading.setTextContent('The catalyst for transformation');
    const vLine = visionPanel.append(webflow.elementPresets.DOM);
    vLine.setTag('div');
    vLine.setAttribute('class', 'mv-panel-line');
    const vBody = visionPanel.append(webflow.elementPresets.DOM);
    vBody.setTag('p');
    vBody.setAttribute('class', 'mv-panel-body');
    vBody.setTextContent('Our vision is to be the catalyst for transformation in the construction industry. We aspire to be known as the go-to builders for visionary projects, where dreams become reality. Through our commitment to strong communication, we aim to foster deep understanding and collaboration with our clients, partners, and communities.');
    await safeCall('append:mission-vision', () => body.append(mv));
    // VALUES — Three.js background + 2×2 grid
    log('Building Values...');
    const vals = webflow.elementBuilder(webflow.elementPresets.DOM);
    vals.setTag('section');
    vals.setStyles([s.section, s.sectionDark]);
    vals.setAttribute('id', 'about-values');
    const valsLbl = vals.append(webflow.elementPresets.DOM);
    valsLbl.setTag('div');
    valsLbl.setStyles([s.label, mb64]);
    valsLbl.setAttribute('data-animate', 'fade-up');
    const valsLblTxt = valsLbl.append(webflow.elementPresets.DOM);
    valsLblTxt.setTag('div');
    valsLblTxt.setTextContent('Our Values');
    const valsLblLine = valsLbl.append(webflow.elementPresets.DOM);
    valsLblLine.setTag('div');
    valsLblLine.setStyles([labelLine]);
    const valsH = vals.append(webflow.elementPresets.DOM);
    valsH.setTag('h2');
    valsH.setStyles([s.headingLG, mb96]);
    valsH.setTextContent('What We Stand For');
    valsH.setAttribute('data-animate', 'line-wipe');
    // Canvas wrapper for Three.js (absolute positioned behind cards)
    const canvasWrap = vals.append(webflow.elementPresets.DOM);
    canvasWrap.setTag('div');
    canvasWrap.setStyles([valuesCanvasWrap]);
    canvasWrap.setAttribute('data-values-canvas', '');
    // Values grid — 2×2
    const vGrid = vals.append(webflow.elementPresets.DOM);
    vGrid.setTag('div');
    vGrid.setStyles([valuesGrid]);
    vGrid.setAttribute('data-animate', 'fade-up-stagger');
    const valuesData = [
        { title: 'Integrity', desc: 'Nurturing honesty, transparency, and ethical practices in everything we do. We build trust through every interaction.' },
        { title: 'Innovation', desc: 'Embracing creativity and pushing the boundaries of construction with cutting-edge technologies and sustainable practices.' },
        { title: 'Excellence', desc: 'Striving for continuous improvement and delivering outstanding results in every project we undertake.' },
        { title: 'People-Oriented', desc: 'Putting people at the center of our business, valuing our team members, clients, and community.' },
    ];
    valuesData.forEach((val, i) => {
        const card = vGrid.append(webflow.elementPresets.DOM);
        card.setTag('div');
        card.setStyles([valuesCard]);
        const n = card.append(webflow.elementPresets.DOM);
        n.setTag('div');
        n.setStyles([valueNumber]);
        n.setTextContent(String(i + 1).padStart(2, '0'));
        const t = card.append(webflow.elementPresets.DOM);
        t.setTag('h3');
        t.setStyles([valueTitle]);
        t.setTextContent(val.title);
        const d = card.append(webflow.elementPresets.DOM);
        d.setTag('p');
        d.setStyles([valueDesc]);
        d.setTextContent(val.desc);
    });
    await safeCall('append:values', () => body.append(vals));
    // CTA — Custom build with parallax bg + arrow button
    log('Building CTA...');
    const cta = webflow.elementBuilder(webflow.elementPresets.DOM);
    cta.setTag('section');
    cta.setStyles([ctaSection]);
    const ctaC = cta.append(webflow.elementPresets.DOM);
    ctaC.setTag('div');
    ctaC.setStyles([ctaContainer]);
    ctaC.setAttribute('class', 'about-cta-container');
    const ctaBgEl = ctaC.append(webflow.elementPresets.DOM);
    ctaBgEl.setTag('div');
    ctaBgEl.setStyles([ctaBg]);
    ctaBgEl.setAttribute('data-animate', 'parallax-depth');
    const ctaContentEl = ctaC.append(webflow.elementPresets.DOM);
    ctaContentEl.setTag('div');
    ctaContentEl.setStyles([ctaContent]);
    const ctaSub = ctaContentEl.append(webflow.elementPresets.DOM);
    ctaSub.setTag('div');
    ctaSub.setStyles([ctaSubtitle]);
    ctaSub.setTextContent('Ready to Begin?');
    ctaSub.setAttribute('data-animate', 'fade-up');
    const ctaH = ctaContentEl.append(webflow.elementPresets.DOM);
    ctaH.setTag('h2');
    ctaH.setStyles([ctaHeading]);
    ctaH.setTextContent("Let's build something remarkable");
    ctaH.setAttribute('data-animate', 'word-stagger-elastic');
    const ctaBtnEl = ctaContentEl.append(webflow.elementPresets.DOM);
    ctaBtnEl.setTag('a');
    ctaBtnEl.setStyles([ctaBtn]);
    ctaBtnEl.setTextContent('Schedule a Free Call \u2192');
    ctaBtnEl.setAttribute('href', '/schedule-a-meeting');
    ctaBtnEl.setAttribute('data-magnetic', '');
    ctaBtnEl.setAttribute('data-animate', 'fade-up');
    await safeCall('append:cta', () => body.append(cta));
    // APPLY STYLES
    await applyStyleProperties();
    log('About page built! Add custom code manually (see instructions below).', 'success');
    await webflow.notify({ type: 'Success', message: 'About page created! Now add custom code manually — see extension panel.' });
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
        await buildAboutPage();
    }
    catch (err) {
        log(`Error: ${err.message || err}`, 'error');
        await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
    }
    finally {
        btn.disabled = false;
    }
});
